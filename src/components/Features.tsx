import React from 'react';
import { motion } from 'motion/react';
import {
  Wallet,
  Repeat,
  Layers,
  LineChart,
  ShieldCheck,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Features: React.FC = () => {
  const { t, language } = useLanguage();

  const features = [
    {
      id: 'easy-wallet',
      title: t('feat_1_title'),
      subtitle: t('feat_1_sub'),
      description: t('feat_1_desc'),
      icon: Wallet,
      details: [
        t('feat_1_d1'),
        t('feat_1_d2'),
        t('feat_1_d3'),
      ],
    },
    {
      id: 'one-tap-swap',
      title: t('feat_2_title'),
      subtitle: t('feat_2_sub'),
      description: t('feat_2_desc'),
      icon: Repeat,
      details: [
        t('feat_2_d1'),
        t('feat_2_d2'),
        t('feat_2_d3'),
      ],
    },
    {
      id: 'cross-chain-bridge',
      title: t('feat_3_title'),
      subtitle: t('feat_3_sub'),
      description: t('feat_3_desc'),
      icon: Layers,
      details: [
        t('feat_3_d1'),
        t('feat_3_d2'),
        t('feat_3_d3'),
      ],
    },
    {
      id: 'portfolio-tracking',
      title: t('feat_4_title'),
      subtitle: t('feat_4_sub'),
      description: t('feat_4_desc'),
      icon: LineChart,
      details: [
        t('feat_4_d1'),
        t('feat_4_d2'),
        t('feat_4_d3'),
      ],
    },
    {
      id: 'secure-recovery',
      title: t('feat_5_title'),
      subtitle: t('feat_5_sub'),
      description: t('feat_5_desc'),
      icon: ShieldCheck,
      details: [
        t('feat_5_d1'),
        t('feat_5_d2'),
        t('feat_5_d3'),
      ],
    },
    {
      id: 'fast-transfer',
      title: t('feat_6_title'),
      subtitle: t('feat_6_sub'),
      description: t('feat_6_desc'),
      icon: Zap,
      details: [
        t('feat_6_d1'),
        t('feat_6_d2'),
        t('feat_6_d3'),
      ],
    },
  ];

  return (
    <section id="features" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <div className="text-xs font-mono uppercase tracking-widest text-[#0095FF] font-semibold mb-3">
            {t('features_badge')}
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white text-balance">
            {t('features_title')}
            <span className="block text-neutral-400 mt-1">
              {language === 'id' ? 'Kekuatan Web3 yang Sesungguhnya.' : 'the Power Web3 Deserves.'}
            </span>
          </h2>
          
          <p className="mt-4 text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed text-balance">
            {t('features_subtitle')}
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="group relative rounded-3xl bg-[#141418] hover:bg-[#18181D] border border-white/[0.08] hover:border-white/[0.18] p-7 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg shadow-black/40"
              >
                <div>
                  {/* Icon & Index */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center group-hover:border-[#0095FF]/50 group-hover:bg-[#0095FF]/10 transition-colors">
                      <Icon className="w-6 h-6 text-[#0095FF] transition-colors" />
                    </div>
                    <span className="text-xs font-mono text-neutral-500 tracking-wider">
                      0{idx + 1}.
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="mb-3">
                    <span className="text-xs font-semibold text-[#00E5FF] uppercase tracking-wider">
                      {feature.subtitle}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1 group-hover:text-white transition-colors">
                      {feature.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                </div>

                {/* Highlights List */}
                <div className="pt-4 border-t border-white/[0.06] space-y-2">
                  {feature.details.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs text-neutral-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
