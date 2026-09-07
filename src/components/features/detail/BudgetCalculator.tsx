import React from 'react';
import type { BudgetTier, Destination } from '../../../types';
import { useTrip } from '../../../hooks/useTrip';
import { BudgetDonutChart } from './BudgetDonutChart';

interface BudgetCalculatorProps {
  dest: Destination;
  computedCostUSD: number;
  currentMod: { accommodation: BudgetTier; dining: BudgetTier };
  activeItineraryCount: number;
}

export const BudgetCalculator: React.FC<BudgetCalculatorProps> = ({
  dest,
  computedCostUSD,
  currentMod,
  activeItineraryCount,
}) => {
  const { setBudgetModifier } = useTrip();

  return (
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

      <BudgetDonutChart
        computedCostUSD={computedCostUSD}
        currentMod={currentMod}
        activeItineraryCount={activeItineraryCount}
      />
    </div>
  );
};
