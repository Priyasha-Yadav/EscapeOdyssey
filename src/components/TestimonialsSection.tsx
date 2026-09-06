import React from 'react';
import { Star, Quote, MessageSquare } from 'lucide-react';
import { TESTIMONIALS } from '../data/destinations';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
      <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
          <span>Traveler Stories</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white">Loved by Busy Professionals</h2>
        <p className="text-xs text-gray-400">See how travelers saved hours of planning and reclaimed their weekends.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map(t => (
          <div key={t.id} className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 relative flex flex-col justify-between">
            <Quote className="w-8 h-8 text-indigo-500/30 absolute top-6 right-6" />

            <div className="space-y-3 relative z-10">
              <div className="flex items-center space-x-1 text-amber-400">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>

              <p className="text-xs text-gray-200 leading-relaxed italic">"{t.quote}"</p>
              
              <div className="pt-2">
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                  📍 {t.destinationTitle}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center space-x-3">
              <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/40" />
              <div>
                <h4 className="font-bold text-white text-xs">{t.name}</h4>
                <p className="text-[11px] text-gray-400">{t.role} • {t.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
