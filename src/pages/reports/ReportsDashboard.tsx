import { useState } from "react";
import { Layout } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  CreditCard,
  Wallet,
  Receipt,
} from "lucide-react";

export function ReportsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("this-month");
  const [selectedReport, setSelectedReport] = useState("overview");

  // Mock data for reports
  const overviewStats = [
    {
      title: "Net Worth",
      value: "$127,450",
      change: "+$2,340",
      trend: "up",
      percentage: "+1.9%",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Income",
      value: "$8,450",
      change: "+$450",
      trend: "up",
      percentage: "+5.6%",
      icon: ArrowUpRight,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Expenses",
      value: "$6,120",
      change: "-$280",
      trend: "down",
      percentage: "-4.4%",
      icon: ArrowDownRight,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Savings Rate",
      value: "27.6%",
      change: "+2.1%",
      trend: "up",
      percentage: "vs last month",
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  const expenseCategories = [
    { name: "Housing", amount: 2450, percentage: 40, color: "bg-blue-500" },
    {
      name: "Food & Dining",
      amount: 1230,
      percentage: 20,
      color: "bg-green-500",
    },
    {
      name: "Transportation",
      amount: 980,
      percentage: 16,
      color: "bg-yellow-500",
    },
    {
      name: "Entertainment",
      amount: 740,
      percentage: 12,
      color: "bg-purple-500",
    },
    { name: "Shopping", amount: 460, percentage: 8, color: "bg-pink-500" },
    { name: "Other", amount: 260, percentage: 4, color: "bg-gray-500" },
  ];

  const monthlyTrends = [
    { month: "Jan", income: 7800, expenses: 6200, savings: 1600 },
    { month: "Feb", income: 8200, expenses: 5900, savings: 2300 },
    { month: "Mar", income: 7950, expenses: 6400, savings: 1550 },
    { month: "Apr", income: 8100, expenses: 6100, savings: 2000 },
    { month: "May", income: 8450, expenses: 6120, savings: 2330 },
  ];

  const topSpendingAccounts = [
    {
      name: "Chase Checking",
      type: "Checking",
      spent: "$3,240",
      transactions: 45,
      icon: Wallet,
    },
    {
      name: "Capital One Credit",
      type: "Credit Card",
      spent: "$2,150",
      transactions: 32,
      icon: CreditCard,
    },
    {
      name: "Wells Fargo Savings",
      type: "Savings",
      spent: "$680",
      transactions: 8,
      icon: Receipt,
    },
  ];

  return (
    <Layout title="Reports & Analytics">
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-200/20 to-blue-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-cyan-200/20 to-teal-300/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 p-6 max-w-7xl mx-auto">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Financial Reports
              </h1>
              <p className="text-gray-600">
                Comprehensive insights into your financial performance
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40 rounded-xl border-gray-200">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="this-quarter">This Quarter</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="rounded-xl">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <Tabs
            value={selectedReport}
            onValueChange={setSelectedReport}
            className="space-y-8"
          >
            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
              <TabsList className="grid w-full grid-cols-4 bg-transparent gap-2">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-xl transition-all duration-200"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="expenses"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-xl transition-all duration-200"
                >
                  <PieChart className="h-4 w-4 mr-2" />
                  Expenses
                </TabsTrigger>
                <TabsTrigger
                  value="trends"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-xl transition-all duration-200"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Trends
                </TabsTrigger>
                <TabsTrigger
                  value="accounts"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-xl transition-all duration-200"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Accounts
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {overviewStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card
                      key={index}
                      className="border-0 shadow-sm bg-white/70 backdrop-blur-sm hover:shadow-md transition-all duration-200"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div
                            className={`w-10 h-10 ${stat.bgColor} rounded-xl flex items-center justify-center`}
                          >
                            <Icon className={`h-5 w-5 ${stat.color}`} />
                          </div>
                          <Badge
                            variant={
                              stat.trend === "up" ? "default" : "destructive"
                            }
                            className="rounded-full"
                          >
                            {stat.percentage}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            {stat.title}
                          </p>
                          <p className="text-2xl font-bold text-gray-900 mb-1">
                            {stat.value}
                          </p>
                          <p
                            className={`text-sm ${
                              stat.trend === "up"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {stat.change} vs last period
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Charts Placeholder */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                      Income vs Expenses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                          Chart visualization coming soon
                        </p>
                        <p className="text-sm text-gray-500">
                          Interactive income vs expenses chart
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                      Net Worth Growth
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                          Chart visualization coming soon
                        </p>
                        <p className="text-sm text-gray-500">
                          Net worth progression over time
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Expenses Tab */}
            <TabsContent value="expenses" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Expense Categories */}
                <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <PieChart className="h-5 w-5 mr-2 text-purple-600" />
                      Expense Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {expenseCategories.map((category, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-4 h-4 ${category.color} rounded-full`}
                            ></div>
                            <span className="font-medium text-gray-900">
                              {category.name}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              ${category.amount.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              {category.percentage}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Merchants */}
                <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Receipt className="h-5 w-5 mr-2 text-orange-600" />
                      Top Merchants
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "Amazon", amount: 450, transactions: 12 },
                        { name: "Walmart", amount: 320, transactions: 8 },
                        { name: "Starbucks", amount: 156, transactions: 15 },
                        { name: "Target", amount: 289, transactions: 6 },
                        { name: "McDonald's", amount: 89, transactions: 9 },
                      ].map((merchant, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {merchant.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {merchant.transactions} transactions
                            </p>
                          </div>
                          <p className="font-semibold text-gray-900">
                            ${merchant.amount}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Trends Tab */}
            <TabsContent value="trends" className="space-y-8">
              <div className="grid grid-cols-1 gap-6">
                {/* Monthly Trends Table */}
                <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                      Monthly Financial Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">
                              Month
                            </th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-900">
                              Income
                            </th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-900">
                              Expenses
                            </th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-900">
                              Savings
                            </th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-900">
                              Savings Rate
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {monthlyTrends.map((month, index) => {
                            const savingsRate = (
                              (month.savings / month.income) *
                              100
                            ).toFixed(1);
                            return (
                              <tr
                                key={index}
                                className="border-b border-gray-100 hover:bg-gray-50"
                              >
                                <td className="py-3 px-4 font-medium text-gray-900">
                                  {month.month}
                                </td>
                                <td className="py-3 px-4 text-right text-green-600 font-semibold">
                                  ${month.income.toLocaleString()}
                                </td>
                                <td className="py-3 px-4 text-right text-red-600 font-semibold">
                                  ${month.expenses.toLocaleString()}
                                </td>
                                <td className="py-3 px-4 text-right text-blue-600 font-semibold">
                                  ${month.savings.toLocaleString()}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <Badge
                                    variant="outline"
                                    className="rounded-full"
                                  >
                                    {savingsRate}%
                                  </Badge>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Accounts Tab */}
            <TabsContent value="accounts" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Account Performance */}
                <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Wallet className="h-5 w-5 mr-2 text-green-600" />
                      Top Spending Accounts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topSpendingAccounts.map((account, index) => {
                        const Icon = account.icon;
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Icon className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {account.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {account.type} • {account.transactions}{" "}
                                  transactions
                                </p>
                              </div>
                            </div>
                            <p className="font-semibold text-gray-900">
                              {account.spent}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Account Balance Trends */}
                <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                      Account Balance Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                          Chart visualization coming soon
                        </p>
                        <p className="text-sm text-gray-500">
                          Account balance changes over time
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Bottom CTA */}
          <div className="mt-16">
            <Card className="border-0 shadow-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <CardContent className="p-8 text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-indigo-100" />
                <h3 className="text-2xl font-bold mb-2">
                  Want more detailed analytics?
                </h3>
                <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
                  Get access to advanced reporting features with custom date
                  ranges, goal tracking, and export capabilities.
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    variant="secondary"
                    className="bg-white text-indigo-600 hover:bg-indigo-50 rounded-xl"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Reports
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-indigo-600 rounded-xl"
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Set Financial Goals
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
