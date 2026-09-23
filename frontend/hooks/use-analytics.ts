import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api';

export const ANALYTICS_KEY = 'analytics';

export function useAnalyticsSummary() {
  return useQuery({
    queryKey: [ANALYTICS_KEY, 'summary'],
    queryFn: analyticsApi.summary,
    staleTime: 60_000,
  });
}

export function useByDepartment() {
  return useQuery({
    queryKey: [ANALYTICS_KEY, 'by-department'],
    queryFn: analyticsApi.byDepartment,
    staleTime: 60_000,
  });
}

export function useByCountry() {
  return useQuery({
    queryKey: [ANALYTICS_KEY, 'by-country'],
    queryFn: analyticsApi.byCountry,
    staleTime: 60_000,
  });
}

export function useByLevel() {
  return useQuery({
    queryKey: [ANALYTICS_KEY, 'by-level'],
    queryFn: analyticsApi.byLevel,
    staleTime: 60_000,
  });
}

export function useDistribution() {
  return useQuery({
    queryKey: [ANALYTICS_KEY, 'distribution'],
    queryFn: analyticsApi.distribution,
    staleTime: 60_000,
  });
}

export function useByEmploymentType() {
  return useQuery({
    queryKey: [ANALYTICS_KEY, 'by-employment-type'],
    queryFn: analyticsApi.byEmploymentType,
    staleTime: 60_000,
  });
}
