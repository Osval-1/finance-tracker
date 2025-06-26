import { useState } from "react";
import {
  Plus,
  Filter,
  SlidersHorizontal,
  Download,
  DollarSign,
  Target,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Layout } from "@/components/shared";

// Budget components and hooks
import { BudgetCard } from "@/components/features/budgets/BudgetCard";
import { BudgetFormModal } from "@/components/features/budgets/BudgetFormModal";
import { BudgetOverview } from "@/components/features/budgets/BudgetOverview";
import { useBudgets } from "@/hooks/budgets/useBudgets";
import {
  useDeleteBudget,
  useArchiveBudget,
  useRefreshBudgets,
  useExportBudgets,
} from "@/hooks/budgets/useBudgetMutations";
import { useBudgetStore } from "@/store/budgetStore";
import {
  addBudgetStatus,
  sortBudgetsByPriority,
  filterBudgetsByStatus,
} from "@/utils/budgetCalculations";

export function BudgetsListScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [periodFilter, setPeriodFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("priority");
  const [showArchived, setShowArchived] = useState(false);

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
  const { data: budgetsResponse, isLoading: budgetsLoading } = useBudgets({
    isActive: !showArchived,
  });

  // Mutations
  const deleteBudgetMutation = useDeleteBudget();
  const archiveBudgetMutation = useArchiveBudget();
  const refreshBudgetsMutation = useRefreshBudgets();
  const exportBudgetsMutation = useExportBudgets();

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

  // Sort budgets
  const sortedBudgets = (() => {
    switch (sortBy) {
      case "priority":
        return sortBudgetsByPriority(filteredBudgets);
      case "name":
        return [...filteredBudgets].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      case "amount":
        return [...filteredBudgets].sort((a, b) => b.amount - a.amount);
      case "spent":
        return [...filteredBudgets].sort((a, b) => b.spent - a.spent);
      case "remaining":
        return [...filteredBudgets].sort((a, b) => b.remaining - a.remaining);
      default:
        return filteredBudgets;
    }
  })();

  const handleEditBudget = (budget: (typeof budgets)[0]) => {
    openEditModal(budget);
  };

  const handleDeleteBudget = async (budgetId: string) => {
    await deleteBudgetMutation.mutateAsync(budgetId);
  };

  const handleArchiveBudget = async (budgetId: string) => {
    await archiveBudgetMutation.mutateAsync(budgetId);
  };

  const handleRefresh = async () => {
    await refreshBudgetsMutation.mutateAsync();
  };

  const handleExportCSV = async () => {
    const filters = {
      isActive: !showArchived,
      ...(statusFilter !== "all" && { isOverBudget: statusFilter === "over" }),
      ...(periodFilter !== "all" && { period: periodFilter }),
    };
    await exportBudgetsMutation.mutateAsync({ format: "csv", filters });
  };

  const handleExportPDF = async () => {
    const filters = {
      isActive: !showArchived,
      ...(statusFilter !== "all" && { isOverBudget: statusFilter === "over" }),
      ...(periodFilter !== "all" && { period: periodFilter }),
    };
    await exportBudgetsMutation.mutateAsync({ format: "pdf", filters });
  };

  // Calculate budget stats
  const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const totalRemaining = totalBudgeted - totalSpent;
  const spentPercentage =
    totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

  const statusCounts = {
    all: budgetsWithStatus.length,
    over: filterBudgetsByStatus(budgetsWithStatus, "over").length,
    near: filterBudgetsByStatus(budgetsWithStatus, "near").length,
    under: filterBudgetsByStatus(budgetsWithStatus, "under").length,
  };

  return (
    <Layout title="Budgets">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-muted-foreground">
              Track and manage your spending limits across different categories
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshBudgetsMutation.isPending}
              className="border-gray-300 hover:bg-gray-50 rounded-xl"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              {refreshBudgetsMutation.isPending ? "Refreshing..." : "Refresh"}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-50 rounded-xl"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="rounded-xl bg-white/95 backdrop-blur-sm border-white/20"
              >
                <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleExportCSV}
                  className="rounded-lg cursor-pointer hover:bg-blue-50 m-1"
                >
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleExportPDF}
                  className="rounded-lg cursor-pointer hover:bg-blue-50 m-1"
                >
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-blue-50 m-1">
                  Email Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              onClick={openCreateModal}
              className="gap-2 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              Add Budget
            </Button>
          </div>
        </div>

        {/* Enhanced Summary Cards */}
        {budgetsResponse?.summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="border-b border-gray-100 bg-white rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-medium text-gray-700">
                      Total Budget Health
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-500 mt-1">
                      Overall spending performance
                    </CardDescription>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {statusCounts.over > 0
                    ? "Attention"
                    : statusCounts.near > 0
                    ? "Caution"
                    : "Excellent"}
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
                      statusCounts.over > 0
                        ? "bg-red-100"
                        : statusCounts.near > 0
                        ? "bg-amber-100"
                        : "bg-green-100"
                    }`}
                  >
                    <ArrowUpRight
                      className={`w-3 h-3 ${
                        statusCounts.over > 0
                          ? "text-red-600"
                          : statusCounts.near > 0
                          ? "text-amber-600"
                          : "text-green-600"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium ${
                        statusCounts.over > 0
                          ? "text-red-700"
                          : statusCounts.near > 0
                          ? "text-amber-700"
                          : "text-green-700"
                      }`}
                    >
                      {statusCounts.over} over budget
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="border-b border-gray-100 bg-white rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-medium text-gray-700">
                      Budget Utilization
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-500 mt-1">
                      Percentage of budget spent
                    </CardDescription>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-emerald-600 mb-2">
                  {spentPercentage.toFixed(1)}%
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 bg-blue-100 px-2 py-1 rounded-full">
                    <DollarSign className="w-3 h-3 text-blue-600" />
                    <span className="text-blue-700 text-xs font-medium">
                      ${totalSpent.toLocaleString()} spent
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="border-b border-gray-100 bg-white rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-medium text-gray-700">
                      Available Budget
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-500 mt-1">
                      Remaining amount to spend
                    </CardDescription>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-amber-600 mb-2">
                  ${totalRemaining.toLocaleString()}
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 bg-purple-100 px-2 py-1 rounded-full">
                    <Target className="w-3 h-3 text-purple-600" />
                    <span className="text-purple-700 text-xs font-medium">
                      {budgets.length} active budgets
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Budget Overview Widget */}
        <BudgetOverview />

        {/* Filters and Search */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              <div className="lg:col-span-2">
                <Input
                  placeholder="Search budgets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All Status ({statusCounts.all})
                  </SelectItem>
                  <SelectItem value="under">
                    On Track ({statusCounts.under})
                  </SelectItem>
                  <SelectItem value="near">
                    Near Limit ({statusCounts.near})
                  </SelectItem>
                  <SelectItem value="over">
                    Over Budget ({statusCounts.over})
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Periods</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="amount">Budget Amount</SelectItem>
                  <SelectItem value="spent">Amount Spent</SelectItem>
                  <SelectItem value="remaining">Remaining</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showArchived"
                  checked={showArchived}
                  onChange={(e) => setShowArchived(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="showArchived" className="text-sm font-medium">
                  Show Archived
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Cards */}
        {budgetsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card
                key={i}
                className="border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4"
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
          <Card className="border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center">
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery || statusFilter !== "all" || periodFilter !== "all"
                  ? "No budgets match your filters"
                  : showArchived
                  ? "No archived budgets found"
                  : "No budgets created yet"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== "all" || periodFilter !== "all"
                  ? "Try adjusting your search or filters to find budgets."
                  : showArchived
                  ? "You have no archived budgets."
                  : "Create your first budget to start tracking your spending limits."}
              </p>
              {!searchQuery &&
                statusFilter === "all" &&
                periodFilter === "all" &&
                !showArchived && (
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
          <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
            <span>
              Showing {sortedBudgets.length} of {budgets.length} budgets
            </span>
            <div className="flex items-center gap-4">
              <Badge variant="outline">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                {statusCounts.under} On Track
              </Badge>
              <Badge variant="outline">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                {statusCounts.near} Near Limit
              </Badge>
              <Badge variant="outline">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                {statusCounts.over} Over Budget
              </Badge>
            </div>
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
    </Layout>
  );
}
