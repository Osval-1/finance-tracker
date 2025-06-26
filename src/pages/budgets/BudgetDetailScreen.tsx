import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Target,
  TrendingUp,
  Edit,
  Archive,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Layout } from "@/components/shared";

import { BudgetFormModal } from "@/components/features/budgets/BudgetFormModal";
import { BudgetTrendChart } from "@/components/features/budgets/BudgetTrendChart";
import { useBudget, useBudgetProgress } from "@/hooks/budgets/useBudgets";
import {
  useDeleteBudget,
  useArchiveBudget,
} from "@/hooks/budgets/useBudgetMutations";
import { useBudgetStore } from "@/store/budgetStore";
import {
  addBudgetStatus,
  getBudgetStatusClasses,
  getBudgetStatusMessage,
} from "@/utils/budgetCalculations";
import { formatCurrency } from "@/utils/formatters";
import { format } from "date-fns";

export function BudgetDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);

  // Store state
  const { isEditModalOpen, editingBudget, openEditModal, closeEditModal } =
    useBudgetStore();

  // Data fetching
  const { data: budget, isLoading, error } = useBudget(id!);
  const { data: progress, isLoading: progressLoading } = useBudgetProgress(
    id!,
    budget?.periodStartDate || "",
    budget?.periodEndDate || "",
    !!budget
  );

  // Mutations
  const deleteBudgetMutation = useDeleteBudget();
  const archiveBudgetMutation = useArchiveBudget();

  if (!id) {
    navigate("/budgets");
    return null;
  }

  if (error) {
    return (
      <Layout title="Budget Details">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-2">
              Budget Not Found
            </h1>
            <p className="text-muted-foreground mb-4">
              The budget you're looking for doesn't exist or has been deleted.
            </p>
            <Button onClick={() => navigate("/budgets")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Budgets
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout title="Budget Details">
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-64" />
        </div>
      </Layout>
    );
  }

  if (!budget) {
    return null;
  }

  const budgetWithStatus = addBudgetStatus(budget);
  const statusClasses = getBudgetStatusClasses(budgetWithStatus.status);
  const statusMessage = getBudgetStatusMessage(budgetWithStatus);

  const handleEdit = () => {
    openEditModal(budget);
  };

  const handleDelete = async () => {
    try {
      await deleteBudgetMutation.mutateAsync(budget.id);
      navigate("/budgets");
    } catch {
      // Error handled by mutation
    }
    setShowDeleteDialog(false);
  };

  const handleArchive = async () => {
    try {
      await archiveBudgetMutation.mutateAsync(budget.id);
      navigate("/budgets");
    } catch {
      // Error handled by mutation
    }
    setShowArchiveDialog(false);
  };

  const progressPercentage = Math.min(
    (budget.spent / budget.amount) * 100,
    100
  );

  return (
    <Layout title={budget.name || "Budget Details"}>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/budgets")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">
                {budget.name || "Unnamed Budget"}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={statusClasses.textClass}>
                  {budgetWithStatus.status.charAt(0).toUpperCase() +
                    budgetWithStatus.status.slice(1)}
                </Badge>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground capitalize">
                  {budget.period}
                </span>
                {budget.periodStartDate && budget.periodEndDate && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">
                      {format(new Date(budget.periodStartDate), "MMM d")} -{" "}
                      {format(new Date(budget.periodEndDate), "MMM d, yyyy")}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>

            <AlertDialog
              open={showArchiveDialog}
              onOpenChange={setShowArchiveDialog}
            >
              <AlertDialogTrigger asChild>
                <Button variant="outline">
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Archive Budget</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to archive this budget? It will be
                    moved to archived budgets and won't appear in your active
                    budget list.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleArchive}>
                    Archive
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
              open={showDeleteDialog}
              onOpenChange={setShowDeleteDialog}
            >
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Budget</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this budget? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Budget Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Budget Amount
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(budget.amount)}
              </div>
              <p className="text-xs text-muted-foreground">Total allocated</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(budget.spent)}
              </div>
              <p className="text-xs text-muted-foreground">
                {progressPercentage.toFixed(1)}% of budget
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Remaining</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  budget.remaining >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatCurrency(Math.abs(budget.remaining))}
              </div>
              <p className="text-xs text-muted-foreground">
                {budget.remaining >= 0 ? "Available to spend" : "Over budget"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Period</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {budget.period}
              </div>
              <p className="text-xs text-muted-foreground">Budget period</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Section */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{progressPercentage.toFixed(1)}%</span>
              </div>
              <Progress
                value={progressPercentage}
                className="h-3"
                // @ts-expect-error - Progress component should accept this
                indicatorClassName={statusClasses.progressClass}
              />
            </div>
            <p className="text-sm text-muted-foreground">{statusMessage}</p>

            {progress && !progressLoading && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
                <div>
                  <p className="text-sm font-medium">Daily Average</p>
                  <p className="text-lg">
                    {formatCurrency(progress.dailySpendingAverage)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Projected Total</p>
                  <p className="text-lg">
                    {formatCurrency(progress.projectedTotal)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Variance</p>
                  <p
                    className={`text-lg ${
                      progress.projectedTotal <= budget.amount
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {formatCurrency(
                      Math.abs(progress.projectedTotal - budget.amount)
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge
                    variant={
                      progress.projectedTotal <= budget.amount
                        ? "default"
                        : "destructive"
                    }
                  >
                    {progress.projectedTotal <= budget.amount
                      ? "On Track"
                      : "At Risk"}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trend Chart */}
        <BudgetTrendChart categoryId={budget.categoryId} />

        {/* Edit Modal */}
        {isEditModalOpen && editingBudget && (
          <BudgetFormModal
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
            budget={editingBudget}
          />
        )}
      </div>
    </Layout>
  );
}
