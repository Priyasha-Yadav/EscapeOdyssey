import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '../../../data/destinations';

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggleFaq = (id: string) => {
    setOpenId(prev => prev === id ? null : id);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
      <div className="text-center space-y-2 mb-10">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>Got Questions?</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
      </div>

      <div className="space-y-3">
        {FAQ_ITEMS.map(faq => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              onClick={() => toggleFaq(faq.id)}
              className="glass-panel rounded-2xl border border-white/10 overflow-hidden cursor-pointer transition-all"
            >
              <div className="p-4 sm:p-5 flex items-center justify-between">
                <h3 className="font-bold text-white text-sm sm:text-base flex items-center space-x-2">
                  <span className="text-emerald-400 text-xs font-mono">[{faq.category}]</span>
                  <span>{faq.question}</span>
                </h3>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180 text-emerald-400' : ''}`} />
              </div>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 border-t border-white/5 text-xs text-gray-300 leading-relaxed animate-in fade-in duration-200">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
