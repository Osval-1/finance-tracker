import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { authApi } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";
import type { LoginCredentials, RegisterCredentials } from "@/types/auth";

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    user,
    isAuthenticated,
    updateToken,
    setUser,
    logout: logoutStore,
    setLoading,
  } = useAuthStore();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      updateToken(data.token, data.refreshToken);
      setUser(data.user);
      toast.success("Welcome back!");
      navigate("/dashboard");
    },
    onError: (error: unknown) => {
      const errorResponse = error as {
        response?: { data?: { message?: string } };
      };
      toast.error(errorResponse?.response?.data?.message || "Login failed");
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      updateToken(data.token, data.refreshToken);
      setUser(data.user);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    },
    onError: (error: unknown) => {
      const errorResponse = error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        errorResponse?.response?.data?.message || "Registration failed"
      );
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logoutStore();
      queryClient.clear();
      toast.success("Logged out successfully");
      navigate("/auth/login");
    },
    onError: () => {
      // Even if the API call fails, we should still log out locally
      logoutStore();
      queryClient.clear();
      navigate("/auth/login");
    },
  });

  // Get current user query
  const { isLoading: isLoadingUser } = useQuery({
    queryKey: ["auth", "currentUser"],
    queryFn: authApi.getCurrentUser,
    enabled: isAuthenticated && !!user,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const login = (credentials: LoginCredentials) => {
    loginMutation.mutate(credentials);
  };

  const register = (credentials: RegisterCredentials) => {
    registerMutation.mutate(credentials);
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    user,
    isAuthenticated,
    isLoading: useAuthStore((state) => state.isLoading) || isLoadingUser,
    login,
    register,
    logout,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
  };
};
