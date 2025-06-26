import { useState } from "react";
import {
  Plus,
  Download,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Layout } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  // Calculate transaction stats
  const totalIncome = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const netCashFlow = totalIncome - totalExpenses;
  const transactionCount = transactions.length;

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
        <div className="container mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
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
        <div className="container mx-auto p-4 md:p-6">
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
      {/* Background with colorful gradient */}
      <div className="min-h-full bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-purple-300/30 to-pink-400/30 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-0 w-64 h-64 bg-gradient-to-br from-blue-300/30 to-cyan-400/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gradient-to-br from-emerald-300/30 to-teal-400/30 rounded-full blur-3xl"></div>

        <div className="relative z-10 container mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={exportTransactionsMutation.isPending}
              className="border-0 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              onClick={handleBulkCategorize}
              disabled={transactions.filter((t) => !t.categoryId).length === 0}
              className="border-0 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
            >
              Bulk Categorize
            </Button>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </div>

          {/* Key Metrics Cards - Same as Dashboard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Primary Blue - Total Income */}
            <Card className="border-0 bg-gradient-to-br from-blue-500 to-indigo-600 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-blue-50">
                  Total Income
                </CardTitle>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <ArrowUpRight className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-2xl md:text-3xl font-bold text-white">
                  ${totalIncome.toLocaleString()}
                </div>
                <div className="flex items-center text-xs text-blue-100">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  This period
                </div>
              </CardContent>
            </Card>

            {/* Secondary Red - Total Expenses */}
            <Card className="border-0 bg-gradient-to-br from-red-500 to-rose-600 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-red-50">
                  Total Expenses
                </CardTitle>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <ArrowDownRight className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-2xl md:text-3xl font-bold text-white">
                  ${totalExpenses.toLocaleString()}
                </div>
                <div className="flex items-center text-xs text-red-100">
                  <DollarSign className="mr-1 h-3 w-3" />
                  This period
                </div>
              </CardContent>
            </Card>

            {/* Accent Green/Red - Net Cash Flow */}
            <Card
              className={`border-0 ${
                netCashFlow >= 0
                  ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                  : "bg-gradient-to-br from-orange-500 to-red-600"
              } text-white overflow-hidden relative`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle
                  className={`text-sm font-medium ${
                    netCashFlow >= 0 ? "text-emerald-50" : "text-orange-50"
                  }`}
                >
                  Net Cash Flow
                </CardTitle>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-2xl md:text-3xl font-bold text-white">
                  ${Math.abs(netCashFlow).toLocaleString()}
                </div>
                <div
                  className={`flex items-center text-xs ${
                    netCashFlow >= 0 ? "text-emerald-100" : "text-orange-100"
                  }`}
                >
                  {netCashFlow >= 0 ? (
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="mr-1 h-3 w-3" />
                  )}
                  {netCashFlow >= 0 ? "Positive" : "Negative"} flow
                </div>
              </CardContent>
            </Card>

            {/* Purple Special Case - Transaction Count */}
            <Card className="border-0 bg-gradient-to-br from-violet-500 to-purple-600 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-violet-50">
                  Total Transactions
                </CardTitle>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Receipt className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-2xl md:text-3xl font-bold text-white">
                  {transactionCount}
                </div>
                <div className="flex items-center text-xs text-violet-100">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  This period
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <FilterComponent
              filters={filters}
              searchTerm={searchTerm}
              accounts={accounts}
              categories={categories}
              onSearchChange={handleSearch}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Bulk Actions */}
          <div className="border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <TransactionBulkActions
              selectedCount={selectedTransactions.length}
              onCategorize={() => handleBulkOperation("categorize")}
              onMarkCleared={() => handleBulkOperation("clear")}
              onDelete={() => handleBulkOperation("delete")}
              onExport={handleExport}
            />
          </div>

          {/* Transactions Table */}
          <div className="border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
            <TransactionTable
              transactions={transactions}
              accounts={accounts}
              categories={categories}
              selectedTransactions={selectedTransactions}
              onSelectTransaction={handleSelectTransaction}
              onSelectAll={handleSelectAll}
              onEditTransaction={handleEditTransaction}
              onCategorizeTransaction={(id) =>
                console.log("Categorize transaction", id)
              }
              onDeleteTransaction={handleDeleteTransaction}
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </div>

          {/* Modals */}
          <TransactionEntryModal
            isOpen={isAddModalOpen || !!editingTransaction}
            onClose={handleCloseModal}
            transaction={editingTransaction || undefined}
            accounts={accounts}
            categories={categories}
            isEditing={!!editingTransaction}
          />

          <BulkCategorizationDrawer
            isOpen={isBulkCategorizationOpen}
            onClose={() => setIsBulkCategorizationOpen(false)}
            transactions={transactions.filter((t) => !t.categoryId)}
            categories={categories}
          />
        </div>
      </div>
    </Layout>
  );
};

export default TransactionsListScreen;
