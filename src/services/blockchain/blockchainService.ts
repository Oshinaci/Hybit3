import { createPublicClient, http, formatEther, isAddress } from 'viem';
import { baseSepolia } from 'viem/chains';
import { ChainId, Network, TokenBalance } from '../../types/blockchain';
import { Web3Error } from '../../types/errors';
import { SUPPORTED_NETWORKS, getNetworkByChainId, BASE_SEPOLIA_CHAIN_ID } from '../../lib/blockchain/networks';

export interface NativeBalanceResult {
  raw: bigint;
  formatted: string;
  formattedNumber: number;
}

export interface IBlockchainService {
  getCurrentNetwork(): Network;
  isSupportedNetwork(chainId: number): boolean;
  switchNetwork(chainId: ChainId): Promise<Network>;
  getNativeBalance(address: string, chainId?: ChainId): Promise<NativeBalanceResult>;
  getBalance(address: string, chainId?: ChainId): Promise<string>;
  getTokenBalances(address: string, chainId?: ChainId): Promise<TokenBalance[]>;
}

export class RealBlockchainService implements IBlockchainService {
  private activeNetwork: Network = SUPPORTED_NETWORKS[0]; // Base Sepolia by default
  private publicClient;

  constructor() {
    const rpcUrl = import.meta.env.VITE_RPC_URL || 'https://sepolia.base.org';
    this.publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(rpcUrl),
    });
  }

  getCurrentNetwork(): Network {
    return this.activeNetwork;
  }

  isSupportedNetwork(chainId: number): boolean {
    return SUPPORTED_NETWORKS.some((n) => n.chainId === chainId);
  }

  async switchNetwork(chainId: ChainId): Promise<Network> {
    if (!this.isSupportedNetwork(chainId)) {
      throw new Web3Error(
        'UnsupportedNetwork',
        `Network with Chain ID ${chainId} is not supported. Please switch to Base Sepolia.`
      );
    }
    const target = getNetworkByChainId(chainId);
    if (!target) {
      throw new Web3Error('UnsupportedNetwork', `Chain ID ${chainId} not found in catalog.`);
    }
    this.activeNetwork = target;
    return target;
  }

  /**
   * Fetches the real on-chain native ETH balance from Base Sepolia.
   */
  async getNativeBalance(address: string, chainId?: ChainId): Promise<NativeBalanceResult> {
    const targetChainId = chainId ?? this.activeNetwork.chainId;

    if (!this.isSupportedNetwork(targetChainId)) {
      throw new Web3Error(
        'UnsupportedNetwork',
        `Cannot fetch balance on unsupported chain ID ${targetChainId}. Only Base Sepolia is active.`
      );
    }

    if (!address || !isAddress(address)) {
      throw new Web3Error(
        'InvalidAddress',
        `Invalid EVM address provided: ${address || 'empty'}`
      );
    }

    try {
      const balanceWei = await this.publicClient.getBalance({
        address: address as `0x${string}`,
      });

      const formatted = formatEther(balanceWei);
      const formattedNumber = parseFloat(formatted);

      return {
        raw: balanceWei,
        formatted,
        formattedNumber,
      };
    } catch (err: unknown) {
      console.error('[Hybit RPC] Failed to query Base Sepolia balance:', err);
      throw new Web3Error(
        'ServiceUnavailable',
        'Unable to load wallet balance from Base Sepolia. Please check network connection and try again.',
        err
      );
    }
  }

  async getBalance(address: string, chainId?: ChainId): Promise<string> {
    const result = await this.getNativeBalance(address, chainId);
    return result.formatted;
  }

  async getTokenBalances(address: string, chainId?: ChainId): Promise<TokenBalance[]> {
    const targetChain = chainId ?? this.activeNetwork.chainId;
    try {
      const { tokenService } = await import('../token/tokenService');
      const erc20Balances = await tokenService.getTokenBalances(address, targetChain);
      return erc20Balances.map((item) => ({
        token: item.token,
        rawBalance: item.rawBalanceString,
        formattedBalance: item.numericBalance,
        priceUsd: 0,
        valueUsd: 0,
        change24h: 0,
      }));
    } catch (err) {
      console.error('[blockchainService] Error fetching token balances:', err);
      return [];
    }
  }
}

export const blockchainService = new RealBlockchainService();
