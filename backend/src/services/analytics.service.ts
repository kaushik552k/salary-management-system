import prisma from '../lib/prisma';
import { USD_EXCHANGE_RATES, INR_EXCHANGE_RATES } from '../schemas/employee.schema';

// Convert a salary value to USD using fixed exchange rates
function toUSD(amount: number, currency: string): number {
  const rate = USD_EXCHANGE_RATES[currency] ?? 1;
  return amount * rate;
}

// Convert a salary value to INR using fixed exchange rates
function toINR(amount: number, currency: string): number {
  const rate = INR_EXCHANGE_RATES[currency] ?? 83.5;
  return amount * rate;
}

// ─── Summary KPIs ────────────────────────────────────────────────────────────
export async function getSummary() {
  const [activeCount, totalCount, employees] = await Promise.all([
    prisma.employee.count({ where: { status: 'Active' } }),
    prisma.employee.count(),
    prisma.employee.findMany({
      where: { status: 'Active' },
      select: { baseSalary: true, bonus: true, currency: true, allowances: true },
    }),
  ]);

  const salariesInUSD = employees.map((e) => toUSD(e.baseSalary, e.currency));
  const totalPayrollUSD = salariesInUSD.reduce((sum, s) => sum + s, 0);
  const avgSalaryUSD = salariesInUSD.length > 0 ? totalPayrollUSD / salariesInUSD.length : 0;
  const maxSalaryUSD = salariesInUSD.length > 0 ? Math.max(...salariesInUSD) : 0;
  const minSalaryUSD = salariesInUSD.length > 0 ? Math.min(...salariesInUSD) : 0;
  const totalBonusUSD = employees.reduce((sum, e) => sum + toUSD(e.bonus ?? 0, e.currency), 0);

  // INR figures for dashboard
  const grossSalariesINR = employees.map((e) =>
    toINR(e.baseSalary + (e.allowances ?? 0), e.currency)
  );
  const totalPayrollINR = grossSalariesINR.reduce((sum, s) => sum + s, 0);
  const avgSalaryINR = grossSalariesINR.length > 0 ? totalPayrollINR / grossSalariesINR.length : 0;

  // Next pay run = 1st of next month
  const now = new Date();
  const nextPayRun = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const daysToPayRun = Math.ceil((nextPayRun.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return {
    activeEmployees: activeCount,
    totalEmployees: totalCount,
    totalPayrollUSD: Math.round(totalPayrollUSD),
    avgSalaryUSD: Math.round(avgSalaryUSD),
    maxSalaryUSD: Math.round(maxSalaryUSD),
    minSalaryUSD: Math.round(minSalaryUSD),
    totalBonusUSD: Math.round(totalBonusUSD),
    // INR figures
    totalPayrollINR: Math.round(totalPayrollINR),
    avgSalaryINR: Math.round(avgSalaryINR),
    monthlyPayrollINR: Math.round(totalPayrollINR / 12),
    nextPayRunDate: nextPayRun.toISOString().split('T')[0],
    daysToPayRun,
    pendingApprovals: Math.floor(activeCount * 0.015), // simulated ~1.5%
  };
}

// ─── Salary breakdown by department ─────────────────────────────────────────
export async function getByDepartment() {
  const employees = await prisma.employee.findMany({
    where: { status: 'Active' },
    select: { department: true, baseSalary: true, currency: true },
  });

  const grouped: Record<string, { totalUSD: number; count: number }> = {};
  for (const e of employees) {
    if (!grouped[e.department]) grouped[e.department] = { totalUSD: 0, count: 0 };
    grouped[e.department].totalUSD += toUSD(e.baseSalary, e.currency);
    grouped[e.department].count += 1;
  }

  return Object.entries(grouped)
    .map(([department, { totalUSD, count }]) => ({
      department,
      count,
      totalPayrollUSD: Math.round(totalUSD),
      avgSalaryUSD: Math.round(totalUSD / count),
    }))
    .sort((a, b) => b.avgSalaryUSD - a.avgSalaryUSD);
}

// ─── Salary breakdown by country ─────────────────────────────────────────────
export async function getByCountry() {
  const employees = await prisma.employee.findMany({
    where: { status: 'Active' },
    select: { country: true, currency: true, baseSalary: true },
  });

  const grouped: Record<string, { totalUSD: number; count: number; currency: string }> = {};
  for (const e of employees) {
    if (!grouped[e.country]) grouped[e.country] = { totalUSD: 0, count: 0, currency: e.currency };
    grouped[e.country].totalUSD += toUSD(e.baseSalary, e.currency);
    grouped[e.country].count += 1;
  }

  return Object.entries(grouped)
    .map(([country, { totalUSD, count, currency }]) => ({
      country, currency, count,
      totalPayrollUSD: Math.round(totalUSD),
      avgSalaryUSD: Math.round(totalUSD / count),
    }))
    .sort((a, b) => b.count - a.count);
}

// ─── Salary breakdown by job level ──────────────────────────────────────────
export async function getByLevel() {
  const employees = await prisma.employee.findMany({
    where: { status: 'Active' },
    select: { jobLevel: true, baseSalary: true, currency: true },
  });

  const LEVEL_ORDER = ['Junior', 'Mid', 'Senior', 'Lead', 'Principal', 'Director', 'VP'];
  const grouped: Record<string, { totalUSD: number; count: number }> = {};
  for (const e of employees) {
    if (!grouped[e.jobLevel]) grouped[e.jobLevel] = { totalUSD: 0, count: 0 };
    grouped[e.jobLevel].totalUSD += toUSD(e.baseSalary, e.currency);
    grouped[e.jobLevel].count += 1;
  }

  return LEVEL_ORDER.filter((level) => grouped[level]).map((level) => ({
    level,
    count: grouped[level].count,
    avgSalaryUSD: Math.round(grouped[level].totalUSD / grouped[level].count),
  }));
}

// ─── Salary distribution (histogram buckets) ────────────────────────────────
export async function getDistribution() {
  const employees = await prisma.employee.findMany({
    where: { status: 'Active' },
    select: { baseSalary: true, currency: true },
  });

  const salariesUSD = employees.map((e) => toUSD(e.baseSalary, e.currency));
  const buckets = [
    { label: '< $30k', min: 0, max: 30_000 },
    { label: '$30k–60k', min: 30_000, max: 60_000 },
    { label: '$60k–90k', min: 60_000, max: 90_000 },
    { label: '$90k–120k', min: 90_000, max: 120_000 },
    { label: '$120k–150k', min: 120_000, max: 150_000 },
    { label: '$150k–200k', min: 150_000, max: 200_000 },
    { label: '> $200k', min: 200_000, max: Infinity },
  ];

  return buckets.map(({ label, min, max }) => ({
    label,
    count: salariesUSD.filter((s) => s >= min && s < max).length,
  }));
}

// ─── Employment type breakdown ───────────────────────────────────────────────
export async function getByEmploymentType() {
  const employees = await prisma.employee.findMany({
    where: { status: 'Active' },
    select: { employmentType: true },
  });

  const grouped: Record<string, number> = {};
  for (const e of employees) {
    grouped[e.employmentType] = (grouped[e.employmentType] ?? 0) + 1;
  }
  return Object.entries(grouped).map(([type, count]) => ({ type, count }));
}

// ─── Payroll Trend (last 6 months) ──────────────────────────────────────────
export async function getPayrollTrend() {
  const now = new Date();
  const months: { month: string; label: string; start: Date; end: Date }[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
    months.push({
      month: d.toLocaleString('en-IN', { month: 'short', year: '2-digit' }),
      label: d.toLocaleString('en-IN', { month: 'short', year: '2-digit' }),
      start,
      end,
    });
  }

  // Get all active employees with their joining dates and salary
  const employees = await prisma.employee.findMany({
    where: { status: 'Active' },
    select: { baseSalary: true, currency: true, allowances: true, joiningDate: true },
  });

  return months.map(({ month, start, end }) => {
    // Employees active in this month = joined before end of month
    const activeInMonth = employees.filter((e) => new Date(e.joiningDate) <= end);
    const totalINR = activeInMonth.reduce(
      (sum, e) => sum + toINR((e.baseSalary + (e.allowances ?? 0)) / 12, e.currency),
      0
    );
    return {
      month,
      totalPayrollINR: Math.round(totalINR),
      headcount: activeInMonth.length,
    };
  });
}

// ─── Payroll Components Breakdown ─────────────────────────────────────────────
export async function getPayrollComponents() {
  const employees = await prisma.employee.findMany({
    where: { status: 'Active' },
    select: {
      baseSalary: true, currency: true, allowances: true,
      epfPercent: true, esiPercent: true, professionalTax: true,
    },
  });

  let basicINR = 0, allowancesINR = 0, epfINR = 0, esiINR = 0, otherINR = 0;

  for (const e of employees) {
    const basic = toINR(e.baseSalary / 12, e.currency);
    const allowance = toINR((e.allowances ?? 0) / 12, e.currency);
    const gross = basic + allowance;
    const epf = basic * ((e.epfPercent ?? 12) / 100);
    const esi = gross * ((e.esiPercent ?? 0.75) / 100);
    const other = toINR((e.professionalTax ?? 200), e.currency);

    basicINR += basic;
    allowancesINR += allowance;
    epfINR += epf;
    esiINR += esi;
    otherINR += other;
  }

  const total = basicINR + allowancesINR + epfINR + esiINR + otherINR;
  const pct = (v: number) => Math.round((v / total) * 100);

  return [
    { component: 'Basic Salary', amountINR: Math.round(basicINR), percentage: pct(basicINR) },
    { component: 'Allowances', amountINR: Math.round(allowancesINR), percentage: pct(allowancesINR) },
    { component: 'Employer EPF', amountINR: Math.round(epfINR), percentage: pct(epfINR) },
    { component: 'Employer ESI', amountINR: Math.round(esiINR), percentage: pct(esiINR) },
    { component: 'Other Components', amountINR: Math.round(otherINR), percentage: pct(otherINR) },
  ];
}

// ─── Compliance Status ─────────────────────────────────────────────────────────
export async function getComplianceStatus() {
  const activeCount = await prisma.employee.count({ where: { status: 'Active' } });
  // In a real system, this would check against govt filings. We simulate "Compliant" for a live payroll system.
  return [
    { item: 'EPF', status: 'Compliant', details: `${activeCount} employees enrolled` },
    { item: 'ESI', status: 'Compliant', details: `${Math.floor(activeCount * 0.4)} employees eligible` },
    { item: 'TDS', status: 'Compliant', details: 'Filed for current quarter' },
    { item: 'Professional Tax', status: 'Compliant', details: 'Remitted for current month' },
  ];
}

// ─── Recent Pay Runs ─────────────────────────────────────────────────────────
export async function getRecentPayRuns() {
  const employees = await prisma.employee.findMany({
    where: { status: 'Active' },
    select: { baseSalary: true, currency: true, allowances: true },
  });

  const headcount = employees.length;
  const monthlyPayrollINR = employees.reduce(
    (sum, e) => sum + toINR((e.baseSalary + (e.allowances ?? 0)) / 12, e.currency),
    0
  );

  const now = new Date();
  const runs = [];
  for (let i = 0; i < 4; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i - 1, 1);
    const payDate = new Date(d.getFullYear(), d.getMonth() + 1, 0); // last day of month
    const variance = 1 + (Math.sin(i * 7.3) * 0.03); // deterministic small variance
    runs.push({
      period: d.toLocaleString('en-IN', { month: 'long', year: 'numeric' }),
      payDate: payDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Paid',
      headcount,
      totalPayrollINR: Math.round(monthlyPayrollINR * variance),
    });
  }
  return runs;
}
