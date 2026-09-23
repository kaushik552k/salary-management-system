import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeesApi, EmployeeListParams, CreateEmployeePayload } from '@/lib/api';

export const EMPLOYEES_KEY = 'employees';

export function useEmployees(params: EmployeeListParams) {
  return useQuery({
    queryKey: [EMPLOYEES_KEY, params],
    queryFn: () => employeesApi.list(params),
    placeholderData: (prev) => prev, // Keep previous data while fetching
    staleTime: 30_000, // 30s
  });
}

export function useEmployee(id: string) {
  return useQuery({
    queryKey: [EMPLOYEES_KEY, id],
    queryFn: () => employeesApi.get(id),
    enabled: !!id,
  });
}

export function useCreateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEmployeePayload) => employeesApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [EMPLOYEES_KEY] });
    },
  });
}

export function useUpdateEmployee(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<CreateEmployeePayload>) =>
      employeesApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [EMPLOYEES_KEY] });
    },
  });
}

export function useDeleteEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => employeesApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [EMPLOYEES_KEY] });
    },
  });
}
