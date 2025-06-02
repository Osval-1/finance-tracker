import React, { useState, useMemo } from "react";
import { X, Filter, Tag, Calendar } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useBulkTransactionOperations } from "@/hooks/transactions/useTransactions";
import type { Transaction } from "@/types/transactions";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  color?: string;
  icon?: string;
}

interface BulkCategorizationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  categories: Category[];
}

interface Filters {
  merchantFilter: string;
  startDate: string;
  endDate: string;
  minAmount: number;
  maxAmount: number;
}

export const BulkCategorizationDrawer: React.FC<
  BulkCategorizationDrawerProps
> = ({ isOpen, onClose, transactions, categories }) => {
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>(
    []
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [filters, setFilters] = useState<Filters>({
    merchantFilter: "",
    startDate: "",
    endDate: "",
    minAmount: 0,
    maxAmount: 10000,
  });

  const bulkOperationsMutation = useBulkTransactionOperations();

  // Filter uncategorized transactions
  const uncategorizedTransactions = useMemo(() => {
    return transactions.filter((txn) => !txn.categoryId);
  }, [transactions]);

  // Apply filters to uncategorized transactions
  const filteredTransactions = useMemo(() => {
    let filtered = uncategorizedTransactions;

    // Merchant filter
    if (filters.merchantFilter.trim()) {
      const searchTerm = filters.merchantFilter.toLowerCase();
      filtered = filtered.filter(
        (txn) =>
          txn.merchant.toLowerCase().includes(searchTerm) ||
          txn.description?.toLowerCase().includes(searchTerm)
      );
    }

    // Date range filter
    if (filters.startDate) {
      filtered = filtered.filter((txn) => txn.date >= filters.startDate);
    }
    if (filters.endDate) {
      filtered = filtered.filter((txn) => txn.date <= filters.endDate);
    }

    // Amount range filter
    filtered = filtered.filter((txn) => {
      const absAmount = Math.abs(txn.amount);
      return absAmount >= filters.minAmount && absAmount <= filters.maxAmount;
    });

    return filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [uncategorizedTransactions, filters]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getAmountColor = (amount: number) => {
    return amount >= 0 ? "text-green-600" : "text-red-600";
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
      setSelectedTransactions(filteredTransactions.map((txn) => txn.id));
    } else {
      setSelectedTransactions([]);
    }
  };

  const handleApplyCategorization = () => {
    if (selectedTransactions.length === 0 || !selectedCategoryId) {
      return;
    }

    bulkOperationsMutation.mutate(
      {
        transactionIds: selectedTransactions,
        operation: "categorize",
        data: {
          categoryId: selectedCategoryId,
        },
      },
      {
        onSuccess: () => {
          setSelectedTransactions([]);
          setSelectedCategoryId("");
          onClose();
        },
      }
    );
  };

  const selectedCategory = categories.find(
    (cat) => cat.id === selectedCategoryId
  );
  const isAllSelected =
    selectedTransactions.length === filteredTransactions.length &&
    filteredTransactions.length > 0;
  const isPartiallySelected =
    selectedTransactions.length > 0 &&
    selectedTransactions.length < filteredTransactions.length;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-96 sm:max-w-md">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-xl font-semibold">
                Bulk Categorization
              </SheetTitle>
              <SheetDescription>
                Categorize multiple uncategorized transactions at once
              </SheetDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Filters Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <Label className="text-sm font-medium">Filters</Label>
            </div>

            {/* Merchant Filter */}
            <div>
              <Label htmlFor="merchantFilter" className="text-xs">
                Merchant/Description
              </Label>
              <Input
                id="merchantFilter"
                placeholder="Search merchant or description..."
                value={filters.merchantFilter}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    merchantFilter: e.target.value,
                  }))
                }
                className="mt-1"
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="startDate" className="text-xs">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="endDate" className="text-xs">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, endDate: e.target.value }))
                  }
                  className="mt-1"
                />
              </div>
            </div>

            {/* Amount Range */}
            <div>
              <Label className="text-xs">
                Amount Range: {formatCurrency(filters.minAmount)} -{" "}
                {formatCurrency(filters.maxAmount)}
              </Label>
              <div className="mt-2 px-2">
                <Slider
                  value={[filters.minAmount, filters.maxAmount]}
                  onValueChange={([min, max]) =>
                    setFilters((prev) => ({
                      ...prev,
                      minAmount: min,
                      maxAmount: max,
                    }))
                  }
                  max={10000}
                  min={0}
                  step={10}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <Label className="text-sm font-medium">
                  Uncategorized Transactions ({filteredTransactions.length})
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={isAllSelected}
                  {...(isPartiallySelected && {
                    "data-state": "indeterminate",
                  })}
                  onCheckedChange={handleSelectAll}
                />
                <Label className="text-xs">Select All</Label>
              </div>
            </div>

            <ScrollArea className="h-64 border rounded-md">
              <div className="p-2 space-y-2">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className={cn(
                      "p-3 rounded-lg border",
                      selectedTransactions.includes(transaction.id)
                        ? "bg-blue-50 border-blue-200"
                        : "bg-white border-gray-200"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedTransactions.includes(transaction.id)}
                        onCheckedChange={(checked) =>
                          handleSelectTransaction(
                            transaction.id,
                            checked as boolean
                          )
                        }
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {transaction.merchant}
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(transaction.date), "MMM d, yyyy")}
                        </div>
                        {transaction.description && (
                          <div className="text-xs text-gray-600 truncate mt-1">
                            {transaction.description}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div
                          className={cn(
                            "font-medium text-sm",
                            getAmountColor(transaction.amount)
                          )}
                        >
                          {formatCurrency(transaction.amount)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredTransactions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Tag className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">
                      No uncategorized transactions found
                    </p>
                    <p className="text-xs">
                      {uncategorizedTransactions.length === 0
                        ? "All transactions are categorized"
                        : "Try adjusting your filters"}
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Category Assignment */}
          {selectedTransactions.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <Label className="text-sm font-medium">Apply Category</Label>
              </div>

              <div>
                <Label htmlFor="category" className="text-xs">
                  Select Category
                </Label>
                <Select
                  value={selectedCategoryId}
                  onValueChange={setSelectedCategoryId}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose a category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          {category.icon && <span>{category.icon}</span>}
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCategoryId && selectedCategory && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm text-blue-900">
                    You are categorizing{" "}
                    <strong>
                      {selectedTransactions.length} transaction(s)
                    </strong>{" "}
                    as{" "}
                    <Badge variant="secondary" className="ml-1">
                      {selectedCategory.icon && `${selectedCategory.icon} `}
                      {selectedCategory.name}
                    </Badge>
                  </div>
                </div>
              )}

              <Button
                onClick={handleApplyCategorization}
                disabled={
                  !selectedCategoryId || bulkOperationsMutation.isPending
                }
                className="w-full"
              >
                {bulkOperationsMutation.isPending
                  ? "Applying..."
                  : `Apply to Selected (${selectedTransactions.length})`}
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BulkCategorizationDrawer;
