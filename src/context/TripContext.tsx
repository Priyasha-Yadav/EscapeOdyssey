import React, { createContext, useState, useEffect, useMemo } from 'react';
import { DESTINATIONS } from '../data/destinations';
import type { ActivityItem, BudgetTier, Destination, FilterState, MoodTag, QuizAnswer, ThemeMode } from '../types';
import { sound } from '../utils/sound';
import { DEFAULT_FILTERS, STORAGE_KEYS } from '../constants/app';
import { calculateMatchScore, getQuizRecommendation } from '../services/matchEngine';
import { getComputedCost, formatCurrency } from '../services/costEngine';
import { filterDestinations } from '../services/filterEngine';

export interface TripContextType {
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

export const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<FilterState>(() => {
    const local = localStorage.getItem(STORAGE_KEYS.FILTERS);
    return local ? JSON.parse(local) : DEFAULT_FILTERS;
  });

  const [savedIds, setSavedIds] = useState<string[]>(() => {
    const local = localStorage.getItem(STORAGE_KEYS.SAVED_DESTINATIONS);
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

    localStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAVED_DESTINATIONS, JSON.stringify(savedIds));
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

  const filteredDestinations = useMemo(() => {
    return filterDestinations(DESTINATIONS, filters, addedActivities);
  }, [filters, addedActivities]);

  const handleQuizComplete = (answers: QuizAnswer): Destination => {
    sound.playFanfare();
    return getQuizRecommendation(answers);
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
        getComputedCost: (dest) => getComputedCost(dest, budgetModifiers[dest.id]),
        formatCurrency: (amount) => formatCurrency(amount, filters.currency),
      }}
    >
      {children}
    </TripContext.Provider>
  );
};
