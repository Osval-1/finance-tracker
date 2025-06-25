import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getBudgets,
  getBudgetSummary,
  createBudget,
  deleteBudget,
} from "@/api/budgets";
import type { CreateBudgetPayload } from "@/types/budgets";

export function BudgetMockTest() {
  const queryClient = useQueryClient();
  const [newBudgetAmount, setNewBudgetAmount] = useState(500);

  // Fetch budgets
  const {
    data: budgetsResponse,
    isLoading: budgetsLoading,
    error: budgetsError,
  } = useQuery({
    queryKey: ["budgets"],
    queryFn: () => getBudgets(),
  });

  // Fetch budget summary
  const {
    data: summary,
    isLoading: summaryLoading,
    error: summaryError,
  } = useQuery({
    queryKey: ["budget-summary"],
    queryFn: getBudgetSummary,
  });

  // Create budget mutation
  const createBudgetMutation = useMutation({
    mutationFn: (payload: CreateBudgetPayload) => createBudget(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["budget-summary"] });
    },
  });

  // Delete budget mutation
  const deleteBudgetMutation = useMutation({
    mutationFn: (budgetId: string) => deleteBudget(budgetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["budget-summary"] });
    },
  });

  const handleCreateBudget = () => {
    createBudgetMutation.mutate({
      categoryId: "cat-1",
      amount: newBudgetAmount,
      period: "monthly",
      name: `Test Budget ${Date.now()}`,
    });
  };

  const handleDeleteBudget = (budgetId: string) => {
    deleteBudgetMutation.mutate(budgetId);
  };

  const getBudgetStatusColor = (percentUsed: number) => {
    if (percentUsed > 100) return "destructive";
    if (percentUsed > 75) return "default";
    return "secondary";
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Budget Mock Server Test</h1>
        <p className="text-muted-foreground">
          Testing the mock budget API with live data
        </p>
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {summaryLoading && <p>Loading summary...</p>}
          {summaryError && (
            <p className="text-destructive">Error loading summary</p>
          )}
          {summary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">${summary.totalBudgeted}</p>
                <p className="text-sm text-muted-foreground">Total Budgeted</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">${summary.totalSpent}</p>
                <p className="text-sm text-muted-foreground">Total Spent</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">${summary.totalRemaining}</p>
                <p className="text-sm text-muted-foreground">Remaining</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{summary.budgetsOverLimit}</p>
                <p className="text-sm text-muted-foreground">Over Budget</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create New Budget */}
      <Card>
        <CardHeader>
          <CardTitle>Create Test Budget</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="amount">Budget Amount</Label>
            <Input
              id="amount"
              type="number"
              value={newBudgetAmount}
              onChange={(e) => setNewBudgetAmount(Number(e.target.value))}
              placeholder="Enter amount"
            />
          </div>
          <Button
            onClick={handleCreateBudget}
            disabled={createBudgetMutation.isPending}
          >
            {createBudgetMutation.isPending ? "Creating..." : "Create Budget"}
          </Button>
          {createBudgetMutation.error && (
            <p className="text-destructive text-sm">
              Error creating budget: {createBudgetMutation.error.message}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Budgets List */}
      <Card>
        <CardHeader>
          <CardTitle>
            All Budgets ({budgetsResponse?.budgets.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {budgetsLoading && <p>Loading budgets...</p>}
          {budgetsError && (
            <p className="text-destructive">Error loading budgets</p>
          )}
          {budgetsResponse && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {budgetsResponse.budgets.map((budget) => (
                  <Card key={budget.id} className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">{budget.name}</h3>
                        <Badge
                          variant={getBudgetStatusColor(budget.percentUsed)}
                        >
                          {budget.percentUsed.toFixed(1)}%
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {budget.period} •{" "}
                        {budget.isActive ? "Active" : "Inactive"}
                      </p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Budgeted:</span>
                          <span>${budget.amount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Spent:</span>
                          <span>${budget.spent}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Remaining:</span>
                          <span
                            className={
                              budget.remaining < 0
                                ? "text-destructive"
                                : "text-green-600"
                            }
                          >
                            ${budget.remaining}
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteBudget(budget.id)}
                        disabled={deleteBudgetMutation.isPending}
                        className="w-full"
                      >
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle>Mock Server Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm">
              Mock server is active - using dummy data for development
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Set VITE_USE_MOCK=false to connect to real backend
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
