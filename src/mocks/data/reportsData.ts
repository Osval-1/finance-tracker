export interface ReportSummary {
  netWorth: number;
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
  netWorthChange: number;
  incomeChange: number;
  expenseChange: number;
  savingsRateChange: number;
}

export interface ExpenseCategory {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

export interface TopMerchant {
  name: string;
  amount: number;
  transactions: number;
}

export interface TopSpendingAccount {
  name: string;
  type: string;
  spent: string;
  transactions: number;
  icon: string;
}

export const dummyReportSummary: ReportSummary = {
  netWorth: 127450,
  totalIncome: 8450,
  totalExpenses: 6120,
  savingsRate: 27.6,
  netWorthChange: 2340,
  incomeChange: 450,
  expenseChange: -280,
  savingsRateChange: 2.1,
};

export const dummyExpenseCategories: ExpenseCategory[] = [
  { name: "Housing", amount: 2450, percentage: 40, color: "bg-blue-500" },
  {
    name: "Food & Dining",
    amount: 1230,
    percentage: 20,
    color: "bg-green-500",
  },
  {
    name: "Transportation",
    amount: 980,
    percentage: 16,
    color: "bg-yellow-500",
  },
  {
    name: "Entertainment",
    amount: 740,
    percentage: 12,
    color: "bg-purple-500",
  },
  { name: "Shopping", amount: 460, percentage: 8, color: "bg-pink-500" },
  { name: "Other", amount: 260, percentage: 4, color: "bg-gray-500" },
];

export const dummyMonthlyTrends: MonthlyTrend[] = [
  { month: "Jan", income: 7800, expenses: 6200, savings: 1600 },
  { month: "Feb", income: 8200, expenses: 5900, savings: 2300 },
  { month: "Mar", income: 7950, expenses: 6400, savings: 1550 },
  { month: "Apr", income: 8100, expenses: 6100, savings: 2000 },
  { month: "May", income: 8450, expenses: 6120, savings: 2330 },
];

export const dummyTopMerchants: TopMerchant[] = [
  { name: "Amazon", amount: 450, transactions: 12 },
  { name: "Walmart", amount: 320, transactions: 8 },
  { name: "Starbucks", amount: 156, transactions: 15 },
  { name: "Target", amount: 289, transactions: 6 },
  { name: "McDonald's", amount: 89, transactions: 9 },
];

export const dummyTopSpendingAccounts: TopSpendingAccount[] = [
  {
    name: "Chase Checking",
    type: "Checking",
    spent: "$3,240",
    transactions: 45,
    icon: "Wallet",
  },
  {
    name: "Capital One Credit",
    type: "Credit Card",
    spent: "$2,150",
    transactions: 32,
    icon: "CreditCard",
  },
  {
    name: "Wells Fargo Savings",
    type: "Savings",
    spent: "$680",
    transactions: 8,
    icon: "Receipt",
  },
];
