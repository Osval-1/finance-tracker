export interface Goal {
  id: string;
  userId: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  associatedAccountId?: string;
  recurringContributionAmount?: number;
  recurringFrequency?: "weekly" | "biweekly" | "monthly" | "custom";
  nextContributionDate?: string;
  isCompleted: boolean;
  completedAt?: string;
  priority: "low" | "medium" | "high";
  category:
    | "emergency"
    | "vacation"
    | "home"
    | "education"
    | "retirement"
    | "custom";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoalPayload {
  name: string;
  description?: string;
  targetAmount: number;
  targetDate: string;
  associatedAccountId?: string;
  recurringContributionAmount?: number;
  recurringFrequency?: "weekly" | "biweekly" | "monthly" | "custom";
  priority?: "low" | "medium" | "high";
  category:
    | "emergency"
    | "vacation"
    | "home"
    | "education"
    | "retirement"
    | "custom";
  notes?: string;
}

export interface UpdateGoalPayload extends Partial<CreateGoalPayload> {
  id: string;
}

export interface GoalContribution {
  id: string;
  goalId: string;
  amount: number;
  date: string;
  notes?: string;
  transactionId?: string;
  createdAt: string;
}

export interface GoalsResponse {
  success: boolean;
  goals: Goal[];
  totalTargetAmount: number;
  totalCurrentAmount: number;
  completedGoalsCount: number;
}

export interface GoalResponse {
  success: boolean;
  goal: Goal;
  contributions?: GoalContribution[];
  message?: string;
}

export interface GoalFilters {
  isCompleted?: boolean;
  category?: string;
  priority?: string;
  startDate?: string;
  endDate?: string;
}

export interface GoalSummary {
  totalGoals: number;
  completedGoals: number;
  inProgressGoals: number;
  totalTargetAmount: number;
  totalCurrentAmount: number;
  averageProgress: number;
}

export interface GoalProgress {
  goalId: string;
  percentage: number;
  projectedCompletionDate: string;
  isOnTrack: boolean;
  monthsRemaining: number;
  requiredMonthlyContribution: number;
}

// Goal status types for UI
export type GoalStatus = "on-track" | "behind" | "ahead" | "completed";

export interface GoalWithStatus extends Goal {
  status: GoalStatus;
  progressPercentage: number;
  projectedCompletionDate: string;
  monthsRemaining: number;
  requiredMonthlyContribution: number;
}
