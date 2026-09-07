import React from 'react';
import { 
  MapPin, 
  Clock, 
  Plus, 
  Utensils, 
  Trees, 
  Palette, 
  Flame, 
  Compass, 
  Sparkles 
} from 'lucide-react';
import type { ActivityItem, Destination } from '../../../types';
import { TimeMachineScrubber } from './TimeMachineScrubber';
import { useTrip } from '../../../hooks/useTrip';

interface ItineraryTimelineProps {
  dest: Destination;
  enabledActivityIds: string[];
  timeStepIndex: number;
  setTimeStepIndex: (index: number) => void;
  onOpenAddModal: () => void;
}

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({
  dest,
  enabledActivityIds,
  timeStepIndex,
  setTimeStepIndex,
  onOpenAddModal,
}) => {
  const { toggleActivity, formatCurrency } = useTrip();

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

  return (
    <div className="space-y-6">
      <TimeMachineScrubber
        itinerary={dest.itinerary}
        timeStepIndex={timeStepIndex}
        onSelectIndex={setTimeStepIndex}
      />

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>Check/uncheck items to customize your weekend schedule:</span>
        <button
          onClick={onOpenAddModal}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold hover:bg-emerald-500 hover:text-gray-950 transition-all border border-emerald-500/30"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Activity</span>
        </button>
      </div>

      <div className="space-y-4 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-white/10">
        {dest.itinerary.map((item: ActivityItem, idx: number) => {
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
              <div
                className={`absolute -left-10 top-5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelectedInSlider
                    ? 'bg-amber-400 border-amber-300 ring-4 ring-amber-400/30 scale-125'
                    : isEnabled
                    ? 'bg-emerald-500 border-emerald-400 shadow-md shadow-emerald-500/50'
                    : 'bg-gray-800 border-gray-600'
                }`}
              >
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
  );
};
