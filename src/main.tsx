import './lib/shims.ts';
import { createRoot } from 'react-dom/client';
import { PrivyProvider } from '@privy-io/react-auth';
import { baseSepolia } from 'viem/chains';
import App from './App.tsx';
import './index.css';
import { ToastProvider } from './context/ToastContext.tsx';
import { LanguageProvider } from './context/LanguageContext.tsx';
import { CurrencyProvider } from './context/CurrencyContext.tsx';
import { WalletProvider } from './context/WalletContext.tsx';

const rawAppId = import.meta.env.VITE_PRIVY_APP_ID;
// Privy requires an exact 25-character appId string. If not configured in .env, use standard development placeholder.
const privyAppId =
  typeof rawAppId === 'string' && rawAppId.length === 25
    ? rawAppId
    : 'cl00000000000000000000000';

createRoot(document.getElementById('root')!).render(
  <LanguageProvider>
    <CurrencyProvider>
      <ToastProvider>
        <PrivyProvider
          appId={privyAppId}
          config={{
            defaultChain: baseSepolia,
            supportedChains: [baseSepolia],
            appearance: {
              theme: 'dark',
              accentColor: '#0095FF',
              logo: '/logo.svg',
            },
            loginMethods: ['email', 'google', 'passkey'],
            embeddedWallets: {
              ethereum: {
                createOnLogin: 'users-without-wallets',
              },
            },
          }}
        >
          <WalletProvider>
            <App />
          </WalletProvider>
        </PrivyProvider>
      </ToastProvider>
    </CurrencyProvider>
  </LanguageProvider>
);
