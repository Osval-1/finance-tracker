import { useState } from "react";
import { Plus, Search, MoreHorizontal } from "lucide-react";
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Budgets</h1>
          <p className="text-muted-foreground">
            Track and manage your spending limits across different categories
          </p>
        </div>
        <Button onClick={openCreateModal} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Budget
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Budgeted
            </CardTitle>
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">
                {formatCurrency(stats.totalBudgeted)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">
                {formatCurrency(stats.totalSpent)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.totalRemaining)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="space-y-1">
                <div className="text-sm">
                  <span className="font-medium text-red-600">
                    {stats.budgetsOverLimit}
                  </span>{" "}
                  over limit
                </div>
                <div className="text-sm">
                  <span className="font-medium text-amber-600">
                    {stats.budgetsNearLimit}
                  </span>{" "}
                  near limit
                </div>
              </div>
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
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="under">On Track</SelectItem>
            <SelectItem value="near">Near Limit</SelectItem>
            <SelectItem value="over">Over Budget</SelectItem>
          </SelectContent>
        </Select>

        <Select value={periodFilter} onValueChange={setPeriodFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by period" />
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Export CSV</DropdownMenuItem>
            <DropdownMenuItem>Export PDF</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Refresh Data</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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
                : "No budgets created yet"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== "all" || periodFilter !== "all"
                ? "Try adjusting your search or filters to find budgets."
                : "Create your first budget to start tracking your spending limits."}
            </p>
            {!searchQuery &&
              statusFilter === "all" &&
              periodFilter === "all" && (
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
        <div className="text-center text-sm text-muted-foreground">
          Showing {sortedBudgets.length} of {budgets.length} budgets
        </div>
      )}

      {/* Modals */}
      <BudgetFormModal isOpen={isCreateModalOpen} onClose={closeCreateModal} />

      <BudgetFormModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        budget={editingBudget}
      />
    </div>
  );
}
