import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "lucide-react";

interface PlaidLinkComponentProps {
  onSuccess?: () => void;
}

export const PlaidLinkComponent: React.FC<PlaidLinkComponentProps> = ({
  onSuccess,
}) => {
  const handlePlaidLink = () => {
    // Placeholder for Plaid Link integration
    // In a real implementation, this would integrate with Plaid Link
    alert("Plaid Link integration would be implemented here");
    onSuccess?.();
  };

  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          Connect your bank account securely through Plaid to automatically sync
          transactions and balances.
        </AlertDescription>
      </Alert>

      <Button onClick={handlePlaidLink} className="w-full" variant="default">
        <Link className="h-4 w-4 mr-2" />
        Connect Bank Account
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Your credentials are securely passed to Plaid; we never store them.
        </p>
        <p className="text-sm text-blue-600 mt-2 cursor-pointer hover:underline">
          View supported institutions
        </p>
      </div>
    </div>
  );
};

export default PlaidLinkComponent;
