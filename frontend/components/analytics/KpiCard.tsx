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
  indigo: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
  emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
  rose: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
};

export default function KpiCard({ title, value, icon, loading, accent = 'indigo' }: KpiCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-3 hover:border-slate-700 transition-colors">
      <div className={cn('w-8 h-8 rounded-lg border flex items-center justify-center', ACCENT_CLASSES[accent])}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{title}</p>
        {loading ? (
          <div className="h-6 w-24 bg-slate-800 rounded animate-pulse mt-1" />
        ) : (
          <p className="text-xl font-bold text-slate-100 mt-1 tabular-nums">{value}</p>
        )}
      </div>
    </div>
  );
}
