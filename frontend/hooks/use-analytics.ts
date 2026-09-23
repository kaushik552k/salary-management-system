import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api';

export const useAnalyticsSummary = () =>
  useQuery({ queryKey: ['analytics', 'summary'], queryFn: analyticsApi.summary, staleTime: 60_000 });

export const useByDepartment = () =>
  useQuery({ queryKey: ['analytics', 'byDepartment'], queryFn: analyticsApi.byDepartment, staleTime: 60_000 });

export const useByCountry = () =>
  useQuery({ queryKey: ['analytics', 'byCountry'], queryFn: analyticsApi.byCountry, staleTime: 60_000 });

export const useByLevel = () =>
  useQuery({ queryKey: ['analytics', 'byLevel'], queryFn: analyticsApi.byLevel, staleTime: 60_000 });

export const useDistribution = () =>
  useQuery({ queryKey: ['analytics', 'distribution'], queryFn: analyticsApi.distribution, staleTime: 60_000 });

export const useByEmploymentType = () =>
  useQuery({ queryKey: ['analytics', 'byEmploymentType'], queryFn: analyticsApi.byEmploymentType, staleTime: 60_000 });

export const usePayrollTrend = () =>
  useQuery({ queryKey: ['analytics', 'payrollTrend'], queryFn: analyticsApi.payrollTrend, staleTime: 60_000 });

export const usePayrollComponents = () =>
  useQuery({ queryKey: ['analytics', 'payrollComponents'], queryFn: analyticsApi.payrollComponents, staleTime: 60_000 });

export const useCompliance = () =>
  useQuery({ queryKey: ['analytics', 'compliance'], queryFn: analyticsApi.compliance, staleTime: 300_000 });

export const useRecentPayRuns = () =>
  useQuery({ queryKey: ['analytics', 'recentPayRuns'], queryFn: analyticsApi.recentPayRuns, staleTime: 60_000 });

export const usePayRunSummary = () =>
  useQuery({ queryKey: ['analytics', 'payRunSummary'], queryFn: analyticsApi.payRunSummary, staleTime: 60_000 });
