import React from 'react';

export const HybitLogoIcon: React.FC<{ className?: string; size?: number; color?: string }> = ({
  className = '',
  size = 32,
  color,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M 46.5 7.5 C 46.5 7.5 15.5 25.5 14 26.5 C 12.5 27.5 12 29 12 31 L 12 69 C 12 71 12.5 72.5 14 73.5 C 15.5 74.5 46.5 92.5 46.5 92.5 L 46.5 70.5 L 31 61.5 C 29.5 60.5 29 59 29 57.5 L 29 55 L 46.5 55 L 53.5 55 L 71 55 L 71 57.5 C 71 59 70.5 60.5 69 61.5 L 53.5 70.5 L 53.5 92.5 C 53.5 92.5 84.5 74.5 86 73.5 C 87.5 72.5 88 71 88 69 L 88 31 C 88 29 87.5 27.5 86 26.5 C 84.5 25.5 53.5 7.5 53.5 7.5 L 53.5 29.5 L 69 38.5 C 70.5 39.5 71 41 71 42.5 L 71 45 L 53.5 45 L 46.5 45 L 29 45 L 29 42.5 C 29 41 29.5 39.5 31 38.5 L 46.5 29.5 Z"
      fill={color || "currentColor"}
    />
  </svg>
);

export const HybitLogo: React.FC<{
  className?: string;
  size?: number;
  showText?: boolean;
  variant?: 'gradient' | 'plain' | 'badge';
}> = ({
  className = '',
  size = 32,
  showText = false,
  variant = 'gradient',
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Custom Hybit Hexagonal H Logo */}
      {variant === 'gradient' ? (
        <div 
          className="relative flex items-center justify-center shrink-0 select-none shadow-md shadow-[#0095FF]/25 rounded-xl bg-gradient-to-br from-[#0095FF] via-[#0070F3] to-[#0040E0] p-1.5 transition-transform duration-200 hover:scale-105"
          style={{ width: size, height: size }}
        >
          <HybitLogoIcon size={size * 0.72} color="#FFFFFF" />
        </div>
      ) : variant === 'badge' ? (
        <div 
          className="relative flex items-center justify-center shrink-0 select-none rounded-xl bg-white/10 border border-white/15 p-1.5 backdrop-blur-md transition-transform duration-200 hover:scale-105"
          style={{ width: size, height: size }}
        >
          <HybitLogoIcon size={size * 0.72} color="#0095FF" />
        </div>
      ) : (
        <HybitLogoIcon size={size} color="#0095FF" />
      )}

      {/* Name Hybit rendered in Lobster/Chinese font */}
      {showText && (
        <span className="text-[28px] sm:text-3xl font-normal tracking-wide text-white font-chinese select-none leading-none">
          Hybit
        </span>
      )}
    </div>
  );
};

// Ethereum
export const EthereumIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2L4.5 12.5L12 16.5L19.5 12.5L12 2Z" fill="currentColor" fillOpacity="0.85" />
    <path d="M12 18L4.5 13.5L12 22L19.5 13.5L12 18Z" fill="currentColor" fillOpacity="0.6" />
    <path d="M12 2V16.5L19.5 12.5L12 2Z" fill="currentColor" fillOpacity="0.4" />
    <path d="M12 18V22L19.5 13.5L12 18Z" fill="currentColor" fillOpacity="0.2" />
  </svg>
);

// Base
export const BaseIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6C8.686 6 6 8.686 6 12C6 15.314 8.686 18 12 18C14.7 18 17 16.2 17.7 13.8H12V10.2H17.7C17 7.8 14.7 6 12 6Z" fill="#09090B" />
  </svg>
);

// Solana
export const SolanaIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M5.5 17.5L8.5 14.5H19.5L16.5 17.5H5.5Z" fill="currentColor" />
    <path d="M5.5 12L8.5 9H19.5L16.5 12H5.5Z" fill="currentColor" fillOpacity="0.8" />
    <path d="M5.5 6.5L8.5 3.5H19.5L16.5 6.5H5.5Z" fill="currentColor" fillOpacity="0.6" />
  </svg>
);

// Polygon
export const PolygonIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M16.5 10.2L12 7.6L7.5 10.2V15.4L12 18L16.5 15.4V10.2ZM12 4.4L18.7 8.3C19.2 8.6 19.5 9.1 19.5 9.7V17.5C19.5 18.1 19.2 18.6 18.7 18.9L12 22.8C11.5 23.1 10.9 23.1 10.4 22.8L3.7 18.9C3.2 18.6 2.9 18.1 2.9 17.5V9.7C2.9 9.1 3.2 8.6 3.7 8.3L10.4 4.4C10.9 4.1 11.5 4.1 12 4.4Z" />
  </svg>
);

// Arbitrum
export const ArbitrumIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L3 7.2V16.8L12 22L21 16.8V7.2L12 2ZM17.2 15.8L14.7 11.5L12 16.2H9.2L13.3 9L15.8 13.4L17.2 11V15.8ZM6.8 15.8V11L8.2 13.4L10.7 9L14.8 16.2H12L9.3 11.5L6.8 15.8Z" />
  </svg>
);

// Optimism
export const OptimismIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <circle cx="8" cy="12" r="5" fill="currentColor" />
    <path d="M14 7H17C19.2 7 21 8.8 21 11V13C21 15.2 19.2 17 17 17H14V7ZM16.5 14.5C17.3 14.5 18 13.8 18 13V11C18 10.2 17.3 9.5 16.5 9.5H16V14.5H16.5Z" />
  </svg>
);

// BNB Chain
export const BNBIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L15.5 5.5L8.5 12.5L5 9L12 2Z" />
    <path d="M19 9L22.5 12.5L19 16L15.5 12.5L19 9Z" />
    <path d="M12 22L8.5 18.5L15.5 11.5L19 15L12 22Z" />
    <path d="M5 15L8.5 11.5L5 8L1.5 11.5L5 15Z" />
    <path d="M12 15.5L8.5 12L12 8.5L15.5 12L12 15.5Z" />
  </svg>
);

// Sui
export const SuiIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C9.5 5.5 6 9.5 6 14C6 17.3 8.7 20 12 20C15.3 20 18 17.3 18 14C18 9.5 14.5 5.5 12 2ZM12 17.5C10.1 17.5 8.5 15.9 8.5 14C8.5 11.5 10.5 8.6 12 6.5C13.5 8.6 15.5 11.5 15.5 14C15.5 15.9 13.9 17.5 12 17.5Z" />
  </svg>
);

// Aptos
export const AptosIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className}>
    <path d="M12 3L3 21H7.5L12 11.5L16.5 21H21L12 3Z" fill="currentColor" fillOpacity="0.2" />
    <line x1="6" y1="15" x2="18" y2="15" />
    <line x1="8" y1="11" x2="16" y2="11" />
  </svg>
);

// WalletConnect
export const WalletConnectIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M5.4 8.2C9 4.6 15 4.6 18.6 8.2L19.2 8.8C19.5 9.1 19.5 9.5 19.2 9.8L17.7 11.3C17.5 11.5 17.2 11.5 17 11.3L16.2 10.5C13.8 8.1 10.2 8.1 7.8 10.5L7 11.3C6.8 11.5 6.5 11.5 6.3 11.3L4.8 9.8C4.5 9.5 4.5 9.1 4.8 8.8L5.4 8.2ZM21.7 11.3L23.2 12.8C23.5 13.1 23.5 13.5 23.2 13.8L16.8 20.2C16.5 20.5 16.1 20.5 15.8 20.2L12 16.4L8.2 20.2C7.9 20.5 7.5 20.5 7.2 20.2L0.8 13.8C0.5 13.5 0.5 13.1 0.8 12.8L2.3 11.3C2.5 11.1 2.8 11.1 3 11.3L6.8 15.1L10.6 11.3C10.8 11.1 11.2 11.1 11.4 11.3L12 11.9L12.6 11.3C12.8 11.1 13.2 11.1 13.4 11.3L17.2 15.1L21 11.3C21.2 11.1 21.5 11.1 21.7 11.3Z" />
  </svg>
);

// Circle (USDC)
export const CircleIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M12 7C9.2 7 7 9.2 7 12C7 14.8 9.2 17 12 17C13.7 17 15.2 16.2 16.1 14.9L14.5 13.8C13.9 14.6 13 15.1 12 15.1C10.3 15.1 8.9 13.7 8.9 12C8.9 10.3 10.3 8.9 12 8.9C13 8.9 13.9 9.4 14.5 10.2L16.1 9.1C15.2 7.8 13.7 7 12 7Z" />
  </svg>
);

// LayerZero
export const LayerZeroIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L4 6V18L12 22L20 18V6L12 2ZM12 4.3L18 7.3V16.7L12 19.7L6 16.7V7.3L12 4.3ZM12 8.5C10.1 8.5 8.5 10.1 8.5 12C8.5 13.9 10.1 15.5 12 15.5C13.9 15.5 15.5 13.9 15.5 12C15.5 10.1 13.9 8.5 12 8.5Z" />
  </svg>
);

// Chainlink
export const ChainlinkIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L4 6.6V17.4L12 22L20 17.4V6.6L12 2ZM17.5 16L12 19.2L6.5 16V8L12 4.8L17.5 8V16ZM12 9.5L9 11.2V14.8L12 16.5L15 14.8V11.2L12 9.5Z" />
  </svg>
);
