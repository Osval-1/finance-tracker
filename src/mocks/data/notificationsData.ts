export interface Notification {
  id: string;
  type: "budget" | "bill" | "transaction" | "goal" | "security";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: "low" | "medium" | "high";
  actionUrl?: string;
  amount?: number;
}

export const dummyNotifications: Notification[] = [
  {
    id: "1",
    type: "budget",
    title: "Budget Alert",
    message: "You've spent 90% of your 'Food & Dining' budget for this month.",
    timestamp: "2 hours ago",
    isRead: false,
    priority: "high",
    actionUrl: "/budgets",
    amount: 950,
  },
  {
    id: "2",
    type: "transaction",
    title: "Large Transaction Alert",
    message: "A large transaction of $1,250.00 was detected from Amazon.",
    timestamp: "4 hours ago",
    isRead: false,
    priority: "medium",
    actionUrl: "/transactions",
    amount: 1250,
  },
  {
    id: "3",
    type: "bill",
    title: "Bill Reminder",
    message: "Your electricity bill of $89.50 is due in 3 days.",
    timestamp: "6 hours ago",
    isRead: true,
    priority: "medium",
    actionUrl: "/bills",
    amount: 89.5,
  },
  {
    id: "4",
    type: "goal",
    title: "Goal Milestone",
    message:
      "Congratulations! You've reached 75% of your 'Emergency Fund' goal.",
    timestamp: "1 day ago",
    isRead: true,
    priority: "low",
    actionUrl: "/goals",
  },
  {
    id: "5",
    type: "security",
    title: "Security Alert",
    message: "A new device signed into your account from Chrome on Windows.",
    timestamp: "2 days ago",
    isRead: true,
    priority: "high",
    actionUrl: "/settings/security",
  },
  {
    id: "6",
    type: "budget",
    title: "Budget Reset",
    message: "Your monthly budgets have been reset for the new month.",
    timestamp: "3 days ago",
    isRead: true,
    priority: "low",
    actionUrl: "/budgets",
  },
  {
    id: "7",
    type: "transaction",
    title: "Payment Received",
    message: "Your salary of $3,500.00 has been deposited.",
    timestamp: "1 week ago",
    isRead: true,
    priority: "low",
    actionUrl: "/transactions",
    amount: 3500,
  },
  {
    id: "8",
    type: "goal",
    title: "Goal Behind Schedule",
    message:
      "Your 'Vacation Fund' goal is behind schedule. Consider increasing contributions.",
    timestamp: "1 week ago",
    isRead: true,
    priority: "medium",
    actionUrl: "/goals",
  },
];
