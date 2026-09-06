import React, { useState } from 'react';
import { MapPin, Navigation, Star, Clock, ArrowRight } from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { TRAVEL_HUBS } from '../data/destinations';
import type { Destination } from '../types';

export const MapView: React.FC = () => {
  const { filteredDestinations, filters, setActiveDestination } = useTrip();
  const [hoveredDest, setHoveredDest] = useState<Destination | null>(null);

  const currentHub = TRAVEL_HUBS.find(h => h.id === filters.departureHub) || TRAVEL_HUBS[0];

  // Map coordinates projection scaling relative to map SVG canvas
  const getCanvasCoords = (lat: number, lng: number) => {
    // Normalization formula centered around hub lat/lng
    const hubLat = currentHub.lat;
    const hubLng = currentHub.lng;

    const deltaLat = lat - hubLat;
    const deltaLng = lng - hubLng;

    // Map canvas size 900x500
    const centerX = 450;
    const centerY = 250;

    const scaleX = 75; // longitude scaling
    const scaleY = 90; // latitude scaling (inverted for Y axis)

    const x = Math.min(820, Math.max(80, centerX + deltaLng * scaleX));
    const y = Math.min(440, Math.max(60, centerY - deltaLat * scaleY));

    return { x, y };
  };

  const hubPos = getCanvasCoords(currentHub.lat, currentHub.lng);

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <div className="relative glass-panel rounded-3xl overflow-hidden border border-white/10 p-4 sm:p-6 shadow-2xl">
        
        {/* Map Header Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 z-10 relative">
          <div>
            <div className="flex items-center space-x-2">
              <Navigation className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Interactive Radius Visual Map</h3>
            </div>
            <p className="text-xs text-gray-400">Routes calculated from departure hub: <strong className="text-emerald-300">{currentHub.name}</strong></p>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1.5 text-gray-300">
              <span className="w-3 h-3 rounded-full bg-amber-400 shadow-md shadow-amber-400/50" />
              <span>Departure Hub</span>
            </div>
            <div className="flex items-center space-x-1.5 text-gray-300">
              <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-md shadow-emerald-400/50" />
              <span>Getaway Escapes</span>
            </div>
          </div>
        </div>

        {/* SVG Canvas Map Surface */}
        <div className="relative w-full h-[480px] rounded-2xl bg-gradient-to-b from-gray-950 via-[#0B0F17] to-slate-950 border border-white/10 overflow-hidden">
          
          {/* Subtle Grid Lines Background */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          <svg className="w-full h-full absolute inset-0 pointer-events-none">
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Travel Route Vector Lines */}
            {filteredDestinations.map(dest => {
              const pos = getCanvasCoords(dest.lat, dest.lng);
              const isHovered = hoveredDest?.id === dest.id;
              return (
                <g key={`route-${dest.id}`}>
                  <path
                    d={`M ${hubPos.x} ${hubPos.y} Q ${(hubPos.x + pos.x) / 2} ${Math.min(hubPos.y, pos.y) - 30} ${pos.x} ${pos.y}`}
                    fill="none"
                    stroke={isHovered ? '#10B981' : 'url(#routeGradient)'}
                    strokeWidth={isHovered ? '2.5' : '1.5'}
                    strokeDasharray={isHovered ? 'none' : '4 4'}
                    className="transition-all duration-300 opacity-60"
                  />
                </g>
              );
            })}
          </svg>

          {/* Departure Hub Beacon Node */}
          <div
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
            style={{ left: `${hubPos.x}px`, top: `${hubPos.y}px` }}
          >
            <div className="relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <div className="w-6 h-6 rounded-full bg-amber-500 text-gray-950 flex items-center justify-center font-bold text-xs ring-4 ring-amber-500/30 shadow-xl">
                📍
              </div>
            </div>
            <span className="mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md">
              {currentHub.code}
            </span>
          </div>

          {/* Destination Map Pins */}
          {filteredDestinations.map((dest) => {
            const pos = getCanvasCoords(dest.lat, dest.lng);
            const isHovered = hoveredDest?.id === dest.id;
            const hubTravel = dest.hubDistance[filters.departureHub] || Object.values(dest.hubDistance)[0];

            return (
              <div
                key={`pin-${dest.id}`}
                className="absolute z-30 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
                onMouseEnter={() => setHoveredDest(dest)}
                onMouseLeave={() => setHoveredDest(null)}
                onClick={() => setActiveDestination(dest)}
              >
                <div className="relative flex flex-col items-center">
                  
                  {/* Pin Node Circle */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-xl transition-all duration-300 ring-2 ${
                    isHovered 
                      ? 'bg-emerald-400 text-gray-950 ring-emerald-300 scale-125 z-40' 
                      : 'bg-gray-900 text-white ring-emerald-500/50 hover:scale-110'
                  }`}>
                    <MapPin className="w-4 h-4 text-emerald-400 group-hover:text-gray-950" />
                  </div>

                  {/* Pin Tag Label */}
                  <div className="mt-1 flex items-center space-x-1 px-2 py-0.5 rounded-full bg-black/80 text-[10px] font-semibold text-white border border-white/10 backdrop-blur-md shadow-lg">
                    <span className="text-emerald-400 font-mono">{dest.matchScore}%</span>
                    <span className="max-w-[90px] truncate">{dest.title.split(' ')[0]}</span>
                  </div>

                  {/* Hover Floating Card Tooltip */}
                  {isHovered && (
                    <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-64 glass-modal rounded-2xl p-3 border border-white/20 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
                      <div className="relative h-28 w-full rounded-xl overflow-hidden mb-2.5">
                        <img src={dest.heroImage} alt={dest.title} className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-gray-950 text-[10px] font-bold">
                          {dest.matchScore}% Match
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-gray-400">
                          <span className="text-emerald-300 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {hubTravel?.formatted}
                          </span>
                          <span className="flex items-center gap-1 text-amber-400">
                            <Star className="w-3 h-3 fill-current" /> {dest.rating}
                          </span>
                        </div>

                        <h4 className="font-bold text-white text-xs leading-snug line-clamp-1">{dest.title}</h4>
                        <p className="text-[11px] text-gray-300 line-clamp-1">{dest.tagline}</p>
                      </div>

                      <button className="mt-2.5 w-full py-1.5 rounded-xl bg-emerald-500 text-gray-950 font-bold text-xs flex items-center justify-center space-x-1 hover:bg-emerald-400 transition-all">
                        <span>Explore Itinerary</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                </div>
              </div>
            );
          })}

        </div>

      </div>
    </div>
  );
};
