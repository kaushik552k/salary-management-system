'use client';

import { useState, useEffect } from 'react';
import {
  useAnalyticsSummary, useByDepartment, useByLevel, useByEmploymentType,
  usePayrollTrend, usePayrollComponents, useCompliance, useRecentPayRuns,
} from '@/hooks/use-analytics';
import { formatCurrency, formatDateLong } from '@/lib/utils';
import PayrollTrendChart from '@/components/analytics/PayrollTrendChart';
import PieBreakdown from '@/components/analytics/PieBreakdown';
import SalaryBarChart from '@/components/analytics/SalaryBarChart';
import ComplianceWidget from '@/components/analytics/ComplianceWidget';
import RecentPayRuns from '@/components/analytics/RecentPayRuns';
import { Users, TrendingUp, Clock, Calendar, ArrowUp, Star, ChevronRight, Globe } from 'lucide-react';
import Link from 'next/link';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/animations';

const SUPPORTED_CURRENCIES = [
  { code: 'USD', label: 'USD — US Dollar' },
  { code: 'INR', label: 'INR — Indian Rupee' },
  { code: 'EUR', label: 'EUR — Euro' },
];

function KpiCard({ title, value, sub, badge, accent, icon, loading }: {
  title: string;
  value: string;
  sub?: string;
  badge?: { label: string; color: string };
  accent: string;
  icon: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <StaggerItem>
      <div data-testid="kpicard" className={`bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow`}>
        <div className={`w-10 h-10 rounded-xl ${accent} flex items-center justify-center mb-3`}>
          {icon}
        </div>
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{title}</p>
        {loading ? (
          <div className="h-8 w-36 bg-slate-100 rounded animate-pulse mt-2" />
        ) : (
          <div className="flex items-end gap-2 mt-1">
            <p className="text-2xl font-bold text-slate-900 tabular-nums">{value}</p>
            {badge && (
              <span className={`text-xs font-semibold pb-0.5 flex items-center gap-0.5 ${badge.color}`}>
                <ArrowUp className="w-3 h-3" />{badge.label}
              </span>
            )}
          </div>
        )}
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
    </StaggerItem>
  );
}

export default function DashboardPage() {
  const [currency, setCurrency] = useState('USD');

  const { data: summary, isLoading } = useAnalyticsSummary(currency);
  const { data: byDept } = useByDepartment(currency);
  const { data: byLevel } = useByLevel(currency);
  const { data: byType } = useByEmploymentType();
  const { data: trend } = usePayrollTrend(currency);
  const { data: components } = usePayrollComponents(currency);
  const { data: compliance } = useCompliance();
  const { data: recentRuns } = useRecentPayRuns(currency);

  const [greeting, setGreeting] = useState('Welcome');

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening');
  }, []);

  const nextPayDate = summary?.nextPayRunDate
    ? formatDateLong(summary.nextPayRunDate)
    : '—';

  const fmt = (amount: number) => formatCurrency(amount, currency);

  return (
    <PageTransition className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{greeting}!</h1>
          <p className="text-slate-400 text-sm mt-0.5">People thrive when payroll runs smoothly.</p>
        </div>

        {/* Currency Picker */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <Globe className="w-4 h-4 text-slate-400 shrink-0" />
          <label htmlFor="currency-select" className="text-xs font-medium text-slate-500 whitespace-nowrap">
            View in
          </label>
          <select
            id="currency-select"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors cursor-pointer"
          >
            {SUPPORTED_CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Employees"
          value={summary?.activeEmployees.toLocaleString('en-IN') ?? '—'}
          sub="vs last month"
          badge={{ label: '3%', color: 'text-emerald-600' }}
          accent="bg-blue-50"
          icon={<Users className="w-5 h-5 text-blue-600" />}
          loading={isLoading}
        />
        <KpiCard
          title={`Monthly Payroll (${currency})`}
          value={summary ? fmt(summary.monthlyPayroll) : '—'}
          sub="vs last month"
          badge={{ label: '8%', color: 'text-emerald-600' }}
          accent="bg-green-50"
          icon={<TrendingUp className="w-5 h-5 text-green-600" />}
          loading={isLoading}
        />
        <KpiCard
          title="Pending Approvals"
          value={summary?.pendingApprovals?.toString() ?? '—'}
          sub="Action Required"
          accent="bg-amber-50"
          icon={<Clock className="w-5 h-5 text-amber-600" />}
          loading={isLoading}
        />
        <KpiCard
          title="Next Pay Run"
          value={nextPayDate}
          sub={summary ? `${summary.daysToPayRun} days to go` : '—'}
          accent="bg-purple-50"
          icon={<Calendar className="w-5 h-5 text-purple-600" />}
          loading={isLoading}
        />
      </StaggerContainer>

      <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Payroll Trend */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Payroll Trend</h3>
              <p className="text-xs text-slate-400">Total payroll cost over the last 6 months ({currency})</p>
            </div>
            <Link href="/reports" className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 flex items-center gap-1">
              View Reports <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {trend ? (
            <PayrollTrendChart data={trend} currency={currency} />
          ) : (
            <div className="h-48 flex items-center justify-center">
              <div className="w-full h-32 bg-slate-100 rounded animate-pulse" />
            </div>
          )}
        </div>

        {/* Payroll Components Donut */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-800">Payroll Components</h3>
            <Link href="/reports" className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 flex items-center gap-1">
              View Details <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {components ? (
            <>
              <PieBreakdown
                title=""
                data={components.map(c => ({ name: c.component, value: c.percentage }))}
              />
              <div className="space-y-1 mt-2">
                {components.map((c, i) => {
                  const colors = ['#6366f1', '#10b981', '#f59e0b', '#f97316', '#8b5cf6'];
                  return (
                    <div key={c.component} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ background: colors[i] }} />
                        <span className="text-slate-600">{c.component}</span>
                      </div>
                      <span className="font-semibold text-slate-700">{c.percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="h-48 bg-slate-100 rounded animate-pulse" />
          )}
        </div>
      </StaggerContainer>

      <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Promo card */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <Star className="w-8 h-8 text-amber-500 mb-3" />
            <h3 className="text-sm font-semibold text-slate-800">Run Payroll with Confidence</h3>
            <p className="text-xs text-slate-500 mt-1">Automate payroll, ensure compliance, empower your people.</p>
          </div>
          <Link href="/pay-runs" className="mt-4 inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-white border border-amber-300 text-sm font-medium text-amber-700 hover:bg-amber-100 w-fit transition-colors">
            Explore Pay Runs <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Compliance Status */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Compliance Status</h3>
          {compliance ? (
            <ComplianceWidget data={compliance} />
          ) : (
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-8 bg-slate-100 rounded animate-pulse" />)}
            </div>
          )}
        </div>

        {/* Recent Pay Runs */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-800">Recent Pay Runs</h3>
            <Link href="/pay-runs" className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 flex items-center gap-1">
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {recentRuns ? (
            <RecentPayRuns data={recentRuns} />
          ) : (
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-10 bg-slate-100 rounded animate-pulse" />)}
            </div>
          )}
        </div>
      </StaggerContainer>

      {/* Dept + Level Charts */}
      <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SalaryBarChart
          title={`Avg Salary by Department (${currency})`}
          data={(byDept ?? []).map(d => ({ name: d.department, value: d.avgSalary, count: d.count }))}
          color="#6366f1"
          currency={currency}
        />
        <SalaryBarChart
          title={`Avg Salary by Job Level (${currency})`}
          data={(byLevel ?? []).map(l => ({ name: l.level, value: l.avgSalary, count: l.count }))}
          color="#10b981"
          currency={currency}
        />
      </StaggerContainer>
    </PageTransition>
  );
}
