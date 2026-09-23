'use client';
import { PageTransition } from '@/components/ui/animations';

export default function ReportsPage() {
  return (
    <PageTransition className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-xl font-bold text-slate-900">Reports</h1>
      <p className="text-slate-400 text-sm mt-1">Analytics reports — coming soon.</p>
    </PageTransition>
  );
}
