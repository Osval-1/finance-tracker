import React, { useState } from "react";
import { Layout } from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  CreditCard,
  Target,
  DollarSign,
  Calendar,
  Clock,
  MoreVertical,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Settings,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface Notification {
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

const mockNotifications: Notification[] = [
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
];

export default function NotificationCenterScreen() {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState("unread");
  const [searchTerm, setSearchTerm] = useState("");

  const getNotificationIcon = (type: string, priority: string) => {
    const iconClass = `h-5 w-5 ${
      priority === "high"
        ? "text-red-500"
        : priority === "medium"
        ? "text-yellow-500"
        : "text-blue-500"
    }`;

    switch (type) {
      case "budget":
        return <Target className={iconClass} />;
      case "bill":
        return <Calendar className={iconClass} />;
      case "transaction":
        return <CreditCard className={iconClass} />;
      case "goal":
        return <TrendingUp className={iconClass} />;
      case "security":
        return <AlertTriangle className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  const getNotificationBorderColor = (type: string, priority: string) => {
    if (priority === "high") return "border-l-red-500";
    if (priority === "medium") return "border-l-yellow-500";
    return "border-l-blue-500";
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
    toast.success("Notification marked as read");
  };

  const markAsUnread = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: false } : notif
      )
    );
    toast.success("Notification marked as unread");
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    toast.success("Notification deleted");
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );
    toast.success("All notifications marked as read");
  };

  const clearAllRead = () => {
    setNotifications((prev) => prev.filter((notif) => !notif.isRead));
    toast.success("All read notifications cleared");
  };

  const filteredNotifications = notifications.filter((notif) => {
    const matchesTab =
      activeTab === "all" || (activeTab === "unread" && !notif.isRead);
    const matchesSearch =
      notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Layout title="Notifications">
      {/* Background with gradient */}
      <div className="min-h-full bg-gradient-to-br from-purple-50 via-white to-indigo-50 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-indigo-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-cyan-300/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 p-6 max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center relative">
                <Bell className="h-6 w-6 text-white" />
                {unreadCount > 0 && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {unreadCount}
                    </span>
                  </div>
                )}
              </div>
              Notifications
            </h1>
            <p className="text-gray-600 mt-2">
              Stay updated with your financial activity and important alerts.
            </p>
          </div>

          {/* Controls */}
          <div className="mb-6">
            <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  {/* Search */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search notifications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 rounded-xl"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={markAllAsRead}
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                      disabled={unreadCount === 0}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Mark All Read
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Clear Read
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Clear Read Notifications
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete all read notifications.
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-xl">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={clearAllRead}
                            className="bg-red-600 hover:bg-red-700 rounded-xl"
                          >
                            Clear All Read
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Button variant="outline" size="sm" className="rounded-xl">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
              <TabsList className="grid w-full grid-cols-2 bg-transparent gap-2">
                <TabsTrigger
                  value="unread"
                  className="data-[state=active]:bg-purple-500 data-[state=active]:text-white rounded-xl transition-all duration-200"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Unread ({unreadCount})
                </TabsTrigger>
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-purple-500 data-[state=active]:text-white rounded-xl transition-all duration-200"
                >
                  All Notifications ({notifications.length})
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Notification Lists */}
            <TabsContent value="unread" className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
                  <CardContent className="p-12 text-center">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      All caught up!
                    </h3>
                    <p className="text-gray-600">
                      You have no unread notifications.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {filteredNotifications.map((notification) => (
                    <Card
                      key={notification.id}
                      className={`border-0 shadow-sm bg-white/70 backdrop-blur-sm border-l-4 ${getNotificationBorderColor(
                        notification.type,
                        notification.priority
                      )} ${
                        !notification.isRead ? "ring-2 ring-purple-100" : ""
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          {/* Icon */}
                          <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                            {getNotificationIcon(
                              notification.type,
                              notification.priority
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-gray-900">
                                    {notification.title}
                                  </h3>
                                  {!notification.isRead && (
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                  )}
                                  <Badge
                                    variant={
                                      notification.priority === "high"
                                        ? "destructive"
                                        : notification.priority === "medium"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className="text-xs rounded-full"
                                  >
                                    {notification.priority}
                                  </Badge>
                                </div>
                                <p className="text-gray-600 text-sm mb-2">
                                  {notification.message}
                                </p>
                                {notification.amount && (
                                  <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                                    <DollarSign className="h-4 w-4" />
                                    {notification.amount.toLocaleString(
                                      "en-US",
                                      {
                                        style: "currency",
                                        currency: "USD",
                                      }
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Clock className="h-3 w-3" />
                                  {notification.timestamp}
                                </div>

                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="rounded-xl"
                                  >
                                    {notification.isRead ? (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          markAsUnread(notification.id)
                                        }
                                      >
                                        <EyeOff className="h-4 w-4 mr-2" />
                                        Mark as Unread
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          markAsRead(notification.id)
                                        }
                                      >
                                        <Eye className="h-4 w-4 mr-2" />
                                        Mark as Read
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                      onClick={() =>
                                        deleteNotification(notification.id)
                                      }
                                      className="text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>

                            {/* Action Button */}
                            {notification.actionUrl && (
                              <div className="mt-3">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-xl"
                                  onClick={() => {
                                    if (!notification.isRead) {
                                      markAsRead(notification.id);
                                    }
                                    // Here you would navigate to the action URL
                                    toast.success(
                                      `Navigating to ${notification.actionUrl}`
                                    );
                                  }}
                                >
                                  View Details
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
                  <CardContent className="p-12 text-center">
                    <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No notifications found
                    </h3>
                    <p className="text-gray-600">
                      {searchTerm
                        ? "Try adjusting your search terms."
                        : "You don't have any notifications yet."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {filteredNotifications.map((notification) => (
                    <Card
                      key={notification.id}
                      className={`border-0 shadow-sm bg-white/70 backdrop-blur-sm border-l-4 ${getNotificationBorderColor(
                        notification.type,
                        notification.priority
                      )} ${
                        !notification.isRead ? "ring-2 ring-purple-100" : ""
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          {/* Icon */}
                          <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                            {getNotificationIcon(
                              notification.type,
                              notification.priority
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-gray-900">
                                    {notification.title}
                                  </h3>
                                  {!notification.isRead && (
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                  )}
                                  <Badge
                                    variant={
                                      notification.priority === "high"
                                        ? "destructive"
                                        : notification.priority === "medium"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className="text-xs rounded-full"
                                  >
                                    {notification.priority}
                                  </Badge>
                                </div>
                                <p className="text-gray-600 text-sm mb-2">
                                  {notification.message}
                                </p>
                                {notification.amount && (
                                  <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                                    <DollarSign className="h-4 w-4" />
                                    {notification.amount.toLocaleString(
                                      "en-US",
                                      {
                                        style: "currency",
                                        currency: "USD",
                                      }
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Clock className="h-3 w-3" />
                                  {notification.timestamp}
                                </div>

                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="rounded-xl"
                                  >
                                    {notification.isRead ? (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          markAsUnread(notification.id)
                                        }
                                      >
                                        <EyeOff className="h-4 w-4 mr-2" />
                                        Mark as Unread
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          markAsRead(notification.id)
                                        }
                                      >
                                        <Eye className="h-4 w-4 mr-2" />
                                        Mark as Read
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                      onClick={() =>
                                        deleteNotification(notification.id)
                                      }
                                      className="text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>

                            {/* Action Button */}
                            {notification.actionUrl && (
                              <div className="mt-3">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-xl"
                                  onClick={() => {
                                    if (!notification.isRead) {
                                      markAsRead(notification.id);
                                    }
                                    // Here you would navigate to the action URL
                                    toast.success(
                                      `Navigating to ${notification.actionUrl}`
                                    );
                                  }}
                                >
                                  View Details
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
