import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  Download,
  Repeat,
  CreditCard,
  QrCode,
  Eye,
  EyeOff,
  Bell,
  TrendingUp,
  History,
  Home,
  User,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { EthereumIcon, SolanaIcon, CircleIcon, HybitLogoIcon } from './icons/NetworkIcons';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

export const PhoneMockup: React.FC = () => {
  const { showToast } = useToast();
  const { t, language } = useLanguage();
  const [balanceHidden, setBalanceHidden] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'swap' | 'card' | 'history'>('home');
  const [activeActionModal, setActiveActionModal] = useState<string | null>(null);

  const tokens = [
    {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: '2.45 ETH',
      fiat: '$8,383.90',
      change: '+4.2%',
      isPositive: true,
      icon: <EthereumIcon className="w-5 h-5 text-white" />,
      bg: 'bg-indigo-600',
    },
    {
      symbol: 'SOL',
      name: 'Solana',
      balance: '24.8 SOL',
      fiat: '$4,575.60',
      change: '+7.8%',
      isPositive: true,
      icon: <SolanaIcon className="w-5 h-5 text-white" />,
      bg: 'bg-emerald-600',
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      balance: '1,861.00 USDC',
      fiat: '$1,861.00',
      change: '0.0%',
      isPositive: true,
      icon: <CircleIcon className="w-5 h-5 text-white" />,
      bg: 'bg-sky-600',
    },
  ];

  const activities = [
    {
      id: '1',
      title: language === 'id' ? 'Diterima dari alex.eth' : 'Received from alex.eth',
      time: language === 'id' ? '12 mnt lalu' : '12m ago',
      amount: '+250.00 USDC',
      isPositive: true,
      icon: ArrowDownLeft,
      color: 'text-emerald-400 bg-emerald-500/10',
    },
    {
      id: '2',
      title: language === 'id' ? 'Tukar ETH → SOL' : 'Swapped ETH → SOL',
      time: language === 'id' ? '2 jam lalu' : '2h ago',
      amount: '0.4 ETH ($1,368)',
      isPositive: false,
      icon: Repeat,
      color: 'text-[#0095FF] bg-[#0095FF]/10',
    },
    {
      id: '3',
      title: 'Blue Bottle Coffee · Hybit Pay',
      time: language === 'id' ? '5 jam lalu' : '5h ago',
      amount: '-$6.40 USDC',
      isPositive: false,
      icon: ArrowUpRight,
      color: 'text-neutral-300 bg-white/10',
    },
  ];

  const handleAction = (action: string) => {
    setActiveActionModal(action);
    setTimeout(() => {
      setActiveActionModal(null);
    }, 2500);
  };

  return (
    <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[370px]">
      {/* Titanium Frame */}
      <div className="relative rounded-[46px] p-[10px] bg-[#27272A] shadow-2xl shadow-black border border-white/20 select-none transition-transform duration-300">
        
        {/* Inner Phone Screen */}
        <div className="relative rounded-[38px] bg-[#09090B] overflow-hidden border border-white/10 text-white font-sans flex flex-col min-h-[640px] sm:min-h-[660px]">
          
          {/* Top Status Bar & Dynamic Island */}
          <div className="px-6 pt-3 pb-2 flex items-center justify-between text-[11px] text-neutral-400 tracking-tight font-medium">
            <span>9:41</span>
            {/* Dynamic Island */}
            <div className="w-20 h-4 bg-black rounded-full flex items-center justify-center px-2 border border-white/10">
              <span className="text-[11px] font-chinese text-neutral-200">Hybit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <div className="w-5 h-2.5 rounded-sm border border-neutral-400 p-0.5 flex items-center">
                <div className="h-full w-full bg-emerald-400 rounded-2xs" />
              </div>
            </div>
          </div>

          {/* Wallet Header */}
          <div className="px-5 pt-2 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#0095FF] flex items-center justify-center text-white select-none p-1.5 shadow-md shadow-[#0095FF]/30">
                <HybitLogoIcon size={22} color="#FFFFFF" />
              </div>
              <div>
                <div className="flex items-center gap-1 cursor-pointer">
                  <span className="text-xs font-semibold text-white">Privy Embedded Wallet</span>
                </div>
                <div className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
                  <span>0x7F2...8b1e</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setBalanceHidden(!balanceHidden)}
                aria-label="Toggle balance privacy"
                className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                {balanceHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
              <button 
                aria-label="Notifications"
                className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center text-neutral-400 hover:text-white transition-colors relative cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#0095FF] rounded-full" />
              </button>
            </div>
          </div>

          {/* Main Scrollable Content */}
          <div className="px-4 flex-1 pb-16 overflow-y-auto space-y-3.5">
            
            {/* Signature Gradient Balance Card */}
            <div className="relative rounded-2xl bg-[#0095FF] p-4 text-white shadow-lg shadow-[#0095FF]/20 overflow-hidden border border-white/20">
              <div className="relative z-10">
                <div className="flex items-center justify-between text-xs text-white/90">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium tracking-wide flex items-center gap-1.5">
                      <span className="font-chinese text-base sm:text-lg">Hybit</span>
                      <span className="text-white/70">~</span>
                      <span>{language === 'id' ? 'Saldo' : 'Balance'}</span>
                    </span>
                  </div>
                  <button
                    onClick={() => setBalanceHidden(!balanceHidden)}
                    className="p-1 rounded-full bg-white/15 hover:bg-white/25 transition-colors cursor-pointer"
                    aria-label="Toggle balance"
                  >
                    {balanceHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3 text-white" />}
                  </button>
                </div>

                <div className="mt-2 mb-1">
                  <div className="text-2xl sm:text-[28px] font-bold tracking-tight font-mono">
                    {balanceHidden ? '••••••••' : '$14,820.50'}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 text-[11px] font-medium text-white bg-white/20 px-2 py-0.5 rounded-full">
                    <TrendingUp className="w-3 h-3 text-white" />
                    <span>+$1,142.30 (+8.4%) {language === 'id' ? 'Hari Ini' : 'Today'}</span>
                  </div>
                  <span className="text-[10px] text-white/80 font-medium">Multi-Chain</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Bar (Send, Receive, Swap, Buy) */}
            <div className="grid grid-cols-4 gap-2 py-1">
              {[
                { label: language === 'id' ? 'Kirim' : 'Send', icon: Send, id: 'send', color: 'bg-white/10 text-white' },
                { label: language === 'id' ? 'Terima' : 'Receive', icon: Download, id: 'receive', color: 'bg-white/10 text-white' },
                { label: language === 'id' ? 'Tukar' : 'Swap', icon: Repeat, id: 'swap', color: 'bg-white/10 text-[#00E5FF]' },
                { label: language === 'id' ? 'Beli' : 'Buy', icon: CreditCard, id: 'buy', color: 'bg-white/10 text-emerald-400' },
              ].map((act) => {
                const Icon = act.icon;
                return (
                  <button
                    key={act.id}
                    onClick={() => handleAction(act.label)}
                    className="flex flex-col items-center gap-1.5 group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#18181B] border border-white/10 flex items-center justify-center text-neutral-200 group-hover:border-[#0095FF]/60 group-hover:text-white group-hover:bg-[#222226] group-active:scale-95 transition-all shadow-sm">
                      <Icon className="w-5 h-5 text-[#0095FF] group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-[11px] font-medium text-neutral-300 group-hover:text-white">
                      {act.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Simulated Action Alert when clicked */}
            <AnimatePresence>
              {activeActionModal && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="p-2.5 rounded-xl bg-[#0095FF]/15 border border-[#0095FF]/30 text-xs flex items-center justify-between text-[#00E5FF]"
                >
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    {language === 'id'
                      ? `${activeActionModal} dibuka! (Gunakan tombol Buka Aplikasi)`
                      : `${activeActionModal} opened! (Try full Web App modal)`}
                  </span>
                  <button
                    onClick={() => setActiveActionModal(null)}
                    className="text-[10px] underline text-neutral-400 hover:text-white"
                  >
                    {language === 'id' ? 'Tutup' : 'Dismiss'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Token Portfolio List */}
            <div className="rounded-2xl bg-[#141417] border border-white/[0.07] p-3 space-y-2">
              <div className="flex items-center justify-between px-1 text-xs text-neutral-400 font-medium">
                <span>{language === 'id' ? 'Daftar Aset' : 'Holdings'}</span>
                <span className="text-[#0095FF] text-[11px] hover:underline cursor-pointer">
                  {language === 'id' ? 'Lihat Semua' : 'View All'}
                </span>
              </div>

              <div className="space-y-1.5">
                {tokens.map((token) => (
                  <div
                    key={token.symbol}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl ${token.bg} flex items-center justify-center shadow-sm`}>
                        {token.icon}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">{token.symbol}</div>
                        <div className="text-[10px] text-neutral-400">{token.name}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-semibold text-white font-mono">
                        {balanceHidden ? '••••' : token.fiat}
                      </div>
                      <div className="text-[10px] text-emerald-400 font-mono">{token.change}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl bg-[#141417] border border-white/[0.07] p-3 space-y-2">
              <div className="flex items-center justify-between px-1 text-xs text-neutral-400 font-medium">
                <span>{language === 'id' ? 'Aktivitas Terkini' : 'Recent Activity'}</span>
                <History className="w-3.5 h-3.5 text-neutral-500" />
              </div>

              <div className="space-y-2">
                {activities.map((act) => {
                  const Icon = act.icon;
                  return (
                    <div
                      key={act.id}
                      className="flex items-center justify-between p-1.5 rounded-xl hover:bg-white/[0.03] transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg ${act.color} flex items-center justify-center`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-[11px] font-medium text-white truncate max-w-[130px]">
                            {act.title}
                          </div>
                          <div className="text-[9px] text-neutral-500 font-mono">{act.time}</div>
                        </div>
                      </div>
                      <span className={`text-[11px] font-mono font-medium ${act.isPositive ? 'text-emerald-400' : 'text-neutral-300'}`}>
                        {balanceHidden ? '••••' : act.amount}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Floating Center QR Scan Button (Prominent Action) */}
          <div className="absolute bottom-16 left-0 right-0 flex justify-center pointer-events-none z-20">
            <button
              onClick={() => handleAction(language === 'id' ? 'Pindai QR' : 'Scan QR Code')}
              aria-label="Scan QR Code to pay or transfer"
              className="pointer-events-auto flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0095FF] hover:bg-[#0080E0] text-white text-xs font-semibold shadow-md shadow-[#0095FF]/30 border border-white/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-white" />
              <span>{language === 'id' ? 'Pindai Bayar' : 'Scan to Pay'}</span>
            </button>
          </div>

          {/* Bottom Navigation */}
          <div className="absolute bottom-0 left-0 right-0 h-14 bg-[#0E0E12] border-t border-white/[0.08] px-4 flex items-center justify-around z-10 text-neutral-400 text-[10px]">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-0.5 ${activeTab === 'home' ? 'text-[#0095FF]' : 'hover:text-white'}`}
            >
              <Home className="w-4 h-4" />
              <span>{language === 'id' ? 'Beranda' : 'Home'}</span>
            </button>
            <button
              onClick={() => setActiveTab('swap')}
              className={`flex flex-col items-center gap-0.5 ${activeTab === 'swap' ? 'text-[#0095FF]' : 'hover:text-white'}`}
            >
              <Repeat className="w-4 h-4" />
              <span>{language === 'id' ? 'Tukar' : 'Swap'}</span>
            </button>
            
            {/* Center space reserved for the floating Scan button */}
            <div className="w-8" />

            <button
              onClick={() => setActiveTab('card')}
              className={`flex flex-col items-center gap-0.5 ${activeTab === 'card' ? 'text-[#0095FF]' : 'hover:text-white'}`}
            >
              <CreditCard className="w-4 h-4" />
              <span>{language === 'id' ? 'Kartu' : 'Card'}</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex flex-col items-center gap-0.5 ${activeTab === 'history' ? 'text-[#0095FF]' : 'hover:text-white'}`}
            >
              <User className="w-4 h-4" />
              <span>{language === 'id' ? 'Brankas' : 'Vault'}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
