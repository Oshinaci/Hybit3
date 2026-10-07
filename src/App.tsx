import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustedBy } from './components/TrustedBy';
import { Features } from './components/Features';
import { WalletPreview } from './components/WalletPreview';
import { Security } from './components/Security';
import { Ecosystem } from './components/Ecosystem';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { useToast } from './context/ToastContext';
import { useLanguage } from './context/LanguageContext';
import { LoadingScreen } from './components/common/LoadingScreen';
import { PullToRefresh } from './components/refresh/PullToRefresh';

// Dashboard Components
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { DashboardHome } from './components/dashboard/DashboardHome';
import { PortfolioView } from './components/dashboard/PortfolioView';
import { ActivityView } from './components/dashboard/ActivityView';
import { WalletView } from './components/dashboard/WalletView';
import { SettingsView } from './components/dashboard/SettingsView';
import { QuickActionModals } from './components/dashboard/QuickActionModals';
import { DashboardPage } from './types/dashboard';

export default function App() {
  const { showComingSoon, showToast } = useToast();
  const { t } = useLanguage();
  // Loading screen state: only active when user clicks "Launch App"
  const [isLoading, setIsLoading] = useState(false);

  // Pull down / refresh state
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Navigation view: 'landing' or 'dashboard'
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [dashboardPage, setDashboardPage] = useState<DashboardPage>('dashboard');

  // Quick action modal state (Send, Receive, Swap, Buy, Bridge)
  const [activeQuickAction, setActiveQuickAction] = useState<
    'send' | 'receive' | 'swap' | 'buy' | 'bridge' | null
  >(null);

  // Pull to refresh handler with simulated network sync
  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1300));
    setIsRefreshing(false);
    showToast(
      t('refresh_success_title'),
      t('refresh_success_desc'),
      'success'
    );
  };

  // "Launch App" triggers the loading screen transition into the dashboard
  const handleLaunchApp = () => {
    setIsLoading(true);
    setCurrentView('dashboard');
    setDashboardPage('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Only trigger coming soon notification, no download page shown
  const handleDownload = () => {
    showComingSoon('Hybit Mobile App (iOS & Android)');
  };

  // Render Dashboard View
  if (currentView === 'dashboard') {
    // When loading screen is active, do NOT render dashboard layout or bottom navbar
    if (isLoading) {
      return <LoadingScreen onComplete={() => setIsLoading(false)} />;
    }

    return (
      <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] font-sans antialiased overflow-x-hidden selection:bg-[#0095FF]/30 selection:text-white">
        <DashboardLayout
          currentPage={dashboardPage}
          onPageChange={(page) => {
            setDashboardPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onBackToLanding={handleBackToLanding}
          onQuickAction={(action) => setActiveQuickAction(action)}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
        >
          {dashboardPage === 'dashboard' && (
            <DashboardHome
              onQuickAction={(action) => setActiveQuickAction(action)}
              onNavigateToPortfolio={() => setDashboardPage('portfolio')}
              onNavigateToActivity={() => setDashboardPage('activity')}
              isRefreshing={isRefreshing}
            />
          )}

          {dashboardPage === 'portfolio' && (
            <PortfolioView
              onQuickAction={(action) => setActiveQuickAction(action)}
              isRefreshing={isRefreshing}
            />
          )}

          {dashboardPage === 'activity' && <ActivityView isRefreshing={isRefreshing} />}

          {dashboardPage === 'wallet' && <WalletView />}

          {dashboardPage === 'settings' && <SettingsView />}
        </DashboardLayout>

        {/* Interactive Quick Action Modals */}
        <QuickActionModals
          type={activeQuickAction}
          onClose={() => setActiveQuickAction(null)}
        />
      </div>
    );
  }

  // Render Landing Page View (No pull to refresh on landing page)
  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] font-sans antialiased overflow-x-hidden selection:bg-[#0095FF]/30 selection:text-white">
      {/* Sticky Navigation Bar */}
      <Navbar onLaunchApp={handleLaunchApp} onDownload={handleDownload} />

      {/* Main Content Sections */}
      <main>
        {/* Hero Section with intuitive crypto phone mockup */}
        <Hero onLaunchApp={handleLaunchApp} onDownload={handleDownload} />

        {/* Trusted By & Protocol Integrations */}
        <TrustedBy />

        {/* 6 Core Feature Cards */}
        <Features />

        {/* Full-Fidelity Desktop Wallet Preview with interactive chart & swap */}
        <WalletPreview onLaunchApp={handleLaunchApp} />

        {/* Security Pillars: Non-custodial, Open Source, Audited, MPC, Encrypted Recovery */}
        <Security />

        {/* Multi-Chain Ecosystem Grid with live telemetry */}
        <Ecosystem />

        {/* Verified User & Developer Testimonials */}
        <Testimonials />

        {/* FAQ Accordion */}
        <FAQ />

        {/* Large Conversion CTA Banner */}
        <CTA onLaunchApp={handleLaunchApp} onDownload={handleDownload} />
      </main>

      {/* Footer with Legal, Company, and Operational status */}
      <Footer onDownload={handleDownload} />
    </div>
  );
}
