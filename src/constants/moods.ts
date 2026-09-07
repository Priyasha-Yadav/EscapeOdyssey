import type { MoodOption } from '../types';

export const MOOD_OPTIONS: MoodOption[] = [
  { id: 'alpine', label: 'Alpine Air', icon: 'Mountain', description: 'Pine breezes, majestic mountain views, and cozy hearth fire warmth.', gradient: 'from-emerald-500 to-teal-700' },
  { id: 'coastal', label: 'Coastal Drift', icon: 'Waves', description: 'Ocean soundscapes, dramatic cliffs, and salty sea breezes.', gradient: 'from-cyan-500 to-blue-700' },
  { id: 'foodie', label: 'Food & Wine', icon: 'Wine', description: 'Michelin bistros, vineyard tours, and farm-to-table culinary bliss.', gradient: 'from-amber-500 to-red-600' },
  { id: 'unplug', label: 'Unplug & Spa', icon: 'Sparkles', description: 'Thermal hot springs, forest baths, and digital detox sanctuary.', gradient: 'from-purple-500 to-indigo-700' },
  { id: 'urban', label: 'Urban Pulse', icon: 'Building2', description: 'Boutique art galleries, hidden cocktail dens, and skyline dining.', gradient: 'from-violet-500 to-fuchsia-700' },
  { id: 'adventure', label: 'Wild Trail', icon: 'Compass', description: 'Kayaking, sunrise ridges, and adrenaline outdoor pursuits.', gradient: 'from-lime-500 to-emerald-700' },
  { id: 'romantic', label: 'Romance & Hideaway', icon: 'Heart', description: 'Intimate candlelit dinners, boutique cottages, and sunset viewpoints.', gradient: 'from-rose-500 to-pink-700' },
  { id: 'stargazing', label: 'Dark Sky & Stars', icon: 'Moon', description: 'Clear night skies, cozy stargazing, and pristine wilderness cabins.', gradient: 'from-indigo-600 to-slate-900' },
];
