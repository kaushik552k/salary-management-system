'use client';

import {
  useAnalyticsSummary,
  useByDepartment,
  useByCountry,
  useByLevel,
  useDistribution,
  useByEmploymentType,
} from '@/hooks/use-analytics';
import KpiCard from '@/components/analytics/KpiCard';
import SalaryBarChart from '@/components/analytics/SalaryBarChart';
import DistributionChart from '@/components/analytics/DistributionChart';
import PieBreakdown from '@/components/analytics/PieBreakdown';
import {
  Users,
  TrendingUp,
  DollarSign,
  Award,
  Wallet,
  UserCheck,
} from 'lucide-react';
import { formatUSD } from '@/lib/utils';

export default function DashboardPage() {
  const { data: summary, isLoading: summaryLoading } = useAnalyticsSummary();
  const { data: byDept } = useByDepartment();
  const { data: byCountry } = useByCountry();
  const { data: byLevel } = useByLevel();
  const { data: distribution } = useDistribution();
  const { data: byType } = useByEmploymentType();

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
        <p className="text-slate-400 mt-1 text-sm">
          Salary analytics across all active employees — amounts normalised to USD
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard
          title="Active Employees"
          value={summary?.activeEmployees.toLocaleString() ?? '—'}
          icon={<Users className="w-4 h-4" />}
          loading={summaryLoading}
          accent="indigo"
        />
        <KpiCard
          title="Total Payroll (USD)"
          value={summary ? formatUSD(summary.totalPayrollUSD) : '—'}
          icon={<DollarSign className="w-4 h-4" />}
          loading={summaryLoading}
          accent="emerald"
        />
        <KpiCard
          title="Avg Salary (USD)"
          value={summary ? formatUSD(summary.avgSalaryUSD) : '—'}
          icon={<TrendingUp className="w-4 h-4" />}
          loading={summaryLoading}
          accent="blue"
        />
        <KpiCard
          title="Max Salary (USD)"
          value={summary ? formatUSD(summary.maxSalaryUSD) : '—'}
          icon={<Award className="w-4 h-4" />}
          loading={summaryLoading}
          accent="amber"
        />
        <KpiCard
          title="Min Salary (USD)"
          value={summary ? formatUSD(summary.minSalaryUSD) : '—'}
          icon={<UserCheck className="w-4 h-4" />}
          loading={summaryLoading}
          accent="purple"
        />
        <KpiCard
          title="Total Bonus (USD)"
          value={summary ? formatUSD(summary.totalBonusUSD) : '—'}
          icon={<Wallet className="w-4 h-4" />}
          loading={summaryLoading}
          accent="rose"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SalaryBarChart
          title="Avg Salary by Department"
          data={(byDept ?? []).map((d) => ({
            name: d.department,
            value: d.avgSalaryUSD,
            count: d.count,
          }))}
          color="#6366f1"
        />
        <SalaryBarChart
          title="Avg Salary by Job Level"
          data={(byLevel ?? []).map((l) => ({
            name: l.level,
            value: l.avgSalaryUSD,
            count: l.count,
          }))}
          color="#10b981"
        />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <DistributionChart data={distribution ?? []} />
        <SalaryBarChart
          title="Headcount by Country"
          data={(byCountry ?? []).slice(0, 8).map((c) => ({
            name: c.country,
            value: c.count,
            count: c.count,
          }))}
          color="#f59e0b"
          valueLabel="Employees"
        />
        <PieBreakdown
          title="Employment Types"
          data={(byType ?? []).map((t) => ({ name: t.type, value: t.count }))}
        />
      </div>
    </div>
  );
}
