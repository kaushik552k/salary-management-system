'use client';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { RecentPayRun } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export default function RecentPayRuns({ data }: { data: RecentPayRun[] }) {
  return (
    <div className="space-y-0">
      {data.map((run, i) => (
        <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 px-1 rounded transition-colors">
          <div>
            <p className="text-sm font-medium text-slate-800">{run.period}</p>
            <p className="text-xs text-slate-400 mt-0.5">{run.headcount.toLocaleString()} employees</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              {run.status}
            </span>
            <p className="text-sm font-bold text-slate-800 tabular-nums">
              {formatCurrency(run.totalPayroll, run.currency ?? 'USD')}
            </p>
            <p className="text-xs text-slate-400">{run.payDate}</p>
          </div>
        </div>
      ))}
      <div className="pt-3">
        <Link href="/pay-runs" className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700">
          View All <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
