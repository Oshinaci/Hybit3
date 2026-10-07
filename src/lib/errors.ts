export * from '../types/errors';
import { Web3Error, Web3ErrorCode } from '../types/errors';

export function createWeb3Error(code: Web3ErrorCode, message: string, details?: unknown): Web3Error {
  return new Web3Error(code, message, details);
}
