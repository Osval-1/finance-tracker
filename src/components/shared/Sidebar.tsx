import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  Target,
  BarChart3,
  Settings,
  CreditCard,
  Bell,
  Users,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const mainNavItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
      badge: null,
    },
    {
      title: "Accounts",
      icon: Wallet,
      path: "/accounts",
      badge: null,
    },
    {
      title: "Transactions",
      icon: Receipt,
      path: "/transactions",
      badge: "23",
    },
    {
      title: "Budgets",
      icon: Target,
      path: "/budgets",
      badge: null,
    },
    {
      title: "Goals",
      icon: Target,
      path: "/goals",
      badge: null,
    },
    {
      title: "Reports",
      icon: BarChart3,
      path: "/reports",
      badge: null,
    },
  ];

  const bottomNavItems = [
    {
      title: "Notifications",
      icon: Bell,
      path: "/notifications",
      badge: "3",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/settings",
      badge: null,
    },
    {
      title: "Help",
      icon: HelpCircle,
      path: "/help",
      badge: null,
    },
  ];

  const quickActions = [
    {
      title: "Add Transaction",
      icon: PlusCircle,
      action: () => console.log("Add transaction"),
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Link Account",
      icon: CreditCard,
      action: () => console.log("Link account"),
      color: "bg-green-500 hover:bg-green-600",
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-slate-900 text-white transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Logo and Collapse Button */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">FinanceTracker</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-white hover:bg-slate-800"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.path}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left transition-all duration-200",
                  collapsed ? "px-2" : "px-3",
                  isActive(item.path)
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}
                onClick={() => navigate(item.path)}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="ml-3 truncate">{item.title}</span>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className="ml-auto bg-blue-500 text-white text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            );
          })}
        </div>

        {/* Quick Actions */}
        {!collapsed && (
          <div className="pt-6">
            <h3 className="px-3 text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    size="sm"
                    className={cn(
                      "w-full justify-start text-white border-0",
                      action.color
                    )}
                    onClick={action.action}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {action.title}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 space-y-1 border-t border-slate-700">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.path}
              variant="ghost"
              className={cn(
                "w-full justify-start text-left",
                collapsed ? "px-2" : "px-3",
                isActive(item.path)
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
              onClick={() => navigate(item.path)}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && (
                <>
                  <span className="ml-3 truncate">{item.title}</span>
                  {item.badge && (
                    <Badge
                      variant="destructive"
                      className="ml-auto bg-red-500 text-white text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
