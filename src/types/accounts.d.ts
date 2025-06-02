export interface Account {
  id: string;
  name: string;
  type: "checking" | "savings" | "credit" | "investment" | "loan";
  balance: number;
  currency: string;
  institution: string;
  institutionId?: string;
  accountNumber?: string; // masked
  routingNumber?: string; // masked
  plaidAccountId?: string;
  lastSync: string;
  isActive: boolean;
  isLinked: boolean; // connected via Plaid
  createdAt: string;
  updatedAt: string;
}

export interface AccountsResponse {
  success: boolean;
  accounts: Account[];
  totalNetWorth: number;
  totalAssets: number;
  totalLiabilities: number;
}

export interface CreateAccountPayload {
  name: string;
  type: Account["type"];
  balance: number;
  currency: string;
  institution: string;
  accountNumber?: string;
  routingNumber?: string;
}

export interface UpdateAccountPayload extends Partial<CreateAccountPayload> {
  isActive?: boolean;
}

export interface AccountBalance {
  accountId: string;
  balance: number;
  availableBalance?: number;
  lastUpdated: string;
}

export interface PlaidLinkPayload {
  publicToken: string;
  metadata: {
    institution: {
      name: string;
      institution_id: string;
    };
    accounts: Array<{
      id: string;
      name: string;
      type: string;
      subtype: string;
    }>;
  };
}

export interface PlaidLinkResponse {
  message: string;
  accountIds: string[];
  accounts: Account[];
}
