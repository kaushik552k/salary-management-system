const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

// ─── Types ───────────────────────────────────────────────────────────────────

export type Department =
  | 'Engineering' | 'HR' | 'Sales' | 'Finance' | 'Marketing'
  | 'Operations' | 'Legal' | 'Product' | 'Customer Success' | 'Data Science';

export type JobLevel = 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Principal' | 'Director' | 'VP';
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract';
export type EmployeeStatus = 'Active' | 'Inactive';
export type PaymentMode = 'Bank Transfer' | 'Cash' | 'Cheque';

export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: Department;
  jobTitle: string;
  jobLevel: JobLevel;
  employmentType: EmploymentType;
  country: string;
  currency: string;
  baseSalary: number;
  bonus: number | null;
  joiningDate: string;
  status: EmployeeStatus;
  createdAt: string;
  updatedAt: string;
  // New fields
  dateOfBirth?: string | null;
  fatherName?: string | null;
  panNumber?: string | null;
  mobile?: string | null;
  address?: string | null;
  pfAccountNumber?: string | null;
  epfPercent?: number;
  esiPercent?: number;
  professionalTax?: number;
  tdsPercent?: number;
  allowances?: number;
  bankName?: string | null;
  bankAccountNumber?: string | null;
  paymentMode?: PaymentMode;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface EmployeeListParams {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  country?: string;
  jobLevel?: string;
  employmentType?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateEmployeePayload {
  firstName: string;
  lastName: string;
  email: string;
  department: Department;
  jobTitle: string;
  jobLevel: JobLevel;
  employmentType: EmploymentType;
  country: string;
  baseSalary: number;
  bonus?: number;
  joiningDate: string;
  status?: EmployeeStatus;
  // New optional fields
  dateOfBirth?: string;
  fatherName?: string;
  panNumber?: string;
  mobile?: string;
  address?: string;
  pfAccountNumber?: string;
  epfPercent?: number;
  esiPercent?: number;
  professionalTax?: number;
  tdsPercent?: number;
  allowances?: number;
  bankName?: string;
  bankAccountNumber?: string;
  paymentMode?: PaymentMode;
}

// Analytics types
export interface AnalyticsSummary {
  activeEmployees: number;
  totalEmployees: number;
  currency: string;
  currencySymbol: string;
  totalPayroll: number;
  monthlyPayroll: number;
  avgSalary: number;
  maxSalary: number;
  minSalary: number;
  totalBonus: number;
  nextPayRunDate: string;
  daysToPayRun: number;
  pendingApprovals: number;
}

export interface DeptBreakdown {
  department: string;
  count: number;
  currency: string;
  totalPayroll: number;
  avgSalary: number;
}

export interface CountryBreakdown {
  country: string;
  localCurrency: string;
  currency: string;
  count: number;
  totalPayroll: number;
  avgSalary: number;
}

export interface LevelBreakdown {
  level: string;
  count: number;
  currency: string;
  avgSalary: number;
}

export interface DistributionBucket {
  label: string;
  count: number;
}

export interface EmploymentTypeBreakdown {
  type: string;
  count: number;
}

export interface PayrollTrendPoint {
  month: string;
  currency: string;
  totalPayroll: number;
  headcount: number;
}

export interface PayrollComponent {
  component: string;
  amount: number;
  percentage: number;
}

export interface ComplianceItem {
  item: string;
  status: string;
  details: string;
}

export interface RecentPayRun {
  period: string;
  payDate: string;
  status: string;
  headcount: number;
  currency: string;
  totalPayroll: number;
}

export interface PayRunSummary {
  currency: string;
  currencySymbol: string;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  avgNet: number;
  headcount: number;
}

// ─── HTTP helper ─────────────────────────────────────────────────────────────

async function http<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    if (body.details && Array.isArray(body.details)) {
      const msgs = body.details.map((d: any) => `${d.field}: ${d.message}`).join(', ');
      throw new Error(`${body.error || 'Validation failed'}: ${msgs}`);
    }
    throw new Error(body?.error ?? `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

function buildQuery(params: Record<string, unknown>): string {
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== '' && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
  return qs ? `?${qs}` : '';
}

// ─── Employees API ───────────────────────────────────────────────────────────

export const employeesApi = {
  list: (params: EmployeeListParams = {}) =>
    http<PaginatedResponse<Employee>>(`/employees${buildQuery(params as Record<string, unknown>)}`),

  get: (id: string) => http<Employee>(`/employees/${id}`),

  create: (payload: CreateEmployeePayload) =>
    http<Employee>('/employees', { method: 'POST', body: JSON.stringify(payload) }),

  update: (id: string, payload: Partial<CreateEmployeePayload>) =>
    http<Employee>(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),

  delete: (id: string) => http<void>(`/employees/${id}`, { method: 'DELETE' }),

  exportUrl: (params: EmployeeListParams = {}) =>
    `${API_BASE}/employees/export${buildQuery(params as Record<string, unknown>)}`,
};

// ─── Analytics API ───────────────────────────────────────────────────────────

export const analyticsApi = {
  summary: (currency?: string) => http<AnalyticsSummary>(`/analytics/summary${buildQuery({ currency })}` ),
  byDepartment: (currency?: string) => http<DeptBreakdown[]>(`/analytics/by-department${buildQuery({ currency })}`),
  byCountry: (currency?: string) => http<CountryBreakdown[]>(`/analytics/by-country${buildQuery({ currency })}`),
  byLevel: (currency?: string) => http<LevelBreakdown[]>(`/analytics/by-level${buildQuery({ currency })}`),
  distribution: (currency?: string) => http<DistributionBucket[]>(`/analytics/distribution${buildQuery({ currency })}`),
  byEmploymentType: () => http<EmploymentTypeBreakdown[]>('/analytics/by-employment-type'),
  payrollTrend: (currency?: string) => http<PayrollTrendPoint[]>(`/analytics/payroll-trend${buildQuery({ currency })}`),
  payrollComponents: (currency?: string) => http<PayrollComponent[]>(`/analytics/payroll-components${buildQuery({ currency })}`),
  compliance: () => http<ComplianceItem[]>('/analytics/compliance'),
  recentPayRuns: (currency?: string) => http<RecentPayRun[]>(`/analytics/recent-pay-runs${buildQuery({ currency })}`),
  payRunSummary: (currency?: string) => http<PayRunSummary>(`/analytics/pay-runs/summary${buildQuery({ currency })}`),
};
