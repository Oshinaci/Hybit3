export type DashboardPage = 'dashboard' | 'portfolio' | 'activity' | 'wallet' | 'settings';

export interface WalletAsset {
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
  contractAddress?: string;
}

export interface WalletTransaction {
  id: string;
  type: 'received' | 'sent' | 'swap' | 'bridge' | 'reward';
  status: 'confirmed' | 'pending' | 'failed';
  chain: string;
  from: string;
  to: string;
  amount: string;
  tokenSymbol: string;
  valueUsd: number;
  timestamp: string;
  hash: string;
  feeUsd: number;
}

export interface NetworkOption {
  id: string;
  name: string;
  symbol: string;
  iconColor: string;
  badge: string;
  isL2?: boolean;
  available?: boolean;
}

export interface WalletAccount {
  id: string;
  name: string;
  address: string;
  type: 'mpc' | 'smart-account' | 'cold-vault';
  balanceUsd: number;
  avatarColor: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'tx' | 'security' | 'price';
}
