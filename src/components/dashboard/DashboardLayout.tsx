import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  PieChart,
  History,
  Settings,
  Bell,
  Copy,
  Check,
  ChevronDown,
  Repeat,
  Wallet,
  LogOut,
} from 'lucide-react';
import { DashboardPage, NetworkOption, NotificationItem } from '../../types/dashboard';
import { EthereumIcon, BaseIcon, SolanaIcon, ArbitrumIcon, PolygonIcon, OptimismIcon } from '../icons/NetworkIcons';
import { PullToRefresh } from '../refresh/PullToRefresh';
import { useLanguage } from '../../context/LanguageContext';
import { useWallet } from '../../context/WalletContext';
import { ConnectWalletModal } from '../common/ConnectWalletModal';
import { formatAddress } from '../../lib/wallet/address';

interface DashboardLayoutProps {
  currentPage: DashboardPage;
  onPageChange: (page: DashboardPage) => void;
  onBackToLanding: () => void;
  onQuickAction: (action: 'send' | 'receive' | 'swap' | 'buy' | 'bridge') => void;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentPage,
  onPageChange,
  onBackToLanding,
  onQuickAction,
  isRefreshing = false,
  onRefresh,
  children,
}) => {
  const { t, language } = useLanguage();
  const { account, isConnected, openConnectModal, disconnect } = useWallet();
  const [copied, setCopied] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState('base');
  const [networkDropdownOpen, setNetworkDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const networks: NetworkOption[] = [
    { id: 'base', name: 'Base Sepolia', symbol: 'ETH', iconColor: 'text-[#0095FF]', badge: 'Live (84532)', isL2: true, available: true },
    { id: 'ethereum', name: 'Ethereum Mainnet', symbol: 'ETH', iconColor: 'text-indigo-400', badge: language === 'id' ? 'Segera Hadir' : 'Coming Soon', isL2: false, available: false },
    { id: 'arbitrum', name: 'Arbitrum One', symbol: 'ETH', iconColor: 'text-blue-400', badge: language === 'id' ? 'Segera Hadir' : 'Coming Soon', isL2: true, available: false },
    { id: 'solana', name: 'Solana', symbol: 'SOL', iconColor: 'text-emerald-400', badge: language === 'id' ? 'Segera Hadir' : 'Coming Soon', isL2: false, available: false },
  ];

  const currentNetworkObj = networks.find((n) => n.id === selectedNetwork) || networks[0];

  const defaultNotifications: NotificationItem[] = isConnected
    ? [
        {
          id: 'n-1',
          title: language === 'id' ? 'Sesi Dompet Privy Aktif' : 'Privy Wallet Session Active',
          message:
            language === 'id'
              ? 'Dompet MPC Base Sepolia terhubung dan diverifikasi.'
              : 'Base Sepolia MPC wallet connected and verified.',
          time: language === 'id' ? 'Baru saja' : 'Just now',
          read: true,
          type: 'security',
        },
      ]
    : [];

  const [notifications, setNotifications] = useState<NotificationItem[]>(defaultNotifications);

  React.useEffect(() => {
    setNotifications(defaultNotifications);
  }, [language, isConnected]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleCopy = () => {
    if (!account) return;
    navigator.clipboard?.writeText(account.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getNetworkIcon = (id: string) => {
    switch (id) {
      case 'base':
        return <BaseIcon className="w-4 h-4 text-[#0095FF]" />;
      case 'ethereum':
        return <EthereumIcon className="w-4 h-4 text-indigo-400" />;
      case 'solana':
        return <SolanaIcon className="w-4 h-4 text-emerald-400" />;
      case 'arbitrum':
        return <ArbitrumIcon className="w-4 h-4 text-blue-400" />;
      case 'polygon':
        return <PolygonIcon className="w-4 h-4 text-purple-400" />;
      case 'optimism':
        return <OptimismIcon className="w-4 h-4 text-red-500" />;
      default:
        return <BaseIcon className="w-4 h-4 text-white" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white flex flex-col overflow-x-hidden selection:bg-[#0095FF]/30 pb-28">
      
      {/* 1. TOPBAR: Transparent background, no logo/arrow/name, elements styled as cards */}
      <header className="sticky top-0 z-40 bg-transparent px-4 sm:px-6 pt-4 pb-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Left: Connect Wallet Button OR Connected Wallet Address Card */}
          {!isConnected || !account ? (
            <button
              onClick={openConnectModal}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-2xl bg-[#0095FF] hover:bg-[#0080E0] text-white text-xs font-semibold shadow-lg shadow-[#0095FF]/25 active:scale-[0.98] transition-all cursor-pointer group"
            >
              <Wallet className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span>{language === 'id' ? 'Hubungkan Dompet' : 'Connect Wallet'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl bg-[#141419] border border-white/10 shadow-lg shadow-black/40 hover:border-white/20 transition-all">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
              <span className="text-xs font-mono font-medium text-neutral-200">
                {formatAddress(account.address)}
              </span>
              <button
                onClick={handleCopy}
                className="text-neutral-400 hover:text-white transition-colors ml-0.5 p-1 rounded-lg hover:bg-white/[0.06] cursor-pointer"
                title={language === 'id' ? 'Salin Alamat' : 'Copy Address'}
                aria-label="Copy Address"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={disconnect}
                className="text-neutral-400 hover:text-rose-400 transition-colors ml-0.5 p-1 rounded-lg hover:bg-white/[0.06] cursor-pointer"
                title={language === 'id' ? 'Putuskan Sambungan' : 'Disconnect'}
                aria-label="Disconnect"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Right: Network Selector Card + Notification Bell Card */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Network Selector Card */}
            <div className="relative">
              <button
                onClick={() => {
                  setNetworkDropdownOpen(!networkDropdownOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#141419] border border-white/10 hover:border-white/20 shadow-lg shadow-black/40 text-xs font-medium text-white transition-all cursor-pointer group"
                aria-label="Select Network"
              >
                {getNetworkIcon(currentNetworkObj.id)}
                <span className="hidden sm:inline font-medium">{currentNetworkObj.name}</span>
                <motion.div
                  animate={{ rotate: networkDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center justify-center shrink-0"
                >
                  <ChevronDown className={`w-3.5 h-3.5 transition-colors ${networkDropdownOpen ? 'text-[#0095FF]' : 'text-neutral-400 group-hover:text-white'}`} />
                </motion.div>
              </button>

              <AnimatePresence>
                {networkDropdownOpen && (
                  <>
                    {/* Backdrop overlay for closing dropdown on click outside */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setNetworkDropdownOpen(false)}
                    />

                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-[#141419] border border-white/12 shadow-2xl shadow-black p-3 z-50 space-y-2 backdrop-blur-xl"
                    >
                      {/* Header */}
                      <div className="px-2 pt-1 pb-2 border-b border-white/[0.07] flex items-center justify-between">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                          {t('dash_select_network')}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-500">
                          1 Active
                        </span>
                      </div>

                      {/* Network List */}
                      <div className="space-y-1.5 pt-0.5">
                        {networks.map((net) => {
                          const isSelected = selectedNetwork === net.id;
                          const isAvailable = Boolean(net.available);

                          return (
                            <motion.button
                              key={net.id}
                              disabled={!isAvailable}
                              whileTap={isAvailable ? { scale: 0.98 } : undefined}
                              onClick={() => {
                                if (isAvailable) {
                                  setSelectedNetwork(net.id);
                                  setNetworkDropdownOpen(false);
                                }
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all text-left ${
                                isSelected
                                  ? 'bg-[#0095FF]/15 border border-[#0095FF]/35 text-white font-semibold shadow-sm'
                                  : isAvailable
                                  ? 'hover:bg-white/[0.06] text-neutral-200 cursor-pointer border border-transparent'
                                  : 'opacity-40 cursor-not-allowed bg-transparent border border-transparent text-neutral-400'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center shrink-0">
                                  {getNetworkIcon(net.id)}
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="font-semibold text-white tracking-tight truncate">
                                    {net.name}
                                  </span>
                                  <span className="text-[10px] font-mono text-neutral-400 mt-0.5">
                                    {isAvailable ? 'EVM Layer 2' : net.symbol}
                                  </span>
                                </div>
                              </div>

                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                                  isAvailable
                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-medium'
                                    : 'bg-white/[0.04] text-neutral-400 border border-white/[0.08]'
                                }`}
                              >
                                {net.badge}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Notification Bell Card */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setNetworkDropdownOpen(false);
                }}
                className="p-2.5 rounded-2xl bg-[#141419] border border-white/10 hover:border-white/20 shadow-lg shadow-black/40 text-neutral-300 hover:text-white transition-all relative cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#0095FF]" />
                )}
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#141419] border border-white/10 shadow-2xl shadow-black p-4 z-50 space-y-2"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                      <span className="text-xs font-bold text-white">{t('dash_notifications')}</span>
                      <button
                        onClick={() => {
                          setNotifications(notifications.map((n) => ({ ...n, read: true })));
                        }}
                        className="text-[10px] text-[#0095FF] hover:underline cursor-pointer"
                      >
                        {t('dash_mark_read')}
                      </button>
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-2.5 rounded-xl border text-xs transition-colors ${
                            notif.read
                              ? 'bg-transparent border-transparent text-neutral-400'
                              : 'bg-white/[0.03] border-white/[0.06] text-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-white">{notif.title}</span>
                            <span className="text-[10px] text-neutral-500 font-mono">{notif.time}</span>
                          </div>
                          <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                            {notif.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>
      </header>

      {/* 2. MAIN CONTENT VIEWPORT (With PullToRefresh and Hybit text fill animation) */}
      <PullToRefresh
        onRefresh={() => onRefresh?.()}
        isRefreshing={isRefreshing}
        className="flex-1 flex flex-col"
      >
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-4 sm:py-6 min-w-0">
          {children}
        </main>
      </PullToRefresh>

      {/* 3. CAPSULE BOTTOM NAVBAR: Extended width to fit user phone nicely, glasses animation, no labels, solid center button */}
      <nav 
        aria-label="Bottom Navigation"
        className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto w-[calc(100%-1.25rem)] max-w-xl sm:max-w-2xl px-1"
      >
        <div className="w-full flex items-center justify-around sm:justify-between px-2 sm:px-8 py-2.5 rounded-full bg-[#141419]/95 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/90">
          
          {/* Item 1: Dashboard */}
          <button
            onClick={() => onPageChange('dashboard')}
            aria-label={language === 'id' ? 'Beranda' : 'Dashboard'}
            title={language === 'id' ? 'Beranda' : 'Dashboard'}
            className="relative flex-1 max-w-[56px] h-11 rounded-full flex items-center justify-center transition-colors cursor-pointer group"
          >
            {currentPage === 'dashboard' && (
              <motion.div
                layoutId="glassesLens"
                className="absolute inset-0 rounded-full bg-white/[0.12] backdrop-blur-md border border-white/20 shadow-inner"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              />
            )}
            <LayoutDashboard
              className={`w-5 h-5 relative z-10 transition-colors ${
                currentPage === 'dashboard' ? 'text-[#0095FF]' : 'text-neutral-400 group-hover:text-white'
              }`}
            />
          </button>

          {/* Item 2: Portfolio */}
          <button
            onClick={() => onPageChange('portfolio')}
            aria-label={language === 'id' ? 'Portofolio' : 'Portfolio'}
            title={language === 'id' ? 'Portofolio' : 'Portfolio'}
            className="relative flex-1 max-w-[56px] h-11 rounded-full flex items-center justify-center transition-colors cursor-pointer group"
          >
            {currentPage === 'portfolio' && (
              <motion.div
                layoutId="glassesLens"
                className="absolute inset-0 rounded-full bg-white/[0.12] backdrop-blur-md border border-white/20 shadow-inner"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              />
            )}
            <PieChart
              className={`w-5 h-5 relative z-10 transition-colors ${
                currentPage === 'portfolio' ? 'text-[#0095FF]' : 'text-neutral-400 group-hover:text-white'
              }`}
            />
          </button>

          {/* Item 3: CENTER ITEM (ELEVATED DISTINCT FLOATING SWAP BUTTON) */}
          <div className="relative -translate-y-3.5 sm:-translate-y-4 px-1 sm:px-2 shrink-0">
            <button
              onClick={() => onQuickAction('swap')}
              aria-label={language === 'id' ? 'Tukar Token' : 'Quick Swap Engine'}
              title={language === 'id' ? 'Tukar Token' : 'Quick Swap Engine'}
              className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-2xl sm:rounded-full bg-[#0095FF] hover:bg-[#0080E0] text-white shadow-xl shadow-[#0095FF]/35 border-2 border-white/30 flex flex-col items-center justify-center p-1 hover:scale-105 active:scale-95 transition-all cursor-pointer group ring-4 ring-[#141419]"
            >
              <div className="w-full h-full flex flex-col items-center justify-center">
                <Repeat className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white group-hover:rotate-180 transition-transform duration-300" />
                <span className="text-[8px] font-bold uppercase tracking-wider text-white/90 mt-0.5 font-mono">
                  {language === 'id' ? 'Tukar' : 'Swap'}
                </span>
              </div>
            </button>
          </div>

          {/* Item 4: Activity */}
          <button
            onClick={() => onPageChange('activity')}
            aria-label={language === 'id' ? 'Aktivitas' : 'Activity'}
            title={language === 'id' ? 'Aktivitas' : 'Activity'}
            className="relative flex-1 max-w-[56px] h-11 rounded-full flex items-center justify-center transition-colors cursor-pointer group"
          >
            {currentPage === 'activity' && (
              <motion.div
                layoutId="glassesLens"
                className="absolute inset-0 rounded-full bg-white/[0.12] backdrop-blur-md border border-white/20 shadow-inner"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              />
            )}
            <History
              className={`w-5 h-5 relative z-10 transition-colors ${
                currentPage === 'activity' ? 'text-[#0095FF]' : 'text-neutral-400 group-hover:text-white'
              }`}
            />
          </button>

          {/* Item 5: Settings (Privy Embedded Wallet & Preferences) */}
          <button
            onClick={() => onPageChange('settings')}
            aria-label={language === 'id' ? 'Pengaturan' : 'Settings'}
            title={language === 'id' ? 'Pengaturan' : 'Settings'}
            className="relative flex-1 max-w-[56px] h-11 rounded-full flex items-center justify-center transition-colors cursor-pointer group"
          >
            {(currentPage === 'settings' || currentPage === 'wallet') && (
              <motion.div
                layoutId="glassesLens"
                className="absolute inset-0 rounded-full bg-white/[0.12] backdrop-blur-md border border-white/20 shadow-inner"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              />
            )}
            <Settings
              className={`w-5 h-5 relative z-10 transition-colors ${
                currentPage === 'settings' || currentPage === 'wallet' ? 'text-[#0095FF]' : 'text-neutral-400 group-hover:text-white'
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Interactive Web3 Connect Wallet Modal */}
      <ConnectWalletModal />

    </div>
  );
};
