import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, KeyRound, ShieldCheck, ArrowRight, Wallet, CheckCircle2 } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { useLanguage } from '../../context/LanguageContext';

export const ConnectWalletModal: React.FC = () => {
  const { isConnectModalOpen, closeConnectModal, connect, isConnecting } = useWallet();
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'email' | 'passkey'>('email');

  if (!isConnectModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    closeConnectModal();
    await connect();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeConnectModal}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md rounded-3xl bg-[#141419] border border-white/15 p-6 sm:p-7 shadow-2xl shadow-black text-white z-10 space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0095FF] text-white flex items-center justify-center shadow-lg shadow-[#0095FF]/20">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {language === 'id' ? 'Hubungkan Dompet' : 'Connect Wallet'}
                </h3>
                <p className="text-xs text-neutral-400">
                  {language === 'id' ? 'Privy MPC Embedded Authentication' : 'Privy MPC Embedded Authentication'}
                </p>
              </div>
            </div>

            <button
              onClick={closeConnectModal}
              className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-neutral-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Method Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#101015] border border-white/[0.06]">
            <button
              type="button"
              onClick={() => setSelectedMethod('email')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedMethod === 'email'
                  ? 'bg-[#0095FF] text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{language === 'id' ? 'Email OTP' : 'Email OTP'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('passkey')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedMethod === 'passkey'
                  ? 'bg-[#0095FF] text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{language === 'id' ? 'Passkey / Biometrik' : 'Passkey / Biometric'}</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {selectedMethod === 'email' ? (
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  {language === 'id' ? 'Alamat Email Anda' : 'Your Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#1C1C23] border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#0095FF]"
                  />
                </div>
                <p className="text-[11px] text-neutral-400 mt-1.5">
                  {language === 'id'
                    ? '1 Email = 1 Dompet Mandiri tanpa perlu menghafal frasa kertas.'
                    : '1 Email = 1 Self-custody wallet with zero paper seed phrases.'}
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{language === 'id' ? 'Otentikasi Perangkat Siap' : 'Device Authenticator Ready'}</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {language === 'id'
                    ? 'Gunakan TouchID, FaceID, atau Windows Hello pada perangkat ini untuk mengamankan pecahan MPC.'
                    : 'Use TouchID, FaceID, or Windows Hello on this device to secure your MPC shard.'}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isConnecting}
              className="w-full py-3.5 rounded-xl bg-[#0095FF] hover:bg-[#0080E0] text-white font-semibold text-sm shadow-lg shadow-[#0095FF]/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isConnecting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{language === 'id' ? 'Menghubungkan Sesi...' : 'Connecting Session...'}</span>
                </>
              ) : (
                <>
                  <span>
                    {language === 'id' ? 'Hubungkan Dompet Sekarang' : 'Connect Wallet Now'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security footnote */}
          <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-neutral-500 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Non-Custodial · MPC Architecture · Zero Seed Phrase</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
