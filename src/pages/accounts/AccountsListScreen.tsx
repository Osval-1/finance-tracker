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
      <div className="min-h-screen bg-gray-50">
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
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
      </div>
    );
  }

  const accounts = accountsData?.accounts || [];
  const groupedAccounts = groupAccountsByType(accounts);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Accounts</h1>
            <p className="text-gray-600 mt-1">
              Manage your bank accounts, credit cards, and investments
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleSyncAll}
              disabled={syncAllMutation.isPending}
              className="border-gray-300 hover:bg-gray-50 rounded-xl"
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

        {/* Enhanced Summary Cards */}
        {accountsData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-medium text-gray-700">
                      Total Net Worth
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-500 mt-1">
                      Assets minus liabilities
                    </CardDescription>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {formatCurrency(accountsData.totalNetWorth)}
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full">
                    <ArrowUpRight className="w-3 h-3 text-green-600" />
                    <span className="text-green-700 text-xs font-medium">
                      +2.5%
                    </span>
                  </div>
                  <span className="text-gray-500 text-xs">vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-medium text-gray-700">
                      Total Assets
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-500 mt-1">
                      All account balances
                    </CardDescription>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <PiggyBank className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {formatCurrency(accountsData.totalAssets)}
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 bg-blue-100 px-2 py-1 rounded-full">
                    <DollarSign className="w-3 h-3 text-blue-600" />
                    <span className="text-blue-700 text-xs font-medium">
                      {accounts.length} accounts
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-red-50 to-rose-50 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-medium text-gray-700">
                      Total Liabilities
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-500 mt-1">
                      Credit cards and loans
                    </CardDescription>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {formatCurrency(accountsData.totalLiabilities)}
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 bg-orange-100 px-2 py-1 rounded-full">
                    <ArrowDownRight className="w-3 h-3 text-orange-600" />
                    <span className="text-orange-700 text-xs font-medium">
                      -1.2%
                    </span>
                  </div>
                  <span className="text-gray-500 text-xs">vs last month</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Enhanced Account Groups */}
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
                <h2 className="text-xl font-semibold text-gray-900">Loans</h2>
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

        {/* Enhanced Empty State */}
        {accounts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Landmark className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No accounts yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Get started by connecting your bank account or adding a manual
              account to begin tracking your finances.
            </p>
            <Button
              onClick={() => setCreateAccountOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Account
            </Button>
          </div>
        )}
      </div>
    </div>
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

  const getCardGradient = (type: Account["type"]) => {
    switch (type) {
      case "checking":
        return "from-blue-50 to-indigo-50";
      case "savings":
        return "from-green-50 to-emerald-50";
      case "credit":
        return "from-orange-50 to-amber-50";
      case "investment":
        return "from-purple-50 to-violet-50";
      case "loan":
        return "from-red-50 to-rose-50";
      default:
        return "from-gray-50 to-slate-50";
    }
  };

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
      <CardHeader
        className={`border-b border-gray-100 bg-gradient-to-r ${getCardGradient(
          account.type
        )} rounded-t-2xl`}
      >
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
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuItem className="rounded-lg">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg">
                <Edit className="h-4 w-4 mr-2" />
                Edit Account
              </DropdownMenuItem>
              {account.isLinked && (
                <DropdownMenuItem className="rounded-lg" onClick={onUnlink}>
                  <Unlink className="h-4 w-4 mr-2" />
                  Disconnect
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 rounded-lg"
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
