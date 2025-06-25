import React from "react";
import { useNavigate } from "react-router";
import { Layout } from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  DollarSign,
  PiggyBank,
  Target,
  Receipt,
  Plus,
  Activity,
  Wallet,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function ImprovedDashboard() {
  const navigate = useNavigate();

  // Sample data for charts
  const netWorthData = [
    { month: "Jan", value: 45000 },
    { month: "Feb", value: 46500 },
    { month: "Mar", value: 48000 },
    { month: "Apr", value: 47200 },
    { month: "May", value: 49800 },
    { month: "Jun", value: 52100 },
  ];

  const categoryData = [
    { name: "Food & Dining", value: 950, color: "#ef4444" },
    { name: "Transportation", value: 320, color: "#3b82f6" },
    { name: "Entertainment", value: 180, color: "#8b5cf6" },
    { name: "Shopping", value: 420, color: "#f59e0b" },
    { name: "Utilities", value: 280, color: "#10b981" },
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

  return (
    <Layout title="Dashboard">
      {/* Background with colorful gradient */}
      <div className="min-h-full bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-purple-300/30 to-pink-400/30 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-0 w-64 h-64 bg-gradient-to-br from-blue-300/30 to-cyan-400/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gradient-to-br from-emerald-300/30 to-teal-400/30 rounded-full blur-3xl"></div>

        <div className="relative z-10 p-6 space-y-6">
          {/* Welcome Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, Sarah! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening with your finances today.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => navigate("/transactions")}
                className="bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Receipt className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
              <Button
                onClick={() => navigate("/accounts")}
                variant="outline"
                className="border-gray-300 hover:bg-gray-50 rounded-xl"
              >
                <Plus className="h-4 w-4 mr-2" />
                Link Account
              </Button>
            </div>
          </div>

          {/* Key Metrics Cards - Colorful Design Following 5-Color Rule */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Primary Blue - Net Worth */}
            <Card className="border-0 bg-gradient-to-br from-blue-500 to-indigo-600 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-blue-50">
                  Net Worth
                </CardTitle>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-white">$52,100</div>
                <div className="flex items-center text-xs text-blue-100">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  +4.2% from last month
                </div>
              </CardContent>
            </Card>

            {/* Secondary Green - Monthly Budget */}
            <Card className="border-0 bg-gradient-to-br from-emerald-500 to-teal-600 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-emerald-50">
                  Monthly Budget
                </CardTitle>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Target className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-white">$2,150</div>
                <div className="flex items-center text-xs text-emerald-100">
                  <DollarSign className="mr-1 h-3 w-3" />
                  $1,350 left
                </div>
              </CardContent>
            </Card>

            {/* Accent Amber - Savings Goal */}
            <Card className="border-0 bg-gradient-to-br from-amber-500 to-orange-600 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-amber-50">
                  Savings Goal
                </CardTitle>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <PiggyBank className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-white">68%</div>
                <div className="flex items-center text-xs text-amber-100">
                  <Target className="mr-1 h-3 w-3" />
                  $6,800 / $10,000
                </div>
              </CardContent>
            </Card>

            {/* Purple Special Case - Credit Score */}
            <Card className="border-0 bg-gradient-to-br from-violet-500 to-purple-600 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-violet-50">
                  Credit Score
                </CardTitle>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-white">742</div>
                <div className="flex items-center text-xs text-violet-100">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  +12 pts this month
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Net Worth Trend */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
                <CardTitle className="text-gray-800">Net Worth Trend</CardTitle>
                <CardDescription className="text-gray-600">
                  Your net worth over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={netWorthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis
                      dataKey="month"
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value / 1000}k`}
                    />
                    <Tooltip
                      formatter={(value) => [
                        `$${value.toLocaleString()}`,
                        "Net Worth",
                      ]}
                      labelStyle={{ color: "#374151" }}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill="url(#netWorthGradient)"
                      radius={[8, 8, 0, 0]}
                    />
                    <defs>
                      <linearGradient
                        id="netWorthGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#1d4ed8" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Spending by Category */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-purple-50 to-violet-50 rounded-t-2xl">
                <CardTitle className="text-gray-800">
                  Spending by Category
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Current month breakdown
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: $${value}`}
                      labelLine={false}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`$${value}`, "Amount"]}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Transactions */}
            <Card className="lg:col-span-2 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-2xl">
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
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate("/transactions")}
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
                  onClick={() => navigate("/transactions")}
                  className="w-full mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-indigo-100 rounded-xl"
                >
                  View All Transactions
                </Button>
              </CardContent>
            </Card>

            {/* Budget Overview */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-2xl">
                <CardTitle className="text-gray-800">Budget Overview</CardTitle>
                <CardDescription className="text-gray-600">
                  This month's progress
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {budgets.map((budget, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          {budget.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          ${budget.spent} / ${budget.budget}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`bg-gradient-to-r ${budget.color} h-2 rounded-full transition-all duration-300`}
                          style={{
                            width: `${Math.min(
                              (budget.spent / budget.budget) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-medium ${
                            budget.spent > budget.budget
                              ? "text-red-600"
                              : budget.spent > budget.budget * 0.8
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {((budget.spent / budget.budget) * 100).toFixed(0)}%
                          used
                        </span>
                        <span className="text-xs text-gray-500">
                          ${budget.budget - budget.spent} left
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate("/budgets")}
                  className="w-full mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 text-amber-700 hover:from-amber-100 hover:to-orange-100 rounded-xl"
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
