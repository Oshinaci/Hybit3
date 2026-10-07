/**
 * Swap Domain Types for HYBIT
 */
import { ChainId, Token } from '../blockchain';

export interface SwapRouteStep {
  poolAddress: string;
  dexName: string;
  fromToken: Token;
  toToken: Token;
  feeTier?: number;
}

export interface SwapQuote {
  quoteId: string;
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  expectedToAmount: string;
  minToAmount: string;
  priceImpactPct: number;
  slippageTolerancePct: number;
  estimatedGasUsd: number;
  route: SwapRouteStep[];
  expiresAt: number; // Unix timestamp in ms
}

export interface SwapParams {
  quoteId: string;
  fromToken: Token;
  toToken: Token;
  amount: string;
  recipientAddress: string;
  slippageTolerancePct: number;
  chainId: ChainId;
}

export interface SwapResult {
  hash: string;
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
}
