import React from "react";
import { Tag, CheckCircle, Trash2, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface TransactionBulkActionsProps {
  selectedCount: number;
  onCategorize: () => void;
  onMarkCleared: () => void;
  onDelete: () => void;
  onExport?: () => void;
  showExport?: boolean;
  isLoading?: boolean;
}

export const TransactionBulkActions: React.FC<TransactionBulkActionsProps> = ({
  selectedCount,
  onCategorize,
  onMarkCleared,
  onDelete,
  onExport,
  showExport = false,
  isLoading = false,
}) => {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {selectedCount} transaction{selectedCount === 1 ? "" : "s"} selected
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onCategorize}
              disabled={isLoading}
            >
              <Tag className="h-4 w-4 mr-2" />
              Categorize
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onMarkCleared}
              disabled={isLoading}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark Cleared
            </Button>
            {showExport && onExport && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                disabled={isLoading}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="text-red-600 hover:text-red-700"
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionBulkActions;
