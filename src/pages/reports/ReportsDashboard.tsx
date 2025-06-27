import { useState } from "react";
import { Layout } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { useReportsData } from "@/hooks/reports/useReports";
import { toast } from "sonner";

export function ReportsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("this-month");
  const [selectedReport, setSelectedReport] = useState("overview");

  const {
    data: reportsData,
    isLoading,
    error,
  } = useReportsData(selectedPeriod);

  const handleExport = () => {
    toast.success("Export started - this will be available soon!");
  };

  const handleFilter = () => {
    toast.info("Advanced filters will be available soon!");
  };

  if (error) {
    return (
      <Layout title="Reports">
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load reports data. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  const overviewStats = reportsData?.data.summary
    ? [
        {
          title: "Net Worth",
          value: `$${reportsData.data.summary.netWorth.toLocaleString()}`,
          change: `$${reportsData.data.summary.netWorthChange.toLocaleString()}`,
          trend: reportsData.data.summary.netWorthChange >= 0 ? "up" : "down",
          percentage: `${
            reportsData.data.summary.netWorthChange >= 0 ? "+" : ""
          }${(
            (reportsData.data.summary.netWorthChange /
              reportsData.data.summary.netWorth) *
            100
          ).toFixed(1)}%`,
          icon: TrendingUp,
          color: "text-green-600",
          bgColor: "bg-green-100",
        },
        {
          title: "Total Income",
          value: `$${reportsData.data.summary.totalIncome.toLocaleString()}`,
          change: `$${reportsData.data.summary.incomeChange.toLocaleString()}`,
          trend: reportsData.data.summary.incomeChange >= 0 ? "up" : "down",
          percentage: `${
            reportsData.data.summary.incomeChange >= 0 ? "+" : ""
          }${(
            (reportsData.data.summary.incomeChange /
              reportsData.data.summary.totalIncome) *
            100
          ).toFixed(1)}%`,
          icon: ArrowUpRight,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        },
        {
          title: "Total Expenses",
          value: `$${reportsData.data.summary.totalExpenses.toLocaleString()}`,
          change: `$${Math.abs(
            reportsData.data.summary.expenseChange
          ).toLocaleString()}`,
          trend: reportsData.data.summary.expenseChange <= 0 ? "up" : "down",
          percentage: `${
            reportsData.data.summary.expenseChange <= 0 ? "+" : "-"
          }${(
            Math.abs(
              reportsData.data.summary.expenseChange /
                reportsData.data.summary.totalExpenses
            ) * 100
          ).toFixed(1)}%`,
          icon: ArrowDownRight,
          color: "text-red-600",
          bgColor: "bg-red-100",
        },
        {
          title: "Savings Rate",
          value: `${reportsData.data.summary.savingsRate}%`,
          change: `${
            reportsData.data.summary.savingsRateChange >= 0 ? "+" : ""
          }${reportsData.data.summary.savingsRateChange}%`,
          trend:
            reportsData.data.summary.savingsRateChange >= 0 ? "up" : "down",
          percentage: "vs last month",
          icon: Target,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
        },
      ]
    : [];

  // const expenseCategories = [
  //   { name: "Housing", amount: 2450, percentage: 40, color: "bg-blue-500" },
  //   {
  //     name: "Food & Dining",
  //     amount: 1230,
  //     percentage: 20,
  //     color: "bg-green-500",
  //   },
  //   {
  //     name: "Transportation",
  //     amount: 980,
  //     percentage: 16,
  //     color: "bg-yellow-500",
  //   },
  //   {
  //     name: "Entertainment",
  //     amount: 740,
  //     percentage: 12,
  //     color: "bg-purple-500",
  //   },
  //   { name: "Shopping", amount: 460, percentage: 8, color: "bg-pink-500" },
  //   { name: "Other", amount: 260, percentage: 4, color: "bg-gray-500" },
  // ];

  // const monthlyTrends = [
  //   { month: "Jan", income: 7800, expenses: 6200, savings: 1600 },
  //   { month: "Feb", income: 8200, expenses: 5900, savings: 2300 },
  //   { month: "Mar", income: 7950, expenses: 6400, savings: 1550 },
  //   { month: "Apr", income: 8100, expenses: 6100, savings: 2000 },
  //   { month: "May", income: 8450, expenses: 6120, savings: 2330 },
  // ];

  // const topSpendingAccounts = [
  //   {
  //     name: "Chase Checking",
  //     type: "Checking",
  //     spent: "$3,240",
  //     transactions: 45,
  //     icon: Wallet,
  //   },
  //   {
  //     name: "Capital One Credit",
  //     type: "Credit Card",
  //     spent: "$2,150",
  //     transactions: 32,
  //     icon: CreditCard,
  //   },
  //   {
  //     name: "Wells Fargo Savings",
  //     type: "Savings",
  //     spent: "$680",
  //     transactions: 8,
  //     icon: Receipt,
  //   },
  // ];

  return (
    <Layout title="Reports">
      {/* Background with colorful gradient */}
      <div className="min-h-full bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-purple-300/30 to-pink-400/30 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-0 w-64 h-64 bg-gradient-to-br from-blue-300/30 to-cyan-400/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gradient-to-br from-emerald-300/30 to-teal-400/30 rounded-full blur-3xl"></div>

        <div className="relative z-10 p-6 max-w-7xl mx-auto space-y-6">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={handleFilter}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 rounded-xl"
                onClick={handleExport}
              >
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
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <Card
                      key={i}
                      className="border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg"
                    >
                      <CardContent className="p-6">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-8 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-2/3" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Primary Blue - Net Worth */}
                  {overviewStats.length > 0 && (
                    <Card className="border-0 bg-gradient-to-br from-blue-500 to-indigo-600 text-white overflow-hidden relative">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-blue-50">
                          {overviewStats[0].title}
                        </CardTitle>
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                          <TrendingUp className="h-5 w-5 text-white" />
                        </div>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <div className="text-2xl md:text-3xl font-bold text-white">
                          {overviewStats[0].value}
                        </div>
                        <div className="flex items-center text-xs text-blue-100">
                          <ArrowUpRight className="mr-1 h-3 w-3" />
                          {overviewStats[0].change} vs last period
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Secondary Green - Total Income */}
                  {overviewStats.length > 1 && (
                    <Card className="border-0 bg-gradient-to-br from-emerald-500 to-teal-600 text-white overflow-hidden relative">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-emerald-50">
                          {overviewStats[1].title}
                        </CardTitle>
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                          <ArrowUpRight className="h-5 w-5 text-white" />
                        </div>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <div className="text-2xl md:text-3xl font-bold text-white">
                          {overviewStats[1].value}
                        </div>
                        <div className="flex items-center text-xs text-emerald-100">
                          <TrendingUp className="mr-1 h-3 w-3" />
                          {overviewStats[1].change} vs last period
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Accent Red - Total Expenses */}
                  {overviewStats.length > 2 && (
                    <Card className="border-0 bg-gradient-to-br from-red-500 to-rose-600 text-white overflow-hidden relative">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-red-50">
                          {overviewStats[2].title}
                        </CardTitle>
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                          <ArrowDownRight className="h-5 w-5 text-white" />
                        </div>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <div className="text-2xl md:text-3xl font-bold text-white">
                          {overviewStats[2].value}
                        </div>
                        <div className="flex items-center text-xs text-red-100">
                          <DollarSign className="mr-1 h-3 w-3" />
                          {overviewStats[2].change} vs last period
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Purple Special Case - Savings Rate */}
                  {overviewStats.length > 3 && (
                    <Card className="border-0 bg-gradient-to-br from-violet-500 to-purple-600 text-white overflow-hidden relative">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-violet-50">
                          {overviewStats[3].title}
                        </CardTitle>
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                          <Target className="h-5 w-5 text-white" />
                        </div>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <div className="text-2xl md:text-3xl font-bold text-white">
                          {overviewStats[3].value}
                        </div>
                        <div className="flex items-center text-xs text-violet-100">
                          <ArrowUpRight className="mr-1 h-3 w-3" />
                          {overviewStats[3].percentage}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Charts Placeholder */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm rounded-2xl">
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

                <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm rounded-2xl">
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
                <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <PieChart className="h-5 w-5 mr-2 text-purple-600" />
                      Expense Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-4">
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-3">
                              <Skeleton className="w-4 h-4 rounded-full" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                            <div className="text-right">
                              <Skeleton className="h-4 w-16 mb-1" />
                              <Skeleton className="h-3 w-8" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {reportsData?.data.expenseCategories.map(
                          (category, index) => (
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
                          )
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Top Merchants */}
                <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Receipt className="h-5 w-5 mr-2 text-orange-600" />
                      Top Merchants
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <Skeleton className="h-4 w-20 mb-1" />
                              <Skeleton className="h-3 w-16" />
                            </div>
                            <Skeleton className="h-4 w-12" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {reportsData?.data.topMerchants.map(
                          (merchant, index) => (
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
                          )
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Trends Tab */}
            <TabsContent value="trends" className="space-y-8">
              <div className="grid grid-cols-1 gap-6">
                {/* Monthly Trends Table */}
                <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                      Monthly Financial Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center"
                          >
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-12" />
                          </div>
                        ))}
                      </div>
                    ) : (
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
                            {reportsData?.data.monthlyTrends.map(
                              (month, index) => {
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
                              }
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Accounts Tab */}
            <TabsContent value="accounts" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Account Performance */}
                <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Wallet className="h-5 w-5 mr-2 text-green-600" />
                      Top Spending Accounts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                          >
                            <div className="flex items-center space-x-3">
                              <Skeleton className="w-10 h-10 rounded-xl" />
                              <div>
                                <Skeleton className="h-4 w-24 mb-1" />
                                <Skeleton className="h-3 w-32" />
                              </div>
                            </div>
                            <Skeleton className="h-4 w-16" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {reportsData?.data.topSpendingAccounts.map(
                          (account, index) => {
                            const IconComponent =
                              account.icon === "Wallet"
                                ? Wallet
                                : account.icon === "CreditCard"
                                ? CreditCard
                                : Receipt;
                            return (
                              <div
                                key={index}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <IconComponent className="h-5 w-5 text-blue-600" />
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
                          }
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Account Balance Trends */}
                <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm rounded-2xl">
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
            <Card className="border-0 shadow-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl">
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
                    onClick={handleExport}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Reports
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-indigo-600 rounded-xl"
                    onClick={() =>
                      toast.info("Goal setting will be available soon!")
                    }
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
