import React from "react";
import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { TransactionForm } from "./TransactionForm";
import {
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from "@/hooks/transactions/useTransactions";
import type {
  Transaction,
  CreateTransactionPayload,
} from "@/types/transactions";
import type { Account } from "@/types/accounts";

interface Category {
  id: string;
  name: string;
}

interface TransactionEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction;
  accounts: Account[];
  categories: Category[];
  isEditing?: boolean;
}

export const TransactionEntryModal: React.FC<TransactionEntryModalProps> = ({
  isOpen,
  onClose,
  transaction,
  accounts,
  categories,
  isEditing = false,
}) => {
  const createTransactionMutation = useCreateTransaction();
  const updateTransactionMutation = useUpdateTransaction();
  const deleteTransactionMutation = useDeleteTransaction();

  const handleSubmit = (data: CreateTransactionPayload) => {
    if (isEditing && transaction) {
      updateTransactionMutation.mutate(
        {
          transactionId: transaction.id,
          payload: data,
        },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      createTransactionMutation.mutate(data, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const handleDelete = () => {
    if (
      transaction &&
      confirm("Are you sure you want to delete this transaction?")
    ) {
      deleteTransactionMutation.mutate(transaction.id, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const isLoading =
    createTransactionMutation.isPending ||
    updateTransactionMutation.isPending ||
    deleteTransactionMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[95vh] w-full mx-4 overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold">
                {isEditing ? "Edit Transaction" : "Add Transaction"}
              </DialogTitle>
              <DialogDescription className="hidden sm:block">
                {isEditing
                  ? "Update the transaction details below"
                  : "Enter the details for your new transaction"}
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6 md:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="py-4">
          <TransactionForm
            transaction={transaction}
            accounts={accounts}
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={onClose}
            isLoading={isLoading}
            isEditing={isEditing}
          />
        </div>

        {isEditing && transaction && (
          <div className="border-t pt-4">
            <Button
              variant="outline"
              onClick={handleDelete}
              disabled={isLoading}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full sm:w-auto"
            >
              Delete Transaction
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TransactionEntryModal;
