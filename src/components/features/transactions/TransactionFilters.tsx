import React from "react";
import { Search, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { TransactionFilters as ITransactionFilters } from "@/types/transactions";
import type { Account } from "@/types/accounts";

interface Category {
  id: string;
  name: string;
}

interface TransactionFiltersProps {
  filters: ITransactionFilters;
  searchTerm: string;
  accounts: Account[];
  categories: Category[];
  onSearchChange: (term: string) => void;
  onFilterChange: (
    key: keyof ITransactionFilters,
    value: string | number
  ) => void;
  onMoreFilters?: () => void;
  showMoreFilters?: boolean;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filters,
  searchTerm,
  accounts,
  categories,
  onSearchChange,
  onFilterChange,
  onMoreFilters,
  showMoreFilters = true,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Account Filter */}
          <Select
            value={filters.accountId || ""}
            onValueChange={(value) => onFilterChange("accountId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Accounts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Accounts</SelectItem>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select
            value={filters.categoryId || ""}
            onValueChange={(value) => onFilterChange("categoryId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Source Filter */}
          <Select
            value={filters.importedFrom || ""}
            onValueChange={(value) => onFilterChange("importedFrom", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Sources</SelectItem>
              <SelectItem value="plaid">Plaid</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="file">File Import</SelectItem>
            </SelectContent>
          </Select>

          {/* More Filters Button */}
          {showMoreFilters && (
            <Button
              variant="outline"
              className="w-full"
              onClick={onMoreFilters}
            >
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionFilters;
