import React, { useState } from "react";
import { Upload, FileText, AlertCircle } from "lucide-react";

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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";

import type { Account } from "@/types/accounts";

interface FileImportPayload {
  file: File;
  accountId: string;
  fileType: "csv" | "ofx" | "qif";
  mapping?: Record<string, string>;
  skipDuplicates: boolean;
  autoCategorizeMerchants: boolean;
}

interface TransactionImportFormProps {
  accounts: Account[];
  onImport: (data: FileImportPayload) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  progress?: number;
}

export const TransactionImportForm: React.FC<TransactionImportFormProps> = ({
  accounts,
  onImport,
  onCancel,
  isLoading = false,
  progress = 0,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<"csv" | "ofx" | "qif">("csv");
  const [accountId, setAccountId] = useState("");
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [autoCategorizeMerchants, setAutoCategorizeMerchants] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/x-ofx",
      "application/x-qif",
      "text/plain",
    ];

    if (
      !allowedTypes.includes(file.type) &&
      !file.name.match(/\.(csv|ofx|qif)$/i)
    ) {
      setErrors({ file: "Please select a valid CSV, OFX, or QIF file" });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrors({ file: "File size must be less than 10MB" });
      return;
    }

    setSelectedFile(file);
    setErrors({});

    // Auto-detect file type from extension
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (extension && ["csv", "ofx", "qif"].includes(extension)) {
      setFileType(extension as "csv" | "ofx" | "qif");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedFile) {
      newErrors.file = "Please select a file to import";
    }

    if (!accountId) {
      newErrors.accountId = "Please select an account";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !selectedFile) {
      return;
    }

    const payload: FileImportPayload = {
      file: selectedFile,
      accountId,
      fileType,
      skipDuplicates,
      autoCategorizeMerchants,
    };

    onImport(payload);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setErrors({});
  };

  const getFileIcon = () => {
    switch (fileType) {
      case "csv":
        return <FileText className="h-8 w-8 text-green-500" />;
      case "ofx":
        return <FileText className="h-8 w-8 text-blue-500" />;
      case "qif":
        return <FileText className="h-8 w-8 text-purple-500" />;
      default:
        return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Select File</CardTitle>
          <CardDescription>
            Choose a CSV, OFX, or QIF file containing your transaction data
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!selectedFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Upload your transaction file
              </h3>
              <p className="text-gray-600 mb-4">
                Drag and drop your file here, or click to browse
              </p>
              <Input
                type="file"
                accept=".csv,.ofx,.qif"
                onChange={handleFileInputChange}
                className="hidden"
                id="file-upload"
              />
              <Label htmlFor="file-upload">
                <Button type="button" variant="outline" asChild>
                  <span>Choose File</span>
                </Button>
              </Label>
              <p className="text-xs text-gray-500 mt-2">
                Supports CSV, OFX, and QIF files up to 10MB
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                {getFileIcon()}
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={removeFile}
              >
                Remove
              </Button>
            </div>
          )}
          {errors.file && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.file}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Import Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Import Settings</CardTitle>
          <CardDescription>
            Configure how your transactions should be imported
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Account Selection */}
          <div>
            <Label htmlFor="account">Target Account *</Label>
            <Select value={accountId} onValueChange={setAccountId}>
              <SelectTrigger>
                <SelectValue placeholder="Select account for imported transactions" />
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

          {/* File Type Selection */}
          <div>
            <Label htmlFor="fileType">File Type</Label>
            <Select
              value={fileType}
              onValueChange={(value) =>
                setFileType(value as "csv" | "ofx" | "qif")
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  CSV (Comma Separated Values)
                </SelectItem>
                <SelectItem value="ofx">
                  OFX (Open Financial Exchange)
                </SelectItem>
                <SelectItem value="qif">
                  QIF (Quicken Interchange Format)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Import Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="skipDuplicates">
                  Skip duplicate transactions
                </Label>
                <p className="text-sm text-gray-500">
                  Automatically skip transactions that already exist
                </p>
              </div>
              <Switch
                id="skipDuplicates"
                checked={skipDuplicates}
                onCheckedChange={setSkipDuplicates}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoCategorizeMerchants">
                  Auto-categorize by merchant
                </Label>
                <p className="text-sm text-gray-500">
                  Automatically assign categories based on merchant names
                </p>
              </div>
              <Switch
                id="autoCategorizeMerchants"
                checked={autoCategorizeMerchants}
                onCheckedChange={setAutoCategorizeMerchants}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Import Progress */}
      {isLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Importing transactions...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading || !selectedFile}>
          {isLoading ? "Importing..." : "Import Transactions"}
        </Button>
      </div>
    </form>
  );
};

export default TransactionImportForm;
