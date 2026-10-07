import { useState, useCallback } from 'react';
import { parseEther, isAddress, formatEther } from 'viem';
import {
  TransactionStatus,
  TransactionReceipt,
} from '../../types/transaction';
import { GasEstimate } from '../../types/blockchain';
import { Web3Error, Web3ErrorCode } from '../../types/errors';
import {
  transactionService,
  PrivyWalletSigner,
} from '../../services/transaction/transactionService';
import { blockchainService } from '../../services/blockchain/blockchainService';
import { BASE_SEPOLIA_CHAIN_ID } from '../../lib/blockchain/networks';
import { recordSessionTransaction } from './useTransactionHistory';

export function useTransaction() {
  const [status, setStatus] = useState<TransactionStatus>('idle');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [gasEstimate, setGasEstimate] = useState<GasEstimate | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<TransactionReceipt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [web3Error, setWeb3Error] = useState<Web3Error | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);

  const reset = useCallback(() => {
    setStatus('idle');
    setRecipient('');
    setAmount('');
    setGasEstimate(null);
    setTxHash(null);
    setReceipt(null);
    setError(null);
    setWeb3Error(null);
    setIsReviewing(false);
  }, []);

  /**
   * Performs client-side recipient and amount validation.
   */
  const validateInputs = useCallback(
    (walletAddress: string | null): { isValid: boolean; error: Web3Error | null } => {
      if (!walletAddress) {
        const err = new Web3Error(
          'WalletNotConnected',
          'Please connect your Privy embedded wallet first.'
        );
        return { isValid: false, error: err };
      }

      const cleanRecipient = recipient.trim();
      if (!cleanRecipient) {
        const err = new Web3Error(
          'InvalidAddress',
          'Recipient address cannot be empty.'
        );
        return { isValid: false, error: err };
      }

      if (!isAddress(cleanRecipient)) {
        const err = new Web3Error(
          'InvalidAddress',
          'Invalid recipient address format. Must be a valid 0x EVM address.'
        );
        return { isValid: false, error: err };
      }

      const numAmount = parseFloat(amount);
      if (!amount || isNaN(numAmount) || numAmount <= 0) {
        const err = new Web3Error(
          'InvalidAmount',
          'Send amount must be greater than 0.'
        );
        return { isValid: false, error: err };
      }

      return { isValid: true, error: null };
    },
    [recipient, amount]
  );

  /**
   * Prepares the transaction by checking fresh RPC balance & estimating gas.
   */
  const prepareTransaction = useCallback(
    async (
      walletAddress: string,
      currentChainId: number = BASE_SEPOLIA_CHAIN_ID
    ): Promise<boolean> => {
      setError(null);
      setWeb3Error(null);

      if (currentChainId !== BASE_SEPOLIA_CHAIN_ID) {
        const err = new Web3Error(
          'UnsupportedNetwork',
          'Network is not Base Sepolia. Please switch network to Chain ID 84532.'
        );
        setError(err.message);
        setWeb3Error(err);
        setStatus('failed');
        return false;
      }

      const val = validateInputs(walletAddress);
      if (!val.isValid && val.error) {
        setError(val.error.message);
        setWeb3Error(val.error);
        return false;
      }

      setStatus('preparing');

      try {
        const cleanRecipient = recipient.trim();
        const valueWei = parseEther(amount);

        // Fetch latest native balance directly from Base Sepolia RPC
        const balanceResult = await blockchainService.getNativeBalance(
          walletAddress,
          BASE_SEPOLIA_CHAIN_ID
        );

        // Estimate gas fee on Base Sepolia
        const gasInfo = await transactionService.estimateGas(
          walletAddress,
          cleanRecipient,
          amount
        );
        setGasEstimate(gasInfo);

        const estimatedCostWei = parseEther(gasInfo.estimatedCostEth);
        const totalRequiredWei = valueWei + estimatedCostWei;

        if (balanceResult.raw < totalRequiredWei) {
          const formattedReq = formatEther(totalRequiredWei);
          const err = new Web3Error(
            'InsufficientBalance',
            `Insufficient ETH balance on Base Sepolia. Required: ~${parseFloat(
              formattedReq
            ).toFixed(6)} ETH (Transfer + Gas Fee), Available: ${parseFloat(
              balanceResult.formatted
            ).toFixed(6)} ETH.`
          );
          setError(err.message);
          setWeb3Error(err);
          setStatus('failed');
          return false;
        }

        setIsReviewing(true);
        setStatus('idle'); // Ready for user review
        return true;
      } catch (err: unknown) {
        const wErr =
          err instanceof Web3Error
            ? err
            : new Web3Error(
                'ServiceUnavailable',
                err instanceof Error ? err.message : 'Failed to prepare transaction.'
              );
        setError(wErr.message);
        setWeb3Error(wErr);
        setStatus('failed');
        return false;
      }
    },
    [recipient, amount, validateInputs]
  );

  /**
   * Executes the transaction signature & broadcast via Privy embedded wallet.
   */
  const executeSend = useCallback(
    async (
      walletSigner: PrivyWalletSigner | null,
      onConfirmed?: () => void
    ) => {
      if (!walletSigner || !walletSigner.address) {
        const err = new Web3Error(
          'WalletNotConnected',
          'Privy embedded wallet signer is not available.'
        );
        setError(err.message);
        setWeb3Error(err);
        setStatus('failed');
        return;
      }

      setError(null);
      setWeb3Error(null);

      try {
        // Step 1: Request signature in Privy
        setStatus('awaiting_signature');

        // Step 2: Broadcast to Base Sepolia
        setStatus('broadcasting');
        const res = await transactionService.sendNativeEth(
          walletSigner,
          recipient,
          amount,
          BASE_SEPOLIA_CHAIN_ID
        );

        setTxHash(res.hash);

        const timeMs = Date.now();
        const dateObj = new Date(timeMs);
        const formattedTime = dateObj.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        const pendingTxObj = {
          id: res.hash,
          hash: res.hash,
          type: 'sent' as const,
          status: 'pending' as const,
          chainId: BASE_SEPOLIA_CHAIN_ID,
          chainName: 'Base Sepolia',
          from: walletSigner.address,
          to: recipient,
          token: {
            id: 'eth',
            symbol: 'ETH',
            name: 'Ether',
            decimals: 18,
            chainId: BASE_SEPOLIA_CHAIN_ID,
            chain: 'Base Sepolia',
          },
          amount: `${parseFloat(amount).toFixed(6)} ETH`,
          valueUsd: 0,
          feeUsd: 0,
          timestamp: formattedTime,
          rawTimestamp: timeMs,
        };

        recordSessionTransaction(pendingTxObj);

        // Step 3: Transaction pending
        setStatus('pending');

        // Step 4: Wait for on-chain block receipt confirmation
        const txReceipt = await transactionService.waitForConfirmation(res.hash);
        setReceipt(txReceipt);
        setStatus('confirmed');

        // Update session transaction to confirmed status
        recordSessionTransaction({
          ...pendingTxObj,
          status: 'confirmed',
          blockNumber: txReceipt.blockNumber,
        });

        // Refresh wallet balance on confirmation
        onConfirmed?.();
      } catch (err: unknown) {
        console.error('[useTransaction] Execute send error:', err);
        const wErr =
          err instanceof Web3Error
            ? err
            : new Web3Error(
                'TransactionFailed',
                err instanceof Error ? err.message : 'Transaction execution failed.'
              );

        setError(wErr.message);
        setWeb3Error(wErr);
        setStatus('failed');
      }
    },
    [recipient, amount]
  );

  return {
    status,
    recipient,
    setRecipient,
    amount,
    setAmount,
    gasEstimate,
    txHash,
    receipt,
    error,
    web3Error,
    isReviewing,
    setIsReviewing,
    validateInputs,
    prepareTransaction,
    executeSend,
    reset,
  };
}
