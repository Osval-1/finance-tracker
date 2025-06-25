import type {
  Budget,
  BudgetsResponse,
  BudgetResponse,
  CreateBudgetPayload,
  BudgetFilters,
  BudgetSummary,
  BudgetTrend,
} from "@/types/budgets";
import {
  dummyBudgets,
  dummyBudgetSummary,
  dummyBudgetTrends,
  dummyAnalytics,
  dummyCategories,
} from "./budgetData";

// Mock database state
let budgetDatabase: Budget[] = [...dummyBudgets];
let nextBudgetId = budgetDatabase.length + 1;

// Helper function to generate new budget ID
const generateBudgetId = (): string => `budget-${nextBudgetId++}`;

// Helper function to calculate budget fields
const calculateBudgetFields = (budget: Budget): Budget => {
  const remaining = budget.amount - budget.spent;
  const percentUsed =
    budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;

  return {
    ...budget,
    remaining: Number(remaining.toFixed(2)),
    percentUsed: Number(percentUsed.toFixed(2)),
  };
};

// Helper function to simulate network delay
const delay = (ms: number = 500): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Mock API functions that replace the real ones
export const mockBudgetAPI = {
  /**
   * Get all budgets with optional filters
   */
  getBudgets: async (filters?: BudgetFilters): Promise<BudgetsResponse> => {
    await delay(300);

    let filteredBudgets = [...budgetDatabase];

    if (filters) {
      if (filters.categoryId) {
        filteredBudgets = filteredBudgets.filter(
          (b) => b.categoryId === filters.categoryId
        );
      }
      if (filters.period) {
        filteredBudgets = filteredBudgets.filter(
          (b) => b.period === filters.period
        );
      }
      if (filters.isActive !== undefined) {
        filteredBudgets = filteredBudgets.filter(
          (b) => b.isActive === filters.isActive
        );
      }
      if (filters.isOverBudget !== undefined) {
        filteredBudgets = filteredBudgets.filter((b) =>
          filters.isOverBudget ? b.remaining < 0 : b.remaining >= 0
        );
      }
    }

    const totalBudgeted = filteredBudgets.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = filteredBudgets.reduce((sum, b) => sum + b.spent, 0);

    return {
      success: true,
      budgets: filteredBudgets,
      totalBudgeted,
      totalSpent,
    };
  },

  /**
   * Get a specific budget by ID
   */
  getBudgetById: async (budgetId: string): Promise<Budget> => {
    await delay(200);

    const budget = budgetDatabase.find((b) => b.id === budgetId);

    if (!budget) {
      throw new Error("Budget not found");
    }

    return budget;
  },

  /**
   * Create a new budget
   */
  createBudget: async (
    payload: CreateBudgetPayload
  ): Promise<BudgetResponse> => {
    await delay(400);

    const now = new Date().toISOString();
    const category = dummyCategories.find((c) => c.id === payload.categoryId);

    if (!category) {
      throw new Error("Invalid category ID");
    }

    const newBudget: Budget = {
      id: generateBudgetId(),
      userId: "user-1",
      categoryId: payload.categoryId,
      name: payload.name || `${category.name} Budget`,
      amount: payload.amount,
      period: payload.period,
      periodStartDate:
        payload.periodStartDate || new Date().toISOString().split("T")[0],
      periodEndDate: payload.periodEndDate,
      spent: 0,
      remaining: payload.amount,
      percentUsed: 0,
      rolloverEnabled: payload.rolloverEnabled || false,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    const calculatedBudget = calculateBudgetFields(newBudget);
    budgetDatabase.push(calculatedBudget);

    return {
      success: true,
      budget: calculatedBudget,
      message: "Budget created successfully",
    };
  },

  /**
   * Update an existing budget
   */
  updateBudget: async (
    budgetId: string,
    payload: Partial<CreateBudgetPayload>
  ): Promise<BudgetResponse> => {
    await delay(350);

    const budgetIndex = budgetDatabase.findIndex((b) => b.id === budgetId);

    if (budgetIndex === -1) {
      throw new Error("Budget not found");
    }

    const existingBudget = budgetDatabase[budgetIndex];
    const updatedBudget: Budget = {
      ...existingBudget,
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    const calculatedBudget = calculateBudgetFields(updatedBudget);
    budgetDatabase[budgetIndex] = calculatedBudget;

    return {
      success: true,
      budget: calculatedBudget,
      message: "Budget updated successfully",
    };
  },

  /**
   * Delete a budget (soft delete)
   */
  deleteBudget: async (budgetId: string): Promise<void> => {
    await delay(250);

    const budgetIndex = budgetDatabase.findIndex((b) => b.id === budgetId);

    if (budgetIndex === -1) {
      throw new Error("Budget not found");
    }

    budgetDatabase.splice(budgetIndex, 1);
  },

  /**
   * Archive a budget (set isActive to false)
   */
  archiveBudget: async (budgetId: string): Promise<BudgetResponse> => {
    await delay(300);

    const budgetIndex = budgetDatabase.findIndex((b) => b.id === budgetId);

    if (budgetIndex === -1) {
      throw new Error("Budget not found");
    }

    budgetDatabase[budgetIndex] = {
      ...budgetDatabase[budgetIndex],
      isActive: false,
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      budget: budgetDatabase[budgetIndex],
      message: "Budget archived successfully",
    };
  },

  /**
   * Get budget summary statistics
   */
  getBudgetSummary: async (): Promise<BudgetSummary> => {
    await delay(200);
    return dummyBudgetSummary;
  },

  /**
   * Get budget spending trends for analytics
   */
  getBudgetTrends: async (
    categoryId?: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _period: string = "monthly"
  ): Promise<BudgetTrend[]> => {
    await delay(300);

    let trends = [...dummyBudgetTrends];

    if (categoryId) {
      trends = trends.filter((t) => t.categoryId === categoryId);
    }

    return trends;
  },

  /**
   * Refresh budget calculations (recalculate spent amounts)
   */
  refreshBudgets: async (): Promise<BudgetsResponse> => {
    await delay(500);

    // Simulate recalculating spent amounts
    budgetDatabase = budgetDatabase.map((budget) =>
      calculateBudgetFields(budget)
    );

    const totalBudgeted = budgetDatabase.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = budgetDatabase.reduce((sum, b) => sum + b.spent, 0);

    return {
      success: true,
      budgets: budgetDatabase,
      totalBudgeted,
      totalSpent,
    };
  },

  /**
   * Get budget progress for a specific period
   */
  getBudgetProgress: async (
    budgetId: string,
    startDate: string,
    endDate: string
  ): Promise<{
    budgetId: string;
    period: string;
    budgeted: number;
    spent: number;
    remaining: number;
    percentUsed: number;
    dailySpendingAverage: number;
    projectedTotal: number;
  }> => {
    await delay(250);

    const budget = budgetDatabase.find((b) => b.id === budgetId);

    if (!budget) {
      throw new Error("Budget not found");
    }

    const dailySpendingAverage = budget.spent / 30; // Assume 30 days
    const projectedTotal = dailySpendingAverage * 30;

    return {
      budgetId,
      period: `${startDate} to ${endDate}`,
      budgeted: budget.amount,
      spent: budget.spent,
      remaining: budget.remaining,
      percentUsed: budget.percentUsed,
      dailySpendingAverage: Number(dailySpendingAverage.toFixed(2)),
      projectedTotal: Number(projectedTotal.toFixed(2)),
    };
  },

  /**
   * Export budgets data
   */
  exportBudgets: async (
    format: "csv" | "pdf",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _filters?: BudgetFilters
  ): Promise<Blob> => {
    await delay(600);

    // For mock purposes, return a simple text blob
    const data =
      format === "csv"
        ? "id,name,amount,spent,remaining\n" +
          budgetDatabase
            .map(
              (b) => `${b.id},${b.name},${b.amount},${b.spent},${b.remaining}`
            )
            .join("\n")
        : JSON.stringify(budgetDatabase, null, 2);

    return new Blob([data], {
      type: format === "csv" ? "text/csv" : "application/json",
    });
  },

  /**
   * Get budget analytics data
   */
  getBudgetAnalytics: async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _period: string = "monthly"
  ): Promise<{
    averageSpending: number;
    budgetCompliance: number;
    topCategories: Array<{
      categoryId: string;
      categoryName: string;
      totalSpent: number;
      totalBudgeted: number;
      variance: number;
    }>;
    monthlyTrends: Array<{
      month: string;
      totalBudgeted: number;
      totalSpent: number;
      variance: number;
    }>;
  }> => {
    await delay(400);
    return dummyAnalytics;
  },
};
