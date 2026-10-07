import React, { useState, useEffect } from 'react';
import { Menu, ArrowRight } from 'lucide-react';
import { HybitLogo } from './icons/NetworkIcons';
import { MobileDrawer } from './MobileDrawer';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  onLaunchApp: () => void;
  onDownload?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLaunchApp, onDownload }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { showComingSoon } = useToast();
  const { t } = useLanguage();

  const handleDownloadClick = () => {
    if (onDownload) {
      onDownload();
    } else {
      showComingSoon('Hybit Mobile App');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t('nav_features'), href: '#features' },
    { label: t('nav_preview'), href: '#preview' },
    { label: t('nav_security'), href: '#security' },
    { label: t('nav_ecosystem'), href: '#ecosystem' },
    { label: t('nav_faq'), href: '#faq' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#09090B]/90 backdrop-blur-md border-b border-white/[0.08] shadow-lg shadow-black/40 py-3.5'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Brand Logo */}
            <a
              href="#"
              className="flex items-center gap-2 text-decoration-none group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0095FF] rounded-lg"
              aria-label="Hybit Home"
            >
              <HybitLogo size={36} showText={true} />
            </a>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="relative py-1 text-neutral-300 hover:text-white transition-colors duration-200 group text-sm"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0095FF] transition-all duration-200 group-hover:w-full rounded-full" />
                </a>
              ))}
              <button
                onClick={handleDownloadClick}
                className="relative py-1 text-neutral-300 hover:text-white transition-colors duration-200 group text-sm cursor-pointer flex items-center gap-1.5"
              >
                <span>{t('nav_download')}</span>
                <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-full bg-[#0095FF]/20 text-[#00E5FF] border border-[#0095FF]/30 uppercase">
                  {t('coming_soon')}
                </span>
              </button>
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={onLaunchApp}
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide text-white bg-[#0095FF] hover:bg-[#0080E0] hover:shadow-md hover:shadow-[#0095FF]/20 active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                <span>{t('launch_app')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/[0.08] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0095FF]"
                aria-label="Open mobile menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onLaunchApp={onLaunchApp}
        onDownload={onDownload}
      />
    </>
  );
};
