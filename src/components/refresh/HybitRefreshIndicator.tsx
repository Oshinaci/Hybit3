import React from 'react';
import { motion } from 'motion/react';
import { HybitLogoIcon } from '../icons/NetworkIcons';
import { HybitTextFill } from './HybitTextFill';
import { useLanguage } from '../../context/LanguageContext';

interface HybitRefreshIndicatorProps {
  /** Pull distance in pixels */
  pullDistance: number;
  /** Maximum pull threshold required to trigger refresh */
  threshold?: number;
  /** Whether refresh action is actively executing */
  isRefreshing: boolean;
}

export const HybitRefreshIndicator: React.FC<HybitRefreshIndicatorProps> = ({
  pullDistance,
  threshold = 68,
  isRefreshing,
}) => {
  const { t } = useLanguage();

  // Smooth responsive fill: fills like running water across H-y-b-i-t as user pulls down, reaching 100% at threshold
  const progress = isRefreshing
    ? 100
    : pullDistance >= threshold
    ? 100
    : Math.min(100, Math.round((pullDistance / threshold) * 100));

  const isReady = pullDistance >= threshold;

  if (pullDistance <= 0 && !isRefreshing) return null;

  return (
    <div
      className="w-full flex flex-col justify-center items-center pointer-events-none overflow-visible transition-all duration-150 py-1 select-none"
      style={{
        height: isRefreshing ? 74 : Math.min(pullDistance + 8, 96),
        opacity: isRefreshing ? 1 : Math.min(1, pullDistance / 10),
      }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="flex flex-col items-center justify-center overflow-visible"
      >
        {/* Unified Brand Lockup: Logo close to Hybit Text and perfectly aligned vertically on center */}
        <div className="flex items-center justify-center gap-1 overflow-visible">
          {/* Hexagonal H Logo Icon with rotation & scale on pull, aligned with text center */}
          <div
            className="relative w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-xl bg-gradient-to-br from-[#0095FF] via-[#0070F3] to-[#0040E0] p-1 flex items-center justify-center shrink-0 shadow-md shadow-[#0095FF]/30 transition-transform duration-150"
            style={{
              transform: isRefreshing
                ? 'scale(1.02)'
                : `rotate(${(progress / 100) * 180}deg) scale(${0.85 + (progress / 100) * 0.15})`,
            }}
          >
            <HybitLogoIcon size={16} color="#FFFFFF" />
          </div>

          {/* Hybit Text with Running Water Liquid Fill Effect - perfectly aligned and close */}
          <div className="flex items-center overflow-visible -ml-0.5">
            <HybitTextFill
              progress={progress}
              isIndeterminate={isRefreshing}
              size="sm"
            />
          </div>
        </div>

        {/* Micro status text directly beneath */}
        <span className="text-[10px] font-mono tracking-tight text-neutral-400 mt-0.5 select-none">
          {isRefreshing
            ? t('refresh_syncing')
            : isReady
            ? t('refresh_release')
            : t('refresh_pull')}
        </span>
      </motion.div>
    </div>
  );
};
