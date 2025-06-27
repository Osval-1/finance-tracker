export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  name: string;
  amount: number;
  period: "weekly" | "monthly" | "quarterly" | "yearly" | "custom";
  periodStartDate: string;
  periodEndDate?: string;
  spent: number; // Calculated field
  remaining: number; // Calculated field
  percentUsed: number; // Calculated field
  rolloverEnabled: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBudgetPayload {
  categoryId: string;
  name?: string;
  amount: number;
  period: "weekly" | "monthly" | "quarterly" | "yearly" | "custom";
  periodStartDate?: string;
  periodEndDate?: string;
  rolloverEnabled?: boolean;
}

export interface UpdateBudgetPayload extends Partial<CreateBudgetPayload> {
  id: string;
}

export interface BudgetsResponse {
  success: boolean;
  budgets: Budget[];
  totalBudgeted: number;
  totalSpent: number;
  summary?: BudgetSummary;
}

export interface BudgetResponse {
  success: boolean;
  budget: Budget;
  message?: string;
}

export interface BudgetFilters {
  categoryId?: string;
  period?: string;
  isActive?: boolean;
  isOverBudget?: boolean;
}

export interface BudgetSummary {
  totalBudgeted: number;
  totalSpent: number;
  totalRemaining: number;
  budgetsOverLimit: number;
  budgetsNearLimit: number; // >75%
}

export interface BudgetTrend {
  period: string;
  budgeted: number;
  spent: number;
  categoryId: string;
  categoryName: string;
}

// Budget status types for UI
export type BudgetStatus = "under" | "near" | "over";

export interface BudgetWithStatus extends Budget {
  status: BudgetStatus;
}
