import React, { useEffect } from 'react';
import {
  Send,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Wallet,
  ArrowLeft,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import { useWallets } from '@privy-io/react-auth';
import { useWallet } from '../../context/WalletContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTransaction } from '../../hooks/transaction/useTransaction';
import { isAddress } from 'viem';
import { BASE_SEPOLIA_CHAIN_ID } from '../../lib/blockchain/networks';

interface SendModalViewProps {
  onClose: () => void;
}

export const SendModalView: React.FC<SendModalViewProps> = ({ onClose }) => {
  const { language } = useLanguage();
  const { wallets } = useWallets();
  const {
    account,
    isConnected,
    ethBalance,
    rawEthBalance,
    isLoadingBalance,
    refreshBalance,
    openConnectModal,
  } = useWallet();

  const {
    status,
    recipient,
    setRecipient,
    amount,
    setAmount,
    gasEstimate,
    txHash,
    error,
    isReviewing,
    setIsReviewing,
    prepareTransaction,
    executeSend,
    reset,
  } = useTransaction();

  const [copiedHash, setCopiedHash] = React.useState(false);

  // Identify Privy embedded wallet
  const embeddedWallet = wallets.find((w) => w.walletClientType === 'privy') || wallets[0];

  const availableEthNum = ethBalance !== null ? parseFloat(ethBalance) : 0;
  const isAddressValid = recipient.trim().length > 0 && isAddress(recipient.trim());
  const numAmount = parseFloat(amount);
  const isAmountValid = !isNaN(numAmount) && numAmount > 0 && numAmount <= availableEthNum;

  // Handle Max button
  const handleMaxAmount = () => {
    const estimatedGasBuffer = 0.00005; // Buffer for native ETH gas fee
    const maxVal = Math.max(0, availableEthNum - estimatedGasBuffer);
    setAmount(maxVal.toFixed(6));
  };

  // Handle Copy Hash
  const handleCopyHash = () => {
    if (!txHash) return;
    navigator.clipboard?.writeText(txHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  // Handle Review Button Click
  const handleReviewClick = async () => {
    if (!account?.address) return;
    await prepareTransaction(account.address, BASE_SEPOLIA_CHAIN_ID);
  };

  // Handle Approve & Sign Button Click
  const handleApproveAndSign = async () => {
    if (!embeddedWallet) return;

    await executeSend(embeddedWallet, () => {
      refreshBalance();
    });
  };

  // Prevent closing modal while transaction is processing
  const isProcessing = ['preparing', 'awaiting_signature', 'broadcasting', 'pending'].includes(
    status
  );

  return (
    <div className="space-y-4">
      {/* Wallet Not Connected State */}
      {!isConnected || !account ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0095FF]/15 text-[#0095FF] flex items-center justify-center mx-auto">
            <Wallet className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-white">
              {language === 'id' ? 'Dompet Belum Terhubung' : 'Wallet Not Connected'}
            </h4>
            <p className="text-xs text-neutral-400 max-w-xs mx-auto">
              {language === 'id'
                ? 'Hubungkan dompet Privy Anda terlebih dahulu untuk mengirim aset di Base Sepolia.'
                : 'Connect your Privy wallet first to send assets on Base Sepolia.'}
            </p>
          </div>
          <button
            onClick={() => {
              onClose();
              openConnectModal();
            }}
            className="w-full py-3 rounded-xl bg-[#0095FF] hover:bg-[#0080E0] text-white font-semibold text-xs shadow-md shadow-[#0095FF]/20 transition-all cursor-pointer"
          >
            {language === 'id' ? 'Hubungkan Dompet Sekarang' : 'Connect Wallet Now'}
          </button>
        </div>
      ) : (
        <>
          {/* STATE 1: Input / Prepare Form */}
          {status === 'idle' && !isReviewing && (
            <div className="space-y-4">
              {/* Balance Card Banner */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-neutral-400 font-medium">
                    {language === 'id' ? 'Saldo On-Chain (Base Sepolia)' : 'Base Sepolia On-Chain Balance'}
                  </span>
                  <div className="text-sm font-bold text-white font-mono mt-0.5">
                    {isLoadingBalance ? (
                      <span className="text-neutral-400 animate-pulse">Syncing...</span>
                    ) : (
                      `${availableEthNum.toFixed(4)} ETH`
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={refreshBalance}
                  disabled={isLoadingBalance}
                  className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-neutral-300 transition-colors cursor-pointer"
                  title="Sync Balance"
                  aria-label="Refresh Balance"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${isLoadingBalance ? 'animate-spin text-[#0095FF]' : ''}`}
                  />
                </button>
              </div>

              {/* Recipient Address Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
                  <span>{language === 'id' ? 'Alamat Penerima' : 'Recipient Address'}</span>
                  {recipient && (
                    <span className="text-[10px] font-mono text-neutral-500">
                      EVM (0x...)
                    </span>
                  )}
                </label>

                <div className="relative">
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value.trim())}
                    placeholder="0x1234...5678"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A22] border text-xs font-mono text-white placeholder:text-neutral-500 focus:outline-none transition-all ${
                      recipient.length === 0
                        ? 'border-white/10 focus:border-[#0095FF]'
                        : isAddressValid
                        ? 'border-emerald-500/50 focus:border-emerald-500'
                        : 'border-rose-500/50 focus:border-rose-500'
                    }`}
                  />
                  {isAddressValid && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-3 top-3" />
                  )}
                </div>

                {recipient.length > 0 && !isAddressValid && (
                  <div className="text-[11px] text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>
                      {language === 'id'
                        ? 'Alamat EVM tidak valid. Harus diawali 0x dan berpanjang 42 karakter.'
                        : 'Invalid EVM address. Must start with 0x and be 42 hex chars.'}
                    </span>
                  </div>
                )}
              </div>

              {/* Amount Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-neutral-300">
                  <span>{language === 'id' ? 'Jumlah ETH' : 'Amount (ETH)'}</span>
                  <button
                    type="button"
                    onClick={handleMaxAmount}
                    className="text-[11px] text-[#0095FF] hover:underline font-mono font-bold cursor-pointer"
                  >
                    MAX
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    step="0.0001"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.001"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A22] border border-white/10 focus:border-[#0095FF] text-sm font-mono text-white placeholder:text-neutral-500 focus:outline-none transition-all pr-16"
                  />
                  <span className="absolute right-3 top-3 text-xs font-mono text-neutral-400 font-bold">
                    ETH
                  </span>
                </div>

                {numAmount > availableEthNum && (
                  <div className="text-[11px] text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>
                      {language === 'id'
                        ? 'Saldo ETH tidak mencukupi untuk jumlah ini.'
                        : 'Insufficient ETH balance for this amount.'}
                    </span>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Action Button */}
              <button
                type="button"
                disabled={!isAddressValid || !isAmountValid}
                onClick={handleReviewClick}
                className={`w-full py-3 rounded-xl font-semibold text-xs transition-all shadow-md ${
                  isAddressValid && isAmountValid
                    ? 'bg-[#0095FF] hover:bg-[#0080E0] text-white shadow-[#0095FF]/20 cursor-pointer'
                    : 'bg-white/10 text-neutral-500 cursor-not-allowed border border-white/5'
                }`}
              >
                {language === 'id' ? 'Tinjau Transaksi' : 'Review Transaction'}
              </button>
            </div>
          )}

          {/* STATE 2: Transaction Review / Preview */}
          {status === 'idle' && isReviewing && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs text-neutral-400 pb-1">
                <button
                  type="button"
                  onClick={() => setIsReviewing(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{language === 'id' ? 'Kembali' : 'Back'}</span>
                </button>
                <span>·</span>
                <span>{language === 'id' ? 'Konfirmasi Detail' : 'Confirm Details'}</span>
              </div>

              {/* Review Card */}
              <div className="p-4 rounded-2xl bg-[#1C1C24] border border-white/10 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                  <span className="text-neutral-400 font-sans">{language === 'id' ? 'Jumlah Dikirim' : 'Amount to Send'}</span>
                  <span className="text-base font-bold text-white">{amount} ETH</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 font-sans">{language === 'id' ? 'Penerima' : 'To'}</span>
                  <span className="text-neutral-200 truncate max-w-[200px]">{recipient}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 font-sans">{language === 'id' ? 'Jaringan' : 'Network'}</span>
                  <span className="text-emerald-400 font-medium">Base Sepolia (84532)</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 font-sans">{language === 'id' ? 'Estimasi Biaya Gas' : 'Estimated Gas Fee'}</span>
                  <span className="text-neutral-300">
                    ~{gasEstimate?.estimatedCostEth ? parseFloat(gasEstimate.estimatedCostEth).toFixed(6) : '0.000021'} ETH
                  </span>
                </div>

                <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between font-bold">
                  <span className="text-neutral-300 font-sans">{language === 'id' ? 'Total Potongan' : 'Total Required'}</span>
                  <span className="text-[#0095FF]">
                    ~{(
                      parseFloat(amount) +
                      parseFloat(gasEstimate?.estimatedCostEth || '0.000021')
                    ).toFixed(6)} ETH
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0095FF]/10 border border-[#0095FF]/20 text-[11px] text-[#00E5FF] space-y-1">
                <div className="font-semibold">{language === 'id' ? 'Penandatanganan On-Chain Privy' : 'Privy On-Chain Signer'}</div>
                <p className="text-neutral-300 leading-relaxed">
                  {language === 'id'
                    ? 'Transaksi ini akan ditandatangani langsung oleh dompet Privy tersemat Anda di jaringan Base Sepolia.'
                    : 'This transaction will be directly signed by your Privy embedded wallet on Base Sepolia.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsReviewing(false)}
                  className="py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white font-semibold text-xs border border-white/10 transition-all cursor-pointer"
                >
                  {language === 'id' ? 'Ubah Details' : 'Edit Inputs'}
                </button>

                <button
                  type="button"
                  onClick={handleApproveAndSign}
                  className="py-3 rounded-xl bg-[#0095FF] hover:bg-[#0080E0] text-white font-bold text-xs shadow-md shadow-[#0095FF]/20 transition-all cursor-pointer"
                >
                  {language === 'id' ? 'Setujui & Kirim' : 'Approve & Sign'}
                </button>
              </div>
            </div>
          )}

          {/* STATE 3: Processing (Preparing / Awaiting Signature / Broadcasting / Pending) */}
          {isProcessing && (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0095FF]/15 border border-[#0095FF]/30 text-[#0095FF] flex items-center justify-center mx-auto shadow-lg">
                <RefreshCw className="w-7 h-7 text-[#0095FF] animate-spin" />
              </div>

              <div className="space-y-1.5">
                <h4 className="text-base font-bold text-white">
                  {status === 'preparing' &&
                    (language === 'id' ? 'Menyiapkan Transaksi...' : 'Preparing Transaction...')}
                  {status === 'awaiting_signature' &&
                    (language === 'id' ? 'Menunggu Penandatanganan Privy...' : 'Approve in Privy Wallet...')}
                  {status === 'broadcasting' &&
                    (language === 'id' ? 'Menerbitkan ke Base Sepolia...' : 'Broadcasting to Base Sepolia...')}
                  {status === 'pending' &&
                    (language === 'id' ? 'Transaksi Dikirim!' : 'Transaction Submitted!')}
                </h4>

                <p className="text-xs text-neutral-300 max-w-xs mx-auto leading-relaxed font-mono">
                  {status === 'preparing' && 'Reading Base Sepolia RPC state...'}
                  {status === 'awaiting_signature' && 'Awaiting user signature in embedded MPC enclave...'}
                  {status === 'broadcasting' && 'Submitting raw transaction to Base Sepolia node...'}
                  {status === 'pending' && 'Waiting for block confirmation on Base Sepolia blockchain...'}
                </p>
              </div>

              {txHash && (
                <div className="p-3.5 rounded-xl bg-[#1C1C23] border border-white/10 space-y-2 text-left text-xs font-mono">
                  <div className="text-neutral-400 font-sans">{language === 'id' ? 'Hash Transaksi On-Chain' : 'Transaction Hash'}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-white truncate max-w-[220px]">{txHash}</span>
                    <button
                      type="button"
                      onClick={handleCopyHash}
                      className="text-neutral-400 hover:text-white p-1"
                    >
                      {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <a
                    href={`https://sepolia.basescan.org/tx/${txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-[#0095FF] hover:underline inline-flex items-center gap-1 pt-1"
                  >
                    <span>View on BaseScan Sepolia</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* STATE 4: Confirmed (Success) */}
          {status === 'confirmed' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white">
                  {language === 'id' ? 'Transaksi Dikonfirmasi ✓' : 'Transaction Confirmed ✓'}
                </h4>
                <p className="text-xs text-emerald-400 font-mono">
                  {language === 'id' ? 'Terverifikasi di Blockchain Base Sepolia' : 'Confirmed on Base Sepolia Block'}
                </p>
              </div>

              {/* Receipt Summary */}
              <div className="p-4 rounded-2xl bg-[#1C1C23] border border-white/10 space-y-2 text-left text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-neutral-400 font-sans">Amount</span>
                  <span className="font-bold text-white">{amount} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400 font-sans">To</span>
                  <span className="text-neutral-200 truncate max-w-[180px]">{recipient}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400 font-sans">Network</span>
                  <span className="text-emerald-400">Base Sepolia</span>
                </div>
                {txHash && (
                  <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
                    <span className="text-neutral-400 font-sans">Tx Hash</span>
                    <span className="text-neutral-300 truncate max-w-[160px]">{txHash}</span>
                  </div>
                )}
              </div>

              {/* Explorer Button & Close Button */}
              <div className="space-y-2 pt-2">
                {txHash && (
                  <a
                    href={`https://sepolia.basescan.org/tx/${txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 rounded-xl bg-[#0095FF] hover:bg-[#0080E0] text-white font-semibold text-xs inline-flex items-center justify-center gap-2 shadow-md shadow-[#0095FF]/20 transition-all cursor-pointer"
                  >
                    <span>{language === 'id' ? 'Lihat di BaseScan Sepolia' : 'View on BaseScan Explorer'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => {
                    reset();
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white font-medium text-xs transition-all cursor-pointer"
                >
                  {language === 'id' ? 'Selesai' : 'Done'}
                </button>
              </div>
            </div>
          )}

          {/* STATE 5: Failed / Error */}
          {status === 'failed' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/10">
                <AlertCircle className="w-8 h-8 text-rose-400" />
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">
                  {language === 'id' ? 'Transaksi Gagal / Ditolak' : 'Transaction Failed / Rejected'}
                </h4>
                <p className="text-xs text-rose-400 max-w-xs mx-auto leading-relaxed">
                  {error || 'An error occurred during transaction execution.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={reset}
                  className="py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white font-semibold text-xs border border-white/10 transition-all cursor-pointer"
                >
                  {language === 'id' ? 'Coba Lagi' : 'Try Again'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    reset();
                    onClose();
                  }}
                  className="py-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-semibold text-xs border border-rose-500/30 transition-all cursor-pointer"
                >
                  {language === 'id' ? 'Tutup' : 'Close'}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
