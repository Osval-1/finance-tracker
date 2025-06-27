import mockReportsAPI from "@/mocks/servers/reportsMockServer";
import type { ReportsResponse } from "@/mocks/servers/reportsMockServer";

// Determine if we should use mock data
const USE_MOCK =
  import.meta.env.DEV || import.meta.env.VITE_USE_MOCK === "true";

/**
 * Get complete reports data
 */
export const getReportsData = async (
  period: string = "this-month"
): Promise<ReportsResponse> => {
  if (USE_MOCK) {
    return mockReportsAPI.getReportsData(period);
  }

  // In a real app, this would make an actual API call
  throw new Error("Real API not implemented yet");
};

/**
 * Get overview statistics
 */
export const getOverviewStats = async (period: string = "this-month") => {
  if (USE_MOCK) {
    return mockReportsAPI.getOverviewStats(period);
  }

  throw new Error("Real API not implemented yet");
};

/**
 * Get expense categories breakdown
 */
export const getExpenseCategories = async (period: string = "this-month") => {
  if (USE_MOCK) {
    return mockReportsAPI.getExpenseCategories(period);
  }

  throw new Error("Real API not implemented yet");
};

/**
 * Get monthly trends
 */
export const getMonthlyTrends = async (period: string = "this-year") => {
  if (USE_MOCK) {
    return mockReportsAPI.getMonthlyTrends(period);
  }

  throw new Error("Real API not implemented yet");
};

/**
 * Get top merchants
 */
export const getTopMerchants = async (period: string = "this-month") => {
  if (USE_MOCK) {
    return mockReportsAPI.getTopMerchants(period);
  }

  throw new Error("Real API not implemented yet");
};

/**
 * Get top spending accounts
 */
export const getTopSpendingAccounts = async (period: string = "this-month") => {
  if (USE_MOCK) {
    return mockReportsAPI.getTopSpendingAccounts(period);
  }

  throw new Error("Real API not implemented yet");
};

/**
 * Export reports data
 */
export const exportReports = async (
  format: "csv" | "pdf",
  period: string = "this-month"
): Promise<Blob> => {
  if (USE_MOCK) {
    return mockReportsAPI.exportReports(format, period);
  }

  throw new Error("Real API not implemented yet");
};
