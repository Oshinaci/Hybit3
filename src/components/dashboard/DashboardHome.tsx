import React, { useState, useEffect } from 'react';
import {
  Send,
  Download,
  Repeat,
  CreditCard,
  Layers,
  Eye,
  EyeOff,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  ShieldCheck,
  Wallet,
  RefreshCw,
} from 'lucide-react';
import { WalletAsset, WalletTransaction } from '../../types/dashboard';
import { EthereumIcon, SolanaIcon, BaseIcon, CircleIcon, ArbitrumIcon } from '../icons/NetworkIcons';
import { useToast } from '../../context/ToastContext';
import { DashboardHomeSkeleton } from '../common/Skeleton';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useWallet } from '../../context/WalletContext';
import { useTokenBalances } from '../../hooks/token/useTokenBalances';

interface DashboardHomeProps {
  onQuickAction: (action: 'send' | 'receive' | 'swap' | 'buy' | 'bridge') => void;
  onNavigateToPortfolio: () => void;
  onNavigateToActivity: () => void;
  isRefreshing?: boolean;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  onQuickAction,
  onNavigateToPortfolio,
  onNavigateToActivity,
  isRefreshing = false,
}) => {
  const { showToast } = useToast();
  const { t, language } = useLanguage();
  const { formatCurrency } = useCurrency();
  const { isConnected, ethBalance, isLoadingBalance, refreshBalance, openConnectModal } = useWallet();
  const { tokenBalances } = useTokenBalances();
  const [balanceHidden, setBalanceHidden] = useState(false);

  const realEthAmount = ethBalance !== null ? parseFloat(ethBalance) : 0;

  // Real on-chain assets from Base Sepolia (Native ETH + ERC-20 Tokens)
  const portfolioAssets: WalletAsset[] = [];

  if (isConnected) {
    if (realEthAmount > 0) {
      portfolioAssets.push({
        id: 'eth',
        symbol: 'ETH',
        name: 'Ethereum',
        chain: 'Base Sepolia',
        balance: realEthAmount,
        price: 0,
        value: 0,
        change24h: 0,
        sparkline: [],
        color: '#0095FF',
        iconBg: 'bg-[#0095FF]/20 text-[#0095FF]',
      });
    }

    for (const tb of tokenBalances) {
      portfolioAssets.push({
        id: tb.token.id,
        symbol: tb.token.symbol,
        name: tb.token.name,
        chain: tb.token.chain,
        balance: tb.numericBalance,
        price: 0,
        value: 0,
        change24h: 0,
        sparkline: [],
        color: '#0095FF',
        iconBg: tb.token.iconBg || 'bg-[#0095FF]/20 text-[#0095FF]',
        contractAddress: tb.token.address,
      });
    }
  }

  // Real transactions start empty until on-chain indexer is connected
  const recentTransactions: WalletTransaction[] = [];

  const renderAssetIcon = (id: string) => {
    switch (id) {
      case 'eth':
        return <EthereumIcon className="w-5 h-5 text-indigo-400" />;
      case 'sol':
        return <SolanaIcon className="w-5 h-5 text-emerald-400" />;
      case 'usdc':
        return <CircleIcon className="w-5 h-5 text-sky-400" />;
      case 'arb':
        return <ArbitrumIcon className="w-5 h-5 text-blue-400" />;
      default:
        return <BaseIcon className="w-5 h-5 text-neutral-300" />;
    }
  };

  if (isRefreshing) {
    return <DashboardHomeSkeleton />;
  }

  return (
    <div className="space-y-8 pb-28">
      
      {/* Balance Card - Solid Color, No Gradient */}
      <div className="relative rounded-3xl bg-[#0095FF] p-6 sm:p-8 text-white shadow-xl shadow-[#0095FF]/20 border border-white/20 overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between text-xs text-white/90 mb-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium tracking-wide">
              <span className="font-chinese text-lg sm:text-xl text-white font-normal select-none">Hybit</span>
              <span className="text-white/70">~</span>
              <span className="text-white/90">{language === 'id' ? 'Total Saldo' : 'Total Balance'}</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              {isConnected && (
                <button
                  onClick={refreshBalance}
                  disabled={isLoadingBalance}
                  className="p-1.5 rounded-full bg-white/15 hover:bg-white/25 transition-colors cursor-pointer"
                  title={language === 'id' ? 'Sinkronkan Saldo Base Sepolia' : 'Sync Base Sepolia Balance'}
                  aria-label="Sync balance"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingBalance ? 'animate-spin' : ''}`} />
                </button>
              )}
              <button
                onClick={() => {
                  const nextState = !balanceHidden;
                  setBalanceHidden(nextState);
                  showToast(
                    nextState
                      ? (language === 'id' ? 'Saldo Disembunyikan' : 'Balance Hidden')
                      : (language === 'id' ? 'Saldo Ditampilkan' : 'Balance Visible'),
                    nextState
                      ? (language === 'id' ? 'Nominal saldo disamarkan' : 'Balance amount masked')
                      : (language === 'id' ? 'Nominal saldo ditampilkan penuh' : 'Balance amount unmasked'),
                    'info'
                  );
                }}
                className="p-1.5 rounded-full bg-white/15 hover:bg-white/25 transition-colors cursor-pointer"
                aria-label="Toggle balance visibility"
              >
                {balanceHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Large Primary Fiat Balance */}
          <div className="mt-1 mb-2">
            <div className="text-3xl sm:text-5xl font-extrabold tracking-tight font-mono">
              {balanceHidden ? (
                '••••••••••'
              ) : (
                formatCurrency(0)
              )}
            </div>
          </div>

          {/* Crypto Balance (0.0000 ETH) underneath Fiat */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 text-xs font-semibold text-white font-mono shadow-sm">
              <span>
                {balanceHidden
                  ? '•••• ETH'
                  : isLoadingBalance
                  ? (language === 'id' ? 'Memuat on-chain...' : 'Loading on-chain...')
                  : `${realEthAmount.toFixed(4)} ETH`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="grid grid-cols-5 gap-2 sm:gap-4">
        {[
          { id: 'send', label: t('dash_quick_send'), icon: Send, color: 'text-white' },
          { id: 'receive', label: t('dash_quick_receive'), icon: Download, color: 'text-white' },
          { id: 'swap', label: t('dash_quick_swap'), icon: Repeat, color: 'text-white' },
          { id: 'buy', label: t('dash_quick_buy'), icon: CreditCard, color: 'text-white' },
          { id: 'bridge', label: t('dash_quick_bridge'), icon: Layers, color: 'text-white' },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => {
                onQuickAction(action.id as any);
              }}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#141419] hover:bg-[#1C1C24] border border-white/10 group-hover:border-[#0095FF]/60 flex items-center justify-center shadow-lg shadow-black/40 group-active:scale-95 transition-all">
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${action.color} group-hover:scale-110 transition-transform`} />
              </div>
              <span className="text-xs font-medium text-neutral-300 group-hover:text-white transition-colors">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Top Holdings (Unboxed - NOT in a card container) */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">{t('dash_holdings_title')}</h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              {language === 'id'
                ? 'Aset disimpan langsung di brankas non-kustodial Anda'
                : 'Assets held directly in your self-custody vault'}
            </p>
          </div>

          <button
            onClick={onNavigateToPortfolio}
            className="text-xs font-semibold text-[#0095FF] hover:text-[#00E5FF] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>{t('dash_view_all')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {portfolioAssets.length > 0 ? (
          <div className="divide-y divide-white/[0.05]">
            {portfolioAssets.map((asset) => (
              <div
                key={asset.id}
                onClick={onNavigateToPortfolio}
                className="flex items-center justify-between py-3.5 px-2 hover:bg-white/[0.03] rounded-xl transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-white/[0.05] border border-white/[0.06] flex items-center justify-center">
                    {renderAssetIcon(asset.id)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-[#00E5FF] transition-colors">
                      {asset.symbol}
                    </div>
                    <div className="text-xs text-neutral-400 flex items-center gap-1.5 font-mono">
                      <span>{asset.name}</span>
                      <span className="text-neutral-600">·</span>
                      <span className="text-neutral-400">{asset.chain}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold text-white font-mono">
                    {balanceHidden ? '••••••' : `${asset.balance.toFixed(4)} ${asset.symbol}`}
                  </div>
                  <div className="text-xs font-mono text-neutral-500">
                    {language === 'id' ? 'Harga pasar belum tersedia' : 'Price feed unavailable'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 px-4 text-center rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-white/[0.04] text-neutral-400 flex items-center justify-center mx-auto">
              <Wallet className="w-5 h-5 text-neutral-400" />
            </div>
            <div className="text-sm font-semibold text-white">
              {language === 'id' ? 'Tidak ada saldo token terdeteksi' : 'No token balances detected'}
            </div>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              {isConnected
                ? (language === 'id'
                    ? 'Saldo native ETH Base Sepolia terhubung. Token ERC-20 dan aset rantai lain akan muncul di sini setelah didukung.'
                    : 'Base Sepolia native ETH connected. ERC-20 tokens and other chain assets will appear here once supported.')
                : (language === 'id'
                    ? 'Hubungkan dompet Privy Anda untuk melihat aset Base Sepolia on-chain.'
                    : 'Connect your Privy wallet to view your Base Sepolia on-chain assets.')}
            </p>
          </div>
        )}
      </section>

      {/* Recent Activity (Unboxed - NOT in a card container) */}
      <section className="space-y-3 pt-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">{t('dash_recent_activity')}</h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              {language === 'id'
                ? 'Transaksi terkonfirmasi on-chain terbaru'
                : 'Latest confirmed on-chain transactions'}
            </p>
          </div>

          <button
            onClick={onNavigateToActivity}
            className="text-xs font-semibold text-[#0095FF] hover:text-[#00E5FF] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>{language === 'id' ? 'Riwayat Lengkap' : 'Full History'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {recentTransactions.length > 0 ? (
          <div className="divide-y divide-white/[0.05]">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between py-3.5 px-2 hover:bg-white/[0.03] rounded-xl transition-colors"
              >
                <div className="text-sm text-white">{tx.amount}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 px-4 text-center rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-white/[0.04] text-neutral-400 flex items-center justify-center mx-auto">
              <Layers className="w-5 h-5 text-neutral-400" />
            </div>
            <div className="text-sm font-semibold text-white">
              {language === 'id' ? 'Belum ada transaksi on-chain' : 'No transactions yet'}
            </div>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              {language === 'id'
                ? 'Aktivitas on-chain Base Sepolia Anda yang terkonfirmasi akan muncul di sini secara otomatis.'
                : 'Your confirmed Base Sepolia on-chain activity will appear here automatically.'}
            </p>
          </div>
        )}
      </section>

    </div>
  );
};
