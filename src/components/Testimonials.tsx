import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { Testimonial } from '../types';
import { useLanguage } from '../context/LanguageContext';

export const Testimonials: React.FC = () => {
  const { language } = useLanguage();

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Elena Rostova',
      handle: '@erostova_defi',
      role: language === 'id' ? 'Kepala Produk' : 'Head of Product',
      company: 'Aether Capital',
      avatar: 'ER',
      quote:
        language === 'id'
          ? 'Hybit adalah dompet pertama yang dipahami orang tua saya hanya dalam 5 menit. Mengirim USDC terasa seringan mengirim pesan instan, namun dengan kepemilikan mandiri penuh di baliknya.'
          : 'Hybit is the first wallet my non-crypto parents understood in five minutes. Sending USDC feels as effortless as sending a quick text, while keeping complete self-custody behind the scenes.',
      metric:
        language === 'id'
          ? 'Lebih dari $2.4M aset diamankan di brankas keluarga'
          : 'Over $2.4M assets secured across family vaults',
    },
    {
      id: '2',
      name: 'Marcus Vance',
      handle: '@vance_eth',
      role: language === 'id' ? 'Insinyur Pendiri' : 'Founding Engineer',
      company: 'OmniProtocol',
      avatar: 'MV',
      quote:
        language === 'id'
          ? 'Perutean jembatan LayerZero di Hybit luar biasa cepat. Dulu saya menghabiskan 15 menit berpindah-pindah antar 3 situs bridge. Di Hybit, semuanya dilakukan hanya dalam satu ketukan tanpa pusing memikirkan token gas.'
          : 'The LayerZero bridge routing in Hybit is absurdly fast. I used to spend 15 minutes bouncing between three different bridge frontends. In Hybit, it is literally one tap with zero manual gas token juggling.',
      metric:
        language === 'id'
          ? 'Waktu eksekusi lintas rantai 85% lebih cepat'
          : '85% faster cross-chain execution time',
    },
    {
      id: '3',
      name: 'Dr. Kimberly Chen',
      handle: '@kimchen_tech',
      role: language === 'id' ? 'Peneliti Kriptografi' : 'Cryptography Researcher',
      company: 'Distributed Labs',
      avatar: 'KC',
      quote:
        language === 'id'
          ? 'Implementasi ambang batas MPC 2-dari-3 yang dipadukan dengan modul Secure Enclave adalah standar emas perlindungan pengguna. Akhirnya ada dompet yang menghadirkan keamanan matematis tanpa mengorbankan kenyamanan pemakaian.'
          : 'Their 2-of-3 MPC threshold implementation paired with Secure Enclave hardware is the gold standard for consumer self-custody. Finally, a wallet that provides mathematical safety without UX sacrifices.',
      metric:
        language === 'id'
          ? 'Diaudit & diverifikasi secara independen'
          : 'Independently audited & verified',
    },
  ];

  return (
    <section className="py-24 sm:py-32 relative bg-[#0C0C0F]/40 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="text-xs font-mono uppercase tracking-widest text-[#0095FF] font-semibold mb-3">
            {language === 'id' ? 'Ulasan Komunitas & Industri' : 'Community & Industry Feedback'}
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            {language === 'id'
              ? 'Disukai Pemula. Dipercaya Para Ahli.'
              : 'Loved by Beginners. Trusted by Pioneers.'}
          </h2>

          <p className="mt-4 text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            {language === 'id' ? (
              <>
                Lihat alasan lebih dari 450.000 pengguna mempercayai{' '}
                <span className="font-chinese text-white">Hybit</span> untuk pembayaran harian,
                swap lintas rantai, dan perlindungan aset digital bernilai tinggi.
              </>
            ) : (
              <>
                See why over 450,000 users trust{' '}
                <span className="font-chinese text-white">Hybit</span> for everyday payments,
                cross-chain swaps, and high-value custody.
              </>
            )}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-7 rounded-3xl bg-[#141418] border border-white/[0.08] hover:border-white/[0.16] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header: User avatar + name */}
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-11 h-11 rounded-full bg-[#0095FF] p-0.5 flex items-center justify-center font-bold text-xs text-white">
                    <div className="w-full h-full rounded-full bg-[#18181B] flex items-center justify-center">
                      {t.avatar}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      {t.name}
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0095FF]" />
                    </h3>
                    <p className="text-xs text-neutral-400">
                      {t.role} · <span className="text-neutral-300">{t.company}</span>
                    </p>
                  </div>
                </div>

                {/* Quote */}
                <p className="text-sm text-neutral-300 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              {/* Metric Callout */}
              {t.metric && (
                <div className="pt-5 mt-6 border-t border-white/[0.06] text-xs font-mono text-[#00E5FF] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
                  <span>{t.metric}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
