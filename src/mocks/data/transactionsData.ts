import type { Transaction } from "@/types/transactions";

// Transaction categories
export const dummyCategories = [
  { id: "cat-1", name: "Groceries", icon: "🛒", color: "#10B981" },
  { id: "cat-2", name: "Transportation", icon: "🚗", color: "#3B82F6" },
  { id: "cat-3", name: "Entertainment", icon: "🎬", color: "#8B5CF6" },
  { id: "cat-4", name: "Utilities", icon: "⚡", color: "#F59E0B" },
  { id: "cat-5", name: "Dining Out", icon: "🍽️", color: "#EF4444" },
  { id: "cat-6", name: "Healthcare", icon: "🏥", color: "#EC4899" },
  { id: "cat-7", name: "Shopping", icon: "🛍️", color: "#6366F1" },
  { id: "cat-8", name: "Travel", icon: "✈️", color: "#059669" },
  { id: "cat-9", name: "Income", icon: "💰", color: "#059669" },
  { id: "cat-10", name: "Transfer", icon: "↔️", color: "#6B7280" },
];

// Common merchants with their typical categories
const merchants = [
  // Groceries
  { name: "Whole Foods Market", category: "cat-1", avgAmount: 95.5 },
  { name: "Trader Joe's", category: "cat-1", avgAmount: 42.3 },
  { name: "Safeway", category: "cat-1", avgAmount: 78.2 },
  { name: "Costco Wholesale", category: "cat-1", avgAmount: 156.8 },

  // Transportation
  { name: "Shell Gas Station", category: "cat-2", avgAmount: 45.0 },
  { name: "Uber", category: "cat-2", avgAmount: 18.5 },
  { name: "Lyft", category: "cat-2", avgAmount: 22.75 },
  { name: "Metro Transit", category: "cat-2", avgAmount: 3.5 },

  // Entertainment
  { name: "Netflix", category: "cat-3", avgAmount: 15.99 },
  { name: "Spotify", category: "cat-3", avgAmount: 9.99 },
  { name: "AMC Theaters", category: "cat-3", avgAmount: 24.5 },
  { name: "Steam", category: "cat-3", avgAmount: 29.99 },

  // Utilities
  { name: "Pacific Gas & Electric", category: "cat-4", avgAmount: 120.0 },
  { name: "Comcast", category: "cat-4", avgAmount: 89.99 },
  { name: "AT&T", category: "cat-4", avgAmount: 75.0 },
  { name: "Water Department", category: "cat-4", avgAmount: 45.0 },

  // Dining Out
  { name: "Starbucks", category: "cat-5", avgAmount: 8.5 },
  { name: "McDonald's", category: "cat-5", avgAmount: 12.25 },
  { name: "Chipotle", category: "cat-5", avgAmount: 11.75 },
  { name: "The Cheesecake Factory", category: "cat-5", avgAmount: 67.5 },

  // Healthcare
  { name: "CVS Pharmacy", category: "cat-6", avgAmount: 28.5 },
  { name: "Kaiser Permanente", category: "cat-6", avgAmount: 35.0 },
  { name: "Walgreens", category: "cat-6", avgAmount: 15.75 },

  // Shopping
  { name: "Amazon", category: "cat-7", avgAmount: 45.8 },
  { name: "Target", category: "cat-7", avgAmount: 67.3 },
  { name: "Best Buy", category: "cat-7", avgAmount: 125.0 },
  { name: "Apple Store", category: "cat-7", avgAmount: 89.99 },

  // Travel
  { name: "United Airlines", category: "cat-8", avgAmount: 450.0 },
  { name: "Marriott", category: "cat-8", avgAmount: 180.0 },
  { name: "Airbnb", category: "cat-8", avgAmount: 95.0 },

  // Income
  { name: "Salary Deposit", category: "cat-9", avgAmount: 3500.0 },
  { name: "Freelance Payment", category: "cat-9", avgAmount: 850.0 },
  { name: "Interest Payment", category: "cat-9", avgAmount: 12.5 },
];

// Helper to generate random date within last 6 months
const getRandomDate = (daysBack: number = 180): string => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date.toISOString();
};

// Helper to generate realistic amount based on merchant
const generateAmount = (merchant: (typeof merchants)[0]): number => {
  const variance = 0.3; // 30% variance
  const baseAmount = merchant.avgAmount;
  const variation = (Math.random() - 0.5) * 2 * variance * baseAmount;
  const amount = baseAmount + variation;

  // For income, make it positive; for expenses, make it negative (except transfers)
  return merchant.category === "cat-9" ? Math.abs(amount) : -Math.abs(amount);
};

// Generate realistic transactions
export const dummyTransactions: Transaction[] = [];

// Generate 200 transactions across different accounts
const accountIds = ["acc-1", "acc-2", "acc-3", "acc-4", "acc-5"];

for (let i = 0; i < 200; i++) {
  const merchant = merchants[Math.floor(Math.random() * merchants.length)];
  const amount = generateAmount(merchant);

  // Occasional transfers between accounts
  const isTransfer = Math.random() < 0.05;
  const finalMerchant = isTransfer
    ? { name: "Transfer", category: "cat-10", avgAmount: Math.abs(amount) }
    : merchant;

  const transaction: Transaction = {
    id: `tx-${Date.now()}-${i}`,
    accountId: accountIds[Math.floor(Math.random() * accountIds.length)],
    date: getRandomDate(),
    amount: Number(amount.toFixed(2)),
    originalAmount: undefined,
    originalCurrency: undefined,
    merchant: finalMerchant.name,
    description: generateDescription(finalMerchant.name),
    categoryId: finalMerchant.category,
    tags: generateTags(finalMerchant.category),
    notes: Math.random() < 0.1 ? generateNote() : undefined,
    isCleared: Math.random() < 0.9, // 90% are cleared
    isReconciled: Math.random() < 0.7, // 70% are reconciled
    importedFrom: Math.random() < 0.8 ? "plaid" : "manual",
    plaidTransactionId: Math.random() < 0.8 ? `plaid-tx-${i}` : undefined,
    createdAt: getRandomDate(200),
    updatedAt: getRandomDate(10),
  };

  dummyTransactions.push(transaction);
}

// Helper functions
function generateDescription(merchantName: string): string {
  const descriptions = [
    `${merchantName} purchase`,
    `Payment to ${merchantName}`,
    `${merchantName} transaction`,
    `Online purchase - ${merchantName}`,
    `${merchantName} - Card ending in 1234`,
  ];

  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function generateTags(categoryId: string): string[] {
  const tagMap: Record<string, string[]> = {
    "cat-1": ["grocery", "food", "essentials"],
    "cat-2": ["transport", "commute", "travel"],
    "cat-3": ["entertainment", "leisure", "subscription"],
    "cat-4": ["bills", "utilities", "monthly"],
    "cat-5": ["food", "restaurant", "dining"],
    "cat-6": ["health", "medical", "pharmacy"],
    "cat-7": ["shopping", "retail", "online"],
    "cat-8": ["travel", "vacation", "hotel"],
    "cat-9": ["income", "salary", "payment"],
    "cat-10": ["transfer", "internal"],
  };

  const availableTags = tagMap[categoryId] || [];
  const numTags = Math.floor(Math.random() * 3); // 0-2 tags

  return availableTags.sort(() => Math.random() - 0.5).slice(0, numTags);
}

function generateNote(): string {
  const notes = [
    "Business expense - reimbursable",
    "Split with roommate",
    "Birthday gift",
    "Emergency purchase",
    "Recurring monthly payment",
    "One-time purchase",
    "Sale item - good deal",
    "Work lunch",
  ];

  return notes[Math.floor(Math.random() * notes.length)];
}

// Sort transactions by date (newest first)
dummyTransactions.sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

// Transaction analytics data
export const dummyTransactionAnalytics = {
  totalTransactions: dummyTransactions.length,
  totalIncome: dummyTransactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0),
  totalExpenses: Math.abs(
    dummyTransactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0)
  ),
  averageTransaction:
    dummyTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0) /
    dummyTransactions.length,
  transactionsByCategory: dummyCategories.map((cat) => ({
    categoryId: cat.id,
    categoryName: cat.name,
    count: dummyTransactions.filter((t) => t.categoryId === cat.id).length,
    total: dummyTransactions
      .filter((t) => t.categoryId === cat.id)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0),
  })),
  monthlyTrends: generateMonthlyTrends(),
};

function generateMonthlyTrends() {
  const months = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = month.toISOString();
    const monthEnd = new Date(
      month.getFullYear(),
      month.getMonth() + 1,
      0
    ).toISOString();

    const monthTransactions = dummyTransactions.filter(
      (t) => t.date >= monthStart && t.date <= monthEnd
    );

    months.push({
      month: month.toISOString().substring(0, 7), // YYYY-MM format
      totalTransactions: monthTransactions.length,
      totalIncome: monthTransactions
        .filter((t) => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0),
      totalExpenses: Math.abs(
        monthTransactions
          .filter((t) => t.amount < 0)
          .reduce((sum, t) => sum + t.amount, 0)
      ),
    });
  }

  return months;
}
