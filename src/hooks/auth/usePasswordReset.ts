import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "@/api/auth";
import type { ForgotPasswordRequest, ResetPasswordRequest } from "@/types/auth";

export const usePasswordReset = () => {
  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: (data) => {
      toast.success(data.message || "Password reset email sent successfully");
    },
    onError: (error: unknown) => {
      const errorResponse = error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        errorResponse?.response?.data?.message || "Failed to send reset email"
      );
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: (data) => {
      toast.success(data.message || "Password reset successfully");
    },
    onError: (error: unknown) => {
      const errorResponse = error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        errorResponse?.response?.data?.message || "Failed to reset password"
      );
    },
  });

  const forgotPassword = (data: ForgotPasswordRequest) => {
    forgotPasswordMutation.mutate(data);
  };

  const resetPassword = (data: ResetPasswordRequest) => {
    resetPasswordMutation.mutate(data);
  };

  return {
    forgotPassword,
    resetPassword,
    isForgotPasswordLoading: forgotPasswordMutation.isPending,
    isResetPasswordLoading: resetPasswordMutation.isPending,
    forgotPasswordSuccess: forgotPasswordMutation.isSuccess,
    resetPasswordSuccess: resetPasswordMutation.isSuccess,
  };
};
