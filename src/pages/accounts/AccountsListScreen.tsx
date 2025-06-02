import React, { useState } from "react";
import {
  Plus,
  RefreshCw,
  MoreVertical,
  Eye,
  Edit,
  Unlink,
  Trash2,
  CreditCard,
  PiggyBank,
  TrendingUp,
  Landmark,
  BadgeDollarSign,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  useAccounts,
  useSyncAllAccounts,
  useDeleteAccount,
  useUnlinkPlaidAccount,
} from "@/hooks/accounts/useAccounts";
import type { Account } from "@/types/accounts";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Account creation components (would be separate files in practice)
import { CreateAccountForm } from "./components/CreateAccountForm";
import { PlaidLinkComponent } from "./components/PlaidLinkComponent";

const AccountsListScreen = () => {
  const [createAccountOpen, setCreateAccountOpen] = useState(false);

  const { data: accountsData, isLoading, error } = useAccounts();
  const syncAllMutation = useSyncAllAccounts();
  const deleteAccountMutation = useDeleteAccount();
  const unlinkPlaidMutation = useUnlinkPlaidAccount();

  const handleSyncAll = () => {
    syncAllMutation.mutate();
  };

  const handleDeleteAccount = (accountId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this account? This action cannot be undone."
      )
    ) {
      deleteAccountMutation.mutate(accountId);
    }
  };

  const handleUnlinkAccount = (accountId: string) => {
    if (confirm("Are you sure you want to unlink this account from Plaid?")) {
      unlinkPlaidMutation.mutate(accountId);
    }
  };

  const getAccountIcon = (type: Account["type"]): React.ReactElement => {
    switch (type) {
      case "checking":
        return <CreditCard className="h-5 w-5 text-blue-500" />;
      case "savings":
        return <PiggyBank className="h-5 w-5 text-green-500" />;
      case "credit":
        return <CreditCard className="h-5 w-5 text-orange-500" />;
      case "investment":
        return <TrendingUp className="h-5 w-5 text-purple-500" />;
      case "loan":
        return <BadgeDollarSign className="h-5 w-5 text-red-500" />;
      default:
        return <Landmark className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  const formatAccountType = (type: Account["type"]) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const groupAccountsByType = (accounts: Account[]) => {
    const groups = {
      bank: [] as Account[],
      credit: [] as Account[],
      investment: [] as Account[],
      loan: [] as Account[],
    };

    accounts.forEach((account) => {
      if (account.type === "checking" || account.type === "savings") {
        groups.bank.push(account);
      } else if (account.type === "credit") {
        groups.credit.push(account);
      } else if (account.type === "investment") {
        groups.investment.push(account);
      } else if (account.type === "loan") {
        groups.loan.push(account);
      }
    });

    return groups;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load accounts. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const accounts = accountsData?.accounts || [];
  const groupedAccounts = groupAccountsByType(accounts);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Accounts</h1>
          <p className="text-gray-600">
            Manage your bank accounts, credit cards, and investments
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSyncAll}
            disabled={syncAllMutation.isPending}
          >
            <RefreshCw
              className={cn(
                "h-4 w-4 mr-2",
                syncAllMutation.isPending && "animate-spin"
              )}
            />
            Sync All
          </Button>
          <Dialog open={createAccountOpen} onOpenChange={setCreateAccountOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Account
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Account</DialogTitle>
                <DialogDescription>
                  Connect your bank account or create a manual account to track
                  your finances.
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="manual" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="manual">Manual Account</TabsTrigger>
                  <TabsTrigger value="plaid">Link Bank Account</TabsTrigger>
                </TabsList>
                <TabsContent value="manual" className="mt-6">
                  <CreateAccountForm
                    onSuccess={() => setCreateAccountOpen(false)}
                  />
                </TabsContent>
                <TabsContent value="plaid" className="mt-6">
                  <PlaidLinkComponent
                    onSuccess={() => setCreateAccountOpen(false)}
                  />
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      {accountsData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Net Worth
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(accountsData.totalNetWorth)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Assets
              </CardTitle>
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(accountsData.totalAssets)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Liabilities
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(accountsData.totalLiabilities)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Account Groups */}
      <div className="space-y-8">
        {/* Bank Accounts */}
        {groupedAccounts.bank.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Bank Accounts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedAccounts.bank.map((account) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  onDelete={() => handleDeleteAccount(account.id)}
                  onUnlink={() => handleUnlinkAccount(account.id)}
                  getAccountIcon={getAccountIcon}
                  formatCurrency={formatCurrency}
                  formatAccountType={formatAccountType}
                />
              ))}
            </div>
          </section>
        )}

        {/* Credit Cards */}
        {groupedAccounts.credit.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Credit Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedAccounts.credit.map((account) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  onDelete={() => handleDeleteAccount(account.id)}
                  onUnlink={() => handleUnlinkAccount(account.id)}
                  getAccountIcon={getAccountIcon}
                  formatCurrency={formatCurrency}
                  formatAccountType={formatAccountType}
                />
              ))}
            </div>
          </section>
        )}

        {/* Investment Accounts */}
        {groupedAccounts.investment.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Investment Accounts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedAccounts.investment.map((account) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  onDelete={() => handleDeleteAccount(account.id)}
                  onUnlink={() => handleUnlinkAccount(account.id)}
                  getAccountIcon={getAccountIcon}
                  formatCurrency={formatCurrency}
                  formatAccountType={formatAccountType}
                />
              ))}
            </div>
          </section>
        )}

        {/* Loans */}
        {groupedAccounts.loan.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Loans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedAccounts.loan.map((account) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  onDelete={() => handleDeleteAccount(account.id)}
                  onUnlink={() => handleUnlinkAccount(account.id)}
                  getAccountIcon={getAccountIcon}
                  formatCurrency={formatCurrency}
                  formatAccountType={formatAccountType}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {accounts.length === 0 && (
        <div className="text-center py-12">
          <Landmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No accounts yet
          </h3>
          <p className="text-gray-600 mb-4">
            Get started by connecting your bank account or adding a manual
            account.
          </p>
          <Button onClick={() => setCreateAccountOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Account
          </Button>
        </div>
      )}

      {/* TODO: Add Account Creation Modal */}
      {createAccountOpen && (
        <div>Account creation modal will be implemented here</div>
      )}
    </div>
  );
};

// Account Card Component
interface AccountCardProps {
  account: Account;
  onDelete: () => void;
  onUnlink: () => void;
  getAccountIcon: (type: Account["type"]) => React.ReactElement;
  formatCurrency: (amount: number, currency?: string) => string;
  formatAccountType: (type: Account["type"]) => string;
}

const AccountCard = ({
  account,
  onDelete,
  onUnlink,
  getAccountIcon,
  formatCurrency,
  formatAccountType,
}: AccountCardProps) => {
  const getBalanceColor = (balance: number, type: Account["type"]) => {
    if (type === "credit" || type === "loan") {
      return balance > 0 ? "text-red-600" : "text-green-600";
    }
    return balance >= 0 ? "text-green-600" : "text-red-600";
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          {getAccountIcon(account.type)}
          <div>
            <CardTitle className="text-base">{account.name}</CardTitle>
            <CardDescription>{account.institution}</CardDescription>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            {account.isLinked && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onUnlink}>
                  <Unlink className="h-4 w-4 mr-2" />
                  Unlink
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Type</span>
            <Badge variant="secondary">{formatAccountType(account.type)}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Balance</span>
            <span
              className={cn(
                "text-lg font-semibold",
                getBalanceColor(account.balance, account.type)
              )}
            >
              {formatCurrency(account.balance, account.currency)}
            </span>
          </div>
          {account.accountNumber && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Account</span>
              <span className="text-sm font-mono">{account.accountNumber}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status</span>
            <div className="flex items-center gap-2">
              {account.isLinked && (
                <Badge variant="outline" className="text-xs">
                  Linked
                </Badge>
              )}
              <Badge
                variant={account.isActive ? "default" : "secondary"}
                className="text-xs"
              >
                {account.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
          {account.lastSync && (
            <div className="text-xs text-gray-500 pt-2">
              Last synced: {new Date(account.lastSync).toLocaleDateString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountsListScreen;
