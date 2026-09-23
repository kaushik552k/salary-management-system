'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateEmployeePayload } from '@/lib/api';
import { DEPARTMENTS, JOB_LEVELS, EMPLOYMENT_TYPES, COUNTRIES, PAYMENT_MODES } from '@/lib/utils';

const schema = z.object({
  // Core
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  department: z.enum(DEPARTMENTS as unknown as [string, ...string[]]),
  jobTitle: z.string().min(1, 'Required'),
  jobLevel: z.enum(JOB_LEVELS as unknown as [string, ...string[]]),
  employmentType: z.enum(EMPLOYMENT_TYPES as unknown as [string, ...string[]]),
  country: z.enum(COUNTRIES as unknown as [string, ...string[]]),
  baseSalary: z.coerce.number().positive('Must be positive'),
  bonus: z.coerce.number().nonnegative().optional(),
  joiningDate: z.string().min(1, 'Required'),
  status: z.enum(['Active', 'Inactive']).optional(),
  // New personal info
  dateOfBirth: z.string().optional(),
  fatherName: z.string().optional(),
  panNumber: z.string().optional(),
  mobile: z.string().optional(),
  address: z.string().optional(),
  // Statutory
  pfAccountNumber: z.string().optional(),
  epfPercent: z.coerce.number().min(0).max(100).optional(),
  esiPercent: z.coerce.number().min(0).max(100).optional(),
  professionalTax: z.coerce.number().min(0).optional(),
  tdsPercent: z.coerce.number().min(0).max(100).optional(),
  allowances: z.coerce.number().min(0).optional(),
  // Bank
  bankName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  paymentMode: z.enum(PAYMENT_MODES as unknown as [string, ...string[]]).optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  defaultValues?: Partial<FormValues>;
  onSubmit: (data: CreateEmployeePayload) => Promise<void>;
  isSubmitting: boolean;
  submitLabel?: string;
}

const inputClass = 'w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100';
const selectClass = inputClass;

function Field({ label, required, error, children, className }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-slate-600 mb-1.5">
        {label}
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4 pb-2 border-b border-slate-200">
        {title}
      </h2>
      {children}
    </div>
  );
}

export default function EmployeeForm({ defaultValues, onSubmit, isSubmitting, submitLabel = 'Save' }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit((v) => onSubmit(v as CreateEmployeePayload))} className="space-y-8">
      {/* Personal */}
      <Section title="Personal Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="First Name" required error={errors.firstName?.message}>
            <input {...register('firstName')} placeholder="Alice" className={inputClass} />
          </Field>
          <Field label="Last Name" required error={errors.lastName?.message}>
            <input {...register('lastName')} placeholder="Smith" className={inputClass} />
          </Field>
          <Field label="Email" required error={errors.email?.message} className="sm:col-span-2">
            <input {...register('email')} type="email" placeholder="alice@acmecorp.com" className={inputClass} />
          </Field>
          <Field label="Date of Birth">
            <input {...register('dateOfBirth')} type="date" className={inputClass} />
          </Field>
          <Field label="Mobile">
            <input {...register('mobile')} placeholder="+91 98765 43210" className={inputClass} />
          </Field>
          <Field label="Father's Name">
            <input {...register('fatherName')} placeholder="Parent name" className={inputClass} />
          </Field>
          <Field label="PAN Number">
            <input {...register('panNumber')} placeholder="AAAAA0000A" className={inputClass} />
          </Field>
          <Field label="Address" className="sm:col-span-2">
            <textarea {...register('address')} rows={2} placeholder="Full address" className={inputClass} />
          </Field>
        </div>
      </Section>

      {/* Role */}
      <Section title="Role & Organisation">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Job Title" required error={errors.jobTitle?.message} className="sm:col-span-2">
            <input {...register('jobTitle')} placeholder="Senior Software Engineer" className={inputClass} />
          </Field>
          <Field label="Department" required error={errors.department?.message}>
            <select {...register('department')} className={selectClass}>
              <option value="">Select department</option>
              {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
            </select>
          </Field>
          <Field label="Job Level" required error={errors.jobLevel?.message}>
            <select {...register('jobLevel')} className={selectClass}>
              <option value="">Select level</option>
              {JOB_LEVELS.map(l => <option key={l}>{l}</option>)}
            </select>
          </Field>
          <Field label="Employment Type" required error={errors.employmentType?.message}>
            <select {...register('employmentType')} className={selectClass}>
              <option value="">Select type</option>
              {EMPLOYMENT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Country" required error={errors.country?.message}>
            <select {...register('country')} className={selectClass}>
              <option value="">Select country</option>
              {COUNTRIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Joining Date" required error={errors.joiningDate?.message}>
            <input {...register('joiningDate')} type="date" className={inputClass} />
          </Field>
          <Field label="Status">
            <select {...register('status')} className={selectClass}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </Field>
        </div>
      </Section>

      {/* Compensation */}
      <Section title="Compensation">
        <p className="text-xs text-slate-400 mb-4">Enter amounts in the employee's local currency.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Base Salary" required error={errors.baseSalary?.message}>
            <input {...register('baseSalary')} type="number" min="0" placeholder="95000" className={inputClass} />
          </Field>
          <Field label="Allowances (Annual)">
            <input {...register('allowances')} type="number" min="0" placeholder="20000" className={inputClass} />
          </Field>
          <Field label="Bonus (optional)">
            <input {...register('bonus')} type="number" min="0" placeholder="10000" className={inputClass} />
          </Field>
        </div>
      </Section>

      {/* Tax & Statutory */}
      <Section title="Tax & Statutory">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="EPF % (Employee)">
            <input {...register('epfPercent')} type="number" min="0" max="100" step="0.01" placeholder="12" className={inputClass} />
          </Field>
          <Field label="ESI %">
            <input {...register('esiPercent')} type="number" min="0" max="100" step="0.01" placeholder="0.75" className={inputClass} />
          </Field>
          <Field label="Professional Tax (Monthly)">
            <input {...register('professionalTax')} type="number" min="0" placeholder="200" className={inputClass} />
          </Field>
          <Field label="TDS %">
            <input {...register('tdsPercent')} type="number" min="0" max="100" placeholder="10" className={inputClass} />
          </Field>
          <Field label="PF Account Number" className="sm:col-span-2">
            <input {...register('pfAccountNumber')} placeholder="AA/AAA/0000000/000/0000000" className={inputClass} />
          </Field>
        </div>
      </Section>

      {/* Bank / Payment */}
      <Section title="Payment Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Payment Mode">
            <select {...register('paymentMode')} className={selectClass}>
              {PAYMENT_MODES.map(m => <option key={m}>{m}</option>)}
            </select>
          </Field>
          <Field label="Bank Name">
            <input {...register('bankName')} placeholder="HDFC Bank" className={inputClass} />
          </Field>
          <Field label="Account Number" className="sm:col-span-2">
            <input {...register('bankAccountNumber')} placeholder="XXXX1234" className={inputClass} />
          </Field>
        </div>
      </Section>

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        {isSubmitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
