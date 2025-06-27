import { useState } from "react";
import { Layout } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  Target,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import { useGoals } from "@/hooks/goals/useGoals";
import { useDeleteGoal, useCompleteGoal } from "@/hooks/goals/useGoalMutations";
import type { Goal } from "@/types/goals";
import { cn } from "@/lib/utils";
import { format, parseISO, differenceInDays } from "date-fns";
import { toast } from "sonner";

export function GoalsListScreen() {
  const [filters, setFilters] = useState({
    category: "all",
    priority: "all",
    isCompleted: undefined as boolean | undefined,
  });

  const {
    data: goalsData,
    isLoading,
    error,
  } = useGoals({
    category: filters.category === "all" ? undefined : filters.category,
    priority: filters.priority === "all" ? undefined : filters.priority,
    isCompleted: filters.isCompleted,
  });
  const deleteGoalMutation = useDeleteGoal();
  const completeGoalMutation = useCompleteGoal();

  const getGoalStatus = (goal: Goal) => {
    if (goal.isCompleted) return "completed";
    const daysUntilTarget = differenceInDays(
      parseISO(goal.targetDate),
      new Date()
    );
    const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;

    if (daysUntilTarget < 0) return "overdue";
    if (progressPercentage >= 90) return "on-track";
    if (daysUntilTarget < 30 && progressPercentage < 75) return "behind";
    return "on-track";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "overdue":
        return "bg-red-100 text-red-700 border-red-200";
      case "behind":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4" />;
      case "behind":
        return <Clock className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      emergency: "🚨",
      vacation: "✈️",
      home: "🏠",
      education: "🎓",
      retirement: "🏖️",
      custom: "🎯",
    };
    return icons[category as keyof typeof icons] || "🎯";
  };

  const handleDeleteGoal = (goalId: string) => {
    if (confirm("Are you sure you want to delete this goal?")) {
      deleteGoalMutation.mutate(goalId);
    }
  };

  const handleCompleteGoal = (goalId: string) => {
    completeGoalMutation.mutate(goalId);
  };

  const handleCreateGoal = () => {
    toast.info("Goal creation will be available soon!");
  };

  const handleEditGoal = () => {
    toast.info("Goal editing will be available soon!");
  };

  const handleAddContribution = () => {
    toast.info("Adding contributions will be available soon!");
  };

  if (error) {
    return (
      <Layout title="Goals">
        <div className="container mx-auto px-4 py-8">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span>Failed to load goals. Please try again.</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Goals">
      {/* Background with colorful gradient */}
      <div className="min-h-full bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-purple-300/30 to-pink-400/30 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-0 w-64 h-64 bg-gradient-to-br from-blue-300/30 to-cyan-400/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gradient-to-br from-emerald-300/30 to-teal-400/30 rounded-full blur-3xl"></div>

        <div className="relative z-10 container mx-auto px-4 py-8 space-y-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                  <TrendingUp className="h-8 w-8 mr-3 text-blue-600" />
                  Financial Goals
                </h1>
                <p className="text-gray-600">
                  Track and achieve your financial objectives
                </p>
              </div>
              <Button
                onClick={handleCreateGoal}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Goal
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          {goalsData && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {/* Primary Blue - Total Goals */}
              <Card className="border-0 bg-gradient-to-br from-blue-500 to-indigo-600 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-blue-50">
                    Total Goals
                  </CardTitle>
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    {goalsData.goals.length}
                  </div>
                  <div className="flex items-center text-xs text-blue-100">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    Active goals
                  </div>
                </CardContent>
              </Card>

              {/* Secondary Green - Completed Goals */}
              <Card className="border-0 bg-gradient-to-br from-emerald-500 to-teal-600 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-emerald-50">
                    Completed
                  </CardTitle>
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    {goalsData.completedGoalsCount}
                  </div>
                  <div className="flex items-center text-xs text-emerald-100">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Goals achieved
                  </div>
                </CardContent>
              </Card>

              {/* Accent Purple - Total Target */}
              <Card className="border-0 bg-gradient-to-br from-violet-500 to-purple-600 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-violet-50">
                    Total Target
                  </CardTitle>
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    ${goalsData.totalTargetAmount.toLocaleString()}
                  </div>
                  <div className="flex items-center text-xs text-violet-100">
                    <DollarSign className="mr-1 h-3 w-3" />
                    Target amount
                  </div>
                </CardContent>
              </Card>

              {/* Amber/Orange - Total Saved */}
              <Card className="border-0 bg-gradient-to-br from-amber-500 to-orange-600 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-amber-50">
                    Total Saved
                  </CardTitle>
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    ${goalsData.totalCurrentAmount.toLocaleString()}
                  </div>
                  <div className="flex items-center text-xs text-amber-100">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    Amount saved
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filters */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) =>
                      setFilters({ ...filters, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      <SelectItem value="emergency">Emergency Fund</SelectItem>
                      <SelectItem value="vacation">Vacation</SelectItem>
                      <SelectItem value="home">Home Purchase</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="retirement">Retirement</SelectItem>
                      <SelectItem value="custom">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={filters.priority}
                    onValueChange={(value) =>
                      setFilters({ ...filters, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All priorities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All priorities</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={filters.isCompleted?.toString() ?? "all"}
                    onValueChange={(value) =>
                      setFilters({
                        ...filters,
                        isCompleted:
                          value === "all" ? undefined : value === "true",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="false">In Progress</SelectItem>
                      <SelectItem value="true">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setFilters({
                        category: "all",
                        priority: "all",
                        isCompleted: undefined,
                      })
                    }
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Goals Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card
                  key={i}
                  className="border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg"
                >
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-6 w-1/2 mb-4" />
                    <Skeleton className="h-2 w-full mb-2" />
                    <Skeleton className="h-4 w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : goalsData?.goals.length === 0 ? (
            <Card className="border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
              <CardContent className="p-12 text-center">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No goals yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start by creating your first financial goal to track your
                  progress.
                </p>
                <Button
                  onClick={handleCreateGoal}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Goal
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goalsData?.goals.map((goal) => {
                const status = getGoalStatus(goal);
                const progressPercentage =
                  (goal.currentAmount / goal.targetAmount) * 100;
                const daysUntilTarget = differenceInDays(
                  parseISO(goal.targetDate),
                  new Date()
                );

                return (
                  <Card
                    key={goal.id}
                    className={cn(
                      "border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300",
                      goal.isCompleted && "ring-2 ring-green-200"
                    )}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">
                            {getCategoryIcon(goal.category)}
                          </span>
                          <div>
                            <CardTitle className="text-lg font-semibold text-gray-900">
                              {goal.name}
                            </CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge
                                variant="outline"
                                className={getStatusColor(status)}
                              >
                                {getStatusIcon(status)}
                                <span className="ml-1 capitalize">
                                  {status}
                                </span>
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {goal.priority}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleEditGoal}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            {!goal.isCompleted && (
                              <>
                                <DropdownMenuItem
                                  onClick={handleAddContribution}
                                >
                                  <DollarSign className="h-4 w-4 mr-2" />
                                  Add Contribution
                                </DropdownMenuItem>
                                {goal.currentAmount >= goal.targetAmount && (
                                  <DropdownMenuItem
                                    onClick={() => handleCompleteGoal(goal.id)}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Mark Complete
                                  </DropdownMenuItem>
                                )}
                              </>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleDeleteGoal(goal.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>

                    <CardContent>
                      {goal.description && (
                        <p className="text-sm text-gray-600 mb-4">
                          {goal.description}
                        </p>
                      )}

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium">
                              ${goal.currentAmount.toLocaleString()} / $
                              {goal.targetAmount.toLocaleString()}
                            </span>
                          </div>
                          <Progress
                            value={Math.min(progressPercentage, 100)}
                            className="h-2"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>
                              {progressPercentage.toFixed(1)}% complete
                            </span>
                            <span>
                              $
                              {(
                                goal.targetAmount - goal.currentAmount
                              ).toLocaleString()}{" "}
                              remaining
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>
                              Target:{" "}
                              {format(
                                parseISO(goal.targetDate),
                                "MMM dd, yyyy"
                              )}
                            </span>
                          </div>
                          <span
                            className={cn(
                              "text-xs font-medium",
                              daysUntilTarget < 0
                                ? "text-red-600"
                                : daysUntilTarget < 30
                                ? "text-amber-600"
                                : "text-gray-600"
                            )}
                          >
                            {daysUntilTarget < 0
                              ? `${Math.abs(daysUntilTarget)} days overdue`
                              : `${daysUntilTarget} days left`}
                          </span>
                        </div>

                        {goal.recurringContributionAmount && (
                          <div className="text-xs text-gray-500 bg-gray-50 rounded px-2 py-1">
                            Auto-saving $
                            {goal.recurringContributionAmount.toLocaleString()}{" "}
                            {goal.recurringFrequency}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
