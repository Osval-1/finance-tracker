// Mock Servers
export { default as mockAccountsAPI } from "./servers/accountsMockServer";
export { default as mockTransactionsAPI } from "./servers/transactionsMockServer";
export { mockBudgetAPI as mockBudgetsAPI } from "./simpleMockServer";

// Mock Data
export * from "./data/accountsData";
export * from "./data/transactionsData";
export {
  dummyBudgets,
  dummyBudgetSummary,
  dummyBudgetTrends,
  dummyAnalytics,
  dummyCategories as dummyBudgetCategories,
} from "./budgetData";

// Check if mocking is enabled
export const isMockEnabled = () =>
  import.meta.env.DEV || import.meta.env.VITE_USE_MOCK === "true";

// Mock status utilities
export const getMockStatus = () => {
  const isDev = import.meta.env.DEV;
  const forceEnabled = import.meta.env.VITE_USE_MOCK === "true";
  const forceDisabled = import.meta.env.VITE_USE_MOCK === "false";

  return {
    enabled: (isDev || forceEnabled) && !forceDisabled,
    reason: forceEnabled
      ? "Forced enabled via VITE_USE_MOCK=true"
      : forceDisabled
      ? "Forced disabled via VITE_USE_MOCK=false"
      : isDev
      ? "Auto-enabled in development mode"
      : "Disabled in production mode",
    environment: isDev ? "development" : "production",
  };
};

// Console log mock status in development
if (import.meta.env.DEV) {
  const status = getMockStatus();
  console.log(
    `🔧 Mock Server: ${status.enabled ? "Enabled" : "Disabled"} - ${
      status.reason
    }`
  );
}
