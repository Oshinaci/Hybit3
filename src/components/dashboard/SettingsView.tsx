import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  Smartphone,
  Lock,
  Globe,
  CheckCircle2,
  Copy,
  Check,
  Wallet,
  Mail,
  ChevronDown,
  Zap,
  Languages,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useLanguage, LANGUAGE_OPTIONS } from '../../context/LanguageContext';
import { useCurrency, CURRENCY_OPTIONS } from '../../context/CurrencyContext';
import { useWallet } from '../../context/WalletContext';

export const SettingsView: React.FC = () => {
  const { showToast } = useToast();
  const { language, setLanguage, t } = useLanguage();
  const { currency, setCurrency, currencyObj, formatCurrency } = useCurrency();
  const { account, isConnected, ethBalance, openConnectModal } = useWallet();
  const [languageOpen, setLanguageOpen] = useState(false);
  const [passkeyEnabled, setPasskeyEnabled] = useState(true);
  const [autoLockTime, setAutoLockTime] = useState('5m');
  const [autoLockOpen, setAutoLockOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [gasPreset, setGasPreset] = useState<'instant' | 'standard' | 'eco'>('instant');
  const [gasPresetOpen, setGasPresetOpen] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const realEthAmount = ethBalance !== null ? parseFloat(ethBalance) : 0;
  const hasRegisteredEmail = isConnected && Boolean(account?.email);

  // Single Source of Truth: Real Privy Embedded Wallet
  const walletData = isConnected && account
    ? {
        name: account.name || 'Privy Embedded Wallet',
        email: hasRegisteredEmail ? (account.email as string) : (language === 'id' ? 'Belum terhubung' : 'Not connected'),
        isEmailVerified: hasRegisteredEmail,
        authProvider: t('settings_auth_provider'),
        type: language === 'id' ? 'MPC Non-Kustodial · 1 Email : 1 Dompet' : 'Non-Custodial MPC · 1 Email : 1 Wallet',
        address: account.address,
        balanceDisplay: `${realEthAmount.toFixed(4)} ETH`,
        status: language === 'id' ? 'Terverifikasi & Aktif' : 'Verified & Active',
      }
    : {
        name: 'Privy Embedded Wallet',
        email: language === 'id' ? 'Belum terhubung' : 'Not connected',
        isEmailVerified: false,
        authProvider: t('settings_auth_provider'),
        type: language === 'id' ? 'MPC Non-Kustodial · 1 Email : 1 Dompet' : 'Non-Custodial MPC · 1 Email : 1 Wallet',
        address: language === 'id' ? 'Dompet belum terhubung' : 'Wallet not connected',
        balanceDisplay: '0.0000 ETH',
        status: language === 'id' ? 'Belum Terhubung' : 'Not Connected',
      };

  const currentLanguageObj =
    LANGUAGE_OPTIONS.find((l) => l.code === language) || LANGUAGE_OPTIONS[0];

  const autoLockOptions = [
    {
      id: '1m',
      label: language === 'id' ? '1 Menit' : '1 Minute',
      desc: language === 'id' ? 'Keamanan tinggi · Cepat mengunci' : 'Highest security · Locks quickly',
    },
    {
      id: '5m',
      label: language === 'id' ? '5 Menit' : '5 Minutes',
      desc: language === 'id' ? 'Keseimbangan optimal (Disarankan)' : 'Optimal balance (Recommended)',
    },
    {
      id: '15m',
      label: language === 'id' ? '15 Menit' : '15 Minutes',
      desc: language === 'id' ? 'Sesi transaksi aktif diperpanjang' : 'Extended active trading session',
    },
    {
      id: '1h',
      label: language === 'id' ? '1 Jam' : '1 Hour',
      desc: language === 'id' ? 'Sesi desktop kerja panjang' : 'Extended desktop workspace',
    },
    {
      id: 'never',
      label: language === 'id' ? 'Jangan Pernah' : 'Never',
      desc: language === 'id' ? 'Tidak disarankan untuk perangkat bersama' : 'Not recommended for shared devices',
    },
  ];

  const gasPresetOptions = [
    {
      id: 'instant',
      label: language === 'id' ? 'Instan (Prioritas)' : 'Instant (Priority)',
      desc: language === 'id' ? 'Eksekusi super cepat (~1.2s) · Tip prioritas tinggi' : 'Supercharged execution (~1.2s) · High priority tip',
      badge: language === 'id' ? 'Tercepat' : 'Fastest',
    },
    {
      id: 'standard',
      label: language === 'id' ? 'Standar' : 'Standard',
      desc: language === 'id' ? 'Keseimbangan kecepatan (~3.0s) & biaya gas normal' : 'Optimal balance of speed (~3.0s) & normal gas fee',
      badge: language === 'id' ? 'Seimbang' : 'Balanced',
    },
    {
      id: 'eco',
      label: language === 'id' ? 'Hemat (Eco)' : 'Eco (Subsidized)',
      desc: language === 'id' ? 'Biaya gas paling hemat (~5.0s) · Penghematan biaya maksimal' : 'Lowest gas cost (~5.0s) · Max fee savings',
      badge: language === 'id' ? 'Hemat' : 'Low Fee',
    },
  ];

  const currentAutoLockObj = autoLockOptions.find((o) => o.id === autoLockTime) || autoLockOptions[1];
  const currentCurrencyObj = currencyObj;
  const currentGasPresetObj = gasPresetOptions.find((g) => g.id === gasPreset) || gasPresetOptions[0];

  const handleCopy = (address: string, id: string) => {
    navigator.clipboard?.writeText(address);
    setCopiedKey(id);
    showToast(language === 'id' ? 'Kunci Publik Disalin' : 'Public Key Copied', address, 'copy');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveNotice = (message?: string) => {
    setSavedNotice(true);
    showToast(t('settings_title'), message || t('settings_saved_msg'), 'success');
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="space-y-8 pb-28">
      
      {/* Title (Unboxed - No card) */}
      <div className="pb-4 border-b border-white/[0.08]">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{t('settings_title')}</h2>
        <p className="text-xs text-neutral-400 mt-1">
          {t('settings_subtitle')}
        </p>

        {savedNotice && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{t('settings_saved_msg')}</span>
          </div>
        )}
      </div>

      {/* 1. Privy Embedded Account & Wallet Details (Unboxed Section) */}
      <section className="space-y-4 pb-6 border-b border-white/[0.08]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">{t('settings_wallet_details')}</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0095FF]/15 text-[#0095FF] border border-[#0095FF]/20">
                Privy Auth
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              {t('settings_one_wallet')}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{language === 'id' ? 'Privy Terhubung' : 'Privy Connected'}</span>
          </div>
        </div>

        <div className="pt-2 space-y-4">
          
          {/* Linked Email Display */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0095FF]/15 text-[#0095FF] flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-neutral-400 font-medium">{t('settings_email_label')}</div>
                <div className="text-sm font-semibold text-white font-mono mt-0.5 flex items-center gap-2">
                  <span>{walletData.email}</span>
                  {walletData.isEmailVerified ? (
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-sans font-medium">
                      {language === 'id' ? 'Terverifikasi' : 'Verified'}
                    </span>
                  ) : (
                    <span className="text-[10px] text-neutral-400 bg-white/[0.06] border border-white/10 px-2 py-0.5 rounded-full font-sans font-medium">
                      {language === 'id' ? 'Belum Terhubung' : 'Not Connected'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="text-xs text-neutral-400 font-mono sm:text-right">
              <span className="text-neutral-500">{t('settings_policy_label')}</span> {t('settings_policy_text')}
            </div>
          </div>

          {/* The 1 Wallet Details (Unboxed Row) */}
          <div className="py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0095FF] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#0095FF]/20 mt-0.5">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{walletData.name}</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {walletData.status}
                  </span>
                </div>
                <div className="text-xs text-neutral-400 font-mono mt-0.5">{walletData.type}</div>
                <div className="flex items-center gap-2 mt-2 font-mono text-xs text-neutral-300">
                  <span className="truncate max-w-[220px] sm:max-w-sm">{walletData.address}</span>
                  <button
                    onClick={() => handleCopy(walletData.address, 'wallet')}
                    className="text-neutral-400 hover:text-white transition-colors cursor-pointer p-1 rounded-md hover:bg-white/[0.06]"
                    title={language === 'id' ? 'Salin Alamat' : 'Copy Address'}
                    aria-label="Copy Address"
                  >
                    {copiedKey === 'wallet' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="sm:text-right font-mono">
              <div className="text-xs text-neutral-400">{language === 'id' ? 'Total Saldo On-Chain' : 'Total On-Chain Balance'}</div>
              <div className="text-lg font-bold text-white">{walletData.balanceDisplay}</div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Security & Biometrics (Unboxed with Custom Hybit Theme Dropdowns) */}
      <section className="space-y-4 pb-6 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#0095FF]" />
          <h3 className="text-base font-bold text-white tracking-tight">{t('settings_security_section')}</h3>
        </div>

        <div className="divide-y divide-white/[0.06]">
          {/* Toggle Passkey */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="w-4 h-4 text-neutral-400" />
              <div>
                <div className="text-sm font-semibold text-white">{t('settings_passkey_title')}</div>
                <div className="text-xs text-neutral-400">{t('settings_passkey_desc')}</div>
              </div>
            </div>
            <button
              onClick={() => {
                setPasskeyEnabled(!passkeyEnabled);
                handleSaveNotice();
              }}
              className={`w-12 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                passkeyEnabled ? 'bg-[#0095FF]' : 'bg-neutral-700'
              }`}
              aria-label="Toggle Passkey"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  passkeyEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Custom Hybit Theme Dropdown: Auto-Lock Timer */}
          <div className="py-3.5 flex items-center justify-between relative">
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-neutral-400" />
              <div>
                <div className="text-sm font-semibold text-white">{t('settings_autolock_title')}</div>
                <div className="text-xs text-neutral-400">{t('settings_autolock_desc')}</div>
              </div>
            </div>

            {/* Custom Dropdown Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setAutoLockOpen(!autoLockOpen);
                  setLanguageOpen(false);
                  setCurrencyOpen(false);
                  setGasPresetOpen(false);
                }}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#141419] border border-white/10 hover:border-white/20 text-xs font-mono font-medium text-white transition-all cursor-pointer shadow-sm"
              >
                <span>{currentAutoLockObj.label}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${
                    autoLockOpen ? 'rotate-180 text-[#0095FF]' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {autoLockOpen && (
                  <>
                    {/* Click outside backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setAutoLockOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#141419] border border-white/10 shadow-2xl shadow-black p-1.5 z-50 space-y-0.5 backdrop-blur-2xl"
                    >
                      <div className="px-3 py-1 text-[10px] uppercase font-mono text-neutral-500 font-semibold border-b border-white/[0.06] mb-1">
                        {t('settings_autolock_select')}
                      </div>
                      {autoLockOptions.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setAutoLockTime(opt.id);
                            setAutoLockOpen(false);
                            handleSaveNotice();
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                            autoLockTime === opt.id
                              ? 'bg-[#0095FF]/15 text-white font-semibold'
                              : 'text-neutral-300 hover:bg-white/[0.06] hover:text-white'
                          }`}
                        >
                          <div>
                            <div className={autoLockTime === opt.id ? 'text-[#0095FF]' : 'text-neutral-200'}>
                              {opt.label}
                            </div>
                            <div className="text-[10px] text-neutral-400 mt-0.5">{opt.desc}</div>
                          </div>
                          {autoLockTime === opt.id && (
                            <Check className="w-3.5 h-3.5 text-[#0095FF] shrink-0 ml-2" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Preferences & Display (With Custom Hybit Theme Dropdowns) */}
      <section className="space-y-4 pb-6 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#0095FF]" />
          <h3 className="text-base font-bold text-white tracking-tight">{t('settings_pref_section')}</h3>
        </div>

        <div className="divide-y divide-white/[0.06]">
          {/* Custom Hybit Theme Dropdown: Language (Bahasa Indonesia & English Only) */}
          <div className="py-3.5 flex items-center justify-between relative">
            <div>
              <div className="text-sm font-semibold text-white flex items-center gap-2">
                <Languages className="w-4 h-4 text-[#0095FF]" />
                <span>{t('settings_language_title')}</span>
              </div>
              <div className="text-xs text-neutral-400 mt-0.5">{t('settings_language_desc')}</div>
            </div>

            {/* Custom Language Dropdown Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setLanguageOpen(!languageOpen);
                  setCurrencyOpen(false);
                  setAutoLockOpen(false);
                  setGasPresetOpen(false);
                }}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#141419] border border-white/10 hover:border-white/20 text-xs font-medium text-white transition-all cursor-pointer shadow-sm"
              >
                <span className="text-sm">{currentLanguageObj.flag}</span>
                <span className="font-semibold">{currentLanguageObj.label}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${
                    languageOpen ? 'rotate-180 text-[#0095FF]' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {languageOpen && (
                  <>
                    {/* Click outside backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setLanguageOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#141419] border border-white/10 shadow-2xl shadow-black p-1.5 z-50 space-y-0.5 backdrop-blur-2xl"
                    >
                      <div className="px-3 py-1 text-[10px] uppercase font-mono text-neutral-500 font-semibold border-b border-white/[0.06] mb-1">
                        {language === 'id' ? 'Pilih Bahasa' : 'Select Language'}
                      </div>
                      {LANGUAGE_OPTIONS.map((opt) => (
                        <button
                          key={opt.code}
                          type="button"
                          onClick={() => {
                            setLanguage(opt.code);
                            setLanguageOpen(false);
                            handleSaveNotice(
                              opt.code === 'id'
                                ? 'Bahasa aplikasi berhasil diubah ke Bahasa Indonesia.'
                                : 'App language successfully changed to English.'
                            );
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                            language === opt.code
                              ? 'bg-[#0095FF]/15 text-white font-semibold'
                              : 'text-neutral-300 hover:bg-white/[0.06] hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-base">{opt.flag}</span>
                            <div>
                              <div className={language === opt.code ? 'text-[#0095FF] font-semibold' : 'text-neutral-200'}>
                                {opt.label}
                              </div>
                              <div className="text-[10px] text-neutral-400">{opt.nativeName}</div>
                            </div>
                          </div>
                          {language === opt.code && (
                            <Check className="w-3.5 h-3.5 text-[#0095FF] shrink-0" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Custom Hybit Theme Dropdown: Primary Currency */}
          <div className="py-3.5 flex items-center justify-between relative">
            <div>
              <div className="text-sm font-semibold text-white">{t('settings_currency_title')}</div>
              <div className="text-xs text-neutral-400">{t('settings_currency_desc')}</div>
            </div>

            {/* Custom Dropdown Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setCurrencyOpen(!currencyOpen);
                  setAutoLockOpen(false);
                  setLanguageOpen(false);
                  setGasPresetOpen(false);
                }}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#141419] border border-white/10 hover:border-white/20 text-xs font-mono font-medium text-white transition-all cursor-pointer shadow-sm"
              >
                <span>{currentCurrencyObj.flag}</span>
                <span className="font-semibold text-[#0095FF]">{currentCurrencyObj.symbol}</span>
                <span>{currentCurrencyObj.code}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${
                    currencyOpen ? 'rotate-180 text-[#0095FF]' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {currencyOpen && (
                  <>
                    {/* Click outside backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setCurrencyOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#141419] border border-white/10 shadow-2xl shadow-black p-1.5 z-50 space-y-0.5 backdrop-blur-2xl"
                    >
                      <div className="px-3 py-1 text-[10px] uppercase font-mono text-neutral-500 font-semibold border-b border-white/[0.06] mb-1">
                        {t('settings_currency_select')}
                      </div>
                      {CURRENCY_OPTIONS.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            setCurrency(c.id);
                            setCurrencyOpen(false);
                            handleSaveNotice(
                              language === 'id'
                                ? `Mata Uang Utama diubah ke ${c.nameId} (${c.code}). Saldo diperbarui.`
                                : `Primary Currency changed to ${c.name} (${c.code}). Balances updated.`
                            );
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                            currency === c.id
                              ? 'bg-[#0095FF]/15 text-white font-semibold'
                              : 'text-neutral-300 hover:bg-white/[0.06] hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-base">{c.flag}</span>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className={currency === c.id ? 'text-[#0095FF] font-bold' : 'text-neutral-200'}>
                                  {c.code}
                                </span>
                                <span className="text-[11px] text-neutral-400 font-mono">({c.symbol})</span>
                              </div>
                              <div className="text-[10px] text-neutral-400">
                                {language === 'id' ? c.nameId : c.name}
                              </div>
                            </div>
                          </div>
                          {currency === c.id && (
                            <Check className="w-3.5 h-3.5 text-[#0095FF] shrink-0" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Custom Hybit Theme Dropdown: Default Gas Preset */}
          <div className="py-3.5 flex items-center justify-between relative">
            <div>
              <div className="text-sm font-semibold text-white">{t('settings_gas_title')}</div>
              <div className="text-xs text-neutral-400">{t('settings_gas_desc')}</div>
            </div>

            {/* Custom Dropdown Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setGasPresetOpen(!gasPresetOpen);
                  setAutoLockOpen(false);
                  setCurrencyOpen(false);
                  setLanguageOpen(false);
                }}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#141419] border border-white/10 hover:border-white/20 text-xs font-mono font-medium text-white transition-all cursor-pointer shadow-sm"
              >
                <Zap className="w-3.5 h-3.5 text-[#0095FF]" />
                <span>{currentGasPresetObj.badge}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${
                    gasPresetOpen ? 'rotate-180 text-[#0095FF]' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {gasPresetOpen && (
                  <>
                    {/* Click outside backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setGasPresetOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#141419] border border-white/10 shadow-2xl shadow-black p-1.5 z-50 space-y-0.5 backdrop-blur-2xl"
                    >
                      <div className="px-3 py-1 text-[10px] uppercase font-mono text-neutral-500 font-semibold border-b border-white/[0.06] mb-1">
                        {t('settings_gas_select')}
                      </div>
                      {gasPresetOptions.map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => {
                            setGasPreset(g.id as any);
                            setGasPresetOpen(false);
                            handleSaveNotice();
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                            gasPreset === g.id
                              ? 'bg-[#0095FF]/15 text-white font-semibold'
                              : 'text-neutral-300 hover:bg-white/[0.06] hover:text-white'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={gasPreset === g.id ? 'text-[#0095FF]' : 'text-neutral-200'}>
                                {g.label}
                              </span>
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-neutral-400">
                                {g.badge}
                              </span>
                            </div>
                            <div className="text-[10px] text-neutral-400 mt-0.5">{g.desc}</div>
                          </div>
                          {gasPreset === g.id && (
                            <Check className="w-3.5 h-3.5 text-[#0095FF] shrink-0 ml-2" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Danger Zone / Emergency Lock (Unboxed) */}
      <section className="space-y-4 pt-2">
        <h3 className="text-base font-bold text-white tracking-tight">{t('settings_danger_section')}</h3>
        <div className="py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-rose-400">{t('settings_lock_now')}</div>
            <div className="text-xs text-neutral-400">{t('settings_lock_desc')}</div>
          </div>
          <button
            onClick={() => {
              showToast(
                language === 'id' ? 'Sesi Dompet Dikunci' : 'Wallet Session Locked',
                language === 'id'
                  ? 'Kunci biometrik diaktifkan. Harap autentikasi ulang dengan Passkey.'
                  : 'Biometric lock engaged. Please re-authenticate with Passkey.',
                'warning'
              );
            }}
            className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition-colors cursor-pointer border border-rose-500/20 self-start sm:self-auto"
          >
            {t('settings_lock_now')}
          </button>
        </div>
      </section>

    </div>
  );
};
