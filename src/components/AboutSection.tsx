import React from 'react';
import { Compass, Clock, Sliders, CheckCircle2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          <span>How EscapeOdyssey Works</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Short-trip planning, <span className="gradient-emerald-indigo">reimagined</span> for clarity
        </h2>
        <p className="text-sm text-gray-300">
          No endless tabs or booking chaos. Just curated 48-hour escapes matched to your exact departure hub, radius, and current vibe.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Step 1 */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-extrabold text-lg border border-emerald-500/30">
            01
          </div>
          <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">Set Hub & Radius</h3>
          <p className="text-xs text-gray-300 leading-relaxed font-normal">
            Choose your departure hub across 10 global cities and slide your max travel radius (1 to 6 hours drive or flight).
          </p>
          <div className="pt-2 flex items-center space-x-2 text-[11px] text-emerald-400 font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Zero Wasted Commute Time</span>
          </div>
        </div>

        {/* Step 2 */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4 relative overflow-hidden group hover:border-indigo-500/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-extrabold text-lg border border-indigo-500/30">
            02
          </div>
          <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">Vibe & Mood Match</h3>
          <p className="text-xs text-gray-300 leading-relaxed font-normal">
            Select what your soul needs right now — Alpine Air, Coastal Drift, Michelin Dining, Digital Detox, or Dark Sky Stargazing.
          </p>
          <div className="pt-2 flex items-center space-x-2 text-[11px] text-indigo-400 font-semibold">
            <Sliders className="w-3.5 h-3.5" />
            <span>99% Match Score Engine</span>
          </div>
        </div>

        {/* Step 3 */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4 relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-extrabold text-lg border border-amber-500/30">
            03
          </div>
          <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">Tailor & Escape</h3>
          <p className="text-xs text-gray-300 leading-relaxed font-normal">
            Scrub through the 48-hour timeline, customize activities, adjust budget tiers, and export your instant Pass ticket.
          </p>
          <div className="pt-2 flex items-center space-x-2 text-[11px] text-amber-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Instant Printable Pass</span>
          </div>
        </div>

      </div>
    </section>
  );
};
