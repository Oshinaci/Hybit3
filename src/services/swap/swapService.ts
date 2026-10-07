import { SwapQuote, SwapParams, SwapResult } from '../../types/swap';
import { Web3Error } from '../../types/errors';

export interface ISwapService {
  getQuote(params: Omit<SwapParams, 'quoteId' | 'recipientAddress'>): Promise<SwapQuote>;
  executeSwap(params: SwapParams): Promise<SwapResult>;
}

/**
 * RealSwapService placeholder.
 * Strictly avoids fake swaps or fabricated success.
 */
export class RealSwapService implements ISwapService {
  async getQuote(_params: Omit<SwapParams, 'quoteId' | 'recipientAddress'>): Promise<SwapQuote> {
    throw new Web3Error(
      'NotImplemented',
      'Live DEX aggregator quotes will be integrated in subsequent phases.'
    );
  }

  async executeSwap(_params: SwapParams): Promise<SwapResult> {
    throw new Web3Error(
      'NotImplemented',
      'Real on-chain swap execution requires DEX router contracts and user signature.'
    );
  }
}

export const swapService = new RealSwapService();
