/**
 * Web3 Address Utilities for HYBIT
 */

/**
 * Validates whether an input is a valid EVM address format (0x + 40 hex chars).
 */
export function isValidEvmAddress(address: string): boolean {
  if (!address || typeof address !== 'string') return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address.trim());
}

/**
 * Truncates an address for human display (e.g., 0x7F2a...8b1e).
 */
export function formatAddress(address: string, startChars: number = 6, endChars: number = 4): string {
  if (!address) return '';
  const clean = address.trim();
  if (clean.length <= startChars + endChars) return clean;
  return `${clean.slice(0, startChars)}...${clean.slice(-endChars)}`;
}
