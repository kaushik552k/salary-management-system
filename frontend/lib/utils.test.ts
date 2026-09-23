import { formatCurrency, formatUSD, formatINR, formatINRFull, formatDate, formatDateLong, cn } from './utils';

describe('utils', () => {
  describe('cn', () => {
    it('merges class names correctly', () => {
      expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
      expect(cn('px-2 py-1', { 'opacity-50': true })).toBe('px-2 py-1 opacity-50');
      expect(cn('p-4', 'p-8')).toBe('p-8');
    });
  });

  describe('formatters', () => {
    it('formatCurrency', () => {
      expect(formatCurrency(1234, 'USD')).toMatch(/\$1,234/);
      expect(formatCurrency(1234, 'EUR')).toMatch(/€1,234/);
    });

    it('formatUSD', () => {
      expect(formatUSD(1234)).toMatch(/\$1,234/);
      expect(formatUSD(1500000)).toMatch(/\$1.5M/);
    });

    it('formatINR', () => {
      expect(formatINR(5000)).toMatch(/₹5,000/);
      expect(formatINR(150000)).toBe('₹1.50L');
      expect(formatINR(15000000)).toBe('₹1.50Cr');
    });

    it('formatINRFull', () => {
      expect(formatINRFull(150000)).toMatch(/₹1,50,000/);
    });

    it('formatDate', () => {
      expect(formatDate('2023-01-15T00:00:00Z')).toMatch(/15 Jan 2023/);
    });

    it('formatDateLong', () => {
      expect(formatDateLong('2023-01-15T00:00:00Z')).toMatch(/15 January 2023/);
    });
  });
});
