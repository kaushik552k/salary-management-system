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
    if (!confirm(`Deactivate ${employee.firstName} ${employee.lastName}?`)) return;
    await deleteMutation.mutateAsync(id);
    router.push('/employees');
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="h-8 w-40 bg-slate-100 rounded animate-pulse mb-8" />
        <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-6 shadow-sm">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-5 bg-slate-100 rounded animate-pulse" style={{ width: `${60 + i * 5}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (!employee) {
    return <div className="p-8 text-center text-slate-400">Employee not found.</div>;
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
      <Link href="/employees" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Employees
      </Link>

      {/* Header card */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-indigo-600 flex items-center justify-center text-xl font-bold text-white">
              {employee.firstName[0]}{employee.lastName[0]}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {employee.firstName} {employee.lastName}
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">{employee.jobTitle}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
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
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 text-sm hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Pencil className="w-4 h-4" /> Edit
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-sm hover:bg-rose-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Deactivate
            </button>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(({ icon, label, value }) => (
            <div key={label} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 mt-0.5">{icon}</span>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">{label}</p>
                <p className="text-sm text-slate-800 mt-0.5 font-medium">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Salary card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Compensation</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide">Base Salary</p>
            </div>
            <p className="text-2xl font-bold text-slate-900 tabular-nums">
              {formatCurrency(employee.baseSalary, employee.currency)}
            </p>
            <p className="text-xs text-slate-400 mt-1">{employee.currency}</p>
          </div>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-amber-600" />
              <p className="text-xs text-amber-600 font-medium uppercase tracking-wide">Bonus</p>
            </div>
            <p className="text-2xl font-bold text-slate-900 tabular-nums">
              {employee.bonus != null ? formatCurrency(employee.bonus, employee.currency) : '—'}
            </p>
            <p className="text-xs text-slate-400 mt-1">{employee.currency}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
