import { Token, ChainId } from './blockchain';

export interface ERC20Token extends Token {
  address: string; // Required for ERC-20 contract
}

export interface ERC20TokenBalance {
  token: ERC20Token;
  rawBalance: bigint;        // Raw integer representation from contract balanceOf(address)
  rawBalanceString: string;  // BigInt string for safe serialization
  formattedBalance: string;  // Human-readable string e.g. "5116.25"
  numericBalance: number;    // Number for display e.g. 5116.25
  isError?: boolean;
  errorMessage?: string;
}

export interface GetTokenBalancesOptions {
  chainId?: ChainId;
  forceRefresh?: boolean;
}
