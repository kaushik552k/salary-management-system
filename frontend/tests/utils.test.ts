import { formatCurrency, formatUSD, formatDate, cn } from '../lib/utils';

describe('utils', () => {
  describe('cn', () => {
    it('merges tailwind classes', () => {
      expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
    });
  });

  describe('formatCurrency', () => {
    it('formats USD correctly', () => {
      // Due to jsdom locales, we might just check that the currency symbol is present or the general format is ok
      // For en-US, 1000 -> "$1,000"
      expect(formatCurrency(1000, 'USD')).toMatch(/\$1,000/);
    });
    
    it('formats INR correctly', () => {
      // "₹1,000"
      expect(formatCurrency(1000, 'INR')).toMatch(/₹1,000/);
    });
  });

  describe('formatUSD', () => {
    it('formats large numbers compactly', () => {
      expect(formatUSD(1_500_000)).toMatch(/\$1.5M/);
    });
  });

  describe('formatDate', () => {
    it('formats ISO dates correctly', () => {
      expect(formatDate('2023-10-05T00:00:00Z')).toBe('5 Oct 2023');
    });
  });
});
