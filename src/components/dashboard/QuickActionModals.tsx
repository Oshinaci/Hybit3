import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Send,
  Download,
  Repeat,
  CreditCard,
  Layers,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

import { SendModalView } from './SendModalView';
import { ReceiveModalView } from './ReceiveModalView';

interface QuickActionModalProps {
  type: 'send' | 'receive' | 'swap' | 'buy' | 'bridge' | null;
  onClose: () => void;
}

export const QuickActionModals: React.FC<QuickActionModalProps> = ({
  type,
  onClose,
}) => {
  const { language } = useLanguage();

  if (!type) return null;

  const getModalMeta = () => {
    switch (type) {
      case 'send':
        return {
          title: language === 'id' ? 'Kirim Native ETH' : 'Send Native ETH',
          subtitle: language === 'id' ? 'Pengiriman On-Chain Base Sepolia (84532)' : 'Base Sepolia (84532) On-Chain Transfer',
          icon: Send,
          desc: '',
        };
      case 'receive':
        return {
          title: language === 'id' ? 'Terima Aset Kripto' : 'Receive Digital Assets',
          subtitle: language === 'id' ? 'Alamat deposit on-chain Base Sepolia' : 'Base Sepolia on-chain deposit address',
          icon: Download,
          desc: '',
        };
      case 'swap':
        return {
          title: language === 'id' ? 'Tukar Token (Segera Hadir)' : 'Instant Swap (Coming Soon)',
          subtitle: language === 'id' ? 'Likuiditas teragregasi lintas DEX' : 'Aggregated cross-DEX liquidity',
          icon: Repeat,
          desc: language === 'id'
            ? 'Mesin swap DEX multi-rantai sedang dalam integrasi. Swap nyata dengan smart contract router akan aktif pada pembaruan berikutnya.'
            : 'The multi-chain DEX swap engine is currently under active integration. Real smart contract routing will be enabled in the upcoming release.',
        };
      case 'buy':
        return {
          title: language === 'id' ? 'Beli Kripto (Segera Hadir)' : 'Buy Crypto (Coming Soon)',
          subtitle: language === 'id' ? 'Gerbang pembayaran fiat resmi' : 'Regulated fiat onramp gateway',
          icon: CreditCard,
          desc: language === 'id'
            ? 'Layanan pembelian aset kripto dengan mata uang fiat (Transfer Bank & QRIS) sedang dalam proses perizinan dan integrasi gateway resmi.'
            : 'Direct fiat onramp services are undergoing regulatory compliance and gateway provider integration.',
        };
      case 'bridge':
        return {
          title: language === 'id' ? 'Jembatan Aset (Segera Hadir)' : 'Asset Bridge (Coming Soon)',
          subtitle: language === 'id' ? 'Protokol interoperabilitas lintas rantai' : 'Cross-chain interoperability protocol',
          icon: Layers,
          desc: language === 'id'
            ? 'Protokol jembatan lintas rantai aman (LayerZero / Chainlink CCIP) sedang dikonfigurasi untuk menghubungkan Base Sepolia dengan jaringan EVM lainnya.'
            : 'Cross-chain messaging protocols (LayerZero / Chainlink CCIP) are being configured to connect Base Sepolia with other EVM networks.',
        };
      default:
        return {
          title: '',
          subtitle: '',
          icon: Send,
          desc: '',
        };
    }
  };

  const meta = getModalMeta();
  const ModalIcon = meta.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md rounded-3xl bg-[#141419] border border-white/15 p-6 shadow-2xl shadow-black text-white z-10 max-h-[92vh] flex flex-col space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#0095FF] text-white flex items-center justify-center shadow-md shadow-[#0095FF]/20">
                <ModalIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {meta.title}
                </h3>
                <span className="text-[11px] text-neutral-400">
                  {meta.subtitle}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-neutral-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="overflow-y-auto flex-1 py-2">
            {type === 'send' ? (
              <SendModalView onClose={onClose} />
            ) : type === 'receive' ? (
              <ReceiveModalView onClose={onClose} />
            ) : (
              /* Coming Soon / Under Development State */
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0095FF]/15 border border-[#0095FF]/25 text-[#0095FF] flex items-center justify-center mx-auto shadow-lg shadow-[#0095FF]/10">
                  <ModalIcon className="w-7 h-7 text-[#0095FF]" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-base font-bold text-white">
                    {language === 'id' ? 'Fitur Dalam Tahap Pengembangan' : 'Feature Under Active Development'}
                  </h4>
                  <p className="text-xs text-neutral-300 max-w-sm mx-auto leading-relaxed">
                    {meta.desc}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-left text-xs text-neutral-400 space-y-1.5">
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#0095FF]" />
                    <span>{language === 'id' ? 'Prinsip Keandalan Hybit' : 'Hybit Reality Principle'}</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-normal">
                    {language === 'id'
                      ? 'Hybit tidak menampilkan transaksi simulasi atau status konfirmasi palsu. Seluruh eksekusi akan terhubung langsung ke RPC Base Sepolia saat siap.'
                      : 'Hybit does not fabricate simulated transactions or false receipts. All execution will directly link to Base Sepolia RPC when ready.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white font-semibold text-xs border border-white/10 transition-all cursor-pointer"
                >
                  {language === 'id' ? 'Mengerti' : 'Understood'}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
