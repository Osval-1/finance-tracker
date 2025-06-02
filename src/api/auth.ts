import api from "@/lib/axios";
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  TwoFactorSetupResponse,
  TwoFactorVerifyRequest,
  User,
} from "@/types/auth";

export const authApi = {
  // Login with email and password
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  // Register new user account
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", credentials);
    return response.data;
  },

  // Logout user and invalidate token
  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  // Refresh JWT token using refresh token
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post("/auth/refresh", { refreshToken });
    return response.data;
  },

  // Request password reset email
  forgotPassword: async (
    data: ForgotPasswordRequest
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.post("/auth/forgot-password", data);
    return response.data;
  },

  // Reset password with token
  resetPassword: async (
    data: ResetPasswordRequest
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.post("/auth/reset-password", data);
    return response.data;
  },

  // Verify email address
  verifyEmail: async (
    token: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.post("/auth/verify-email", { token });
    return response.data;
  },

  // Resend email verification
  resendVerification: async (
    email: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.post("/auth/resend-verification", { email });
    return response.data;
  },

  // Get current user profile
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get("/auth/me");
    return response.data.user;
  },

  // Setup two-factor authentication
  setupTwoFactor: async (): Promise<TwoFactorSetupResponse> => {
    const response = await api.post("/auth/2fa/setup");
    return response.data;
  },

  // Verify two-factor authentication setup
  verifyTwoFactorSetup: async (
    data: TwoFactorVerifyRequest
  ): Promise<{ success: boolean; backupCodes: string[] }> => {
    const response = await api.post("/auth/2fa/verify-setup", data);
    return response.data;
  },

  // Verify two-factor authentication during login
  verifyTwoFactor: async (
    data: TwoFactorVerifyRequest
  ): Promise<AuthResponse> => {
    const response = await api.post("/auth/2fa/verify", data);
    return response.data;
  },

  // Disable two-factor authentication
  disableTwoFactor: async (
    data: TwoFactorVerifyRequest
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.post("/auth/2fa/disable", data);
    return response.data;
  },

  // Generate new backup codes
  generateBackupCodes: async (): Promise<{ backupCodes: string[] }> => {
    const response = await api.post("/auth/2fa/backup-codes");
    return response.data;
  },
};
