import { createPublicClient, http, formatUnits, isAddress } from 'viem';
import { baseSepolia } from 'viem/chains';
import { BASE_SEPOLIA_TOKENS, BASE_SEPOLIA_CHAIN_ID } from '../../config/tokens/baseSepolia';
import { ERC20Token, ERC20TokenBalance } from '../../types/token';
import { Web3Error } from '../../types/errors';

const erc20Abi = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export class RealTokenService {
  private publicClient;

  constructor() {
    const rpcUrl = import.meta.env.VITE_RPC_URL || 'https://sepolia.base.org';
    this.publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(rpcUrl),
    });
  }

  /**
   * Reads real on-chain ERC-20 token balances for a wallet address on Base Sepolia (84532).
   * Executes balanceOf(walletAddress) directly via RPC for configured verified tokens.
   */
  async getTokenBalances(
    walletAddress: string,
    chainId: number = BASE_SEPOLIA_CHAIN_ID
  ): Promise<ERC20TokenBalance[]> {
    const cleanAddress = walletAddress.trim();
    if (!cleanAddress || !isAddress(cleanAddress)) {
      return [];
    }

    if (chainId !== BASE_SEPOLIA_CHAIN_ID) {
      throw new Web3Error(
        'UnsupportedNetwork',
        `Network chain ID ${chainId} is not supported. Only Base Sepolia (84532) is active.`
      );
    }

    const tokenList = BASE_SEPOLIA_TOKENS as ERC20Token[];
    if (tokenList.length === 0) {
      return [];
    }

    const results: ERC20TokenBalance[] = await Promise.all(
      tokenList.map(async (token) => {
        try {
          if (!isAddress(token.address)) {
            return {
              token,
              rawBalance: 0n,
              rawBalanceString: '0',
              formattedBalance: '0.00',
              numericBalance: 0,
              isError: true,
              errorMessage: 'Invalid contract address',
            };
          }

          // Execute balanceOf(walletAddress) on Base Sepolia contract
          const rawBalance = await this.publicClient.readContract({
            address: token.address as `0x${string}`,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [cleanAddress as `0x${string}`],
          });

          const formatted = formatUnits(rawBalance, token.decimals);
          const num = parseFloat(formatted);

          return {
            token,
            rawBalance,
            rawBalanceString: rawBalance.toString(),
            formattedBalance: formatted,
            numericBalance: isNaN(num) ? 0 : num,
            isError: false,
          };
        } catch (err: unknown) {
          console.error(`[Hybit ERC-20] Failed to read balanceOf for ${token.symbol}:`, err);
          return {
            token,
            rawBalance: 0n,
            rawBalanceString: '0',
            formattedBalance: '0.00',
            numericBalance: 0,
            isError: true,
            errorMessage: 'Token balance unavailable',
          };
        }
      })
    );

    return results;
  }
}

export const tokenService = new RealTokenService();
