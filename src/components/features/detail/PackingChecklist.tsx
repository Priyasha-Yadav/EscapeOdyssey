import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { Destination, PackingItem } from '../../../types';

interface PackingChecklistProps {
  dest: Destination;
  items: PackingItem[];
  onToggleItem: (id: string) => void;
}

export const PackingChecklist: React.FC<PackingChecklistProps> = ({
  dest,
  items,
  onToggleItem,
}) => {
  const packedCount = items.filter((p) => p.checked).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-white text-base">Essential Weekend Packing List</h3>
          <p className="text-xs text-gray-400">
            Tailored items for {dest.weather.condition} in {dest.title}
          </p>
        </div>

        <div className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          {packedCount} / {items.length} Packed
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onToggleItem(item.id)}
            className={`flex items-center space-x-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
              item.checked
                ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                : 'glass-panel border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <CheckCircle2
              className={`w-5 h-5 ${
                item.checked ? 'text-emerald-400 fill-emerald-400/20' : 'text-gray-600'
              }`}
            />
            <span className={`text-xs font-medium ${item.checked ? 'line-through text-gray-400' : ''}`}>
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
