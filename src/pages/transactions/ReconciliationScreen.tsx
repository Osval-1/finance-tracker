import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useAccounts } from "@/hooks/accounts/useAccounts";
import { useTransactions } from "@/hooks/transactions/useTransactions";
import { cn } from "@/lib/utils";

interface StatementLine {
  id: string;
  date: string;
  description: string;
  amount: number;
  reference?: string;
}

interface MatchedTransaction {
  statementLineId: string;
  transactionId: string;
  confidence: number;
}

const ReconciliationScreen = () => {
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [statementBalance, setStatementBalance] = useState<number>(0);
  const [statementLines, setStatementLines] = useState<StatementLine[]>([]);
  const [matchedTransactions, setMatchedTransactions] = useState<
    MatchedTransaction[]
  >([]);
  const [showUnmatchedOnly, setShowUnmatchedOnly] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [draggedStatementId, setDraggedStatementId] = useState<string | null>(
    null
  );

  const { data: accountsData } = useAccounts();
  const { data: transactionsData } = useTransactions({
    accountId: selectedAccountId,
    startDate,
    endDate,
  });

  const accounts = accountsData?.accounts || [];
  const transactions = transactionsData?.transactions || [];

  const selectedAccount = accounts.find((acc) => acc.id === selectedAccountId);

  // Sample statement lines for demo - in real app this would be uploaded from file
  useEffect(() => {
    if (selectedAccountId && startDate && endDate) {
      // Mock statement lines - in real implementation these would be uploaded
      setStatementLines([
        {
          id: "stmt_1",
          date: "2024-01-15",
          description: "STARBUCKS COFFEE #1234",
          amount: -4.85,
          reference: "TXN123456",
        },
        {
          id: "stmt_2",
          date: "2024-01-16",
          description: "GROCERY STORE PAYMENT",
          amount: -65.42,
          reference: "TXN123457",
        },
        {
          id: "stmt_3",
          date: "2024-01-17",
          description: "SALARY DEPOSIT",
          amount: 2500.0,
          reference: "TXN123458",
        },
      ]);
    }
  }, [selectedAccountId, startDate, endDate]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: selectedAccount?.currency || "USD",
    }).format(amount);
  };

  const getAmountColor = (amount: number) => {
    return amount >= 0 ? "text-green-600" : "text-red-600";
  };

  const getMatchedStatementLines = () => {
    return matchedTransactions.map((match) => match.statementLineId);
  };

  const getMatchedTransactionIds = () => {
    return matchedTransactions.map((match) => match.transactionId);
  };

  const getUnmatchedStatementLines = () => {
    const matchedIds = getMatchedStatementLines();
    return statementLines.filter((line) => !matchedIds.includes(line.id));
  };

  const getUnmatchedTransactions = () => {
    const matchedIds = getMatchedTransactionIds();
    return transactions.filter((txn) => !matchedIds.includes(txn.id));
  };

  const getDisplayStatementLines = () => {
    return showUnmatchedOnly ? getUnmatchedStatementLines() : statementLines;
  };

  const getDisplayTransactions = () => {
    return showUnmatchedOnly ? getUnmatchedTransactions() : transactions;
  };

  const calculateAppBalance = () => {
    const matchedTxnIds = getMatchedTransactionIds();
    const matchedTransactions = transactions.filter((txn) =>
      matchedTxnIds.includes(txn.id)
    );
    return matchedTransactions.reduce((sum, txn) => sum + txn.amount, 0);
  };

  const calculateDifference = () => {
    return statementBalance - calculateAppBalance();
  };

  const handleDragStart = (e: React.DragEvent, statementLineId: string) => {
    setDraggedStatementId(statementLineId);
    e.dataTransfer.setData("text/plain", statementLineId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, transactionId: string) => {
    e.preventDefault();
    const statementLineId = e.dataTransfer.getData("text/plain");

    if (statementLineId && transactionId) {
      // Create new match
      const newMatch: MatchedTransaction = {
        statementLineId,
        transactionId,
        confidence: 0.8, // Mock confidence score
      };

      setMatchedTransactions((prev) => [
        ...prev.filter(
          (m) =>
            m.statementLineId !== statementLineId &&
            m.transactionId !== transactionId
        ),
        newMatch,
      ]);
    }

    setDraggedStatementId(null);
  };

  const handleUnmatch = (statementLineId: string, transactionId: string) => {
    setMatchedTransactions((prev) =>
      prev.filter(
        (m) =>
          !(
            m.statementLineId === statementLineId &&
            m.transactionId === transactionId
          )
      )
    );
  };

  const getMatchForStatementLine = (statementLineId: string) => {
    return matchedTransactions.find(
      (m) => m.statementLineId === statementLineId
    );
  };

  const getMatchForTransaction = (transactionId: string) => {
    return matchedTransactions.find((m) => m.transactionId === transactionId);
  };

  const handleFinishReconciliation = () => {
    const difference = calculateDifference();
    if (Math.abs(difference) > 0.01) {
      setShowConfirmDialog(true);
    } else {
      // Proceed with reconciliation
      console.log("Reconciliation completed successfully");
      // In real app: call API to mark transactions as reconciled
    }
  };

  const canFinishReconciliation = () => {
    return (
      selectedAccountId && statementBalance !== 0 && statementLines.length > 0
    );
  };

  if (!selectedAccountId) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Reconcile Account</h1>
          <p className="text-gray-600">
            Match bank statement lines to your transactions
          </p>
        </div>

        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Select an account and date range to begin reconciliation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="account">Account</Label>
              <Select
                value={selectedAccountId}
                onValueChange={setSelectedAccountId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account to reconcile" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name} ({account.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Reconcile Account</h1>
          <p className="text-gray-600">
            {selectedAccount?.name} - {format(new Date(startDate), "MMM d")} to{" "}
            {format(new Date(endDate), "MMM d, yyyy")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowUnmatchedOnly(!showUnmatchedOnly)}
          >
            {showUnmatchedOnly ? "Show All" : "Show Unmatched Only"}
          </Button>
          <Button variant="outline" onClick={() => setSelectedAccountId("")}>
            Change Account
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Bank Statement Lines */}
        <Card>
          <CardHeader className="bg-gray-100">
            <CardTitle className="text-gray-700">
              Bank Statement Lines
            </CardTitle>
            <CardDescription>
              Drag items to match with transactions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="min-h-96 max-h-96 overflow-y-auto">
              {getDisplayStatementLines().map((line) => {
                const match = getMatchForStatementLine(line.id);
                const isLineMatched = !!match;

                return (
                  <div
                    key={line.id}
                    draggable={!isLineMatched}
                    onDragStart={(e) => handleDragStart(e, line.id)}
                    className={cn(
                      "p-4 border-b border-gray-200",
                      !isLineMatched && "cursor-move hover:bg-blue-50",
                      draggedStatementId === line.id && "bg-blue-100",
                      isLineMatched && "bg-gray-100 opacity-60"
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium">{line.description}</div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(line.date), "MMM d, yyyy")}
                          {line.reference && ` • ${line.reference}`}
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={cn(
                            "font-medium",
                            getAmountColor(line.amount)
                          )}
                        >
                          {formatCurrency(line.amount)}
                        </div>
                        {isLineMatched && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            Matched
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* App Transactions */}
        <Card>
          <CardHeader className="bg-gray-100">
            <CardTitle className="text-gray-700">App Transactions</CardTitle>
            <CardDescription>
              Drop statement lines here to match
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="min-h-96 max-h-96 overflow-y-auto">
              {getDisplayTransactions().map((transaction) => {
                const match = getMatchForTransaction(transaction.id);
                const isTransactionMatched = !!match;
                const matchedStatementLine = match
                  ? statementLines.find(
                      (line) => line.id === match.statementLineId
                    )
                  : null;

                return (
                  <div
                    key={transaction.id}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, transaction.id)}
                    className={cn(
                      "p-4 border-b border-gray-200",
                      isTransactionMatched && "bg-green-50",
                      !isTransactionMatched && "hover:bg-blue-50"
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium">
                          {transaction.merchant}
                        </div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(transaction.date), "MMM d, yyyy")}
                          {transaction.description &&
                            ` • ${transaction.description}`}
                        </div>
                        {isTransactionMatched && matchedStatementLine && (
                          <div className="mt-2 p-2 bg-white rounded border">
                            <div className="text-xs text-gray-600 mb-1">
                              Matched with:
                            </div>
                            <div className="text-sm">
                              {matchedStatementLine.description}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2 h-6 text-xs"
                              onClick={() =>
                                handleUnmatch(
                                  matchedStatementLine.id,
                                  transaction.id
                                )
                              }
                            >
                              Unmatch
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div
                          className={cn(
                            "font-medium",
                            getAmountColor(transaction.amount)
                          )}
                        >
                          {formatCurrency(transaction.amount)}
                        </div>
                        {isTransactionMatched && (
                          <Badge variant="default" className="text-xs mt-1">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                            Matched
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Reconciliation Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <Label htmlFor="statementBalance">Statement Ending Balance</Label>
              <Input
                id="statementBalance"
                type="number"
                step="0.01"
                value={statementBalance}
                onChange={(e) =>
                  setStatementBalance(parseFloat(e.target.value) || 0)
                }
                placeholder="0.00"
              />
            </div>
            <div>
              <Label>App Balance (Matched)</Label>
              <div className="mt-2 text-2xl font-semibold">
                {formatCurrency(calculateAppBalance())}
              </div>
            </div>
            <div>
              <Label>Difference</Label>
              <div
                className={cn(
                  "mt-2 text-2xl font-semibold",
                  Math.abs(calculateDifference()) < 0.01
                    ? "text-green-600"
                    : "text-red-600"
                )}
              >
                {formatCurrency(calculateDifference())}
              </div>
            </div>
            <div className="flex items-end gap-2">
              <Button
                onClick={handleFinishReconciliation}
                disabled={!canFinishReconciliation()}
                className={cn(
                  Math.abs(calculateDifference()) < 0.01
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400"
                )}
              >
                Finish Reconciliation
              </Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </div>

          {Math.abs(calculateDifference()) > 0.01 && statementBalance !== 0 && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your balances do not match. Please review your matches or check
                for missing transactions.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Reconciliation</DialogTitle>
            <DialogDescription>
              Your balances do not match. There is a difference of{" "}
              <strong>{formatCurrency(calculateDifference())}</strong>. Are you
              sure you want to finish reconciliation?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Review Again
            </Button>
            <Button
              onClick={() => {
                setShowConfirmDialog(false);
                console.log("Reconciliation completed with differences");
                // In real app: proceed with reconciliation
              }}
            >
              Yes, Finish Anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReconciliationScreen;
