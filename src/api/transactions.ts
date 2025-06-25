import api from "@/lib/axios";
import mockTransactionsAPI from "@/mocks/servers/transactionsMockServer";
import type {
  Transaction,
  TransactionFilters,
  TransactionsResponse,
  CreateTransactionPayload,
  UpdateTransactionPayload,
  BulkTransactionOperation,
  TransactionCategory,
  FileImportPayload,
  FileImportResponse,
} from "@/types/transactions";

// Check if we should use mock data
const USE_MOCK =
  import.meta.env.DEV || import.meta.env.VITE_USE_MOCK === "true";

/**
 * Get transactions with optional filters
 */
export const getTransactions = async (
  filters?: TransactionFilters
): Promise<TransactionsResponse> => {
  if (USE_MOCK) {
    return mockTransactionsAPI.getTransactions(filters);
  }

  const response = await api.get<TransactionsResponse>("/transactions", {
    params: filters,
  });
  return response.data;
};

/**
 * Get a specific transaction by ID
 */
export const getTransactionById = async (
  transactionId: string
): Promise<Transaction> => {
  if (USE_MOCK) {
    return mockTransactionsAPI.getTransactionById(transactionId);
  }

  const response = await api.get<{
    success: boolean;
    transaction: Transaction;
  }>(`/transactions/${transactionId}`);
  return response.data.transaction;
};

/**
 * Create a new manual transaction
 */
export const createTransaction = async (
  payload: CreateTransactionPayload
): Promise<{ message: string; transaction: Transaction }> => {
  if (USE_MOCK) {
    return mockTransactionsAPI.createTransaction(payload);
  }

  const response = await api.post<{
    message: string;
    transaction: Transaction;
  }>("/transactions", payload);
  return response.data;
};

/**
 * Update an existing transaction
 */
export const updateTransaction = async (
  transactionId: string,
  payload: UpdateTransactionPayload
): Promise<{ message: string; transaction: Transaction }> => {
  if (USE_MOCK) {
    return mockTransactionsAPI.updateTransaction(transactionId, payload);
  }

  const response = await api.put<{ message: string; transaction: Transaction }>(
    `/transactions/${transactionId}`,
    payload
  );
  return response.data;
};

/**
 * Delete a transaction
 */
export const deleteTransaction = async (
  transactionId: string
): Promise<{ message: string }> => {
  if (USE_MOCK) {
    return mockTransactionsAPI.deleteTransaction(transactionId);
  }

  const response = await api.delete<{ message: string }>(
    `/transactions/${transactionId}`
  );
  return response.data;
};

/**
 * Bulk operations on multiple transactions
 */
export const bulkTransactionOperations = async (
  operation: BulkTransactionOperation
): Promise<{
  message: string;
  processedCount: number;
  transactions: Transaction[];
}> => {
  if (USE_MOCK) {
    const result = await mockTransactionsAPI.bulkOperations(operation);
    return {
      message: result.message,
      processedCount: result.affectedCount,
      transactions: [], // Mock doesn't return updated transactions in bulk ops
    };
  }

  const response = await api.post<{
    message: string;
    processedCount: number;
    transactions: Transaction[];
  }>("/transactions/bulk", operation);
  return response.data;
};

/**
 * Mark transaction as reconciled
 */
export const reconcileTransaction = async (
  transactionId: string
): Promise<{ message: string; transaction: Transaction }> => {
  if (USE_MOCK) {
    return mockTransactionsAPI.updateTransaction(transactionId, {
      isReconciled: true,
    });
  }

  const response = await api.patch<{
    message: string;
    transaction: Transaction;
  }>(`/transactions/${transactionId}/reconcile`);
  return response.data;
};

/**
 * Mark transaction as cleared
 */
export const clearTransaction = async (
  transactionId: string
): Promise<{ message: string; transaction: Transaction }> => {
  if (USE_MOCK) {
    return mockTransactionsAPI.updateTransaction(transactionId, {
      isCleared: true,
    });
  }

  const response = await api.patch<{
    message: string;
    transaction: Transaction;
  }>(`/transactions/${transactionId}/clear`);
  return response.data;
};

/**
 * Categorize transaction
 */
export const categorizeTransaction = async (
  transactionId: string,
  categoryId: string
): Promise<{ message: string; transaction: Transaction }> => {
  if (USE_MOCK) {
    return mockTransactionsAPI.updateTransaction(transactionId, { categoryId });
  }

  const response = await api.patch<{
    message: string;
    transaction: Transaction;
  }>(`/transactions/${transactionId}/categorize`, { categoryId });
  return response.data;
};

/**
 * Add tags to transaction
 */
export const tagTransaction = async (
  transactionId: string,
  tags: string[]
): Promise<{ message: string; transaction: Transaction }> => {
  if (USE_MOCK) {
    return mockTransactionsAPI.updateTransaction(transactionId, { tags });
  }

  const response = await api.patch<{
    message: string;
    transaction: Transaction;
  }>(`/transactions/${transactionId}/tags`, { tags });
  return response.data;
};

/**
 * Get transaction categories
 */
export const getTransactionCategories = async (): Promise<{
  success: boolean;
  categories: TransactionCategory[];
}> => {
  if (USE_MOCK) {
    const result = await mockTransactionsAPI.getCategories();
    return {
      success: true,
      categories: result.categories,
    };
  }

  const response = await api.get<{
    success: boolean;
    categories: TransactionCategory[];
  }>("/transactions/categories");
  return response.data;
};

/**
 * Create a new transaction category
 */
export const createTransactionCategory = async (payload: {
  name: string;
  color: string;
  icon: string;
  type: "income" | "expense" | "transfer";
  parentId?: string;
}): Promise<{ message: string; category: TransactionCategory }> => {
  if (USE_MOCK) {
    return mockTransactionsAPI.createCategory(payload);
  }

  const response = await api.post<{
    message: string;
    category: TransactionCategory;
  }>("/transactions/categories", payload);
  return response.data;
};

/**
 * Import transactions from file
 */
export const importTransactionFile = async (
  payload: FileImportPayload
): Promise<FileImportResponse> => {
  const formData = new FormData();
  formData.append("file", payload.file);
  formData.append("accountId", payload.accountId);
  formData.append("fileType", payload.fileType);

  if (payload.mapping) {
    formData.append("mapping", JSON.stringify(payload.mapping));
  }

  const response = await api.post<FileImportResponse>(
    "/transactions/import",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

/**
 * Export transactions to CSV
 */
export const exportTransactions = async (
  filters?: TransactionFilters
): Promise<Blob> => {
  const response = await api.get("/transactions/export", {
    params: filters,
    responseType: "blob",
  });
  return response.data;
};

/**
 * Get duplicate transactions
 */
export const getDuplicateTransactions = async (): Promise<{
  success: boolean;
  duplicates: Array<{
    groupId: string;
    transactions: Transaction[];
    confidence: number;
  }>;
}> => {
  const response = await api.get<{
    success: boolean;
    duplicates: Array<{
      groupId: string;
      transactions: Transaction[];
      confidence: number;
    }>;
  }>("/transactions/duplicates");
  return response.data;
};

/**
 * Auto-categorize transactions using machine learning
 */
export const autoCategorizeTransactions = async (
  accountId?: string
): Promise<{
  message: string;
  categorizedCount: number;
  transactions: Transaction[];
}> => {
  const response = await api.post<{
    message: string;
    categorizedCount: number;
    transactions: Transaction[];
  }>("/transactions/auto-categorize", { accountId });
  return response.data;
};
