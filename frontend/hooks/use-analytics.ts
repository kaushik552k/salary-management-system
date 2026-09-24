import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api';

export const useAnalyticsSummary = (currency?: string) =>
  useQuery({
    queryKey: ['analytics', 'summary', currency],
    queryFn: () => analyticsApi.summary(currency),
    staleTime: 60_000,
  });

export const useByDepartment = (currency?: string) =>
  useQuery({
    queryKey: ['analytics', 'byDepartment', currency],
    queryFn: () => analyticsApi.byDepartment(currency),
    staleTime: 60_000,
  });

export const useByCountry = (currency?: string) =>
  useQuery({
    queryKey: ['analytics', 'byCountry', currency],
    queryFn: () => analyticsApi.byCountry(currency),
    staleTime: 60_000,
  });

export const useByLevel = (currency?: string) =>
  useQuery({
    queryKey: ['analytics', 'byLevel', currency],
    queryFn: () => analyticsApi.byLevel(currency),
    staleTime: 60_000,
  });

export const useDistribution = (currency?: string) =>
  useQuery({
    queryKey: ['analytics', 'distribution', currency],
    queryFn: () => analyticsApi.distribution(currency),
    staleTime: 60_000,
  });

export const useByEmploymentType = () =>
  useQuery({
    queryKey: ['analytics', 'byEmploymentType'],
    queryFn: analyticsApi.byEmploymentType,
    staleTime: 60_000,
  });

export const usePayrollTrend = (currency?: string) =>
  useQuery({
    queryKey: ['analytics', 'payrollTrend', currency],
    queryFn: () => analyticsApi.payrollTrend(currency),
    staleTime: 60_000,
  });

export const usePayrollComponents = (currency?: string) =>
  useQuery({
    queryKey: ['analytics', 'payrollComponents', currency],
    queryFn: () => analyticsApi.payrollComponents(currency),
    staleTime: 60_000,
  });

export const useCompliance = () =>
  useQuery({
    queryKey: ['analytics', 'compliance'],
    queryFn: analyticsApi.compliance,
    staleTime: 300_000,
  });

export const useRecentPayRuns = (currency?: string) =>
  useQuery({
    queryKey: ['analytics', 'recentPayRuns', currency],
    queryFn: () => analyticsApi.recentPayRuns(currency),
    staleTime: 60_000,
  });

export const usePayRunSummary = (currency?: string) =>
  useQuery({
    queryKey: ['analytics', 'payRunSummary', currency],
    queryFn: () => analyticsApi.payRunSummary(currency),
    staleTime: 60_000,
  });
