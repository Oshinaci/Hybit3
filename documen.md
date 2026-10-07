# Dokumentasi Teknis & Panduan Fitur Hybit 📚

Panduan teknis lengkap cara kerja, integrasi modul, pengelolaan state, dan pengoperasian fitur-fitur di dalam aplikasi **Hybit Wallet**.

---

## 1. Daftar Modul & Navigasi Dasbor (Dashboard Modules)

Aplikasi dasbor Hybit dibagi menjadi 5 tab navigasi utama yang diakses melalui sidebar atau bottom navigation bar:

```
┌─────────────────┬──────────────────────────────────────────────────────┐
│ Tab Navigasi    │ Fungsi & Komponen Penanggung Jawab                   │
├─────────────────┼──────────────────────────────────────────────────────┤
│ 1. Beranda      │ Ringkasan portofolio, aksi cepat, grafik saldo,      │
│    (Home)       │ alokasi aset per rantai, aktivitas terbaru           │
│                 │ -> `DashboardHome.tsx`                               │
├─────────────────┼──────────────────────────────────────────────────────┤
│ 2. Portofolio   │ Rincian aset kripto lengkap, filter rantai,          │
│    (Portfolio)  │ token balance, harga real-time, persentase gain      │
│                 │ -> `PortfolioView.tsx`                               │
├─────────────────┼──────────────────────────────────────────────────────┤
│ 3. Aktivitas    │ Riwayat mutasi, filter status (Semua, Terkirim,      │
│    (Activity)   │ Diterima, Swap, Bridge), detail transaksi modal      │
│                 │ -> `ActivityView.tsx`                                │
├─────────────────┼──────────────────────────────────────────────────────┤
│ 4. Dompet       │ Kunci Privy MPC, status pecahan hardware, ekspor     │
│    (Wallet)     │ public key, backup cloud recovery, copy address      │
│                 │ -> `WalletView.tsx`                                  │
├─────────────────┼──────────────────────────────────────────────────────┤
│ 5. Pengaturan   │ Pilihan Primary Currency, toggle bahasa (ID/EN),     │
│    (Settings)   │ biometrik, timer auto-lock, audit keamanan           │
│                 │ -> `SettingsView.tsx`                                │
└─────────────────┴──────────────────────────────────────────────────────┘
```

---

## 2. Modal Aksi Cepat (Quick Action Modals)

Komponen `QuickActionModals.tsx` mengelola 5 jendela transaksi interaktif:

### 2.1 Modal Kirim (Send Modal)
- **Input**:
  - Alamat penerima (validasi format `0x...` untuk EVM atau Base58 untuk Solana).
  - Pilihan token & rantai jaringan.
  - Jumlah pengiriman kripto (dengan opsi tombol *Max*).
- **Kalkulasi Otomatis**: Menghitung estimasi nilai fiat sesuai *Primary Currency* yang dipilih dan menampilkan estimasi biaya gas jaringan.

### 2.2 Modal Terima (Receive Modal)
- **Fitur**:
  - Tampilan kode QR dinamis beresolusi tinggi dengan logo Hybit di tengah.
  - Pemilih rantai jaringan (Ethereum, Base, Solana, Arbitrum, dll.) untuk menampilkan format alamat yang sesuai.
  - Tombol *Salin Alamat* (*Copy Address*) dengan feedback toast visual instan.

### 2.3 Modal Tukar (Swap Modal)
- **Alur**:
  - Pemilihan pasangan token asal (*Pay*) dan token tujuan (*Receive*).
  - Perhitungan kurs tukar instan (*Exchange Rate*).
  - Pengaturan toleransi slippage (*Slippage Tolerance*: 0.1%, 0.5%, 1.0%).
  - Estimasi *Gasless Paymaster* (0 gas fee atau dibayar dengan token).

### 2.4 Modal Beli (Buy Modal with Fiat Engine)
- **Integrasi Primary Currency**:
  - Label input menyesuaikan secara dinamis dengan mata uang utama yang aktif (misal `Jumlah Pembelian (IDR)` atau `Spend Amount (USD)`).
  - Tombol preset nominal instan menyesuaikan mata uang (misal untuk IDR: Rp 500rb, Rp 1jt, Rp 5jt, Rp 10jt; untuk USD: $100, $250, $500, $1,000).
  - Pilihan metode pembayaran: *Transfer Bank (BCA, Mandiri, BRI, Permata)*, *QRIS / GoPay / OVO*, *Kartu Debit/Kredit Visa/Mastercard*, *Apple Pay / Google Pay*.

### 2.5 Modal Jembatan (Bridge Modal)
- **Fitur Lintas Rantai**:
  - Pilihan *Source Chain* (Rantai Asal) dan *Destination Chain* (Rantai Tujuan).
  - Integrasi LayerZero & Li.Fi route solver.
  - Estimasi waktu penyelesaian (*ETA: ~45 detik*).

---

## 3. Panduan Penggunaan `CurrencyContext`

`CurrencyContext` bertanggung jawab penuh atas seluruh perhitungan nilai uang di aplikasi:

```tsx
import { useCurrency } from '../context/CurrencyContext';

const MyComponent = () => {
  const { 
    currency,        // Mata uang aktif ('USD' | 'IDR' | 'EUR' | 'GBP' | 'JPY' | 'SGD' | 'AUD')
    setCurrency,     // Fungsi untuk mengubah mata uang
    formatCurrency,  // Format angka ke string mata uang terformat
    convertFromUsd,  // Konversi nilai USD dasar ke mata uang aktif
    convertToUsd,    // Konversi nilai mata uang aktif ke USD
    currencyConfig   // Objek metadata mata uang aktif (simbol, nama, rate)
  } = useCurrency();

  // Contoh: Format angka $1,500.50 ke mata uang pengguna
  const formattedPrice = formatCurrency(1500.50); 
  // Jika IDR -> "Rp 24.383.125"
  // Jika USD -> "$1,500.50"
  // Jika EUR -> "€1.380,46"
};
```

### Nilai Tukar Referensi (Exchange Rates):
| Kode | Simbol | Nama Lengkap | Kurs per 1 USD |
| :--- | :--- | :--- | :--- |
| **USD** | `$` | US Dollar | $1.00 |
| **IDR** | `Rp` | Rupiah Indonesia | Rp 16,250 |
| **EUR** | `€` | Euro | €0.92 |
| **GBP** | `£` | British Pound | £0.78 |
| **JPY** | `¥` | Japanese Yen | ¥155.40 |
| **SGD** | `S$` | Singapore Dollar | S$1.35 |
| **AUD** | `A$` | Australian Dollar | A$1.52 |

---

## 4. Panduan Penggunaan `LanguageContext`

Kamus dwibahasa reaktif dapat diakses melalui hook `useLanguage`:

```tsx
import { useLanguage } from '../context/LanguageContext';

const HeaderComponent = () => {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div>
      <h1>{t('dash_home_title')}</h1>
      <button onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}>
        {language === 'id' ? 'Ganti ke English' : 'Switch to Bahasa'}
      </button>
    </div>
  );
};
```

### Konvensi Penamaan Kunci Bahasa:
- `nav_*`: Teks navigasi header dan menu
- `hero_*`: Teks section hero landing page
- `feat_*`: Teks section fitur
- `sec_*`: Teks section keamanan
- `eco_*`: Teks section ekosistem jaringan
- `dash_*`: Teks dasbor aplikasi
- `qa_*`: Teks modal aksi cepat (Send, Receive, Swap, Buy, Bridge)
- `toast_*`: Pesan umpan balik toast notifikasi

---

## 5. Sistem Pull-To-Refresh (`HybitRefreshIndicator`)

Untuk memicu penyegaran data portofolio dengan efek visual air:

```tsx
import { HybitRefreshIndicator } from '../components/refresh/HybitRefreshIndicator';

<HybitRefreshIndicator
  pullDistance={pullDistance}   // Jarak tarikan sentuhan dalam pixel (0 - 80px)
  threshold={70}                // Batas pixel untuk memicu refresh
  isRefreshing={isRefreshing}   // Boolean status request aktif
  progress={progressPercentage} // Angka 0 - 100%
/>
```

---

## 6. Penanganan Kesalahan & Keamanan (Error Handling & Best Practices)

1. **Pemeriksaan Input Transaksi**:
   - Selalu validasi nominal pengiriman $> 0$ dan $\le \text{Saldo Tersedia}$.
   - Tampilkan toast kesalahan dalam bahasa aktif jika saldo tidak mencukupi (`qa_insufficient_bal`).
2. **Perlindungan Sesi Inaktif (Auto-Lock)**:
   - Sesi pengguna dimonitor oleh event listener interaksi mouse/touch. Jika tidak ada aktivitas selama periode yang dipilih pada `SettingsView`, tampilan akan otomatis terkunci.
3. **Simulasi Eksekusi Sebelum Tanda Tangan**:
   - Seluruh transaksi dievaluasi melalui simulasi RPC lokal untuk memastikan tidak terjadi revert tak terduga sebelum penandatanganan MPC dilakukan.
