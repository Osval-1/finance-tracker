import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBudget,
  updateBudget,
  deleteBudget,
  archiveBudget,
  refreshBudgets,
} from "@/api/budgets";
import {
  BUDGETS_QUERY_KEYS,
  TRANSACTIONS_QUERY_KEYS,
  REPORTS_QUERY_KEYS,
} from "@/constants/query_keys";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type { CreateBudgetPayload, BudgetResponse } from "@/types/budgets";

/**
 * Hook to create a new budget
 */
export const useCreateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBudgetPayload) => createBudget(payload),
    onSuccess: (data: BudgetResponse) => {
      // Invalidate budgets queries
      queryClient.invalidateQueries({ queryKey: BUDGETS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: REPORTS_QUERY_KEYS.all });

      toast.success("Budget created successfully");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Failed to create budget";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook to update an existing budget
 */
export const useUpdateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      budgetId,
      payload,
    }: {
      budgetId: string;
      payload: Partial<CreateBudgetPayload>;
    }) => updateBudget(budgetId, payload),
    onSuccess: (data: BudgetResponse, variables) => {
      // Invalidate budgets queries
      queryClient.invalidateQueries({ queryKey: BUDGETS_QUERY_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: BUDGETS_QUERY_KEYS.detail(variables.budgetId),
      });
      queryClient.invalidateQueries({ queryKey: REPORTS_QUERY_KEYS.all });

      toast.success("Budget updated successfully");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Failed to update budget";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook to delete a budget
 */
export const useDeleteBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (budgetId: string) => deleteBudget(budgetId),
    onSuccess: (_, budgetId) => {
      // Invalidate budgets queries
      queryClient.invalidateQueries({ queryKey: BUDGETS_QUERY_KEYS.all });
      queryClient.removeQueries({
        queryKey: BUDGETS_QUERY_KEYS.detail(budgetId),
      });
      queryClient.invalidateQueries({ queryKey: REPORTS_QUERY_KEYS.all });

      toast.success("Budget deleted successfully");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Failed to delete budget";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook to archive a budget
 */
export const useArchiveBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (budgetId: string) => archiveBudget(budgetId),
    onSuccess: (data: BudgetResponse, budgetId) => {
      // Invalidate budgets queries
      queryClient.invalidateQueries({ queryKey: BUDGETS_QUERY_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: BUDGETS_QUERY_KEYS.detail(budgetId),
      });

      toast.success("Budget archived successfully");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Failed to archive budget";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook to refresh budget calculations
 */
export const useRefreshBudgets = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: refreshBudgets,
    onSuccess: () => {
      // Invalidate all budget-related queries
      queryClient.invalidateQueries({ queryKey: BUDGETS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: REPORTS_QUERY_KEYS.all });

      toast.success("Budget calculations refreshed");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Failed to refresh budgets";
      toast.error(errorMessage);
    },
  });
};
