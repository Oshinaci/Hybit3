import React, { useState } from 'react';
import {
  TrendingUp,
  Search,
  ArrowUpRight,
  Repeat,
  Wallet,
  Layers,
} from 'lucide-react';
import { WalletAsset } from '../../types/dashboard';
import { EthereumIcon, SolanaIcon, BaseIcon, CircleIcon, ArbitrumIcon } from '../icons/NetworkIcons';
import { useToast } from '../../context/ToastContext';
import { PortfolioSkeleton } from '../common/Skeleton';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useWallet } from '../../context/WalletContext';
import { useTokenBalances } from '../../hooks/token/useTokenBalances';

interface PortfolioViewProps {
  onQuickAction: (action: 'send' | 'receive' | 'swap') => void;
  isRefreshing?: boolean;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  onQuickAction,
  isRefreshing = false,
}) => {
  const { showToast } = useToast();
  const { t, language } = useLanguage();
  const { formatCurrency } = useCurrency();
  const { isConnected, ethBalance } = useWallet();
  const { tokenBalances } = useTokenBalances();
  const [searchQuery, setSearchQuery] = useState('');
  const [chainFilter, setChainFilter] = useState('ALL');

  const realEthAmount = ethBalance !== null ? parseFloat(ethBalance) : 0;
  
  // Real on-chain assets only (Native ETH + Real Base Sepolia ERC-20 Tokens)
  const assets: WalletAsset[] = [];

  if (isConnected) {
    if (realEthAmount > 0) {
      assets.push({
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
      assets.push({
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

  const filteredAssets = assets.filter((a) => {
    const matchesChain = chainFilter === 'ALL' || a.chain.toLowerCase() === chainFilter.toLowerCase();
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesChain && matchesSearch;
  });

  const renderIcon = (id: string) => {
    switch (id) {
      case 'eth':
        return <EthereumIcon className="w-5 h-5 text-indigo-400" />;
      case 'sol':
        return <SolanaIcon className="w-5 h-5 text-emerald-400" />;
      case 'usdc':
        return <CircleIcon className="w-5 h-5 text-[#0095FF]" />;
      case 'arb':
        return <ArbitrumIcon className="w-5 h-5 text-blue-400" />;
      default:
        return <BaseIcon className="w-5 h-5 text-white" />;
    }
  };

  if (isRefreshing) {
    return <PortfolioSkeleton />;
  }

  return (
    <div className="space-y-8 pb-28">
      
      {/* Net Assets Value Section (Unboxed - No card wrapper) */}
      <section className="space-y-6 pb-8 border-b border-white/[0.08]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">
              {t('port_net_assets')}
            </span>
            <div className="text-3xl sm:text-5xl font-extrabold text-white font-mono mt-1 tracking-tight">
              {isConnected ? `${realEthAmount.toFixed(4)} ETH` : '0.0000 ETH'}
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-neutral-400 font-medium font-mono">
              <span>
                {language === 'id'
                  ? 'Valuasi USD: Belum tersedia · Saldo On-Chain Base Sepolia'
                  : 'USD Valuation: Unavailable · Live Base Sepolia On-Chain'}
              </span>
            </div>
          </div>
        </div>

        {/* Honest Portfolio Analytics Standby Card */}
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-8 text-center space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-white/[0.04] text-neutral-400 flex items-center justify-center mx-auto">
            <TrendingUp className="w-5 h-5 text-neutral-400" />
          </div>
          <div className="text-sm font-semibold text-white">
            {language === 'id' ? 'Riwayat Kinerja Portofolio' : 'Portfolio Performance History'}
          </div>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            {language === 'id'
              ? 'Grafik historis dan metrik PnL akan muncul setelah aktivitas dompet on-chain terindeks secara memadai.'
              : 'Historical performance and PnL metrics will appear once enough real wallet activity is indexed.'}
          </p>
        </div>
      </section>

      {/* Select Token or Symbol & Token List (Unboxed - No card wrapper) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder={t('port_search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-[#0095FF]"
            />
          </div>

          {/* Chain Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['ALL', 'Base Sepolia'].map((c) => (
              <button
                key={c}
                onClick={() => setChainFilter(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  chainFilter === c
                    ? 'bg-[#0095FF] text-white font-semibold'
                    : 'bg-white/[0.04] text-neutral-400 hover:text-white'
                }`}
              >
                {c === 'ALL' ? (language === 'id' ? 'Semua Jaringan' : 'All Networks') : c}
              </button>
            ))}
          </div>
        </div>

        {/* Tokens List (Unboxed - clean rows with dividers) */}
        {filteredAssets.length > 0 ? (
          <div className="divide-y divide-white/[0.05]">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className="flex items-center justify-between py-3.5 px-2 hover:bg-white/[0.03] rounded-xl transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-white/[0.05] border border-white/[0.06] flex items-center justify-center">
                    {renderIcon(asset.id)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      {asset.name}
                      <span className="text-[10px] font-mono text-neutral-400">
                        {asset.symbol}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-400 font-mono mt-0.5">
                      {asset.chain}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="text-right">
                    <div className="text-sm font-bold text-white font-mono">
                      {asset.balance.toFixed(4)} {asset.symbol}
                    </div>
                    <div className="text-xs font-mono text-neutral-500">
                      {language === 'id' ? 'Valuasi belum tersedia' : 'Valuation unavailable'}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onQuickAction('send')}
                      className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-neutral-300 hover:text-white transition-colors cursor-pointer"
                      title={language === 'id' ? 'Kirim token' : 'Send token'}
                      aria-label="Send token"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onQuickAction('swap')}
                      className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-neutral-300 hover:text-white transition-colors cursor-pointer"
                      title={language === 'id' ? 'Tukar token' : 'Swap token'}
                      aria-label="Swap token"
                    >
                      <Repeat className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 px-4 text-center rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-white/[0.04] text-neutral-400 flex items-center justify-center mx-auto">
              <Wallet className="w-5 h-5 text-neutral-400" />
            </div>
            <div className="text-sm font-semibold text-white">
              {language === 'id' ? 'Tidak ada aset yang ditemukan' : 'No assets found'}
            </div>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              {isConnected
                ? (language === 'id'
                    ? 'Aset terdaftar di Base Sepolia akan muncul di sini setelah dideteksi.'
                    : 'Supported on-chain assets on Base Sepolia will appear here once detected.')
                : (language === 'id'
                    ? 'Hubungkan dompet Anda untuk melihat aset on-chain.'
                    : 'Connect your wallet to view on-chain assets.')}
            </p>
          </div>
        )}
      </section>

    </div>
  );
};
