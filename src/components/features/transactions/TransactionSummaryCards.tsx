import React from "react";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
}

interface TransactionSummaryCardsProps {
  summary: TransactionSummary;
  currency?: string;
}

export const TransactionSummaryCards: React.FC<
  TransactionSummaryCardsProps
> = ({ summary, currency = "USD" }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  const getAmountColor = (amount: number) => {
    return amount >= 0 ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Income */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(summary.totalIncome)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            From all income sources
          </p>
        </CardContent>
      </Card>

      {/* Total Expenses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(Math.abs(summary.totalExpenses))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            All outgoing transactions
          </p>
        </CardContent>
      </Card>

      {/* Net Amount */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Amount</CardTitle>
          <DollarSign
            className={cn(
              "h-4 w-4",
              summary.netAmount >= 0 ? "text-green-600" : "text-red-600"
            )}
          />
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "text-2xl font-bold",
              getAmountColor(summary.netAmount)
            )}
          >
            {formatCurrency(summary.netAmount)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Income minus expenses
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionSummaryCards;
