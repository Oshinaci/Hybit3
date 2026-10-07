import React from 'react';

interface HybitTextFillProps {
  /** Fill progress from 0 to 100 */
  progress: number;
  /** Whether active continuous loading/water wave animation is running */
  isIndeterminate?: boolean;
  /** Font size class or custom styling */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const HybitTextFill: React.FC<HybitTextFillProps> = ({
  progress,
  isIndeterminate = false,
  size = 'md',
  className = '',
}) => {
  // Clamped progress between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progress));

  const sizeStyles = {
    sm: 'text-2xl sm:text-[25px]',
    md: 'text-3xl sm:text-4xl',
    lg: 'text-4xl sm:text-5xl',
    xl: 'text-5xl sm:text-6xl',
  };

  // Balanced vertical line-height and tight zero-left padding
  // so the 'H' connects seamlessly and aligns on the exact same optical center line as the logo.
  const typographyClasses = `block font-chinese tracking-tight leading-none py-1 pl-0 pr-1 select-none overflow-visible whitespace-nowrap ${sizeStyles[size]}`;

  return (
    <div className={`relative inline-flex items-center select-none overflow-visible ${className}`}>
      {/* 1. Base Unfilled Layer: Translucent Hybit text outline/base */}
      <span
        aria-hidden="true"
        className={`${typographyClasses} text-white/20`}
      >
        Hybit
      </span>

      {/* 2. Running Water Liquid Filled Layer: Fluid aqua streams flowing through the text from left to right */}
      <div
        aria-hidden="true"
        className="absolute inset-0 select-none pointer-events-none overflow-visible transition-[clip-path] duration-150 ease-out"
        style={{
          clipPath: isIndeterminate
            ? 'none'
            : `inset(-25px calc(100% - ${clampedProgress}%) -25px 0)`,
          WebkitClipPath: isIndeterminate
            ? 'none'
            : `inset(-25px calc(100% - ${clampedProgress}%) -25px 0)`,
        }}
      >
        <span
          className={`${typographyClasses} bg-gradient-to-r from-[#0055FF] via-[#00B4FF] via-[#A5F3FC] via-[#0095FF] to-[#0055FF] animate-water-flow bg-clip-text text-transparent`}
        >
          Hybit
        </span>
      </div>

      {/* 3. Water Wave Crest Sparkle: Active liquid front advancing from left to right */}
      {!isIndeterminate && clampedProgress > 2 && clampedProgress < 98 && (
        <span
          className="absolute top-0 bottom-0 pointer-events-none transition-[left] duration-150 ease-out z-10 flex items-center"
          style={{ left: `${clampedProgress}%` }}
        >
          {/* Vertical water wave crest blade */}
          <span className="w-[2.5px] h-[88%] bg-gradient-to-b from-[#A5F3FC] via-[#00E5FF] to-[#0095FF] shadow-[0_0_14px_#00E5FF] rounded-full" />
          {/* Water droplet glow */}
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#00E5FF]/45 blur-xs rounded-full" />
        </span>
      )}
    </div>
  );
};
