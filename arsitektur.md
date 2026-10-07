# Arsitektur Sistem Hybit Wallet 🏛️

Dokumen ini mendeskripsikan secara komprehensif arsitektur teknis, model keamanan kriptografi, lapisan abstraksi akun, integrasi multi-chain, dan alur data pada aplikasi **Hybit**.

---

## 1. Ikhtisar Arsitektur Berlapis (High-Level Architecture)

Arsitektur Hybit dirancang menggunakan pola modular decoupled 5-layer:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        1. PRESENTATION LAYER                           │
│  React 19 SPA • Tailwind CSS v4 • Motion • Dark Obsidian Theme         │
│  (Landing Page • Phone Mockup • Live Dashboard • Quick Action Modals)  │
├────────────────────────────────────────────────────────────────────────┤
│                       2. APPLICATION CONTEXT                           │
│   • CurrencyContext (Multi-Fiat Engine & Realtime FX Rates)            │
│   • LanguageContext (Reaktif ID/EN Dictionary & Formatters)            │
│   • ToastContext (Feedback & Transaction Status Pipeline)              │
├────────────────────────────────────────────────────────────────────────┤
│                    3. WALLET & SECURITY ABSTRACTION                    │
│   • Privy Embedded 2-of-3 MPC Key Infrastructure                       │
│   • Secure Enclave / WebAuthn Biometric Authenticator                  │
│   • Auto-Lock Session & Inactivity Watcher                             │
├────────────────────────────────────────────────────────────────────────┤
│                  4. TRANSACTION & PROTOCOL AGGREGATION                 │
│   • ERC-4337 Account Abstraction (UserOps, Bundler, Paymaster)         │
│   • Cross-Chain Bridging Router (LayerZero, Li.Fi, Socket)             │
│   • DEX Liquidity Aggregator (Uniswap v3/v4, Raydium, Orca)            │
├────────────────────────────────────────────────────────────────────────┤
│                       5. BLOCKCHAIN & RPC LAYER                        │
│   • EVM Chains (Ethereum, Base, Arbitrum One, Optimism, Polygon, BNB)  │
│   • Non-EVM Chains (Solana SVM, Sui Move, Aptos Move)                  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Model Keamanan & Kriptografi (Security & Cryptography)

### 2.1 Skema 2-of-3 Threshold Multi-Party Computation (MPC)
Hybit menghilangkan kelemahan klasik *single point of failure* pada *seed phrase* (12-24 kata) dengan menerapkan protokol komputasi ambang batas kriptografi (*Threshold Cryptography*):

```
                       [ KUNCI PRIVADI PENUH ]
                     (Tidak pernah direkonstruksi 
                       di satu tempat mana pun)
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
   [ PECAHAN 1 ]           [ PECAHAN 2 ]           [ PECAHAN 3 ]
   Device Shard            Auth Shard              Cloud Recovery
   Disimpan di Secure      Disimpan aman di        Terenkripsi di cloud
   Enclave / KeyStore      Privy Enclave Server    pribadi pengguna
   perangkat pengguna      terverifikasi email     (Google Drive/iCloud)
         │                       │                       │
         └───────────────────────┴───────────────────────┘
                     AMBANG BATAS TANDA TANGAN:
          Dibutuhkan minimal 2 dari 3 pecahan untuk 
          menghasilkan tanda tangan digital valid (ECDSA/Ed25519)
```

1. **Pecahan 1 (Device Shard)**: Disimpan secara aman di dalam modul perangkat keras lokal pengguna (*Secure Enclave* di iOS/macOS, *StrongBox/Android Keystore* di Android). Kunci ini dilindungi oleh otorisasi biometrik (Face ID, Touch ID, atau PIN).
2. **Pecahan 2 (Auth/Email Shard)**: Dikelola oleh kluster server MPC terisolasi milik Privy yang hanya dapat diakses setelah pengguna memverifikasi kode One-Time Password (OTP) dari email terdaftar.
3. **Pecahan 3 (Cloud Recovery Shard)**: Terenkripsi secara end-to-end dengan kata sandi cadangan pengguna dan disimpan di penyimpanan cloud pribadi (*Google Drive / Apple iCloud*). Digunakan jika perangkat pengguna hilang atau diganti.

### 2.2 Keuntungan Model Ini:
- **Non-Custodial Murni**: Hybit Labs tidak pernah memiliki akses ke dana pengguna. Bahkan jika server Hybit mengalami gangguan, pengguna tetap dapat memulihkan aset menggunakan Pecahan 1 dan Pecahan 3.
- **Bebas Phishing Frasa Sandi**: Tidak ada 12 kata yang bisa dicuri penipu melalui web tiruan (*phishing*).
- **Audit Independen**: Arsitektur smart contract dan pecahan MPC telah diaudit oleh firma keamanan Web3 terkemuka (*CertiK, OpenZeppelin, Halborn*).

---

## 3. Lapisan Abstraksi Akun (ERC-4337 Account Abstraction)

Hybit mengimplementasikan standar ERC-4337 untuk memungkinkan dompet pintar (*Smart Contract Wallets*) dengan kapabilitas tingkat lanjut:

```
[ Aksi Pengguna: Send / Swap ]
              │
              ▼
    [ Buat UserOperation ]
              │
              ▼
   [ Paymaster Verification ]
   ├── Opsi A: Gas Disponsori (0 Biaya Gas)
   └── Opsi B: Bayar Gas dengan Token USDC / USDT
              │
              ▼
      [ Bundler Node ] ──> Kumpulkan batch UserOps
              │
              ▼
    [ EntryPoint Contract ] ──> Verifikasi signature & eksekusi di Blockchain
```

- **Gasless Sponsoring (Paymaster)**: Pengguna baru dapat langsung bertransaksi tanpa harus membeli token gas seperti ETH atau MATIC terlebih dahulu.
- **Multi-Token Gas Payment**: Biaya transaksi dapat dipotong langsung dari stablecoin (USDC, USDT).
- **Batched Atomic Operations**: Operasi `Token.approve()` dan `DEX.swap()` digabungkan ke dalam 1 transaksi atomik, menghemat biaya gas hingga 40% dan mencegah risiko token tersangkut.

---

## 4. Mesin Perutean Likuiditas & Jembatan Lintas Rantai

### 4.1 DEX Aggregation Engine
Ketika pengguna melakukan pertukaran (*Swap*):
1. **Pencarian Rute Optimal**: Sistem meminta kuotasi harga dari beberapa *liquidity pool* (Uniswap v3, Uniswap v4 hook, Curve Finance, Raydium).
2. **Slippage Protection & MEV Shield**: Transaksi dikirimkan melalui node RPC privat (Flashbots Protect) untuk melindungi pengguna dari serangan *front-running* atau *sandwich attacks*.

### 4.2 Cross-Chain Bridging Engine
Untuk memindahkan aset antar jaringan (misal Base -> Arbitrum One):
1. Menggunakan protokol pengiriman pesan antar-rantai **LayerZero Endpoint v2** dan **Li.Fi Smart Routing**.
2. **Lock-and-Mint / Burn-and-Redeem Verification**: Memastikan likuiditas tersedia di kedua sisi rantai dengan waktu penyelesaian rata-rata 30-90 detik.

---

## 5. Arsitektur State Management Frontend

```
                  ┌──────────────────────┐
                  │       App.tsx        │
                  └──────────┬───────────┘
                             │
       ┌─────────────────────┼─────────────────────┐
       ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ToastContext  │      │LanguageCtx   │      │CurrencyCtx   │
│- showToast() │      │- t(key)      │      │- currency    │
│- queue/stack │      │- language    │      │- setCurrency │
│- auto-dismiss│      │- setLang()   │      │- fxRates     │
└──────────────┘      └──────────────┘      │- formatCurr()│
                                            │- convertFx() │
                                            └──────────────┘
```

### 5.1 `CurrencyContext` (Mesin Konversi Fiat Dinamis)
- Menyimpan mata uang aktif (`USD`, `IDR`, `EUR`, `GBP`, `JPY`, `SGD`, `AUD`).
- Menyediakan tabel kurs referensi (`RATES`) yang disinkronkan secara konsisten di seluruh dashboard, grafik portofolio, modal aksi cepat, hingga riwayat transaksi.
- Fungsi helper `formatCurrency(amountUsd, options)` mendukung lokalisasi angka (misal pemisah titik pada IDR `Rp 16.250.000` dan koma pada USD `$1,000.00`).

### 5.2 `LanguageContext` (Sistem Dwibahasa Reaktif)
- Kamus multibahasa lengkap (*Bahasa Indonesia* & *English*) mencakup seluruh UI, label formulir, notifikasi toast sukses/gagal, dan panduan keamanan.
- Deteksi otomatis preferensi bahasa browser dengan persistensi di `localStorage`.

### 5.3 `ToastContext`
- Sistem notifikasi mengambang dengan 4 varian status: `success`, `error`, `info`, `warning`.
- Mendukung fitur *Coming Soon* terpadu untuk rilis fitur mendatang.

---

## 6. Diagram Alur Transaksi Lengkap (End-to-End Flow)

```
[ Pengguna ]
    │
    ├─ 1. Buka Modal "Kirim" / "Swap"
    ├─ 2. Input Token & Nominal (Dikonversi via CurrencyContext)
    ├─ 3. Klik "Kirim Sekarang"
    │
    ▼
[ Client Validation ]
    ├─ Periksa Saldo & Batas Minimum
    ├─ Hitung Estimasi Biaya Jaringan (Gas)
    │
    ▼
[ Biometric Prompt (Jika Aktif) ]
    ├─ Face ID / Touch ID / WebAuthn Challenge
    │
    ▼
[ MPC Signature Generation ]
    ├─ Device Shard + Auth Shard tanda tangani Payload UserOp
    │
    ▼
[ Dispatch ke Relayer / RPC Node ]
    ├─ Kirim ke Bundler ERC-4337
    ├─ Monitor Hash Transaksi di Block Explorer
    │
    ▼
[ State Update & Feedback ]
    ├─ Perbarui Saldo Portofolio Lokal
    ├─ Tambahkan ke Riwayat Aktivitas (ActivityView)
    └─ Tampilkan Toast Notifikasi Sukses Bilingual
```

---

## 7. Rencana Skalabilitas & Arsitektur Masa Depan

1. **WebSocket RPC Subscriptions**: Menggantikan *polling* status dengan koneksi WebSocket real-time untuk pembaruan saldo instan per block header.
2. **Offline Transaction Signing**: Menyiapkan penandatanganan transaksi offline melalui QR code terisolasi (*air-gapped wallet integration*).
3. **Session Keys / Auto-Pay Subscriptions**: Fitur kunci sesi terbatas waktu untuk pembayaran otomatis aplikasi Web3 tanpa perlu konfirmasi manual berulang.
