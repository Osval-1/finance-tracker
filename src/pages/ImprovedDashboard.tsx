import { Layout } from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Wallet,
  Target,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function ImprovedDashboard() {
  // Sample data for charts
  const netWorthData = [
    { month: "Jan", netWorth: 10500, assets: 15000, liabilities: 4500 },
    { month: "Feb", netWorth: 11200, assets: 15800, liabilities: 4600 },
    { month: "Mar", netWorth: 10800, assets: 15600, liabilities: 4800 },
    { month: "Apr", netWorth: 11500, assets: 16200, liabilities: 4700 },
    { month: "May", netWorth: 12100, assets: 16800, liabilities: 4700 },
    { month: "Jun", netWorth: 12350, assets: 17050, liabilities: 4700 },
  ];

  const expenseData = [
    { category: "Food", amount: 1200, color: "#3b82f6" },
    { category: "Transport", amount: 800, color: "#ef4444" },
    { category: "Entertainment", amount: 600, color: "#f59e0b" },
    { category: "Utilities", amount: 400, color: "#10b981" },
    { category: "Shopping", amount: 900, color: "#8b5cf6" },
    { category: "Healthcare", amount: 300, color: "#f97316" },
  ];

  const monthlySpendingData = [
    { month: "Jan", spending: 3200, budget: 3500 },
    { month: "Feb", spending: 2800, budget: 3500 },
    { month: "Mar", spending: 3100, budget: 3500 },
    { month: "Apr", spending: 3400, budget: 3500 },
    { month: "May", spending: 3600, budget: 3500 },
    { month: "Jun", spending: 3200, budget: 3500 },
  ];

  const recentTransactions = [
    {
      id: 1,
      description: "Grocery Store",
      amount: -127.45,
      category: "Food",
      date: "Today",
      account: "Chase Checking",
    },
    {
      id: 2,
      description: "Salary Deposit",
      amount: 3200.0,
      category: "Income",
      date: "2 days ago",
      account: "Chase Checking",
    },
    {
      id: 3,
      description: "Electric Bill",
      amount: -89.32,
      category: "Utilities",
      date: "3 days ago",
      account: "Chase Checking",
    },
    {
      id: 4,
      description: "Netflix",
      amount: -15.99,
      category: "Entertainment",
      date: "5 days ago",
      account: "Credit Card",
    },
    {
      id: 5,
      description: "Gas Station",
      amount: -45.67,
      category: "Transport",
      date: "1 week ago",
      account: "Chase Checking",
    },
  ];

  const budgets = [
    { name: "Food & Dining", spent: 950, budget: 1200, color: "bg-blue-500" },
    { name: "Transportation", spent: 320, budget: 400, color: "bg-green-500" },
    { name: "Entertainment", spent: 180, budget: 300, color: "bg-purple-500" },
    { name: "Shopping", spent: 420, budget: 500, color: "bg-orange-500" },
  ];

  const chartConfig = {
    netWorth: {
      label: "Net Worth",
      color: "#3b82f6",
    },
    spending: {
      label: "Spending",
      color: "#ef4444",
    },
    budget: {
      label: "Budget",
      color: "#10b981",
    },
  } satisfies ChartConfig;

  return (
    <Layout title="Dashboard">
      <div className="p-6 space-y-6">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">$12,350</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                +2.1% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Spending
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">$3,200</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                -5.2% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Accounts
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />2
                connected this month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Savings Goals
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Activity className="mr-1 h-3 w-3 text-blue-500" />
                67% average progress
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Net Worth Trend */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Net Worth Trend</CardTitle>
              <CardDescription>
                Your financial progress over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <LineChart data={netWorthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="netWorth"
                    stroke="var(--color-netWorth)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-netWorth)" }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Expense Breakdown */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
              <CardDescription>
                Current month spending by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <PieChart>
                  <Pie
                    data={expenseData}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    label
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Spending vs Budget */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Spending vs Budget</CardTitle>
            <CardDescription>
              Track your spending against your monthly budget limits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={monthlySpendingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="budget"
                  fill="var(--color-budget)"
                  name="Budget"
                />
                <Bar
                  dataKey="spending"
                  fill="var(--color-spending)"
                  name="Spending"
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest financial activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.amount > 0 ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        {transaction.amount > 0 ? (
                          <ArrowUpRight className="w-5 h-5 text-green-600" />
                        ) : (
                          <ArrowDownRight className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {transaction.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          {transaction.date} • {transaction.account}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          transaction.amount > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.amount > 0 ? "+" : ""}$
                        {Math.abs(transaction.amount).toFixed(2)}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {transaction.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Transactions
              </Button>
            </CardContent>
          </Card>

          {/* Budget Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
              <CardDescription>Current month progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgets.map((budget, index) => {
                  const percentage = (budget.spent / budget.budget) * 100;
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {budget.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          ${budget.spent} / ${budget.budget}
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {percentage.toFixed(0)}% used
                        </span>
                        <span className="text-xs text-gray-500">
                          ${budget.budget - budget.spent} remaining
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Manage Budgets
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Frequently used features for faster access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center space-y-2">
                <CreditCard className="w-6 h-6" />
                <span className="text-sm">Add Account</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
              >
                <Activity className="w-6 h-6" />
                <span className="text-sm">Add Transaction</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
              >
                <Target className="w-6 h-6" />
                <span className="text-sm">Create Budget</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
              >
                <Wallet className="w-6 h-6" />
                <span className="text-sm">Set Goal</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
