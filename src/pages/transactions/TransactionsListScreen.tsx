import { useState } from "react";
import { Plus, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Layout } from "@/components/shared";

import {
  useTransactions,
  useTransactionCategories,
  useDeleteTransaction,
  useExportTransactions,
  useBulkTransactionOperations,
} from "@/hooks/transactions/useTransactions";
import { useAccounts } from "@/hooks/accounts/useAccounts";
import type { TransactionFilters, Transaction } from "@/types/transactions";

// Import transaction feature components
import {
  TransactionFilters as FilterComponent,
  TransactionSummaryCards,
  TransactionBulkActions,
  TransactionTable,
  TransactionEntryModal,
  BulkCategorizationDrawer,
} from "@/components/features/transactions";

const TransactionsListScreen = () => {
  const [filters, setFilters] = useState<TransactionFilters>({
    page: 1,
    limit: 20,
    sortBy: "date",
    sortOrder: "desc",
  });
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [isBulkCategorizationOpen, setIsBulkCategorizationOpen] =
    useState(false);

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

  const handleEditTransaction = (transactionId: string) => {
    const transaction = transactions.find((t) => t.id === transactionId);
    if (transaction) {
      setEditingTransaction(transaction);
    }
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingTransaction(null);
  };

  const handleBulkCategorize = () => {
    setIsBulkCategorizationOpen(true);
  };

  const pagination = transactionsData?.pagination;

  if (isLoading) {
    return (
      <Layout title="Transactions">
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
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Transactions">
        <div className="container mx-auto p-6">
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load transactions. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Transactions">
      <div className="container mx-auto p-6 space-y-6">
        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={exportTransactionsMutation.isPending}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            onClick={handleBulkCategorize}
            disabled={transactions.filter((t) => !t.categoryId).length === 0}
          >
            Bulk Categorize
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
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
          onEditTransaction={handleEditTransaction}
          onCategorizeTransaction={(id) =>
            console.log("Categorize transaction", id)
          }
          onDeleteTransaction={handleDeleteTransaction}
          onPageChange={handlePageChange}
        />

        {/* Empty State */}
        {transactions.length === 0 && !isLoading && (
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
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        )}

        {/* Floating Action Button for mobile */}
        <div className="fixed bottom-6 right-6 md:hidden">
          <Button
            size="lg"
            onClick={() => setIsAddModalOpen(true)}
            className="rounded-full w-14 h-14 shadow-lg"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        {/* Transaction Entry Modal */}
        <TransactionEntryModal
          isOpen={isAddModalOpen || !!editingTransaction}
          onClose={handleCloseModal}
          transaction={editingTransaction || undefined}
          accounts={accounts}
          categories={categories}
          isEditing={!!editingTransaction}
        />

        {/* Bulk Categorization Drawer */}
        <BulkCategorizationDrawer
          isOpen={isBulkCategorizationOpen}
          onClose={() => setIsBulkCategorizationOpen(false)}
          transactions={transactions}
          categories={categories}
        />
      </div>
    </Layout>
  );
};

export default TransactionsListScreen;
