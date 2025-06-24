import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBudget,
  updateBudget,
  deleteBudget,
  archiveBudget,
  refreshBudgets,
  exportBudgets,
} from "@/api/budgets";
import {
  BUDGETS_QUERY_KEYS,
  TRANSACTIONS_QUERY_KEYS,
  REPORTS_QUERY_KEYS,
} from "@/constants/query_keys";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type { CreateBudgetPayload, BudgetFilters } from "@/types/budgets";

/**
 * Hook to create a new budget
 */
export const useCreateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBudgetPayload) => createBudget(payload),
    onSuccess: () => {
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
    onSuccess: (_, variables) => {
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
    onSuccess: (_, budgetId) => {
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

/**
 * Hook to export budgets data
 */
export const useExportBudgets = () => {
  return useMutation({
    mutationFn: ({
      format,
      filters,
    }: {
      format: "csv" | "pdf";
      filters?: BudgetFilters;
    }) => exportBudgets(format, filters),
    onSuccess: (blob, variables) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `budgets-export.${variables.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(
        `Budget data exported as ${variables.format.toUpperCase()}`
      );
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Failed to export budget data";
      toast.error(errorMessage);
    },
  });
};
