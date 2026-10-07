import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Download, ShieldCheck, Wallet } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

interface CTAProps {
  onLaunchApp: () => void;
  onDownload?: () => void;
}

export const CTA: React.FC<CTAProps> = ({ onLaunchApp, onDownload }) => {
  const { showComingSoon } = useToast();
  const { t, language } = useLanguage();

  const handleDownloadClick = () => {
    if (onDownload) {
      onDownload();
    } else {
      showComingSoon('Hybit Mobile App (iOS & Android)');
    }
  };

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Container */}
        <div className="relative rounded-[36px] bg-[#141418] border border-white/10 p-8 sm:p-14 lg:p-20 text-center overflow-hidden shadow-2xl shadow-black">
          
          <div className="relative z-10 max-w-3xl mx-auto">
            
            <div className="text-xs font-mono uppercase tracking-widest text-[#0095FF] font-semibold mb-4">
              {t('cta_badge')} · {language === 'id' ? '1 Email : 1 Dompet' : '1 Email : 1 Wallet'}
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight text-balance">
              {t('cta_title')}
            </h2>

            <p className="mt-6 text-base sm:text-xl text-neutral-300 leading-relaxed max-w-xl mx-auto text-balance">
              {t('cta_desc')}
            </p>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onLaunchApp}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#0095FF] hover:bg-[#0080E0] text-white text-base font-semibold shadow-xl shadow-[#0095FF]/30 active:scale-[0.98] transition-all cursor-pointer group"
              >
                <span>{t('cta_button')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleDownloadClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 text-white text-base font-medium active:scale-[0.98] transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-neutral-400" />
                <span>{t('download_app')}</span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#0095FF]/20 text-[#00E5FF] border border-[#0095FF]/30 uppercase ml-1">
                  {t('coming_soon')}
                </span>
              </button>
            </div>

            {/* Micro guarantees */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {language === 'id' ? '100% Kepemilikan Mandiri' : '100% Non-Custodial'}
              </span>
              <span className="text-neutral-600">·</span>
              <span>{language === 'id' ? 'Tersedia di iOS, Android & Web' : 'Available on iOS, Android & Web'}</span>
              <span className="text-neutral-600">·</span>
              <span>{language === 'id' ? 'Siap dalam 5 Detik' : 'Set Up in 5 Seconds'}</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
