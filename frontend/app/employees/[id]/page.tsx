'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEmployee, useDeleteEmployee } from '@/hooks/use-employees';
import { formatDate, formatINRFull, STATUS_COLORS, LEVEL_COLORS, cn } from '@/lib/utils';
import {
  ArrowLeft, Pencil, Trash2, Mail, Calendar, Building2, MapPin,
  CreditCard, User, ShieldCheck, Banknote,
} from 'lucide-react';

const TABS = ['Overview', 'Salary Details'] as const;

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-start py-3 border-b border-slate-100 last:border-0">
      <dt className="w-40 shrink-0 text-sm text-slate-400">{label}</dt>
      <dd className="text-sm font-medium text-slate-800">{value ?? '—'}</dd>
    </div>
  );
}

function Section({ title, icon, children, onEdit }: {
  title: string; icon?: React.ReactNode; children: React.ReactNode; onEdit?: () => void;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        </div>
        {onEdit && (
          <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
            <Pencil className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <dl className="px-5">{children}</dl>
    </div>
  );
}

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: employee, isLoading } = useEmployee(id);
  const { mutateAsync: deleteEmployee } = useDeleteEmployee();
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('Overview');
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Delete this employee? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await deleteEmployee(id);
      router.push('/employees');
    } finally {
      setDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-white border border-slate-200 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-6 text-center py-24">
        <p className="text-slate-400">Employee not found.</p>
        <Link href="/employees" className="text-indigo-600 text-sm mt-2 inline-block">← Back to Employees</Link>
      </div>
    );
  }

  const monthly = employee.baseSalary / 12;
  const allowances = (employee.allowances ?? 0) / 12;
  const gross = monthly + allowances;
  const epf = monthly * ((employee.epfPercent ?? 0) / 100);
  const esi = gross * ((employee.esiPercent ?? 0) / 100);
  const pt = employee.professionalTax ?? 0;
  const tds = monthly * ((employee.tdsPercent ?? 0) / 100);
  const netPay = gross - epf - esi - pt - tds;

  return (
    <div className="p-6 space-y-5">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/employees" className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">
                {employee.firstName} {employee.lastName}
              </h1>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                EMP ID: {employee.employeeId}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/employees/${id}/edit`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors shadow-sm"
          >
            <Pencil className="w-3.5 h-3.5" /> Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-2 rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-0">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-5 py-3 text-sm font-medium border-b-2 transition-colors',
                activeTab === tab
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Left: Basic Info Card */}
          <div className="xl:col-span-1 space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 text-center">
              <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-3">
                <User className="w-8 h-8 text-indigo-600" />
              </div>
              <p className="font-semibold text-slate-900">
                {employee.firstName} {employee.lastName} ({employee.employeeId})
              </p>
              <p className="text-sm text-slate-400 mt-0.5">{employee.jobTitle}</p>
              <div className="mt-3 flex justify-center gap-2">
                <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', STATUS_COLORS[employee.status])}>
                  {employee.status}
                </span>
                <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', LEVEL_COLORS[employee.jobLevel])}>
                  {employee.jobLevel}
                </span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Basic Info</p>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-4 h-4 shrink-0 text-slate-400" />
                  <span className="truncate">{employee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-4 h-4 shrink-0 text-slate-400" />
                  <span>{formatDate(employee.joiningDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Building2 className="w-4 h-4 shrink-0 text-slate-400" />
                  <span>{employee.department}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-4 h-4 shrink-0 text-slate-400" />
                  <span>{employee.country}</span>
                </div>
              </div>
              {employee.pfAccountNumber && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">PF Account Number</p>
                  <p className="text-sm font-mono text-slate-700">{employee.pfAccountNumber}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Personal + Payment info */}
          <div className="xl:col-span-2 space-y-4">
            <Section title="Personal Information" icon={<User className="w-4 h-4 text-slate-400" />} onEdit={() => router.push(`/employees/${id}/edit`)}>
              <InfoRow label="Date of Birth" value={employee.dateOfBirth ? formatDate(employee.dateOfBirth) : undefined} />
              <InfoRow label="Father's Name" value={employee.fatherName} />
              <InfoRow label="PAN" value={employee.panNumber} />
              <InfoRow label="Contact Email" value={employee.email} />
              <InfoRow label="Mobile" value={employee.mobile} />
              <InfoRow label="Address" value={employee.address} />
            </Section>

            <Section title="Payment Information" icon={<CreditCard className="w-4 h-4 text-slate-400" />} onEdit={() => router.push(`/employees/${id}/edit`)}>
              <div className="grid grid-cols-2 gap-6 py-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Payment Mode</p>
                  <p className="text-sm font-semibold text-slate-800 mt-1">{employee.paymentMode ?? 'Bank Transfer'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Account Number</p>
                  <p className="text-sm font-semibold text-slate-800 mt-1">{employee.bankAccountNumber ?? '—'}</p>
                </div>
                {employee.bankName && (
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Bank Name</p>
                    <p className="text-sm font-semibold text-slate-800 mt-1">{employee.bankName}</p>
                  </div>
                )}
              </div>
            </Section>
          </div>
        </div>
      )}

      {activeTab === 'Salary Details' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <Section title="Compensation" icon={<Banknote className="w-4 h-4 text-slate-400" />}>
            <InfoRow label="Base Salary" value={`${employee.currency} ${employee.baseSalary.toLocaleString('en-IN')}`} />
            <InfoRow label="Allowances" value={employee.allowances ? `${employee.currency} ${employee.allowances.toLocaleString('en-IN')}` : '₹0'} />
            <InfoRow label="Bonus" value={employee.bonus ? `${employee.currency} ${employee.bonus.toLocaleString('en-IN')}` : 'None'} />
            <InfoRow label="Gross Salary" value={`${employee.currency} ${(employee.baseSalary + (employee.allowances ?? 0)).toLocaleString('en-IN')}`} />
            <InfoRow label="Employment Type" value={employee.employmentType} />
          </Section>

          <Section title="Deductions" icon={<ShieldCheck className="w-4 h-4 text-slate-400" />}>
            <InfoRow label="EPF %" value={`${employee.epfPercent ?? 12}%`} />
            <InfoRow label="ESI %" value={`${employee.esiPercent ?? 0.75}%`} />
            <InfoRow label="Professional Tax" value={formatINRFull(employee.professionalTax ?? 0) + ' / month'} />
            <InfoRow label="TDS %" value={`${employee.tdsPercent ?? 10}%`} />
          </Section>

          {/* Net Pay Summary */}
          <div className="xl:col-span-2 bg-indigo-50 border border-indigo-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-indigo-800 mb-4">Monthly Payslip Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Gross Pay', value: formatINRFull(gross), color: 'text-slate-800' },
                { label: 'EPF + ESI', value: formatINRFull(epf + esi), color: 'text-rose-600' },
                { label: 'TDS', value: formatINRFull(tds), color: 'text-rose-600' },
                { label: 'Net Pay', value: formatINRFull(netPay), color: 'text-emerald-700 text-xl font-bold' },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
                  <p className={cn('text-base font-bold mt-0.5 tabular-nums', color)}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
