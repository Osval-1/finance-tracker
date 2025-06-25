import api from "@/lib/axios";
import mockAccountsAPI from "@/mocks/servers/accountsMockServer";
import type {
  Account,
  AccountsResponse,
  CreateAccountPayload,
  UpdateAccountPayload,
  AccountBalance,
  PlaidLinkPayload,
  PlaidLinkResponse,
} from "@/types/accounts";

// Check if we should use mock data
const USE_MOCK =
  import.meta.env.DEV || import.meta.env.VITE_USE_MOCK === "true";

/**
 * Get all accounts for the authenticated user
 */
export const getAccounts = async (): Promise<AccountsResponse> => {
  if (USE_MOCK) {
    return mockAccountsAPI.getAccounts();
  }

  const response = await api.get<AccountsResponse>("/accounts");
  return response.data;
};

/**
 * Get a specific account by ID
 */
export const getAccountById = async (accountId: string): Promise<Account> => {
  if (USE_MOCK) {
    return mockAccountsAPI.getAccountById(accountId);
  }

  const response = await api.get<{ success: boolean; account: Account }>(
    `/accounts/${accountId}`
  );
  return response.data.account;
};

/**
 * Create a new manual account
 */
export const createAccount = async (
  payload: CreateAccountPayload
): Promise<{ message: string; account: Account }> => {
  if (USE_MOCK) {
    return mockAccountsAPI.createAccount(payload);
  }

  const response = await api.post<{ message: string; account: Account }>(
    "/accounts",
    payload
  );
  return response.data;
};

/**
 * Update an existing account
 */
export const updateAccount = async (
  accountId: string,
  payload: UpdateAccountPayload
): Promise<{ message: string; account: Account }> => {
  if (USE_MOCK) {
    return mockAccountsAPI.updateAccount(accountId, payload);
  }

  const response = await api.put<{ message: string; account: Account }>(
    `/accounts/${accountId}`,
    payload
  );
  return response.data;
};

/**
 * Delete an account (soft delete)
 */
export const deleteAccount = async (
  accountId: string
): Promise<{ message: string }> => {
  if (USE_MOCK) {
    return mockAccountsAPI.deleteAccount(accountId);
  }

  const response = await api.delete<{ message: string }>(
    `/accounts/${accountId}`
  );
  return response.data;
};

/**
 * Get account balance and recent activity
 */
export const getAccountBalance = async (
  accountId: string
): Promise<AccountBalance> => {
  if (USE_MOCK) {
    return mockAccountsAPI.getAccountBalance(accountId);
  }

  const response = await api.get<{ success: boolean; balance: AccountBalance }>(
    `/accounts/${accountId}/balance`
  );
  return response.data.balance;
};

/**
 * Sync account data with Plaid (for linked accounts)
 */
export const syncAccount = async (
  accountId: string
): Promise<{ message: string; account: Account }> => {
  if (USE_MOCK) {
    return mockAccountsAPI.syncAccount(accountId);
  }

  const response = await api.post<{ message: string; account: Account }>(
    `/accounts/${accountId}/sync`
  );
  return response.data;
};

/**
 * Sync all linked accounts
 */
export const syncAllAccounts = async (): Promise<{
  message: string;
  syncedCount: number;
  accounts: Account[];
}> => {
  if (USE_MOCK) {
    // Mock implementation for sync all
    const accountsResponse = await mockAccountsAPI.getAccounts();
    const linkedAccounts = accountsResponse.accounts.filter(
      (acc) => acc.isLinked
    );

    return {
      message: `Synced ${linkedAccounts.length} accounts successfully`,
      syncedCount: linkedAccounts.length,
      accounts: linkedAccounts,
    };
  }

  const response = await api.post<{
    message: string;
    syncedCount: number;
    accounts: Account[];
  }>("/accounts/sync-all");
  return response.data;
};

/**
 * Link account via Plaid
 */
export const linkPlaidAccount = async (
  payload: PlaidLinkPayload
): Promise<PlaidLinkResponse> => {
  if (USE_MOCK) {
    return mockAccountsAPI.linkPlaidAccount(payload);
  }

  const response = await api.post<PlaidLinkResponse>("/plaid/link", payload);
  return response.data;
};

/**
 * Unlink Plaid account
 */
export const unlinkPlaidAccount = async (
  accountId: string
): Promise<{ message: string }> => {
  if (USE_MOCK) {
    return mockAccountsAPI.disconnectAccount(accountId);
  }

  const response = await api.delete<{ message: string }>(
    `/plaid/unlink/${accountId}`
  );
  return response.data;
};

/**
 * Get Plaid Link token for account linking
 */
export const getPlaidLinkToken = async (): Promise<{
  linkToken: string;
  expiration: string;
}> => {
  if (USE_MOCK) {
    // Mock implementation
    return {
      linkToken: `link-sandbox-${Date.now()}`,
      expiration: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
    };
  }

  const response = await api.post<{
    linkToken: string;
    expiration: string;
  }>("/plaid/link-token");
  return response.data;
};
