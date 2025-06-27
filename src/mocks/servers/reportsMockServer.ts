import type {
  ReportSummary,
  ExpenseCategory,
  MonthlyTrend,
  TopMerchant,
  TopSpendingAccount,
} from "../data/reportsData";
import {
  dummyReportSummary,
  dummyExpenseCategories,
  dummyMonthlyTrends,
  dummyTopMerchants,
  dummyTopSpendingAccounts,
} from "../data/reportsData";

// Helper function to simulate network delay
const delay = (ms: number = 300): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export interface ReportsResponse {
  success: boolean;
  data: {
    summary: ReportSummary;
    expenseCategories: ExpenseCategory[];
    monthlyTrends: MonthlyTrend[];
    topMerchants: TopMerchant[];
    topSpendingAccounts: TopSpendingAccount[];
  };
}

export const mockReportsAPI = {
  /**
   * Get complete reports data
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getReportsData: async (
    _period: string = "this-month"
  ): Promise<ReportsResponse> => {
    await delay();

    // In a real app, you would filter data based on the period
    // For mock purposes, we'll return the same data regardless of period

    return {
      success: true,
      data: {
        summary: dummyReportSummary,
        expenseCategories: dummyExpenseCategories,
        monthlyTrends: dummyMonthlyTrends,
        topMerchants: dummyTopMerchants,
        topSpendingAccounts: dummyTopSpendingAccounts,
      },
    };
  },

  /**
   * Get overview statistics
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getOverviewStats: async (
    _period: string = "this-month"
  ): Promise<{
    success: boolean;
    summary: ReportSummary;
  }> => {
    await delay(200);

    return {
      success: true,
      summary: dummyReportSummary,
    };
  },

  /**
   * Get expense categories breakdown
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getExpenseCategories: async (
    _period: string = "this-month"
  ): Promise<{
    success: boolean;
    categories: ExpenseCategory[];
  }> => {
    await delay(250);

    return {
      success: true,
      categories: dummyExpenseCategories,
    };
  },

  /**
   * Get monthly trends
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getMonthlyTrends: async (
    _period: string = "this-year"
  ): Promise<{
    success: boolean;
    trends: MonthlyTrend[];
  }> => {
    await delay(200);

    return {
      success: true,
      trends: dummyMonthlyTrends,
    };
  },

  /**
   * Get top merchants
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getTopMerchants: async (
    _period: string = "this-month"
  ): Promise<{
    success: boolean;
    merchants: TopMerchant[];
  }> => {
    await delay(200);

    return {
      success: true,
      merchants: dummyTopMerchants,
    };
  },

  /**
   * Get top spending accounts
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getTopSpendingAccounts: async (
    _period: string = "this-month"
  ): Promise<{
    success: boolean;
    accounts: TopSpendingAccount[];
  }> => {
    await delay(200);

    return {
      success: true,
      accounts: dummyTopSpendingAccounts,
    };
  },

  /**
   * Export reports data
   */
  exportReports: async (
    format: "csv" | "pdf",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _period: string = "this-month"
  ): Promise<Blob> => {
    await delay(600);

    const data =
      format === "csv"
        ? "category,amount,percentage\n" +
          dummyExpenseCategories
            .map((c) => `${c.name},${c.amount},${c.percentage}`)
            .join("\n")
        : JSON.stringify(
            {
              summary: dummyReportSummary,
              categories: dummyExpenseCategories,
              trends: dummyMonthlyTrends,
            },
            null,
            2
          );

    return new Blob([data], {
      type: format === "csv" ? "text/csv" : "application/json",
    });
  },
};

export default mockReportsAPI;
