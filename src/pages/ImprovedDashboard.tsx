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
    { category: "Food", amount: 1200, color: "#FF6B6B" },
    { category: "Transport", amount: 800, color: "#4ECDC4" },
    { category: "Entertainment", amount: 600, color: "#45B7D1" },
    { category: "Utilities", amount: 400, color: "#96CEB4" },
    { category: "Shopping", amount: 900, color: "#FECA57" },
    { category: "Healthcare", amount: 300, color: "#FF9FF3" },
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
    {
      name: "Food & Dining",
      spent: 950,
      budget: 1200,
      color: "from-red-400 to-pink-500",
    },
    {
      name: "Transportation",
      spent: 320,
      budget: 400,
      color: "from-blue-400 to-cyan-500",
    },
    {
      name: "Entertainment",
      spent: 180,
      budget: 300,
      color: "from-purple-400 to-violet-500",
    },
    {
      name: "Shopping",
      spent: 420,
      budget: 500,
      color: "from-orange-400 to-amber-500",
    },
  ];

  const chartConfig = {
    netWorth: {
      label: "Net Worth",
      color: "#4F46E5",
    },
    spending: {
      label: "Spending",
      color: "#EF4444",
    },
    budget: {
      label: "Budget",
      color: "#10B981",
    },
  } satisfies ChartConfig;

  return (
    <Layout title="Dashboard">
      {/* Background with colorful gradient */}
      <div className="min-h-full bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-purple-300/30 to-pink-400/30 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-0 w-64 h-64 bg-gradient-to-br from-blue-300/30 to-cyan-400/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gradient-to-br from-emerald-300/30 to-teal-400/30 rounded-full blur-3xl"></div>

        <div className="relative z-10 p-6 space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 bg-gradient-to-br from-emerald-500 to-teal-600 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-emerald-50">
                  Net Worth
                </CardTitle>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-white">$12,350</div>
                <div className="flex items-center text-xs text-emerald-100">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +2.1% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-rose-500 to-pink-600 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-rose-50">
                  Monthly Spending
                </CardTitle>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-white">$3,200</div>
                <div className="flex items-center text-xs text-rose-100">
                  <TrendingDown className="mr-1 h-3 w-3" />
                  -5.2% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-violet-500 to-purple-600 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-violet-50">
                  Active Accounts
                </CardTitle>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Wallet className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-white">8</div>
                <div className="flex items-center text-xs text-violet-100">
                  <ArrowUpRight className="mr-1 h-3 w-3" />2 connected this
                  month
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-amber-500 to-orange-600 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-amber-50">
                  Savings Goals
                </CardTitle>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Target className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-white">3</div>
                <div className="flex items-center text-xs text-amber-100">
                  <Activity className="mr-1 h-3 w-3" />
                  67% average progress
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Net Worth Trend */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                <CardTitle className="text-gray-800">Net Worth Trend</CardTitle>
                <CardDescription className="text-gray-600">
                  Your financial progress over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ChartContainer
                  config={chartConfig}
                  className="h-[200px] w-full"
                >
                  <LineChart data={netWorthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="netWorth"
                      stroke="#4F46E5"
                      strokeWidth={3}
                      dot={{ fill: "#4F46E5", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Expense Breakdown */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-rose-50 to-pink-50">
                <CardTitle className="text-gray-800">
                  Expense Breakdown
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Current month spending by category
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ChartContainer
                  config={chartConfig}
                  className="h-[200px] w-full"
                >
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
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
              <CardTitle className="text-gray-800">
                Monthly Spending vs Budget
              </CardTitle>
              <CardDescription className="text-gray-600">
                Track your spending against your monthly budget limits
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart data={monthlySpendingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="budget"
                    fill="#10B981"
                    name="Budget"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="spending"
                    fill="#EF4444"
                    name="Spending"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Transactions */}
            <Card className="lg:col-span-2 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                <CardTitle className="text-gray-800">
                  Recent Transactions
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Your latest financial activity
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-100"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            transaction.amount > 0
                              ? "bg-gradient-to-br from-green-400 to-emerald-500"
                              : "bg-gradient-to-br from-red-400 to-rose-500"
                          }`}
                        >
                          {transaction.amount > 0 ? (
                            <ArrowUpRight className="w-6 h-6 text-white" />
                          ) : (
                            <ArrowDownRight className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {transaction.description}
                          </p>
                          <p className="text-sm text-gray-500">
                            {transaction.date} • {transaction.account}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold text-lg ${
                            transaction.amount > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.amount > 0 ? "+" : ""}$
                          {Math.abs(transaction.amount).toFixed(2)}
                        </p>
                        <Badge
                          variant="outline"
                          className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200 text-purple-700"
                        >
                          {transaction.category}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-indigo-100"
                >
                  View All Transactions
                </Button>
              </CardContent>
            </Card>

            {/* Budget Overview */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-violet-50 to-purple-50">
                <CardTitle className="text-gray-800">Budget Overview</CardTitle>
                <CardDescription className="text-gray-600">
                  Current month progress
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {budgets.map((budget, index) => {
                    const percentage = (budget.spent / budget.budget) * 100;
                    return (
                      <div key={index} className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-gray-800">
                            {budget.name}
                          </span>
                          <span className="text-sm font-medium text-gray-600">
                            ${budget.spent} / ${budget.budget}
                          </span>
                        </div>
                        <div className="relative">
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className={`bg-gradient-to-r ${budget.color} h-3 rounded-full transition-all duration-500 ease-out`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-gray-500">
                            {percentage.toFixed(0)}% used
                          </span>
                          <span className="text-xs font-medium text-gray-500">
                            ${budget.budget - budget.spent} remaining
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-6 bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200 text-violet-700 hover:from-violet-100 hover:to-purple-100"
                >
                  Manage Budgets
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-cyan-50 to-blue-50">
              <CardTitle className="text-gray-800">Quick Actions</CardTitle>
              <CardDescription className="text-gray-600">
                Frequently used features for faster access
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 rounded-xl">
                  <CreditCard className="w-6 h-6" />
                  <span className="text-sm font-medium">Add Account</span>
                </Button>
                <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 rounded-xl">
                  <Activity className="w-6 h-6" />
                  <span className="text-sm font-medium">Add Transaction</span>
                </Button>
                <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white border-0 rounded-xl">
                  <Target className="w-6 h-6" />
                  <span className="text-sm font-medium">Create Budget</span>
                </Button>
                <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0 rounded-xl">
                  <Wallet className="w-6 h-6" />
                  <span className="text-sm font-medium">Set Goal</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
