'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import EmployeeForm from '@/components/employees/EmployeeForm';
import { useCreateEmployee } from '@/hooks/use-employees';
import { CreateEmployeePayload } from '@/lib/api';

export default function NewEmployeePage() {
  const router = useRouter();
  const createMutation = useCreateEmployee();

  const handleSubmit = async (data: CreateEmployeePayload) => {
    await createMutation.mutateAsync(data);
    router.push('/employees');
  };

  return (
    <div className="p-8 max-w-2xl space-y-6">
      <Link href="/employees" className="flex items-center gap-2 text-slate-400 hover:text-slate-100 text-sm w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Employees
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-slate-100">Add New Employee</h1>
        <p className="text-slate-400 mt-1 text-sm">Fill in the details to add a new employee to ACME Corp.</p>
      </div>

      {createMutation.isError && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg px-4 py-3 text-sm text-rose-400">
          {(createMutation.error as Error).message}
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
        <EmployeeForm
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending}
          submitLabel="Create Employee"
        />
      </div>
    </div>
  );
}
