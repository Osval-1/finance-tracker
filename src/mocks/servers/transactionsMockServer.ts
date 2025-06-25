import type {
  Transaction,
  TransactionsResponse,
  TransactionFilters,
  CreateTransactionPayload,
  UpdateTransactionPayload,
  BulkTransactionOperation,
  TransactionCategory,
} from "@/types/transactions";
import {
  dummyTransactions,
  dummyCategories,
  dummyTransactionAnalytics,
} from "../data/transactionsData";

// In-memory state for transactions (persists during session)
const transactions: Transaction[] = [...dummyTransactions];
const categories: TransactionCategory[] = dummyCategories.map((cat) => ({
  ...cat,
  type:
    cat.id === "cat-9"
      ? "income"
      : cat.id === "cat-10"
      ? "transfer"
      : "expense",
  parentId: undefined,
  isDefault: true,
  userId: undefined,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

// Simulate network delay
const delay = (ms: number = Math.random() * 400 + 200) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Helper to apply filters
const applyFilters = (
  transactions: Transaction[],
  filters: TransactionFilters
): Transaction[] => {
  let filtered = transactions;

  if (filters.startDate) {
    filtered = filtered.filter((t) => t.date >= filters.startDate!);
  }

  if (filters.endDate) {
    filtered = filtered.filter((t) => t.date <= filters.endDate!);
  }

  if (filters.accountId) {
    filtered = filtered.filter((t) => t.accountId === filters.accountId);
  }

  if (filters.accountIds?.length) {
    filtered = filtered.filter((t) =>
      filters.accountIds!.includes(t.accountId)
    );
  }

  if (filters.categoryId) {
    filtered = filtered.filter((t) => t.categoryId === filters.categoryId);
  }

  if (filters.categoryIds?.length) {
    filtered = filtered.filter((t) =>
      filters.categoryIds!.includes(t.categoryId || "")
    );
  }

  if (filters.minAmount !== undefined) {
    filtered = filtered.filter((t) => Math.abs(t.amount) >= filters.minAmount!);
  }

  if (filters.maxAmount !== undefined) {
    filtered = filtered.filter((t) => Math.abs(t.amount) <= filters.maxAmount!);
  }

  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.merchant.toLowerCase().includes(term) ||
        t.description.toLowerCase().includes(term) ||
        t.notes?.toLowerCase().includes(term) ||
        t.tags.some((tag) => tag.toLowerCase().includes(term))
    );
  }

  if (filters.merchant) {
    filtered = filtered.filter((t) =>
      t.merchant.toLowerCase().includes(filters.merchant!.toLowerCase())
    );
  }

  if (filters.tags?.length) {
    filtered = filtered.filter((t) =>
      filters.tags!.some((tag) => t.tags.includes(tag))
    );
  }

  if (filters.isCleared !== undefined) {
    filtered = filtered.filter((t) => t.isCleared === filters.isCleared);
  }

  if (filters.isReconciled !== undefined) {
    filtered = filtered.filter((t) => t.isReconciled === filters.isReconciled);
  }

  if (filters.importedFrom) {
    filtered = filtered.filter((t) => t.importedFrom === filters.importedFrom);
  }

  // Sorting
  const sortBy = filters.sortBy || "date";
  const sortOrder = filters.sortOrder || "desc";

  filtered.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "date":
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case "amount":
        comparison = Math.abs(a.amount) - Math.abs(b.amount);
        break;
      case "merchant":
        comparison = a.merchant.localeCompare(b.merchant);
        break;
      case "category": {
        const catA = categories.find((c) => c.id === a.categoryId)?.name || "";
        const catB = categories.find((c) => c.id === b.categoryId)?.name || "";
        comparison = catA.localeCompare(catB);
        break;
      }
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  return filtered;
};

// Helper to calculate summary
const calculateSummary = (transactions: Transaction[]) => {
  const totalIncome = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = Math.abs(
    transactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0)
  );

  return {
    totalIncome,
    totalExpenses,
    netAmount: totalIncome - totalExpenses,
    transactionCount: transactions.length,
  };
};

// Mock API functions
export const mockTransactionsAPI = {
  // GET /transactions
  getTransactions: async (
    filters: TransactionFilters = {}
  ): Promise<TransactionsResponse> => {
    await delay();

    const filtered = applyFilters(transactions, filters);
    const page = filters.page || 1;
    const limit = filters.limit || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedTransactions = filtered.slice(startIndex, endIndex);

    // Add category details to transactions
    const transactionsWithCategories = paginatedTransactions.map((t) => ({
      ...t,
      category: categories.find((c) => c.id === t.categoryId),
    }));

    return {
      success: true,
      transactions: transactionsWithCategories,
      pagination: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit),
      },
      summary: calculateSummary(filtered),
    };
  },

  // GET /transactions/:id
  getTransactionById: async (transactionId: string): Promise<Transaction> => {
    await delay();

    const transaction = transactions.find((t) => t.id === transactionId);
    if (!transaction) {
      throw new Error(`Transaction with ID ${transactionId} not found`);
    }

    return {
      ...transaction,
      category: categories.find((c) => c.id === transaction.categoryId),
    };
  },

  // POST /transactions
  createTransaction: async (
    payload: CreateTransactionPayload
  ): Promise<{ message: string; transaction: Transaction }> => {
    await delay();

    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      accountId: payload.accountId,
      date: payload.date,
      amount: payload.amount,
      merchant: payload.merchant,
      description: payload.description,
      categoryId: payload.categoryId,
      tags: payload.tags || [],
      notes: payload.notes,
      isCleared: payload.isCleared || false,
      isReconciled: false,
      importedFrom: "manual",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    transactions.unshift(newTransaction); // Add to beginning for newest first

    return {
      message: "Transaction created successfully",
      transaction: {
        ...newTransaction,
        category: categories.find((c) => c.id === newTransaction.categoryId),
      },
    };
  },

  // PUT /transactions/:id
  updateTransaction: async (
    transactionId: string,
    payload: UpdateTransactionPayload
  ): Promise<{ message: string; transaction: Transaction }> => {
    await delay();

    const transactionIndex = transactions.findIndex(
      (t) => t.id === transactionId
    );
    if (transactionIndex === -1) {
      throw new Error(`Transaction with ID ${transactionId} not found`);
    }

    const updatedTransaction = {
      ...transactions[transactionIndex],
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    transactions[transactionIndex] = updatedTransaction;

    return {
      message: "Transaction updated successfully",
      transaction: {
        ...updatedTransaction,
        category: categories.find(
          (c) => c.id === updatedTransaction.categoryId
        ),
      },
    };
  },

  // DELETE /transactions/:id
  deleteTransaction: async (
    transactionId: string
  ): Promise<{ message: string }> => {
    await delay();

    const transactionIndex = transactions.findIndex(
      (t) => t.id === transactionId
    );
    if (transactionIndex === -1) {
      throw new Error(`Transaction with ID ${transactionId} not found`);
    }

    transactions.splice(transactionIndex, 1);

    return {
      message: "Transaction deleted successfully",
    };
  },

  // POST /transactions/bulk
  bulkOperations: async (
    payload: BulkTransactionOperation
  ): Promise<{ message: string; affectedCount: number }> => {
    await delay();

    const { transactionIds, operation, data } = payload;
    let affectedCount = 0;

    for (const transactionId of transactionIds) {
      const transactionIndex = transactions.findIndex(
        (t) => t.id === transactionId
      );
      if (transactionIndex === -1) continue;

      const transaction = transactions[transactionIndex];

      switch (operation) {
        case "categorize":
          if (data?.categoryId) {
            transactions[transactionIndex] = {
              ...transaction,
              categoryId: data.categoryId,
              updatedAt: new Date().toISOString(),
            };
            affectedCount++;
          }
          break;

        case "reconcile":
          transactions[transactionIndex] = {
            ...transaction,
            isReconciled: data?.isReconciled ?? true,
            updatedAt: new Date().toISOString(),
          };
          affectedCount++;
          break;

        case "clear":
          transactions[transactionIndex] = {
            ...transaction,
            isCleared: data?.isCleared ?? true,
            updatedAt: new Date().toISOString(),
          };
          affectedCount++;
          break;

        case "tag":
          if (data?.tags) {
            const existingTags = transaction.tags || [];
            const newTags = [...new Set([...existingTags, ...data.tags])];
            transactions[transactionIndex] = {
              ...transaction,
              tags: newTags,
              updatedAt: new Date().toISOString(),
            };
            affectedCount++;
          }
          break;

        case "delete":
          transactions.splice(transactionIndex, 1);
          affectedCount++;
          break;
      }
    }

    return {
      message: `Bulk operation completed. ${affectedCount} transactions affected.`,
      affectedCount,
    };
  },

  // GET /transactions/categories
  getCategories: async (): Promise<{ categories: TransactionCategory[] }> => {
    await delay();
    return { categories };
  },

  // POST /transactions/categories
  createCategory: async (payload: {
    name: string;
    color: string;
    icon: string;
    type: "income" | "expense" | "transfer";
    parentId?: string;
  }): Promise<{ message: string; category: TransactionCategory }> => {
    await delay();

    const newCategory: TransactionCategory = {
      id: `cat-${Date.now()}`,
      name: payload.name,
      color: payload.color,
      icon: payload.icon,
      type: payload.type,
      parentId: payload.parentId,
      isDefault: false,
      userId: "user-1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    categories.push(newCategory);

    return {
      message: "Category created successfully",
      category: newCategory,
    };
  },

  // GET /transactions/analytics
  getAnalytics: async (filters: TransactionFilters = {}) => {
    await delay();

    const filtered = applyFilters(transactions, filters);

    return {
      success: true,
      analytics: {
        ...dummyTransactionAnalytics,
        totalTransactions: filtered.length,
        summary: calculateSummary(filtered),
        topMerchants: getTopMerchants(filtered),
        spendingByCategory: getSpendingByCategory(filtered),
      },
    };
  },

  // GET /transactions/export
  exportTransactions: async (
    filters: TransactionFilters = {},
    format: "csv" | "json" = "csv"
  ) => {
    await delay(1000); // Longer delay for export

    const filtered = applyFilters(transactions, filters);

    if (format === "csv") {
      const csvData = generateCSV(filtered);
      return {
        success: true,
        data: csvData,
        filename: `transactions-${new Date().toISOString().split("T")[0]}.csv`,
        contentType: "text/csv",
      };
    } else {
      return {
        success: true,
        data: JSON.stringify(filtered, null, 2),
        filename: `transactions-${new Date().toISOString().split("T")[0]}.json`,
        contentType: "application/json",
      };
    }
  },
};

// Helper functions
function getTopMerchants(transactions: Transaction[], limit = 10) {
  const merchantTotals = transactions.reduce((acc, t) => {
    if (!acc[t.merchant]) {
      acc[t.merchant] = { count: 0, total: 0 };
    }
    acc[t.merchant].count++;
    acc[t.merchant].total += Math.abs(t.amount);
    return acc;
  }, {} as Record<string, { count: number; total: number }>);

  return Object.entries(merchantTotals)
    .sort(([, a], [, b]) => b.total - a.total)
    .slice(0, limit)
    .map(([merchant, data]) => ({ merchant, ...data }));
}

function getSpendingByCategory(transactions: Transaction[]) {
  const categoryTotals = transactions.reduce((acc, t) => {
    const categoryId = t.categoryId || "uncategorized";
    if (!acc[categoryId]) {
      acc[categoryId] = { count: 0, total: 0 };
    }
    acc[categoryId].count++;
    acc[categoryId].total += Math.abs(t.amount);
    return acc;
  }, {} as Record<string, { count: number; total: number }>);

  return Object.entries(categoryTotals).map(([categoryId, data]) => {
    const category = categories.find((c) => c.id === categoryId);
    return {
      categoryId,
      categoryName: category?.name || "Uncategorized",
      categoryColor: category?.color || "#6B7280",
      ...data,
    };
  });
}

function generateCSV(transactions: Transaction[]): string {
  const headers = [
    "Date",
    "Merchant",
    "Description",
    "Amount",
    "Category",
    "Account ID",
    "Tags",
    "Notes",
    "Cleared",
    "Reconciled",
  ];

  const rows = transactions.map((t) => [
    t.date,
    t.merchant,
    t.description,
    t.amount.toString(),
    categories.find((c) => c.id === t.categoryId)?.name || "",
    t.accountId,
    t.tags.join(";"),
    t.notes || "",
    t.isCleared.toString(),
    t.isReconciled.toString(),
  ]);

  return [headers, ...rows]
    .map((row) => row.map(escapeCSVField).join(","))
    .join("\n");
}

function escapeCSVField(field: string): string {
  if (field.includes(",") || field.includes('"') || field.includes("\n")) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

// Export for use in API layer
export default mockTransactionsAPI;
