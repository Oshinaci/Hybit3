import { useState, useEffect, useCallback } from 'react';
import { Transaction } from '../../types/transaction';
import { transactionService } from '../../services/transaction/transactionService';
import { useWallet } from '../../context/WalletContext';

// Global session store for transactions sent in current session
const sessionTxStore: Transaction[] = [];

export function recordSessionTransaction(tx: Transaction) {
  const exists = sessionTxStore.some((t) => t.hash?.toLowerCase() === tx.hash?.toLowerCase());
  if (!exists) {
    sessionTxStore.unshift(tx);
  } else {
    const idx = sessionTxStore.findIndex((t) => t.hash?.toLowerCase() === tx.hash?.toLowerCase());
    if (idx !== -1) {
      sessionTxStore[idx] = tx;
    }
  }
}

export function useTransactionHistory() {
  const { account, isConnected } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!isConnected || !account?.address) {
      setTransactions([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Query BaseScan Sepolia Indexer API
      const remoteTxs = await transactionService.getTransactionHistory(account.address);

      // Filter session transactions for current wallet address
      const userSessionTxs = sessionTxStore.filter(
        (tx) =>
          tx.from.toLowerCase() === account.address.toLowerCase() ||
          tx.to.toLowerCase() === account.address.toLowerCase()
      );

      // Merge and deduplicate by hash
      const txMap = new Map<string, Transaction>();

      // Remote txs first
      for (const tx of remoteTxs) {
        if (tx.hash) {
          txMap.set(tx.hash.toLowerCase(), tx);
        }
      }

      // Session txs second (override if newer or pending)
      for (const tx of userSessionTxs) {
        if (tx.hash) {
          txMap.set(tx.hash.toLowerCase(), tx);
        }
      }

      const merged = Array.from(txMap.values());

      // Sort by block number or rawTimestamp descending
      merged.sort((a, b) => {
        const timeA = a.rawTimestamp || (a.blockNumber ? a.blockNumber * 1000 : 0);
        const timeB = b.rawTimestamp || (b.blockNumber ? b.blockNumber * 1000 : 0);
        return timeB - timeA;
      });

      setTransactions(merged);
    } catch (err: unknown) {
      console.error('[Hybit History] Error loading transaction history:', err);
      setError('Unable to load transaction history from Base Sepolia. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [account?.address, isConnected]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const exportCsv = useCallback(() => {
    if (transactions.length === 0) {
      return false;
    }

    const headers = ['Transaction Hash', 'Type', 'From', 'To', 'Amount', 'Network', 'Block Number', 'Status', 'Timestamp'];
    const rows = transactions.map((tx) => [
      tx.hash || '',
      tx.type.toUpperCase(),
      tx.from,
      tx.to,
      tx.amount,
      tx.chainName,
      tx.blockNumber || '',
      tx.status.toUpperCase(),
      `"${tx.timestamp}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hybit_base_sepolia_transactions_${account?.address?.slice(0, 8)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  }, [transactions, account?.address]);

  return {
    transactions,
    isLoading,
    error,
    refetch: fetchHistory,
    exportCsv,
  };
}
