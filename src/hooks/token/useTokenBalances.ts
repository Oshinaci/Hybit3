import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '../../context/WalletContext';
import { tokenService } from '../../services/token/tokenService';
import { ERC20TokenBalance } from '../../types/token';
import { BASE_SEPOLIA_CHAIN_ID } from '../../config/tokens/baseSepolia';

export function useTokenBalances() {
  const { account, address, isConnected } = useWallet();
  const [tokenBalances, setTokenBalances] = useState<ERC20TokenBalance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const walletAddress = account?.address || address || null;

  const fetchTokenBalances = useCallback(async () => {
    if (!isConnected || !walletAddress) {
      setTokenBalances([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const balances = await tokenService.getTokenBalances(walletAddress, BASE_SEPOLIA_CHAIN_ID);
      setTokenBalances(balances);
    } catch (err: unknown) {
      console.error('[useTokenBalances] Error fetching token balances:', err);
      setError('Unable to load ERC-20 token balances from Base Sepolia.');
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress, isConnected]);

  useEffect(() => {
    fetchTokenBalances();
  }, [fetchTokenBalances]);

  return {
    tokenBalances,
    isLoading,
    error,
    refreshTokens: fetchTokenBalances,
  };
}
