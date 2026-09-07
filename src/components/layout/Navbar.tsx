import React, { useState } from 'react';
import { Compass, Sparkles, Bookmark, MapPin, ChevronDown, Volume2, VolumeX, Layers, Sun, Moon, Monitor } from 'lucide-react';
import { useTrip } from '../../hooks/useTrip';
import { CURRENCY_OPTIONS, TRAVEL_HUBS } from '../../data/destinations';
import type { CurrencyCode, ThemeMode } from '../../types';

interface NavbarProps {
  onOpenSavedDrawer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSavedDrawer }) => {
  const { filters, setFilters, savedIds, setQuizOpen, setCompareOpen, soundEnabled, setSoundEnabled, themeMode, setThemeMode } = useTrip();
  const [hubDropdownOpen, setHubDropdownOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const currentHub = TRAVEL_HUBS.find(h => h.id === filters.departureHub) || TRAVEL_HUBS[0];
  const currentCurrency = CURRENCY_OPTIONS[filters.currency] || CURRENCY_OPTIONS.USD;

  const getThemeIcon = (mode: ThemeMode) => {
    switch (mode) {
      case 'light': return <Sun className="w-3.5 h-3.5 text-amber-400" />;
      case 'dark': return <Moon className="w-3.5 h-3.5 text-indigo-400" />;
      case 'system': return <Monitor className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setFilters(prev => ({ ...prev, searchQuery: '', selectedMoods: [] }))}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-indigo-600 to-amber-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-white/20 animate-pulse-subtle">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl tracking-tight text-white">Escape<span className="gradient-emerald-indigo">Odyssey</span></span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">v3 Premium</span>
            </div>
            <p className="text-xs text-gray-400 font-medium">The 48-Hour Weekend Escape Engine</p>
          </div>
        </div>

        {/* Center: Departure Hub Pill & Currency & Theme Switcher */}
        <div className="hidden lg:flex items-center space-x-3">
          
          {/* Hub Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setHubDropdownOpen(!hubDropdownOpen);
                setCurrencyDropdownOpen(false);
                setThemeDropdownOpen(false);
              }}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-full glass-pill text-xs font-medium text-gray-200 hover:text-white hover:border-emerald-500/50 transition-all duration-200"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-gray-400">From:</span>
              <span className="font-semibold text-white">{currentHub.code}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${hubDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {hubDropdownOpen && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 glass-modal rounded-2xl shadow-2xl border border-white/10 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 py-1.5">Select Departure Hub</p>
                {TRAVEL_HUBS.map(hub => (
                  <button
                    key={hub.id}
                    onClick={() => {
                      setFilters(prev => ({ ...prev, departureHub: hub.id }));
                      setHubDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      filters.departureHub === hub.id
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>📍 {hub.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 font-mono text-gray-400">{hub.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Currency Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setCurrencyDropdownOpen(!currencyDropdownOpen);
                setHubDropdownOpen(false);
                setThemeDropdownOpen(false);
              }}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-full glass-pill text-xs font-semibold text-amber-400 hover:border-amber-500/50 transition-all font-mono"
            >
              <span>{currentCurrency.symbol}</span>
              <span>{currentCurrency.code}</span>
              <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${currencyDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {currencyDropdownOpen && (
              <div className="absolute top-full mt-2 right-0 w-36 glass-modal rounded-2xl shadow-2xl border border-white/10 p-1.5 z-50">
                {Object.values(CURRENCY_OPTIONS).map(curr => (
                  <button
                    key={curr.code}
                    onClick={() => {
                      setFilters(prev => ({ ...prev, currency: curr.code as CurrencyCode }));
                      setCurrencyDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      filters.currency === curr.code
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{curr.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Switcher (Light / Dark / System) */}
          <div className="relative">
            <button
              onClick={() => {
                setThemeDropdownOpen(!themeDropdownOpen);
                setHubDropdownOpen(false);
                setCurrencyDropdownOpen(false);
              }}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-full glass-pill text-xs font-semibold text-gray-200 hover:border-white/30 transition-all capitalize"
            >
              {getThemeIcon(themeMode)}
              <span className="capitalize">{themeMode}</span>
              <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${themeDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {themeDropdownOpen && (
              <div className="absolute top-full mt-2 right-0 w-36 glass-modal rounded-2xl shadow-2xl border border-white/10 p-1.5 z-50">
                {(['light', 'dark', 'system'] as ThemeMode[]).map(t => (
                  <button
                    key={t}
                    onClick={() => {
                      setThemeMode(t);
                      setThemeDropdownOpen(false);
                    }}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                      themeMode === t
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {getThemeIcon(t)}
                    <span>{t} Mode</span>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Actions: Audio, Compare, Quiz & Saved Trips */}
        <div className="flex items-center space-x-2.5">
          
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl glass-pill transition-all ${
              soundEnabled ? 'text-emerald-400 hover:text-emerald-300' : 'text-gray-500 hover:text-gray-300'
            }`}
            title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Compare Launcher Button */}
          {savedIds.length >= 2 && (
            <button
              onClick={() => setCompareOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-500 hover:text-gray-950 transition-all shadow-md"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Compare</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-400 text-gray-950 font-bold text-[10px]">
                {savedIds.length}
              </span>
            </button>
          )}

          {/* Quiz Button */}
          <button
            onClick={() => setQuizOpen(true)}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 text-white font-medium text-xs hover:opacity-95 transition-all shadow-md shadow-indigo-600/20 hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
            <span className="hidden sm:inline">Surprise Me</span>
            <span className="sm:hidden">Quiz</span>
          </button>

          {/* Saved Drawer Button */}
          <button
            onClick={onOpenSavedDrawer}
            className="relative flex items-center space-x-2 px-3.5 py-2 rounded-xl glass-pill text-xs font-medium text-gray-200 hover:text-white hover:border-white/30 transition-all"
          >
            <Bookmark className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Saved</span>
            {savedIds.length > 0 && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-gray-950 font-bold text-[11px] ring-2 ring-emerald-950">
                {savedIds.length}
              </span>
            )}
          </button>

        </div>

      </div>
    </header>
  );
};
