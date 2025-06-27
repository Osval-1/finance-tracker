import { useQuery } from "@tanstack/react-query";
import { getGoals, getGoalById } from "@/api/goals";
import type { GoalFilters, GoalsResponse, GoalResponse } from "@/types/goals";

// Query keys for goals
export const GOALS_QUERY_KEYS = {
  all: ["goals"] as const,
  lists: () => [...GOALS_QUERY_KEYS.all, "list"] as const,
  list: (filters?: GoalFilters) =>
    [...GOALS_QUERY_KEYS.lists(), filters] as const,
  details: () => [...GOALS_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...GOALS_QUERY_KEYS.details(), id] as const,
};

/**
 * Hook to fetch all goals with optional filters
 */
export const useGoals = (filters?: GoalFilters) => {
  return useQuery<GoalsResponse>({
    queryKey: GOALS_QUERY_KEYS.list(filters),
    queryFn: () => getGoals(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 15 * 60 * 1000, // 15 minutes
  });
};

/**
 * Hook to fetch a specific goal by ID
 */
export const useGoal = (goalId: string) => {
  return useQuery<GoalResponse>({
    queryKey: GOALS_QUERY_KEYS.detail(goalId),
    queryFn: () => getGoalById(goalId),
    enabled: !!goalId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
