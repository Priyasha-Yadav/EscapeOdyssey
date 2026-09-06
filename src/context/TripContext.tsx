import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { DESTINATIONS, CURRENCY_OPTIONS } from '../data/destinations';
import type { ActivityItem, BudgetTier, Destination, FilterState, MoodTag, QuizAnswer, ThemeMode } from '../types';
import { sound } from '../utils/sound';
import { sanitizeInput } from '../utils/security';

interface TripContextType {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  filteredDestinations: Destination[];
  activeDestination: Destination | null;
  setActiveDestination: (dest: Destination | null) => void;
  savedIds: string[];
  toggleSaveDestination: (id: string) => void;
  quizOpen: boolean;
  setQuizOpen: (open: boolean) => void;
  compareOpen: boolean;
  setCompareOpen: (open: boolean) => void;
  shareDestination: Destination | null;
  setShareDestination: (dest: Destination | null) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  calculateMatchScore: (dest: Destination, moods: MoodTag[]) => number;
  handleQuizComplete: (answers: QuizAnswer) => Destination;
  customActivities: Record<string, string[]>;
  toggleActivity: (destId: string, activityId: string) => void;
  addCustomActivity: (destId: string, activity: Omit<ActivityItem, 'id'>) => void;
  budgetModifiers: Record<string, { accommodation: BudgetTier; dining: BudgetTier }>;
  setBudgetModifier: (destId: string, type: 'accommodation' | 'dining', tier: BudgetTier) => void;
  getComputedCost: (dest: Destination) => number;
  formatCurrency: (amountUSD: number) => string;
}

const DEFAULT_FILTERS: FilterState = {
  departureHub: 'SFO',
  maxTravelMinutes: 300,
  selectedMoods: [],
  budgetTier: 'comfortable',
  searchQuery: '',
  viewMode: 'grid',
  currency: 'USD',
  theme: 'dark',
};

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<FilterState>(() => {
    const local = localStorage.getItem('escape_odyssey_filters_v3');
    return local ? JSON.parse(local) : DEFAULT_FILTERS;
  });

  const [savedIds, setSavedIds] = useState<string[]>(() => {
    const local = localStorage.getItem('escape_odyssey_saved_v3');
    return local ? JSON.parse(local) : ['big-sur', 'napa-valley'];
  });

  const [activeDestination, setActiveDestination] = useState<Destination | null>(null);
  const [quizOpen, setQuizOpen] = useState<boolean>(false);
  const [compareOpen, setCompareOpen] = useState<boolean>(false);
  const [shareDestination, setShareDestination] = useState<Destination | null>(null);
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);

  // Dynamic user added activities & modifiers
  const [addedActivities, setAddedActivities] = useState<Record<string, ActivityItem[]>>({});
  const [customActivities, setCustomActivities] = useState<Record<string, string[]>>({});
  const [budgetModifiers, setBudgetModifiers] = useState<Record<string, { accommodation: BudgetTier; dining: BudgetTier }>>({});

  // Theme calculation
  const setThemeMode = (mode: ThemeMode) => {
    sound.playClick();
    setFilters(prev => ({ ...prev, theme: mode }));
  };

  useEffect(() => {
    const currentTheme = filters.theme || 'dark';
    const isSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    let effectiveTheme = 'dark';
    if (currentTheme === 'light') effectiveTheme = 'light';
    else if (currentTheme === 'dark') effectiveTheme = 'dark';
    else if (currentTheme === 'system') effectiveTheme = isSystemDark ? 'dark' : 'light';

    if (effectiveTheme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }

    localStorage.setItem('escape_odyssey_filters_v3', JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    localStorage.setItem('escape_odyssey_saved_v3', JSON.stringify(savedIds));
  }, [savedIds]);

  const setSoundEnabled = (enabled: boolean) => {
    sound.enabled = enabled;
    setSoundEnabledState(enabled);
  };

  const toggleSaveDestination = (id: string) => {
    sound.playPop();
    setSavedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleActivity = (destId: string, activityId: string) => {
    sound.playClick();
    setCustomActivities(prev => {
      const destObj = DESTINATIONS.find(d => d.id === destId);
      const allItems = [...(destObj?.itinerary || []), ...(addedActivities[destId] || [])];
      const currentList = prev[destId] || allItems.map(a => a.id);
      const exists = currentList.includes(activityId);
      const updated = exists ? currentList.filter(id => id !== activityId) : [...currentList, activityId];
      return { ...prev, [destId]: updated };
    });
  };

  const addCustomActivity = (destId: string, activityInput: Omit<ActivityItem, 'id'>) => {
    sound.playPop();
    const newId = `custom-${Date.now()}`;
    const newActivity: ActivityItem = { ...activityInput, id: newId };
    
    setAddedActivities(prev => ({
      ...prev,
      [destId]: [...(prev[destId] || []), newActivity]
    }));

    setCustomActivities(prev => ({
      ...prev,
      [destId]: [...(prev[destId] || DESTINATIONS.find(d => d.id === destId)?.itinerary.map(a => a.id) || []), newId]
    }));
  };

  const setBudgetModifier = (destId: string, type: 'accommodation' | 'dining', tier: BudgetTier) => {
    sound.playClick();
    setBudgetModifiers(prev => ({
      ...prev,
      [destId]: {
        accommodation: prev[destId]?.accommodation || 'comfortable',
        dining: prev[destId]?.dining || 'comfortable',
        [type]: tier,
      }
    }));
  };

  const calculateMatchScore = (dest: Destination, moods: MoodTag[]): number => {
    let score = 75;
    if (moods.length === 0) {
      score += 15;
    } else {
      const matched = dest.moods.filter(m => moods.includes(m));
      const ratio = matched.length / moods.length;
      score += Math.round(ratio * 24);
    }
    if (dest.rating >= 4.9) score += 4;
    return Math.min(99, Math.max(60, score));
  };

  const getComputedCost = (dest: Destination): number => {
    const mod = budgetModifiers[dest.id];
    let multiplier = 1.0;
    if (mod) {
      if (mod.accommodation === 'budget') multiplier -= 0.25;
      if (mod.accommodation === 'luxury') multiplier += 0.35;
      if (mod.dining === 'budget') multiplier -= 0.15;
      if (mod.dining === 'luxury') multiplier += 0.25;
    }
    return Math.round(dest.baseCostPerPerson * multiplier);
  };

  const formatCurrency = (amountUSD: number): string => {
    const curr = CURRENCY_OPTIONS[filters.currency] || CURRENCY_OPTIONS.USD;
    const converted = Math.round(amountUSD * curr.rate);
    return `${curr.symbol}${converted.toLocaleString()}`;
  };

  const filteredDestinations = useMemo(() => {
    return DESTINATIONS.map(dest => {
      const extraItems = addedActivities[dest.id] || [];
      const mergedDest = {
        ...dest,
        itinerary: [...dest.itinerary, ...extraItems]
      };
      const matchScore = calculateMatchScore(mergedDest, filters.selectedMoods);
      return { ...mergedDest, matchScore };
    }).filter(dest => {
      const hubData = dest.hubDistance[filters.departureHub];
      if (hubData && hubData.durationMinutes > filters.maxTravelMinutes) {
        return false;
      }
      if (filters.searchQuery.trim() !== '') {
        const query = sanitizeInput(filters.searchQuery, 100).toLowerCase();
        const matchTitle = dest.title.toLowerCase().includes(query);
        const matchTagline = dest.tagline.toLowerCase().includes(query);
        const matchVibe = dest.vibeSummary.toLowerCase().includes(query);
        if (!matchTitle && !matchTagline && !matchVibe) return false;
      }
      if (filters.selectedMoods.length > 0) {
        const matchesAnyMood = dest.moods.some(m => filters.selectedMoods.includes(m));
        if (!matchesAnyMood) return false;
      }
      return true;
    }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }, [filters, addedActivities]);

  const handleQuizComplete = (answers: QuizAnswer): Destination => {
    sound.playFanfare();
    let targetMood: MoodTag = 'alpine';
    if (answers.environment === 'beach') targetMood = 'coastal';
    else if (answers.environment === 'mountains') targetMood = 'alpine';
    else if (answers.environment === 'city') targetMood = 'urban';
    else if (answers.pace === 'food_centric') targetMood = 'foodie';
    else if (answers.stressLevel && answers.stressLevel > 6) targetMood = 'unplug';

    return DESTINATIONS.find(d => d.moods.includes(targetMood)) || DESTINATIONS[0];
  };

  return (
    <TripContext.Provider
      value={{
        filters,
        setFilters,
        themeMode: filters.theme || 'dark',
        setThemeMode,
        filteredDestinations,
        activeDestination,
        setActiveDestination: (dest) => {
          if (dest) sound.playPop();
          setActiveDestination(dest);
        },
        savedIds,
        toggleSaveDestination,
        quizOpen,
        setQuizOpen: (open) => {
          if (open) sound.playPop();
          setQuizOpen(open);
        },
        compareOpen,
        setCompareOpen: (open) => {
          if (open) sound.playPop();
          setCompareOpen(open);
        },
        shareDestination,
        setShareDestination: (dest) => {
          if (dest) sound.playPop();
          setShareDestination(dest);
        },
        soundEnabled,
        setSoundEnabled,
        calculateMatchScore,
        handleQuizComplete,
        customActivities,
        toggleActivity,
        addCustomActivity,
        budgetModifiers,
        setBudgetModifier,
        getComputedCost,
        formatCurrency,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
