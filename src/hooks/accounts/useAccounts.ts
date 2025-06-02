import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";

import {
  getAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
  syncAccount,
  syncAllAccounts,
  linkPlaidAccount,
  unlinkPlaidAccount,
  getPlaidLinkToken,
  getAccountBalance,
} from "@/api/accounts";
import { ACCOUNTS_QUERY_KEYS } from "@/constants/query_keys";
import type {
  AccountsResponse,
  Account,
  CreateAccountPayload,
  UpdateAccountPayload,
  PlaidLinkPayload,
  AccountBalance,
} from "@/types/accounts";

/**
 * Get all accounts for the authenticated user
 */
export const useAccounts = () => {
  return useQuery<AccountsResponse>({
    queryKey: ACCOUNTS_QUERY_KEYS.all,
    queryFn: getAccounts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 15 * 60 * 1000, // 15 minutes for account balance updates
  });
};

/**
 * Get a specific account by ID
 */
export const useAccount = (accountId: string) => {
  return useQuery<Account>({
    queryKey: ACCOUNTS_QUERY_KEYS.detail(accountId),
    queryFn: () => getAccountById(accountId),
    enabled: !!accountId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Get account balance
 */
export const useAccountBalance = (accountId: string) => {
  return useQuery<AccountBalance>({
    queryKey: ACCOUNTS_QUERY_KEYS.balance(accountId),
    queryFn: () => getAccountBalance(accountId),
    enabled: !!accountId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Create a new manual account
 */
export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAccountPayload) => createAccount(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEYS.all });
      toast.success("Account created successfully");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Failed to create account";
      toast.error(errorMessage);
    },
  });
};

/**
 * Update an existing account
 */
export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      accountId,
      payload,
    }: {
      accountId: string;
      payload: UpdateAccountPayload;
    }) => updateAccount(accountId, payload),
    onSuccess: (_, { accountId }) => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: ACCOUNTS_QUERY_KEYS.detail(accountId),
      });
      toast.success("Account updated successfully");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Failed to update account";
      toast.error(errorMessage);
    },
  });
};

/**
 * Delete an account
 */
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accountId: string) => deleteAccount(accountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEYS.all });
      toast.success("Account deleted successfully");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Failed to delete account";
      toast.error(errorMessage);
    },
  });
};

/**
 * Sync account data with Plaid
 */
export const useSyncAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accountId: string) => syncAccount(accountId),
    onSuccess: (_, accountId) => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: ACCOUNTS_QUERY_KEYS.detail(accountId),
      });
      queryClient.invalidateQueries({
        queryKey: ACCOUNTS_QUERY_KEYS.balance(accountId),
      });
      toast.success("Account synced successfully");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Failed to sync account";
      toast.error(errorMessage);
    },
  });
};

/**
 * Sync all linked accounts
 */
export const useSyncAllAccounts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: syncAllAccounts,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEYS.all });
      toast.success(`Successfully synced ${data.syncedCount} account(s)`);
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Failed to sync accounts";
      toast.error(errorMessage);
    },
  });
};

/**
 * Link account via Plaid
 */
export const usePlaidLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PlaidLinkPayload) => linkPlaidAccount(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEYS.all });
      toast.success(`Successfully linked ${data.accountIds.length} account(s)`);
    },
    onError: (error: AxiosError) => {
      const plaidError = error.response?.data as { plaidError?: string };

      if (plaidError?.plaidError === "ITEM_LOGIN_REQUIRED") {
        toast.error("Please re-authenticate with your bank");
        return;
      }

      if (plaidError?.plaidError === "INSUFFICIENT_CREDENTIALS") {
        toast.error(
          "Invalid bank credentials - please check your login information"
        );
        return;
      }

      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Failed to link bank account";
      toast.error(errorMessage);
    },
  });
};

/**
 * Unlink Plaid account
 */
export const useUnlinkPlaidAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accountId: string) => unlinkPlaidAccount(accountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEYS.all });
      toast.success("Account unlinked successfully");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Failed to unlink account";
      toast.error(errorMessage);
    },
  });
};

/**
 * Get Plaid Link token for account linking
 */
export const usePlaidLinkToken = () => {
  return useQuery({
    queryKey: ACCOUNTS_QUERY_KEYS.plaidToken,
    queryFn: getPlaidLinkToken,
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: false, // Only fetch when explicitly needed
  });
};
