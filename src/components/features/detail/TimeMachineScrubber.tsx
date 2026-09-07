import React from 'react';
import { Clock } from 'lucide-react';
import type { ActivityItem } from '../../../types';

interface TimeMachineScrubberProps {
  itinerary: ActivityItem[];
  timeStepIndex: number;
  onSelectIndex: (index: number) => void;
}

export const TimeMachineScrubber: React.FC<TimeMachineScrubberProps> = ({
  itinerary,
  timeStepIndex,
  onSelectIndex,
}) => {
  const currentTimeItem = itinerary[timeStepIndex] || itinerary[0];

  if (!currentTimeItem) return null;

  return (
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
        max={Math.max(0, itinerary.length - 1)}
        value={timeStepIndex}
        onChange={(e) => onSelectIndex(Number(e.target.value))}
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
  );
};
