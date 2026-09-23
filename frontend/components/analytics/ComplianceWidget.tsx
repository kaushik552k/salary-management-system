'use client';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { ComplianceItem } from '@/lib/api';

export default function ComplianceWidget({ data }: { data: ComplianceItem[] }) {
  return (
    <div className="space-y-2">
      {data.map((item) => (
        <div key={item.item} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-sm text-slate-700">{item.item}</span>
          </div>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            item.status === 'Compliant'
              ? 'text-emerald-600 bg-emerald-50'
              : 'text-rose-600 bg-rose-50'
          }`}>
            {item.status === 'Compliant' ? '✓ ' : '⚠ '}{item.status}
          </span>
        </div>
      ))}
    </div>
  );
}
