'use client';

import { useCompliance } from '@/hooks/use-analytics';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function CompliancePage() {
  const { data: compliance, isLoading } = useCompliance();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Compliance</h1>
        <p className="text-slate-400 text-sm mt-0.5">Statutory compliance status for EPF, ESI, TDS and Professional Tax</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-white border border-slate-200 rounded-xl animate-pulse" />
          ))
          : compliance?.map((item) => (
            <div key={item.item} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">{item.item}</h3>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    item.status === 'Compliant'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{item.details}</p>
              </div>
            </div>
          ))
        }
      </div>

      {/* Salary Components table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800">Salary Components</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {['Name', 'Earning Type', 'Calculation Type', 'Consider for EPF', 'Consider for ESI', 'Status'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { name: 'Basic', type: 'Basic', calc: 'Fixed; 50% of CTC', epf: 'Yes', esi: 'Yes' },
                { name: 'House Rent Allowance', type: 'House Rent Allowance', calc: 'Fixed; 50% of Basic', epf: 'No', esi: 'Yes' },
                { name: 'Conveyance Allowance', type: 'Conveyance Allowance', calc: 'Fixed; Flat Amount', epf: 'No', esi: 'No' },
                { name: 'Transport Allowance', type: 'Transport Allowance', calc: 'Fixed; Flat amount of 1600', epf: 'No', esi: 'Yes' },
                { name: 'Bonus', type: 'Bonus', calc: 'Variable; Flat Amount', epf: 'No', esi: 'Yes' },
                { name: 'Gratuity', type: 'Gratuity', calc: 'Variable; Flat Amount', epf: 'No', esi: 'No' },
              ].map((row) => (
                <tr key={row.name} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 text-indigo-600 font-medium">{row.name}</td>
                  <td className="px-5 py-3 text-slate-600">{row.type}</td>
                  <td className="px-5 py-3 text-slate-600">{row.calc}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium ${row.epf === 'Yes' ? 'text-emerald-600' : 'text-slate-400'}`}>{row.epf}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium ${row.esi === 'Yes' ? 'text-emerald-600' : 'text-slate-400'}`}>{row.esi}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-semibold text-emerald-600">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
