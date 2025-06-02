import React, { useState } from "react";
import { Plus, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  useTransactions,
  useTransactionCategories,
  useDeleteTransaction,
  useExportTransactions,
  useBulkTransactionOperations,
} from "@/hooks/transactions/useTransactions";
import { useAccounts } from "@/hooks/accounts/useAccounts";
import type { TransactionFilters } from "@/types/transactions";

// Import transaction feature components
import {
  TransactionFilters as FilterComponent,
  TransactionSummaryCards,
  TransactionBulkActions,
  TransactionTable,
} from "@/components/features/transactions";

const TransactionsListScreen = () => {
  const [filters, setFilters] = useState<TransactionFilters>({
    page: 1,
    limit: 25,
    sortBy: "date",
    sortOrder: "desc",
  });
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");

  const { data: transactionsData, isLoading, error } = useTransactions(filters);
  const { data: accountsData } = useAccounts();
  const { data: categoriesData } = useTransactionCategories();
  const deleteTransactionMutation = useDeleteTransaction();
  const exportTransactionsMutation = useExportTransactions();
  const bulkOperationsMutation = useBulkTransactionOperations();

  const transactions = transactionsData?.transactions || [];
  const accounts = accountsData?.accounts || [];
  const categories = categoriesData?.categories || [];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setFilters((prev) => ({
      ...prev,
      searchTerm: term || undefined,
      page: 1,
    }));
  };

  const handleFilterChange = (
    key: keyof TransactionFilters,
    value: string | number
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleSelectTransaction = (transactionId: string, checked: boolean) => {
    if (checked) {
      setSelectedTransactions((prev) => [...prev, transactionId]);
    } else {
      setSelectedTransactions((prev) =>
        prev.filter((id) => id !== transactionId)
      );
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTransactions(transactions.map((t) => t.id));
    } else {
      setSelectedTransactions([]);
    }
  };

  const handleDeleteTransaction = (transactionId: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      deleteTransactionMutation.mutate(transactionId);
    }
  };

  const handleBulkOperation = (
    operation: "delete" | "categorize" | "clear"
  ) => {
    if (selectedTransactions.length === 0) return;

    bulkOperationsMutation.mutate({
      transactionIds: selectedTransactions,
      operation,
    });
    setSelectedTransactions([]);
  };

  const handleExport = () => {
    exportTransactionsMutation.mutate(filters);
  };

  const pagination = transactionsData?.pagination;

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load transactions. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Transactions</h1>
          <p className="text-gray-600">
            View and manage all your financial transactions
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={exportTransactionsMutation.isPending}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {transactionsData?.summary && (
        <TransactionSummaryCards summary={transactionsData.summary} />
      )}

      {/* Filters */}
      <FilterComponent
        filters={filters}
        searchTerm={searchTerm}
        accounts={accounts}
        categories={categories}
        onSearchChange={handleSearch}
        onFilterChange={handleFilterChange}
      />

      {/* Bulk Actions */}
      <TransactionBulkActions
        selectedCount={selectedTransactions.length}
        onCategorize={() => handleBulkOperation("categorize")}
        onMarkCleared={() => handleBulkOperation("clear")}
        onDelete={() => handleBulkOperation("delete")}
        onExport={handleExport}
        showExport={true}
        isLoading={bulkOperationsMutation.isPending}
      />

      {/* Transactions Table */}
      <TransactionTable
        transactions={transactions}
        accounts={accounts}
        categories={categories}
        selectedTransactions={selectedTransactions}
        pagination={pagination}
        onSelectTransaction={handleSelectTransaction}
        onSelectAll={handleSelectAll}
        onEditTransaction={(id) => console.log("Edit transaction", id)}
        onCategorizeTransaction={(id) =>
          console.log("Categorize transaction", id)
        }
        onDeleteTransaction={handleDeleteTransaction}
        onPageChange={handlePageChange}
      />

      {transactions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No transactions yet
          </h3>
          <p className="text-gray-600 mb-4">
            Start tracking your finances by adding your first transaction.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      )}
    </div>
  );
};

export default TransactionsListScreen;
