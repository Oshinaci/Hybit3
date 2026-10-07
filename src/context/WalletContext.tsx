import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { WalletAccount, WalletConnectionStatus } from '../types/wallet';
import { blockchainService, NativeBalanceResult } from '../services/blockchain/blockchainService';
import { BASE_SEPOLIA_CHAIN_ID } from '../lib/blockchain/networks';
import { useToast } from './ToastContext';
import { useLanguage } from './LanguageContext';

export interface WalletContextType {
  account: WalletAccount | null;
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  isReady: boolean;
  ethBalance: string | null;
  rawEthBalance: bigint | null;
  isLoadingBalance: boolean;
  balanceError: string | null;
  chainId: number;
  status: WalletConnectionStatus;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  openConnectModal: () => void;
  closeConnectModal: () => void;
  isConnectModalOpen: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { ready, authenticated, user, login, logout, createWallet } = usePrivy();
  const { wallets } = useWallets();
  const { showToast } = useToast();
  const { language } = useLanguage();

  const [account, setAccount] = useState<WalletAccount | null>(null);
  const [ethBalance, setEthBalance] = useState<string | null>(null);
  const [rawEthBalance, setRawEthBalance] = useState<bigint | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  // Identify the Privy embedded wallet from available wallets
  const embeddedWallet = wallets.find((w) => w.walletClientType === 'privy') || wallets[0];
  const activeAddress = embeddedWallet?.address || null;

  // Real on-chain balance fetcher targeting Base Sepolia
  const fetchBalance = useCallback(async (targetAddress: string): Promise<NativeBalanceResult | null> => {
    setIsLoadingBalance(true);
    setBalanceError(null);
    try {
      const result = await blockchainService.getNativeBalance(targetAddress, BASE_SEPOLIA_CHAIN_ID);
      setEthBalance(result.formatted);
      setRawEthBalance(result.raw);
      return result;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to query on-chain balance.';
      setBalanceError(msg);
      return null;
    } finally {
      setIsLoadingBalance(false);
    }
  }, []);

  // Sync wallet state whenever Privy authentication or wallets change
  useEffect(() => {
    if (!ready) return;

    if (authenticated && activeAddress) {
      const realEmail =
        user?.email?.address ||
        user?.google?.email ||
        (user as { apple?: { email?: string } } | null)?.apple?.email ||
        undefined;

      const activeAccount: WalletAccount = {
        id: `privy-${activeAddress}`,
        name: 'Privy Embedded Wallet',
        address: activeAddress,
        email: realEmail,
        type: 'embedded-mpc',
        authProvider: 'Privy Web3 Auth',
        balanceUsd: 0,
        avatarColor: '#0095FF',
      };

      setAccount(activeAccount);
      fetchBalance(activeAddress);
    } else if (authenticated && wallets.length === 0) {
      // User is authenticated but embedded wallet not yet provisioned; request creation
      if (typeof createWallet === 'function') {
        createWallet().catch((err) => {
          console.warn('[Hybit Privy] Wallet creation pending or failed:', err);
        });
      }
    } else {
      // Disconnected state
      setAccount(null);
      setEthBalance(null);
      setRawEthBalance(null);
      setBalanceError(null);
    }
  }, [ready, authenticated, activeAddress, user, wallets.length, createWallet, fetchBalance]);

  // Connect handler
  const connect = useCallback(async () => {
    try {
      await login();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      console.error('[Hybit Privy] Connect error:', err);
      showToast(
        language === 'id' ? 'Gagal Terhubung' : 'Connection Failed',
        msg,
        'failed'
      );
    }
  }, [login, language, showToast]);

  // Disconnect handler
  const disconnect = useCallback(async () => {
    try {
      await logout();
      setAccount(null);
      setEthBalance(null);
      setRawEthBalance(null);
      showToast(
        language === 'id' ? 'Dompet Terputus' : 'Wallet Disconnected',
        language === 'id' ? 'Sesi Privy berhasil diakhiri' : 'Privy session closed',
        'info'
      );
    } catch (err: unknown) {
      console.error('[Hybit Privy] Logout error:', err);
    }
  }, [logout, language, showToast]);

  // Manual balance refresh handler (strictly calls on-chain RPC without fake delay)
  const refreshBalance = useCallback(async () => {
    if (!activeAddress) {
      showToast(
        language === 'id' ? 'Dompet Belum Terhubung' : 'Wallet Not Connected',
        language === 'id' ? 'Hubungkan dompet untuk membaca saldo on-chain' : 'Connect wallet to fetch on-chain balance',
        'warning'
      );
      return;
    }

    const result = await fetchBalance(activeAddress);
    if (result) {
      showToast(
        language === 'id' ? 'Saldo Berhasil Disinkronkan' : 'Balance Synced',
        `Base Sepolia: ${parseFloat(result.formatted).toFixed(4)} ETH`,
        'success'
      );
    } else {
      showToast(
        language === 'id' ? 'Gagal Membaca Saldo' : 'Balance Fetch Failed',
        language === 'id' ? 'Tidak dapat membaca saldo dari Base Sepolia RPC' : 'Could not query Base Sepolia RPC',
        'failed'
      );
    }
  }, [activeAddress, fetchBalance, language, showToast]);

  const openConnectModal = useCallback(() => {
    connect();
  }, [connect]);

  const closeConnectModal = useCallback(() => {
    setIsConnectModalOpen(false);
  }, []);

  const status: WalletConnectionStatus = !ready
    ? 'connecting'
    : authenticated && activeAddress
    ? 'connected'
    : 'disconnected';

  return (
    <WalletContext.Provider
      value={{
        account,
        address: activeAddress,
        isConnected: Boolean(authenticated && activeAddress),
        isConnecting: !ready,
        isReady: ready,
        ethBalance,
        rawEthBalance,
        isLoadingBalance,
        balanceError,
        chainId: BASE_SEPOLIA_CHAIN_ID,
        status,
        connect,
        disconnect,
        refreshBalance,
        openConnectModal,
        closeConnectModal,
        isConnectModalOpen,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
