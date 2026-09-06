import React, { useState } from 'react';
import { 
  Heart, 
  X, 
  Bookmark, 
  Sparkles, 
  Star, 
  Clock, 
  Sun, 
  RotateCcw,
  ArrowRight
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { sound } from '../utils/sound';

export const DestinationDeck: React.FC = () => {
  const { filteredDestinations, filters, savedIds, toggleSaveDestination, setActiveDestination, getComputedCost, formatCurrency } = useTrip();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  if (filteredDestinations.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center max-w-lg mx-auto my-12 space-y-4">
        <Sparkles className="w-12 h-12 text-indigo-400 mx-auto" />
        <h3 className="text-xl font-bold text-white">No Escapes Match Your Filter</h3>
        <p className="text-sm text-gray-400">Try widening your travel radius slider or clearing some vibe tags.</p>
      </div>
    );
  }

  const currentDest = filteredDestinations[currentIndex % filteredDestinations.length];
  const nextDest = filteredDestinations[(currentIndex + 1) % filteredDestinations.length];
  const hubTravel = currentDest.hubDistance[filters.departureHub] || Object.values(currentDest.hubDistance)[0];
  const isSaved = savedIds.includes(currentDest.id);
  const computedCost = getComputedCost(currentDest);

  const handleNext = (dir: 'left' | 'right') => {
    sound.playSwipe();
    setSwipeDirection(dir);
    setTimeout(() => {
      setSwipeDirection(null);
      setCurrentIndex((prev) => (prev + 1) % filteredDestinations.length);
    }, 250);
  };

  return (
    <div className="max-w-md mx-auto py-6 px-4">
      {/* Top Deck Counter */}
      <div className="flex items-center justify-between mb-4 text-xs text-gray-400">
        <span className="font-semibold text-gray-300">Swipe Discover Mode</span>
        <span className="font-mono bg-white/10 px-2.5 py-1 rounded-full text-emerald-400 font-bold">
          {currentIndex + 1} / {filteredDestinations.length}
        </span>
      </div>

      {/* Card Stack Container */}
      <div className="relative h-[540px] w-full swipe-card-stack">
        
        {nextDest && (
          <div className="absolute inset-0 rounded-3xl glass-panel opacity-40 scale-95 translate-y-4 pointer-events-none border border-white/5" />
        )}

        {/* Active Top Card */}
        <div
          className={`absolute inset-0 rounded-3xl glass-panel overflow-hidden border border-white/15 shadow-2xl flex flex-col justify-between transition-transform duration-300 ${
            swipeDirection === 'left' ? '-translate-x-full -rotate-12 opacity-0' : ''
          } ${swipeDirection === 'right' ? 'translate-x-full rotate-12 opacity-0' : ''}`}
        >
          {/* Card Hero Image */}
          <div className="relative h-72 w-full overflow-hidden bg-gray-900">
            <img
              src={currentDest.heroImage}
              alt={currentDest.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-black/40" />

            {/* Match Badge */}
            <div className="absolute top-4 left-4 flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-500 text-gray-950 font-bold text-xs shadow-lg">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentDest.matchScore}% Match</span>
            </div>

            {/* Travel Time Badge */}
            <div className="absolute top-4 right-4 flex items-center space-x-1 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold border border-white/10">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{hubTravel?.formatted}</span>
            </div>

            {/* Weather Overlay */}
            <div className="absolute bottom-3 left-4 flex items-center space-x-1.5 text-xs text-gray-200 font-medium">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>{currentDest.weather.tempF}°F • {currentDest.weather.condition}</span>
            </div>
          </div>

          {/* Card Content Info */}
          <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span className="text-emerald-400 font-medium">{currentDest.accommodationType}</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-white">{currentDest.rating}</span>
                </div>
              </div>

              <h2 className="text-xl font-extrabold text-white">{currentDest.title}</h2>
              <p className="text-xs text-gray-300 mt-1 line-clamp-2">{currentDest.vibeSummary}</p>
            </div>

            {/* Highlights */}
            <div className="flex flex-wrap gap-1.5">
              {currentDest.highlights.slice(0, 3).map((h, i) => (
                <span key={i} className="text-[10px] px-2.5 py-1 rounded-md bg-white/5 text-gray-300 border border-white/10">
                  ✦ {h}
                </span>
              ))}
            </div>

            {/* Cost & Explore Button */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase text-gray-400 block font-medium">Est. 2-Night Stay</span>
                <span className="text-lg font-bold text-emerald-400 font-mono">{formatCurrency(computedCost)} <span className="text-xs font-normal text-gray-400">/ person</span></span>
              </div>

              <button
                onClick={() => setActiveDestination(currentDest)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-gray-950 font-bold text-xs hover:bg-emerald-400 transition-all"
              >
                <span>View Itinerary</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Swipe Controls Bar */}
      <div className="mt-6 flex items-center justify-center space-x-6">
        <button
          onClick={() => handleNext('left')}
          className="w-14 h-14 rounded-full glass-panel flex items-center justify-center text-rose-400 hover:text-white hover:bg-rose-500/20 hover:border-rose-500/40 transition-all duration-200 border border-white/10 shadow-lg group"
        >
          <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={() => toggleSaveDestination(currentDest.id)}
          className={`w-12 h-12 rounded-full glass-panel flex items-center justify-center transition-all duration-200 border border-white/10 ${
            isSaved ? 'bg-amber-500 text-gray-950 shadow-lg scale-110' : 'text-amber-400 hover:bg-amber-500/20'
          }`}
        >
          <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % filteredDestinations.length)}
          className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/10"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={() => handleNext('right')}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 hover:scale-110 transition-all group"
        >
          <Heart className="w-6 h-6 fill-current text-white group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
};
