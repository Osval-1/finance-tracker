import type { Budget, BudgetStatus, BudgetWithStatus } from "@/types/budgets";

/**
 * Calculate budget progress percentage
 */
export function calculateBudgetProgress(
  spent: number,
  budgeted: number
): number {
  if (budgeted <= 0) {
    return 0;
  }
  return Math.min((spent / budgeted) * 100, 100);
}

/**
 * Determine budget status based on spending percentage
 */
export function getBudgetStatus(percentUsed: number): BudgetStatus {
  if (percentUsed >= 100) {
    return "over";
  } else if (percentUsed >= 75) {
    return "near";
  } else {
    return "under";
  }
}

/**
 * Add status to budget object
 */
export function addBudgetStatus(budget: Budget): BudgetWithStatus {
  const status = getBudgetStatus(budget.percentUsed);
  return {
    ...budget,
    status,
  };
}

/**
 * Get CSS classes for budget status
 */
export function getBudgetStatusClasses(status: BudgetStatus): {
  textClass: string;
  bgClass: string;
  borderClass: string;
  progressClass: string;
} {
  switch (status) {
    case "over":
      return {
        textClass: "text-red-600",
        bgClass: "bg-red-50",
        borderClass: "border-red-200",
        progressClass: "bg-red-500",
      };
    case "near":
      return {
        textClass: "text-amber-600",
        bgClass: "bg-amber-50",
        borderClass: "border-amber-200",
        progressClass: "bg-amber-500",
      };
    case "under":
      return {
        textClass: "text-green-600",
        bgClass: "bg-green-50",
        borderClass: "border-green-200",
        progressClass: "bg-green-500",
      };
    default:
      return {
        textClass: "text-gray-600",
        bgClass: "bg-gray-50",
        borderClass: "border-gray-200",
        progressClass: "bg-gray-500",
      };
  }
}

/**
 * Calculate remaining budget amount
 */
export function calculateRemainingBudget(
  budgeted: number,
  spent: number
): number {
  return Math.max(budgeted - spent, 0);
}

/**
 * Calculate projected spending based on current pace
 */
export function calculateProjectedSpending(
  spent: number,
  daysElapsed: number,
  totalDaysInPeriod: number
): number {
  if (daysElapsed <= 0) return spent;
  const dailyAverage = spent / daysElapsed;
  return dailyAverage * totalDaysInPeriod;
}

/**
 * Check if budget is on track to meet target
 */
export function isBudgetOnTrack(
  spent: number,
  budgeted: number,
  daysElapsed: number,
  totalDaysInPeriod: number
): boolean {
  const expectedSpent = (budgeted * daysElapsed) / totalDaysInPeriod;
  return spent <= expectedSpent * 1.1; // 10% tolerance
}

/**
 * Get budget status message
 */
export function getBudgetStatusMessage(budget: BudgetWithStatus): string {
  const { status, percentUsed, remaining } = budget;

  switch (status) {
    case "over": {
      const overAmount = Math.abs(remaining);
      return `Over budget by $${overAmount.toFixed(2)}`;
    }
    case "near":
      return `${(100 - percentUsed).toFixed(0)}% remaining`;
    case "under":
      return `$${remaining.toFixed(2)} remaining`;
    default:
      return "";
  }
}

/**
 * Sort budgets by priority (over budget first, then near limit)
 */
export function sortBudgetsByPriority(
  budgets: BudgetWithStatus[]
): BudgetWithStatus[] {
  return [...budgets].sort((a, b) => {
    // First, sort by status priority
    const statusPriority = { over: 0, near: 1, under: 2 };
    const statusDiff = statusPriority[a.status] - statusPriority[b.status];

    if (statusDiff !== 0) {
      return statusDiff;
    }

    // If same status, sort by percentage used (descending)
    return b.percentUsed - a.percentUsed;
  });
}

/**
 * Filter budgets by status
 */
export function filterBudgetsByStatus(
  budgets: BudgetWithStatus[],
  status: BudgetStatus
): BudgetWithStatus[] {
  return budgets.filter((budget) => budget.status === status);
}

/**
 * Calculate period dates based on budget period type
 */
export function calculateBudgetPeriodDates(
  period: Budget["period"],
  startDate?: string
): { startDate: string; endDate: string } {
  const now = new Date();
  const start = startDate ? new Date(startDate) : now;

  let endDate: Date;

  switch (period) {
    case "weekly":
      endDate = new Date(start);
      endDate.setDate(start.getDate() + 7);
      break;
    case "monthly":
      endDate = new Date(start);
      endDate.setMonth(start.getMonth() + 1);
      break;
    case "quarterly":
      endDate = new Date(start);
      endDate.setMonth(start.getMonth() + 3);
      break;
    case "yearly":
      endDate = new Date(start);
      endDate.setFullYear(start.getFullYear() + 1);
      break;
    default:
      // For custom periods, endDate should be provided separately
      endDate = new Date(start);
      endDate.setMonth(start.getMonth() + 1); // Default to monthly
  }

  return {
    startDate: start.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
  };
}
