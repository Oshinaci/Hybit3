import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HybitLogoIcon } from '../icons/NetworkIcons';
import { HybitTextFill } from '../refresh/HybitTextFill';
import { useLanguage } from '../../context/LanguageContext';

interface LoadingScreenProps {
  onComplete?: () => void;
  minDurationMs?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  minDurationMs = 1400,
}) => {
  const { t, language } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const current = Math.min(100, Math.round((elapsed / minDurationMs) * 100));
      setProgress(current);

      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => {
            onComplete?.();
          }, 350);
        }, 150);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [minDurationMs, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#09090B] text-white select-none px-4"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute w-96 h-96 rounded-full bg-[#0095FF]/15 blur-[120px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center max-w-xs text-center space-y-6">
            {/* Hexagonal H Logo with subtle breathing ring */}
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0095FF] via-[#0070F3] to-[#0040E0] p-3 flex items-center justify-center shadow-2xl shadow-[#0095FF]/30 border border-white/20">
                <HybitLogoIcon size={38} color="#FFFFFF" />
              </div>
              <div className="absolute -inset-1 rounded-2xl bg-[#0095FF]/20 blur-md -z-10 animate-pulse" />
            </div>

            {/* Hybit Text with Left-to-Right Fill Animation */}
            <div className="pt-1">
              <HybitTextFill progress={progress} size="lg" />
            </div>

            {/* Precision Micro Progress Bar */}
            <div className="w-48 space-y-2">
              <div className="h-1 w-full bg-white/[0.08] rounded-full overflow-hidden p-[1px]">
                <div
                  className="h-full bg-gradient-to-r from-[#0095FF] via-[#00E5FF] to-white rounded-full transition-all duration-75 ease-out shadow-[0_0_8px_#00E5FF]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400">
                <span>{language === 'id' ? 'Inisialisasi MPC...' : 'Initializing MPC...'}</span>
                <span>{progress}%</span>
              </div>
            </div>

            <p className="text-xs text-neutral-400 font-sans tracking-wide">
              {t('app_tagline')}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
