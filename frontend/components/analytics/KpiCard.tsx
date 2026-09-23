'use client';

import { cn } from '@/lib/utils';

interface KpiCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  loading?: boolean;
  accent?: 'indigo' | 'emerald' | 'blue' | 'amber' | 'purple' | 'rose';
}

const ACCENT_CLASSES = {
  indigo: 'bg-indigo-50 border-indigo-200 text-indigo-600',
  emerald: 'bg-emerald-50 border-emerald-200 text-emerald-600',
  blue: 'bg-blue-50 border-blue-200 text-blue-600',
  amber: 'bg-amber-50 border-amber-200 text-amber-600',
  purple: 'bg-purple-50 border-purple-200 text-purple-600',
  rose: 'bg-rose-50 border-rose-200 text-rose-600',
};

export default function KpiCard({ title, value, icon, loading, accent = 'indigo' }: KpiCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-3 hover:border-slate-300 hover:shadow-sm transition-all">
      <div className={cn('w-8 h-8 rounded-lg border flex items-center justify-center', ACCENT_CLASSES[accent])}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{title}</p>
        {loading ? (
          <div className="h-6 w-24 bg-slate-100 rounded animate-pulse mt-1" />
        ) : (
          <p className="text-xl font-bold text-slate-900 mt-1 tabular-nums">{value}</p>
        )}
      </div>
    </div>
  );
}
