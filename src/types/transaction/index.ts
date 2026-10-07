/**
 * Transaction Domain Types for HYBIT
 */
import { ChainId, Token } from '../blockchain';

export type TransactionStatus =
  | 'idle'
  | 'preparing'
  | 'awaiting_signature'
  | 'broadcasting'
  | 'pending'
  | 'confirmed'
  | 'failed';

export type TransactionType = 'send' | 'receive' | 'sent' | 'received' | 'swap' | 'bridge' | 'buy';

export interface TransactionReceipt {
  hash: string;
  blockNumber: number;
  blockHash?: string;
  status: 'success' | 'reverted';
  gasUsed: string;
  effectiveGasPrice?: string;
  confirmations: number;
}

export interface Transaction {
  id: string;
  hash?: string;
  type: TransactionType;
  status: TransactionStatus;
  chainId: ChainId;
  chainName: string;
  from: string;
  to: string;
  token: Token;
  amount: string;
  valueUsd: number;
  feeUsd?: number;
  timestamp: string; // ISO string or human string
  blockNumber?: number;
  rawTimestamp?: number;
  receipt?: TransactionReceipt;
  error?: string;
}

export interface SendTransactionParams {
  recipientAddress: string;
  token: Token;
  amount: string;
  chainId: ChainId;
  memo?: string;
}

export interface SendTransactionResult {
  hash: string;
  status: TransactionStatus;
}
