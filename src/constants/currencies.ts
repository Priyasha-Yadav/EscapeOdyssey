import type { CurrencyOption } from '../types';

export const CURRENCY_OPTIONS: Record<string, CurrencyOption> = {
  USD: { code: 'USD', symbol: '$', rate: 1.0, label: 'USD ($)' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92, label: 'EUR (€)' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79, label: 'GBP (£)' },
  JPY: { code: 'JPY', symbol: '¥', rate: 148.5, label: 'JPY (¥)' },
  INR: { code: 'INR', symbol: '₹', rate: 83.2, label: 'INR (₹)' },
};
