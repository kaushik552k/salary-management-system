'use client';

import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import EmployeeForm from '@/components/employees/EmployeeForm';
import { useEmployee, useUpdateEmployee } from '@/hooks/use-employees';
import { CreateEmployeePayload } from '@/lib/api';

export default function EditEmployeePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: employee, isLoading } = useEmployee(id);
  const updateMutation = useUpdateEmployee(id);

  const handleSubmit = async (data: CreateEmployeePayload) => {
    await updateMutation.mutateAsync(data);
    router.push(`/employees/${id}`);
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="h-8 w-40 bg-slate-800 rounded animate-pulse mb-8" />
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 bg-slate-800 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!employee) {
    return <div className="p-8 text-slate-400">Employee not found.</div>;
  }

  return (
    <div className="p-8 max-w-2xl space-y-6">
      <Link
        href={`/employees/${id}`}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-100 text-sm w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Profile
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-slate-100">
          Edit {employee.firstName} {employee.lastName}
        </h1>
        <p className="text-slate-400 mt-1 text-sm">{employee.employeeId}</p>
      </div>

      {updateMutation.isError && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg px-4 py-3 text-sm text-rose-400">
          {(updateMutation.error as Error).message}
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
        <EmployeeForm
          defaultValues={{
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            department: employee.department,
            jobTitle: employee.jobTitle,
            jobLevel: employee.jobLevel,
            employmentType: employee.employmentType,
            country: employee.country,
            baseSalary: employee.baseSalary,
            bonus: employee.bonus ?? undefined,
            joiningDate: employee.joiningDate.split('T')[0],
            status: employee.status,
          }}
          onSubmit={handleSubmit}
          isSubmitting={updateMutation.isPending}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
