# Hybit — Smart Multi-Chain Self-Custodial Web3 Wallet ⚡

> **1 Email : 1 Dompet** — Pengalaman Web3 tanpa friksi dengan keamanan *Self-Custody* berstandar institusional, enkripsi Multi-Party Computation (MPC), dan abstraksi akun *gasless*.

[![Version](https://img.shields.io/badge/version-1.0.0-0095FF.svg)](https://hybit.wallet)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.x-61dafb.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## 📖 Ringkasan Proyek (Overview)

**Hybit** adalah aplikasi dompet Web3 lintas rantai (*multi-chain smart wallet*) modern yang dirancang untuk menjembatani kemudahan aplikasi fintech Web2 (seperti GoPay, Apple Cash, atau Revolut) dengan kedaulatan penuh aset kripto Web3 (*self-custody*). 

Pengguna dapat masuk hanya menggunakan email atau autentikasi sosial tanpa perlu mencatat 12-24 kata *seed phrase*, dengan keamanan terlindungi oleh skema kriptografi **2-of-3 MPC (Multi-Party Computation)** yang terintegrasi dengan perangkat keras **Secure Enclave / Biometrik**.

---

## ✨ Fitur Unggulan (Key Features)

### 1. 🔐 Autentikasi Modern (1 Email : 1 Dompet)
- **Privy Embedded MPC**: Kunci pribadi dipecah menjadi 3 pecahan independen (*Device Shard*, *Auth/Email Shard*, dan *Cloud Recovery Shard*). Tidak ada satu pihak pun (termasuk Hybit) yang memegang kunci penuh pengguna.
- **Biometric Security & Passkeys**: Mendukung Face ID, Touch ID, dan WebAuthn PIN untuk otorisasi transaksi instan.
- **Auto-Lock Security Timer**: Fitur penguncian otomatis (Segera, 1 Menit, 5 Menit, 15 Menit, 1 Jam) untuk melindungi sesi aktif.

### 2. 🌐 Dukungan Multi-Chain Luas (EVM & Non-EVM)
- **EVM Networks**: Ethereum, Base (Coinbase L2), Arbitrum One, Optimism, Polygon PoS, BNB Smart Chain.
- **Non-EVM Networks**: Solana, Sui, Aptos.
- **Deteksi Token & Aset Otomatis**: Manajemen portofolio terpadu untuk koin asli, token ERC-20/SPL, dan stablecoin (USDC, USDT, DAI).

### 3. ⛽ Transaksi Tanpa Gas (Account Abstraction ERC-4337)
- **Paymaster Sponsoring**: Biaya gas dapat disubsidi oleh protokol atau dibayar langsung menggunakan saldo token yang ditransfer (misal bayar gas menggunakan USDC, bukan ETH).
- **Batch Transactions**: Penggabungan instruksi *Approve* + *Swap* ke dalam satu klik atomik.

### 4. 🔄 Mesin Swap & Bridge Lintas Rantai Instan
- **DEX Aggregation**: Perutean likuiditas pintar di Uniswap v3/v4, Curve, Raydium, dan Orca dengan perlindungan MEV dan slippage otomatis.
- **Cross-Chain Bridge Engine**: Ditenagai oleh LayerZero, Li.Fi, dan Socket untuk pemindahan aset lintas rantai dalam hitungan detik.

### 5. 💱 Multi-Currency & Nilai Tukar Dinamis (*Primary Currency*)
- Pengguna dapat memilih mata uang utama tampilan (**USD, IDR, EUR, GBP, JPY, SGD, AUD**).
- Seluruh nilai saldo, kalkulator modal beli (*Buy with Fiat*), estimasi biaya gas, dan riwayat mutasi otomatis dikonversi secara real-time dengan kurs akurat.

### 6. 🌐 Bilingual Lengkap (Bahasa Indonesia & English)
- Seluruh antarmuka, notifikasi toast, modal aksi cepat, deskripsi keamanan, hingga pesan kesalahan (*error messages*) mendukung dwibahasa reaktif tanpa *reload* halaman.

### 7. 💧 Desain Antarmuka Eksklusif & Anti-AI Slop
- **Pull-To-Refresh Liquid Text**: Animasi aliran air dinamis pada tipografi *Hybit* yang presisi dan selaras dengan logo heksagonal.
- **Zero-Pill Discipline**: Tipografi editorial yang rapi, kontras gelap profesional (`#09090B`, `#141418`), dan aksen *Electric Blue* (`#0095FF`).

---

## 🛠️ Tech Stack & Arsitektur

| Layer | Teknologi |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) |
| **Bahasa** | [TypeScript](https://www.typescriptlang.org/) (Strict Mode) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Animasi & Interaksi**| [Motion (Framer Motion)](https://motion.dev/) |
| **Ikonografi** | [Lucide React](https://lucide.dev/) + Custom SVG Network Icons |
| **State Management** | React Context API (`CurrencyContext`, `LanguageContext`, `ToastContext`) |
| **Data Persistence** | `localStorage` dengan skema migrasi aman |

---

## 🚀 Panduan Memulai Cepat (Quick Start)

### Prasyarat
- [Node.js](https://nodejs.org/) versi `>= 18.0.0`
- [Bun](https://bun.sh/) atau [npm](https://npmjs.com/)

### Instalasi & Menjalankan Lokal

```bash
# 1. Clone repositori
git clone https://github.com/hybit/hybit-wallet.git
cd hybit-wallet

# 2. Pasang dependensi
npm install
# atau
bun install

# 3. Jalankan server pengembangan
npm run dev

# 4. Buka peramban di http://localhost:3000
```

### Script yang Tersedia

```bash
npm run dev      # Menjalankan Vite dev server di port 3000
npm run build    # Kompilasi TypeScript dan bundel produksi
npm run preview  # Menjalankan preview build produksi
npm run lint     # Validasi sintaks dan type-check (tsc --noEmit)
```

---

## 📁 Struktur Direktori

```text
├── public/                  # Aset statis, favicon, manifest
├── src/
│   ├── components/          # Komponen UI
│   │   ├── common/          # Komponen umum (LoadingScreen, ToastContainer)
│   │   ├── dashboard/       # Tampilan aplikasi dasbor utama (Home, Portfolio, Activity, Wallet, Settings)
│   │   ├── icons/           # Ikon blockchain & logo Hybit SVG presisi
│   │   ├── refresh/         # Komponen Pull-to-refresh & HybitTextFill efek air
│   │   ├── CTA.tsx          # Section Call to Action landing page
│   │   ├── Ecosystem.tsx    # Section daftar jaringan didukung
│   │   ├── FAQ.tsx          # Section tanya jawab pengguna
│   │   ├── Features.tsx     # Section keunggulan produk
│   │   ├── Footer.tsx       # Footer dan link portal
│   │   ├── Hero.tsx         # Hero section interaktif
│   │   ├── MobileDrawer.tsx # Menu navigasi mobile
│   │   ├── Navbar.tsx       # Header navigasi utama
│   │   ├── PhoneMockup.tsx  # Simulasi ponsel interaktif
│   │   ├── Security.tsx     # Section arsitektur keamanan & audit
│   │   ├── Testimonials.tsx # Ulasan industri dan komunitas
│   │   └── TrustedBy.tsx    # Logo mitra protokol
│   ├── context/             # React Context Providers
│   │   ├── CurrencyContext.tsx # Manajemen mata uang utama & konversi kurs
│   │   ├── LanguageContext.tsx # Kamus dwibahasa (ID/EN)
│   │   └── ToastContext.tsx    # Sistem notifikasi toast
│   ├── types/               # TypeScript interfaces & data contracts
│   ├── App.tsx              # Entry component & layout routing
│   ├── main.tsx             # Root ReactDOM rendering
│   └── index.css            # Tailwind directives & custom CSS
├── arsitektur.md            # Dokumentasi arsitektur sistem
├── design sistem.md         # Spesifikasi visual, komponen, & palet desain
├── documen.md               # Panduan teknis, API, & integrasi fitur
├── about.md                 # Visi, misi, roadmap & pencapaian Hybit
└── package.json             # Konfigurasi dependensi proyek
```

---

## 🗺️ Roadmap Pengembangan Selanjutnya

1. **Fase 1 (Selesai)**: Landing page interaktif, Dasbor Wallet lengkap, Modal Aksi Cepat (Send, Receive, Swap, Buy, Bridge), Multi-Currency System, Pull-to-refresh liquid text.
2. **Fase 2 (Berikutnya)**: Integrasi live RPC node Ethereum & Solana, koneksi smart contract Paymaster ERC-4337 di testnet/mainnet.
3. **Fase 3**: Peluncuran aplikasi mobile native iOS (Swift) & Android (Kotlin) dengan integrasi Apple FaceID & Android Biometric API.
4. **Fase 4**: Kartu debit virtual crypto Hybit Visa/Mastercard dan modul tabungan staking yield berkeamanan MPC.

---

## 📄 Lisensi

Didistribusikan di bawah Lisensi MIT. Lihat file `LICENSE` untuk informasi lebih lanjut.
Hak Cipta © 2026 **Hybit Labs, Inc.** Seluruh hak cipta dilindungi undang-undang.
