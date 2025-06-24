import { TrendingUp, TrendingDown, AlertTriangle, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBudgetSummary, useBudgets } from "@/hooks/budgets/useBudgets";
import { formatCurrency } from "@/utils/formatters";
import {
  addBudgetStatus,
  sortBudgetsByPriority,
} from "@/utils/budgetCalculations";
import { Link } from "react-router";

export function BudgetOverview() {
  const { data: summary, isLoading: summaryLoading } = useBudgetSummary();
  const { data: budgetsResponse, isLoading: budgetsLoading } = useBudgets({
    isActive: true,
  });

  const budgets = budgetsResponse?.budgets || [];
  const budgetsWithStatus = budgets.map(addBudgetStatus);
  const prioritizedBudgets = sortBudgetsByPriority(budgetsWithStatus).slice(
    0,
    3
  );

  if (summaryLoading || budgetsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Budget Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!summary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Budget Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              No budgets found. Create your first budget to start tracking your
              spending.
            </p>
            <Button asChild>
              <Link to="/budgets">Create Budget</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const overallProgress =
    summary.totalBudgeted > 0
      ? (summary.totalSpent / summary.totalBudgeted) * 100
      : 0;

  const getOverallStatus = () => {
    if (overallProgress >= 100) return "over";
    if (overallProgress >= 75) return "near";
    return "under";
  };

  const overallStatus = getOverallStatus();
  const statusColors = {
    over: "text-red-600",
    near: "text-amber-600",
    under: "text-green-600",
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Budget Overview
        </CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link to="/budgets">Manage</Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Budgeted</p>
            <p className="text-lg font-semibold">
              {formatCurrency(summary.totalBudgeted)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Spent</p>
            <p className="text-lg font-semibold">
              {formatCurrency(summary.totalSpent)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Remaining</p>
            <p
              className={`text-lg font-semibold ${statusColors[overallStatus]}`}
            >
              {formatCurrency(summary.totalRemaining)}
            </p>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Progress</span>
            <span
              className={`text-sm font-medium ${statusColors[overallStatus]}`}
            >
              {overallProgress.toFixed(0)}%
            </span>
          </div>
          <Progress value={Math.min(overallProgress, 100)} className="h-2" />
        </div>

        {/* Alert Summary */}
        {(summary.budgetsOverLimit > 0 || summary.budgetsNearLimit > 0) && (
          <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">
                {summary.budgetsOverLimit > 0
                  ? `${summary.budgetsOverLimit} budget(s) over limit`
                  : `${summary.budgetsNearLimit} budget(s) near limit`}
              </span>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/budgets">Review</Link>
            </Button>
          </div>
        )}

        {/* Top Budgets by Priority */}
        {prioritizedBudgets.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Priority Budgets
            </h4>
            {prioritizedBudgets.map((budget) => (
              <div
                key={budget.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">
                      {budget.name}
                    </p>
                    <Badge
                      variant={
                        budget.status === "over"
                          ? "destructive"
                          : budget.status === "near"
                          ? "secondary"
                          : "default"
                      }
                      className="text-xs"
                    >
                      {budget.status === "over"
                        ? "Over"
                        : budget.status === "near"
                        ? "Near"
                        : "On Track"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">
                      {formatCurrency(budget.spent)} /{" "}
                      {formatCurrency(budget.amount)}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        statusColors[budget.status]
                      }`}
                    >
                      {budget.percentUsed.toFixed(0)}%
                    </span>
                  </div>
                  <Progress
                    value={Math.min(budget.percentUsed, 100)}
                    className="h-1 mt-1"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Link */}
        <Button variant="outline" className="w-full" asChild>
          <Link to="/budgets">View All Budgets</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
