import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { CURATED_COLLECTIONS } from '../../../data/destinations';
import { useTrip } from '../../../hooks/useTrip';
import type { MoodTag } from '../../../types';

export const CollectionsSection: React.FC = () => {
  const { setFilters } = useTrip();

  const handleSelectCollection = (mood: MoodTag) => {
    setFilters(prev => ({
      ...prev,
      selectedMoods: [mood],
      viewMode: 'grid',
    }));
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Curated Collections</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">Handpicked Weekend Themes</h2>
        </div>
        <p className="text-xs text-gray-400 max-w-md">
          Explore curated story collections designed for specific travel states of mind.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CURATED_COLLECTIONS.map(item => (
          <div
            key={item.id}
            onClick={() => handleSelectCollection(item.mood)}
            className="group relative h-80 rounded-3xl overflow-hidden glass-panel border border-white/10 cursor-pointer shadow-xl flex flex-col justify-end p-6"
          >
            <img
              src={item.image}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />

            <div className="relative z-10 space-y-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-gray-950 font-bold text-[10px] uppercase tracking-wider inline-block">
                {item.count} Escapes
              </span>
              <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-gray-300 line-clamp-2">{item.subtitle}</p>

              <div className="pt-2 flex items-center space-x-1.5 text-xs font-bold text-emerald-400">
                <span>Browse Theme</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
