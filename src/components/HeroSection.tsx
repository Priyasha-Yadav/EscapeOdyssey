import React from 'react';
import { 
  Sliders, 
  Search, 
  LayoutGrid, 
  Layers, 
  Map, 
  Clock, 
  Mountain, 
  Waves, 
  Wine, 
  Sparkles, 
  Building2, 
  Compass, 
  Heart, 
  Moon,
  X
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { MOOD_OPTIONS, TRAVEL_HUBS } from '../data/destinations';
import type { MoodTag } from '../types';

export const HeroSection: React.FC = () => {
  const { filters, setFilters, filteredDestinations } = useTrip();

  const currentHub = TRAVEL_HUBS.find(h => h.id === filters.departureHub) || TRAVEL_HUBS[0];

  const getMoodIcon = (iconName: string) => {
    switch (iconName) {
      case 'Mountain': return <Mountain className="w-4 h-4" />;
      case 'Waves': return <Waves className="w-4 h-4" />;
      case 'Wine': return <Wine className="w-4 h-4" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4" />;
      case 'Building2': return <Building2 className="w-4 h-4" />;
      case 'Compass': return <Compass className="w-4 h-4" />;
      case 'Heart': return <Heart className="w-4 h-4" />;
      case 'Moon': return <Moon className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const toggleMood = (moodId: MoodTag) => {
    setFilters(prev => {
      const exists = prev.selectedMoods.includes(moodId);
      return {
        ...prev,
        selectedMoods: exists
          ? prev.selectedMoods.filter(m => m !== moodId)
          : [...prev.selectedMoods, moodId],
      };
    });
  };

  return (
    <section className="relative pt-8 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-radial-glow pointer-events-none opacity-80" />

      {/* Main Header Copy */}
      <div className="text-center max-w-3xl mx-auto space-y-4 relative z-10">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Zero Decision Fatigue • 48-Hour Curated Itineraries</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Where will your <span className="gradient-emerald-indigo">weekend</span> take you?
        </h1>
        
        <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto font-normal">
          Pick your mood and maximum travel distance. We’ll match you with perfect 48-hour getaways from <span className="text-emerald-400 font-semibold">{currentHub.name}</span>.
        </p>
      </div>

      {/* Filter Control Board */}
      <div className="mt-8 glass-panel rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6 relative z-10 border border-white/10">
        
        {/* Top Controls Row: Search & Travel Time Slider */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          
          {/* Search Box */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by spot name, vibe, or activities (e.g., Napa, Sauna, Redwood)..."
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-10 py-3 text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/50 transition-all"
            />
            {filters.searchQuery && (
              <button 
                onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Travel Radius Slider */}
          <div className="md:col-span-6 bg-white/5 border border-white/10 rounded-2xl px-5 py-2.5 flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2 text-xs text-gray-300 min-w-max">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-gray-200">Max Travel Time:</span>
              <span className="text-emerald-400 font-bold font-mono text-sm">{Math.floor(filters.maxTravelMinutes / 60)}h {filters.maxTravelMinutes % 60 ? `${filters.maxTravelMinutes % 60}m` : ''}</span>
            </div>
            
            <input
              type="range"
              min="60"
              max="600"
              step="30"
              value={filters.maxTravelMinutes}
              onChange={(e) => setFilters(prev => ({ ...prev, maxTravelMinutes: Number(e.target.value) }))}
              className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

        </div>

        {/* Middle Row: Mood Tags Chips */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>Select Your Weekend Vibe</span>
            </div>
            {filters.selectedMoods.length > 0 && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, selectedMoods: [] }))}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium underline"
              >
                Clear Vibe Filters ({filters.selectedMoods.length})
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2.5">
            {MOOD_OPTIONS.map(mood => {
              const isSelected = filters.selectedMoods.includes(mood.id);
              return (
                <button
                  key={mood.id}
                  onClick={() => toggleMood(mood.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-400/50 scale-105'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 hover:border-white/20'
                  }`}
                >
                  <span className={isSelected ? 'text-white' : 'text-emerald-400'}>
                    {getMoodIcon(mood.icon)}
                  </span>
                  <span>{mood.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Row: View Mode Switcher & Counter */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="text-xs text-gray-300 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Matching <strong className="text-white font-bold">{filteredDestinations.length}</strong> top weekend escapes within reach</span>
          </div>

          {/* View Mode Tabs */}
          <div className="flex items-center p-1 bg-black/40 rounded-2xl border border-white/10">
            <button
              onClick={() => setFilters(prev => ({ ...prev, viewMode: 'grid' }))}
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filters.viewMode === 'grid'
                  ? 'bg-emerald-500 text-gray-950 shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid Gallery</span>
            </button>

            <button
              onClick={() => setFilters(prev => ({ ...prev, viewMode: 'deck' }))}
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filters.viewMode === 'deck'
                  ? 'bg-emerald-500 text-gray-950 shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Swipe Match</span>
            </button>

            <button
              onClick={() => setFilters(prev => ({ ...prev, viewMode: 'map' }))}
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filters.viewMode === 'map'
                  ? 'bg-emerald-500 text-gray-950 shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Visual Map</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
