
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Bell, Moon, Sun, Plus, Filter, Search, Settings, LogOut, Layout, LayoutDashboard, TrendingUp, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTheme } from "@/components/ui/theme-provider";
import { UnifiedTradeEntry } from "@/components/unified-trade-entry";
import { EquityCurveWidget } from "@/components/dashboard-widgets/equity-curve-widget";
import { DrawdownWidget } from "@/components/dashboard-widgets/drawdown-widget";
import { PerformanceMetricsWidget } from "@/components/dashboard-widgets/performance-metrics-widget";
import { TradeListWidget } from "@/components/dashboard-widgets/trade-list-widget";
import type { TradeStats, SubscriptionStatus, Trade } from "@shared/schema";
import "react-grid-layout/css/styles.css";
//@ts-ignore
import GridLayout from "react-grid-layout";

export default function SimplifiedDashboard() {
  const { user, logoutMutation } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showTradeEntry, setShowTradeEntry] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDirection, setFilterDirection] = useState<string>("all");
  const [filterAsset, setFilterAsset] = useState<string>("all");
  const [filterTimeframe, setFilterTimeframe] = useState<string>("all");
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [layouts, setLayouts] = useState([
    { i: "equity-curve", x: 0, y: 0, w: 6, h: 4, minW: 4, minH: 3 },
    { i: "drawdown", x: 6, y: 0, w: 6, h: 4, minW: 4, minH: 3 },
    { i: "performance-metrics", x: 0, y: 4, w: 6, h: 4, minW: 4, minH: 3 },
    { i: "trade-list", x: 6, y: 4, w: 6, h: 4, minW: 4, minH: 3 },
  ]);

  const { data: stats } = useQuery<TradeStats>({
    queryKey: ["/api/stats"],
    enabled: !!user,
  });

  const { data: trades } = useQuery<Trade[]>({
    queryKey: ["/api/trades"],
    enabled: !!user,
  });

  const { data: subscriptionStatus } = useQuery<SubscriptionStatus>({
    queryKey: ["/api/subscription-status"],
    enabled: !!user,
  });

  const filteredTrades = trades?.filter(trade => {
    const matchesSearch = trade.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDirection = filterDirection === "all" || trade.direction === filterDirection;
    const matchesAsset = filterAsset === "all" || trade.asset === filterAsset;
    
    let matchesTimeframe = true;
    if (filterTimeframe !== "all") {
      const tradeDate = new Date(trade.createdAt);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - tradeDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (filterTimeframe) {
        case "today":
          matchesTimeframe = daysDiff === 0;
          break;
        case "week":
          matchesTimeframe = daysDiff <= 7;
          break;
        case "month":
          matchesTimeframe = daysDiff <= 30;
          break;
        case "quarter":
          matchesTimeframe = daysDiff <= 90;
          break;
      }
    }
    
    return matchesSearch && matchesDirection && matchesAsset && matchesTimeframe;
  }) || [];

  // Get unique assets for filter dropdown
  const uniqueAssets = Array.from(new Set(trades?.map(trade => trade.asset) || []));

  // Widget rendering function
  const renderWidget = (key: string) => {
    if (!trades) return null;
    
    switch (key) {
      case "equity-curve":
        return <EquityCurveWidget trades={filteredTrades} />;
      case "drawdown":
        return <DrawdownWidget trades={filteredTrades} />;
      case "performance-metrics":
        return <PerformanceMetricsWidget trades={filteredTrades} />;
      case "trade-list":
        return <TradeListWidget trades={filteredTrades} />;
      default:
        return null;
    }
  };

  const handleLayoutChange = (layout: any) => {
    setLayouts(layout);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Floating Nav Bar */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-4">
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl px-6 py-3 shadow-lg">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white dark:text-black" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">CoinFeedly</h1>
              </div>
            </div>

            {/* Search */}
            <div className="hidden md:flex items-center space-x-3 flex-1 max-w-md mx-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search trades, tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-50/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                onClick={() => setShowTradeEntry(!showTradeEntry)}
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Trade
              </Button>
              
              <Button
                variant={isCustomizing ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsCustomizing(!isCustomizing)}
                className={isCustomizing 
                  ? "bg-blue-600 text-white hover:bg-blue-700" 
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                {isCustomizing ? "Done" : "Customize"}
              </Button>
              
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center">
                  <span className="text-white dark:text-black text-sm font-medium">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Good morning, {user?.email?.split('@')[0]}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Here's your trading overview and quick actions.
            </p>
          </div>

          {/* Stats Cards with Glass Effect */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg glass-transition hover:shadow-xl hover:scale-105">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total P&L</h3>
                <BarChart3 className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ${stats?.totalPnL?.toFixed(2) || '0.00'}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                {stats?.totalPnL && stats.totalPnL >= 0 ? 'Positive' : 'Negative'}
              </div>
            </div>

            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg glass-transition hover:shadow-xl hover:scale-105">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Win Rate</h3>
                <div className="w-4 h-4 bg-blue-500 rounded-full" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.winRate?.toFixed(1) || '0.0'}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stats?.totalTrades || 0} trades
              </div>
            </div>

            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg glass-transition hover:shadow-xl hover:scale-105">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Trades</h3>
                <div className="w-4 h-4 bg-purple-500 rounded-full" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.totalTrades || 0}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                This period
              </div>
            </div>

            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg glass-transition hover:shadow-xl hover:scale-105">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Plan</h3>
                <Badge variant="outline" className="text-xs">
                  {subscriptionStatus?.plan || 'Free'}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {subscriptionStatus?.plan === 'free' ? (
                  `${subscriptionStatus.tradeCount}/5`
                ) : (
                  'Unlimited'
                )}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Trades used
              </div>
            </div>
          </div>

          {/* Trade Entry Form - Collapsible */}
          {showTradeEntry && (
            <div className="mb-8">
              <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg glass-transition hover:shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Trade Entry</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTradeEntry(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ✕
                  </Button>
                </div>
                <UnifiedTradeEntry subscriptionStatus={subscriptionStatus} />
              </div>
            </div>
          )}

          {/* Customization Notice */}
          {isCustomizing && (
            <div className="mb-6 p-4 bg-blue-50/80 dark:bg-blue-900/20 backdrop-blur-xl border border-blue-200/50 dark:border-blue-700/50 rounded-xl">
              <div className="flex items-center text-blue-800 dark:text-blue-200">
                <Layout className="w-5 h-5 mr-2" />
                <span className="font-medium">Customization Mode</span>
                <span className="ml-2 text-sm opacity-75">Drag widgets to rearrange your dashboard</span>
              </div>
            </div>
          )}

          {/* Drag-and-Drop Dashboard */}
          {trades && trades.length > 0 && (
            <div className="mb-8">
              <GridLayout
                className="layout"
                layout={layouts}
                cols={12}
                rowHeight={60}
                width={1200}
                isDraggable={isCustomizing}
                isResizable={isCustomizing}
                onLayoutChange={handleLayoutChange}
                margin={[24, 24]}
                containerPadding={[0, 0]}
                useCSSTransforms={true}
              >
                <div key="equity-curve" className={isCustomizing ? "drag-handle" : ""}>
                  {renderWidget("equity-curve")}
                </div>
                <div key="drawdown" className={isCustomizing ? "drag-handle" : ""}>
                  {renderWidget("drawdown")}
                </div>
                <div key="performance-metrics" className={isCustomizing ? "drag-handle" : ""}>
                  {renderWidget("performance-metrics")}
                </div>
                <div key="trade-list" className={isCustomizing ? "drag-handle" : ""}>
                  {renderWidget("trade-list")}
                </div>
              </GridLayout>
            </div>
          )}

          {/* Empty State */}
          {(!trades || trades.length === 0) && (
            <div className="text-center py-16">
              <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-12 shadow-lg">
                <BarChart3 className="w-16 h-16 mx-auto mb-6 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Start Your Trading Journey
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Add your first trade to see powerful analytics and insights
                </p>
                <Button
                  onClick={() => setShowTradeEntry(true)}
                  className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Trade
                </Button>
              </div>
            </div>
          )}

          {/* Recent Trades with Glass Effect */}
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg glass-transition hover:shadow-xl">
            <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Trades</h3>
                <div className="flex items-center space-x-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Filter className="w-4 h-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50">
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">Filter Trades</h4>
                        
                        <div className="space-y-2">
                          <label className="text-sm text-gray-600 dark:text-gray-400">Direction</label>
                          <Select value={filterDirection} onValueChange={setFilterDirection}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Directions</SelectItem>
                              <SelectItem value="long">Long Only</SelectItem>
                              <SelectItem value="short">Short Only</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm text-gray-600 dark:text-gray-400">Asset</label>
                          <Select value={filterAsset} onValueChange={setFilterAsset}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Assets</SelectItem>
                              {uniqueAssets.map(asset => (
                                <SelectItem key={asset} value={asset}>{asset}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm text-gray-600 dark:text-gray-400">Time Period</label>
                          <Select value={filterTimeframe} onValueChange={setFilterTimeframe}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Time</SelectItem>
                              <SelectItem value="today">Today</SelectItem>
                              <SelectItem value="week">Last Week</SelectItem>
                              <SelectItem value="month">Last Month</SelectItem>
                              <SelectItem value="quarter">Last Quarter</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setFilterDirection("all");
                            setFilterAsset("all");
                            setFilterTimeframe("all");
                            setSearchTerm("");
                          }}
                          className="w-full"
                        >
                          Clear All Filters
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  <Badge variant="outline" className="text-xs">
                    {filteredTrades.length} trades
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {filteredTrades.length > 0 ? (
                <div className="space-y-3">
                  {filteredTrades.slice(0, 10).map((trade) => (
                    <div key={trade.id} className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/30 dark:border-gray-700/30">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          trade.direction === 'long' 
                            ? 'bg-green-500/20 text-green-600' 
                            : 'bg-red-500/20 text-red-600'
                        }`}>
                          <TrendingUp className={`w-5 h-5 ${trade.direction === 'short' ? 'rotate-180' : ''}`} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{trade.asset}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {trade.direction} • {new Date(trade.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${
                          parseFloat(trade.pnl || '0') >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {parseFloat(trade.pnl || '0') >= 0 ? '+' : ''}${trade.pnl || '0.00'}
                        </div>
                        {trade.tags && trade.tags.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {trade.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No trades yet</h4>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Start logging your trades to see them here.
                  </p>
                  <Button
                    onClick={() => setShowTradeEntry(true)}
                    className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Trade
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}