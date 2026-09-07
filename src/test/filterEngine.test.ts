import { describe, it, expect } from 'vitest';
import { filterDestinations } from '../services/filterEngine';
import { DESTINATIONS } from '../data/destinations';
import { DEFAULT_FILTERS } from '../constants/app';

describe('filterEngine', () => {
  it('returns destinations under max travel time for SFO', () => {
    const results = filterDestinations(DESTINATIONS, {
      ...DEFAULT_FILTERS,
      departureHub: 'SFO',
      maxTravelMinutes: 180,
    });
    results.forEach((dest) => {
      const hubData = dest.hubDistance['SFO'];
      if (hubData) {
        expect(hubData.durationMinutes).toBeLessThanOrEqual(180);
      }
    });
  });

  it('filters destinations by search query', () => {
    const results = filterDestinations(DESTINATIONS, {
      ...DEFAULT_FILTERS,
      searchQuery: 'Napa',
    });
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((d) => d.title.includes('Napa'))).toBe(true);
  });

  it('filters destinations by selected mood tags', () => {
    const results = filterDestinations(DESTINATIONS, {
      ...DEFAULT_FILTERS,
      selectedMoods: ['coastal'],
    });
    results.forEach((dest) => {
      expect(dest.moods).toContain('coastal');
    });
  });
});
