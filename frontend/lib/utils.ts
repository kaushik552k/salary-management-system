import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    notation: amount >= 1_000_000 ? 'compact' : 'standard',
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
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

export const LEVEL_COLORS: Record<string, string> = {
  Junior: 'bg-blue-100 text-blue-800',
  Mid: 'bg-green-100 text-green-800',
  Senior: 'bg-yellow-100 text-yellow-800',
  Lead: 'bg-orange-100 text-orange-800',
  Principal: 'bg-purple-100 text-purple-800',
  Director: 'bg-red-100 text-red-800',
  VP: 'bg-rose-100 text-rose-800',
};

export const STATUS_COLORS: Record<string, string> = {
  Active: 'bg-emerald-100 text-emerald-800',
  Inactive: 'bg-gray-100 text-gray-600',
};
