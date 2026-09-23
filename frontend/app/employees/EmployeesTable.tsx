'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEmployees, useDeleteEmployee } from '@/hooks/use-employees';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Employee, employeesApi } from '@/lib/api';
import {
  formatCurrency,
  formatDate,
  DEPARTMENTS,
  JOB_LEVELS,
  EMPLOYMENT_TYPES,
  LEVEL_COLORS,
  STATUS_COLORS,
  cn,
} from '@/lib/utils';
import {
  Plus, Download, Search, ChevronLeft, ChevronRight,
  Pencil, Trash2, ChevronUp, ChevronDown,
} from 'lucide-react';
import Link from 'next/link';

const col = createColumnHelper<Employee>();

const COLUMNS = [
  col.accessor('employeeId', {
    header: 'ID',
    cell: (i) => <span className="text-slate-400 text-xs font-mono">{i.getValue()}</span>,
  }),
  col.accessor((row) => `${row.firstName} ${row.lastName}`, {
    id: 'name',
    header: 'Name',
    cell: (i) => (
      <div>
        <p className="font-medium text-slate-800">{i.getValue()}</p>
        <p className="text-xs text-slate-400">{i.row.original.email}</p>
      </div>
    ),
  }),
  col.accessor('department', {
    header: 'Department',
    cell: (i) => <span className="text-slate-600 text-sm">{i.getValue()}</span>,
  }),
  col.accessor('jobLevel', {
    header: 'Level',
    cell: (i) => (
      <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', LEVEL_COLORS[i.getValue()] ?? 'bg-slate-100 text-slate-600')}>
        {i.getValue()}
      </span>
    ),
  }),
  col.accessor('country', {
    header: 'Country',
    cell: (i) => <span className="text-slate-600 text-sm">{i.getValue()}</span>,
  }),
  col.accessor('baseSalary', {
    header: 'Base Salary',
    cell: (i) => (
      <span className="font-mono text-sm font-semibold text-slate-800">
        {formatCurrency(i.getValue(), i.row.original.currency)}
      </span>
    ),
  }),
  col.accessor('employmentType', {
    header: 'Type',
    cell: (i) => <span className="text-slate-500 text-xs">{i.getValue()}</span>,
  }),
  col.accessor('joiningDate', {
    header: 'Joined',
    cell: (i) => <span className="text-slate-400 text-xs">{formatDate(i.getValue())}</span>,
  }),
  col.accessor('status', {
    header: 'Status',
    cell: (i) => (
      <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', STATUS_COLORS[i.getValue()] ?? '')}>
        {i.getValue()}
      </span>
    ),
  }),
];

const SORT_COLUMN_MAP: Record<string, string> = {
  name: 'firstName',
  baseSalary: 'baseSalary',
  joiningDate: 'joiningDate',
  department: 'department',
  country: 'country',
  jobLevel: 'jobLevel',
};
const SORTABLE = Object.values(SORT_COLUMN_MAP);

export default function EmployeesTable() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page') ?? 1);
  const search = searchParams.get('search') ?? '';
  const department = searchParams.get('department') ?? '';
  const country = searchParams.get('country') ?? '';
  const jobLevel = searchParams.get('jobLevel') ?? '';
  const employmentType = searchParams.get('employmentType') ?? '';
  const status = searchParams.get('status') ?? 'Active';
  const sortBy = searchParams.get('sortBy') ?? 'firstName';
  const sortOrder = (searchParams.get('sortOrder') ?? 'asc') as 'asc' | 'desc';
  const limit = 50;

  const { data, isLoading } = useEmployees({ page, limit, search, department, country, jobLevel, employmentType, status, sortBy, sortOrder });
  const deleteMutation = useDeleteEmployee();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      value ? params.set(key, value) : params.delete(key);
      params.set('page', '1');
      router.push(`/employees?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSort = (col: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sortBy === col) {
      params.set('sortOrder', sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      params.set('sortBy', col);
      params.set('sortOrder', 'asc');
    }
    router.push(`/employees?${params.toString()}`);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Deactivate ${name}? They will be marked as Inactive.`)) return;
    await deleteMutation.mutateAsync(id);
  };

  const table = useReactTable({
    data: data?.data ?? [],
    columns: COLUMNS,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
  });

  const exportUrl = employeesApi.exportUrl({ search, department, country, jobLevel, employmentType, status, sortBy, sortOrder });

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
          <p className="text-slate-500 mt-1 text-sm">
            {data?.meta.total.toLocaleString() ?? '—'} employees found
          </p>
        </div>
        <div className="flex gap-3">
          <a
            href={exportUrl}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-600 text-sm hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" /> Export CSV
          </a>
          <Link
            href="/employees/new"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Employee
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, email, ID..."
            defaultValue={search}
            onKeyDown={(e) => {
              if (e.key === 'Enter') updateParam('search', (e.target as HTMLInputElement).value);
            }}
            onChange={(e) => { if (!e.target.value) updateParam('search', ''); }}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 shadow-sm"
          />
        </div>
        <FilterSelect value={department} placeholder="All Departments" options={DEPARTMENTS} onChange={(v) => updateParam('department', v)} />
        <FilterSelect value={jobLevel} placeholder="All Levels" options={JOB_LEVELS} onChange={(v) => updateParam('jobLevel', v)} />
        <FilterSelect value={employmentType} placeholder="All Types" options={EMPLOYMENT_TYPES} onChange={(v) => updateParam('employmentType', v)} />
        <FilterSelect value={status} placeholder="Status" options={['Active', 'Inactive']} onChange={(v) => updateParam('status', v)} />
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="border-b border-slate-200 bg-slate-50">
                  {hg.headers.map((header) => {
                    const colKey = SORT_COLUMN_MAP[header.id] ?? header.id;
                    const isSortable = SORTABLE.includes(colKey);
                    const isSorted = sortBy === colKey;
                    return (
                      <th
                        key={header.id}
                        className={cn('px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap', isSortable && 'cursor-pointer select-none hover:text-slate-800')}
                        onClick={() => isSortable && handleSort(colKey)}
                      >
                        <span className="flex items-center gap-1">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {isSortable && (isSorted ? (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3 text-indigo-500" /> : <ChevronDown className="w-3 h-3 text-indigo-500" />) : <ChevronUp className="w-3 h-3 opacity-20" />)}
                        </span>
                      </th>
                    );
                  })}
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">Actions</th>
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    {Array.from({ length: COLUMNS.length + 1 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-slate-100 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length + 1} className="px-4 py-16 text-center text-slate-400">No employees found</td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group"
                    onClick={() => router.push(`/employees/${row.original.id}`)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                    <td className="px-4 py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/employees/${row.original.id}/edit`} className="p-1.5 rounded-md hover:bg-slate-200 text-slate-400 hover:text-slate-700">
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(row.original.id, `${row.original.firstName} ${row.original.lastName}`)}
                          className="p-1.5 rounded-md hover:bg-rose-50 text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
            <p className="text-xs text-slate-500">
              Showing {((page - 1) * limit + 1).toLocaleString()}–{Math.min(page * limit, data.meta.total).toLocaleString()} of {data.meta.total.toLocaleString()}
            </p>
            <div className="flex items-center gap-2">
              <button disabled={page <= 1} onClick={() => updateParam('page', String(page - 1))} className="p-1.5 rounded-md hover:bg-slate-200 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-500 tabular-nums">Page {page} of {data.meta.totalPages}</span>
              <button disabled={page >= data.meta.totalPages} onClick={() => updateParam('page', String(page + 1))} className="p-1.5 rounded-md hover:bg-slate-200 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterSelect({ value, placeholder, options, onChange }: { value: string; placeholder: string; options: readonly string[]; onChange: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer shadow-sm"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
