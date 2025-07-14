import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { TradeStatsCards } from "@/components/trade-stats-cards";
import { UnifiedTradeEntry } from "@/components/unified-trade-entry";
import { RecentTradesTable } from "@/components/recent-trades-table";
import { useAuth } from "@/hooks/use-auth";
import { Bell, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";

export default function DashboardPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    enabled: !!user,
  });

  const { data: trades } = useQuery({
    queryKey: ["/api/trades"],
    enabled: !!user,
  });

  const { data: subscriptionStatus } = useQuery({
    queryKey: ["/api/subscription-status"],
    enabled: !!user,
  });

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Trading Dashboard</h2>
              <p className="text-muted-foreground">
                Welcome back, <span className="text-foreground">{user?.username}</span>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-muted-foreground hover:text-foreground"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground text-sm font-medium">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-foreground">{user?.username}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <TradeStatsCards stats={stats} />

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Trade Entry Form */}
            <div className="lg:col-span-2">
              <UnifiedTradeEntry subscriptionStatus={subscriptionStatus} />
            </div>

            {/* Recent Performance */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Recent Performance</h3>
              
              <div className="space-y-4">
                {trades?.slice(0, 3).map((trade: any) => (
                  <div key={trade.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        trade.direction === 'long' 
                          ? 'bg-emerald-500/20 text-emerald-500' 
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        <span className="text-sm">
                          {trade.direction === 'long' ? '↗' : '↘'}
                        </span>
                      </div>
                      <div>
                        <p className="text-foreground font-medium">{trade.asset}</p>
                        <p className="text-muted-foreground text-sm">
                          {trade.direction} • {new Date(trade.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        parseFloat(trade.pnl || '0') >= 0 ? 'text-emerald-500' : 'text-red-500'
                      }`}>
                        {parseFloat(trade.pnl || '0') >= 0 ? '+' : ''}${trade.pnl || '0'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-4" onClick={() => window.location.href = "/trade-history"}>
                View All Trades
              </Button>
            </div>
          </div>

          {/* Recent Trades Table */}
          <RecentTradesTable trades={trades} />
        </div>
      </main>
    </div>
  );
}
