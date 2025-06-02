import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";

import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  bulkTransactionOperations,
  reconcileTransaction,
  clearTransaction,
  categorizeTransaction,
  tagTransaction,
  getTransactionCategories,
  createTransactionCategory,
  importTransactionFile,
  exportTransactions,
  getDuplicateTransactions,
  autoCategorizeTransactions,
} from "@/api/transactions";
import {
  TRANSACTIONS_QUERY_KEYS,
  ACCOUNTS_QUERY_KEYS,
} from "@/constants/query_keys";
import type {
  TransactionsResponse,
  Transaction,
  TransactionFilters,
  CreateTransactionPayload,
  UpdateTransactionPayload,
  BulkTransactionOperation,
  FileImportPayload,
} from "@/types/transactions";

/**
 * Get transactions with optional filters
 */
export const useTransactions = (filters?: TransactionFilters) => {
  return useQuery<TransactionsResponse>({
    queryKey: TRANSACTIONS_QUERY_KEYS.list(
      (filters as Record<string, unknown>) || {}
    ),
    queryFn: () => getTransactions(filters),
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new filtered results
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Get a specific transaction by ID
 */
export const useTransaction = (transactionId: string) => {
  return useQuery<Transaction>({
    queryKey: TRANSACTIONS_QUERY_KEYS.detail(transactionId),
    queryFn: () => getTransactionById(transactionId),
    enabled: !!transactionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Get transaction categories
 */
export const useTransactionCategories = () => {
  return useQuery({
    queryKey: TRANSACTIONS_QUERY_KEYS.categories,
    queryFn: getTransactionCategories,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Get duplicate transactions
 */
export const useDuplicateTransactions = () => {
  return useQuery({
    queryKey: TRANSACTIONS_QUERY_KEYS.duplicates,
    queryFn: getDuplicateTransactions,
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: false, // Only fetch when explicitly needed
  });
};

/**
 * Create a new manual transaction
 */
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTransactionPayload) =>
      createTransaction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEYS.all });
      toast.success("Transaction created successfully");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Failed to create transaction";
      toast.error(errorMessage);
    },
  });
};

/**
 * Update an existing transaction
 */
export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      transactionId,
      payload,
    }: {
      transactionId: string;
      payload: UpdateTransactionPayload;
    }) => updateTransaction(transactionId, payload),
    onSuccess: (_, { transactionId }) => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: TRANSACTIONS_QUERY_KEYS.detail(transactionId),
      });
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEYS.all });
      toast.success("Transaction updated successfully");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Failed to update transaction";
      toast.error(errorMessage);
    },
  });
};

/**
 * Delete a transaction
 */
export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionId: string) => deleteTransaction(transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEYS.all });
      toast.success("Transaction deleted successfully");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Failed to delete transaction";
      toast.error(errorMessage);
    },
  });
};

/**
 * Bulk operations on transactions
 */
export const useBulkTransactionOperations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (operation: BulkTransactionOperation) =>
      bulkTransactionOperations(operation),
    onSuccess: (data, operation) => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEYS.all });
      if (
        operation.operation === "categorize" ||
        operation.operation === "reconcile"
      ) {
        queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEYS.all });
      }
      toast.success(
        `Successfully processed ${data.processedCount} transaction(s)`
      );
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Failed to process transactions";
      toast.error(errorMessage);
    },
  });
};

/**
 * Reconcile a transaction
 */
export const useReconcileTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionId: string) => reconcileTransaction(transactionId),
    onSuccess: (_, transactionId) => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: TRANSACTIONS_QUERY_KEYS.detail(transactionId),
      });
      toast.success("Transaction reconciled successfully");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Failed to reconcile transaction";
      toast.error(errorMessage);
    },
  });
};

/**
 * Clear a transaction
 */
export const useClearTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionId: string) => clearTransaction(transactionId),
    onSuccess: (_, transactionId) => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: TRANSACTIONS_QUERY_KEYS.detail(transactionId),
      });
      toast.success("Transaction cleared successfully");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Failed to clear transaction";
      toast.error(errorMessage);
    },
  });
};

/**
 * Categorize a transaction
 */
export const useCategorizeTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      transactionId,
      categoryId,
    }: {
      transactionId: string;
      categoryId: string;
    }) => categorizeTransaction(transactionId, categoryId),
    onSuccess: (_, { transactionId }) => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: TRANSACTIONS_QUERY_KEYS.detail(transactionId),
      });
      toast.success("Transaction categorized successfully");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Failed to categorize transaction";
      toast.error(errorMessage);
    },
  });
};

/**
 * Add tags to transaction
 */
export const useTagTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      transactionId,
      tags,
    }: {
      transactionId: string;
      tags: string[];
    }) => tagTransaction(transactionId, tags),
    onSuccess: (_, { transactionId }) => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: TRANSACTIONS_QUERY_KEYS.detail(transactionId),
      });
      toast.success("Transaction tags updated successfully");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Failed to update transaction tags";
      toast.error(errorMessage);
    },
  });
};

/**
 * Create a new transaction category
 */
export const useCreateTransactionCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      name: string;
      color: string;
      icon: string;
      type: "income" | "expense" | "transfer";
      parentId?: string;
    }) => createTransactionCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: TRANSACTIONS_QUERY_KEYS.categories,
      });
      toast.success("Category created successfully");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Failed to create category";
      toast.error(errorMessage);
    },
  });
};

/**
 * Import transactions from file
 */
export const useFileImport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: FileImportPayload) => importTransactionFile(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEYS.all });
      toast.success(
        `Successfully imported ${data.importedCount} transactions. ${data.duplicateCount} duplicates skipped.`
      );
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Failed to import transaction file";
      toast.error(errorMessage);
    },
  });
};

/**
 * Auto-categorize transactions using machine learning
 */
export const useAutoCategorizeTransactions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accountId?: string) => autoCategorizeTransactions(accountId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEYS.all });
      toast.success(
        `Successfully categorized ${data.categorizedCount} transaction(s)`
      );
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Failed to auto-categorize transactions";
      toast.error(errorMessage);
    },
  });
};

/**
 * Export transactions to CSV
 */
export const useExportTransactions = () => {
  return useMutation({
    mutationFn: (filters?: TransactionFilters) => exportTransactions(filters),
    onSuccess: (blob) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `transactions_export_${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Transactions exported successfully");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Failed to export transactions";
      toast.error(errorMessage);
    },
  });
};
