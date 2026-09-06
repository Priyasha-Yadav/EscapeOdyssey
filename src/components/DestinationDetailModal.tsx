import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Clock, 
  MapPin, 
  Share2, 
  Bookmark, 
  Calendar, 
  CheckSquare, 
  Lightbulb, 
  Sparkles,
  Utensils,
  Trees,
  Palette,
  Flame,
  Compass,
  CheckCircle2,
  Plus,
  PieChart
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import type { ActivityCategory, BudgetTier, PackingItem } from '../types';
import { validateCustomActivityInput } from '../utils/security';

export const DestinationDetailModal: React.FC = () => {
  const { 
    activeDestination, 
    setActiveDestination, 
    filters, 
    savedIds, 
    toggleSaveDestination,
    customActivities,
    toggleActivity,
    addCustomActivity,
    budgetModifiers,
    setBudgetModifier,
    getComputedCost,
    formatCurrency,
    setShareDestination
  } = useTrip();

  const [activeTab, setActiveTab] = useState<'itinerary' | 'budget' | 'packing' | 'tips'>('itinerary');
  const [packingItems, setPackingItems] = useState<PackingItem[]>(activeDestination?.packingList || []);
  const [timeStepIndex, setTimeStepIndex] = useState<number>(0);
  const [showAddActivityModal, setShowAddActivityModal] = useState<boolean>(false);

  // New Activity Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCost, setNewCost] = useState(35);
  const [newPeriod, setNewPeriod] = useState<'Friday Night' | 'Saturday Morning' | 'Saturday Afternoon' | 'Saturday Evening' | 'Sunday Morning' | 'Sunday Afternoon'>('Saturday Afternoon');
  const [newCategory, setNewCategory] = useState<ActivityCategory>('hidden_gem');

  React.useEffect(() => {
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

  const currentTimeItem = dest.itinerary[timeStepIndex] || dest.itinerary[0];

  const togglePackingCheck = (id: string) => {
    setPackingItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const [formError, setFormError] = useState('');

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    const val = validateCustomActivityInput(newTitle, newCost);

    if (!val.isValid) {
      setFormError(val.errors[0] || 'Invalid input.');
      return;
    }

    setFormError('');
    addCustomActivity(dest.id, {
      title: val.sanitizedTitle,
      period: newPeriod,
      timeSlot: `${newPeriod.split(' ')[0]} 2:00 PM`,
      description: 'Custom activity created for your customized getaway timeline.',
      category: newCategory,
      duration: '1.5 hours',
      estimatedCost: val.sanitizedCost,
      locationName: dest.title,
    });
    setNewTitle('');
    setShowAddActivityModal(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'dining': return <Utensils className="w-3.5 h-3.5 text-amber-400" />;
      case 'nature': return <Trees className="w-3.5 h-3.5 text-emerald-400" />;
      case 'culture': return <Palette className="w-3.5 h-3.5 text-purple-400" />;
      case 'wellness': return <Flame className="w-3.5 h-3.5 text-rose-400" />;
      case 'adventure': return <Compass className="w-3.5 h-3.5 text-cyan-400" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-indigo-400" />;
    }
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

          {/* TAB 1: 48-HOUR TIMELINE & TIME MACHINE SLIDER */}
          {activeTab === 'itinerary' && (
            <div className="space-y-6">
              
              {/* 48-Hour Live Time Machine Slider Widget */}
              <div className="glass-panel rounded-2xl p-4 border border-indigo-500/20 bg-gradient-to-r from-indigo-950/30 to-emerald-950/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-bold text-indigo-300">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>48-Hour Scrubbing Time Machine</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    {currentTimeItem.period} • {currentTimeItem.timeSlot}
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max={dest.itinerary.length - 1}
                  value={timeStepIndex}
                  onChange={(e) => setTimeStepIndex(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />

                <div className="flex items-center justify-between text-[11px] text-gray-300 pt-1">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-white">Active Spot:</span>
                    <span className="text-amber-300 font-semibold">{currentTimeItem.title}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-emerald-300">
                    <span>Est. {currentTimeItem.duration}</span>
                  </div>
                </div>
              </div>

              {/* Action Bar: Add Custom Activity */}
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Check/uncheck items to customize your weekend schedule:</span>
                <button
                  onClick={() => setShowAddActivityModal(true)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold hover:bg-emerald-500 hover:text-gray-950 transition-all border border-emerald-500/30"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Activity</span>
                </button>
              </div>

              {/* Hourly Activity List */}
              <div className="space-y-4 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-white/10">
                {dest.itinerary.map((item, idx) => {
                  const isEnabled = enabledActivityIds.includes(item.id);
                  const isSelectedInSlider = idx === timeStepIndex;

                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleActivity(dest.id, item.id)}
                      className={`relative ml-10 p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelectedInSlider
                          ? 'glass-panel border-amber-400/80 bg-amber-500/10 shadow-lg shadow-amber-500/10 scale-[1.01]'
                          : isEnabled
                          ? 'glass-panel border-white/15 hover:border-emerald-500/50'
                          : 'bg-white/5 border-white/5 opacity-50'
                      }`}
                    >
                      {/* Timeline Dot Indicator */}
                      <div className={`absolute -left-10 top-5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelectedInSlider
                          ? 'bg-amber-400 border-amber-300 ring-4 ring-amber-400/30 scale-125'
                          : isEnabled
                          ? 'bg-emerald-500 border-emerald-400 shadow-md shadow-emerald-500/50'
                          : 'bg-gray-800 border-gray-600'
                      }`}>
                        {isEnabled && <div className="w-1.5 h-1.5 rounded-full bg-gray-950" />}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-xs">
                            <span className="font-mono font-bold text-amber-400">{item.timeSlot}</span>
                            <span className="px-2 py-0.5 rounded bg-white/10 text-gray-300 font-medium text-[10px]">{item.period}</span>
                            <span className="flex items-center space-x-1 px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-medium text-[10px]">
                              {getCategoryIcon(item.category)}
                              <span className="capitalize">{item.category}</span>
                            </span>
                          </div>

                          <h4 className="font-bold text-white text-sm">{item.title}</h4>
                          <p className="text-xs text-gray-300 leading-relaxed font-normal">{item.description}</p>
                          
                          <div className="flex items-center space-x-2 text-[11px] text-gray-400 pt-1">
                            <MapPin className="w-3 h-3 text-emerald-400" />
                            <span>{item.locationName}</span>
                            <span>•</span>
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span>{item.duration}</span>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <span className="text-xs font-mono font-bold text-emerald-400">
                            {item.estimatedCost > 0 ? formatCurrency(item.estimatedCost) : 'Free'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 2: BUDGET ANALYTICS & SVG DONUT CHART */}
          {activeTab === 'budget' && (
            <div className="space-y-6">
              
              {/* Dynamic Tier Selectors */}
              <div className="glass-panel p-5 rounded-2xl space-y-3 border border-white/10">
                <h3 className="font-bold text-white text-base">Custom Budget Estimator</h3>
                <p className="text-xs text-gray-300">Select accommodation tier and dining style to dynamically update weekend estimates.</p>

                <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-300 block">Accommodation Style</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['budget', 'comfortable', 'luxury'] as BudgetTier[]).map((tier) => (
                        <button
                          key={tier}
                          onClick={() => setBudgetModifier(dest.id, 'accommodation', tier)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all border ${
                            currentMod.accommodation === tier
                              ? 'bg-emerald-500 text-gray-950 border-emerald-400 shadow-md'
                              : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                          }`}
                        >
                          {tier}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-300 block">Dining & Culinary Style</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['budget', 'comfortable', 'luxury'] as BudgetTier[]).map((tier) => (
                        <button
                          key={tier}
                          onClick={() => setBudgetModifier(dest.id, 'dining', tier)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all border ${
                            currentMod.dining === tier
                              ? 'bg-emerald-500 text-gray-950 border-emerald-400 shadow-md'
                              : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                          }`}
                        >
                          {tier}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Visual Budget SVG Donut Breakdown */}
              <div className="glass-panel p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                
                {/* Donut Graphic */}
                <div className="sm:col-span-5 flex flex-col items-center justify-center relative">
                  <svg className="w-36 h-36 -rotate-90">
                    <circle cx="72" cy="72" r="54" stroke="rgba(255,255,255,0.1)" strokeWidth="16" fill="transparent" />
                    {/* Stay Segment 55% */}
                    <circle cx="72" cy="72" r="54" stroke="#10B981" strokeWidth="16" fill="transparent" strokeDasharray="339" strokeDashoffset="152" />
                    {/* Dining Segment 30% */}
                    <circle cx="72" cy="72" r="54" stroke="#F59E0B" strokeWidth="16" fill="transparent" strokeDasharray="339" strokeDashoffset="237" />
                    {/* Activities Segment 15% */}
                    <circle cx="72" cy="72" r="54" stroke="#6366F1" strokeWidth="16" fill="transparent" strokeDasharray="339" strokeDashoffset="288" />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xs text-gray-400 font-medium">Est. Total</span>
                    <span className="text-lg font-extrabold text-white font-mono">{formatCurrency(computedCostUSD)}</span>
                  </div>
                </div>

                {/* Legend & Breakdown Details */}
                <div className="sm:col-span-7 space-y-3 text-xs text-gray-300">
                  <h4 className="font-bold text-white text-sm">Visual Expense Allocation</h4>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-1 border-b border-white/10">
                      <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded bg-emerald-500" />
                        <span>2-Night Stay ({currentMod.accommodation})</span>
                      </div>
                      <span className="font-mono text-white font-bold">{formatCurrency(computedCostUSD * 0.55)}</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-white/10">
                      <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded bg-amber-500" />
                        <span>Dining & Drinks ({currentMod.dining})</span>
                      </div>
                      <span className="font-mono text-white font-bold">{formatCurrency(computedCostUSD * 0.30)}</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-white/10">
                      <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded bg-indigo-500" />
                        <span>Activities ({activeItinerary.length} items)</span>
                      </div>
                      <span className="font-mono text-white font-bold">{formatCurrency(computedCostUSD * 0.15)}</span>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 3: PACKING CHECKLIST */}
          {activeTab === 'packing' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">Essential Weekend Packing List</h3>
                  <p className="text-xs text-gray-400">Tailored items for {dest.weather.condition} in {dest.title}</p>
                </div>

                <div className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  {packedCount} / {packingItems.length} Packed
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {packingItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => togglePackingCheck(item.id)}
                    className={`flex items-center space-x-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      item.checked
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                        : 'glass-panel border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className={`w-5 h-5 ${item.checked ? 'text-emerald-400 fill-emerald-400/20' : 'text-gray-600'}`} />
                    <span className={`text-xs font-medium ${item.checked ? 'line-through text-gray-400' : ''}`}>
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: LOCAL INSIDER TIPS */}
          {activeTab === 'tips' && (
            <div className="space-y-4">
              <h3 className="font-bold text-white text-base">Curated Local Secrets & Logistics</h3>
              
              <div className="space-y-3">
                {dest.insiderTips.map((tip, idx) => (
                  <div key={idx} className="glass-panel p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex items-start space-x-3">
                    <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-200 leading-relaxed font-normal">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-6 border-t border-white/10 bg-black/60 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] uppercase text-gray-400 block font-medium">Estimated Budget</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">{formatCurrency(computedCostUSD)} <span className="text-xs font-normal text-gray-400">/ person</span></span>
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
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150">
            <div className="w-full max-w-md glass-modal rounded-3xl p-6 border border-white/20 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm">Add Custom Activity to 48h Timeline</h4>
                <button onClick={() => setShowAddActivityModal(false)} className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateActivity} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Activity Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sunset Coffee at Secret Overlook"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">Time Period</label>
                    <select
                      value={newPeriod}
                      onChange={(e) => setNewPeriod(e.target.value as any)}
                      className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                    >
                      <option value="Friday Night">Friday Night</option>
                      <option value="Saturday Morning">Saturday Morning</option>
                      <option value="Saturday Afternoon">Saturday Afternoon</option>
                      <option value="Saturday Evening">Saturday Evening</option>
                      <option value="Sunday Morning">Sunday Morning</option>
                      <option value="Sunday Afternoon">Sunday Afternoon</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                    >
                      <option value="dining">Dining 🍷</option>
                      <option value="nature">Nature 🌲</option>
                      <option value="culture">Culture 🎨</option>
                      <option value="wellness">Wellness ♨️</option>
                      <option value="adventure">Adventure 🧗</option>
                      <option value="hidden_gem">Hidden Gem 💎</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Est. Cost (USD)</label>
                  <input
                    type="number"
                    min="0"
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
                  />
                </div>

                {formError && (
                  <p className="text-xs text-rose-400 font-medium">{formError}</p>
                )}

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAddActivityModal(false)}
                    className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-500 text-gray-950 font-bold text-xs hover:bg-emerald-400 transition-all"
                  >
                    Save to Timeline
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
