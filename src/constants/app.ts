import type { FilterState } from '../types';

export const APP_NAME = 'ESCAPE — Weekend Trip Planner';

export const STORAGE_KEYS = {
  FILTERS: 'escape_odyssey_filters_v3',
  SAVED_DESTINATIONS: 'escape_odyssey_saved_v3',
  SOUND_MUTED: 'escape_odyssey_muted_v3',
} as const;

export const DEFAULT_FILTERS: FilterState = {
  departureHub: 'SFO',
  maxTravelMinutes: 300,
  selectedMoods: [],
  budgetTier: 'comfortable',
  searchQuery: '',
  viewMode: 'grid',
  currency: 'USD',
  theme: 'dark',
};

export const INITIAL_SAVED_IDS = ['big-sur', 'napa-valley'];
