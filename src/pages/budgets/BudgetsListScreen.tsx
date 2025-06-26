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

        {/* Key Metrics Cards - Same as Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Primary Blue - Total Budgeted */}
          <Card className="border-0 bg-gradient-to-br from-blue-500 to-indigo-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-blue-50">
                Total Budgeted
              </CardTitle>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-white">
                ${totalBudgeted.toLocaleString()}
              </div>
              <div className="flex items-center text-xs text-blue-100">
                <TrendingUp className="mr-1 h-3 w-3" />
                {budgets.length} active budgets
              </div>
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
              <div className="text-3xl font-bold text-white">
                ${totalSpent.toLocaleString()}
              </div>
              <div className="flex items-center text-xs text-emerald-100">
                <DollarSign className="mr-1 h-3 w-3" />
                {spentPercentage.toFixed(1)}% of budget
              </div>
            </CardContent>
          </Card>

          {/* Accent Amber - Remaining Budget */}
          <Card className="border-0 bg-gradient-to-br from-amber-500 to-orange-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-amber-50">
                Remaining Budget
              </CardTitle>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Target className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-white">
                ${totalRemaining.toLocaleString()}
              </div>
              <div className="flex items-center text-xs text-amber-100">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                Available to spend
              </div>
            </CardContent>
          </Card>

          {/* Purple Special Case - Budget Health */}
          <Card className="border-0 bg-gradient-to-br from-violet-500 to-purple-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-violet-50">
                Budget Health
              </CardTitle>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Target className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-white">
                {statusCounts.over > 0
                  ? "Attention"
                  : statusCounts.near > 0
                  ? "Caution"
                  : "Good"}
              </div>
              <div className="flex items-center text-xs text-violet-100">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                {statusCounts.over} over budget
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget Overview Widget */}
        <BudgetOverview />

        {/* Filters and Search */}
        <Card>
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
              <Card key={i} className="p-4">
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
          <Card className="p-8 text-center">
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
                  <Button onClick={openCreateModal}>Create Budget</Button>
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
