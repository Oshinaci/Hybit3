import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  ArrowUpRight,
  Repeat,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { EthereumIcon, SolanaIcon, BaseIcon, CircleIcon } from './icons/NetworkIcons';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

export const WalletPreview: React.FC<{ onLaunchApp?: () => void }> = ({ onLaunchApp }) => {
  const { showToast } = useToast();
  const { t, language } = useLanguage();
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y' | 'ALL'>('1M');

  // Interactive Swap Simulator state
  const [swapFromAmount, setSwapFromAmount] = useState('1.5');
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapSuccess, setSwapSuccess] = useState(false);

  // Chart data points per timeframe
  const chartPaths: Record<string, { d: string; points: { x: number; y: number }[]; gain: string; total: string }> = {
    '1D': {
      d: 'M 0 160 C 80 140, 160 170, 240 130 C 320 90, 400 120, 480 80 C 560 40, 640 60, 720 30',
      points: [
        { x: 100, y: 150 },
        { x: 300, y: 100 },
        { x: 500, y: 70 },
        { x: 720, y: 30 },
      ],
      gain: '+$1,142.30 (+2.7%)',
      total: '$42,918.24',
    },
    '1W': {
      d: 'M 0 180 C 80 150, 160 120, 240 140 C 320 100, 400 70, 480 90 C 560 50, 640 40, 720 20',
      points: [
        { x: 120, y: 135 },
        { x: 340, y: 85 },
        { x: 580, y: 45 },
        { x: 720, y: 20 },
      ],
      gain: '+$3,450.80 (+8.7%)',
      total: '$42,918.24',
    },
    '1M': {
      d: 'M 0 200 C 90 190, 180 130, 270 140 C 360 150, 450 80, 540 60 C 630 40, 680 50, 720 15',
      points: [
        { x: 150, y: 150 },
        { x: 350, y: 110 },
        { x: 550, y: 55 },
        { x: 720, y: 15 },
      ],
      gain: '+$8,720.50 (+25.5%)',
      total: '$42,918.24',
    },
    '1Y': {
      d: 'M 0 210 C 90 200, 180 180, 270 120 C 360 100, 450 110, 540 50 C 630 30, 680 40, 720 10',
      points: [
        { x: 180, y: 160 },
        { x: 360, y: 95 },
        { x: 540, y: 45 },
        { x: 720, y: 10 },
      ],
      gain: '+$19,430.00 (+82.7%)',
      total: '$42,918.24',
    },
    'ALL': {
      d: 'M 0 220 C 90 210, 180 160, 270 140 C 360 80, 450 90, 540 40 C 630 20, 680 30, 720 8',
      points: [
        { x: 150, y: 170 },
        { x: 350, y: 75 },
        { x: 620, y: 40 },
        { x: 720, y: 8 },
      ],
      gain: '+$31,200.00 (+266.7%)',
      total: '$42,918.24',
    },
  };

  const currentChart = chartPaths[timeframe];

  const handleSimulateSwap = () => {
    setIsSwapping(true);
    setTimeout(() => {
      setIsSwapping(false);
      setSwapSuccess(true);
      showToast(
        language === 'id' ? 'Pratinjau Desain Antarmuka' : 'Interface Design Preview',
        language === 'id'
          ? 'Buka Aplikasi Web untuk menghubungkan dompet Privy Anda di Base Sepolia.'
          : 'Launch Web App to connect your Privy wallet on Base Sepolia.',
        'info'
      );
      setTimeout(() => setSwapSuccess(false), 3500);
    }, 800);
  };

  const calculatedOutput = (parseFloat(swapFromAmount || '0') * 3420.5).toFixed(2);

  return (
    <section id="preview" className="py-24 sm:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="text-xs font-mono uppercase tracking-widest text-[#0095FF] font-semibold mb-3">
            {t('preview_badge')}
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white text-balance">
            {t('preview_title')}
          </h2>

          <p className="mt-4 text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed text-balance">
            {t('preview_subtitle')}
          </p>
        </div>

        {/* Desktop Interface Card */}
        <div className="relative rounded-3xl bg-[#101014] border border-white/10 shadow-2xl shadow-black overflow-hidden backdrop-blur-xl">
          
          {/* Top Window Bar */}
          <div className="px-6 py-4 border-b border-white/[0.08] bg-[#0B0B0E] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-neutral-700 hover:bg-rose-500 transition-colors" />
              <span className="w-3 h-3 rounded-full bg-neutral-700 hover:bg-amber-500 transition-colors" />
              <span className="w-3 h-3 rounded-full bg-neutral-700 hover:bg-emerald-500 transition-colors" />
              <span className="ml-3 text-xs text-neutral-400 font-mono hidden sm:inline-block">
                app.hybit.wallet/dashboard
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block text-xs font-mono text-neutral-400">
                {language === 'id' ? '1 Email : 1 Dompet' : '1 Email : 1 Wallet'}
              </span>
              <button
                onClick={onLaunchApp}
                className="px-3.5 py-1.5 rounded-xl bg-[#0095FF] hover:bg-[#0080E0] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>{language === 'id' ? 'Buka Aplikasi' : 'Open Full App'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Window Body: Grid */}
          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Col: Chart & Balance Details */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                    {language === 'id' ? 'Total Saldo Portofolio' : 'Total Portfolio Balance'}
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono mt-1 tracking-tight tabular-nums">
                    {currentChart.total}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-emerald-400 font-semibold font-mono">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="tabular-nums">{currentChart.gain}</span>
                    <span className="text-neutral-500 font-normal">
                      · {language === 'id' ? 'vs periode sebelumnya' : 'vs previous timeframe'}
                    </span>
                  </div>
                </div>

                {/* Timeframe selector */}
                <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] w-fit">
                  {(['1D', '1W', '1M', '1Y', 'ALL'] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => {
                        setTimeframe(tf);
                        showToast(
                          language === 'id' ? `Grafik: ${tf}` : `Chart: ${tf}`,
                          language === 'id'
                            ? `Garis waktu diperbarui ke ${tf}. Data simulasi diselaraskan.`
                            : `Chart timeframe updated to ${tf}. Visuals aligned.`,
                          'info'
                        );
                      }}
                      className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all cursor-pointer ${
                        timeframe === tf
                          ? 'bg-[#0095FF] text-white font-bold shadow-sm'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic SVG Chart */}
              <div className="relative h-56 w-full pt-4">
                <svg viewBox="0 0 720 220" fill="none" className="w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0095FF" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#0095FF" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Fill */}
                  <path
                    d={`${currentChart.d} L 720 220 L 0 220 Z`}
                    fill="url(#chartGlow)"
                    className="transition-all duration-500 ease-out"
                  />
                  
                  {/* Stroke line */}
                  <path
                    d={currentChart.d}
                    stroke="#0095FF"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="transition-all duration-500 ease-out"
                  />
                  
                  {/* Current Active Dot */}
                  <circle cx="720" cy="15" r="5" fill="#00E5FF" className="animate-pulse" />
                </svg>
              </div>

              {/* Multi-Chain Distribution (Unboxed) */}
              <div className="pt-4 border-t border-white/[0.06]">
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                  <span>{t('port_distribution_title')}</span>
                  <span className="font-mono text-neutral-300">{t('port_distribution_desc')}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden flex gap-0.5">
                  <div className="h-full bg-indigo-500 rounded-l-full" style={{ width: '56%' }} title="Ethereum 56%" />
                  <div className="h-full bg-emerald-500" style={{ width: '27%' }} title="Solana 27%" />
                  <div className="h-full bg-sky-500" style={{ width: '12%' }} title="Base 12%" />
                  <div className="h-full bg-blue-500 rounded-r-full" style={{ width: '5%' }} title="Arbitrum 5%" />
                </div>
              </div>

            </div>

            {/* Right Col: Instant Interactive Swap Simulator */}
            <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-[#141418] border border-white/[0.08]">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <Repeat className="w-4 h-4 text-[#0095FF]" />
                    <span className="text-sm font-bold text-white">
                      {language === 'id' ? 'Mesin Swap Interaktif' : 'Interactive Swap Engine'}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-emerald-400">
                    {language === 'id' ? 'Kurs Terbaik (0% Slippage)' : 'Best Rate (0% Slippage)'}
                  </span>
                </div>

                {/* From Box */}
                <div className="mt-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex justify-between text-xs text-neutral-400 mb-1.5">
                    <span>{t('preview_you_pay')}</span>
                    <span className="font-mono text-[10px] text-neutral-400">{language === 'id' ? 'Mode Pratinjau' : 'Preview Mode'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="number"
                      value={swapFromAmount}
                      onChange={(e) => setSwapFromAmount(e.target.value)}
                      className="bg-transparent text-2xl font-bold font-mono text-white focus:outline-none w-28"
                    />
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/10 text-xs font-semibold text-white">
                      <EthereumIcon className="w-4 h-4 text-indigo-400" />
                      <span>ETH</span>
                    </div>
                  </div>
                </div>

                {/* Swap Arrow Divider */}
                <div className="flex justify-center -my-2 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-[#18181E] border border-white/10 flex items-center justify-center text-neutral-400 shadow-md">
                    <Repeat className="w-3.5 h-3.5 text-[#0095FF]" />
                  </div>
                </div>

                {/* To Box */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex justify-between text-xs text-neutral-400 mb-1.5">
                    <span>{t('preview_you_receive')}</span>
                    <span className="font-mono">{language === 'id' ? 'Estimasi Output' : 'Estimated Output'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-2xl font-bold font-mono text-[#00E5FF] tabular-nums">
                      ${calculatedOutput}
                    </span>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/10 text-xs font-semibold text-white">
                      <CircleIcon className="w-4 h-4 text-sky-400" />
                      <span>USDC</span>
                    </div>
                  </div>
                </div>

                {/* Rate Info */}
                <div className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs text-neutral-400 space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span>{t('preview_rate')}</span>
                    <span className="text-white">1 ETH = 3,420.50 USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'id' ? 'Biaya Jaringan:' : 'Network Fee:'}</span>
                    <span className="text-emerald-400">{language === 'id' ? '$0.00 (Disubsidi)' : '$0.00 (Sponsored)'}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6">
                {swapSuccess ? (
                  <div className="w-full py-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-semibold text-xs flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t('preview_swap_success')}</span>
                  </div>
                ) : (
                  <button
                    onClick={handleSimulateSwap}
                    disabled={isSwapping}
                    className="w-full py-3.5 rounded-xl bg-[#0095FF] hover:bg-[#0080E0] text-white font-semibold text-xs shadow-lg shadow-[#0095FF]/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSwapping ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{language === 'id' ? 'Mengeksekusi Simulasi...' : 'Simulating On-Chain Swap...'}</span>
                      </>
                    ) : (
                      <>
                        <Repeat className="w-3.5 h-3.5" />
                        <span>{t('preview_swap_btn')}</span>
                      </>
                    )}
                  </button>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
