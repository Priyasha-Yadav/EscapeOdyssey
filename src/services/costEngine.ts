import type { BudgetTier, CurrencyCode, Destination } from '../types';
import { CURRENCY_OPTIONS } from '../data/destinations';

export interface BudgetModifiers {
  accommodation?: BudgetTier;
  dining?: BudgetTier;
}

/**
 * Computes destination cost per person based on active budget tier modifiers.
 */
export function getComputedCost(dest: Destination, modifier?: BudgetModifiers): number {
  let multiplier = 1.0;
  if (modifier) {
    if (modifier.accommodation === 'budget') multiplier -= 0.25;
    if (modifier.accommodation === 'luxury') multiplier += 0.35;
    if (modifier.dining === 'budget') multiplier -= 0.15;
    if (modifier.dining === 'luxury') multiplier += 0.25;
  }
  return Math.round(dest.baseCostPerPerson * multiplier);
}

/**
 * Formats a USD amount into the target currency with localized formatting.
 */
export function formatCurrency(amountUSD: number, currencyCode: CurrencyCode): string {
  const curr = CURRENCY_OPTIONS[currencyCode] || CURRENCY_OPTIONS.USD;
  const converted = Math.round(amountUSD * curr.rate);
  return `${curr.symbol}${converted.toLocaleString()}`;
}
