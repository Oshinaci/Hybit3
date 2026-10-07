/**
 * Blockchain and Token Domain Types for HYBIT
 */

export type ChainId = number;

export type NetworkType = 'EVM' | 'L2' | 'Solana' | 'Non-EVM';

export interface Network {
  id: string;
  chainId: ChainId;
  name: string;
  symbol: string;
  rpcUrl?: string;
  blockExplorerUrl?: string;
  iconColor: string;
  badge: string;
  isL2?: boolean;
  type: NetworkType;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export interface Token {
  id: string;
  address?: string; // Optional for native tokens like ETH, SOL
  symbol: string;
  name: string;
  decimals: number;
  chainId: ChainId;
  chain: string;
  iconBg?: string;
  logoUrl?: string;
}

export interface TokenBalance {
  token: Token;
  rawBalance: string; // BigNumber integer string for precise math
  formattedBalance: number; // Human-readable decimal number
  priceUsd: number;
  valueUsd: number;
  change24h: number;
}

export interface PortfolioAsset {
  id: string;
  symbol: string;
  name: string;
  chain: string;
  balance: number;
  price: number;
  value: number;
  change24h: number;
  sparkline: number[];
  color: string;
  iconBg: string;
}

export interface GasEstimate {
  estimatedGas: string;
  gasPriceGwei: string;
  estimatedCostEth: string;
  estimatedCostUsd: number;
}
