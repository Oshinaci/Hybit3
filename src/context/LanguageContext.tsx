import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'id' | 'en';

export interface LanguageOption {
  code: Language;
  label: string;
  flag: string;
  nativeName: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩', nativeName: 'Bahasa Indonesia' },
  { code: 'en', label: 'English', flag: '🇬🇧', nativeName: 'English (US)' },
];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const STORAGE_KEY = 'hybit_language';

const translations: Record<Language, Record<string, string>> = {
  id: {
    // General & Brand
    app_name: 'Hybit',
    app_tagline: 'Kripto Semudah Satu Sentuhan',
    tagline_desc: 'Dompet kripto harian untuk semua orang. Simpan, kirim, terima, tukar, dan kelola aset digital dengan kemudahan satu sentuhan serta keamanan kriptografi mandiri.',
    launch_app: 'Buka Aplikasi',
    download_app: 'Unduh Aplikasi',
    coming_soon: 'Segera Hadir',
    back_to_landing: 'Kembali ke Beranda',
    operational_status: 'Semua Sistem Beroperasi Normal',
    all_rights_reserved: 'Hak cipta dilindungi undang-undang. Kripto Semudah Satu Sentuhan.',
    mainnet_ready: 'Siap Mainnet',
    early_access: 'Akses Awal v1.0.0',
    navigation: 'Navigasi',

    // Navigation
    nav_features: 'Fitur',
    nav_preview: 'Pratinjau Dompet',
    nav_security: 'Keamanan',
    nav_ecosystem: 'Ekosistem',
    nav_faq: 'Tanya Jawab',
    nav_download: 'Unduh',

    // Hero Section
    hero_badge: 'GENERASI TERBARU • PROTOKOL NON-KUSTODIAL',
    hero_kicker: 'Kendali Penuh',
    hero_policy: 'Tanpa Rumit',
    hero_title_1: 'Kripto Semudah',
    hero_line_1: 'A self custodial wallet being built in public.',
    hero_line_2: 'No seed phrase complexity.',
    hero_line_3: 'No unnecessary friction.',
    hero_line_4: 'Just your wallet, your assets, your control.',
    hero_line_5: 'Become a Pioneer.',
    hero_early_dev: 'Hybit - Early Development',

    // Features Section
    features_badge: 'FITUR UNGGULAN',
    features_title: 'Segalanya Dibuat Lebih Sederhana',
    features_subtitle: 'Tidak ada kerumitan frasa pemulihan 24 kata, tidak ada kebingungan biaya gas, dan tidak ada penundaan transaksi.',
    feat_1_title: 'Dompet Super Mudah',
    feat_1_sub: 'Kesederhanaan Uang Digital',
    feat_1_desc: 'Buat dompet kepemilikan mandiri dalam 5 detik menggunakan Passkey atau biometrik. Tanpa frasa kertas 24 kata yang rentan hilang, langsung siap digunakan kapan saja.',
    feat_1_d1: 'Dukungan WebAuthn & FaceID / TouchID Apple',
    feat_1_d2: 'Sinkronisasi cloud enclave terenkripsi otomatis',
    feat_1_d3: 'Perpindahan multi-akun instan',

    feat_2_title: 'Swap Sekali Ketuk',
    feat_2_sub: 'Mesin Likuiditas Cerdas',
    feat_2_desc: 'Tukar token apa pun di lebih dari 40 bursa terdesentralisasi dalam sekali ketuk. Perlindungan MEV bawaan menjamin slippage terendah dan tanpa biaya tersembunyi.',
    feat_2_d1: 'Perutean pintar lintas Uniswap, Curve & Aerodrome',
    feat_2_d2: 'Perlindungan slippage otomatis',
    feat_2_d3: 'Nol biaya protokol platform tambahan',

    feat_3_title: 'Jembatan Lintas Rantai',
    feat_3_sub: 'Didukung oleh LayerZero',
    feat_3_desc: 'Pindahkan aset asli melintasi Ethereum, Base, Solana, dan 10+ jaringan tanpa pusing dengan wrapped token atau jembatan rentan risiko.',
    feat_3_d1: 'Penyelesaian lintas rantai di bawah 30 detik',
    feat_3_d2: 'Transfer USDC native via Circle CCTP',
    feat_3_d3: 'Tampilan saldo terpadu multi-jaringan',

    feat_4_title: 'Pelacakan Portofolio',
    feat_4_sub: 'Kejelasan Finansial Selevel Perbankan',
    feat_4_desc: 'Kalkulasi untung/rugi (P&L) real-time, grafik riwayat imbal hasil, hadiah staking, dan laporan siap pajak di setiap alamat terhubung.',
    feat_4_d1: 'Pembaruan harga real-time via Chainlink',
    feat_4_d2: 'Perhitungan basis biaya historis otomatis',
    feat_4_d3: 'Rincian imbal hasil LP DeFi & staking',

    feat_5_title: 'Pemulihan Aman MPC',
    feat_5_sub: 'Komputasi Multi-Pihak',
    feat_5_desc: 'Tidak perlu takut kehilangan frasa sandi lagi. Multi-Party Computation membagi kunci privat menjadi pecahan terenkripsi dengan pemulihan sosial dan cloud.',
    feat_5_d1: 'Skema tanda tangan ambang batas 2-dari-3',
    feat_5_d2: 'Cadangan zero-knowledge terenkripsi AES-256',
    feat_5_d3: 'Pemulihan wali kontak terpercaya (Guardian)',

    feat_6_title: 'Transfer Kilat Gasless',
    feat_6_sub: 'Kirim Semudah Mengirim Pesan',
    feat_6_desc: 'Kirim kripto ke teman memakai nomor ponsel, username, tag ENS, atau kode QR instan. Nikmati finalitas instan tanpa biaya gas di jaringan Hybit Pay.',
    feat_6_d1: 'Resolusi nomor ponsel peer-to-peer instan',
    feat_6_d2: 'Generator kode QR scan-to-pay terintegrasi',
    feat_6_d3: 'Transfer batch dalam satu transaksi hemat',

    // Security Section
    sec_badge: 'KEAMANAN TINGKAT BANK',
    sec_title: 'Keamanan Kuat Tanpa Rumit',
    sec_subtitle: 'Fondasi kriptografi modern menjaga keamanan aset Anda setiap detik tanpa mengurangi kenyamanan penggunaan.',
    sec_1_title: 'Non-Kustodial Penuh',
    sec_1_sub: 'Kepemilikan Mandiri Hakiki',
    sec_1_desc: 'Anda memegang 100% kendali matematis atas aset Anda setiap saat. Hybit tidak pernah memegang kunci pribadi Anda dan tidak dapat membekukan dana Anda.',
    sec_1_badge: 'Nol Risiko Pihak Ketiga',
    sec_1_p1: 'Kustodi mandiri kriptografis',
    sec_1_p2: 'Hanya penandatanganan sisi klien',
    sec_1_p3: 'Akun cerdas asli standar EIP-4337',

    sec_2_title: 'Sumber Terbuka (Open Source)',
    sec_2_sub: 'Transparansi yang Dapat Diverifikasi',
    sec_2_desc: 'Setiap baris kode perangkat lunak sisi klien kami dapat diaudit secara publik di GitHub. Kepercayaan pada infrastruktur keuangan harus dapat dibuktikan.',
    sec_2_badge: 'Repositori GitHub Publik',
    sec_2_p1: 'Build yang dapat direproduksi (Reproducible)',
    sec_2_p2: 'Program bug bounty publik ($500.000)',
    sec_2_p3: 'Nol kotak hitam tertutup (Black boxes)',

    sec_3_title: 'Kontrak Pintar Diaudit',
    sec_3_sub: 'Diverifikasi Secara Formal',
    sec_3_desc: 'Semua modul akun cerdas Hybit, relayer jembatan, dan perute swap menjalani verifikasi matematis formal dan uji penetrasi mendalam.',
    sec_3_badge: 'Tiga Kali Diaudit',
    sec_3_p1: 'Diaudit independen oleh OpenZeppelin',
    sec_3_p2: 'Audit keamanan menyeluruh oleh Trail of Bits',
    sec_3_p3: 'Tersertifikasi uji penetrasi Halborn',

    sec_4_title: 'Siap MPC Terdistribusi',
    sec_4_sub: 'Multi-Party Computation',
    sec_4_desc: 'Kunci kriptografi dipecah menjadi pecahan ambang batas (2-dari-3) yang didistribusikan ke enclave perangkat Anda, cloud terenkripsi, dan node pemulihan.',
    sec_4_badge: 'Kriptografi Ambang Batas',
    sec_4_p1: 'Tidak ada titik kegagalan tunggal',
    sec_4_p2: 'Jaminan pencegahan kehilangan kunci',
    sec_4_p3: 'Penyusunan tanda tangan sub-detik',

    sec_5_title: 'Pemulihan Terenkripsi',
    sec_5_sub: 'Nol-Pengetahuan AES-256-GCM',
    sec_5_desc: 'Cadangan cloud dienkripsi di perangkat Anda sebelum keluar. Bahkan penyedia cloud tidak dapat membaca materi kunci Anda.',
    sec_5_badge: 'Enkripsi Ujung-ke-Ujung',
    sec_5_p1: 'Standar enkripsi militer AES-256-GCM',
    sec_5_p2: 'Arsitektur nol-pengetahuan (Zero-Knowledge)',
    sec_5_p3: 'Otorisasi pemulihan biometrik berlapis',

    sec_6_title: 'Enclave Biometrik Keras',
    sec_6_sub: 'Modul Keamanan Perangkat Keras',
    sec_6_desc: 'Akses transaksi dilindungi oleh Secure Enclave bawaan iPhone dan Android Keystore dengan otorisasi sidik jari atau Face ID.',
    sec_6_badge: 'Tingkat Perangkat Keras',
    sec_6_p1: 'Isolasi silikon Secure Enclave',
    sec_6_p2: 'Anti-ekstraksi fisik tingkat chip',
    sec_6_p3: 'Konfirmasi tanda tangan biometrik instan',

    // Ecosystem Section
    eco_badge: 'MULTI-CHAIN NATIVE',
    eco_title: 'Didukung di Seluruh Jaringan Utama',
    eco_subtitle: 'Satu saldo terpadu yang dapat beroperasi di seluruh blockchain terpopuler di dunia.',
    eco_active_ecosystems: '4 Ekosistem Aktif',

    // Wallet Preview Section
    preview_badge: 'DEMO INTERAKTIF',
    preview_title: 'Rasakan Kemudahan Dompet Hybit',
    preview_subtitle: 'Coba langsung simulasi penukaran token dan grafik portofolio waktu nyata.',
    preview_tab_portfolio: 'Portofolio',
    preview_tab_swap: 'Simulasi Swap',
    preview_swap_btn: 'Eksekusi Simulasi Swap',
    preview_swap_success: 'Swap Berhasil Dikonfirmasi!',
    preview_you_pay: 'Anda Bayar',
    preview_you_receive: 'Anda Terima',
    preview_rate: 'Kurs:',
    preview_instant: 'Swap Instan',

    // FAQ Section
    faq_badge: 'PERTANYAAN UMUM',
    faq_title: 'Pertanyaan yang Sering Diajukan',
    faq_subtitle: 'Segala hal yang perlu Anda ketahui mengenai keamanan, cara kerja, dan keunggulan dompet Hybit.',
    faq_q1: 'Apa perbedaan Hybit dengan dompet kripto lainnya seperti MetaMask?',
    faq_a1: 'Hybit dirancang agar terasa seperti aplikasi keuangan harian yang intuitif. Anda tidak perlu mencatat frasa 24 kata, tidak perlu repot menghitung biaya gas (karena disubsidi Paymaster), dan bisa mengirim aset hanya dengan nomor telepon atau nama pengguna.',
    faq_q2: 'Apakah Hybit benar-benar non-kustodial?',
    faq_a2: 'Ya, 100%. Hybit menggunakan arsitektur MPC (Multi-Party Computation) di mana pecahan kunci dienkripsi di perangkat Anda. Hybit tidak pernah memiliki akses ke dana Anda.',
    faq_q3: 'Bagaimana jika ponsel saya hilang atau rusak?',
    faq_a3: 'Anda dapat memulihkan dompet dengan mudah menggunakan akun email terverifikasi dan cadangan biometrik cloud yang telah dienkripsi secara zero-knowledge.',
    faq_q4: 'Apakah ada biaya tambahan untuk melakukan swap atau transfer?',
    faq_a4: 'Tidak ada biaya tersembunyi. Hybit menggunakan perutean likuiditas cerdas DEX terbaik untuk memberikan kurs termurah tanpa biaya platform tambahan.',

    // CTA Section
    cta_badge: 'MULAI SEKARANG',
    cta_title: 'Siap Merasakan Kripto Semudah Satu Sentuhan?',
    cta_desc: 'Bergabunglah sekarang dan rasakan cara paling praktis serta aman untuk mengelola aset digital di era Web3.',
    cta_button: 'Luncurkan Hybit Sekarang',

    // Footer
    footer_desc: 'adalah dompet kripto harian untuk semua orang. Simpan, kirim, terima, swap, dan kelola aset digital dengan kepemilikan mandiri yang praktis dan aman.',
    footer_col_company: 'Perusahaan',
    footer_col_resources: 'Sumber Daya',
    footer_col_legal: 'Hukum & Kepatuhan',
    footer_about: 'Tentang Kami',
    footer_careers: 'Karir',
    footer_brand_assets: 'Aset Merek',
    footer_security_audits: 'Keamanan & Audit',
    footer_docs: 'Dokumentasi',
    footer_ecosystem: 'Ekosistem',
    footer_api: 'API Pengembang',
    footer_status: 'Status Sistem',
    footer_privacy: 'Kebijakan Privasi',
    footer_terms: 'Syarat & Ketentuan',
    footer_bug_bounty: 'Bug Bounty',
    footer_disclosure: 'Pengungkapan Bertanggung Jawab',

    // Dashboard Layout & Header
    dash_address_title: 'Alamat Dompet',
    dash_copy_tooltip: 'Salin Alamat',
    dash_copied_tooltip: 'Alamat Tersalin!',
    dash_network_label: 'Jaringan Aktif',
    dash_select_network: 'Pilih Jaringan Aktif',
    dash_notifications: 'Notifikasi',
    dash_mark_read: 'Tandai sudah dibaca',
    dash_no_unread: 'Tidak ada notifikasi baru',

    // Dashboard Navigation
    dash_nav_home: 'Beranda',
    dash_nav_portfolio: 'Portofolio',
    dash_nav_swap: 'Tukar',
    dash_nav_activity: 'Aktivitas',
    dash_nav_settings: 'Pengaturan',

    // Dashboard Home
    dash_balance_label: 'Saldo Hybit',
    dash_balance_today: 'Hari Ini',
    dash_multichain: 'Multi-Chain',
    dash_quick_send: 'Kirim',
    dash_quick_receive: 'Terima',
    dash_quick_swap: 'Tukar',
    dash_quick_buy: 'Beli',
    dash_quick_bridge: 'Jembatan',
    dash_holdings_title: 'Daftar Aset',
    dash_holdings_desc: 'Aset disimpan langsung di brankas non-kustodial Anda',
    dash_view_all: 'Lihat Semua',
    dash_recent_activity: 'Aktivitas Terkini',
    dash_recent_activity_desc: 'Transaksi terkonfirmasi on-chain terbaru',
    dash_full_history: 'Riwayat Lengkap',
    dash_tx_fee_label: 'Biaya',
    dash_tx_received_from: 'Diterima dari',
    dash_tx_sent_to: 'Terkirim ke',
    dash_tx_swapped: 'Ditukar',
    dash_tx_bridged: 'Dijembatani',
    dash_balance_hidden: 'Saldo Disembunyikan',
    dash_balance_visible: 'Saldo Ditampilkan',

    // Portfolio View
    port_net_assets: 'Total Nilai Aset Bersih',
    port_timeframe_1d: '24 Jam Terakhir',
    port_timeframe_1w: '7 Hari Terakhir',
    port_timeframe_1m: '30 Hari Terakhir',
    port_timeframe_1y: '1 Tahun Terakhir',
    port_timeframe_all: 'Semua Periode',
    port_distribution_title: 'Distribusi Multi-Chain',
    port_distribution_desc: '4 Ekosistem Aktif',
    port_search_placeholder: 'Cari aset atau token...',
    port_filter_all: 'Semua Jaringan',
    port_asset_column: 'Aset',
    port_price_column: 'Harga Pasar',
    port_holdings_column: 'Jumlah Saldo',
    port_pnl_column: '24j PnL',
    port_toast_title: 'Periode Grafik',
    port_toast_desc: 'Grafik diselaraskan dengan periode',

    // Activity View
    act_title: 'Buku Aktivitas Transaksi',
    act_subtitle: 'Penyelesaian multi-chain terverifikasi secara on-chain.',
    act_export_btn: 'Unduh CSV',
    act_export_notice: 'Laporan transaksi siap pajak untuk tahun 2026 sedang disiapkan...',
    act_filter_all: 'Semua',
    act_filter_sent: 'Terkirim',
    act_filter_received: 'Diterima',
    act_filter_swaps: 'Tukar (Swap)',
    act_filter_bridges: 'Jembatan (Bridge)',
    act_search_placeholder: 'Cari nomor hash, pengirim, atau token...',
    act_status_confirmed: 'Dikonfirmasi',
    act_status_pending: 'Memproses',
    act_hash_copied: 'Hash Transaksi Disalin',
    act_modal_title: 'Rincian Transaksi',

    // Settings View
    settings_title: 'Pengaturan & Keamanan',
    settings_subtitle: 'Kelola dompet Privy tersemat, otentikasi biometrik, dan preferensi aplikasi.',
    settings_saved_msg: 'Preferensi berhasil diperbarui dan disinkronkan ke enclave terenkripsi.',
    settings_wallet_details: 'Rincian Dompet Privy Tersemat',
    settings_one_wallet: '1 Dompet Non-Kustodial per Akun Email Terverifikasi',
    settings_auth_provider: 'Autentikasi Akun Privy',
    settings_email_label: 'Email Terhubung',
    settings_type_label: 'Jenis Kustodi',
    settings_status_label: 'Status Verifikasi',
    settings_active_badge: 'Terverifikasi & Aktif',
    settings_valuation_label: 'Total Valuasi Portofolio',
    settings_policy_label: 'Kebijakan Akun:',
    settings_policy_text: '1 Email · 1 Dompet',
    settings_security_section: 'Keamanan & Akses Dompet',
    settings_passkey_title: 'Login Biometrik / Passkey',
    settings_passkey_desc: 'Gunakan Face ID, Touch ID, atau Windows Hello untuk otorisasi transaksi instan.',
    settings_autolock_title: 'Kunci Otomatis (Auto-Lock)',
    settings_autolock_desc: 'Kunci otomatis sesi saat aplikasi tidak aktif',
    settings_autolock_select: 'Pilih Waktu Kunci Otomatis',
    settings_pref_section: 'Preferensi & Tampilan',
    settings_language_title: 'Bahasa Aplikasi',
    settings_language_desc: 'Pilih bahasa tampilan untuk seluruh antarmuka Hybit',
    settings_language_select: 'Pilih Bahasa',
    settings_currency_title: 'Mata Uang Utama',
    settings_currency_desc: 'Denominasi nilai tukar untuk total saldo portofolio',
    settings_currency_select: 'Pilih Mata Uang Utama',
    settings_gas_title: 'Kecepatan Transaksi & Biaya Gas',
    settings_gas_desc: 'Pilihan tip prioritas default untuk transaksi blockchain',
    settings_gas_select: 'Pilih Preset Biaya Gas',
    settings_danger_section: 'Pusat Keamanan & Kunci Dompet',
    settings_lock_now: 'Kunci Dompet Sekarang',
    settings_lock_desc: 'Kunci sesi dompet aktif dan minta autentikasi biometrik ulang saat dibuka.',

    // Quick Action Modals
    modal_send_title: 'Kirim Kripto',
    modal_send_recipient: 'Alamat Penerima, ENS, atau Nomor HP',
    modal_send_amount: 'Jumlah yang Dikirim',
    modal_send_balance: 'Saldo Tersedia:',
    modal_send_btn: 'Konfirmasi Pengiriman',
    modal_send_fee: 'Biaya Jaringan: Gratis (Disubsidi Paymaster)',

    modal_receive_title: 'Terima Aset Kripto',
    modal_receive_desc: 'Pindai kode QR atau salin alamat dompet non-kustodial Anda di bawah ini.',
    modal_receive_address: 'Alamat Dompet Anda',
    modal_receive_copy: 'Salin Alamat',
    modal_receive_copied: 'Alamat Tersalin!',
    modal_receive_networks: 'Jaringan yang Didukung: Base, Ethereum, Solana, Arbitrum, Polygon',

    modal_swap_title: 'Tukar Token (Swap)',
    modal_swap_pay: 'Anda Bayar',
    modal_swap_receive: 'Anda Terima',
    modal_swap_rate: 'Kurs Nilai Tukar:',
    modal_swap_slippage: 'Toleransi Slippage: 0.5% (Terlindungi MEV)',
    modal_swap_route: 'Rute Likuiditas Terbaik:',
    modal_swap_btn: 'Konfirmasi & Eksekusi Swap',

    modal_buy_title: 'Beli Kripto Instan',
    modal_buy_method: 'Pilih Jalur Pembayaran',
    modal_buy_amount: 'Nominal Pembelian (IDR / USD)',
    modal_buy_receive: 'Estimasi Token Diterima:',
    modal_buy_btn: 'Lanjutkan ke Pembayaran Instan',

    modal_bridge_title: 'Jembatan Lintas Rantai (Bridge)',
    modal_bridge_from: 'Jaringan Asal',
    modal_bridge_to: 'Jaringan Tujuan',
    modal_bridge_protocol: 'Protokol: LayerZero Omnichain Relayer',
    modal_bridge_time: 'Estimasi Waktu: ~30-60 detik',
    modal_bridge_btn: 'Konfirmasi Transfer Lintas Rantai',

    modal_success_title: 'Transaksi Berhasil!',
    modal_done_btn: 'Selesai',
    modal_close_btn: 'Tutup',

    // Refresh & Pull down
    refresh_pull: 'Tarik ke bawah untuk memperbarui...',
    refresh_release: 'Lepaskan untuk merefresh',
    refresh_syncing: 'Menyinkronkan blockchain...',
    refresh_success_title: 'Data Hybit Berhasil Diperbarui',
    refresh_success_desc: 'Saldo aset & riwayat transaksi multi-chain berhasil disinkronkan',

    // Loading Screen
    loading_init: 'Inisialisasi Enclave MPC...',
    loading_sub: 'Kripto Semudah Satu Sentuhan',
  },

  en: {
    // General & Brand
    app_name: 'Hybit',
    app_tagline: 'Crypto as Simple as a Single Tap',
    tagline_desc: 'The everyday crypto wallet for everyone. Safely store, send, receive, swap, and manage digital assets with single-tap ease and full cryptographic self-custody.',
    launch_app: 'Launch App',
    download_app: 'Download App',
    coming_soon: 'Coming Soon',
    back_to_landing: 'Back to Landing',
    operational_status: 'All Systems Operational',
    all_rights_reserved: 'All rights reserved. Crypto as Simple as a Single Tap.',
    mainnet_ready: 'Mainnet Ready',
    early_access: 'Early Access v1.0.0',
    navigation: 'Navigation',

    // Navigation
    nav_features: 'Features',
    nav_preview: 'Wallet Preview',
    nav_security: 'Security',
    nav_ecosystem: 'Ecosystem',
    nav_faq: 'FAQ',
    nav_download: 'Download',

    // Hero Section
    hero_badge: 'NEXT-GEN • NON-CUSTODIAL PROTOCOL',
    hero_kicker: 'Total Control',
    hero_policy: 'Zero Friction',
    hero_title_1: 'Crypto as Simple as',
    hero_line_1: 'A self custodial wallet being built in public.',
    hero_line_2: 'No seed phrase complexity.',
    hero_line_3: 'No unnecessary friction.',
    hero_line_4: 'Just your wallet, your assets, your control.',
    hero_line_5: 'Become a Pioneer.',
    hero_early_dev: 'Hybit - Early Development',

    // Features Section
    features_badge: 'CORE FEATURES',
    features_title: 'Everything Built Simpler',
    features_subtitle: 'No 24-word seed phrase friction, no confusing gas fee math, and no delayed settlements.',
    feat_1_title: 'Easy Wallet',
    feat_1_sub: 'Digital Cash Simplicity',
    feat_1_desc: 'Create a self-custody wallet in 5 seconds with Passkey or biometric login. No 24-word paper seeds to misplace, ready in moments.',
    feat_1_d1: 'WebAuthn & Apple FaceID / TouchID support',
    feat_1_d2: 'Automatic encrypted cloud enclave sync',
    feat_1_d3: 'Instant multi-account switching',

    feat_2_title: 'One Tap Swap',
    feat_2_sub: 'Smart Liquidity Engine',
    feat_2_desc: 'Swap any token across 40+ decentralized exchanges in one tap. Built-in MEV protection guarantees lowest slippage and zero hidden markups.',
    feat_2_d1: 'Deep routing across Uniswap, Curve & Aerodrome',
    feat_2_d2: 'Automated slippage guard',
    feat_2_d3: 'Zero extra platform protocol fees',

    feat_3_title: 'Cross Chain Bridge',
    feat_3_sub: 'Powered by LayerZero',
    feat_3_desc: 'Move native assets across Ethereum, Base, Solana, and 10+ networks without dealing with confusing wrapped tokens or dangerous bridges.',
    feat_3_d1: 'Sub-30 second cross-chain settlement',
    feat_3_d2: 'Native USDC transfer via Circle CCTP',
    feat_3_d3: 'Unified multi-network balance view',

    feat_4_title: 'Portfolio Tracking',
    feat_4_sub: 'Bank-Grade Financial Clarity',
    feat_4_desc: 'Live P&L calculations, historical return charts, staking rewards, and automated tax-ready reporting across every linked blockchain address.',
    feat_4_d1: 'Real-time price feeds via Chainlink',
    feat_4_d2: 'Historical cost basis calculation',
    feat_4_d3: 'DeFi LP and staking yield breakdowns',

    feat_5_title: 'Secure MPC Recovery',
    feat_5_sub: 'Multi-Party Computation',
    feat_5_desc: 'Never stress about losing your phrase again. Multi-Party Computation splits keys into encrypted shares with seamless social and cloud recovery.',
    feat_5_d1: '2-of-3 threshold signature scheme',
    feat_5_d2: 'AES-256 encrypted zero-knowledge backup',
    feat_5_d3: 'Trusted contact guardian recovery',

    feat_6_title: 'Fast Gasless Transfer',
    feat_6_sub: 'Send Like a Message',
    feat_6_desc: 'Transfer crypto to friends using phone numbers, usernames, ENS tags, or instant QR codes. Enjoy near-instant finality with zero gas fees on Hybit Pay.',
    feat_6_d1: 'Peer-to-peer phone number resolution',
    feat_6_d2: 'Scan-to-pay QR code generator',
    feat_6_d3: 'Batch transfers in single transaction',

    // Security Section
    sec_badge: 'BANK-GRADE DEFENSE',
    sec_title: 'Uncompromising Security Made Invisible',
    sec_subtitle: 'Cutting-edge cryptography protects your digital assets around the clock without compromising usability.',
    sec_1_title: 'Non-Custodial',
    sec_1_sub: 'True Sovereign Ownership',
    sec_1_desc: 'You maintain 100% mathematical ownership over your assets at all times. Hybit never holds your private keys, cannot freeze your funds, and cannot access your assets.',
    sec_1_badge: 'Zero Counterparty Risk',
    sec_1_p1: 'Cryptographic self-custody',
    sec_1_p2: 'Client-side signing only',
    sec_1_p3: 'EIP-4337 smart account native',

    sec_2_title: 'Open Source',
    sec_2_sub: 'Verifiable Transparency',
    sec_2_desc: 'Every line of our client-side software is publicly auditable on GitHub. We believe trust in financial infrastructure must be verifiable by the developer community.',
    sec_2_badge: 'Public GitHub Repos',
    sec_2_p1: 'Reproducible builds',
    sec_2_p2: 'Public bug bounty program ($500K)',
    sec_2_p3: 'Zero proprietary black boxes',

    sec_3_title: 'Audited Smart Contracts',
    sec_3_sub: 'Formally Verified',
    sec_3_desc: 'All Hybit smart account modules, bridge relayers, and swap routers undergo formal mathematical verification and exhaustive penetration testing.',
    sec_3_badge: 'Triple Audited',
    sec_3_p1: 'Audited by OpenZeppelin',
    sec_3_p2: 'Trail of Bits security review',
    sec_3_p3: 'Halborn pen-test certified',

    sec_4_title: 'MPC Ready',
    sec_4_sub: 'Multi-Party Computation',
    sec_4_desc: 'Cryptographic keys are split into threshold shares (2-of-3) distributed across your secure device enclave, encrypted cloud, and an independent recovery node.',
    sec_4_badge: 'Threshold Cryptography',
    sec_4_p1: 'No single point of failure',
    sec_4_p2: 'Loss prevention guarantee',
    sec_4_p3: 'Sub-second signature assembly',

    sec_5_title: 'Encrypted Recovery',
    sec_5_sub: 'AES-256-GCM Zero-Knowledge',
    sec_5_desc: 'Cloud backups are encrypted on your device before departure. Even cloud storage providers cannot read or reconstruct your key material.',
    sec_5_badge: 'End-to-End Encrypted',
    sec_5_p1: 'Military-grade AES-256-GCM',
    sec_5_p2: 'Zero-knowledge architecture',
    sec_5_p3: 'Biometric authorization required',

    sec_6_title: 'Biometric Enclave',
    sec_6_sub: 'Hardware Security Module',
    sec_6_desc: 'Transaction signing occurs inside Apple Secure Enclave and Android Keystore with biometric thumbprint or Face ID authentication.',
    sec_6_badge: 'Hardware Grade',
    sec_6_p1: 'Silicon-level Secure Enclave isolation',
    sec_6_p2: 'Hardware anti-tamper protection',
    sec_6_p3: 'Instant biometric signing approval',

    // Ecosystem Section
    eco_badge: 'MULTI-CHAIN NATIVE',
    eco_title: 'Supported Across Leading Blockchains',
    eco_subtitle: 'One unified portfolio operating seamlessly across the most active decentralized networks.',
    eco_active_ecosystems: '4 Active Ecosystems',

    // Wallet Preview Section
    preview_badge: 'INTERACTIVE DEMO',
    preview_title: 'Experience Hybit Simplicity',
    preview_subtitle: 'Test drive the one-tap swap engine and real-time interactive portfolio chart.',
    preview_tab_portfolio: 'Portfolio',
    preview_tab_swap: 'Swap Simulator',
    preview_swap_btn: 'Execute Simulated Swap',
    preview_swap_success: 'Swap Successfully Confirmed!',
    preview_you_pay: 'You Pay',
    preview_you_receive: 'You Receive',
    preview_rate: 'Rate:',
    preview_instant: 'Instant Swap',

    // FAQ Section
    faq_badge: 'FREQUENTLY ASKED QUESTIONS',
    faq_title: 'Everything You Need to Know',
    faq_subtitle: 'Clear answers about Hybit security, everyday operation, and self-custodial architecture.',
    faq_q1: 'How is Hybit different from traditional wallets like MetaMask?',
    faq_a1: 'Hybit is designed to feel as intuitive as everyday digital money. You never need to write down 24-word seed phrases, you never have to calculate gas fees (sponsored by Paymasters), and you can transfer assets using phone numbers or usernames.',
    faq_q2: 'Is Hybit truly non-custodial?',
    faq_a2: 'Yes, 100%. Hybit uses Multi-Party Computation (MPC) where cryptographic key shares are encrypted on your device. Hybit never has custody or authority over your funds.',
    faq_q3: 'What happens if I lose my phone or device?',
    faq_a3: 'You can restore your wallet effortlessly using your verified email and your zero-knowledge encrypted cloud biometric backup without losing any funds.',
    faq_q4: 'Are there hidden fees on swaps or transfers?',
    faq_a4: 'No hidden markups whatsoever. Hybit routes transactions through top decentralized liquidity pools with zero extra platform fees.',

    // CTA Section
    cta_badge: 'GET STARTED',
    cta_title: 'Ready for Crypto as Simple as a Single Tap?',
    cta_desc: 'Join thousands of users managing digital assets with effortless daily convenience and rigorous cryptographic security.',
    cta_button: 'Launch Hybit Web App',

    // Footer
    footer_desc: 'is the everyday crypto wallet where anyone can safely store, send, receive, swap, and manage digital assets with effortless self-custody.',
    footer_col_company: 'Company',
    footer_col_resources: 'Resources',
    footer_col_legal: 'Legal & Compliance',
    footer_about: 'About Us',
    footer_careers: 'Careers',
    footer_brand_assets: 'Brand Assets',
    footer_security_audits: 'Security & Audits',
    footer_docs: 'Documentation',
    footer_ecosystem: 'Ecosystem',
    footer_api: 'Developers API',
    footer_status: 'System Status',
    footer_privacy: 'Privacy Policy',
    footer_terms: 'Terms of Service',
    footer_bug_bounty: 'Bug Bounty',
    footer_disclosure: 'Responsible Disclosure',

    // Dashboard Layout & Header
    dash_address_title: 'Wallet Address',
    dash_copy_tooltip: 'Copy Address',
    dash_copied_tooltip: 'Address Copied!',
    dash_network_label: 'Active Network',
    dash_select_network: 'Select Active Network',
    dash_notifications: 'Notifications',
    dash_mark_read: 'Mark all as read',
    dash_no_unread: 'No unread notifications',

    // Dashboard Navigation
    dash_nav_home: 'Dashboard',
    dash_nav_portfolio: 'Portfolio',
    dash_nav_swap: 'Swap',
    dash_nav_activity: 'Activity',
    dash_nav_settings: 'Settings',

    // Dashboard Home
    dash_balance_label: 'Hybit Balance',
    dash_balance_today: 'Today',
    dash_multichain: 'Multi-Chain',
    dash_quick_send: 'Send',
    dash_quick_receive: 'Receive',
    dash_quick_swap: 'Swap',
    dash_quick_buy: 'Buy',
    dash_quick_bridge: 'Bridge',
    dash_holdings_title: 'Holdings',
    dash_holdings_desc: 'Assets held directly in your self-custody vault',
    dash_view_all: 'View All',
    dash_recent_activity: 'Recent Activity',
    dash_recent_activity_desc: 'Latest confirmed on-chain transactions',
    dash_full_history: 'Full History',
    dash_tx_fee_label: 'Fee',
    dash_tx_received_from: 'Received from',
    dash_tx_sent_to: 'Sent to',
    dash_tx_swapped: 'Swapped',
    dash_tx_bridged: 'Bridged',
    dash_balance_hidden: 'Balance Hidden',
    dash_balance_visible: 'Balance Visible',

    // Portfolio View
    port_net_assets: 'Net Assets Value',
    port_timeframe_1d: 'Last 24 Hours',
    port_timeframe_1w: 'Last 7 Days',
    port_timeframe_1m: 'Last 30 Days',
    port_timeframe_1y: 'Last 1 Year',
    port_timeframe_all: 'All Time',
    port_distribution_title: 'Multi-Chain Distribution',
    port_distribution_desc: '4 Active Ecosystems',
    port_search_placeholder: 'Search assets or tokens...',
    port_filter_all: 'All Networks',
    port_asset_column: 'Asset',
    port_price_column: 'Market Price',
    port_holdings_column: 'Holdings',
    port_pnl_column: '24h PnL',
    port_toast_title: 'Chart Timeframe',
    port_toast_desc: 'Chart timeframe updated to',

    // Activity View
    act_title: 'Activity Ledger',
    act_subtitle: 'Multi-chain settlements verified on-chain.',
    act_export_btn: 'Export CSV',
    act_export_notice: 'Exporting tax-compliant CSV report for tax year 2026...',
    act_filter_all: 'All',
    act_filter_sent: 'Sent',
    act_filter_received: 'Received',
    act_filter_swaps: 'Swaps',
    act_filter_bridges: 'Bridges',
    act_search_placeholder: 'Search transaction hash, sender, or token...',
    act_status_confirmed: 'Confirmed',
    act_status_pending: 'Pending',
    act_hash_copied: 'Transaction Hash Copied',
    act_modal_title: 'Transaction Details',

    // Settings View
    settings_title: 'Settings & Security',
    settings_subtitle: 'Manage your Privy embedded wallet, biometric security, and app preferences.',
    settings_saved_msg: 'Preferences updated and synced to encrypted enclave.',
    settings_wallet_details: 'Privy Embedded Wallet Details',
    settings_one_wallet: '1 Non-Custodial Wallet per Verified Email Account',
    settings_auth_provider: 'Privy Account Auth',
    settings_email_label: 'Connected Email',
    settings_type_label: 'Custody Architecture',
    settings_status_label: 'Verification Status',
    settings_active_badge: 'Verified & Active',
    settings_valuation_label: 'Total Portfolio Valuation',
    settings_policy_label: 'Account Policy:',
    settings_policy_text: '1 Email · 1 Wallet',
    settings_security_section: 'Security & Access Control',
    settings_passkey_title: 'Biometric Login / Passkey',
    settings_passkey_desc: 'Use Face ID, Touch ID, or Windows Hello for instant transaction approvals.',
    settings_autolock_title: 'Auto-Lock Timer',
    settings_autolock_desc: 'Automatically locks wallet session when idle',
    settings_autolock_select: 'Select Auto-Lock Timer',
    settings_pref_section: 'Preferences & Display',
    settings_language_title: 'App Language',
    settings_language_desc: 'Choose display language across the entire Hybit interface',
    settings_language_select: 'Select Language',
    settings_currency_title: 'Primary Currency',
    settings_currency_desc: 'Denomination for total wallet balance display',
    settings_currency_select: 'Select Primary Currency',
    settings_gas_title: 'Transaction Speed & Gas Preset',
    settings_gas_desc: 'Default priority fee tip for blockchain settlements',
    settings_gas_select: 'Select Gas Preset',
    settings_danger_section: 'Session Security & Wallet Lock',
    settings_lock_now: 'Lock Wallet Session',
    settings_lock_desc: 'Immediately lock active wallet session and require biometric re-authentication.',

    // Quick Action Modals
    modal_send_title: 'Send Crypto',
    modal_send_recipient: 'Recipient Address, ENS, or Phone Number',
    modal_send_amount: 'Transfer Amount',
    modal_send_balance: 'Available Balance:',
    modal_send_btn: 'Confirm & Send',
    modal_send_fee: 'Network Fee: Free (Sponsored by Paymaster)',

    modal_receive_title: 'Receive Crypto Assets',
    modal_receive_desc: 'Scan QR code or copy your non-custodial wallet address below.',
    modal_receive_address: 'Your Wallet Address',
    modal_receive_copy: 'Copy Address',
    modal_receive_copied: 'Address Copied!',
    modal_receive_networks: 'Supported Networks: Base, Ethereum, Solana, Arbitrum, Polygon',

    modal_swap_title: 'Instant Swap',
    modal_swap_pay: 'You Pay',
    modal_swap_receive: 'You Receive',
    modal_swap_rate: 'Exchange Rate:',
    modal_swap_slippage: 'Slippage Tolerance: 0.5% (MEV Protected)',
    modal_swap_route: 'Best Liquidity Route:',
    modal_swap_btn: 'Confirm & Execute Swap',

    modal_buy_title: 'Buy Crypto Instantly',
    modal_buy_method: 'Select Payment Method',
    modal_buy_amount: 'Purchase Amount (USD / IDR)',
    modal_buy_receive: 'Estimated Tokens Received:',
    modal_buy_btn: 'Proceed to Instant Checkout',

    modal_bridge_title: 'Cross-Chain Bridge',
    modal_bridge_from: 'Source Network',
    modal_bridge_to: 'Destination Network',
    modal_bridge_protocol: 'Protocol: LayerZero Omnichain Relayer',
    modal_bridge_time: 'Estimated Duration: ~30-60 seconds',
    modal_bridge_btn: 'Confirm Cross-Chain Bridge',

    modal_success_title: 'Transaction Successful!',
    modal_done_btn: 'Done',
    modal_close_btn: 'Close',

    // Refresh & Pull down
    refresh_pull: 'Pull down to refresh...',
    refresh_release: 'Release to refresh',
    refresh_syncing: 'Syncing blockchain data...',
    refresh_success_title: 'Hybit Data Successfully Updated',
    refresh_success_desc: 'Asset balances & multi-chain transactions synced successfully',

    // Loading Screen
    loading_init: 'Initializing MPC Enclave...',
    loading_sub: 'Crypto as Simple as a Single Tap',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (saved === 'id' || saved === 'en') {
        return saved;
      }
    } catch {
      // LocalStorage unavailable
    }
    return 'id'; // Default to Indonesian
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    } catch {
      // LocalStorage unavailable
    }
  };

  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch {
      // Ignore
    }
  }, [language]);

  const t = (key: string): string => {
    const langDict = translations[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English, then return key
    return translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
