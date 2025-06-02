// Authentication query keys
export const AUTH_QUERY_KEYS = {
  user: ["user"] as const,
  profile: ["user", "profile"] as const,
} as const;

// Account query keys
export const ACCOUNTS_QUERY_KEYS = {
  all: ["accounts"] as const,
  lists: () => [...ACCOUNTS_QUERY_KEYS.all, "list"] as const,
  list: (filters: string) =>
    [...ACCOUNTS_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...ACCOUNTS_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...ACCOUNTS_QUERY_KEYS.details(), id] as const,
  balance: (id: string) =>
    [...ACCOUNTS_QUERY_KEYS.detail(id), "balance"] as const,
  plaidToken: ["accounts", "plaid", "token"] as const,
} as const;

// Transaction query keys
export const TRANSACTIONS_QUERY_KEYS = {
  all: ["transactions"] as const,
  lists: () => [...TRANSACTIONS_QUERY_KEYS.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...TRANSACTIONS_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...TRANSACTIONS_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...TRANSACTIONS_QUERY_KEYS.details(), id] as const,
  categories: ["transactions", "categories"] as const,
  duplicates: ["transactions", "duplicates"] as const,
} as const;

// Budget query keys
export const BUDGETS_QUERY_KEYS = {
  all: ["budgets"] as const,
  lists: () => [...BUDGETS_QUERY_KEYS.all, "list"] as const,
  list: (filters: string) =>
    [...BUDGETS_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...BUDGETS_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...BUDGETS_QUERY_KEYS.details(), id] as const,
} as const;

// Goal query keys
export const GOALS_QUERY_KEYS = {
  all: ["goals"] as const,
  lists: () => [...GOALS_QUERY_KEYS.all, "list"] as const,
  list: (filters: string) =>
    [...GOALS_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...GOALS_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...GOALS_QUERY_KEYS.details(), id] as const,
} as const;

// Report query keys
export const REPORTS_QUERY_KEYS = {
  all: ["reports"] as const,
  netWorth: (period: string) =>
    [...REPORTS_QUERY_KEYS.all, "net-worth", period] as const,
  expenses: (period: string) =>
    [...REPORTS_QUERY_KEYS.all, "expenses", period] as const,
  income: (period: string) =>
    [...REPORTS_QUERY_KEYS.all, "income", period] as const,
  cashFlow: (period: string) =>
    [...REPORTS_QUERY_KEYS.all, "cash-flow", period] as const,
} as const;

// Legacy constants for backward compatibility
export const ACCOUNTS_QUERY_KEY = ACCOUNTS_QUERY_KEYS.all;
export const TRANSACTIONS_QUERY_KEY = TRANSACTIONS_QUERY_KEYS.all;
export const BUDGETS_QUERY_KEY = BUDGETS_QUERY_KEYS.all;
