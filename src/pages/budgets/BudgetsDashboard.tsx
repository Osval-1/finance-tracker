import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Target,
  TrendingUp,
  BarChart,
  PieChart,
  AlertTriangle,
} from "lucide-react";
import { Layout } from "@/components/shared";

// Budget components
import { BudgetOverview } from "@/components/features/budgets/BudgetOverview";
import { BudgetProgressChart } from "@/components/features/budgets/BudgetProgressChart";
import { BudgetAnalytics } from "@/components/features/budgets/BudgetAnalytics";
import { BudgetCard } from "@/components/features/budgets/BudgetCard";
import { BudgetFormModal } from "@/components/features/budgets/BudgetFormModal";

// Hooks and utilities
import { useBudgets } from "@/hooks/budgets/useBudgets";
import {
  useDeleteBudget,
  useArchiveBudget,
} from "@/hooks/budgets/useBudgetMutations";
import { useBudgetStore } from "@/store/budgetStore";
import {
  addBudgetStatus,
  sortBudgetsByPriority,
  filterBudgetsByStatus,
} from "@/utils/budgetCalculations";

export function BudgetsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");

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
  const { data: budgetsResponse } = useBudgets({
    isActive: true,
  });

  // Mutations
  const deleteBudgetMutation = useDeleteBudget();
  const archiveBudgetMutation = useArchiveBudget();

  const budgets = budgetsResponse?.budgets || [];
  const budgetsWithStatus = budgets.map(addBudgetStatus);
  const prioritizedBudgets = sortBudgetsByPriority(budgetsWithStatus);

  // Budget status counts
  const statusCounts = {
    total: budgets.length,
    over: filterBudgetsByStatus(budgetsWithStatus, "over").length,
    near: filterBudgetsByStatus(budgetsWithStatus, "near").length,
    under: filterBudgetsByStatus(budgetsWithStatus, "under").length,
  };

  const handleEditBudget = (budget: (typeof budgets)[0]) => {
    openEditModal(budget);
  };

  const handleDeleteBudget = async (budgetId: string) => {
    await deleteBudgetMutation.mutateAsync(budgetId);
  };

  const handleArchiveBudget = async (budgetId: string) => {
    await archiveBudgetMutation.mutateAsync(budgetId);
  };

  // Calculate overall health score
  const getHealthScore = () => {
    if (statusCounts.total === 0) return 100;
    const healthyBudgets = statusCounts.under;
    return Math.round((healthyBudgets / statusCounts.total) * 100);
  };

  const healthScore = getHealthScore();

  return (
    <Layout title="Budget Dashboard">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Budget Dashboard
            </h1>
            <p className="text-muted-foreground">
              Comprehensive overview of your financial budgets and spending
              patterns
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Health Score:
              </span>
              <Badge
                variant={
                  healthScore >= 80
                    ? "default"
                    : healthScore >= 60
                    ? "secondary"
                    : "destructive"
                }
                className="font-semibold"
              >
                {healthScore}%
              </Badge>
            </div>
            <Button onClick={openCreateModal} className="gap-2">
              <Plus className="h-4 w-4" />
              New Budget
            </Button>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card onClick={() => setSelectedPeriod("monthly")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Budgets
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.total}</div>
              <p className="text-xs text-muted-foreground">
                Active budget categories
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On Track</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {statusCounts.under}
              </div>
              <p className="text-xs text-muted-foreground">
                Budgets within limits
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">At Risk</CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {statusCounts.near}
              </div>
              <p className="text-xs text-muted-foreground">
                Near budget limits
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Over Budget</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {statusCounts.over}
              </div>
              <p className="text-xs text-muted-foreground">
                Exceeded budget limits
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="budgets" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Budgets
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Trends
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Budget Overview Widget */}
            <BudgetOverview />

            {/* Priority Budgets */}
            {prioritizedBudgets.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Priority Budgets</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Budgets that need your attention sorted by priority
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {prioritizedBudgets.slice(0, 6).map((budget) => (
                      <BudgetCard
                        key={budget.id}
                        budget={budget}
                        onEdit={handleEditBudget}
                        onArchive={handleArchiveBudget}
                        onDelete={handleDeleteBudget}
                        className="h-fit"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* All Budgets Tab */}
          <TabsContent value="budgets" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Budgets</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Manage all your budget categories
                    </p>
                  </div>
                  <Button onClick={openCreateModal} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Budget
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {budgetsWithStatus.map((budget) => (
                    <BudgetCard
                      key={budget.id}
                      budget={budget}
                      onEdit={handleEditBudget}
                      onArchive={handleArchiveBudget}
                      onDelete={handleDeleteBudget}
                    />
                  ))}
                </div>
                {budgetsWithStatus.length === 0 && (
                  <div className="text-center py-12">
                    <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No budgets yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first budget to start tracking your spending
                      limits
                    </p>
                    <Button onClick={openCreateModal}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Budget
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <BudgetAnalytics />
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <BudgetProgressChart period={selectedPeriod} />
          </TabsContent>
        </Tabs>

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
