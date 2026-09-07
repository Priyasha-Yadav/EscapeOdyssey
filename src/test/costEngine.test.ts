import { describe, it, expect } from 'vitest';
import { getComputedCost, formatCurrency } from '../services/costEngine';
import { DESTINATIONS } from '../data/destinations';

describe('costEngine', () => {
  const sampleDest = DESTINATIONS[0];

  it('computes base cost without modifiers correctly', () => {
    const cost = getComputedCost(sampleDest);
    expect(cost).toBe(sampleDest.baseCostPerPerson);
  });

  it('applies budget accommodation tier reduction', () => {
    const cost = getComputedCost(sampleDest, { accommodation: 'budget' });
    expect(cost).toBeLessThan(sampleDest.baseCostPerPerson);
  });

  it('applies luxury accommodation and dining tier increase', () => {
    const cost = getComputedCost(sampleDest, { accommodation: 'luxury', dining: 'luxury' });
    expect(cost).toBeGreaterThan(sampleDest.baseCostPerPerson);
  });

  it('formats currency correctly for USD', () => {
    const formatted = formatCurrency(450, 'USD');
    expect(formatted).toBe('$450');
  });

  it('formats currency correctly for EUR', () => {
    const formatted = formatCurrency(100, 'EUR');
    expect(formatted).toContain('€');
  });
});
