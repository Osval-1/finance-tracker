import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  CreditCard,
  Users,
  PlusCircle,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/hooks/auth/useAuth";

interface HeaderProps {
  title?: string;
  showSearch?: boolean;
}

export function Header({ title, showSearch = true }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();

  const notifications = [
    {
      id: 1,
      title: "Budget Alert",
      message: "You've spent 80% of your dining budget",
      time: "2 hours ago",
      type: "warning",
    },
    {
      id: 2,
      title: "New Transaction",
      message: "Payment received: $1,250.00",
      time: "1 day ago",
      type: "info",
    },
    {
      id: 3,
      title: "Goal Achievement",
      message: "Emergency fund goal completed!",
      time: "3 days ago",
      type: "success",
    },
  ];

  const unreadCount = notifications.length;

  return (
    <header className="bg-slate-900 border-b border-slate-700 px-6 py-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

      <div className="flex items-center justify-between relative z-10">
        {/* Left side - Title and Search */}
        <div className="flex items-center space-x-6 flex-1">
          {title && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{title}</h1>
                <p className="text-sm text-slate-300">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          )}

          {showSearch && (
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search transactions, accounts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-slate-400 focus:bg-white/20 focus:border-white/40 focus:ring-1 focus:ring-white/30 rounded-xl"
              />
            </div>
          )}
        </div>

        {/* Right side - Actions and Profile */}
        <div className="flex items-center space-x-4">
          {/* Quick Add Button */}
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-slate-800 text-white rounded-xl"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-amber-500 text-white text-xs flex items-center justify-center rounded-full border-2 border-slate-900">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 rounded-xl bg-white/95 backdrop-blur-sm border-white/20"
            >
              <DropdownMenuLabel className="flex items-center justify-between">
                Notifications
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700 rounded-full"
                >
                  {unreadCount} new
                </Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex flex-col items-start p-4 cursor-pointer hover:bg-blue-50 rounded-lg m-1"
                  >
                    <div className="flex items-start justify-between w-full">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {notification.time}
                        </p>
                      </div>
                      <div
                        className={`w-2 h-2 rounded-full ml-2 mt-1 ${
                          notification.type === "warning"
                            ? "bg-amber-500"
                            : notification.type === "success"
                            ? "bg-emerald-500"
                            : "bg-blue-500"
                        }`}
                      />
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer rounded-lg m-1">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-3 hover:bg-slate-800 px-3 py-2 rounded-xl text-white"
              >
                <Avatar className="w-8 h-8 ring-2 ring-white/30">
                  <AvatarImage
                    src="/placeholder-user.jpg"
                    alt={user?.firstName}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-sm font-semibold">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium text-white">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-slate-400">{user?.email}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 rounded-xl bg-white/95 backdrop-blur-sm border-white/20"
            >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer hover:bg-blue-50 rounded-lg m-1">
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-blue-50 rounded-lg m-1">
                <CreditCard className="w-4 h-4 mr-2" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-blue-50 rounded-lg m-1">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-blue-50 rounded-lg m-1">
                <Users className="w-4 h-4 mr-2" />
                Team
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg m-1"
                onClick={logout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
