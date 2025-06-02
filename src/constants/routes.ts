export const ROUTES = {
  // Public routes
  HOME: "/",

  // Auth routes
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },

  // Protected routes
  DASHBOARD: "/dashboard",

  // Account routes
  ACCOUNTS: {
    LIST: "/accounts",
    DETAIL: "/accounts/:id",
  },

  // Transaction routes
  TRANSACTIONS: {
    LIST: "/transactions",
    RECONCILIATION: "/transactions/reconciliation",
  },

  // Budget routes
  BUDGETS: {
    LIST: "/budgets",
  },

  // Goal routes
  GOALS: {
    LIST: "/goals",
  },

  // Report routes
  REPORTS: {
    DASHBOARD: "/reports",
  },

  // Settings routes
  SETTINGS: {
    OVERVIEW: "/settings",
    PROFILE: "/settings/profile",
    SECURITY: "/settings/security",
  },

  // Legal routes
  TERMS: "/terms",
  PRIVACY: "/privacy",

  // Error routes
  NOT_FOUND: "/404",
  UNAUTHORIZED: "/unauthorized",
} as const;
