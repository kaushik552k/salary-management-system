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

// Fixed exchange rates to USD (for analytics normalization)
export const USD_EXCHANGE_RATES: Record<string, number> = {
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
