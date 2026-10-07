/**
 * Wallet Domain Types for HYBIT
 */
import { Network } from '../blockchain';

export type WalletType = 'embedded-mpc' | 'smart-account' | 'external-eoa';

export type WalletConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'error';

export interface WalletAccount {
  id: string;
  address: string;
  email?: string;
  name: string;
  type: WalletType;
  authProvider?: string;
  balanceUsd: number;
  avatarColor?: string;
}

export interface WalletState {
  status: WalletConnectionStatus;
  account: WalletAccount | null;
  activeNetwork: Network | null;
  isReady: boolean;
  error: string | null;
}

export interface ConnectWalletOptions {
  provider?: 'privy' | 'injected';
  email?: string;
}
