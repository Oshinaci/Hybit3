import React, { useState } from 'react';
import { motion } from 'motion/react';
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
} from './icons/NetworkIcons';
import { Globe2 } from 'lucide-react';
import { SupportedNetwork } from '../types';
import { useLanguage } from '../context/LanguageContext';

export const Ecosystem: React.FC = () => {
  const { t, language } = useLanguage();
  const [filter, setFilter] = useState<'ALL' | 'L2' | 'EVM' | 'Non-EVM'>('ALL');

  const networks: SupportedNetwork[] = [
    {
      id: 'ethereum',
      name: 'Ethereum',
      type: 'EVM',
      tps: '15-30',
      avgFee: '$0.85',
      finality: language === 'id' ? '12 mnt' : '12 min',
      token: 'ETH',
      description:
        language === 'id'
          ? 'Fondasi keamanan terdesentralisasi dan penyelesaian DeFi bernilai tinggi.'
          : 'The foundation of decentralized security and high-value DeFi settlement.',
    },
    {
      id: 'base',
      name: 'Base',
      type: 'L2',
      tps: '65-120',
      avgFee: '< $0.01',
      finality: language === 'id' ? '1 dtk' : '1 sec',
      token: 'ETH',
      description:
        language === 'id'
          ? 'Layer 2 Ethereum inkubasi Coinbase untuk aplikasi konsumen berkecepatan tinggi.'
          : 'Coinbase-incubated Ethereum L2 built for frictionless consumer applications.',
    },
    {
      id: 'arbitrum',
      name: 'Arbitrum One',
      type: 'L2',
      tps: '80-150',
      avgFee: '$0.02',
      finality: language === 'id' ? '1 dtk' : '1 sec',
      token: 'ETH',
      description:
        language === 'id'
          ? 'Rollup Ethereum terkemuka dengan likuiditas masif dan latensi eksekusi rendah.'
          : 'Leading Ethereum rollup with massive liquidity and low execution latency.',
    },
    {
      id: 'optimism',
      name: 'Optimism',
      type: 'L2',
      tps: '60-110',
      avgFee: '$0.02',
      finality: language === 'id' ? '1 dtk' : '1 sec',
      token: 'ETH',
      description:
        language === 'id'
          ? 'Rollup L2 yang cepat dan aman, menggerakkan ekosistem Superchain.'
          : 'Fast, secure L2 rollup powering the Superchain ecosystem.',
    },
    {
      id: 'polygon',
      name: 'Polygon PoS',
      type: 'EVM',
      tps: '90-140',
      avgFee: '< $0.01',
      finality: language === 'id' ? '2.1 dtk' : '2.1 sec',
      token: 'POL',
      description:
        language === 'id'
          ? 'Rantai EVM berkecepatan tinggi dengan adopsi luas di industri gaming dan enterprise.'
          : 'High-speed EVM chain with extensive gaming and enterprise adoption.',
    },
    {
      id: 'bnb',
      name: 'BNB Chain',
      type: 'EVM',
      tps: '100-200',
      avgFee: '$0.03',
      finality: language === 'id' ? '3 dtk' : '3 sec',
      token: 'BNB',
      description:
        language === 'id'
          ? 'Jaringan smart contract dengan throughput tinggi dan volume ritel global yang kuat.'
          : 'High-throughput smart contract network with deep global retail volume.',
    },
    {
      id: 'solana',
      name: 'Solana',
      type: 'Non-EVM',
      tps: '2,500-4,000',
      avgFee: '$0.0002',
      finality: language === 'id' ? '400 ms' : '400 ms',
      token: 'SOL',
      description:
        language === 'id'
          ? 'Throughput tinggi dan latensi sub-detik untuk transaksi mikro konsumen global.'
          : 'High-throughput and sub-second execution for global consumer micro-transactions.',
    },
    {
      id: 'sui',
      name: 'Sui',
      type: 'Non-EVM',
      tps: '10,000+',
      avgFee: '$0.001',
      finality: language === 'id' ? '480 ms' : '480 ms',
      token: 'SUI',
      description:
        language === 'id'
          ? 'Arsitektur berorientasi objek yang didukung Move dengan eksekusi paralel instan.'
          : 'Object-centric Move-powered blockchain with instant parallel execution.',
    },
    {
      id: 'aptos',
      name: 'Aptos',
      type: 'Non-EVM',
      tps: '10,000+',
      avgFee: '$0.001',
      finality: language === 'id' ? '600 ms' : '600 ms',
      token: 'APT',
      description:
        language === 'id'
          ? 'Infrastruktur L1 tangguh berbasis Move yang dibangun untuk keandalan dan skalabilitas.'
          : 'Resilient Move-based L1 infrastructure engineered for usability and scale.',
    },
  ];

  const getNetworkIcon = (id: string) => {
    switch (id) {
      case 'ethereum':
        return <EthereumIcon className="w-6 h-6 text-indigo-400" />;
      case 'base':
        return <BaseIcon className="w-6 h-6 text-[#0095FF]" />;
      case 'polygon':
        return <PolygonIcon className="w-6 h-6 text-purple-400" />;
      case 'optimism':
        return <OptimismIcon className="w-6 h-6 text-red-500" />;
      case 'arbitrum':
        return <ArbitrumIcon className="w-6 h-6 text-blue-400" />;
      case 'bnb':
        return <BNBIcon className="w-6 h-6 text-amber-400" />;
      case 'solana':
        return <SolanaIcon className="w-6 h-6 text-emerald-400" />;
      case 'sui':
        return <SuiIcon className="w-6 h-6 text-sky-400" />;
      case 'aptos':
        return <AptosIcon className="w-6 h-6 text-teal-400" />;
      default:
        return <Globe2 className="w-6 h-6 text-neutral-400" />;
    }
  };

  const filteredNetworks = networks.filter((n) => {
    if (filter === 'ALL') return true;
    return n.type === filter;
  });

  return (
    <section id="ecosystem" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <div className="text-xs font-mono uppercase tracking-widest text-[#0095FF] font-semibold mb-3">
            {t('eco_badge')}
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white text-balance">
            {t('eco_title')}
          </h2>

          <p className="mt-4 text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed text-balance">
            {t('eco_subtitle')}
          </p>

          {/* Interactive Filter Control */}
          <div className="mt-8 inline-flex items-center gap-1 p-1 rounded-2xl bg-[#141418] border border-white/[0.08]">
            {(['ALL', 'L2', 'EVM', 'Non-EVM'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  filter === cat
                    ? 'bg-[#0095FF] text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {cat === 'ALL' ? (language === 'id' ? 'Semua Jaringan' : 'All Networks') : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Network Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNetworks.map((net, idx) => (
            <motion.div
              key={net.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className="p-6 rounded-3xl bg-[#141418] border border-white/[0.08] hover:border-white/[0.18] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                      {getNetworkIcon(net.id)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{net.name}</h3>
                      <span className="text-[11px] font-mono text-neutral-400">{net.token}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-neutral-400">
                    {net.type}
                  </span>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                  {net.description}
                </p>
              </div>

              {/* Stats Bar */}
              <div className="pt-4 border-t border-white/[0.06] grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-[10px] uppercase font-mono text-neutral-500">
                    {language === 'id' ? 'Kec. TPS' : 'Peak TPS'}
                  </div>
                  <div className="text-xs font-bold text-white font-mono mt-0.5 tabular-nums">
                    {net.tps}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-neutral-500">
                    {language === 'id' ? 'Biaya Rata2' : 'Avg Fee'}
                  </div>
                  <div className="text-xs font-bold text-emerald-400 font-mono mt-0.5 tabular-nums">
                    {net.avgFee}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-neutral-500">
                    {language === 'id' ? 'Finalitas' : 'Finality'}
                  </div>
                  <div className="text-xs font-bold text-white font-mono mt-0.5 tabular-nums">
                    {net.finality}
                  </div>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
