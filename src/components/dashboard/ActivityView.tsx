import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Repeat,
  Layers,
  Search,
  Download,
  Copy,
  Check,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  Wallet,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Transaction } from '../../types/transaction';
import { useToast } from '../../context/ToastContext';
import { ActivitySkeleton } from '../common/Skeleton';
import { useLanguage } from '../../context/LanguageContext';
import { useWallet } from '../../context/WalletContext';
import { useTransactionHistory } from '../../hooks/transaction/useTransactionHistory';
import { formatAddress } from '../../lib/wallet/address';

interface ActivityViewProps {
  isRefreshing?: boolean;
}

export const ActivityView: React.FC<ActivityViewProps> = ({ isRefreshing = false }) => {
  const { showToast } = useToast();
  const { t, language } = useLanguage();
  const { account, isConnected, openConnectModal } = useWallet();
  const {
    transactions,
    isLoading,
    refetch,
    exportCsv,
  } = useTransactionHistory();

  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Handle Manual Refresh
  const handleRefreshClick = async () => {
    setIsSyncing(true);
    await refetch();
    setIsSyncing(false);
    showToast(
      language === 'id' ? 'Riwayat Diperbarui' : 'History Refreshed',
      language === 'id' ? 'Data transaksi Base Sepolia disinkronkan' : 'Base Sepolia activity synced',
      'success'
    );
  };

  // Filter transactions
  const filteredTx = transactions.filter((tx) => {
    const isReceived = tx.type === 'received' || tx.type === 'receive';
    const isSent = tx.type === 'sent' || tx.type === 'send';

    let matchesType = false;
    if (filterType === 'all') matchesType = true;
    else if (filterType === 'received') matchesType = isReceived;
    else if (filterType === 'sent') matchesType = isSent;
    else matchesType = tx.type === filterType;

    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      tx.amount.toLowerCase().includes(q) ||
      tx.from.toLowerCase().includes(q) ||
      tx.to.toLowerCase().includes(q) ||
      (tx.hash && tx.hash.toLowerCase().includes(q));
    return matchesType && matchesSearch;
  });

  const handleCopyHash = (hash: string) => {
    if (!hash) return;
    navigator.clipboard?.writeText(hash);
    setCopiedHash(true);
    showToast(t('act_hash_copied'), hash, 'copy');
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleExport = () => {
    const success = exportCsv();
    if (success) {
      showToast(
        language === 'id' ? 'Ekspor CSV Berhasil' : 'CSV Export Completed',
        language === 'id' ? 'File CSV transaksi telah diunduh' : 'Transaction CSV file downloaded',
        'success'
      );
    } else {
      showToast(
        language === 'id' ? 'Tidak Ada Data' : 'No Data Available',
        language === 'id' ? 'Belum ada transaksi untuk diekspor' : 'No transactions available to export',
        'info'
      );
    }
  };

  if (isRefreshing || isLoading) {
    return <ActivitySkeleton />;
  }

  return (
    <div className="space-y-8 pb-28">
      {/* Activity Ledger Header & Controls */}
      <section className="space-y-4 pb-4 border-b border-white/[0.08]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {t('act_title')}
              </h2>
              <button
                type="button"
                onClick={handleRefreshClick}
                disabled={isSyncing}
                className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title={language === 'id' ? 'Sinkronkan dengan Base Sepolia' : 'Sync with Base Sepolia'}
                aria-label="Refresh Activity"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#0095FF]' : ''}`} />
              </button>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              {t('act_subtitle')}
            </p>
          </div>

          <button
            type="button"
            onClick={handleExport}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-neutral-200 hover:text-white transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#0095FF]" />
            <span>{t('act_export_btn')}</span>
          </button>
        </div>

        {/* Search & Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder={t('act_search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-[#0095FF]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: t('act_filter_all') },
              { id: 'received', label: t('act_filter_received') },
              { id: 'sent', label: t('act_filter_sent') },
              { id: 'swap', label: t('act_filter_swaps') },
              { id: 'bridge', label: t('act_filter_bridges') },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  filterType === tab.id
                    ? 'bg-[#0095FF] text-white font-semibold'
                    : 'bg-white/[0.04] text-neutral-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Disconnected State */}
      {!isConnected || !account ? (
        <div className="py-16 px-4 text-center rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0095FF]/15 text-[#0095FF] flex items-center justify-center mx-auto">
            <Wallet className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">
              {language === 'id' ? 'Dompet Belum Terhubung' : 'Wallet Not Connected'}
            </h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              {language === 'id'
                ? 'Hubungkan dompet Privy Anda untuk melihat riwayat aktivitas transaksi Base Sepolia.'
                : 'Connect your Privy wallet to view real Base Sepolia transaction activity.'}
            </p>
          </div>
          <button
            type="button"
            onClick={openConnectModal}
            className="px-6 py-2.5 rounded-xl bg-[#0095FF] hover:bg-[#0080E0] text-white font-semibold text-xs transition-all shadow-md shadow-[#0095FF]/20 cursor-pointer"
          >
            {language === 'id' ? 'Hubungkan Dompet' : 'Connect Wallet'}
          </button>
        </div>
      ) : filterType === 'swap' ? (
        /* Empty Swap Filter */
        <div className="py-16 px-4 text-center rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0095FF]/15 text-[#0095FF] flex items-center justify-center mx-auto">
            <Repeat className="w-6 h-6" />
          </div>
          <div className="text-base font-semibold text-white">
            {language === 'id' ? 'Belum Ada Transaksi Swap' : 'No Swap Transactions Yet'}
          </div>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            {language === 'id'
              ? 'Integrasi mesin swap DEX lintas rantai dijadwalkan pada rilis berikutnya.'
              : 'Cross-chain DEX swap engine integration is scheduled for the upcoming release.'}
          </p>
        </div>
      ) : filterType === 'bridge' ? (
        /* Empty Bridge Filter */
        <div className="py-16 px-4 text-center rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6" />
          </div>
          <div className="text-base font-semibold text-white">
            {language === 'id' ? 'Belum Ada Transaksi Bridge' : 'No Bridge Transactions Yet'}
          </div>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            {language === 'id'
              ? 'Integrasi jembatan lintas rantai aman dijadwalkan pada rilis berikutnya.'
              : 'Secure cross-chain bridge integration is scheduled for the upcoming release.'}
          </p>
        </div>
      ) : (
        /* Real Transactions List */
        <section className="divide-y divide-white/[0.05]">
          {filteredTx.length > 0 ? (
            filteredTx.map((tx) => {
              const isReceived = tx.type === 'received' || tx.type === 'receive';
              const isPending = tx.status === 'pending';
              const isFailed = tx.status === 'failed';

              return (
                <div
                  key={tx.id}
                  onClick={() => setSelectedTx(tx)}
                  className="flex items-center justify-between py-3.5 px-2 hover:bg-white/[0.03] rounded-xl transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isReceived
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-[#0095FF]/15 text-[#0095FF]'
                      }`}
                    >
                      {isReceived ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>

                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white group-hover:text-[#00E5FF] transition-colors truncate">
                        {isReceived
                          ? (language === 'id' ? `Diterima dari ${formatAddress(tx.from)}` : `Received from ${formatAddress(tx.from)}`)
                          : (language === 'id' ? `Terkirim ke ${formatAddress(tx.to)}` : `Sent to ${formatAddress(tx.to)}`)}
                      </div>
                      <div className="text-xs text-neutral-400 font-mono mt-0.5 flex items-center gap-2 flex-wrap">
                        <span>{tx.timestamp}</span>
                        <span>·</span>
                        <span className="text-neutral-300">Base Sepolia</span>
                        {tx.hash && (
                          <>
                            <span>·</span>
                            <span className="text-neutral-500">
                              Hash: {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right font-mono">
                      <div
                        className={`text-sm font-bold ${
                          isReceived ? 'text-emerald-400' : 'text-neutral-200'
                        }`}
                      >
                        {isReceived ? `+${tx.amount}` : `-${tx.amount}`}
                      </div>
                      <div className="text-[10px] flex items-center justify-end gap-1 mt-0.5">
                        {isPending && (
                          <span className="text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded font-sans flex items-center gap-1">
                            <Clock className="w-3 h-3 animate-spin" />
                            <span>Pending</span>
                          </span>
                        )}
                        {isFailed && (
                          <span className="text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded font-sans flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>Failed</span>
                          </span>
                        )}
                        {tx.status === 'confirmed' && (
                          <span className="text-emerald-400 font-medium">Confirmed ✓</span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-16 px-4 text-center rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] text-neutral-400 flex items-center justify-center mx-auto">
                <Layers className="w-6 h-6 text-neutral-400" />
              </div>
              <div className="text-base font-semibold text-white">
                {searchQuery
                  ? (language === 'id' ? 'Tidak ada transaksi yang cocok' : 'No matching transactions')
                  : (language === 'id' ? 'Belum ada aktivitas transaksi' : 'No transactions yet')}
              </div>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                {searchQuery
                  ? (language === 'id'
                      ? 'Coba gunakan kata kunci pencarian alamat atau hash yang berbeda.'
                      : 'Try searching with a different address or transaction hash.')
                  : (language === 'id'
                      ? 'Aktivitas transaksi Base Sepolia Anda yang terkonfirmasi akan muncul di sini.'
                      : 'Your confirmed on-chain activity on Base Sepolia will appear here.')}
              </p>
            </div>
          )}
        </section>
      )}

      {/* Transaction Detail Modal */}
      <AnimatePresence>
        {selectedTx && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTx(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-md rounded-3xl bg-[#141419] border border-white/10 p-6 text-white shadow-2xl shadow-black space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-sm font-bold text-white">{t('act_modal_title')}</span>
                <button
                  type="button"
                  onClick={() => setSelectedTx(null)}
                  className="text-neutral-400 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  {language === 'id' ? 'Tutup' : 'Close'}
                </button>
              </div>

              <div className="text-center py-2 space-y-1">
                <div className="text-2xl font-bold font-mono text-white">{selectedTx.amount}</div>
                <div className="text-xs flex items-center justify-center gap-1">
                  {selectedTx.status === 'confirmed' && (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{language === 'id' ? 'Terselesaikan & Dikonfirmasi' : 'Settled & Confirmed'}</span>
                    </span>
                  )}
                  {selectedTx.status === 'pending' && (
                    <span className="text-amber-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 animate-spin" />
                      <span>{language === 'id' ? 'Menunggu Konfirmasi' : 'Pending Confirmation'}</span>
                    </span>
                  )}
                  {selectedTx.status === 'failed' && (
                    <span className="text-rose-400 flex items-center gap-1 font-mono">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{language === 'id' ? 'Transaksi Dibatalkan' : 'Transaction Reverted'}</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-xs space-y-2.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-neutral-400 font-sans">{language === 'id' ? 'Jaringan' : 'Network'}</span>
                  <span className="text-emerald-400">Base Sepolia (84532)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400 font-sans">{language === 'id' ? 'Pengirim' : 'From'}</span>
                  <span className="text-neutral-200 truncate max-w-[200px]">{selectedTx.from}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400 font-sans">{language === 'id' ? 'Penerima' : 'To'}</span>
                  <span className="text-neutral-200 truncate max-w-[200px]">{selectedTx.to}</span>
                </div>
                {selectedTx.blockNumber && (
                  <div className="flex justify-between">
                    <span className="text-neutral-400 font-sans">{language === 'id' ? 'Nomor Blok' : 'Block Number'}</span>
                    <span className="text-white">{selectedTx.blockNumber}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-neutral-400 font-sans">{language === 'id' ? 'Waktu' : 'Timestamp'}</span>
                  <span className="text-neutral-200">{selectedTx.timestamp}</span>
                </div>

                {selectedTx.hash && (
                  <div className="flex justify-between items-center pt-2 border-t border-white/[0.06]">
                    <span className="text-neutral-400 font-sans">Hash</span>
                    <button
                      type="button"
                      onClick={() => handleCopyHash(selectedTx.hash!)}
                      className="flex items-center gap-1 text-[#00E5FF] hover:underline cursor-pointer"
                    >
                      <span className="truncate max-w-[180px]">{selectedTx.hash}</span>
                      {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                )}
              </div>

              {selectedTx.hash && (
                <a
                  href={`https://sepolia.basescan.org/tx/${selectedTx.hash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-xl bg-[#0095FF] hover:bg-[#0080E0] text-xs font-semibold text-white inline-flex items-center justify-center gap-2 shadow-md shadow-[#0095FF]/20 transition-colors cursor-pointer"
                >
                  <span>{language === 'id' ? 'Lihat di BaseScan Sepolia' : 'View on BaseScan Explorer'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="w-full py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                {language === 'id' ? 'Kembali' : 'Dismiss'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
