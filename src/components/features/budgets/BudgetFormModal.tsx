import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Calendar, DollarSign, Tag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Switch } from "@/components/ui/switch";
import {
  useCreateBudget,
  useUpdateBudget,
} from "@/hooks/budgets/useBudgetMutations";
import { createBudgetSchema } from "@/schema/budget";
import type { Budget } from "@/types/budgets";
import { calculateBudgetPeriodDates } from "@/utils/budgetCalculations";

interface BudgetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  budget?: Budget | null;
  categoryId?: string;
}

export function BudgetFormModal({
  isOpen,
  onClose,
  budget,
  categoryId,
}: BudgetFormModalProps) {
  const isEditing = !!budget;
  const createBudgetMutation = useCreateBudget();
  const updateBudgetMutation = useUpdateBudget();

  // Mock categories for demo - in real app this would come from API
  const categories = [
    { id: "1", name: "Food & Dining" },
    { id: "2", name: "Transportation" },
    { id: "3", name: "Shopping" },
    { id: "4", name: "Entertainment" },
    { id: "5", name: "Bills & Utilities" },
    { id: "6", name: "Healthcare" },
  ];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(createBudgetSchema),
    defaultValues: budget
      ? {
          categoryId: budget.categoryId,
          name: budget.name || "",
          amount: budget.amount,
          period: budget.period,
          periodStartDate: budget.periodStartDate,
          periodEndDate: budget.periodEndDate,
          rolloverEnabled: budget.rolloverEnabled,
        }
      : {
          categoryId: categoryId || "",
          name: "",
          amount: 0,
          period: "monthly" as const,
          rolloverEnabled: false,
        },
  });

  const watchedPeriod = watch("period");

  // Calculate end date automatically for non-custom periods
  const handlePeriodChange = (period: string) => {
    const typedPeriod = period as Budget["period"];
    setValue("period", typedPeriod);

    if (period !== "custom") {
      const dates = calculateBudgetPeriodDates(typedPeriod);
      setValue("periodStartDate", dates.startDate);
      setValue("periodEndDate", dates.endDate);
    }
  };

  const onSubmit = async (data: Record<string, unknown>) => {
    try {
      if (isEditing && budget) {
        // Transform the data to match the update payload structure
        const updatePayload = {
          categoryId: data.categoryId as string,
          name: data.name as string,
          amount: data.amount as number,
          period: data.period as Budget["period"],
          periodStartDate: data.periodStartDate as string,
          periodEndDate: data.periodEndDate as string,
          rolloverEnabled: data.rolloverEnabled as boolean,
        };

        await updateBudgetMutation.mutateAsync({
          budgetId: budget.id,
          payload: updatePayload,
        });
      } else {
        await createBudgetMutation.mutateAsync({
          categoryId: data.categoryId as string,
          name: data.name as string,
          amount: data.amount as number,
          period: data.period as Budget["period"],
          periodStartDate: data.periodStartDate as string,
          periodEndDate: data.periodEndDate as string,
          rolloverEnabled: data.rolloverEnabled as boolean,
        });
      }
      handleClose();
    } catch {
      // Error handling is done in the mutation hooks
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {isEditing ? "Edit Budget" : "Create Budget"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="categoryId" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Category
            </Label>
            <Select
              value={watch("categoryId")}
              onValueChange={(value) => setValue("categoryId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-sm text-red-600">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          {/* Budget Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Budget Name (Optional)</Label>
            <Input
              id="name"
              placeholder="e.g., Monthly Groceries"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Budget Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Budget Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="pl-9"
                {...register("amount", { valueAsNumber: true })}
              />
            </div>
            {errors.amount && (
              <p className="text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>

          {/* Period Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Budget Period
            </Label>
            <Select value={watchedPeriod} onValueChange={handlePeriodChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
                <SelectItem value="custom">Custom Period</SelectItem>
              </SelectContent>
            </Select>
            {errors.period && (
              <p className="text-sm text-red-600">{errors.period.message}</p>
            )}
          </div>

          {/* Custom Period Dates */}
          {watchedPeriod === "custom" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="periodStartDate">Start Date</Label>
                <Input
                  id="periodStartDate"
                  type="date"
                  {...register("periodStartDate")}
                />
                {errors.periodStartDate && (
                  <p className="text-sm text-red-600">
                    {errors.periodStartDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="periodEndDate">End Date</Label>
                <Input
                  id="periodEndDate"
                  type="date"
                  {...register("periodEndDate")}
                />
                {errors.periodEndDate && (
                  <p className="text-sm text-red-600">
                    {errors.periodEndDate.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Rollover Option */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="rolloverEnabled">Enable Rollover</Label>
              <p className="text-sm text-muted-foreground">
                Carry over unspent amount to next period
              </p>
            </div>
            <Switch
              id="rolloverEnabled"
              checked={watch("rolloverEnabled")}
              onCheckedChange={(checked) =>
                setValue("rolloverEnabled", checked)
              }
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[100px]"
            >
              {isSubmitting ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
