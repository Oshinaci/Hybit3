import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  Smartphone,
  ShieldCheck,
  Send,
  Repeat,
  Copy,
  Layers,
  CreditCard,
} from 'lucide-react';
import { useLanguage } from './LanguageContext';

export type ToastType =
  | 'success'
  | 'failed'
  | 'error'
  | 'info'
  | 'warning'
  | 'coming-soon'
  | 'send'
  | 'swap'
  | 'bridge'
  | 'buy'
  | 'copy';

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type?: ToastType;
}

interface ToastContextValue {
  showToast: (title: string, message?: string, type?: ToastType) => void;
  showComingSoon: (featureName?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const lastToastTimeRef = useRef<{ [key: string]: number }>({});

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (title: string, message?: string, type: ToastType = 'info') => {
      // Deduplication: prevent identical toast within 1.2 seconds
      const key = `${title}__${type}`;
      const now = Date.now();
      if (lastToastTimeRef.current[key] && now - lastToastTimeRef.current[key] < 1200) {
        return;
      }
      lastToastTimeRef.current[key] = now;

      const id = 'toast-' + now + '-' + Math.random().toString(36).substring(2, 6);
      const newToast: ToastItem = { id, title, message, type };

      setToasts((prev) => {
        // Keep at most 2 active toasts to avoid clutter / overlapping
        const filtered = prev.filter((t) => t.title !== title);
        return [...filtered.slice(-1), newToast];
      });

      setTimeout(() => {
        removeToast(id);
      }, 3500);
    },
    [removeToast]
  );

  const showComingSoon = useCallback(
    (featureName: string = 'Mobile App') => {
      const isId = language === 'id';
      showToast(
        isId ? `${featureName} — Segera Hadir` : `${featureName} — Coming Soon`,
        isId
          ? 'Aplikasi native iOS & Android sedang dalam tahap uji coba early access. Versi Web sudah aktif & siap digunakan.'
          : 'Native iOS & Android mobile apps are in early access testing. Web App is fully active & ready to use.',
        'coming-soon'
      );
    },
    [showToast, language]
  );

  return (
    <ToastContext.Provider value={{ showToast, showComingSoon }}>
      {children}
      {/* Floating Notification Toast Hub */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none flex flex-col items-center gap-2 w-full max-w-md px-4">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => {
            const isError = toast.type === 'failed' || toast.type === 'error';

            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: -24, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                className={`pointer-events-auto w-full rounded-2xl p-3.5 shadow-2xl shadow-black/80 backdrop-blur-2xl flex items-start gap-3 text-white border ${
                  isError
                    ? 'bg-[#181114]/95 border-rose-500/30 shadow-rose-950/30'
                    : 'bg-[#141419]/95 border-white/20'
                }`}
              >
                {/* Icon based on toast type */}
                <div
                  className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                    isError
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-white/[0.08]'
                  }`}
                >
                  {toast.type === 'coming-soon' && <Smartphone className="w-4 h-4 text-[#00E5FF]" />}
                  {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {isError && <XCircle className="w-4 h-4 text-rose-400" />}
                  {toast.type === 'send' && <Send className="w-4 h-4 text-[#0095FF]" />}
                  {toast.type === 'swap' && <Repeat className="w-4 h-4 text-[#0095FF]" />}
                  {toast.type === 'bridge' && <Layers className="w-4 h-4 text-indigo-400" />}
                  {toast.type === 'buy' && <CreditCard className="w-4 h-4 text-emerald-400" />}
                  {toast.type === 'copy' && <Copy className="w-4 h-4 text-emerald-400" />}
                  {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400" />}
                  {toast.type === 'info' && <ShieldCheck className="w-4 h-4 text-[#0095FF]" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-1">
                  <div className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                    <span className={isError ? 'text-rose-300' : 'text-white'}>{toast.title}</span>
                    {toast.type === 'coming-soon' && (
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded-full bg-[#0095FF]/20 text-[#00E5FF] border border-[#0095FF]/30">
                        v1.0.0
                      </span>
                    )}
                    {isError && (
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        Error
                      </span>
                    )}
                  </div>
                  {toast.message && (
                    <p className="text-[11px] text-neutral-300 mt-0.5 leading-relaxed">
                      {toast.message}
                    </p>
                  )}
                </div>

                {/* Close Button */}
                <button
                  onClick={() => removeToast(toast.id)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer shrink-0"
                  aria-label="Dismiss notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
