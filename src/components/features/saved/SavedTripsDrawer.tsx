import React from 'react';
import { X, Bookmark, Trash2, Share2, Sparkles, Clock } from 'lucide-react';
import { useTrip } from '../../../hooks/useTrip';
import { DESTINATIONS } from '../../../data/destinations';

interface SavedTripsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SavedTripsDrawer: React.FC<SavedTripsDrawerProps> = ({ isOpen, onClose }) => {
  const { savedIds, toggleSaveDestination, setActiveDestination, filters, setShareDestination, getComputedCost } = useTrip();

  if (!isOpen) return null;

  const savedDestinations = DESTINATIONS.filter(d => savedIds.includes(d.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-modal border-l border-white/15 p-6 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Bookmark className="w-5 h-5 text-amber-400 fill-amber-400" />
                <h3 className="text-lg font-bold text-white">Your Saved Getaways</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                  {savedDestinations.length}
                </span>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of Saved Getaways */}
            <div className="mt-6 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {savedDestinations.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Sparkles className="w-10 h-10 text-gray-600 mx-auto" />
                  <p className="text-sm font-semibold text-gray-300">No saved trips yet</p>
                  <p className="text-xs text-gray-400">Click the bookmark icon on any getaway card to save it here for comparison.</p>
                </div>
              ) : (
                savedDestinations.map(dest => {
                  const hubTravel = dest.hubDistance[filters.departureHub] || Object.values(dest.hubDistance)[0];
                  const cost = getComputedCost(dest);

                  return (
                    <div
                      key={dest.id}
                      className="glass-panel p-3.5 rounded-2xl border border-white/10 flex space-x-3 items-center group hover:border-emerald-500/40 transition-all"
                    >
                      <img
                        src={dest.heroImage}
                        alt={dest.title}
                        className="w-20 h-20 rounded-xl object-cover shrink-0"
                      />

                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="font-bold text-white text-xs truncate group-hover:text-emerald-400 transition-colors">
                          {dest.title}
                        </h4>
                        
                        <div className="flex items-center space-x-2 text-[11px] text-gray-400">
                          <span className="text-emerald-400 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {hubTravel?.formatted}
                          </span>
                          <span>•</span>
                          <span className="text-amber-400 font-mono">${cost}/person</span>
                        </div>

                        <div className="flex items-center space-x-2 pt-1">
                          <button
                            onClick={() => {
                              setActiveDestination(dest);
                              onClose();
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-bold hover:bg-emerald-500 hover:text-gray-950 transition-all"
                          >
                            View Itinerary
                          </button>

                          <button
                            onClick={() => setShareDestination(dest)}
                            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                            title="Share Card"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => toggleSaveDestination(dest.id)}
                            className="p-1 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Footer */}
          {savedDestinations.length > 0 && (
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-emerald-500 text-gray-950 font-bold text-xs hover:bg-emerald-400 transition-all text-center"
              >
                Back to Escapes
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
