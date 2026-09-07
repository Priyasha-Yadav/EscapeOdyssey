import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { ActivityCategory } from '../../../types';
import { validateCustomActivityInput } from '../../../utils/security';
import { useTrip } from '../../../hooks/useTrip';

interface AddActivityModalProps {
  destId: string;
  destTitle: string;
  onClose: () => void;
}

export const AddActivityModal: React.FC<AddActivityModalProps> = ({
  destId,
  destTitle,
  onClose,
}) => {
  const { addCustomActivity } = useTrip();
  const [newTitle, setNewTitle] = useState('');
  const [newCost, setNewCost] = useState(35);
  const [newPeriod, setNewPeriod] = useState<
    | 'Friday Night'
    | 'Saturday Morning'
    | 'Saturday Afternoon'
    | 'Saturday Evening'
    | 'Sunday Morning'
    | 'Sunday Afternoon'
  >('Saturday Afternoon');
  const [newCategory, setNewCategory] = useState<ActivityCategory>('hidden_gem');
  const [formError, setFormError] = useState('');

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    const val = validateCustomActivityInput(newTitle, newCost);

    if (!val.isValid) {
      setFormError(val.errors[0] || 'Invalid input.');
      return;
    }

    setFormError('');
    addCustomActivity(destId, {
      title: val.sanitizedTitle,
      period: newPeriod,
      timeSlot: `${newPeriod.split(' ')[0]} 2:00 PM`,
      description: 'Custom activity created for your customized getaway timeline.',
      category: newCategory,
      duration: '1.5 hours',
      estimatedCost: val.sanitizedCost,
      locationName: destTitle,
    });
    setNewTitle('');
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-md glass-modal rounded-3xl p-6 border border-white/20 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-white text-sm">Add Custom Activity to 48h Timeline</h4>
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close dialog">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleCreateActivity} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">Activity Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Sunset Coffee at Secret Overlook"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">Time Period</label>
              <select
                value={newPeriod}
                onChange={(e) => setNewPeriod(e.target.value as any)}
                className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="Friday Night">Friday Night</option>
                <option value="Saturday Morning">Saturday Morning</option>
                <option value="Saturday Afternoon">Saturday Afternoon</option>
                <option value="Saturday Evening">Saturday Evening</option>
                <option value="Sunday Morning">Sunday Morning</option>
                <option value="Sunday Afternoon">Sunday Afternoon</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="dining">Dining 🍷</option>
                <option value="nature">Nature 🌲</option>
                <option value="culture">Culture 🎨</option>
                <option value="wellness">Wellness ♨️</option>
                <option value="adventure">Adventure 🧗</option>
                <option value="hidden_gem">Hidden Gem 💎</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">Est. Cost (USD)</label>
            <input
              type="number"
              min="0"
              value={newCost}
              onChange={(e) => setNewCost(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
            />
          </div>

          {formError && <p className="text-xs text-rose-400 font-medium">{formError}</p>}

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-500 text-gray-950 font-bold text-xs hover:bg-emerald-400 transition-all"
            >
              Save to Timeline
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
