import { Network } from '../../types/blockchain';

export const BASE_SEPOLIA_CHAIN_ID = 84532;
export const BASE_MAINNET_CHAIN_ID = 8453;
export const ETHEREUM_MAINNET_CHAIN_ID = 1;
export const ARBITRUM_MAINNET_CHAIN_ID = 42161;

export const SUPPORTED_NETWORKS: Network[] = [
  {
    id: 'base-sepolia',
    chainId: BASE_SEPOLIA_CHAIN_ID,
    name: 'Base Sepolia',
    symbol: 'ETH',
    rpcUrl: 'https://sepolia.base.org',
    blockExplorerUrl: 'https://sepolia.basescan.org',
    iconColor: 'text-[#0095FF]',
    badge: 'Testnet Target',
    isL2: true,
    type: 'L2',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  {
    id: 'base',
    chainId: BASE_MAINNET_CHAIN_ID,
    name: 'Base L2',
    symbol: 'ETH',
    rpcUrl: 'https://mainnet.base.org',
    blockExplorerUrl: 'https://basescan.org',
    iconColor: 'text-[#0095FF]',
    badge: 'Fastest ~1.2s',
    isL2: true,
    type: 'L2',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  {
    id: 'ethereum',
    chainId: ETHEREUM_MAINNET_CHAIN_ID,
    name: 'Ethereum',
    symbol: 'ETH',
    rpcUrl: 'https://eth.llamarpc.com',
    blockExplorerUrl: 'https://etherscan.io',
    iconColor: 'text-indigo-400',
    badge: 'L1 Security',
    isL2: false,
    type: 'EVM',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  {
    id: 'arbitrum',
    chainId: ARBITRUM_MAINNET_CHAIN_ID,
    name: 'Arbitrum One',
    symbol: 'ETH',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    blockExplorerUrl: 'https://arbiscan.io',
    iconColor: 'text-blue-400',
    badge: 'Low Gas L2',
    isL2: true,
    type: 'L2',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
];

export function getNetworkByChainId(chainId: number): Network | undefined {
  return SUPPORTED_NETWORKS.find((n) => n.chainId === chainId);
}
