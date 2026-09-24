import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string): string {
  const isINR = currency === 'INR';
  const locale = isINR ? 'en-IN' : 'en-US';
  
  if (isINR) {
    if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(2)}Cr`;
    if (amount >= 100_000) return `₹${(amount / 100_000).toFixed(2)}L`;
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: amount >= 1_000_000 ? 1 : 0,
    notation: amount >= 1_000_000 ? 'compact' : 'standard',
  }).format(amount);
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: amount >= 1_000_000 ? 1 : 0,
    notation: amount >= 1_000_000 ? 'compact' : 'standard',
  }).format(amount);
}

export function formatINR(amount: number): string {
  if (amount >= 10_000_000) { // 1 Cr+
    return `₹${(amount / 10_000_000).toFixed(2)}Cr`;
  }
  if (amount >= 100_000) { // 1 L+
    return `₹${(amount / 100_000).toFixed(2)}L`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatINRFull(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateLong(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export const DEPARTMENTS = [
  'Engineering', 'HR', 'Sales', 'Finance', 'Marketing',
  'Operations', 'Legal', 'Product', 'Customer Success', 'Data Science',
] as const;

export const JOB_LEVELS = [
  'Junior', 'Mid', 'Senior', 'Lead', 'Principal', 'Director', 'VP',
] as const;

export const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract'] as const;

export const COUNTRIES = [
  'United States', 'India', 'United Kingdom', 'Germany', 'Canada',
  'Australia', 'Singapore', 'Brazil', 'France', 'Japan',
] as const;

export const PAYMENT_MODES = ['Bank Transfer', 'Cash', 'Cheque'] as const;

export const LEVEL_COLORS: Record<string, string> = {
  Junior: 'bg-blue-100 text-blue-700',
  Mid: 'bg-green-100 text-green-700',
  Senior: 'bg-amber-100 text-amber-700',
  Lead: 'bg-orange-100 text-orange-700',
  Principal: 'bg-purple-100 text-purple-700',
  Director: 'bg-red-100 text-red-700',
  VP: 'bg-rose-100 text-rose-700',
};

export const STATUS_COLORS: Record<string, string> = {
  Active: 'bg-emerald-100 text-emerald-700',
  Inactive: 'bg-slate-100 text-slate-500',
};
