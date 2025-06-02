import React, { useState } from "react";

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
import { Alert, AlertDescription } from "@/components/ui/alert";

import { useCreateAccount } from "@/hooks/accounts/useAccounts";
import type { CreateAccountPayload, Account } from "@/types/accounts";

interface CreateAccountFormProps {
  onSuccess?: () => void;
}

export const CreateAccountForm: React.FC<CreateAccountFormProps> = ({
  onSuccess,
}) => {
  const [formData, setFormData] = useState<CreateAccountPayload>({
    name: "",
    type: "checking",
    balance: 0,
    currency: "USD",
    institution: "",
    accountNumber: "",
    routingNumber: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createAccountMutation = useCreateAccount();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Account name is required";
    }

    if (!formData.type) {
      newErrors.type = "Account type is required";
    }

    if (!formData.institution.trim()) {
      newErrors.institution = "Institution name is required";
    }

    if (!formData.currency) {
      newErrors.currency = "Currency is required";
    }

    if (formData.balance < 0) {
      newErrors.balance = "Balance cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const payload: CreateAccountPayload = {
        name: formData.name,
        type: formData.type,
        balance: formData.balance,
        currency: formData.currency,
        institution: formData.institution,
        ...(formData.accountNumber && {
          accountNumber: formData.accountNumber,
        }),
        ...(formData.routingNumber && {
          routingNumber: formData.routingNumber,
        }),
      };

      await createAccountMutation.mutateAsync(payload);

      // Reset form
      setFormData({
        name: "",
        type: "checking",
        balance: 0,
        currency: "USD",
        institution: "",
        accountNumber: "",
        routingNumber: "",
      });
      setErrors({});
      onSuccess?.();
    } catch {
      // Error is handled by the mutation hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (
    field: keyof CreateAccountPayload,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Account Name */}
      <div>
        <Label htmlFor="name">Account Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => updateFormData("name", e.target.value)}
          placeholder="My Checking Account"
        />
        {errors.name && (
          <p className="text-sm text-red-600 mt-1">{errors.name}</p>
        )}
      </div>

      {/* Account Type */}
      <div>
        <Label htmlFor="type">Account Type *</Label>
        <Select
          value={formData.type}
          onValueChange={(value) =>
            updateFormData("type", value as Account["type"])
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select account type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="checking">Checking</SelectItem>
            <SelectItem value="savings">Savings</SelectItem>
            <SelectItem value="credit">Credit Card</SelectItem>
            <SelectItem value="investment">Investment</SelectItem>
            <SelectItem value="loan">Loan</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-sm text-red-600 mt-1">{errors.type}</p>
        )}
      </div>

      {/* Institution Name */}
      <div>
        <Label htmlFor="institution">Institution Name *</Label>
        <Input
          id="institution"
          value={formData.institution}
          onChange={(e) => updateFormData("institution", e.target.value)}
          placeholder="Bank of America"
        />
        {errors.institution && (
          <p className="text-sm text-red-600 mt-1">{errors.institution}</p>
        )}
      </div>

      {/* Opening Balance */}
      <div>
        <Label htmlFor="balance">
          Opening Balance *
          {(formData.type === "credit" || formData.type === "loan") && (
            <span className="text-sm text-gray-500 ml-2">
              (Enter debt amount as positive number)
            </span>
          )}
        </Label>
        <Input
          id="balance"
          type="number"
          step="0.01"
          value={formData.balance}
          onChange={(e) =>
            updateFormData("balance", parseFloat(e.target.value) || 0)
          }
          placeholder="0.00"
        />
        {errors.balance && (
          <p className="text-sm text-red-600 mt-1">{errors.balance}</p>
        )}
      </div>

      {/* Currency */}
      <div>
        <Label htmlFor="currency">Currency *</Label>
        <Select
          value={formData.currency}
          onValueChange={(value) => updateFormData("currency", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">USD - US Dollar</SelectItem>
            <SelectItem value="EUR">EUR - Euro</SelectItem>
            <SelectItem value="GBP">GBP - British Pound</SelectItem>
            <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
            <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
            <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
          </SelectContent>
        </Select>
        {errors.currency && (
          <p className="text-sm text-red-600 mt-1">{errors.currency}</p>
        )}
      </div>

      {/* Optional Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="accountNumber">Account Number (optional)</Label>
          <Input
            id="accountNumber"
            value={formData.accountNumber}
            onChange={(e) => updateFormData("accountNumber", e.target.value)}
            placeholder="****1234"
          />
        </div>
        <div>
          <Label htmlFor="routingNumber">Routing Number (optional)</Label>
          <Input
            id="routingNumber"
            value={formData.routingNumber}
            onChange={(e) => updateFormData("routingNumber", e.target.value)}
            placeholder="123456789"
          />
        </div>
      </div>

      {/* Error Display */}
      {createAccountMutation.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            Failed to create account. Please try again.
          </AlertDescription>
        </Alert>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || createAccountMutation.isPending}
      >
        {isSubmitting || createAccountMutation.isPending
          ? "Creating Account..."
          : "Create Account"}
      </Button>
    </form>
  );
};

export default CreateAccountForm;
