import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  TrendingUp,
  AlertCircle,
  Target,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBudgets, useBudgetTrends } from "@/hooks/budgets/useBudgets";
import { formatCurrency } from "@/utils/formatters";
import { addBudgetStatus, getBudgetStatus } from "@/utils/budgetCalculations";

interface BudgetAnalyticsProps {
  className?: string;
}

export function BudgetAnalytics({ className }: BudgetAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [viewType, setViewType] = useState<"overview" | "trends" | "breakdown">(
    "overview"
  );

  const { data: budgetsResponse, isLoading: budgetsLoading } = useBudgets({
    isActive: true,
  });
  const { data: trends, isLoading: trendsLoading } = useBudgetTrends(
    undefined,
    selectedPeriod
  );

  const budgets = budgetsResponse?.budgets || [];
  const budgetsWithStatus = budgets.map(addBudgetStatus);

  // Calculate analytics data
  const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const totalRemaining = budgets.reduce(
    (sum, budget) => sum + budget.remaining,
    0
  );

  const statusBreakdown = budgetsWithStatus.reduce((acc, budget) => {
    acc[budget.status] = (acc[budget.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryBreakdown = budgets.map((budget) => ({
    categoryId: budget.categoryId,
    name: budget.name || `Budget ${budget.categoryId}`,
    budgeted: budget.amount,
    spent: budget.spent,
    remaining: budget.remaining,
    percentUsed: budget.percentUsed,
    status: getBudgetStatus(budget.percentUsed),
  }));

  const pieData = [
    { name: "On Track", value: statusBreakdown.under || 0, color: "#10b981" },
    { name: "Near Limit", value: statusBreakdown.near || 0, color: "#f59e0b" },
    { name: "Over Budget", value: statusBreakdown.over || 0, color: "#ef4444" },
  ].filter((item) => item.value > 0);

  const spendingEfficiency =
    totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;
  const averageBudgetUtilization =
    budgets.length > 0
      ? budgets.reduce((sum, budget) => sum + budget.percentUsed, 0) /
        budgets.length
      : 0;

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency < 70) return "text-green-600";
    if (efficiency < 90) return "text-amber-600";
    return "text-red-600";
  };

  const getInsights = () => {
    const insights = [];

    if (spendingEfficiency > 100) {
      insights.push({
        type: "warning",
        title: "Over Budget Alert",
        message: `You're spending ${spendingEfficiency.toFixed(
          1
        )}% of your total budget`,
        icon: AlertCircle,
        color: "text-red-600 bg-red-50",
      });
    } else if (spendingEfficiency > 85) {
      insights.push({
        type: "caution",
        title: "Budget Limit Approaching",
        message: `You've used ${spendingEfficiency.toFixed(
          1
        )}% of your total budget`,
        icon: TrendingUp,
        color: "text-amber-600 bg-amber-50",
      });
    } else {
      insights.push({
        type: "success",
        title: "Budget On Track",
        message: `You're at ${spendingEfficiency.toFixed(
          1
        )}% of your total budget`,
        icon: Target,
        color: "text-green-600 bg-green-50",
      });
    }

    if (statusBreakdown.over > 0) {
      insights.push({
        type: "warning",
        title: "Budgets Over Limit",
        message: `${statusBreakdown.over} budget(s) have exceeded their limits`,
        icon: AlertCircle,
        color: "text-red-600 bg-red-50",
      });
    }

    if (averageBudgetUtilization < 50) {
      insights.push({
        type: "info",
        title: "Low Budget Utilization",
        message: "Consider adjusting budget amounts or reallocating funds",
        icon: Target,
        color: "text-blue-600 bg-blue-50",
      });
    }

    return insights;
  };

  const insights = getInsights();

  if (budgetsLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Budget Analytics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (budgets.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Budget Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No budget data available. Create budgets to view analytics.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChartIcon className="h-5 w-5" />
            Budget Analytics
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewType === "overview" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewType("overview")}
                className="text-xs"
              >
                Overview
              </Button>
              <Button
                variant={viewType === "breakdown" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewType("breakdown")}
                className="text-xs"
              >
                Breakdown
              </Button>
              <Button
                variant={viewType === "trends" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewType("trends")}
                className="text-xs"
              >
                Trends
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Budgeted</p>
            <p className="text-2xl font-bold">
              {formatCurrency(totalBudgeted)}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-muted-foreground">Remaining</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(totalRemaining)}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-muted-foreground">Efficiency</p>
            <p
              className={`text-2xl font-bold ${getEfficiencyColor(
                spendingEfficiency
              )}`}
            >
              {spendingEfficiency.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Insights */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Key Insights</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-3 rounded-lg ${insight.color}`}
              >
                <insight.icon className="h-5 w-5 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">{insight.title}</p>
                  <p className="text-xs opacity-90">{insight.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts based on view type */}
        {viewType === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Budget Status Distribution */}
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <PieChartIcon className="h-4 w-4" />
                Budget Status Distribution
              </h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Category Performance */}
            <div>
              <h4 className="text-sm font-medium mb-3">
                Budget Performance by Category
              </h4>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {categoryBreakdown.map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {category.name}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">
                          {formatCurrency(category.spent)} /{" "}
                          {formatCurrency(category.budgeted)}
                        </span>
                        <Badge
                          variant={
                            category.status === "over"
                              ? "destructive"
                              : category.status === "near"
                              ? "secondary"
                              : "default"
                          }
                          className="text-xs"
                        >
                          {category.percentUsed.toFixed(0)}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {viewType === "breakdown" && (
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <BarChartIcon className="h-4 w-4" />
              Budget vs Spending Breakdown
            </h4>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={categoryBreakdown}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Bar dataKey="budgeted" fill="#10b981" name="Budget" />
                <Bar dataKey="spent" fill="#3b82f6" name="Spent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {viewType === "trends" && trends && !trendsLoading && (
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Spending Trends Over Time
            </h4>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={trends}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Bar dataKey="budgeted" fill="#10b981" name="Budget" />
                <Bar dataKey="spent" fill="#3b82f6" name="Spent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
