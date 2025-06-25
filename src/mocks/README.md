# Comprehensive Mock Server System

This mock server system provides complete dummy data and API simulation for all financial features during development, enabling frontend development without backend dependencies.

## Architecture

The mock system is organized into:

- **📂 `/data/`** - Dummy data definitions
- **📂 `/servers/`** - Mock API implementations
- **📂 `/utils/`** - Mock utilities and helpers
- **📄 `index.ts`** - Centralized exports

## Features Covered

### ✅ Accounts Module

- **Mock Server**: `accountsMockServer.ts`
- **Data**: `accountsData.ts`
- **Endpoints**: All account CRUD operations, Plaid integration, sync functionality
- **Features**: Account balances, net worth calculation, institution management

### ✅ Transactions Module

- **Mock Server**: `transactionsMockServer.ts`
- **Data**: `transactionsData.ts`
- **Endpoints**: Transaction CRUD, filtering, search, bulk operations, categories
- **Features**: 200+ realistic transactions, advanced filtering, analytics, CSV export

### ✅ Budgets Module

- **Mock Server**: `simpleMockServer.ts` (legacy, to be renamed)
- **Data**: `budgetData.ts`
- **Endpoints**: Budget CRUD, tracking, analytics, trends
- **Features**: 8 sample budgets, progress tracking, spending analysis

## How It Works

The mock system automatically activates in development mode and replaces real API calls:

```typescript
// Automatic activation
const USE_MOCK =
  import.meta.env.DEV || import.meta.env.VITE_USE_MOCK === "true";

// In API functions
export const getAccounts = async (): Promise<AccountsResponse> => {
  if (USE_MOCK) {
    return mockAccountsAPI.getAccounts();
  }

  // Real API call
  const response = await api.get<AccountsResponse>("/accounts");
  return response.data;
};
```

## Environment Control

```bash
# Automatic (default in development)
npm run dev

# Force enable mock in any environment
VITE_USE_MOCK=true npm run build

# Force disable mock in development
VITE_USE_MOCK=false npm run dev
```

## Available Mock Data

### Accounts (8 accounts)

- **Checking**: Chase Freedom Checking ($3,247.85)
- **Savings**: Chase Savings Plus ($15,620.43), Emergency Fund EUR (€6,250.80)
- **Credit**: Capital One Venture Card (-$892.45)
- **Investment**: Investment Portfolio ($28,450.67)
- **Loan**: Student Loan ($38,750.25)
- **Cash**: Cash Wallet ($150.00)
- **Inactive**: Old Credit Card (disconnected)

### Transactions (200+ transactions)

- **Categories**: 10 categories (Groceries, Transportation, Entertainment, etc.)
- **Merchants**: 30+ realistic merchants with typical spending patterns
- **Time Range**: Last 6 months of activity
- **Features**: Tags, notes, cleared/reconciled status, Plaid vs manual

### Budgets (8 budgets)

- **Categories**: Groceries, Transportation, Entertainment, Utilities, Dining Out, Healthcare, Shopping, Travel
- **Status**: Mix of under budget, over budget, and near-limit scenarios
- **Periods**: Monthly and quarterly budgets
- **Analytics**: Compliance metrics, trends, variance reports

## API Coverage

### Accounts API

```typescript
// All endpoints covered
getAccounts(); // ✅ List all accounts
getAccountById(id); // ✅ Get specific account
createAccount(payload); // ✅ Create manual account
updateAccount(id, payload); // ✅ Update account
deleteAccount(id); // ✅ Delete account
syncAccount(id); // ✅ Sync with Plaid
linkPlaidAccount(payload); // ✅ Link via Plaid
getAccountBalance(id); // ✅ Get balance
```

### Transactions API

```typescript
// All endpoints covered
getTransactions(filters); // ✅ List with filtering
getTransactionById(id); // ✅ Get specific
createTransaction(payload); // ✅ Create manual
updateTransaction(id, payload); // ✅ Update
deleteTransaction(id); // ✅ Delete
bulkOperations(operation); // ✅ Bulk operations
getCategories(); // ✅ List categories
createCategory(payload); // ✅ Create category
exportTransactions(filters); // ✅ CSV/JSON export
```

### Budgets API

```typescript
// All endpoints covered
getBudgets(filters); // ✅ List with filtering
getBudgetById(id); // ✅ Get specific
createBudget(payload); // ✅ Create
updateBudget(id, payload); // ✅ Update
deleteBudget(id); // ✅ Delete
getBudgetSummary(); // ✅ Summary stats
getBudgetTrends(); // ✅ Trends data
getBudgetAnalytics(); // ✅ Analytics
```

## React Query Integration

The mock system works seamlessly with React Query:

```tsx
import { useQuery } from "@tanstack/react-query";
import { getAccounts } from "@/api/accounts";

function AccountsList() {
  const { data: accounts, isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => getAccounts(), // Automatically uses mock in dev
  });

  // Will receive mock data in development
  return <div>{/* Your component */}</div>;
}
```

## Network Simulation

All mock servers simulate realistic network conditions:

- **Delays**: 200-600ms random delays
- **Longer Operations**: Sync (1s), Export (1s), Plaid linking (2s)
- **Error Simulation**: Configurable error rates
- **State Persistence**: Changes persist during browser session

## Development Benefits

1. **🚀 No Backend Dependency** - Develop frontend features independently
2. **🎯 Realistic Data** - Comprehensive scenarios for testing
3. **⚡ Fast Iteration** - Instant responses with simulated delays
4. **📱 Offline Development** - Works completely offline
5. **🧪 Easy Testing** - Predictable data for component testing
6. **📊 Edge Cases** - Pre-built scenarios for error handling

## Testing Components

Create test components to verify mock functionality:

```tsx
// Example: src/components/debug/AccountsMockTest.tsx
import { useQuery } from "@tanstack/react-query";
import { getAccounts } from "@/api/accounts";

export function AccountsMockTest() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
  });

  if (isLoading) return <div>Loading accounts...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Mock Accounts Test</h2>
      <p>Total Net Worth: ${data?.totalNetWorth}</p>
      <p>Accounts Count: {data?.accounts.length}</p>
      {/* Display accounts data */}
    </div>
  );
}
```

## Future Backend Integration

When ready to connect to real backend:

1. Set `VITE_USE_MOCK=false` in environment
2. Update `VITE_API_URL` to backend endpoint
3. API functions automatically switch to real HTTP calls
4. Mock structure serves as API documentation

## Mock Status Monitoring

Monitor mock status in development console:

```
🔧 Mock Server: Enabled - Auto-enabled in development mode
```

Use utilities to check status programmatically:

```typescript
import { getMockStatus, isMockEnabled } from "@/mocks";

console.log(getMockStatus());
// {
//   enabled: true,
//   reason: "Auto-enabled in development mode",
//   environment: "development"
// }
```

## File Structure

```
src/mocks/
├── README.md                     # This documentation
├── index.ts                      # Centralized exports
├── /data/                        # Dummy data definitions
│   ├── accountsData.ts          # Account & Plaid data
│   ├── transactionsData.ts     # Transaction & category data
│   └── budgetData.ts            # Budget data (legacy)
├── /servers/                     # Mock API implementations
│   ├── accountsMockServer.ts    # Accounts mock API
│   ├── transactionsMockServer.ts# Transactions mock API
│   └── (future servers...)
└── simpleMockServer.ts          # Legacy budget server
```

## Next Steps

1. **🔄 Refactor Legacy**: Rename `simpleMockServer.ts` to `budgetsMockServer.ts`
2. **🆕 Add Features**: Goals, Reports, Notifications mock servers
3. **🛠️ Utils**: Add `/utils/` directory with helper functions
4. **📈 Analytics**: Enhanced mock analytics data
5. **🔧 Configuration**: Centralized mock configuration system

This comprehensive mock system enables rapid frontend development with realistic data across all financial features.

## Customization

### Adding New Mock Data

```typescript
// In data files
export const myCustomData = [
  // Your data structure
];
```

### Creating New Mock Endpoints

```typescript
// In server files
export const mockMyAPI = {
  getMyData: async () => {
    await delay();
    return { success: true, data: myCustomData };
  },

  createMyData: async (payload) => {
    await delay();
    // Implementation
    return { message: "Created successfully", data: newItem };
  },
};
```

### Environment-Specific Configuration

```bash
# .env.development
VITE_USE_MOCK=true
VITE_MOCK_DELAY_MIN=100
VITE_MOCK_DELAY_MAX=500

# .env.production
VITE_USE_MOCK=false
```

The mock system provides a solid foundation for developing and testing all financial features with realistic, comprehensive data.
