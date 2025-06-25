import api from "@/lib/axios";
import type {
  Budget,
  BudgetsResponse,
  BudgetResponse,
  CreateBudgetPayload,
  BudgetFilters,
  BudgetSummary,
  BudgetTrend,
} from "@/types/budgets";

// Import mock API for development
import { mockBudgetAPI } from "@/mocks/simpleMockServer";

// Determine if we should use mock data
const USE_MOCK =
  import.meta.env.DEV || import.meta.env.VITE_USE_MOCK === "true";

/**
 * Get all budgets with optional filters
 */
export const getBudgets = async (
  filters?: BudgetFilters
): Promise<BudgetsResponse> => {
  if (USE_MOCK) {
    return mockBudgetAPI.getBudgets(filters);
  }

  const response = await api.get<BudgetsResponse>("/budgets", {
    params: filters,
  });
  return response.data;
};

/**
 * Get a specific budget by ID
 */
export const getBudgetById = async (budgetId: string): Promise<Budget> => {
  if (USE_MOCK) {
    return mockBudgetAPI.getBudgetById(budgetId);
  }

  const response = await api.get<BudgetResponse>(`/budgets/${budgetId}`);
  return response.data.budget;
};

/**
 * Create a new budget
 */
export const createBudget = async (
  payload: CreateBudgetPayload
): Promise<BudgetResponse> => {
  if (USE_MOCK) {
    return mockBudgetAPI.createBudget(payload);
  }

  const response = await api.post<BudgetResponse>("/budgets", payload);
  return response.data;
};

/**
 * Update an existing budget
 */
export const updateBudget = async (
  budgetId: string,
  payload: Partial<CreateBudgetPayload>
): Promise<BudgetResponse> => {
  if (USE_MOCK) {
    return mockBudgetAPI.updateBudget(budgetId, payload);
  }

  const response = await api.put<BudgetResponse>(
    `/budgets/${budgetId}`,
    payload
  );
  return response.data;
};

/**
 * Delete a budget (soft delete)
 */
export const deleteBudget = async (budgetId: string): Promise<void> => {
  if (USE_MOCK) {
    return mockBudgetAPI.deleteBudget(budgetId);
  }

  await api.delete(`/budgets/${budgetId}`);
};

/**
 * Archive a budget (set isActive to false)
 */
export const archiveBudget = async (
  budgetId: string
): Promise<BudgetResponse> => {
  if (USE_MOCK) {
    return mockBudgetAPI.archiveBudget(budgetId);
  }

  const response = await api.patch<BudgetResponse>(
    `/budgets/${budgetId}/archive`
  );
  return response.data;
};

/**
 * Get budget summary statistics
 */
export const getBudgetSummary = async (): Promise<BudgetSummary> => {
  if (USE_MOCK) {
    return mockBudgetAPI.getBudgetSummary();
  }

  const response = await api.get<{ success: boolean; summary: BudgetSummary }>(
    "/budgets/summary"
  );
  return response.data.summary;
};

/**
 * Get budget spending trends for analytics
 */
export const getBudgetTrends = async (
  categoryId?: string,
  period: string = "monthly"
): Promise<BudgetTrend[]> => {
  if (USE_MOCK) {
    return mockBudgetAPI.getBudgetTrends(categoryId, period);
  }

  const response = await api.get<{ success: boolean; trends: BudgetTrend[] }>(
    "/budgets/trends",
    {
      params: { categoryId, period },
    }
  );
  return response.data.trends;
};

/**
 * Refresh budget calculations (recalculate spent amounts)
 */
export const refreshBudgets = async (): Promise<BudgetsResponse> => {
  if (USE_MOCK) {
    return mockBudgetAPI.refreshBudgets();
  }

  const response = await api.post<BudgetsResponse>("/budgets/refresh");
  return response.data;
};

/**
 * Get budget progress for a specific period
 */
export const getBudgetProgress = async (
  budgetId: string,
  startDate: string,
  endDate: string
): Promise<{
  budgetId: string;
  period: string;
  budgeted: number;
  spent: number;
  remaining: number;
  percentUsed: number;
  dailySpendingAverage: number;
  projectedTotal: number;
}> => {
  if (USE_MOCK) {
    return mockBudgetAPI.getBudgetProgress(budgetId, startDate, endDate);
  }

  const response = await api.get(`/budgets/${budgetId}/progress`, {
    params: { startDate, endDate },
  });
  return response.data;
};

/**
 * Export budgets data
 */
export const exportBudgets = async (
  format: "csv" | "pdf",
  filters?: BudgetFilters
): Promise<Blob> => {
  if (USE_MOCK) {
    return mockBudgetAPI.exportBudgets(format, filters);
  }

  const response = await api.get(`/budgets/export/${format}`, {
    params: filters,
    responseType: "blob",
  });
  return response.data;
};

/**
 * Get budget analytics data
 */
export const getBudgetAnalytics = async (
  period: string = "monthly"
): Promise<{
  averageSpending: number;
  budgetCompliance: number;
  topCategories: Array<{
    categoryId: string;
    categoryName: string;
    totalSpent: number;
    totalBudgeted: number;
    variance: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    totalBudgeted: number;
    totalSpent: number;
    variance: number;
  }>;
}> => {
  if (USE_MOCK) {
    return mockBudgetAPI.getBudgetAnalytics(period);
  }

  const response = await api.get("/budgets/analytics", {
    params: { period },
  });
  return response.data;
};
