import React, { useState } from 'react';
import {
  Copy,
  Check,
  RefreshCw,
  Share2,
  ExternalLink,
  Wallet,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useWallet } from '../../context/WalletContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatAddress } from '../../lib/wallet/address';

interface ReceiveModalViewProps {
  onClose?: () => void;
}

export const ReceiveModalView: React.FC<ReceiveModalViewProps> = ({ onClose }) => {
  const { showToast } = useToast();
  const { language } = useLanguage();
  const {
    account,
    address,
    isConnected,
    isReady,
    ethBalance,
    isLoadingBalance,
    balanceError,
    refreshBalance,
    openConnectModal,
  } = useWallet();

  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Source of Truth: Real Privy Embedded Wallet Address
  const walletAddress = account?.address || address || '';

  // Copy Full Wallet Address
  const handleCopyAddress = async () => {
    if (!walletAddress) return;
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      showToast(
        language === 'id' ? 'Alamat Disalin' : 'Address Copied',
        walletAddress,
        'copy'
      );
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('[Hybit Receive] Copy error:', err);
    }
  };

  // Web Share API or Fallback to Copy
  const handleShareAddress = async () => {
    if (!walletAddress) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Hybit Wallet Address',
          text: `My Hybit Base Sepolia receive address:\n${walletAddress}`,
          url: `https://sepolia.basescan.org/address/${walletAddress}`,
        });
        return;
      } catch (err) {
        // User cancelled share or browser restriction
        if ((err as Error)?.name !== 'AbortError') {
          console.warn('[Hybit Share] Share failed, falling back to copy:', err);
        } else {
          return;
        }
      }
    }
    // Fallback to Copy
    handleCopyAddress();
  };

  // Refresh Balance via Base Sepolia RPC
  const handleRefreshBalance = async () => {
    setIsRefreshing(true);
    await refreshBalance();
    setIsRefreshing(false);
    showToast(
      language === 'id' ? 'Saldo Diperbarui' : 'Balance Refreshed',
      language === 'id' ? 'Diambil langsung dari RPC Base Sepolia' : 'Fetched directly from Base Sepolia RPC',
      'info'
    );
  };

  // State 1: Disconnected / No Wallet
  if (!isReady || !isConnected || !walletAddress) {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#0095FF]/15 text-[#0095FF] flex items-center justify-center mx-auto border border-[#0095FF]/20">
          <Wallet className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-base font-bold text-white">
            {language === 'id' ? 'Dompet Belum Terhubung' : 'Wallet Not Connected'}
          </h4>
          <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
            {language === 'id'
              ? 'Hubungkan dompet Privy Anda terlebih dahulu untuk melihat alamat publik dan kode QR deposit Base Sepolia.'
              : 'Connect your Privy wallet to view your public receiving address and deposit QR code on Base Sepolia.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (onClose) onClose();
            openConnectModal();
          }}
          className="w-full py-3 rounded-xl bg-[#0095FF] hover:bg-[#0080E0] text-white font-semibold text-xs shadow-md shadow-[#0095FF]/20 transition-all cursor-pointer"
        >
          {language === 'id' ? 'Hubungkan Dompet Sekarang' : 'Connect Wallet Now'}
        </button>
      </div>
    );
  }

  // State 2: Wallet Ready with Real Privy Address & Live Base Sepolia Balance
  const formattedEth = ethBalance !== null ? `${parseFloat(ethBalance).toFixed(6)} ETH` : '0.000000 ETH';

  return (
    <div className="space-y-4 text-center">
      {/* Real QR Code generated directly from actual connected Privy wallet address */}
      <div className="relative group w-48 h-48 mx-auto p-3.5 rounded-2xl bg-white shadow-xl shadow-black/40 flex flex-col items-center justify-center border border-white/20">
        <QRCodeSVG
          value={walletAddress}
          size={160}
          level="M"
          marginSize={0}
          fgColor="#09090B"
          bgColor="#FFFFFF"
        />
        <div className="mt-1 text-[9px] font-sans font-medium text-neutral-500 tracking-wider uppercase">
          {language === 'id' ? 'Base Sepolia QR' : 'Base Sepolia QR'}
        </div>
      </div>

      {/* Network Notice */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>Base Sepolia (Chain ID 84532)</span>
      </div>

      {/* Full Wallet Address Box with Copy */}
      <div className="p-3.5 rounded-2xl bg-[#1C1C23] border border-white/10 space-y-2 text-left">
        <div className="flex items-center justify-between text-[11px] text-neutral-400 font-sans">
          <span>{language === 'id' ? 'Alamat Dompet Saya' : 'My Wallet Address'}</span>
          <span className="text-neutral-500 font-mono text-[10px]">EVM 0x</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span
            className="font-mono text-xs text-white break-all select-all font-medium hover:text-[#00E5FF] transition-colors"
            title={walletAddress}
          >
            {formatAddress(walletAddress, 10, 8)}
          </span>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={handleCopyAddress}
              className="px-3 py-1.5 rounded-xl bg-[#0095FF] hover:bg-[#0080E0] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-[#0095FF]/20"
              title={language === 'id' ? 'Salin Alamat Lengkap' : 'Copy Full Address'}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (language === 'id' ? 'Tersalin' : 'Copied') : (language === 'id' ? 'Salin' : 'Copy')}</span>
            </button>

            <button
              type="button"
              onClick={handleShareAddress}
              className="p-1.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              title={language === 'id' ? 'Bagikan Alamat' : 'Share Address'}
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Live Blockchain Balance & RPC Status */}
      <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-xs text-neutral-300 space-y-2.5 text-left">
        <div className="flex items-center justify-between">
          <span className="text-neutral-400 font-sans">{language === 'id' ? 'Saldo Saat Ini' : 'Current Balance'}</span>
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-white font-bold text-sm">
              {isLoadingBalance ? (
                <span className="text-neutral-500 animate-pulse">{language === 'id' ? 'Memuat...' : 'Loading...'}</span>
              ) : balanceError ? (
                <span className="text-rose-400 flex items-center gap-1 text-xs font-sans">
                  <AlertTriangle className="w-3 h-3" />
                  <span>{language === 'id' ? 'Saldo tidak tersedia' : 'Balance unavailable'}</span>
                </span>
              ) : (
                formattedEth
              )}
            </span>
            <button
              type="button"
              onClick={handleRefreshBalance}
              disabled={isRefreshing || isLoadingBalance}
              className="p-1 rounded-lg bg-white/[0.05] hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title={language === 'id' ? 'Perbarui saldo dari RPC Base Sepolia' : 'Refresh balance from Base Sepolia RPC'}
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing || isLoadingBalance ? 'animate-spin text-[#0095FF]' : ''}`} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
          <span className="text-neutral-400 font-sans">{language === 'id' ? 'Keamanan Alamat' : 'Address Security'}</span>
          <span className="text-neutral-300 font-mono text-[11px] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Privy MPC Self-Custody</span>
          </span>
        </div>
      </div>

      {/* Explorer Link */}
      <div className="flex items-center justify-center pt-1">
        <a
          href={`https://sepolia.basescan.org/address/${walletAddress}`}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-[#0095FF] hover:underline inline-flex items-center gap-1.5 font-mono"
        >
          <span>{language === 'id' ? 'Lihat di BaseScan Explorer' : 'View on BaseScan Explorer'}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
