import React from 'react';
import {
  EthereumIcon,
  BaseIcon,
  PolygonIcon,
  OptimismIcon,
  ArbitrumIcon,
  BNBIcon,
  SolanaIcon,
  SuiIcon,
  AptosIcon,
  WalletConnectIcon,
  CircleIcon,
  LayerZeroIcon,
  ChainlinkIcon,
} from './icons/NetworkIcons';
import { useLanguage } from '../context/LanguageContext';

export const TrustedBy: React.FC = () => {
  const { language } = useLanguage();

  const partners = [
    { name: 'Ethereum', icon: EthereumIcon, role: 'L1 Base Layer' },
    { name: 'Base', icon: BaseIcon, role: 'Optimistic L2' },
    { name: 'Solana', icon: SolanaIcon, role: 'High-Speed L1' },
    { name: 'Polygon', icon: PolygonIcon, role: 'PoS & zkEVM' },
    { name: 'Arbitrum', icon: ArbitrumIcon, role: 'L2 Scaling' },
    { name: 'Optimism', icon: OptimismIcon, role: 'OP Stack' },
    { name: 'BNB Chain', icon: BNBIcon, role: 'DeFi Ecosystem' },
    { name: 'Sui', icon: SuiIcon, role: 'Move Architecture' },
    { name: 'Aptos', icon: AptosIcon, role: 'Parallel Execution' },
    { name: 'LayerZero', icon: LayerZeroIcon, role: 'Omnichain Messaging' },
    { name: 'Circle', icon: CircleIcon, role: 'Native USDC' },
    { name: 'Chainlink', icon: ChainlinkIcon, role: 'Price Oracles' },
    { name: 'WalletConnect', icon: WalletConnectIcon, role: 'Universal Link' },
  ];

  return (
    <section className="py-12 border-y border-white/[0.06] bg-[#0C0C0F]/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">
            {language === 'id'
              ? 'Diamankan & Terintegrasi dengan Protokol Terkemuka Industri'
              : 'Secured by & Integrated with Industry-Leading Protocols'}
          </p>
        </div>

        {/* Responsive Logo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-4 items-center justify-center">
          {partners.map((partner) => {
            const Icon = partner.icon;
            return (
              <div
                key={partner.name}
                className="group relative flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] hover:border-white/[0.12] transition-all duration-200 cursor-default"
              >
                <div className="text-neutral-400 group-hover:text-white transition-colors shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-neutral-300 group-hover:text-white truncate transition-colors">
                    {partner.name}
                  </div>
                  <div className="text-[10px] text-neutral-500 truncate font-mono">
                    {partner.role}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
