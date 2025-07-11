import React, { useState } from "react";
import {
  Plus,
  RefreshCw,
  CreditCard,
  PiggyBank,
  TrendingUp,
  Landmark,
  BadgeDollarSign,
  MoreVertical,
  Edit,
  Trash2,
  Unlink,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle,
  DollarSign,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Layout } from "@/components/shared";

import {
  useAccounts,
  useSyncAllAccounts,
  useDeleteAccount,
  useUnlinkPlaidAccount,
} from "@/hooks/accounts/useAccounts";
import type { Account } from "@/types/accounts";
import { cn } from "@/lib/utils";

// Account creation components (would be separate files in practice)
import { CreateAccountForm, PlaidLinkComponent } from "@/components/features";

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
        return <CreditCard className="h-6 w-6 text-blue-500" />;
      case "savings":
        return <PiggyBank className="h-6 w-6 text-green-500" />;
      case "credit":
        return <CreditCard className="h-6 w-6 text-orange-500" />;
      case "investment":
        return <TrendingUp className="h-6 w-6 text-purple-600" />;
      case "loan":
        return <BadgeDollarSign className="h-6 w-6 text-red-600" />;
      default:
        return <Landmark className="h-6 w-6 text-gray-500" />;
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
      <Layout title="Accounts">
        <div className="container mx-auto p-6 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          {/* Summary Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-2xl" />
            ))}
          </div>

          {/* Account Cards Skeleton */}
          <div className="space-y-8">
            <Skeleton className="h-6 w-32" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-56 w-full rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Accounts">
        <div className="container mx-auto p-6">
          <Alert
            variant="destructive"
            className="rounded-2xl border border-red-200 bg-red-50"
          >
            <AlertCircle className="h-5 w-5" />
            <AlertDescription className="text-red-800">
              Failed to load accounts. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  const accounts = accountsData?.accounts || [];
  const groupedAccounts = groupAccountsByType(accounts);

  return (
    <Layout title="Accounts">
      {/* Background with colorful gradient */}
      <div className="min-h-full bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-purple-300/30 to-pink-400/30 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-0 w-64 h-64 bg-gradient-to-br from-blue-300/30 to-cyan-400/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gradient-to-br from-emerald-300/30 to-teal-400/30 rounded-full blur-3xl"></div>

        <div className="relative z-10 container mx-auto p-6 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mt-1">
                Manage your bank accounts, credit cards, and investments
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleSyncAll}
                disabled={syncAllMutation.isPending}
                className="border-0 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <RefreshCw
                  className={cn(
                    "h-4 w-4 mr-2",
                    syncAllMutation.isPending && "animate-spin"
                  )}
                />
                Sync All
              </Button>
              <Dialog
                open={createAccountOpen}
                onOpenChange={setCreateAccountOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Account
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl rounded-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                      Add Account
                    </DialogTitle>
                    <DialogDescription>
                      Connect your bank account or create a manual account to
                      track your finances.
                    </DialogDescription>
                  </DialogHeader>
                  <Tabs defaultValue="manual" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-xl p-1">
                      <TabsTrigger value="manual" className="rounded-lg">
                        Manual Account
                      </TabsTrigger>
                      <TabsTrigger value="plaid" className="rounded-lg">
                        Link Bank Account
                      </TabsTrigger>
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

          {/* Key Metrics Cards - Same as Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Primary Blue - Net Worth */}
            <Card className="border-0 bg-gradient-to-br from-blue-500 to-indigo-600 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-blue-50">
                  Net Worth
                </CardTitle>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-white">
                  {accountsData
                    ? formatCurrency(accountsData.totalNetWorth)
                    : "$0"}
                </div>
                <div className="flex items-center text-xs text-blue-100">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  +4.2% from last month
                </div>
              </CardContent>
            </Card>

            {/* Secondary Green - Total Assets */}
            <Card className="border-0 bg-gradient-to-br from-emerald-500 to-teal-600 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-emerald-50">
                  Total Assets
                </CardTitle>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <PiggyBank className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-white">
                  {accountsData
                    ? formatCurrency(accountsData.totalAssets)
                    : "$0"}
                </div>
                <div className="flex items-center text-xs text-emerald-100">
                  <DollarSign className="mr-1 h-3 w-3" />
                  {accounts.length} accounts
                </div>
              </CardContent>
            </Card>

            {/* Accent Amber - Total Liabilities */}
            <Card className="border-0 bg-gradient-to-br from-amber-500 to-orange-600 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-amber-50">
                  Total Liabilities
                </CardTitle>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-white">
                  {accountsData
                    ? formatCurrency(accountsData.totalLiabilities)
                    : "$0"}
                </div>
                <div className="flex items-center text-xs text-amber-100">
                  <ArrowDownRight className="mr-1 h-3 w-3" />
                  -1.2% vs last month
                </div>
              </CardContent>
            </Card>

            {/* Purple Special Case - Account Health */}
            <Card className="border-0 bg-gradient-to-br from-violet-500 to-purple-600 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-violet-50">
                  Account Health
                </CardTitle>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-white">Excellent</div>
                <div className="flex items-center text-xs text-violet-100">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  All accounts synced
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Account Groups */}
          {accounts.length > 0 ? (
            <div className="space-y-8">
              {/* Bank Accounts */}
              {groupedAccounts.bank.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Bank Accounts
                    </h2>
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-700 rounded-full"
                    >
                      {groupedAccounts.bank.length} account
                      {groupedAccounts.bank.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Credit Cards
                    </h2>
                    <Badge
                      variant="secondary"
                      className="bg-orange-100 text-orange-700 rounded-full"
                    >
                      {groupedAccounts.credit.length} card
                      {groupedAccounts.credit.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Investment Accounts
                    </h2>
                    <Badge
                      variant="secondary"
                      className="bg-purple-100 text-purple-700 rounded-full"
                    >
                      {groupedAccounts.investment.length} account
                      {groupedAccounts.investment.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Loans
                    </h2>
                    <Badge
                      variant="secondary"
                      className="bg-red-100 text-red-700 rounded-full"
                    >
                      {groupedAccounts.loan.length} loan
                      {groupedAccounts.loan.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          ) : (
            /* Enhanced Empty State */
            <Card className="p-8 text-center border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
              <CardContent>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No accounts yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Connect your bank accounts to start tracking your finances
                  automatically, or create manual accounts.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() => setCreateAccountOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

// Enhanced Account Card Component
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

  const getAccountTypeColor = (type: Account["type"]) => {
    switch (type) {
      case "checking":
        return "bg-blue-100 text-blue-700";
      case "savings":
        return "bg-green-100 text-green-700";
      case "credit":
        return "bg-orange-100 text-orange-700";
      case "investment":
        return "bg-purple-100 text-purple-700";
      case "loan":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
      <CardHeader className="border-b border-gray-100 bg-white rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              {getAccountIcon(account.type)}
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-gray-900 truncate">
                {account.name}
              </CardTitle>
              <CardDescription className="text-xs text-gray-600">
                {account.institution || "Manual Account"}
              </CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/50 rounded-lg"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="rounded-xl bg-white/95 backdrop-blur-sm border-white/20"
            >
              <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-blue-50 m-1">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-blue-50 m-1">
                <Edit className="h-4 w-4 mr-2" />
                Edit Account
              </DropdownMenuItem>
              {account.isLinked && (
                <DropdownMenuItem
                  className="rounded-lg cursor-pointer hover:bg-blue-50 m-1"
                  onClick={onUnlink}
                >
                  <Unlink className="h-4 w-4 mr-2" />
                  Disconnect
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer m-1"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <Badge
              variant="secondary"
              className={`${getAccountTypeColor(
                account.type
              )} rounded-full text-xs font-medium`}
            >
              {formatAccountType(account.type)}
            </Badge>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Current Balance</p>
            <p
              className={`text-2xl font-bold ${getBalanceColor(
                account.balance,
                account.type
              )}`}
            >
              {formatCurrency(account.balance, account.currency)}
            </p>
          </div>

          {account.accountNumber && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Account Number</p>
              <p className="text-sm font-mono text-gray-700">
                {account.accountNumber}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              {account.isLinked ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">
                    Connected
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span className="text-xs text-amber-600 font-medium">
                    Manual
                  </span>
                </>
              )}
            </div>
            {account.lastSync && (
              <p className="text-xs text-gray-500">
                Last sync: {new Date(account.lastSync).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountsListScreen;
