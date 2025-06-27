import api from "@/lib/axios";
import type {
  CreateGoalPayload,
  GoalsResponse,
  GoalResponse,
  GoalFilters,
  GoalContribution,
} from "@/types/goals";

// Import mock API for development
import { mockGoalAPI } from "@/mocks/simpleMockServer";

// Determine if we should use mock data
const USE_MOCK =
  import.meta.env.DEV || import.meta.env.VITE_USE_MOCK === "true";

/**
 * Get all goals for the current user
 */
export const getGoals = async (
  filters?: GoalFilters
): Promise<GoalsResponse> => {
  if (USE_MOCK) {
    return mockGoalAPI.getGoals(filters);
  }

  const response = await api.get<GoalsResponse>("/goals", { params: filters });
  return response.data;
};

/**
 * Get a specific goal by ID
 */
export const getGoalById = async (goalId: string): Promise<GoalResponse> => {
  if (USE_MOCK) {
    return mockGoalAPI.getGoalById(goalId);
  }

  const response = await api.get<GoalResponse>(`/goals/${goalId}`);
  return response.data;
};

/**
 * Create a new goal
 */
export const createGoal = async (
  payload: CreateGoalPayload
): Promise<GoalResponse> => {
  if (USE_MOCK) {
    return mockGoalAPI.createGoal(payload);
  }

  const response = await api.post<GoalResponse>("/goals", payload);
  return response.data;
};

/**
 * Update an existing goal
 */
export const updateGoal = async (
  goalId: string,
  payload: Partial<CreateGoalPayload>
): Promise<GoalResponse> => {
  if (USE_MOCK) {
    return mockGoalAPI.updateGoal(goalId, payload);
  }

  const response = await api.put<GoalResponse>(`/goals/${goalId}`, payload);
  return response.data;
};

/**
 * Delete a goal
 */
export const deleteGoal = async (
  goalId: string
): Promise<{ message: string }> => {
  if (USE_MOCK) {
    return mockGoalAPI.deleteGoal(goalId);
  }

  const response = await api.delete<{ message: string }>(`/goals/${goalId}`);
  return response.data;
};

/**
 * Mark a goal as completed
 */
export const completeGoal = async (goalId: string): Promise<GoalResponse> => {
  if (USE_MOCK) {
    return mockGoalAPI.completeGoal(goalId);
  }

  const response = await api.patch<GoalResponse>(`/goals/${goalId}/complete`);
  return response.data;
};

/**
 * Add a contribution to a goal
 */
export const addGoalContribution = async (
  goalId: string,
  amount: number,
  notes?: string
): Promise<{ message: string; contribution: GoalContribution }> => {
  if (USE_MOCK) {
    return mockGoalAPI.addGoalContribution(goalId, amount, notes);
  }

  const response = await api.post<{
    message: string;
    contribution: GoalContribution;
  }>(`/goals/${goalId}/contributions`, { amount, notes });
  return response.data;
};

/**
 * Get contributions for a specific goal
 */
export const getGoalContributions = async (
  goalId: string
): Promise<{ contributions: GoalContribution[] }> => {
  if (USE_MOCK) {
    return mockGoalAPI.getGoalContributions(goalId);
  }

  const response = await api.get<{ contributions: GoalContribution[] }>(
    `/goals/${goalId}/contributions`
  );
  return response.data;
};

/**
 * Export goals data
 */
export const exportGoals = async (
  format: "csv" | "pdf",
  filters?: GoalFilters
): Promise<Blob> => {
  if (USE_MOCK) {
    return mockGoalAPI.exportGoals(format, filters);
  }

  const response = await api.get("/goals/export", {
    params: { format, ...filters },
    responseType: "blob",
  });
  return response.data;
};
