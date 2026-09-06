import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { TripProvider, useTrip } from './TripContext';

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <TripProvider>{children}</TripProvider>
);

describe('TripContext Integration Suite', () => {
  it('should provide default filters and hubs', () => {
    const { result } = renderHook(() => useTrip(), { wrapper });
    expect(result.current.filters.departureHub).toBe('SFO');
    expect(result.current.filters.currency).toBe('USD');
    expect(result.current.filteredDestinations.length).toBeGreaterThan(0);
  });

  it('should calculate match score correctly', () => {
    const { result } = renderHook(() => useTrip(), { wrapper });
    const dest = result.current.filteredDestinations[0];
    const score = result.current.calculateMatchScore(dest, ['coastal', 'unplug']);
    expect(score).toBeGreaterThanOrEqual(60);
    expect(score).toBeLessThanOrEqual(99);
  });

  it('should convert currency correctly', () => {
    const { result } = renderHook(() => useTrip(), { wrapper });
    const formattedUSD = result.current.formatCurrency(500);
    expect(formattedUSD).toBe('$500');

    act(() => {
      result.current.setFilters(prev => ({ ...prev, currency: 'EUR' }));
    });
    const formattedEUR = result.current.formatCurrency(500);
    expect(formattedEUR).toContain('€');
  });

  it('should toggle saving destinations in savedIds', () => {
    const { result } = renderHook(() => useTrip(), { wrapper });
    const initialSavedCount = result.current.savedIds.length;
    const isInitiallySaved = result.current.savedIds.includes('hakone');

    act(() => {
      result.current.toggleSaveDestination('hakone');
    });

    if (isInitiallySaved) {
      expect(result.current.savedIds.length).toBe(initialSavedCount - 1);
    } else {
      expect(result.current.savedIds.length).toBe(initialSavedCount + 1);
    }
  });
});
