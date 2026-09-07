import React from 'react';
import type { BudgetTier } from '../../../types';
import { useTrip } from '../../../hooks/useTrip';

interface BudgetDonutChartProps {
  computedCostUSD: number;
  currentMod: { accommodation: BudgetTier; dining: BudgetTier };
  activeItineraryCount: number;
}

export const BudgetDonutChart: React.FC<BudgetDonutChartProps> = ({
  computedCostUSD,
  currentMod,
  activeItineraryCount,
}) => {
  const { formatCurrency } = useTrip();

  return (
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
              <span>Activities ({activeItineraryCount} items)</span>
            </div>
            <span className="font-mono text-white font-bold">{formatCurrency(computedCostUSD * 0.15)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
