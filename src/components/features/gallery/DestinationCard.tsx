import React, { useState } from 'react';
import { 
  Star, 
  Car, 
  Plane, 
  Train, 
  Bookmark, 
  ArrowRight, 
  Sun, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import type { Destination } from '../../../types';
import { useTrip } from '../../../hooks/useTrip';

interface DestinationCardProps {
  destination: Destination;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ destination }) => {
  const { filters, savedIds, toggleSaveDestination, setActiveDestination, getComputedCost, formatCurrency } = useTrip();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isSaved = savedIds.includes(destination.id);
  const hubTravel = destination.hubDistance[filters.departureHub] || Object.values(destination.hubDistance)[0];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % destination.gallery.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + destination.gallery.length) % destination.gallery.length);
  };

  const getTravelIcon = (mode: string) => {
    switch (mode) {
      case 'drive': return <Car className="w-3.5 h-3.5 text-emerald-400" />;
      case 'flight': return <Plane className="w-3.5 h-3.5 text-indigo-400" />;
      case 'train': return <Train className="w-3.5 h-3.5 text-amber-400" />;
      default: return <Car className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  const computedCostUSD = getComputedCost(destination);

  return (
    <div 
      role="button"
      tabIndex={0}
      aria-label={`View 48-hour itinerary for ${destination.title}`}
      onClick={() => setActiveDestination(destination)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setActiveDestination(destination);
        }
      }}
      className="group relative rounded-3xl glass-panel glass-panel-hover overflow-hidden flex flex-col cursor-pointer border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400"
    >
      {/* Top Image Stack */}
      <div className="relative h-64 w-full overflow-hidden bg-gray-900">
        <img
          src={destination.gallery[currentImageIndex] || destination.heroImage}
          alt={destination.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-black/30" />

        {/* Top Floating Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          
          {/* Match Score Badge */}
          {destination.matchScore && (
            <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-500/90 backdrop-blur-md text-gray-950 text-xs font-bold shadow-lg ring-1 ring-emerald-300">
              <Sparkles className="w-3 h-3 text-gray-950" />
              <span>{destination.matchScore}% Match</span>
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveDestination(destination.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              isSaved
                ? 'bg-amber-500 text-gray-950 shadow-lg scale-110'
                : 'bg-black/40 text-gray-300 hover:text-white hover:bg-black/60 border border-white/20'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Image Nav Arrows (visible on card hover) */}
        {destination.gallery.length > 1 && (
          <div className="absolute inset-y-0 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button
              onClick={prevImage}
              className="p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Image Indicator Dots */}
        {destination.gallery.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10">
            {destination.gallery.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentImageIndex ? 'w-5 bg-emerald-400' : 'w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
        )}

        {/* Weather Badge */}
        <div className="absolute bottom-3 left-4 flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-medium border border-white/10 z-10">
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span>{destination.weather.tempF}°F • {destination.weather.condition}</span>
        </div>
      </div>

      {/* Card Body Info */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <div className="flex items-center space-x-1.5 font-medium text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              {getTravelIcon(hubTravel?.mode || 'drive')}
              <span>{hubTravel?.formatted || '2.5h drive'}</span>
            </div>

            <div className="flex items-center space-x-1 font-semibold text-gray-200">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{destination.rating}</span>
              <span className="text-gray-300 font-normal">({destination.reviewsCount})</span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
            {destination.title}
          </h3>
          <p className="text-xs text-gray-300 mt-1 line-clamp-2 font-normal leading-relaxed">
            {destination.tagline}
          </p>
        </div>

        {/* Highlights */}
        <div className="flex flex-wrap gap-1.5">
          {destination.highlights.slice(0, 2).map((highlight, i) => (
            <span
              key={i}
              className="text-[10px] px-2 py-1 rounded-md bg-white/5 text-gray-300 border border-white/10"
            >
              ✦ {highlight}
            </span>
          ))}
        </div>

        {/* Card Footer: Cost & CTA */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase text-gray-400 block font-medium">Est. 2-Night Stay</span>
            <div className="flex items-center text-white font-bold text-base">
              <span className="text-emerald-400 font-mono">{formatCurrency(computedCostUSD)}</span>
              <span className="text-[11px] text-gray-400 font-normal ml-1">/ person</span>
            </div>
          </div>

          <button className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-semibold hover:bg-emerald-500 hover:text-gray-950 transition-all border border-emerald-500/30">
            <span>48h Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
