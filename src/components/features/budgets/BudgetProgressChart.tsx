import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  Tooltip,
} from "recharts";
import { TrendingUp, TrendingDown, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useBudgetTrends } from "@/hooks/budgets/useBudgets";
import { formatCurrency } from "@/utils/formatters";

interface BudgetProgressChartProps {
  categoryId?: string;
  period?: string;
  className?: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    payload?: {
      percentUsed?: number;
    };
  }>;
  label?: string;
}

export function BudgetProgressChart({
  categoryId,
  period = "monthly",
  className,
}: BudgetProgressChartProps) {
  const { data: trends, isLoading } = useBudgetTrends(categoryId, period);

  const chartData = useMemo(() => {
    if (!trends) return [];

    return trends.map((trend) => ({
      period: trend.period,
      budgeted: trend.budgeted,
      spent: trend.spent,
      remaining: trend.budgeted - trend.spent,
      percentUsed:
        trend.budgeted > 0 ? (trend.spent / trend.budgeted) * 100 : 0,
      categoryName: trend.categoryName,
    }));
  }, [trends]);

  const totalBudgeted = chartData.reduce((sum, item) => sum + item.budgeted, 0);
  const totalSpent = chartData.reduce((sum, item) => sum + item.spent, 0);
  const overallProgress =
    totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

  const overBudgetPeriods = chartData.filter((item) => item.percentUsed > 100);
  const averageSpending =
    chartData.length > 0 ? totalSpent / chartData.length : 0;

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Budget Progress
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
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!trends || trends.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Budget Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No budget data available for the selected period.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
          {payload[0]?.payload && (
            <p className="text-sm text-muted-foreground mt-1">
              {payload[0].payload.percentUsed?.toFixed(1)}% of budget used
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Budget Progress Trends
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant={
                overallProgress > 100
                  ? "destructive"
                  : overallProgress > 75
                  ? "secondary"
                  : "default"
              }
            >
              {overallProgress.toFixed(1)}% Overall
            </Badge>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Budgeted</p>
            <p className="text-lg font-semibold">
              {formatCurrency(totalBudgeted)}
            </p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <p className="text-lg font-semibold">
              {formatCurrency(totalSpent)}
            </p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-muted-foreground">Average Spending</p>
            <p className="text-lg font-semibold">
              {formatCurrency(averageSpending)}
            </p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-muted-foreground">Over Budget</p>
            <p className="text-lg font-semibold text-red-600">
              {overBudgetPeriods.length} periods
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Bar Chart - Budget vs Spending */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Budget vs Actual Spending
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="period"
                stroke="#64748b"
                fontSize={12}
                tick={{ fill: "#64748b" }}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tick={{ fill: "#64748b" }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="budgeted"
                fill="#10b981"
                name="Budget"
                radius={[2, 2, 0, 0]}
              />
              <Bar
                dataKey="spent"
                fill="#3b82f6"
                name="Spent"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart - Spending Trend */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Spending Trend Over Time
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="period"
                stroke="#64748b"
                fontSize={12}
                tick={{ fill: "#64748b" }}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tick={{ fill: "#64748b" }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="spent"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                name="Actual Spending"
              />
              <Line
                type="monotone"
                dataKey="budgeted"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }}
                name="Budget Target"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Key Insights</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {overBudgetPeriods.length > 0 && (
              <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                <TrendingUp className="h-4 w-4 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    Over Budget Alert
                  </p>
                  <p className="text-xs text-red-600">
                    You exceeded your budget in {overBudgetPeriods.length}{" "}
                    period(s)
                  </p>
                </div>
              </div>
            )}

            {overallProgress < 75 && (
              <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                <TrendingDown className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Great Progress
                  </p>
                  <p className="text-xs text-green-600">
                    You're staying well within your budget limits
                  </p>
                </div>
              </div>
            )}

            {chartData.length >= 3 && (
              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                <Target className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Trend Analysis
                  </p>
                  <p className="text-xs text-blue-600">
                    {chartData[chartData.length - 1].spent >
                    chartData[chartData.length - 2].spent
                      ? "Spending increased from last period"
                      : "Spending decreased from last period"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
