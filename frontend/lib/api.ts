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
  totalPayrollUSD: number;
  avgSalaryUSD: number;
  maxSalaryUSD: number;
  minSalaryUSD: number;
  totalBonusUSD: number;
  totalPayrollINR: number;
  avgSalaryINR: number;
  monthlyPayrollINR: number;
  nextPayRunDate: string;
  daysToPayRun: number;
  pendingApprovals: number;
}

export interface DeptBreakdown {
  department: string;
  count: number;
  totalPayrollUSD: number;
  avgSalaryUSD: number;
}

export interface CountryBreakdown {
  country: string;
  currency: string;
  count: number;
  totalPayrollUSD: number;
  avgSalaryUSD: number;
}

export interface LevelBreakdown {
  level: string;
  count: number;
  avgSalaryUSD: number;
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
  totalPayrollINR: number;
  headcount: number;
}

export interface PayrollComponent {
  component: string;
  amountINR: number;
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
  totalPayrollINR: number;
}

// ─── HTTP helper ─────────────────────────────────────────────────────────────

async function http<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
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
  summary: () => http<AnalyticsSummary>('/analytics/summary'),
  byDepartment: () => http<DeptBreakdown[]>('/analytics/by-department'),
  byCountry: () => http<CountryBreakdown[]>('/analytics/by-country'),
  byLevel: () => http<LevelBreakdown[]>('/analytics/by-level'),
  distribution: () => http<DistributionBucket[]>('/analytics/distribution'),
  byEmploymentType: () => http<EmploymentTypeBreakdown[]>('/analytics/by-employment-type'),
  payrollTrend: () => http<PayrollTrendPoint[]>('/analytics/payroll-trend'),
  payrollComponents: () => http<PayrollComponent[]>('/analytics/payroll-components'),
  compliance: () => http<ComplianceItem[]>('/analytics/compliance'),
  recentPayRuns: () => http<RecentPayRun[]>('/analytics/recent-pay-runs'),
};
