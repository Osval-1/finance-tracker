import { useQuery } from "@tanstack/react-query";
import {
  getBudgets,
  getBudgetById,
  getBudgetSummary,
  getBudgetTrends,
} from "@/api/budgets";
import { BUDGETS_QUERY_KEYS } from "@/constants/query_keys";
import type {
  BudgetFilters,
  BudgetsResponse,
  Budget,
  BudgetSummary,
  BudgetTrend,
} from "@/types/budgets";

/**
 * Hook to fetch all budgets with optional filters
 */
export const useBudgets = (filters?: BudgetFilters) => {
  return useQuery<BudgetsResponse>({
    queryKey: BUDGETS_QUERY_KEYS.list(JSON.stringify(filters || {})),
    queryFn: () => getBudgets(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch a specific budget by ID
 */
export const useBudget = (budgetId: string) => {
  return useQuery<Budget>({
    queryKey: BUDGETS_QUERY_KEYS.detail(budgetId),
    queryFn: () => getBudgetById(budgetId),
    enabled: !!budgetId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch budget summary statistics
 */
export const useBudgetSummary = () => {
  return useQuery<BudgetSummary>({
    queryKey: [...BUDGETS_QUERY_KEYS.all, "summary"],
    queryFn: getBudgetSummary,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 15 * 60 * 1000, // 15 minutes for budget updates
  });
};

/**
 * Hook to fetch budget trends for analytics
 */
export const useBudgetTrends = (
  categoryId?: string,
  period: string = "monthly"
) => {
  return useQuery<BudgetTrend[]>({
    queryKey: [...BUDGETS_QUERY_KEYS.all, "trends", { categoryId, period }],
    queryFn: () => getBudgetTrends(categoryId, period),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
