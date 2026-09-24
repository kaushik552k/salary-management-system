import { z } from 'zod';

export const DEPARTMENTS = [
  'Engineering',
  'HR',
  'Sales',
  'Finance',
  'Marketing',
  'Operations',
  'Legal',
  'Product',
  'Customer Success',
  'Data Science',
] as const;

export const JOB_LEVELS = [
  'Junior',
  'Mid',
  'Senior',
  'Lead',
  'Principal',
  'Director',
  'VP',
] as const;

export const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract'] as const;

export const STATUSES = ['Active', 'Inactive'] as const;

export const COUNTRIES = [
  'United States',
  'India',
  'United Kingdom',
  'Germany',
  'Canada',
  'Australia',
  'Singapore',
  'Brazil',
  'France',
  'Japan',
] as const;

export const CURRENCIES: Record<string, string> = {
  'United States': 'USD',
  India: 'INR',
  'United Kingdom': 'GBP',
  Germany: 'EUR',
  Canada: 'CAD',
  Australia: 'AUD',
  Singapore: 'SGD',
  Brazil: 'BRL',
  France: 'EUR',
  Japan: 'JPY',
};

const defaultUsdRates: Record<string, number> = {
  USD: 1,
  INR: 0.012,
  GBP: 1.27,
  EUR: 1.09,
  CAD: 0.74,
  AUD: 0.65,
  SGD: 0.75,
  BRL: 0.20,
  JPY: 0.0067,
};

// Fixed exchange rates to USD (kept for backward-compat in tests or fallback)
export const USD_EXCHANGE_RATES: Record<string, number> = (() => {
  if (process.env.EXCHANGE_RATES_USD) {
    try {
      return JSON.parse(process.env.EXCHANGE_RATES_USD);
    } catch (e) {
      console.warn('Failed to parse EXCHANGE_RATES_USD env var, using defaults');
    }
  }
  return defaultUsdRates;
})();

const defaultInrRates: Record<string, number> = {
  USD: 83.5,
  INR: 1,
  GBP: 106.8,
  EUR: 91.2,
  CAD: 61.5,
  AUD: 54.8,
  SGD: 62.3,
  BRL: 16.9,
  JPY: 0.56,
};

// Fixed exchange rates to INR (for analytics)
export const INR_EXCHANGE_RATES: Record<string, number> = (() => {
  if (process.env.EXCHANGE_RATES_INR) {
    try {
      return JSON.parse(process.env.EXCHANGE_RATES_INR);
    } catch (e) {
      console.warn('Failed to parse EXCHANGE_RATES_INR env var, using defaults');
    }
  }
  return defaultInrRates;
})();

export const PAYMENT_MODES = ['Bank Transfer', 'Cash', 'Cheque'] as const;

// ─── Zod Schemas ────────────────────────────────────────────────────────────

export const createEmployeeSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address'),
  department: z.enum(DEPARTMENTS),
  jobTitle: z.string().min(1, 'Job title is required').max(150),
  jobLevel: z.enum(JOB_LEVELS),
  employmentType: z.enum(EMPLOYMENT_TYPES),
  country: z.enum(COUNTRIES),
  baseSalary: z.number().positive('Salary must be positive'),
  bonus: z.number().nonnegative().optional(),
  joiningDate: z.string().datetime({ offset: true }).or(z.string().date()),
  status: z.enum(STATUSES).optional().default('Active'),

  // Personal info (all optional)
  dateOfBirth: z.string().optional().nullable(),
  fatherName: z.string().optional().nullable(),
  panNumber: z.string().optional().nullable(),
  mobile: z.string().optional().nullable(),
  address: z.string().optional().nullable(),

  // Statutory (optional, with defaults)
  pfAccountNumber: z.string().optional().nullable(),
  epfPercent: z.number().min(0).max(100).optional(),
  esiPercent: z.number().min(0).max(100).optional(),
  professionalTax: z.number().min(0).optional(),
  tdsPercent: z.number().min(0).max(100).optional(),

  // Allowances
  allowances: z.number().min(0).optional(),

  // Bank / payment
  bankName: z.string().optional().nullable(),
  bankAccountNumber: z.string().optional().nullable(),
  paymentMode: z.enum(PAYMENT_MODES).optional(),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

export const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(200).optional().default(50),
  search: z.string().optional(),
  department: z.string().optional(),
  country: z.string().optional(),
  jobLevel: z.string().optional(),
  employmentType: z.string().optional(),
  status: z.string().optional(),
  sortBy: z
    .enum(['firstName', 'lastName', 'baseSalary', 'joiningDate', 'department', 'country', 'jobLevel'])
    .optional()
    .default('firstName'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
export type ListQueryInput = z.infer<typeof listQuerySchema>;
