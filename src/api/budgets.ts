import api from "@/lib/axios";
import type {
  Budget,
  BudgetsResponse,
  BudgetResponse,
  CreateBudgetPayload,
  UpdateBudgetPayload,
  BudgetFilters,
  BudgetSummary,
  BudgetTrend,
} from "@/types/budgets";

/**
 * Get all budgets with optional filters
 */
export const getBudgets = async (
  filters?: BudgetFilters
): Promise<BudgetsResponse> => {
  const response = await api.get<BudgetsResponse>("/budgets", {
    params: filters,
  });
  return response.data;
};

/**
 * Get a specific budget by ID
 */
export const getBudgetById = async (budgetId: string): Promise<Budget> => {
  const response = await api.get<BudgetResponse>(`/budgets/${budgetId}`);
  return response.data.budget;
};

/**
 * Create a new budget
 */
export const createBudget = async (
  payload: CreateBudgetPayload
): Promise<BudgetResponse> => {
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
  await api.delete(`/budgets/${budgetId}`);
};

/**
 * Archive a budget (set isActive to false)
 */
export const archiveBudget = async (
  budgetId: string
): Promise<BudgetResponse> => {
  const response = await api.patch<BudgetResponse>(
    `/budgets/${budgetId}/archive`
  );
  return response.data;
};

/**
 * Get budget summary statistics
 */
export const getBudgetSummary = async (): Promise<BudgetSummary> => {
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
  const response = await api.get(`/budgets/${budgetId}/progress`, {
    params: { startDate, endDate },
  });
  return response.data;
};
