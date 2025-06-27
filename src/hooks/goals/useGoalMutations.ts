import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createGoal,
  updateGoal,
  deleteGoal,
  completeGoal,
  addGoalContribution,
} from "@/api/goals";
import { GOALS_QUERY_KEYS } from "./useGoals";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type { CreateGoalPayload } from "@/types/goals";

/**
 * Hook to create a new goal
 */
export const useCreateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateGoalPayload) => createGoal(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOALS_QUERY_KEYS.all });
      toast.success("Goal created successfully");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Failed to create goal";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook to update an existing goal
 */
export const useUpdateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      goalId,
      payload,
    }: {
      goalId: string;
      payload: Partial<CreateGoalPayload>;
    }) => updateGoal(goalId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: GOALS_QUERY_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: GOALS_QUERY_KEYS.detail(variables.goalId),
      });
      toast.success("Goal updated successfully");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Failed to update goal";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook to delete a goal
 */
export const useDeleteGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (goalId: string) => deleteGoal(goalId),
    onSuccess: (_, goalId) => {
      queryClient.invalidateQueries({ queryKey: GOALS_QUERY_KEYS.all });
      queryClient.removeQueries({
        queryKey: GOALS_QUERY_KEYS.detail(goalId),
      });
      toast.success("Goal deleted successfully");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Failed to delete goal";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook to mark a goal as completed
 */
export const useCompleteGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (goalId: string) => completeGoal(goalId),
    onSuccess: (_, goalId) => {
      queryClient.invalidateQueries({ queryKey: GOALS_QUERY_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: GOALS_QUERY_KEYS.detail(goalId),
      });
      toast.success("Congratulations! Goal completed! 🎉");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Failed to complete goal";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook to add a contribution to a goal
 */
export const useAddGoalContribution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      goalId,
      amount,
      notes,
    }: {
      goalId: string;
      amount: number;
      notes?: string;
    }) => addGoalContribution(goalId, amount, notes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: GOALS_QUERY_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: GOALS_QUERY_KEYS.detail(variables.goalId),
      });
      toast.success("Contribution added successfully");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Failed to add contribution";
      toast.error(errorMessage);
    },
  });
};
