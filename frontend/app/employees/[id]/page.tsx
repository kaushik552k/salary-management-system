'use client';

import { useEmployee, useDeleteEmployee } from '@/hooks/use-employees';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency, formatDate, LEVEL_COLORS, STATUS_COLORS, cn } from '@/lib/utils';
import { ArrowLeft, Pencil, Trash2, Mail, MapPin, Briefcase, Calendar, DollarSign, Users } from 'lucide-react';

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: employee, isLoading } = useEmployee(id);
  const deleteMutation = useDeleteEmployee();

  const handleDelete = async () => {
    if (!employee) return;
    if (!confirm(`Deactivate ${employee.firstName} ${employee.lastName}? They will be marked as Inactive.`)) return;
    await deleteMutation.mutateAsync(id);
    router.push('/employees');
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="h-8 w-40 bg-slate-800 rounded animate-pulse mb-8" />
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-5 bg-slate-800 rounded animate-pulse" style={{ width: `${60 + i * 5}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-8 text-center text-slate-400">Employee not found.</div>
    );
  }

  const fields = [
    { icon: <Mail className="w-4 h-4" />, label: 'Email', value: employee.email },
    { icon: <Briefcase className="w-4 h-4" />, label: 'Job Title', value: employee.jobTitle },
    { icon: <Users className="w-4 h-4" />, label: 'Department', value: employee.department },
    { icon: <MapPin className="w-4 h-4" />, label: 'Country', value: employee.country },
    { icon: <Calendar className="w-4 h-4" />, label: 'Joining Date', value: formatDate(employee.joiningDate) },
    { icon: <Briefcase className="w-4 h-4" />, label: 'Employment Type', value: employee.employmentType },
  ];

  return (
    <div className="p-8 space-y-6 max-w-3xl">
      {/* Back */}
      <Link href="/employees" className="flex items-center gap-2 text-slate-400 hover:text-slate-100 text-sm w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Employees
      </Link>

      {/* Header card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-indigo-600 flex items-center justify-center text-xl font-bold text-white">
              {employee.firstName[0]}{employee.lastName[0]}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">
                {employee.firstName} {employee.lastName}
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">{employee.jobTitle}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-mono text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                  {employee.employeeId}
                </span>
                <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', LEVEL_COLORS[employee.jobLevel])}>
                  {employee.jobLevel}
                </span>
                <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', STATUS_COLORS[employee.status])}>
                  {employee.status}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/employees/${id}/edit`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-sm hover:bg-slate-700 transition-colors"
            >
              <Pencil className="w-4 h-4" /> Edit
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm hover:bg-rose-500/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Deactivate
            </button>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(({ icon, label, value }) => (
            <div key={label} className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg">
              <span className="text-slate-500 mt-0.5">{icon}</span>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">{label}</p>
                <p className="text-sm text-slate-200 mt-0.5 font-medium">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Salary card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">Compensation</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <p className="text-xs text-emerald-400 font-medium uppercase tracking-wide">Base Salary</p>
            </div>
            <p className="text-2xl font-bold text-slate-100 tabular-nums">
              {formatCurrency(employee.baseSalary, employee.currency)}
            </p>
            <p className="text-xs text-slate-500 mt-1">{employee.currency}</p>
          </div>
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-amber-400" />
              <p className="text-xs text-amber-400 font-medium uppercase tracking-wide">Bonus</p>
            </div>
            <p className="text-2xl font-bold text-slate-100 tabular-nums">
              {employee.bonus != null ? formatCurrency(employee.bonus, employee.currency) : '—'}
            </p>
            <p className="text-xs text-slate-500 mt-1">{employee.currency}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
