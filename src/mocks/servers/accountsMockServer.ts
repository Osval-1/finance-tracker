import type {
  Account,
  AccountsResponse,
  CreateAccountPayload,
  UpdateAccountPayload,
  AccountBalance,
  PlaidLinkPayload,
  PlaidLinkResponse,
} from "@/types/accounts";
import {
  dummyAccounts,
  dummyPlaidItems,
  dummyInstitutions,
} from "../data/accountsData";

// In-memory state for accounts (persists during session)
const accounts: Account[] = [...dummyAccounts];
const plaidItems = [...dummyPlaidItems];

// Simulate network delay
const delay = (ms: number = Math.random() * 400 + 200) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Helper to calculate account summary
const calculateAccountSummary = () => {
  const activeAccounts = accounts.filter((acc) => acc.isActive);

  const totalAssets = activeAccounts
    .filter((acc) => ["checking", "savings", "investment"].includes(acc.type))
    .reduce((sum, acc) => sum + acc.balance, 0);

  const totalLiabilities = Math.abs(
    activeAccounts
      .filter((acc) => ["credit", "loan"].includes(acc.type))
      .reduce((sum, acc) => sum + (acc.balance < 0 ? acc.balance : 0), 0)
  );

  const totalNetWorth = totalAssets - totalLiabilities;

  return {
    totalNetWorth,
    totalAssets,
    totalLiabilities,
  };
};

// Mock API functions
export const mockAccountsAPI = {
  // GET /accounts
  getAccounts: async (): Promise<AccountsResponse> => {
    await delay();

    const summary = calculateAccountSummary();

    return {
      success: true,
      accounts: accounts.filter((acc) => acc.isActive),
      ...summary,
    };
  },

  // GET /accounts/:id
  getAccountById: async (accountId: string): Promise<Account> => {
    await delay();

    const account = accounts.find((acc) => acc.id === accountId);
    if (!account) {
      throw new Error(`Account with ID ${accountId} not found`);
    }

    return account;
  },

  // POST /accounts (manual account creation)
  createAccount: async (
    payload: CreateAccountPayload
  ): Promise<{ message: string; account: Account }> => {
    await delay();

    const newAccount: Account = {
      id: `acc-${Date.now()}`,
      name: payload.name,
      type: payload.type,
      balance: payload.balance,
      currency: payload.currency,
      institution: payload.institution,
      accountNumber: payload.accountNumber,
      routingNumber: payload.routingNumber,
      isActive: true,
      isLinked: false, // Manual accounts are not linked
      lastSync: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    accounts.push(newAccount);

    return {
      message: "Account created successfully",
      account: newAccount,
    };
  },

  // PUT /accounts/:id
  updateAccount: async (
    accountId: string,
    payload: UpdateAccountPayload
  ): Promise<{ message: string; account: Account }> => {
    await delay();

    const accountIndex = accounts.findIndex((acc) => acc.id === accountId);
    if (accountIndex === -1) {
      throw new Error(`Account with ID ${accountId} not found`);
    }

    const updatedAccount = {
      ...accounts[accountIndex],
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    accounts[accountIndex] = updatedAccount;

    return {
      message: "Account updated successfully",
      account: updatedAccount,
    };
  },

  // DELETE /accounts/:id
  deleteAccount: async (accountId: string): Promise<{ message: string }> => {
    await delay();

    const accountIndex = accounts.findIndex((acc) => acc.id === accountId);
    if (accountIndex === -1) {
      throw new Error(`Account with ID ${accountId} not found`);
    }

    // Only allow deletion of manual accounts
    const account = accounts[accountIndex];
    if (account.isLinked) {
      throw new Error("Cannot delete linked accounts. Disconnect first.");
    }

    accounts.splice(accountIndex, 1);

    return {
      message: "Account deleted successfully",
    };
  },

  // POST /accounts/:id/sync (refresh account data)
  syncAccount: async (
    accountId: string
  ): Promise<{ message: string; account: Account }> => {
    await delay(1000); // Longer delay for sync operation

    const accountIndex = accounts.findIndex((acc) => acc.id === accountId);
    if (accountIndex === -1) {
      throw new Error(`Account with ID ${accountId} not found`);
    }

    const account = accounts[accountIndex];
    if (!account.isLinked) {
      throw new Error("Cannot sync manual accounts");
    }

    // Simulate balance change
    const balanceChange = (Math.random() - 0.5) * 100; // +/- $50 random change
    const updatedAccount = {
      ...account,
      balance: Number((account.balance + balanceChange).toFixed(2)),
      lastSync: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    accounts[accountIndex] = updatedAccount;

    return {
      message: "Account synced successfully",
      account: updatedAccount,
    };
  },

  // GET /accounts/:id/balance
  getAccountBalance: async (accountId: string): Promise<AccountBalance> => {
    await delay();

    const account = accounts.find((acc) => acc.id === accountId);
    if (!account) {
      throw new Error(`Account with ID ${accountId} not found`);
    }

    return {
      accountId: account.id,
      balance: account.balance,
      availableBalance:
        account.type === "credit"
          ? 5000 + account.balance // Credit limit + current balance
          : account.balance,
      lastUpdated: account.lastSync,
    };
  },

  // POST /plaid/link (Plaid account linking)
  linkPlaidAccount: async (
    payload: PlaidLinkPayload
  ): Promise<PlaidLinkResponse> => {
    await delay(2000); // Longer delay for Plaid linking

    const { institution, accounts: plaidAccounts } = payload.metadata;

    // Create new accounts from Plaid data
    const newAccounts: Account[] = plaidAccounts.map((plaidAcc, index) => ({
      id: `acc-${Date.now()}-${index}`,
      name: plaidAcc.name,
      type: mapPlaidTypeToAccountType(plaidAcc.type),
      balance: Math.random() * 5000, // Random balance for demo
      currency: "USD",
      institution: institution.name,
      institutionId: institution.institution_id,
      accountNumber: `****${Math.floor(Math.random() * 9999)
        .toString()
        .padStart(4, "0")}`,
      plaidAccountId: plaidAcc.id,
      isActive: true,
      isLinked: true,
      lastSync: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    // Add accounts to our mock database
    accounts.push(...newAccounts);

    // Create Plaid item record
    const newPlaidItem = {
      id: `plaid-item-${Date.now()}`,
      institutionId: institution.institution_id,
      institutionName: institution.name,
      accountIds: newAccounts.map((acc) => acc.id),
      accessToken: `encrypted-access-token-${Date.now()}`,
      status: "active",
      lastSyncDate: new Date().toISOString(),
      consentExpiresAt: new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
      ).toISOString(),
      needsReauth: false,
      error: null,
    };

    plaidItems.push(newPlaidItem);

    return {
      message: `Successfully linked ${newAccounts.length} account(s)`,
      accountIds: newAccounts.map((acc) => acc.id),
      accounts: newAccounts,
    };
  },

  // GET /plaid/institutions
  getPlaidInstitutions: async () => {
    await delay();
    return {
      success: true,
      institutions: dummyInstitutions,
    };
  },

  // POST /accounts/:id/disconnect (disconnect Plaid account)
  disconnectAccount: async (
    accountId: string
  ): Promise<{ message: string }> => {
    await delay();

    const accountIndex = accounts.findIndex((acc) => acc.id === accountId);
    if (accountIndex === -1) {
      throw new Error(`Account with ID ${accountId} not found`);
    }

    const account = accounts[accountIndex];
    if (!account.isLinked) {
      throw new Error("Account is not linked");
    }

    // Mark account as inactive rather than deleting
    accounts[accountIndex] = {
      ...account,
      isActive: false,
      isLinked: false,
      updatedAt: new Date().toISOString(),
    };

    return {
      message: "Account disconnected successfully",
    };
  },

  // GET /accounts/summary
  getAccountsSummary: async () => {
    await delay();

    const summary = calculateAccountSummary();
    const activeAccounts = accounts.filter((acc) => acc.isActive);

    return {
      success: true,
      ...summary,
      accountCount: activeAccounts.length,
      linkedAccountCount: activeAccounts.filter((acc) => acc.isLinked).length,
      lastSyncDate: Math.max(
        ...activeAccounts
          .filter((acc) => acc.lastSync)
          .map((acc) => new Date(acc.lastSync).getTime())
      ),
      accountsByType: activeAccounts.reduce((acc, account) => {
        if (!acc[account.type]) {
          acc[account.type] = { count: 0, totalBalance: 0 };
        }
        acc[account.type].count++;
        acc[account.type].totalBalance += account.balance;
        return acc;
      }, {} as Record<string, { count: number; totalBalance: number }>),
    };
  },
};

// Helper function to map Plaid account types to our account types
function mapPlaidTypeToAccountType(plaidType: string): Account["type"] {
  const typeMap: Record<string, Account["type"]> = {
    depository: "checking",
    savings: "savings",
    credit: "credit",
    investment: "investment",
    loan: "loan",
  };

  return typeMap[plaidType] || "checking";
}

// Export for use in API layer
export default mockAccountsAPI;
