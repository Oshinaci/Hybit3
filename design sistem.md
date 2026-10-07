# Design System Hybit Wallet 🎨

Spesifikasi sistem desain antarmuka (*UI/UX Design System*), panduan token warna, tipografi, disiplin anti-AI slop, komponen interaktif, dan animasi pada aplikasi **Hybit**.

---

## 1. Filosofi & Konstitusi Desain (Design Constitution)

Hybit mengadopsi prinsip desain **"Obsidian FinTech"** — menggabungkan kemewahan antarmuka finansial modern, presisi tipografi tabular, dan estetika Web3 gelap berteknologi tinggi.

### Tiga Pilar Utama:
1. **Zero-Pill Discipline & Editorial Kickers**:
   - Menghindari badge kapsul (*pill badges*) mengambang yang generik dan berulang (ciri khas *AI slop*).
   - Menggunakan *unboxed editorial kickers* dengan tipografi monospace huruf kapital kecil yang bersih: `text-xs font-mono uppercase tracking-widest text-[#0095FF] font-semibold`.
2. **Layered Dark Canvas (Kanvas Gelap Berlapis)**:
   - Kedalaman visual dibangun melalui kontras layer netral (`#09090B` -> `#0D0D11` -> `#141418` -> `#1C1C22`), bukan gradien pelangi berlebihan.
3. **Data Clarity & Tabular Precision**:
   - Seluruh angka finansial, saldo aset, nilai tukar mata uang, dan TPS jaringan menggunakan *monospace / tabular numerals* (`font-mono tabular-nums`) untuk kemudahan pemindaian mata.

---

## 2. Palet Warna (Color Palette & Tokens)

### 2.1 Warna Utama (Brand Colors)
| Token | Nilai Hex | Penggunaan |
| :--- | :--- | :--- |
| `primary` | `#0095FF` | Tombol CTA utama, status aktif, tautan, border sorotan, aksen brand |
| `primary-hover` | `#0080E0` | Status hover tombol utama |
| `cyan-accent` | `#00E5FF` | Indikator kecepatan tinggi, metrik performa, aksen gradien air |
| `emerald-status` | `#10B981` / `#34D399` | Saldo positif, transaksi sukses, status jaringan aktif/operasional |
| `rose-danger` | `#F43F5E` / `#EF4444` | Penurunan harga, transaksi gagal, tombol hapus/reset |
| `amber-warning` | `#F59E0B` | Peringatan slippage, transaksi tertunda (*pending*) |

### 2.2 Skala Gelap (Surface & Neutral Scales)
| Token | Nilai Hex | Penggunaan |
| :--- | :--- | :--- |
| `canvas-base` | `#070709` / `#09090B` | Latar belakang halaman aplikasi dan viewport |
| `canvas-surface` | `#0D0D11` / `#101014` | Latar belakang sidebar, container besar |
| `card-surface` | `#141418` | Kartu aset, modul token, jendela modal |
| `card-surface-elevated`| `#1C1C22` | Baris tabel aktif, dropdown menu, tombol sekunder |
| `border-subtle` | `rgba(255, 255, 255, 0.08)` | Garis batas standar kartu dan pembatas konten |
| `border-active` | `rgba(255, 255, 255, 0.18)` | Garis batas hover atau elemen terpilih |

### 2.3 Tipografi & Teks Kontras
| Token | Nilai Tailwind | Penggunaan |
| :--- | :--- | :--- |
| `text-primary` | `text-white` | Judul utama (*headings*), saldo portofolio, nama token |
| `text-secondary` | `text-neutral-300` / `text-neutral-400`| Deskripsi, label input, teks kutipan, navigasi |
| `text-muted` | `text-neutral-500` / `text-neutral-600`| Teks hak cipta, subtitle sekunder, timestamp |

---

## 3. Tipografi (Typography Hierarchy)

Sistem tipografi Hybit menggunakan kombinasi font Sans-Serif modern (Inter / Geist) untuk keterbacaan teks umum, dan font Monospace untuk elemen numerik.

```
Display Large  : text-5xl sm:text-6xl font-extrabold tracking-tight text-white
H1 Heading     : text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white
H2 Section     : text-2xl sm:text-3xl font-bold text-white tracking-tight
H3 Card Title  : text-lg sm:text-xl font-bold text-white
Body Regular   : text-sm sm:text-base text-neutral-300 leading-relaxed
Body Small     : text-xs sm:text-sm text-neutral-400
Editorial Kicker: text-xs font-mono uppercase tracking-widest text-[#0095FF] font-semibold
Financial Numerals: font-mono font-bold tracking-tight tabular-nums
```

---

## 4. Komponen UI Inti (Component Specs)

### 4.1 Tombol (Buttons)
1. **Primary Button**:
   - `px-6 py-3 rounded-2xl bg-[#0095FF] hover:bg-[#0080E0] text-white font-semibold shadow-lg shadow-[#0095FF]/25 active:scale-[0.98] transition-all cursor-pointer`
2. **Secondary / Ghost Button**:
   - `px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.10] border border-white/[0.08] text-neutral-200 text-xs font-medium transition-all`
3. **Danger Button**:
   - `px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-semibold transition-all`

### 4.2 Kartu Konten (Cards)
- `rounded-3xl bg-[#141418] border border-white/[0.08] p-6 hover:border-white/[0.18] transition-all`
- Tidak menggunakan background putih atau abu-abu terang; mempertahankan estetika gelap murni.

### 4.3 Modal & Dialog (Modals)
- **Overlay**: `fixed inset-0 bg-black/80 backdrop-blur-md z-50`
- **Modal Box**: `rounded-3xl bg-[#101014] border border-white/10 shadow-2xl p-6 sm:p-8 max-w-lg w-full`
- Dilengkapi tombol tutup silang (`X`) di sudut kanan atas dan animasi transisi halus *spring* Motion.

---

## 5. Sistem Efek Khusus: Liquid Pull-to-Refresh (`HybitTextFill`)

Salah satu keunggulan visual Hybit adalah indikator tarikan refresh (*Pull-to-refresh*) eksklusif:

```
    [ Ikon Logo Heksagonal ]  +  [ Teks "Hybit" Berisi Efek Air Berjalan ]
         (Presisi Rapat & Sejajar pada Baseline Optik Tengah)
```

### Mekanisme Visual:
- **Teks Dasar (Base Text)**: Teks berbayang halus berwarna abu-abu gelap netral (`#27272A` / `#3F3F46`).
- **Lapisan Air (Liquid Fill Layer)**: Menggunakan teknik SVG Clip Path dengan gradien linier dinamis (`#0095FF` -> `#00E5FF` -> `#38BDF8`).
- **Efek Gelombang Berjalan**: Pada status *pulling*, lebar isi bergerak dari 0% ke 100% dari kiri ke kanan. Saat status *refreshing*, animasi gelombang air terus berulang secara dinamis (*wave pulse*) hingga request selesai.
- **Kerapatan & Penyelarasan**: Jarak antara logo heksagonal dan teks `Hybit` diatur rapat (`gap-2`) dengan perataan tengah optik vertikal sempurna.

---

## 6. Ikonografi Jaringan Blockchain (Network Icons)

Sistem ikon SVG vektor murni berpresisi tinggi tanpa ketergantungan aset gambar bitmap eksternal:

| Jaringan | Simbol | Skema Warna Ikon |
| :--- | :--- | :--- |
| **Ethereum** | ETH | `#627EEA` (Indigo-Blue) |
| **Base** | BASE | `#0052FF` (Coinbase Royal Blue) |
| **Arbitrum** | ARB | `#28A0F0` (Sky Blue) |
| **Optimism** | OP | `#FF0420` (Vibrant Red) |
| **Polygon** | POL | `#8247E5` (Purple) |
| **BNB Chain**| BNB | `#F0B90B` (Gold Amber) |
| **Solana** | SOL | Linear Gradient (`#9945FF` -> `#14F195`) |
| **Sui** | SUI | `#4DA2FF` (Cyan Ocean) |
| **Aptos** | APT | `#20D5A0` (Teal Mint) |

---

## 7. Standar Aksesibilitas (Accessibility & Usability)

- **Rasio Kontras**: Seluruh teks putih dan neutral-300 pada latar `#09090B` memenuhi standar rasio kontras **WCAG AAA (>= 7:1)**.
- **Keyboard Navigation**: Seluruh tombol dan tab interaktif memiliki indikator fokus `focus-visible:ring-2 focus-visible:ring-[#0095FF]`.
- **Haptic & Visual Feedback**: Setiap klik tombol aksi menghasilkan respons visual instan (`active:scale-[0.98]`) dan notifikasi status yang jelas.
