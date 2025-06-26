import React from "react";
import { format } from "date-fns";
import { MoreHorizontal, Edit, Tag, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import type { Transaction } from "@/types/transactions";
import type { Account } from "@/types/accounts";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}

interface TransactionTableProps {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  selectedTransactions: string[];
  pagination?: PaginationInfo;
  currency?: string;
  onSelectTransaction: (transactionId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onEditTransaction: (transactionId: string) => void;
  onCategorizeTransaction: (transactionId: string) => void;
  onDeleteTransaction: (transactionId: string) => void;
  onPageChange?: (page: number) => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  accounts,
  categories,
  selectedTransactions,
  pagination,
  currency = "USD",
  onSelectTransaction,
  onSelectAll,
  onEditTransaction,
  onCategorizeTransaction,
  onDeleteTransaction,
  onPageChange,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  const getAmountColor = (amount: number) => {
    return amount >= 0 ? "text-green-600" : "text-red-600";
  };

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return "Uncategorized";
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || "Unknown";
  };

  const getAccountName = (accountId: string) => {
    const account = accounts.find((a) => a.id === accountId);
    return account?.name || "Unknown Account";
  };

  const isAllSelected =
    selectedTransactions.length === transactions.length &&
    transactions.length > 0;
  const isPartiallySelected =
    selectedTransactions.length > 0 &&
    selectedTransactions.length < transactions.length;

  return (
    <Card>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  {...(isPartiallySelected && {
                    "data-state": "indeterminate",
                  })}
                  onCheckedChange={onSelectAll}
                />
              </TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedTransactions.includes(transaction.id)}
                    onCheckedChange={(checked) =>
                      onSelectTransaction(transaction.id, checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell>
                  {format(new Date(transaction.date), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{transaction.merchant}</div>
                    {transaction.description && (
                      <div className="text-sm text-gray-500">
                        {transaction.description}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getAccountName(transaction.accountId)}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {getCategoryName(transaction.categoryId)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "font-semibold",
                      getAmountColor(transaction.amount)
                    )}
                  >
                    {formatCurrency(transaction.amount)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {transaction.isCleared && (
                      <Badge variant="outline" className="text-xs">
                        Cleared
                      </Badge>
                    )}
                    {transaction.isReconciled && (
                      <Badge variant="outline" className="text-xs">
                        Reconciled
                      </Badge>
                    )}
                    {transaction.importedFrom === "plaid" && (
                      <Badge variant="outline" className="text-xs">
                        Auto
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onEditTransaction(transaction.id)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onCategorizeTransaction(transaction.id)}
                      >
                        <Tag className="h-4 w-4 mr-2" />
                        Categorize
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDeleteTransaction(transaction.id)}
                        className="text-red-600 focus:text-red-600"
                      >
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
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        {/* Mobile Header with Select All */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Checkbox
              checked={isAllSelected}
              {...(isPartiallySelected && { "data-state": "indeterminate" })}
              onCheckedChange={onSelectAll}
            />
            <span className="text-sm font-medium">
              {selectedTransactions.length > 0
                ? `${selectedTransactions.length} selected`
                : "Select all"}
            </span>
          </div>
        </div>

        {/* Mobile Transaction Cards */}
        <div className="divide-y">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="p-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  checked={selectedTransactions.includes(transaction.id)}
                  onCheckedChange={(checked) =>
                    onSelectTransaction(transaction.id, checked as boolean)
                  }
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">
                      {transaction.merchant}
                    </div>
                    <span
                      className={cn(
                        "font-semibold text-sm",
                        getAmountColor(transaction.amount)
                      )}
                    >
                      {formatCurrency(transaction.amount)}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 mt-1">
                    {format(new Date(transaction.date), "MMM d, yyyy")} •{" "}
                    {getAccountName(transaction.accountId)}
                  </div>

                  {transaction.description && (
                    <div className="text-xs text-gray-600 mt-1">
                      {transaction.description}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {getCategoryName(transaction.categoryId)}
                      </Badge>

                      <div className="flex gap-1">
                        {transaction.isCleared && (
                          <Badge variant="outline" className="text-xs">
                            Cleared
                          </Badge>
                        )}
                        {transaction.isReconciled && (
                          <Badge variant="outline" className="text-xs">
                            Reconciled
                          </Badge>
                        )}
                        {transaction.importedFrom === "plaid" && (
                          <Badge variant="outline" className="text-xs">
                            Auto
                          </Badge>
                        )}
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => onEditTransaction(transaction.id)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            onCategorizeTransaction(transaction.id)
                          }
                        >
                          <Tag className="h-4 w-4 mr-2" />
                          Categorize
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDeleteTransaction(transaction.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && onPageChange && (
        <div className="border-t">
          <Pagination className="py-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(Math.max(1, pagination.page - 1))}
                  className={cn(
                    pagination.page === 1 && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => {
                  const page = i + 1;
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => onPageChange(page)}
                        isActive={page === pagination.page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    onPageChange(
                      Math.min(pagination.totalPages, pagination.page + 1)
                    )
                  }
                  className={cn(
                    pagination.page === pagination.totalPages &&
                      "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </Card>
  );
};

export default TransactionTable;
