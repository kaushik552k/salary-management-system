'use client';

import { useState } from 'react';
import { useAnalyticsSummary, useRecentPayRuns, usePayrollComponents } from '@/hooks/use-analytics';
import { useEmployees } from '@/hooks/use-employees';
import { formatINR, formatINRFull } from '@/lib/utils';
import { Employee } from '@/lib/api';
import { Download, CalendarClock, Users, Wallet, BadgeCheck, X, AlertCircle } from 'lucide-react';

function computePayroll(e: Employee) {
  const monthly = e.baseSalary / 12;
  const allowances = (e.allowances ?? 0) / 12;
  const gross = monthly + allowances;
  const epf = monthly * ((e.epfPercent ?? 0) / 100);
  const esi = gross * ((e.esiPercent ?? 0) / 100);
  const pt = (e.professionalTax ?? 0);
  const tds = monthly * ((e.tdsPercent ?? 0) / 100);
  const totalDeductions = epf + esi + pt;
  const netPay = gross - epf - esi - pt - tds;
  return { gross, epf, esi, pt, tds, totalDeductions, netPay, paidDays: 30 };
}

export default function PayRunsPage() {
  const { data: summary } = useAnalyticsSummary();
  const { data: recentRuns } = useRecentPayRuns();
  const { data: components } = usePayrollComponents();
  const { data: employees, isLoading } = useEmployees({ status: 'Active', limit: 50 });
  const [activeTab, setActiveTab] = useState<'summary' | 'tax'>('summary');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const now = new Date();
  const period = now.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
  const payDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const payDayStr = payDay.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const empList: Employee[] = employees?.data ?? [];
  const payrollData = empList.map((e) => ({ ...e, ...computePayroll(e) }));

  const totalGross = payrollData.reduce((s, e) => s + e.gross, 0);
  const totalDeductions = payrollData.reduce((s, e) => s + e.totalDeductions, 0);
  const totalTax = payrollData.reduce((s, e) => s + e.tds, 0);
  const totalNet = payrollData.reduce((s, e) => s + e.netPay, 0);

  const totalMonthlyINR = summary?.monthlyPayrollINR ?? 0;
  const avgNet = empList.length > 0 ? totalNet / empList.length : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900">Regular Payroll</h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-700 border border-amber-200">DRAFT</span>
          </div>
          <p className="text-sm text-slate-400 mt-0.5">Period: {period} | 30 Payable Days</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <button 
            onClick={() => setShowPaymentDialog(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors shadow-sm"
          >
            <BadgeCheck className="w-4 h-4" /> Submit and Approve
          </button>
        </div>
      </div>

      {/* Payment Gateway Dialog */}
      {showPaymentDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-indigo-600" />
                Submit Payroll
              </h3>
              <button 
                onClick={() => setShowPaymentDialog(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-slate-800 mb-1">Payment Gateway Required</h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  We haven't integrated a payment gateway yet. You cannot process actual payments at this time.
                </p>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setShowPaymentDialog(false)}
                className="px-4 py-2 bg-indigo-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-indigo-500 transition-colors shadow-sm"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Payroll Cost</p>
              <p className="text-lg font-bold text-slate-900 tabular-nums">{formatINR(totalMonthlyINR)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Employees' Net Pay</p>
              <p className="text-lg font-bold text-slate-900 tabular-nums">{formatINR(avgNet * (summary?.activeEmployees ?? 1))}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
              <CalendarClock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Pay Day</p>
              <p className="text-lg font-bold text-slate-900">{payDayStr}</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 ml-12">{summary?.activeEmployees?.toLocaleString('en-IN')} Employees</p>
        </div>
      </div>

      {/* Taxes & Deductions Summary */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Taxes & Deductions</h3>
        <div className="grid grid-cols-3 gap-6">
          {components?.slice(2, 5).map((c) => (
            <div key={c.component}>
              <p className="text-xs text-slate-400 uppercase tracking-wide">{c.component}</p>
              <p className="text-lg font-bold text-slate-800 mt-0.5 tabular-nums">{formatINR(c.amountINR)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div>
        <div className="flex border-b border-slate-200 mb-4">
          {['summary', 'tax'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors capitalize ${
                activeTab === tab
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'summary' ? 'Employee Summary' : 'Taxes & Deductions'}
            </button>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Employee Name</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Paid Days</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Gross Pay</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Deductions</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Taxes</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Net Pay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading
                  ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-4 bg-slate-100 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                  : payrollData.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-slate-800">{e.firstName} {e.lastName}</p>
                        <p className="text-xs text-slate-400">{e.employeeId}</p>
                      </td>
                      <td className="text-center px-4 py-3.5 text-slate-600">{e.paidDays}</td>
                      <td className="text-right px-4 py-3.5 font-medium text-slate-800 tabular-nums">{formatINRFull(e.gross)}</td>
                      <td className="text-right px-4 py-3.5 text-slate-600 tabular-nums">{formatINRFull(e.totalDeductions)}</td>
                      <td className="text-right px-4 py-3.5 text-slate-600 tabular-nums">{formatINRFull(e.tds)}</td>
                      <td className="text-right px-4 py-3.5 font-bold text-slate-900 tabular-nums">{formatINRFull(e.netPay)}</td>
                    </tr>
                  ))
                }
              </tbody>
              {!isLoading && payrollData.length > 0 && (
                <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                  <tr>
                    <td className="px-5 py-3 text-xs font-bold text-slate-600 uppercase tracking-wide" colSpan={2}>Showing {empList.length} of {summary?.activeEmployees?.toLocaleString('en-IN')} employees</td>
                    <td className="text-right px-4 py-3 font-bold text-slate-800 tabular-nums">{formatINRFull(totalGross)}</td>
                    <td className="text-right px-4 py-3 font-bold text-slate-800 tabular-nums">{formatINRFull(totalDeductions)}</td>
                    <td className="text-right px-4 py-3 font-bold text-slate-800 tabular-nums">{formatINRFull(totalTax)}</td>
                    <td className="text-right px-4 py-3 font-bold text-indigo-700 tabular-nums">{formatINRFull(totalNet)}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
