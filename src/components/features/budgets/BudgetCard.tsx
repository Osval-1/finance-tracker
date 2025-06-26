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

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation when clicking on dropdown or buttons
    if (
      (e.target as Element).closest("[data-radix-popper-content-wrapper]") ||
      (e.target as Element).closest("button")
    ) {
      return;
    }
    navigate(`/budgets/${budget.id}`);
  };

  const handleArchive = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onArchive) return;
    setIsLoading(true);
    try {
      await onArchive(budget.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onDelete) return;
    setIsLoading(true);
    try {
      await onDelete(budget.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(budget);
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

  const getStatusBadgeStyle = () => {
    switch (status) {
      case "over":
        return "bg-red-100 text-red-700 border-red-200";
      case "near":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-green-100 text-green-700 border-green-200";
    }
  };

  return (
    <Card
      className={`border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer ${className}`}
      onClick={handleCardClick}
    >
      <CardHeader className="border-b border-gray-100 bg-white rounded-t-2xl">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 truncate">
            {budget.name}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/50 rounded-lg"
                disabled={isLoading}
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="rounded-xl bg-white/95 backdrop-blur-sm border-white/20"
            >
              {onEdit && (
                <DropdownMenuItem
                  onClick={handleEdit}
                  className="rounded-lg cursor-pointer hover:bg-blue-50 m-1"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              )}
              {onArchive && (
                <DropdownMenuItem
                  onClick={handleArchive}
                  className="rounded-lg cursor-pointer hover:bg-blue-50 m-1"
                >
                  <Archive className="mr-2 h-4 w-4" />
                  Archive
                </DropdownMenuItem>
              )}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer m-1"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        {/* Period and Status */}
        <div className="flex items-center justify-between">
          <Badge
            variant="secondary"
            className="text-xs bg-blue-100 text-blue-700 border-blue-200 rounded-full"
          >
            <Calendar className="h-3 w-3 mr-1" />
            {formatPeriodDisplay()}
          </Badge>
          {status !== "under" && (
            <div className={`flex items-center space-x-1`}>
              <Badge
                className={`text-xs font-medium rounded-full ${getStatusBadgeStyle()}`}
              >
                {getStatusIcon()}
                <span className="ml-1">
                  {status === "over" ? "Over Budget" : "Near Limit"}
                </span>
              </Badge>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">
              {budget.percentUsed.toFixed(0)}%
            </span>
          </div>
          <Progress
            value={Math.min(budget.percentUsed, 100)}
            className="h-2 bg-gray-200"
          />
        </div>

        {/* Amount Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Spent</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(budget.spent)}
            </p>
          </div>
          <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Budget</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(budget.amount)}
            </p>
          </div>
        </div>

        {/* Status Message */}
        <div
          className={`p-3 rounded-xl text-sm font-medium ${statusClasses.bgClass} ${statusClasses.textClass} border border-opacity-20`}
        >
          {statusMessage}
        </div>

        {/* Period Information */}
        <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
          Period: {new Date(budget.periodStartDate).toLocaleDateString()} -{" "}
          {budget.periodEndDate
            ? new Date(budget.periodEndDate).toLocaleDateString()
            : "Ongoing"}
        </div>
      </CardContent>
    </Card>
  );
}
