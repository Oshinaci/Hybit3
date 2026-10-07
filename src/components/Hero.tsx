import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Download } from 'lucide-react';
import { PhoneMockup } from './PhoneMockup';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
  onLaunchApp: () => void;
  onDownload?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onLaunchApp, onDownload }) => {
  const { showComingSoon } = useToast();
  const { t, language } = useLanguage();

  const handleDownloadClick = () => {
    if (onDownload) {
      onDownload();
    } else {
      showComingSoon('Hybit Mobile App');
    }
  };

  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            
            {/* Clean Unboxed Editorial Kicker */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#0095FF] font-semibold mb-5"
            >
              <span>{t('hero_kicker')}</span>
              <span className="text-neutral-600" aria-hidden="true">·</span>
              <span className="text-neutral-400 font-medium">
                {t('hero_policy')}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-extrabold tracking-tight text-white leading-[1.08] max-w-2xl text-balance"
            >
              {language === 'id' ? (
                <>
                  Kripto Semudah{' '}
                  <span className="text-[#0095FF]">
                    Satu Sentuhan.
                  </span>
                </>
              ) : (
                <>
                  Crypto as Simple as{' '}
                  <span className="text-[#0095FF]">
                    a Single Tap.
                  </span>
                </>
              )}
            </motion.h1>

            {/* Subheadline Copy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="mt-6 text-base sm:text-lg text-neutral-300 space-y-1.5 max-w-xl text-left"
            >
              <p className="font-semibold text-white text-lg sm:text-xl">
                A self custodial wallet being built in public.
              </p>
              <div className="space-y-1 text-neutral-300 text-sm sm:text-base pt-1">
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0095FF] shrink-0" />
                  <span>No seed phrase complexity.</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0095FF] shrink-0" />
                  <span>No unnecessary friction.</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0095FF] shrink-0" />
                  <span>Just your wallet, your assets, your control.</span>
                </p>
              </div>
              <p className="pt-2 font-bold text-[#0095FF] text-base tracking-tight">
                Become a Pioneer.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <button
                onClick={onLaunchApp}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#0095FF] hover:bg-[#0080E0] text-white text-base font-semibold shadow-lg shadow-[#0095FF]/20 active:scale-[0.98] transition-all cursor-pointer group"
              >
                <span>{t('launch_app')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={handleDownloadClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-white text-base font-medium active:scale-[0.98] transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-neutral-400" />
                <span>{t('download_app')}</span>
                <span className="text-xs text-[#0095FF] font-mono">
                  ({t('coming_soon')})
                </span>
              </button>
            </motion.div>

            {/* Early Development Indicator (Anti AI Slop) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 pt-6 border-t border-white/[0.08] flex flex-wrap items-center gap-3 w-full"
            >
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#141419] border border-white/12 text-xs font-mono text-white shadow-lg">
                <span className="w-2 h-2 rounded-full bg-[#0095FF] animate-pulse" />
                <span className="font-bold text-white tracking-wide">Hybit - Early Development</span>
              </div>
              <span className="text-xs text-neutral-400 font-mono">
                Base Sepolia Testnet Active · Privy MPC Enclave
              </span>
            </motion.div>

          </div>

          {/* Right Column: Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, type: 'spring', damping: 25 }}
            className="lg:col-span-5 flex justify-center items-center relative"
          >
            <PhoneMockup />
          </motion.div>

        </div>
      </div>
    </section>
  );
};
