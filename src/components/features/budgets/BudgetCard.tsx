import { useState } from "react";
import { useNavigate } from "react-router";
import {
  MoreHorizontal,
  Edit,
  Archive,
  Trash2,
  TrendingUp,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  formatCurrency,
  formatDateRange,
  formatBudgetPeriod,
} from "@/utils/formatters";
import {
  getBudgetStatusClasses,
  getBudgetStatusMessage,
  addBudgetStatus,
} from "@/utils/budgetCalculations";
import type { Budget } from "@/types/budgets";

interface BudgetCardProps {
  budget: Budget;
  onEdit?: (budget: Budget) => void;
  onArchive?: (budgetId: string) => void;
  onDelete?: (budgetId: string) => void;
  className?: string;
}

export function BudgetCard({
  budget,
  onEdit,
  onArchive,
  onDelete,
  className,
}: BudgetCardProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const budgetWithStatus = addBudgetStatus(budget);
  const { status } = budgetWithStatus;
  const statusClasses = getBudgetStatusClasses(status);
  const statusMessage = getBudgetStatusMessage(budgetWithStatus);

  const handleCardClick = () => {
    navigate(`/budgets/${budget.id}`);
  };

  const handleArchive = async () => {
    if (!onArchive) return;
    setIsLoading(true);
    try {
      await onArchive(budget.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsLoading(true);
    try {
      await onDelete(budget.id);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "over":
        return <AlertTriangle className="h-4 w-4" />;
      case "near":
        return <TrendingUp className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const formatPeriodDisplay = () => {
    if (budget.period === "custom" && budget.periodEndDate) {
      return formatDateRange(budget.periodStartDate, budget.periodEndDate);
    }
    return formatBudgetPeriod(budget.period);
  };

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-md cursor-pointer ${className}`}
      onClick={handleCardClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg font-semibold truncate">
          {budget.name}
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              disabled={isLoading}
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(budget)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            )}
            {onArchive && (
              <DropdownMenuItem onClick={handleArchive}>
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </DropdownMenuItem>
            )}
            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Period and Status */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            {formatPeriodDisplay()}
          </Badge>
          {status !== "under" && (
            <div
              className={`flex items-center space-x-1 ${statusClasses.textClass}`}
            >
              {getStatusIcon()}
              <span className="text-xs font-medium">
                {status === "over" ? "Over Budget" : "Near Limit"}
              </span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              {budget.percentUsed.toFixed(0)}%
            </span>
          </div>
          <Progress value={Math.min(budget.percentUsed, 100)} className="h-2" />
        </div>

        {/* Amount Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Spent</p>
            <p className="text-lg font-semibold">
              {formatCurrency(budget.spent)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Budget</p>
            <p className="text-lg font-semibold">
              {formatCurrency(budget.amount)}
            </p>
          </div>
        </div>

        {/* Status Message */}
        <div
          className={`p-3 rounded-lg text-sm font-medium ${statusClasses.bgClass} ${statusClasses.textClass}`}
        >
          {statusMessage}
        </div>

        {/* Period Information */}
        <div className="text-xs text-muted-foreground pt-1 border-t">
          Period: {new Date(budget.periodStartDate).toLocaleDateString()} -{" "}
          {budget.periodEndDate
            ? new Date(budget.periodEndDate).toLocaleDateString()
            : "Ongoing"}
        </div>
      </CardContent>
    </Card>
  );
}
