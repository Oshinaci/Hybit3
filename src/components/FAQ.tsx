import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { FAQItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

export const FAQ: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const { t, language } = useLanguage();

  const faqs: FAQItem[] = [
    {
      id: 'faq-1',
      question: t('faq_q1'),
      answer: t('faq_a1'),
      category: 'general',
    },
    {
      id: 'faq-2',
      question: t('faq_q2'),
      answer: t('faq_a2'),
      category: 'security',
    },
    {
      id: 'faq-3',
      question: t('faq_q3'),
      answer: t('faq_a3'),
      category: 'security',
    },
    {
      id: 'faq-4',
      question: t('faq_q4'),
      answer: t('faq_a4'),
      category: 'fees',
    },
  ];

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 sm:py-32 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-xs font-mono uppercase tracking-widest text-[#0095FF] font-semibold mb-3">
            {t('faq_badge')}
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            {t('faq_title')}
          </h2>

          <p className="mt-4 text-base text-neutral-400 max-w-xl mx-auto leading-relaxed">
            {t('faq_subtitle')}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-2xl bg-[#141418] border border-white/[0.08] hover:border-white/[0.14] transition-all overflow-hidden"
              >
                <button
                  onClick={() => toggle(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full px-6 py-5 flex items-center justify-between text-left text-white font-semibold text-base sm:text-lg cursor-pointer focus:outline-none"
                >
                  <span className="pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-neutral-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#0095FF]' : ''
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-neutral-400 leading-relaxed border-t border-white/[0.04]">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
