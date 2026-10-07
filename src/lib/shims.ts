/**
 * Global Polyfills & Environment Shims for Web3 embedded iframe runtime
 * Prevents:
 * 1. WalletConnect prototype error: "TypeError: Cannot set property fetch of #<Window> which has only a getter"
 * 2. @base-org/account cross-origin iframe SecurityError: "SecurityError: Failed to read a named property 'ethereum' from 'Window'"
 */

if (typeof window !== 'undefined') {
  // 1. Safe window.fetch and Window.prototype.fetch setter
  try {
    const _origFetch = window.fetch ? window.fetch.bind(window) : undefined;
    let _currentFetch = _origFetch;

    if (typeof Window !== 'undefined' && Window.prototype) {
      try {
        Object.defineProperty(Window.prototype, 'fetch', {
          configurable: true,
          enumerable: true,
          get() {
            return _currentFetch || (window && window.fetch);
          },
          set(val) {
            Object.defineProperty(this, 'fetch', {
              value: val,
              writable: true,
              configurable: true,
              enumerable: true,
            });
          },
        });
      } catch {
        // Ignore if already configured
      }
    }

    try {
      Object.defineProperty(window, 'fetch', {
        configurable: true,
        enumerable: true,
        get() {
          return _currentFetch;
        },
        set(val) {
          if (this !== window) {
            Object.defineProperty(this, 'fetch', {
              value: val,
              writable: true,
              configurable: true,
              enumerable: true,
            });
          } else if (typeof val === 'function') {
            _currentFetch = val;
          }
        },
      });
    } catch {
      // Ignore if already configured
    }
  } catch (e) {
    console.warn('[Hybit Shim] fetch accessor setup warning:', e);
  }

  // 2. Safe window.ethereum fallback for cross-origin iframes
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(window as any).ethereum) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).ethereum = {
        isMetaMask: false,
        isCoinbaseBrowser: false,
        isCoinbaseWallet: false,
        isBraveWallet: false,
        on() {},
        removeListener() {},
        request() {
          return Promise.reject(new Error('Injected Web3 provider is not available in preview iframe.'));
        },
      };
    }
  } catch (e) {
    console.warn('[Hybit Shim] ethereum provider shim warning:', e);
  }
}

export {};
