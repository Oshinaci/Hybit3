import { useState, useCallback } from 'react';
import { ChainId, Network, PortfolioAsset } from '../../types/blockchain';
import { SUPPORTED_NETWORKS } from '../../lib/blockchain/networks';
import { blockchainService } from '../../services/blockchain/blockchainService';

export function useBlockchain() {
  const [currentNetwork, setCurrentNetwork] = useState<Network>(SUPPORTED_NETWORKS[0]);
  const [assets] = useState<PortfolioAsset[]>([]);
  const [totalBalanceUsd] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const switchNetwork = useCallback(async (chainId: ChainId) => {
    setIsLoading(true);
    setError(null);
    try {
      const net = await blockchainService.switchNetwork(chainId);
      setCurrentNetwork(net);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Network switch failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    currentNetwork,
    supportedNetworks: SUPPORTED_NETWORKS,
    assets,
    totalBalanceUsd,
    isLoading,
    error,
    switchNetwork,
  };
}
