import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  parseEther,
  formatEther,
  isAddress,
  formatGwei,
} from 'viem';
import { baseSepolia } from 'viem/chains';
import {
  SendTransactionParams,
  SendTransactionResult,
  Transaction,
  TransactionReceipt,
  TransactionStatus,
} from '../../types/transaction';
import { GasEstimate } from '../../types/blockchain';
import { Web3Error } from '../../types/errors';
import { BASE_SEPOLIA_CHAIN_ID } from '../../lib/blockchain/networks';

export interface PrivyWalletSigner {
  address: string;
  getEthereumProvider: () => Promise<any>;
}

export class RealTransactionService {
  private publicClient;

  constructor() {
    const rpcUrl = import.meta.env.VITE_RPC_URL || 'https://sepolia.base.org';
    this.publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(rpcUrl),
    });
  }

  /**
   * Estimates Base Sepolia gas units and cost for Native ETH Send.
   */
  async estimateGas(
    fromAddress: string,
    recipientAddress: string,
    amountEth: string
  ): Promise<GasEstimate> {
    const cleanRecipient = recipientAddress.trim();
    if (!cleanRecipient || !isAddress(cleanRecipient)) {
      throw new Web3Error(
        'InvalidAddress',
        'Recipient is not a valid EVM address format.'
      );
    }

    const num = parseFloat(amountEth);
    if (isNaN(num) || num <= 0) {
      throw new Web3Error(
        'InvalidAmount',
        'Amount must be a positive number greater than 0.'
      );
    }

    try {
      const valueWei = parseEther(amountEth);
      const fromHex = fromAddress as `0x${string}`;
      const toHex = cleanRecipient as `0x${string}`;

      // Estimate gas units
      const gasUnits = await this.publicClient.estimateGas({
        account: fromHex,
        to: toHex,
        value: valueWei,
      });

      // Get current Base Sepolia gas price
      const gasPriceWei = await this.publicClient.getGasPrice();
      const totalGasCostWei = gasUnits * gasPriceWei;

      const estimatedCostEth = formatEther(totalGasCostWei);
      const gasPriceGwei = formatGwei(gasPriceWei);

      return {
        estimatedGas: gasUnits.toString(),
        gasPriceGwei,
        estimatedCostEth,
        estimatedCostUsd: 0,
      };
    } catch (err: unknown) {
      console.error('[Hybit Transaction] Gas estimation failed:', err);
      const msg = err instanceof Error ? err.message : 'Gas estimation failed';
      throw new Web3Error(
        'ServiceUnavailable',
        'Unable to estimate Base Sepolia transaction fee. Please try again.',
        msg
      );
    }
  }

  /**
   * Dispatches Native ETH transfer via Privy embedded wallet.
   * Strictly returns the real transaction hash from Base Sepolia broadcast.
   */
  async sendNativeEth(
    walletSigner: PrivyWalletSigner,
    recipientAddress: string,
    amountEth: string,
    chainId: number = BASE_SEPOLIA_CHAIN_ID
  ): Promise<SendTransactionResult> {
    if (chainId !== BASE_SEPOLIA_CHAIN_ID) {
      throw new Web3Error(
        'UnsupportedNetwork',
        `Network chain ID ${chainId} is not supported. Please connect to Base Sepolia (84532).`
      );
    }

    const cleanRecipient = recipientAddress.trim();
    if (!cleanRecipient || !isAddress(cleanRecipient)) {
      throw new Web3Error(
        'InvalidAddress',
        'Invalid EVM recipient address provided.'
      );
    }

    const valueWei = parseEther(amountEth);

    try {
      const provider = await walletSigner.getEthereumProvider();
      const walletClient = createWalletClient({
        account: walletSigner.address as `0x${string}`,
        chain: baseSepolia,
        transport: custom(provider),
      });

      // Request transaction signature & broadcast via Privy wallet
      const txHash = await walletClient.sendTransaction({
        to: cleanRecipient as `0x${string}`,
        value: valueWei,
        chain: baseSepolia,
      });

      if (!txHash || typeof txHash !== 'string' || !txHash.startsWith('0x')) {
        throw new Web3Error(
          'TransactionFailed',
          'Failed to obtain broadcast transaction hash from wallet provider.'
        );
      }

      return {
        hash: txHash,
        status: 'pending',
      };
    } catch (err: unknown) {
      console.error('[Hybit Transaction] Send Native ETH error:', err);
      const msg = err instanceof Error ? err.message : String(err);

      if (
        msg.toLowerCase().includes('user rejected') ||
        msg.toLowerCase().includes('user denied') ||
        msg.toLowerCase().includes('declined')
      ) {
        throw new Web3Error(
          'TransactionRejected',
          'Transaction was rejected in your Privy wallet.'
        );
      }

      throw new Web3Error(
        'TransactionFailed',
        `Transaction failed: ${msg.slice(0, 120)}`,
        err
      );
    }
  }

  /**
   * Polls Base Sepolia RPC for real transaction receipt confirmation.
   * Only resolves when blockchain receipt is returned.
   */
  async waitForConfirmation(hash: string): Promise<TransactionReceipt> {
    try {
      const receipt = await this.publicClient.waitForTransactionReceipt({
        hash: hash as `0x${string}`,
        timeout: 60_000, // 60s timeout for testnet block inclusion
      });

      if (receipt.status === 'reverted') {
        throw new Web3Error(
          'TransactionFailed',
          'Transaction was reverted on Base Sepolia blockchain.'
        );
      }

      return {
        hash: receipt.transactionHash,
        blockNumber: Number(receipt.blockNumber),
        blockHash: receipt.blockHash,
        status: 'success',
        gasUsed: receipt.gasUsed.toString(),
        effectiveGasPrice: receipt.effectiveGasPrice?.toString(),
        confirmations: 1,
      };
    } catch (err: unknown) {
      console.error('[Hybit Transaction] Confirmation polling error:', err);
      if (err instanceof Web3Error) throw err;

      const msg = err instanceof Error ? err.message : String(err);
      throw new Web3Error(
        'TransactionPending',
        'Transaction is still pending on Base Sepolia or confirmation timed out. You can check the transaction hash on BaseScan.',
        msg
      );
    }
  }

  /**
   * Fetches real on-chain Native ETH transaction history for Base Sepolia (84532)
   * directly from Base Sepolia Blockscout Indexer API.
   * No mock data, hardcoded arrays, or simulated state.
   */
  async getTransactionHistory(address: string): Promise<Transaction[]> {
    const cleanAddress = address.trim();
    if (!cleanAddress || !isAddress(cleanAddress)) {
      return [];
    }

    try {
      // Primary Endpoint: Blockscout Base Sepolia V1 Indexer API
      const primaryUrl = `https://base-sepolia.blockscout.com/api?module=account&action=txlist&address=${cleanAddress}&sort=desc`;
      const res = await fetch(primaryUrl);

      if (res.ok) {
        const data = await res.json();
        if (data && data.status === '1' && Array.isArray(data.result)) {
          return data.result.map((tx: any): Transaction => {
            const rawVal = tx.value ? BigInt(tx.value) : 0n;
            const ethVal = formatEther(rawVal);
            const isSent = tx.from?.toLowerCase() === cleanAddress.toLowerCase();
            const isError = tx.isError === '1' || tx.txreceipt_status === '0';
            const status: TransactionStatus = isError ? 'failed' : 'confirmed';

            const timeMs = tx.timeStamp ? Number(tx.timeStamp) * 1000 : Date.now();
            const dateObj = new Date(timeMs);
            const formattedTime = dateObj.toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return {
              id: tx.hash,
              hash: tx.hash,
              type: isSent ? 'sent' : 'received',
              status,
              chainId: BASE_SEPOLIA_CHAIN_ID,
              chainName: 'Base Sepolia',
              from: tx.from || '',
              to: tx.to || '',
              token: {
                id: 'eth',
                symbol: 'ETH',
                name: 'Ether',
                decimals: 18,
                chainId: BASE_SEPOLIA_CHAIN_ID,
                chain: 'Base Sepolia',
              },
              amount: `${parseFloat(ethVal).toFixed(6)} ETH`,
              valueUsd: 0,
              feeUsd: 0,
              timestamp: formattedTime,
              rawTimestamp: timeMs,
              blockNumber: tx.blockNumber ? Number(tx.blockNumber) : undefined,
            };
          });
        }
      }

      // Fallback Endpoint: Blockscout Base Sepolia V2 REST API
      const fallbackUrl = `https://base-sepolia.blockscout.com/api/v2/addresses/${cleanAddress}/transactions`;
      const fallbackRes = await fetch(fallbackUrl);

      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        if (fallbackData && Array.isArray(fallbackData.items)) {
          return fallbackData.items.map((item: any): Transaction => {
            const rawVal = item.value ? BigInt(item.value) : 0n;
            const ethVal = formatEther(rawVal);
            const fromAddr = item.from?.hash || '';
            const toAddr = item.to?.hash || '';
            const isSent = fromAddr.toLowerCase() === cleanAddress.toLowerCase();
            const status: TransactionStatus =
              item.status === 'ok' || item.result === 'success' ? 'confirmed' : 'failed';

            const timeMs = item.timestamp ? new Date(item.timestamp).getTime() : Date.now();
            const dateObj = new Date(timeMs);
            const formattedTime = dateObj.toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return {
              id: item.hash,
              hash: item.hash,
              type: isSent ? 'sent' : 'received',
              status,
              chainId: BASE_SEPOLIA_CHAIN_ID,
              chainName: 'Base Sepolia',
              from: fromAddr,
              to: toAddr,
              token: {
                id: 'eth',
                symbol: 'ETH',
                name: 'Ether',
                decimals: 18,
                chainId: BASE_SEPOLIA_CHAIN_ID,
                chain: 'Base Sepolia',
              },
              amount: `${parseFloat(ethVal).toFixed(6)} ETH`,
              valueUsd: 0,
              feeUsd: 0,
              timestamp: formattedTime,
              rawTimestamp: timeMs,
              blockNumber: item.block_number ? Number(item.block_number) : undefined,
            };
          });
        }
      }

      return [];
    } catch (err: unknown) {
      console.error('[RealTransactionService] Error fetching Base Sepolia transaction history:', err);
      return [];
    }
  }
}

export const transactionService = new RealTransactionService();
