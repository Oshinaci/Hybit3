import { Token } from '../../types/blockchain';

export const BASE_SEPOLIA_CHAIN_ID = 84532;

/**
 * Official Verified ERC-20 Tokens on Base Sepolia Testnet (84532).
 * Strictly contains verified token contract addresses.
 */
export const BASE_SEPOLIA_TOKENS: Token[] = [
  {
    id: 'usdc-base-sepolia',
    address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // Circle Official Bridged USDC on Base Sepolia
    symbol: 'USDC',
    name: 'Bridged USDC',
    decimals: 6,
    chainId: BASE_SEPOLIA_CHAIN_ID,
    chain: 'Base Sepolia',
    iconBg: 'bg-[#0095FF]/20 text-[#0095FF]',
  },
];
