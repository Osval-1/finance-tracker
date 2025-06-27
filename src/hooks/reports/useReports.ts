import { useQuery } from "@tanstack/react-query";
import { getReportsData, getOverviewStats } from "@/api/reports";
import type { ReportsResponse } from "@/mocks/servers/reportsMockServer";

// Query keys for reports
export const REPORTS_QUERY_KEYS = {
  all: ["reports"] as const,
  data: (period: string) =>
    [...REPORTS_QUERY_KEYS.all, "data", period] as const,
  overview: (period: string) =>
    [...REPORTS_QUERY_KEYS.all, "overview", period] as const,
};

/**
 * Hook to fetch complete reports data
 */
export const useReportsData = (period: string = "this-month") => {
  return useQuery<ReportsResponse>({
    queryKey: REPORTS_QUERY_KEYS.data(period),
    queryFn: () => getReportsData(period),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 15 * 60 * 1000, // 15 minutes
  });
};

/**
 * Hook to fetch overview statistics
 */
export const useOverviewStats = (period: string = "this-month") => {
  return useQuery({
    queryKey: REPORTS_QUERY_KEYS.overview(period),
    queryFn: () => getOverviewStats(period),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
