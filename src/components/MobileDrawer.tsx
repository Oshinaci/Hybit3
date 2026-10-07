import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Download } from 'lucide-react';
import { HybitLogo } from './icons/NetworkIcons';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchApp: () => void;
  onDownload?: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  onLaunchApp,
  onDownload,
}) => {
  const { showComingSoon } = useToast();
  const { t } = useLanguage();

  const handleDownloadClick = () => {
    onClose();
    if (onDownload) {
      onDownload();
    } else {
      showComingSoon('Hybit Mobile App');
    }
  };
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  const navLinks = [
    { label: t('nav_features'), href: '#features' },
    { label: t('nav_preview'), href: '#preview' },
    { label: t('nav_security'), href: '#security' },
    { label: t('nav_ecosystem'), href: '#ecosystem' },
    { label: t('nav_faq'), href: '#faq' },
  ];

  const handleLinkClick = (href: string) => {
    onClose();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Drawer: slides from left, #09090B, 95% opacity, backdrop blur, soft border, premium shadow */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative z-10 flex flex-col w-[85%] max-w-[340px] h-full bg-[#09090B]/95 backdrop-blur-2xl border-r border-white/10 shadow-2xl shadow-black/90 p-6 overflow-y-auto"
            style={{ backgroundColor: 'rgba(9, 9, 11, 0.95)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
              <HybitLogo size={34} showText={true} />
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation links */}
            <nav className="flex flex-col gap-1 py-6 flex-1">
              <span className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2 px-3">
                {t('navigation')}
              </span>
              {navLinks.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleLinkClick(item.href)}
                  className="flex items-center justify-between px-3 py-3 rounded-xl text-base font-medium text-neutral-300 hover:text-white hover:bg-white/[0.05] transition-all text-left"
                >
                  <span>{item.label}</span>
                  <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400 transition-colors" />
                </button>
              ))}

              <div className="pt-4 mt-2 border-t border-white/[0.06]">
                <button
                  onClick={handleDownloadClick}
                  className="flex items-center justify-between w-full px-3 py-3 rounded-xl text-base font-medium text-neutral-300 hover:text-white hover:bg-white/[0.05] transition-all text-left"
                >
                  <span className="flex items-center gap-2.5">
                    <Download className="w-4 h-4 text-[#0095FF]" />
                    {t('download_app')}
                  </span>
                  <span className="text-[10px] text-[#00E5FF] bg-[#0095FF]/20 border border-[#0095FF]/30 px-2 py-0.5 rounded-full font-mono uppercase font-semibold">
                    {t('coming_soon')}
                  </span>
                </button>
              </div>
            </nav>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-white/[0.08] flex flex-col gap-3">
              <button
                onClick={() => {
                  onClose();
                  onLaunchApp();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0095FF] hover:bg-[#0080E0] text-white font-medium text-sm shadow-md shadow-[#0095FF]/20 active:scale-[0.98] transition-all cursor-pointer"
              >
                {t('launch_app')}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 px-1">
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  {t('mainnet_ready')}
                </span>
                <span className="font-mono text-neutral-400">{t('early_access')}</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
