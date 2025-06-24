import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBudgetTrends } from "@/hooks/budgets/useBudgets";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface BudgetTrendChartProps {
  categoryId?: string;
  period?: string;
  height?: number;
}

export function BudgetTrendChart({
  categoryId,
  period = "monthly",
  height = 300,
}: BudgetTrendChartProps) {
  const {
    data: trends,
    isLoading,
    error,
  } = useBudgetTrends(categoryId, period);

  const chartData = useMemo(() => {
    if (!trends || trends.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    const labels = trends.map((trend) => trend.period);
    const budgetedData = trends.map((trend) => trend.budgeted);
    const spentData = trends.map((trend) => trend.spent);

    return {
      labels,
      datasets: [
        {
          label: "Budgeted",
          data: budgetedData,
          borderColor: "rgb(59, 130, 246)", // blue-500
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          tension: 0.4,
          fill: false,
        },
        {
          label: "Spent",
          data: spentData,
          borderColor: "rgb(239, 68, 68)", // red-500
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          tension: 0.4,
          fill: false,
        },
      ],
    };
  }, [trends]);

  const options: ChartOptions<"line"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top" as const,
        },
        title: {
          display: true,
          text: "Budget vs Spending Trends",
        },
        tooltip: {
          mode: "index",
          intersect: false,
          callbacks: {
            label: (context) => {
              const label = context.dataset.label || "";
              const value = context.parsed.y;
              return `${label}: $${value.toLocaleString()}`;
            },
          },
        },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: period.charAt(0).toUpperCase() + period.slice(1),
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: "Amount ($)",
          },
          ticks: {
            callback: (value) => `$${(value as number).toLocaleString()}`,
          },
        },
      },
      interaction: {
        mode: "nearest",
        axis: "x",
        intersect: false,
      },
    }),
    [period]
  );

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <p>Failed to load budget trends</p>
            <p className="text-sm mt-1">Please try again later</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Budget Trends</span>
          <Select defaultValue={period}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : trends && trends.length > 0 ? (
          <div style={{ height: `${height}px` }}>
            <Line data={chartData} options={options} />
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <p>No trend data available</p>
            <p className="text-sm mt-1">
              Create budgets and track spending to see trends
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
