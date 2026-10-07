import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  Lock,
  Smartphone,
  Mail,
  ArrowUpRight,
  Wallet,
  LogOut,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useWallet } from '../../context/WalletContext';
import { useTokenBalances } from '../../hooks/token/useTokenBalances';

interface ConnectedDApp {
  id: string;
  name: string;
  url: string;
  chain: string;
  icon: string;
}

export const WalletView: React.FC = () => {
  const { showToast } = useToast();
  const { language } = useLanguage();
  const { formatCurrency } = useCurrency();
  const { account, isConnected, openConnectModal, disconnect, ethBalance, isLoadingBalance, refreshBalance } = useWallet();
  const { tokenBalances } = useTokenBalances();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Connected dApps start empty - no hardcoded mock platforms
  const [connectedDApps, setConnectedDApps] = useState<ConnectedDApp[]>([]);

  const handleCopy = (address: string, id: string) => {
    navigator.clipboard?.writeText(address);
    setCopiedId(id);
    showToast(
      language === 'id' ? 'Alamat Dompet Disalin' : 'Wallet Address Copied',
      address,
      'copy'
    );
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRevoke = (id: string, name: string) => {
    setConnectedDApps((prev) => prev.filter((d) => d.id !== id));
    showToast(
      language === 'id' ? 'Sesi Dicabut' : 'Session Revoked',
      language === 'id'
        ? `Memutuskan sambungan dan mencabut izin dApp untuk ${name}`
        : `Disconnected and revoked permissions for ${name}`,
      'warning'
    );
  };

  return (
    <div className="space-y-8 pb-28">
      
      {/* Header (Unboxed) */}
      <div className="pb-4 border-b border-white/[0.08]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {language === 'id' ? 'Dompet MPC Tersemat Anda' : 'Your Embedded Wallet'}
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0095FF]/15 text-[#0095FF] border border-[#0095FF]/20">
                Privy Auth
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              {language === 'id'
                ? 'Satu dompet kepemilikan mandiri diamankan melalui otentikasi tersemat Privy MPC. 1 Email · 1 Dompet.'
                : 'Single self-custody wallet secured via Privy MPC embedded authentication. 1 Email · 1 Wallet.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isConnected && account ? (
              <>
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{language === 'id' ? 'Sesi Privy Aktif' : 'Privy Session Active'}</span>
                </div>
                <button
                  onClick={disconnect}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-rose-500/20 text-neutral-300 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 text-xs transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{language === 'id' ? 'Keluar' : 'Disconnect'}</span>
                </button>
              </>
            ) : (
              <button
                onClick={openConnectModal}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0095FF] hover:bg-[#0080E0] text-white text-xs font-semibold shadow-md shadow-[#0095FF]/25 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>{language === 'id' ? 'Hubungkan Dompet' : 'Connect Wallet'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Disconnected State Card */}
      {!isConnected || !account ? (
        <div className="rounded-3xl bg-[#141419] border border-white/[0.08] p-8 sm:p-12 text-center shadow-2xl shadow-black/30 space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-[#0095FF]/15 border border-[#0095FF]/30 text-[#0095FF] flex items-center justify-center mx-auto shadow-lg shadow-[#0095FF]/10">
            <Wallet className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {language === 'id' ? 'Dompet Belum Terhubung' : 'No Wallet Connected'}
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {language === 'id'
                ? 'Hubungkan dompet Privy tersemat Anda dengan email atau passkey biometrik untuk mengakses detail kunci MPC, alamat on-chain, dan status keamanan.'
                : 'Connect your embedded Privy wallet using your email or biometric passkey to view your MPC key shares, on-chain address, and security health.'}
            </p>
          </div>
          <button
            onClick={openConnectModal}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0095FF] hover:bg-[#0080E0] text-white font-semibold text-xs sm:text-sm shadow-xl shadow-[#0095FF]/25 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Wallet className="w-4 h-4" />
            <span>{language === 'id' ? 'Hubungkan Dompet Sekarang' : 'Connect Wallet Now'}</span>
          </button>
        </div>
      ) : (
        /* Connected Real Wallet Session Card */
        <div className="rounded-3xl bg-[#141419] border border-white/[0.08] p-6 sm:p-8 shadow-2xl shadow-black/30 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#0095FF] text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-[#0095FF]/25">
                H
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{account.name}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                    {language === 'id' ? 'Aktif & Terverifikasi' : 'Active & Verified'}
                  </span>
                </div>
                <div className="text-xs text-neutral-400 flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-[#0095FF]" />
                  <span className="font-mono text-neutral-300">
                    {account.email || (language === 'id' ? 'Email belum tertaut' : 'No email linked')}
                  </span>
                  <span className="text-neutral-500">·</span>
                  <span className="text-neutral-400">
                    {language === 'id' ? '1 Email : 1 Dompet MPC' : '1 Email : 1 MPC Wallet'}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-xs text-neutral-400 font-medium flex items-center justify-start sm:justify-end gap-1.5">
                <span>{language === 'id' ? 'Saldo On-Chain (Base Sepolia)' : 'On-Chain Balance (Base Sepolia)'}</span>
                <button
                  onClick={refreshBalance}
                  disabled={isLoadingBalance}
                  className="p-1 rounded-md hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  title={language === 'id' ? 'Sinkronkan Saldo' : 'Sync Balance'}
                  aria-label="Refresh on-chain balance"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoadingBalance ? 'animate-spin text-[#0095FF]' : ''}`} />
                </button>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white font-mono mt-0.5">
                {isLoadingBalance ? (
                  <span className="text-neutral-400 animate-pulse text-lg">Memuat on-chain...</span>
                ) : ethBalance !== null ? (
                  `${parseFloat(ethBalance).toFixed(4)} ETH`
                ) : (
                  '0.0000 ETH'
                )}
              </div>
            </div>
          </div>

          {/* Address & Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] font-mono text-neutral-500 uppercase block">
                  {language === 'id' ? 'Alamat Publik Dompet (EVM & Multi-Chain)' : 'Wallet Public Address (EVM & Multi-Chain)'}
                </span>
                <span className="font-mono text-xs sm:text-sm text-white font-medium truncate block">
                  {account.address}
                </span>
              </div>
              <button
                onClick={() => handleCopy(account.address, account.id)}
                className="px-3 py-2 rounded-xl bg-[#0095FF] hover:bg-[#0080E0] text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-md shadow-[#0095FF]/20"
              >
                {copiedId === account.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === account.id ? (language === 'id' ? 'Tersalin' : 'Copied') : (language === 'id' ? 'Salin' : 'Copy')}</span>
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase block">
                  {language === 'id' ? 'Jaringan Aktif' : 'Active Network'}
                </span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 mt-1 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Base Sepolia (84532)
                </span>
              </div>
              <a
                href={`https://sepolia.basescan.org/address/${account.address}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-neutral-300 transition-colors"
                title={language === 'id' ? 'Lihat di Explorer' : 'View on Explorer'}
              >
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Detected On-Chain Tokens (ERC-20) */}
          <div className="pt-4 border-t border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-300">
              <span>{language === 'id' ? 'Aset On-Chain Terdeteksi' : 'Detected On-Chain Assets'}</span>
              <span className="text-[11px] font-mono text-neutral-500">Base Sepolia (84532)</span>
            </div>

            <div className="space-y-2">
              {/* Native ETH */}
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#0095FF]/20 text-[#0095FF] flex items-center justify-center font-bold text-xs">
                    ETH
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Ethereum</div>
                    <div className="text-[10px] font-mono text-neutral-400">Native Token</div>
                  </div>
                </div>
                <div className="text-right font-mono text-xs font-bold text-white">
                  {ethBalance !== null ? `${parseFloat(ethBalance).toFixed(6)} ETH` : '0.000000 ETH'}
                </div>
              </div>

              {/* Real ERC-20 Tokens */}
              {tokenBalances.map((tb) => (
                <div key={tb.token.id} className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#0095FF]/20 text-[#0095FF] flex items-center justify-center font-bold text-xs">
                      {tb.token.symbol}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{tb.token.name}</div>
                      <a
                        href={`https://sepolia.basescan.org/token/${tb.token.address}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-mono text-neutral-400 hover:text-[#00E5FF] truncate max-w-[160px] block"
                        title={`View contract ${tb.token.address} on BaseScan`}
                      >
                        ERC-20 · {tb.token.address.slice(0, 6)}...{tb.token.address.slice(-4)}
                      </a>
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs font-bold text-white">
                    {tb.formattedBalance} {tb.token.symbol}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MPC Shards & Security Status */}
      <div className="rounded-3xl bg-[#141419] border border-white/[0.08] p-6 sm:p-8 shadow-xl shadow-black/30">
        <div className="flex items-center gap-2.5 mb-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white">
            {language === 'id' ? 'Kesehatan Kriptografi Privy MPC' : 'Privy MPC Cryptography Health'}
          </h3>
        </div>

        <p className="text-xs text-neutral-400 mb-6 max-w-xl">
          {language === 'id'
            ? 'Kunci dompet Anda dipecah menjadi 3 pecahan independen matematis. 2 dari 3 pecahan mengotorisasi transaksi dengan aman tanpa perlu frasa pemulihan.'
            : 'Your wallet key is split into 3 independent mathematical shares. Any 2 shares authorize transactions seamlessly without seed phrases.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: language === 'id' ? 'Enclave Perangkat Lokal' : 'Local Device Enclave',
              desc: language === 'id' ? 'Passkey / Biometrik di perangkat' : 'Passkey / Biometrics on device',
              status: isConnected ? (language === 'id' ? 'Aktif & Terverifikasi' : 'Active & Verified') : (language === 'id' ? 'Menunggu Sambungan' : 'Awaiting Connection'),
              icon: Smartphone,
              color: isConnected ? 'text-emerald-400' : 'text-neutral-500',
            },
            {
              title: language === 'id' ? 'Enclave Cloud Privy' : 'Privy Cloud Enclave',
              desc: isConnected && account?.email
                ? (language === 'id' ? 'Diautentikasi oleh ' : 'Authenticated by ') + account.email
                : (language === 'id' ? 'Otentikasi terenkripsi zero-knowledge' : 'Zero-knowledge encrypted auth'),
              status: isConnected ? (language === 'id' ? 'Tersinkron & Terenkripsi' : 'Synced & Encrypted') : (language === 'id' ? 'Standby' : 'Standby'),
              icon: Lock,
              color: isConnected ? 'text-[#0095FF]' : 'text-neutral-500',
            },
            {
              title: language === 'id' ? 'Pecahan Pemulihan Wali (Guardian)' : 'Guardian Recovery Share',
              desc: language === 'id' ? 'Kunci Cloud Terenkripsi Ujung-ke-Ujung' : 'End-to-End Encrypted Cloud Key',
              status: isConnected ? (language === 'id' ? 'Siap untuk Pemulihan' : 'Ready for Recovery') : (language === 'id' ? 'Standby' : 'Standby'),
              icon: ShieldCheck,
              color: isConnected ? 'text-indigo-400' : 'text-neutral-500',
            },
          ].map((shard, i) => {
            const Icon = shard.icon;
            return (
              <div
                key={i}
                className="p-4 rounded-2xl bg-[#101015] border border-white/[0.06] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Icon className={`w-5 h-5 ${shard.color}`} />
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {shard.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{shard.title}</h4>
                  <p className="text-xs text-neutral-400">{shard.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Connected DApps & Session Keys (No mock data, empty state when none connected) */}
      <div className="rounded-3xl bg-[#141419] border border-white/[0.08] p-6 sm:p-8 shadow-xl shadow-black/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-white">
              {language === 'id' ? 'DApps Terhubung & Kunci Sesi' : 'Connected DApps & Authorized Sessions'}
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              {language === 'id'
                ? 'Kunci sesi Privy diotorisasi untuk berinteraksi dengan protokol Web3. Cabut akses secara instan kapan saja.'
                : 'Privy session keys authorized to interact with Web3 protocols. Revoke access instantly.'}
            </p>
          </div>
          <span className="text-xs font-mono text-neutral-400 self-start sm:self-auto">
            {connectedDApps.length} {language === 'id' ? 'Sesi Aktif' : 'Active Sessions'}
          </span>
        </div>

        {connectedDApps.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#101015] border border-white/[0.06] text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] text-neutral-400 flex items-center justify-center mx-auto">
              <ExternalLink className="w-5 h-5 text-neutral-400" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-white">
                {language === 'id' ? 'Belum Ada Sesi dApp yang Terhubung' : 'No Connected dApp Sessions'}
              </h4>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                {language === 'id'
                  ? 'Saat Anda menghubungkan dompet Hybit ke aplikasi terdesentralisasi, sesi aktif akan ditampilkan di sini.'
                  : 'When you connect your Hybit wallet to decentralized applications, active sessions will appear here.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {connectedDApps.map((dapp) => (
              <div
                key={dapp.id}
                className="p-4 rounded-2xl bg-[#101015] border border-white/[0.06] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{dapp.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{dapp.name}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.05] text-neutral-400">
                        {dapp.chain}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 font-mono mt-0.5">{dapp.url}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://${dapp.url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-neutral-300 transition-colors"
                    title={language === 'id' ? 'Buka Aplikasi' : 'Visit App'}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleRevoke(dapp.id, dapp.name)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                    title={language === 'id' ? 'Cabut Izin Sesi' : 'Revoke Session'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
