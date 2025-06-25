# Mock Server for Budget API

This mock server provides dummy data for budget endpoints during development, allowing you to test the frontend without needing a real backend server.

## How It Works

The mock server automatically replaces the real API calls in development mode (`NODE_ENV=development` or `VITE_USE_MOCK=true`). All budget API functions in `src/api/budgets.ts` will use mock data instead of making actual HTTP requests.

## Features

- ✅ Full CRUD operations for budgets
- ✅ Realistic dummy data with 8 sample budgets
- ✅ Network delay simulation (200-600ms)
- ✅ Error handling for missing resources
- ✅ Filtering and search capabilities
- ✅ Budget analytics and trends
- ✅ Export functionality (CSV/JSON)
- ✅ Automatic budget calculations (remaining, percentUsed)

## Available Mock Data

### Budgets

- 8 sample budgets across different categories
- Mix of budget statuses (under, over, near limit)
- Various periods (monthly, quarterly)
- Realistic spending patterns

### Categories

- Groceries, Transportation, Entertainment
- Utilities, Dining Out, Healthcare
- Shopping, Travel

### Analytics

- Budget compliance metrics
- Spending trends over time
- Top spending categories
- Monthly variance reports

## Usage

### Automatic (Development Mode)

The mock server is automatically enabled in development mode. Just use the budget API functions normally:

```tsx
import { getBudgets, createBudget } from "@/api/budgets";

// These will use mock data in development
const budgets = await getBudgets();
const newBudget = await createBudget({
  categoryId: "cat-1",
  amount: 500,
  period: "monthly",
});
```

### Manual Control

You can force enable/disable the mock server using environment variables:

```bash
# Force enable mock (even in production)
VITE_USE_MOCK=true npm run dev

# Use real API in development
VITE_USE_MOCK=false npm run dev
```

### React Query Integration

The mock server works seamlessly with React Query:

```tsx
import { useQuery } from "@tanstack/react-query";
import { getBudgets } from "@/api/budgets";

function BudgetList() {
  const { data: budgets, isLoading } = useQuery({
    queryKey: ["budgets"],
    queryFn: () => getBudgets(),
  });

  // Will receive mock data in development
  return <div>{/* Your component */}</div>;
}
```

## API Endpoints Covered

All budget endpoints from the original API are mocked:

- `GET /budgets` - List budgets with filters
- `GET /budgets/:id` - Get specific budget
- `POST /budgets` - Create new budget
- `PUT /budgets/:id` - Update budget
- `DELETE /budgets/:id` - Delete budget
- `PATCH /budgets/:id/archive` - Archive budget
- `GET /budgets/summary` - Budget summary stats
- `GET /budgets/trends` - Spending trends
- `GET /budgets/analytics` - Analytics data
- `GET /budgets/:id/progress` - Budget progress
- `POST /budgets/refresh` - Refresh calculations
- `GET /budgets/export/:format` - Export data

## Development Benefits

1. **No Backend Dependency** - Frontend development can proceed without waiting for backend
2. **Realistic Data** - Comprehensive dummy data for testing edge cases
3. **Fast Iteration** - Instant responses with simulated network delays
4. **Offline Development** - Works completely offline
5. **Easy Testing** - Predictable data for testing components

## Future Backend Integration

When ready to connect to a real backend:

1. Set `VITE_USE_MOCK=false` in your environment
2. Update `VITE_API_URL` to point to your backend
3. The API functions will automatically switch to real HTTP calls

The mock server structure can also serve as documentation for the expected API responses when implementing the real backend.

## Files Structure

```
src/mocks/
├── README.md              # This documentation
├── index.ts              # Export all mock utilities
├── budgetData.ts         # Dummy data definitions
└── simpleMockServer.ts   # Mock API implementations
```

## Customization

You can modify the dummy data in `budgetData.ts` to better match your testing needs, or add new mock endpoints in `simpleMockServer.ts`.
