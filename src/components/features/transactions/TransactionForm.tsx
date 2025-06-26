import React, { useState, useEffect } from "react";
import { CalendarIcon } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";

import type {
  Transaction,
  CreateTransactionPayload,
} from "@/types/transactions";
import type { Account } from "@/types/accounts";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

interface TransactionFormProps {
  transaction?: Transaction;
  accounts: Account[];
  categories: Category[];
  onSubmit: (data: CreateTransactionPayload) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  transaction,
  accounts,
  categories,
  onSubmit,
  onCancel,
  isLoading = false,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<CreateTransactionPayload>({
    date: transaction?.date || new Date().toISOString().split("T")[0],
    amount: transaction?.amount || 0,
    merchant: transaction?.merchant || "",
    description: transaction?.description || "",
    accountId: transaction?.accountId || "",
    categoryId: transaction?.categoryId || "",
    tags: transaction?.tags || [],
    notes: transaction?.notes || "",
    isCleared: transaction?.isCleared || false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedDate, setSelectedDate] = useState<Date>(
    transaction?.date ? new Date(transaction.date) : new Date()
  );
  const [tagsInput, setTagsInput] = useState(
    transaction?.tags?.join(", ") || ""
  );

  useEffect(() => {
    if (transaction) {
      setFormData({
        date: transaction.date,
        amount: transaction.amount,
        merchant: transaction.merchant,
        description: transaction.description || "",
        accountId: transaction.accountId,
        categoryId: transaction.categoryId || "",
        tags: transaction.tags || [],
        notes: transaction.notes || "",
        isCleared: transaction.isCleared || false,
      });
      setSelectedDate(new Date(transaction.date));
      setTagsInput(transaction.tags?.join(", ") || "");
    }
  }, [transaction]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.merchant.trim()) {
      newErrors.merchant = "Merchant/Payee is required";
    }

    if (!formData.accountId) {
      newErrors.accountId = "Account is required";
    }

    if (formData.amount === 0) {
      newErrors.amount = "Amount cannot be zero";
    }

    if (!selectedDate) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const payload: CreateTransactionPayload = {
      ...formData,
      date: selectedDate.toISOString(),
      tags: tags.length > 0 ? tags : undefined,
    };

    onSubmit(payload);
  };

  const updateFormData = (
    field: keyof CreateTransactionPayload,
    value: string | number | boolean | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Transaction Type & Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date);
                    if (errors.date) {
                      setErrors((prev) => ({ ...prev, date: "" }));
                    }
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.date && (
            <p className="text-sm text-red-600 mt-1">{errors.date}</p>
          )}
        </div>

        <div>
          <Label htmlFor="amount">Amount *</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) =>
              updateFormData("amount", parseFloat(e.target.value) || 0)
            }
            placeholder="0.00"
          />
          {errors.amount && (
            <p className="text-sm text-red-600 mt-1">{errors.amount}</p>
          )}
        </div>
      </div>

      {/* Merchant/Payee */}
      <div>
        <Label htmlFor="merchant">Merchant/Payee *</Label>
        <Input
          id="merchant"
          value={formData.merchant}
          onChange={(e) => updateFormData("merchant", e.target.value)}
          placeholder="Enter merchant or payee name"
        />
        {errors.merchant && (
          <p className="text-sm text-red-600 mt-1">{errors.merchant}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => updateFormData("description", e.target.value)}
          placeholder="Optional transaction description"
        />
      </div>

      {/* Account & Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="account">Account *</Label>
          <Select
            value={formData.accountId}
            onValueChange={(value) => updateFormData("accountId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name} ({account.type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.accountId && (
            <p className="text-sm text-red-600 mt-1">{errors.accountId}</p>
          )}
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.categoryId || "uncategorized"}
            onValueChange={(value) =>
              updateFormData(
                "categoryId",
                value === "uncategorized" ? "" : value
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="uncategorized">Uncategorized</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tags */}
      <div>
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="Enter tags separated by commas"
        />
        <p className="text-xs text-gray-500 mt-1">
          Separate multiple tags with commas
        </p>
      </div>

      {/* Notes */}
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => updateFormData("notes", e.target.value)}
          placeholder="Additional notes about this transaction"
          rows={3}
        />
      </div>

      {/* Cleared Status */}
      <div className="flex items-center space-x-2">
        <Switch
          id="isCleared"
          checked={formData.isCleared}
          onCheckedChange={(checked) => updateFormData("isCleared", checked)}
        />
        <Label htmlFor="isCleared">Mark as cleared</Label>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
            ? "Update Transaction"
            : "Create Transaction"}
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;
