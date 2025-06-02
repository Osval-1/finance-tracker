export interface Transaction {
  id: string;
  accountId: string;
  date: string;
  amount: number;
  originalAmount?: number;
  originalCurrency?: string;
  merchant: string;
  description: string;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
    color: string;
    icon: string;
  };
  tags: string[];
  notes?: string;
  isCleared: boolean;
  isReconciled: boolean;
  importedFrom: "plaid" | "manual" | "file";
  plaidTransactionId?: string;
  location?: {
    address?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    country?: string;
    lat?: number;
    lon?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  accountId?: string;
  accountIds?: string[];
  categoryId?: string;
  categoryIds?: string[];
  minAmount?: number;
  maxAmount?: number;
  searchTerm?: string;
  merchant?: string;
  tags?: string[];
  isCleared?: boolean;
  isReconciled?: boolean;
  importedFrom?: Transaction["importedFrom"];
  page?: number;
  limit?: number;
  sortBy?: "date" | "amount" | "merchant" | "category";
  sortOrder?: "asc" | "desc";
}

export interface TransactionsResponse {
  success: boolean;
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netAmount: number;
    transactionCount: number;
  };
}

export interface CreateTransactionPayload {
  accountId: string;
  date: string;
  amount: number;
  merchant: string;
  description: string;
  categoryId?: string;
  tags?: string[];
  notes?: string;
  isCleared?: boolean;
}

export interface UpdateTransactionPayload
  extends Partial<CreateTransactionPayload> {
  isReconciled?: boolean;
}

export interface BulkTransactionOperation {
  transactionIds: string[];
  operation: "categorize" | "reconcile" | "delete" | "tag" | "clear";
  data?: {
    categoryId?: string;
    tags?: string[];
    isReconciled?: boolean;
    isCleared?: boolean;
  };
}

export interface TransactionCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  parentId?: string;
  type: "income" | "expense" | "transfer";
  isDefault: boolean;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FileImportPayload {
  file: File;
  accountId: string;
  fileType: "csv" | "ofx" | "qif";
  mapping?: Record<string, string>; // For CSV column mapping
}

export interface FileImportResponse {
  message: string;
  importedCount: number;
  duplicateCount: number;
  errorCount: number;
  transactions: Transaction[];
  errors?: Array<{
    row: number;
    message: string;
  }>;
}
