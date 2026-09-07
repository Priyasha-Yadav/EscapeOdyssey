import React from 'react';
import { Lightbulb } from 'lucide-react';

interface InsiderTipsProps {
  tips: string[];
}

export const InsiderTips: React.FC<InsiderTipsProps> = ({ tips }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-white text-base">Curated Local Secrets & Logistics</h3>

      <div className="space-y-3">
        {tips.map((tip, idx) => (
          <div
            key={idx}
            className="glass-panel p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex items-start space-x-3"
          >
            <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-200 leading-relaxed font-normal">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
