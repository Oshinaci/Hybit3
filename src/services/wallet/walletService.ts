import { WalletAccount, WalletState, ConnectWalletOptions } from '../../types/wallet';
import { Web3Error } from '../../types/errors';

export interface IWalletService {
  getWalletState(): WalletState;
  getAccount(): Promise<WalletAccount | null>;
  connect(options?: ConnectWalletOptions): Promise<WalletAccount>;
  disconnect(): Promise<void>;
  signMessage(message: string): Promise<string>;
}

/**
 * Placeholder implementation of IWalletService.
 * Explicitly throws NotImplemented error. Never pretends a real wallet connected.
 */
export class RealWalletService implements IWalletService {
  private state: WalletState = {
    status: 'disconnected',
    account: null,
    activeNetwork: null,
    isReady: false,
    error: null,
  };

  getWalletState(): WalletState {
    return this.state;
  }

  async getAccount(): Promise<WalletAccount | null> {
    return this.state.account;
  }

  async connect(_options?: ConnectWalletOptions): Promise<WalletAccount> {
    throw new Web3Error(
      'NotImplemented',
      'Real Privy embedded wallet connection will be integrated in the next phase.'
    );
  }

  async disconnect(): Promise<void> {
    this.state = {
      ...this.state,
      status: 'disconnected',
      account: null,
    };
  }

  async signMessage(_message: string): Promise<string> {
    throw new Web3Error(
      'NotImplemented',
      'Message signing requires active Privy/Web3 wallet connection.'
    );
  }
}

export const walletService = new RealWalletService();
