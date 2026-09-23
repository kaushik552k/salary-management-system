import { Suspense } from 'react';
import EmployeesTable from './EmployeesTable';

export default function EmployeesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 space-y-6">
          <div className="h-8 w-48 bg-slate-800 rounded animate-pulse" />
          <div className="h-12 bg-slate-900 border border-slate-800 rounded-xl animate-pulse" />
          <div className="bg-slate-900 border border-slate-800 rounded-xl h-96 animate-pulse" />
        </div>
      }
    >
      <EmployeesTable />
    </Suspense>
  );
}
