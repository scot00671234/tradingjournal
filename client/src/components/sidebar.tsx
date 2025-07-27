import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { SubscriptionStatus } from "@shared/schema";
import {
  TrendingUp,
  Home,
  Plus,
  History,
  BarChart3,
  Tags,
  FileText,
  Settings,
  Crown,
  LogOut,
} from "lucide-react";

export function Sidebar() {
  const [location, setLocation] = useLocation();
  const { user, logoutMutation } = useAuth();

  const { data: subscriptionStatus } = useQuery<SubscriptionStatus>({
    queryKey: ["/api/subscription-status"],
    enabled: !!user,
  });

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Plus, label: "Add Trade", path: "/add-trade" },
    { icon: History, label: "Trade History", path: "/trades" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: Tags, label: "Tags & Labels", path: "/tags" },
    { icon: FileText, label: "Export Data", path: "/export" },
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getTradeProgress = () => {
    if (!subscriptionStatus) return 0;
    if (subscriptionStatus.plan === 'pro') return 100;
    return (subscriptionStatus.tradeCount / (subscriptionStatus.tradeLimit || 5)) * 100;
  };

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">CoinFeedly</h1>
            <span className="text-xs text-muted-foreground">Trading Journal</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            variant={location === item.path ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setLocation(item.path)}
          >
            <item.icon className="w-4 h-4 mr-3" />
            {item.label}
          </Button>
        ))}
      </nav>

      {/* Plan Status */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">Plan Usage</span>
          <Badge variant={subscriptionStatus?.plan === 'pro' ? 'default' : 'secondary'}>
            {subscriptionStatus?.plan === 'pro' ? (
              <>
                <Crown className="w-3 h-3 mr-1" />
                UNLIMITED
              </>
            ) : (
              'FREE'
            )}
          </Badge>
        </div>

        {subscriptionStatus && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">
                {subscriptionStatus.plan === 'pro' ? 'Trades This Month' : 'Trades Used'}
              </span>
              <span className="text-foreground">
                {subscriptionStatus.plan === 'pro' 
                  ? subscriptionStatus.tradeCount 
                  : `${subscriptionStatus.tradeCount} / ${subscriptionStatus.tradeLimit}`
                }
              </span>
            </div>
            <Progress value={getTradeProgress()} className="h-2" />
          </div>
        )}

        {subscriptionStatus?.plan === 'free' && (
          <Button
            onClick={() => setLocation("/subscribe")}
            className="w-full mb-3"
            size="sm"
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Pro
          </Button>
        )}

        <Button
          variant="ghost"
          onClick={() => setLocation("/settings")}
          className="w-full justify-start mb-2"
        >
          <Settings className="w-4 h-4 mr-3" />
          Settings
        </Button>

        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          disabled={logoutMutation.isPending}
        >
          <LogOut className="w-4 h-4 mr-3" />
          {logoutMutation.isPending ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </aside>
  );
}
