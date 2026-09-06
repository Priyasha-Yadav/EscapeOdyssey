import React from 'react';
import { X, Sparkles, Star, Clock, Sun, ArrowRight, Layers } from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { DESTINATIONS } from '../data/destinations';

export const CompareModal: React.FC = () => {
  const { compareOpen, setCompareOpen, savedIds, filters, formatCurrency, getComputedCost, setActiveDestination } = useTrip();

  if (!compareOpen) return null;

  const compareDestinations = DESTINATIONS.filter(d => savedIds.includes(d.id)).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl glass-modal rounded-3xl p-6 border border-white/15 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Side-by-Side Trip Comparison</h3>
              <p className="text-xs text-gray-400">Comparing {compareDestinations.length} saved getaways from <strong className="text-emerald-300">{filters.departureHub}</strong></p>
            </div>
          </div>

          <button
            onClick={() => setCompareOpen(false)}
            className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {compareDestinations.length < 2 ? (
          <div className="text-center py-12 space-y-3">
            <Sparkles className="w-10 h-10 text-amber-400 mx-auto" />
            <h4 className="text-base font-bold text-white">Save at least 2 getaways to compare</h4>
            <p className="text-xs text-gray-400 max-w-md mx-auto">Click the bookmark icon on cards in the gallery or swipe deck to add them to your comparison matrix.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="grid grid-cols-4 gap-4 min-w-[700px]">
              
              {/* Row 1: Labels Column */}
              <div className="space-y-6 pt-24 font-semibold text-xs text-gray-400">
                <div className="py-2 border-b border-white/5">Match Score</div>
                <div className="py-2 border-b border-white/5">Travel Time ({filters.departureHub})</div>
                <div className="py-2 border-b border-white/5">Weather Forecast</div>
                <div className="py-2 border-b border-white/5">Estimated Budget</div>
                <div className="py-2 border-b border-white/5">Accommodation</div>
                <div className="py-2 border-b border-white/5">Rating</div>
                <div className="py-2 border-b border-white/5">Highlights</div>
                <div className="py-2">Action</div>
              </div>

              {/* Destination Columns */}
              {compareDestinations.map(dest => {
                const hubTravel = dest.hubDistance[filters.departureHub] || Object.values(dest.hubDistance)[0];
                const cost = getComputedCost(dest);

                return (
                  <div key={dest.id} className="glass-panel p-4 rounded-2xl border border-white/10 space-y-6 flex flex-col justify-between">
                    
                    {/* Header Image */}
                    <div className="space-y-2">
                      <div className="relative h-28 rounded-xl overflow-hidden">
                        <img src={dest.heroImage} alt={dest.title} className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-500 text-gray-950 font-bold text-[10px]">
                          {dest.matchScore}% Match
                        </div>
                      </div>
                      <h4 className="font-extrabold text-white text-sm line-clamp-1">{dest.title}</h4>
                      <p className="text-[11px] text-emerald-400 line-clamp-1">{dest.tagline}</p>
                    </div>

                    {/* Compare Fields */}
                    <div className="space-y-6 text-xs text-gray-200">
                      
                      {/* Match Score */}
                      <div className="py-2 border-b border-white/5 font-bold text-emerald-400">
                        {dest.matchScore}% Compatibility
                      </div>

                      {/* Travel Time */}
                      <div className="py-2 border-b border-white/5 flex items-center space-x-1.5 text-gray-300">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{hubTravel?.formatted}</span>
                      </div>

                      {/* Weather */}
                      <div className="py-2 border-b border-white/5 flex items-center space-x-1.5 text-gray-300">
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        <span>{dest.weather.tempF}°F • {dest.weather.condition}</span>
                      </div>

                      {/* Budget */}
                      <div className="py-2 border-b border-white/5 font-mono font-bold text-amber-400 text-sm">
                        {formatCurrency(cost)} <span className="text-[10px] font-normal text-gray-400">/ person</span>
                      </div>

                      {/* Accommodation */}
                      <div className="py-2 border-b border-white/5 text-[11px] text-gray-300 line-clamp-1">
                        {dest.accommodationType}
                      </div>

                      {/* Rating */}
                      <div className="py-2 border-b border-white/5 flex items-center space-x-1 text-gray-200 font-bold">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>{dest.rating}</span>
                        <span className="text-gray-400 font-normal">({dest.reviewsCount})</span>
                      </div>

                      {/* Highlights */}
                      <div className="py-2 border-b border-white/5 space-y-1">
                        {dest.highlights.slice(0, 2).map((h, i) => (
                          <div key={i} className="text-[10px] text-gray-300 truncate">
                            ✦ {h}
                          </div>
                        ))}
                      </div>

                      {/* Action */}
                      <button
                        onClick={() => {
                          setActiveDestination(dest);
                          setCompareOpen(false);
                        }}
                        className="w-full py-2 rounded-xl bg-emerald-500 text-gray-950 font-bold text-xs hover:bg-emerald-400 transition-all flex items-center justify-center space-x-1"
                      >
                        <span>Choose This Pass</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                    </div>

                  </div>
                );
              })}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
