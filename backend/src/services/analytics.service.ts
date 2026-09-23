import prisma from '../lib/prisma';
import { USD_EXCHANGE_RATES } from '../schemas/employee.schema';

// Convert a salary value to USD using fixed exchange rates
function toUSD(amount: number, currency: string): number {
  const rate = USD_EXCHANGE_RATES[currency] ?? 1;
  return amount * rate;
}

// ─── Summary KPIs ────────────────────────────────────────────────────────────
export async function getSummary() {
  const [activeCount, totalCount, employees] = await Promise.all([
    prisma.employee.count({ where: { status: 'Active' } }),
    prisma.employee.count(),
    prisma.employee.findMany({
      where: { status: 'Active' },
      select: { baseSalary: true, bonus: true, currency: true },
    }),
  ]);

  const salariesInUSD = employees.map((e) =>
    toUSD(e.baseSalary, e.currency)
  );

  const totalPayrollUSD = salariesInUSD.reduce((sum, s) => sum + s, 0);
  const avgSalaryUSD =
    salariesInUSD.length > 0 ? totalPayrollUSD / salariesInUSD.length : 0;
  const maxSalaryUSD = salariesInUSD.length > 0 ? Math.max(...salariesInUSD) : 0;
  const minSalaryUSD = salariesInUSD.length > 0 ? Math.min(...salariesInUSD) : 0;

  const totalBonusUSD = employees.reduce(
    (sum, e) => sum + toUSD(e.bonus ?? 0, e.currency),
    0
  );

  return {
    activeEmployees: activeCount,
    totalEmployees: totalCount,
    totalPayrollUSD: Math.round(totalPayrollUSD),
    avgSalaryUSD: Math.round(avgSalaryUSD),
    maxSalaryUSD: Math.round(maxSalaryUSD),
    minSalaryUSD: Math.round(minSalaryUSD),
    totalBonusUSD: Math.round(totalBonusUSD),
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
    if (!grouped[e.department]) {
      grouped[e.department] = { totalUSD: 0, count: 0 };
    }
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

  const grouped: Record<
    string,
    { totalUSD: number; count: number; currency: string }
  > = {};

  for (const e of employees) {
    if (!grouped[e.country]) {
      grouped[e.country] = { totalUSD: 0, count: 0, currency: e.currency };
    }
    grouped[e.country].totalUSD += toUSD(e.baseSalary, e.currency);
    grouped[e.country].count += 1;
  }

  return Object.entries(grouped)
    .map(([country, { totalUSD, count, currency }]) => ({
      country,
      currency,
      count,
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
    if (!grouped[e.jobLevel]) {
      grouped[e.jobLevel] = { totalUSD: 0, count: 0 };
    }
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

  // Define USD bucket ranges
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
