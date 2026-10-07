/**
 * Standard Web3 Error Codes and Model for HYBIT
 */
export type Web3ErrorCode =
  | 'WalletNotConnected'
  | 'UnsupportedNetwork'
  | 'InsufficientBalance'
  | 'InvalidAddress'
  | 'InvalidAmount'
  | 'TransactionRejected'
  | 'TransactionFailed'
  | 'TransactionPending'
  | 'ServiceUnavailable'
  | 'NotImplemented';

export interface Web3ErrorDetails {
  code: Web3ErrorCode;
  message: string;
  details?: unknown;
}

export class Web3Error extends Error {
  public readonly code: Web3ErrorCode;
  public readonly details?: unknown;

  constructor(code: Web3ErrorCode, message: string, details?: unknown) {
    super(message);
    this.name = 'Web3Error';
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, Web3Error.prototype);
  }
}
