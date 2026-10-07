import { useState, useCallback } from 'react';
import { SwapQuote, SwapParams, SwapResult } from '../../types/swap';
import { swapService } from '../../services/swap/swapService';

export function useSwap() {
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getQuote = useCallback(async (params: Omit<SwapParams, 'quoteId' | 'recipientAddress'>) => {
    setIsLoadingQuote(true);
    setError(null);
    try {
      const q = await swapService.getQuote(params);
      setQuote(q);
      return q;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to retrieve swap quote';
      setError(message);
      return null;
    } finally {
      setIsLoadingQuote(false);
    }
  }, []);

  const executeSwap = useCallback(async (params: SwapParams): Promise<SwapResult | null> => {
    setIsExecuting(true);
    setError(null);
    try {
      const result = await swapService.executeSwap(params);
      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Swap execution failed';
      setError(message);
      throw err;
    } finally {
      setIsExecuting(false);
    }
  }, []);

  return {
    quote,
    isLoadingQuote,
    isExecuting,
    error,
    getQuote,
    executeSwap,
  };
}
