import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  Share2, 
  Bookmark, 
  Calendar, 
  CheckSquare, 
  Lightbulb, 
  PieChart 
} from 'lucide-react';
import { useTrip } from '../hooks/useTrip';
import type { PackingItem } from '../types';
import { ItineraryTimeline } from './features/detail/ItineraryTimeline';
import { BudgetCalculator } from './features/detail/BudgetCalculator';
import { PackingChecklist } from './features/detail/PackingChecklist';
import { InsiderTips } from './features/detail/InsiderTips';
import { AddActivityModal } from './features/detail/AddActivityModal';

export const DestinationDetailModal: React.FC = () => {
  const { 
    activeDestination, 
    setActiveDestination, 
    filters, 
    savedIds, 
    toggleSaveDestination,
    customActivities,
    budgetModifiers,
    getComputedCost,
    formatCurrency,
    setShareDestination
  } = useTrip();

  const [activeTab, setActiveTab] = useState<'itinerary' | 'budget' | 'packing' | 'tips'>('itinerary');
  const [packingItems, setPackingItems] = useState<PackingItem[]>(() => activeDestination?.packingList || []);
  const [timeStepIndex, setTimeStepIndex] = useState<number>(0);
  const [showAddActivityModal, setShowAddActivityModal] = useState<boolean>(false);
  const [prevDestId, setPrevDestId] = useState<string | null>(activeDestination?.id || null);

  // Sync state when active destination changes
  if (activeDestination && activeDestination.id !== prevDestId) {
    setPrevDestId(activeDestination.id);
    setPackingItems(activeDestination.packingList);
    setTimeStepIndex(0);
    setActiveTab('itinerary');
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveDestination(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveDestination]);

  if (!activeDestination) return null;

  const dest = activeDestination;
  const isSaved = savedIds.includes(dest.id);
  const hubTravel = dest.hubDistance[filters.departureHub] || Object.values(dest.hubDistance)[0];

  const currentMod = budgetModifiers[dest.id] || { accommodation: 'comfortable', dining: 'comfortable' };
  const computedCostUSD = getComputedCost(dest);

  const enabledActivityIds = customActivities[dest.id] || dest.itinerary.map(a => a.id);
  const activeItinerary = dest.itinerary.filter(a => enabledActivityIds.includes(a.id));

  const togglePackingCheck = (id: string) => {
    setPackingItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const packedCount = packingItems.filter(p => p.checked).length;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-label={`${dest.title} 48-Hour Weekend Itinerary`}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl glass-modal rounded-3xl overflow-hidden border border-white/15 shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Top Sticky Header Banner */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden shrink-0">
          <img 
            src={dest.heroImage} 
            alt={dest.title} 
            loading="lazy" 
            decoding="async" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-black/60" />

          {/* Close & Header Action Controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500 text-gray-950 font-bold text-xs shadow-lg">
                {dest.matchScore}% Match
              </span>
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium border border-white/10">
                {hubTravel?.formatted}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => toggleSaveDestination(dest.id)}
                aria-label={isSaved ? 'Remove from saved trips' : 'Save trip'}
                className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
                  isSaved ? 'bg-amber-500 text-gray-950 shadow-lg scale-105' : 'bg-black/50 text-white hover:bg-black/80 border border-white/20'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={() => setShareDestination(dest)}
                aria-label="Share getaway itinerary pass"
                className="p-2.5 rounded-full bg-black/50 text-white hover:bg-black/80 backdrop-blur-md border border-white/20 transition-all"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveDestination(null)}
                aria-label="Close itinerary details"
                className="p-2.5 rounded-full bg-black/50 text-white hover:bg-rose-500 backdrop-blur-md border border-white/20 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Banner Title Details */}
          <div className="absolute bottom-6 left-6 right-6 z-10 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400">
              <span>{dest.accommodationType}</span>
              <span>•</span>
              <div className="flex items-center space-x-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="text-white font-bold">{dest.rating}</span>
                <span className="text-gray-400 font-normal">({dest.reviewsCount} reviews)</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{dest.title}</h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl line-clamp-2 font-normal">{dest.vibeSummary}</p>
          </div>
        </div>

        {/* Tab Navigation Controls Bar */}
        <div className="px-6 border-b border-white/10 bg-black/40 flex items-center justify-between shrink-0 overflow-x-auto">
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab('itinerary')}
              className={`py-3.5 text-xs font-bold flex items-center space-x-2 border-b-2 transition-all ${
                activeTab === 'itinerary' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>48h Timeline ({activeItinerary.length} items)</span>
            </button>

            <button
              onClick={() => setActiveTab('budget')}
              className={`py-3.5 text-xs font-bold flex items-center space-x-2 border-b-2 transition-all ${
                activeTab === 'budget' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <PieChart className="w-4 h-4" />
              <span>Budget Analytics ({formatCurrency(computedCostUSD)})</span>
            </button>

            <button
              onClick={() => setActiveTab('packing')}
              className={`py-3.5 text-xs font-bold flex items-center space-x-2 border-b-2 transition-all ${
                activeTab === 'packing' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Packing Checklist ({packedCount}/{packingItems.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('tips')}
              className={`py-3.5 text-xs font-bold flex items-center space-x-2 border-b-2 transition-all ${
                activeTab === 'tips' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              <span>Local Tips</span>
            </button>
          </div>
        </div>

        {/* Modal Main Content Container */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'itinerary' && (
            <ItineraryTimeline
              dest={dest}
              enabledActivityIds={enabledActivityIds}
              timeStepIndex={timeStepIndex}
              setTimeStepIndex={setTimeStepIndex}
              onOpenAddModal={() => setShowAddActivityModal(true)}
            />
          )}

          {activeTab === 'budget' && (
            <BudgetCalculator
              dest={dest}
              computedCostUSD={computedCostUSD}
              currentMod={currentMod}
              activeItineraryCount={activeItinerary.length}
            />
          )}

          {activeTab === 'packing' && (
            <PackingChecklist
              dest={dest}
              items={packingItems}
              onToggleItem={togglePackingCheck}
            />
          )}

          {activeTab === 'tips' && <InsiderTips tips={dest.insiderTips} />}
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-6 border-t border-white/10 bg-black/60 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] uppercase text-gray-400 block font-medium">Estimated Budget</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">
              {formatCurrency(computedCostUSD)} <span className="text-xs font-normal text-gray-400">/ person</span>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShareDestination(dest)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl glass-pill text-xs font-semibold text-white hover:border-white/30 transition-all"
            >
              <Share2 className="w-4 h-4 text-indigo-400" />
              <span>Share Pass</span>
            </button>

            <button
              onClick={() => {
                if (!isSaved) toggleSaveDestination(dest.id);
                setActiveDestination(null);
              }}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-gray-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 hover:scale-105 transition-all"
            >
              <Bookmark className="w-4 h-4 fill-current" />
              <span>{isSaved ? 'Saved in Itineraries' : 'Save Weekend Pass'}</span>
            </button>
          </div>
        </div>

        {/* Form Modal for Creating Custom Activity */}
        {showAddActivityModal && (
          <AddActivityModal
            destId={dest.id}
            destTitle={dest.title}
            onClose={() => setShowAddActivityModal(false)}
          />
        )}
      </div>
    </div>
  );
};
