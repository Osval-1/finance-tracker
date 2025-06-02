import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  ArrowLeft,
  RefreshCw,
  Edit,
  Unlink,
  Trash2,
  Download,
  MoreVertical,
  CreditCard,
  PiggyBank,
  TrendingUp,
  Landmark,
  BadgeDollarSign,
  CheckCircle,
  Clock,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";

import {
  useAccount,
  useSyncAccount,
  useDeleteAccount,
  useUnlinkPlaidAccount,
} from "@/hooks/accounts/useAccounts";
import { useTransactions } from "@/hooks/transactions/useTransactions";
import type { Account } from "@/types/accounts";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format, subDays } from "date-fns";

const AccountDetailScreen = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();

  const [selectedTransactions, setSelectedTransactions] = useState<string[]>(
    []
  );
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    dateRange: {
      from: subDays(new Date(), 30),
      to: new Date(),
    },
    minAmount: "",
    maxAmount: "",
  });
  const [editAccountOpen, setEditAccountOpen] = useState(false);

  // Data fetching
  const {
    data: account,
    isLoading: accountLoading,
    error: accountError,
  } = useAccount(accountId!);
  const {
    data: transactionsData,
    isLoading: transactionsLoading,
    error: transactionsError,
  } = useTransactions({
    accountId,
    startDate: filters.dateRange.from?.toISOString(),
    endDate: filters.dateRange.to?.toISOString(),
    searchTerm: filters.search,
    categoryId: filters.category || undefined,
    minAmount: filters.minAmount ? parseFloat(filters.minAmount) : undefined,
    maxAmount: filters.maxAmount ? parseFloat(filters.maxAmount) : undefined,
  });

  // Mutations
  const syncMutation = useSyncAccount();
  const deleteMutation = useDeleteAccount();
  const unlinkMutation = useUnlinkPlaidAccount();

  const handleSync = () => {
    if (account?.isLinked) {
      syncMutation.mutate(accountId!);
    }
  };

  const handleDelete = () => {
    if (
      confirm(
        "Are you sure you want to delete this account? This action cannot be undone."
      )
    ) {
      deleteMutation.mutate(accountId!, {
        onSuccess: () => {
          navigate("/accounts");
        },
      });
    }
  };

  const handleUnlink = () => {
    if (confirm("Are you sure you want to unlink this account from Plaid?")) {
      unlinkMutation.mutate(accountId!);
    }
  };

  const handleExportCSV = () => {
    // Implementation for CSV export
    toast.success("CSV export started");
  };

  const handleBulkClear = () => {
    if (selectedTransactions.length === 0) {
      toast.error("Please select transactions to mark as cleared");
      return;
    }
    // Implementation for bulk clearing
    toast.success(
      `${selectedTransactions.length} transactions marked as cleared`
    );
    setSelectedTransactions([]);
  };

  const handleBulkCategorize = () => {
    if (selectedTransactions.length === 0) {
      toast.error("Please select transactions to categorize");
      return;
    }
    // Implementation for bulk categorization
    toast.success("Bulk categorization started");
  };

  const getAccountIcon = (type: Account["type"]): React.ReactElement => {
    switch (type) {
      case "checking":
        return <CreditCard className="h-6 w-6 text-blue-500" />;
      case "savings":
        return <PiggyBank className="h-6 w-6 text-green-500" />;
      case "credit":
        return <CreditCard className="h-6 w-6 text-orange-500" />;
      case "investment":
        return <TrendingUp className="h-6 w-6 text-purple-500" />;
      case "loan":
        return <BadgeDollarSign className="h-6 w-6 text-red-500" />;
      default:
        return <Landmark className="h-6 w-6 text-gray-500" />;
    }
  };

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  const formatAccountType = (type: Account["type"]) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getBalanceColor = (balance: number, type: Account["type"]) => {
    if (type === "credit" || type === "loan") {
      return balance > 0 ? "text-red-600" : "text-green-600";
    }
    return balance >= 0 ? "text-green-600" : "text-red-600";
  };

  const handleTransactionSelect = (transactionId: string, checked: boolean) => {
    if (checked) {
      setSelectedTransactions((prev) => [...prev, transactionId]);
    } else {
      setSelectedTransactions((prev) =>
        prev.filter((id) => id !== transactionId)
      );
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && transactionsData?.transactions) {
      setSelectedTransactions(transactionsData.transactions.map((t) => t.id));
    } else {
      setSelectedTransactions([]);
    }
  };

  if (accountLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-1" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (accountError || !account) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load account details. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const transactions = transactionsData?.transactions || [];
  const isAllSelected =
    transactions.length > 0 &&
    selectedTransactions.length === transactions.length;
  const isPartiallySelected =
    selectedTransactions.length > 0 &&
    selectedTransactions.length < transactions.length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500">
        <Link to="/accounts" className="hover:text-gray-700">
          Accounts
        </Link>
        <span>/</span>
        <span className="text-gray-900">{account.name}</span>
      </nav>

      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/accounts")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold">{account.name}</h1>
        </div>

        <div className="flex gap-2">
          {account.isLinked && (
            <Button
              variant="outline"
              onClick={handleSync}
              disabled={syncMutation.isPending}
            >
              <RefreshCw
                className={cn(
                  "h-4 w-4 mr-2",
                  syncMutation.isPending && "animate-spin"
                )}
              />
              Refresh
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditAccountOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {account.isLinked ? (
                <DropdownMenuItem
                  onClick={handleUnlink}
                  className="text-orange-600"
                >
                  <Unlink className="h-4 w-4 mr-2" />
                  Disconnect
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Account Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getAccountIcon(account.type)}
              <div>
                <h3 className="text-lg font-medium">{account.institution}</h3>
                <p className="text-sm text-gray-600">
                  {formatAccountType(account.type)} • {account.currency}
                </p>
                {account.accountNumber && (
                  <p className="text-sm text-gray-500">
                    Account ****{account.accountNumber.slice(-4)}
                  </p>
                )}
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-600">Current Balance</p>
              <p
                className={cn(
                  "text-3xl font-semibold",
                  getBalanceColor(account.balance, account.type)
                )}
              >
                {formatCurrency(account.balance, account.currency)}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {account.isLinked ? (
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Linked
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    Manual
                  </Badge>
                )}
                <p className="text-xs text-gray-500">
                  Last sync:{" "}
                  {format(new Date(account.lastSync), "MMM d, HH:mm")}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Transaction Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search payee, notes, tags..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={filters.category}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  <SelectItem value="food">Food & Dining</SelectItem>
                  <SelectItem value="transport">Transportation</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="min-amount">Min Amount</Label>
              <Input
                id="min-amount"
                type="number"
                placeholder="0.00"
                value={filters.minAmount}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, minAmount: e.target.value }))
                }
              />
            </div>

            <div>
              <Label htmlFor="max-amount">Max Amount</Label>
              <Input
                id="max-amount"
                type="number"
                placeholder="No limit"
                value={filters.maxAmount}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, maxAmount: e.target.value }))
                }
              />
            </div>
          </div>

          <div>
            <Label>Date Range</Label>
            <DatePickerWithRange
              date={filters.dateRange}
              onDateChange={(range) =>
                setFilters((prev) => ({
                  ...prev,
                  dateRange: {
                    from: range.from || new Date(),
                    to: range.to || new Date(),
                  },
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedTransactions.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {selectedTransactions.length} transaction
                {selectedTransactions.length === 1 ? "" : "s"} selected
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleBulkClear}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Cleared
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkCategorize}
                >
                  Categorize
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Transactions</CardTitle>
          <CardDescription>Recent activity for this account</CardDescription>
        </CardHeader>
        <CardContent>
          {transactionsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : transactionsError ? (
            <Alert variant="destructive">
              <AlertDescription>
                Failed to load transactions. Please try again later.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={isAllSelected}
                        {...(isPartiallySelected && {
                          "data-state": "indeterminate",
                        })}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Payee</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedTransactions.includes(
                            transaction.id
                          )}
                          onCheckedChange={(checked) =>
                            handleTransactionSelect(
                              transaction.id,
                              checked as boolean
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {format(new Date(transaction.date), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{transaction.merchant}</p>
                          {transaction.description && (
                            <p className="text-sm text-gray-500">
                              {transaction.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {transaction.categoryId ? (
                          <Badge variant="secondary">
                            {transaction.categoryId}
                          </Badge>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            Uncategorized
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={cn(
                            "font-medium",
                            transaction.amount < 0
                              ? "text-red-600"
                              : "text-green-600"
                          )}
                        >
                          {formatCurrency(transaction.amount, account.currency)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {transaction.isCleared ? (
                            <Badge variant="secondary" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Cleared
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                          {transaction.isReconciled && (
                            <Badge variant="default" className="text-xs">
                              Reconciled
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {transactions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No transactions found for the selected filters.
                  </p>
                </div>
              )}

              {/* Pagination */}
              {transactionsData?.pagination &&
                transactionsData.pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Showing{" "}
                      {transactionsData.pagination.page *
                        transactionsData.pagination.limit -
                        transactionsData.pagination.limit +
                        1}{" "}
                      to{" "}
                      {Math.min(
                        transactionsData.pagination.page *
                          transactionsData.pagination.limit,
                        transactionsData.pagination.total
                      )}{" "}
                      of {transactionsData.pagination.total} transactions
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={transactionsData.pagination.page === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={
                          transactionsData.pagination.page ===
                          transactionsData.pagination.totalPages
                        }
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Account Dialog */}
      <Dialog open={editAccountOpen} onOpenChange={setEditAccountOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
            <DialogDescription>
              Update your account information
            </DialogDescription>
          </DialogHeader>
          {/* Edit form would go here */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Account Name</Label>
              <Input id="edit-name" defaultValue={account.name} />
            </div>
            <div>
              <Label htmlFor="edit-institution">Institution</Label>
              <Input id="edit-institution" defaultValue={account.institution} />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setEditAccountOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => setEditAccountOpen(false)}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountDetailScreen;
