import { useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Target,
  TrendingUp,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Layout } from "@/components/shared";

// Budget components and hooks
import { BudgetCard } from "@/components/features/budgets/BudgetCard";
import { BudgetFormModal } from "@/components/features/budgets/BudgetFormModal";
import { useBudgets, useBudgetSummary } from "@/hooks/budgets/useBudgets";
import {
  useDeleteBudget,
  useArchiveBudget,
} from "@/hooks/budgets/useBudgetMutations";
import { useBudgetStore } from "@/store/budgetStore";
import { formatCurrency } from "@/utils/formatters";
import {
  addBudgetStatus,
  sortBudgetsByPriority,
  filterBudgetsByStatus,
} from "@/utils/budgetCalculations";

export function BudgetsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [periodFilter, setPeriodFilter] = useState<string>("all");

  // Store state
  const {
    isCreateModalOpen,
    isEditModalOpen,
    editingBudget,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
  } = useBudgetStore();

  // Data fetching
  const { data: summary, isLoading: summaryLoading } = useBudgetSummary();
  const { data: budgetsResponse, isLoading: budgetsLoading } = useBudgets({
    isActive: true,
  });

  // Mutations
  const deleteBudgetMutation = useDeleteBudget();
  const archiveBudgetMutation = useArchiveBudget();

  const budgets = budgetsResponse?.budgets || [];
  const budgetsWithStatus = budgets.map(addBudgetStatus);

  // Filter budgets based on search and filters
  const filteredBudgets = budgetsWithStatus.filter((budget) => {
    const matchesSearch = budget.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || budget.status === statusFilter;
    const matchesPeriod =
      periodFilter === "all" || budget.period === periodFilter;

    return matchesSearch && matchesStatus && matchesPeriod;
  });

  const sortedBudgets = sortBudgetsByPriority(filteredBudgets);

  const handleEditBudget = (budget: (typeof budgets)[0]) => {
    openEditModal(budget);
  };

  const handleDeleteBudget = async (budgetId: string) => {
    await deleteBudgetMutation.mutateAsync(budgetId);
  };

  const handleArchiveBudget = async (budgetId: string) => {
    await archiveBudgetMutation.mutateAsync(budgetId);
  };

  // Summary stats from API or calculate from budgets
  const stats = summary || {
    totalBudgeted: budgets.reduce((sum, budget) => sum + budget.amount, 0),
    totalSpent: budgets.reduce((sum, budget) => sum + budget.spent, 0),
    totalRemaining: budgets.reduce((sum, budget) => sum + budget.remaining, 0),
    budgetsOverLimit: filterBudgetsByStatus(budgetsWithStatus, "over").length,
    budgetsNearLimit: filterBudgetsByStatus(budgetsWithStatus, "near").length,
  };

  return (
    <Layout title="Budgets">
      {/* Background with colorful gradient */}
      <div className="min-h-full bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-purple-300/30 to-pink-400/30 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-0 w-64 h-64 bg-gradient-to-br from-blue-300/30 to-cyan-400/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gradient-to-br from-emerald-300/30 to-teal-400/30 rounded-full blur-3xl"></div>

        <div className="relative z-10 p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>
              <p className="text-gray-600 mt-1">
                Track and manage your spending limits across different
                categories
              </p>
            </div>
            <Button
              onClick={openCreateModal}
              className="gap-2 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              Add Budget
            </Button>
          </div>

          {/* Enhanced Summary Cards - Following ImprovedDashboard Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Primary Blue - Total Budgeted */}
            <Card className="border-0 bg-gradient-to-br from-blue-500 to-indigo-600 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-blue-50">
                  Total Budgeted
                </CardTitle>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Target className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                {summaryLoading ? (
                  <Skeleton className="h-8 w-24 bg-white/20" />
                ) : (
                  <>
                    <div className="text-3xl font-bold text-white">
                      {formatCurrency(stats.totalBudgeted)}
                    </div>
                    <div className="flex items-center text-xs text-blue-100 mt-1">
                      <DollarSign className="mr-1 h-3 w-3" />
                      Monthly allocation
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Secondary Green - Total Spent */}
            <Card className="border-0 bg-gradient-to-br from-emerald-500 to-teal-600 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-emerald-50">
                  Total Spent
                </CardTitle>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                {summaryLoading ? (
                  <Skeleton className="h-8 w-24 bg-white/20" />
                ) : (
                  <>
                    <div className="text-3xl font-bold text-white">
                      {formatCurrency(stats.totalSpent)}
                    </div>
                    <div className="flex items-center text-xs text-emerald-100 mt-1">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      Current period
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Accent Amber - Remaining */}
            <Card className="border-0 bg-gradient-to-br from-amber-500 to-orange-600 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-amber-50">
                  Remaining
                </CardTitle>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                {summaryLoading ? (
                  <Skeleton className="h-8 w-24 bg-white/20" />
                ) : (
                  <>
                    <div className="text-3xl font-bold text-white">
                      {formatCurrency(stats.totalRemaining)}
                    </div>
                    <div className="flex items-center text-xs text-amber-100 mt-1">
                      <DollarSign className="mr-1 h-3 w-3" />
                      Available to spend
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Purple Special Case - Alerts */}
            <Card className="border-0 bg-gradient-to-br from-violet-500 to-purple-600 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-violet-50">
                  Budget Alerts
                </CardTitle>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                {summaryLoading ? (
                  <Skeleton className="h-8 w-24 bg-white/20" />
                ) : (
                  <>
                    <div className="space-y-1">
                      <div className="text-sm">
                        <span className="font-bold text-2xl text-red-200">
                          {stats.budgetsOverLimit}
                        </span>{" "}
                        <span className="text-violet-100">over limit</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-bold text-lg text-amber-200">
                          {stats.budgetsNearLimit}
                        </span>{" "}
                        <span className="text-violet-100">near limit</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search budgets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 border-0 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] border-0 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-sm border-white/20 rounded-xl">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="under">On Track</SelectItem>
                <SelectItem value="near">Near Limit</SelectItem>
                <SelectItem value="over">Over Budget</SelectItem>
              </SelectContent>
            </Select>

            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="w-[180px] border-0 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                <SelectValue placeholder="Filter by period" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-sm border-white/20 rounded-xl">
                <SelectItem value="all">All Periods</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-0 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white/95 backdrop-blur-sm border-white/20 rounded-xl"
              >
                <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-blue-50 m-1">
                  Export CSV
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-blue-50 m-1">
                  Export PDF
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-blue-50 m-1">
                  Refresh Data
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Budget Cards */}
          {budgetsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card
                  key={i}
                  className="p-4 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg"
                >
                  <Skeleton className="h-6 w-32 mb-4" />
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-2 w-full mb-4" />
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </Card>
              ))}
            </div>
          ) : sortedBudgets.length === 0 ? (
            <Card className="p-8 text-center border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
              <CardContent>
                <h3 className="text-lg font-semibold mb-2">
                  {searchQuery ||
                  statusFilter !== "all" ||
                  periodFilter !== "all"
                    ? "No budgets match your filters"
                    : "No budgets created yet"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ||
                  statusFilter !== "all" ||
                  periodFilter !== "all"
                    ? "Try adjusting your search or filters to find budgets."
                    : "Create your first budget to start tracking your spending limits."}
                </p>
                {!searchQuery &&
                  statusFilter === "all" &&
                  periodFilter === "all" && (
                    <Button
                      onClick={openCreateModal}
                      className="bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Create Budget
                    </Button>
                  )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedBudgets.map((budget) => (
                <BudgetCard
                  key={budget.id}
                  budget={budget}
                  onEdit={handleEditBudget}
                  onArchive={handleArchiveBudget}
                  onDelete={handleDeleteBudget}
                />
              ))}
            </div>
          )}

          {/* Results Summary */}
          {!budgetsLoading && sortedBudgets.length > 0 && (
            <div className="text-center text-sm text-gray-600">
              Showing {sortedBudgets.length} of {budgets.length} budgets
            </div>
          )}

          {/* Modals */}
          <BudgetFormModal
            isOpen={isCreateModalOpen}
            onClose={closeCreateModal}
          />

          <BudgetFormModal
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
            budget={editingBudget}
          />
        </div>
      </div>
    </Layout>
  );
}
