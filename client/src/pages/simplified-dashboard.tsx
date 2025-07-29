
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Moon, Sun, Plus, Filter, Search, Settings, LogOut, Layout, LayoutDashboard, TrendingUp, BarChart3 } from "lucide-react";
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
import coinFeedlyLogo from "@assets/logo coin feedly (1)_1753637229790.png";
import { getGreeting } from "@/utils/greeting";

export default function SimplifiedDashboard() {
  const { user, logoutMutation } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showTradeEntry, setShowTradeEntry] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDirection, setFilterDirection] = useState<string>("all");
  const [filterAsset, setFilterAsset] = useState<string>("all");
  const [filterTimeframe, setFilterTimeframe] = useState<string>("all");
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [showWidgetSelector, setShowWidgetSelector] = useState(false);
  // Standard widget sizes: Small (4x4), Medium (6x5), Large (12x6)
  const [layouts, setLayouts] = useState([
    { i: "equity-curve", x: 0, y: 0, w: 6, h: 5, minW: 6, minH: 5, maxW: 6, maxH: 5 },
    { i: "drawdown", x: 6, y: 0, w: 6, h: 5, minW: 6, minH: 5, maxW: 6, maxH: 5 },
    { i: "performance-metrics", x: 0, y: 5, w: 6, h: 5, minW: 6, minH: 5, maxW: 6, maxH: 5 },
    { i: "trade-list", x: 6, y: 5, w: 6, h: 5, minW: 6, minH: 5, maxW: 6, maxH: 5 },
  ]);
  
  const [activeWidgets, setActiveWidgets] = useState([
    "equity-curve", "drawdown", "performance-metrics", "trade-list"
  ]);
  
  const availableWidgets = [
    { id: "equity-curve", name: "Equity Curve", icon: TrendingUp, description: "Track your account value over time" },
    { id: "drawdown", name: "Drawdown Analysis", icon: BarChart3, description: "Monitor risk and underwater periods" },
    { id: "performance-metrics", name: "Performance Metrics", icon: LayoutDashboard, description: "Key trading statistics and ratios" },
    { id: "trade-list", name: "Recent Trades", icon: Layout, description: "View your latest trading activity" },
  ];

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
    const matchesSearch = searchTerm === "" || 
      trade.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (trade.tags && (() => {
        try {
          const tags = typeof trade.tags === 'string' ? JSON.parse(trade.tags) : trade.tags;
          return Array.isArray(tags) && tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        } catch {
          return false;
        }
      })()) ||
      trade.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.direction.toLowerCase().includes(searchTerm.toLowerCase());
    
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

  // Placeholder widget component for new widgets
  const PlaceholderWidget = ({ title, icon: Icon, description }: { title: string; icon: any; description: string }) => (
    <div className="h-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h3>
        </div>
        <Badge variant="outline" className="text-xs">Coming Soon</Badge>
      </div>
      <div className="flex items-center justify-center flex-1 text-center">
        <div>
          <Icon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
    </div>
  );

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

  // Widget size configurations: Uniform size for clean, organized layout
  const getWidgetSize = (widgetId: string) => {
    const sizeMap: Record<string, { w: number; h: number }> = {
      "equity-curve": { w: 6, h: 6 }, // Uniform - chart with proper spacing
      "drawdown": { w: 6, h: 6 }, // Uniform - chart with proper spacing
      "performance-metrics": { w: 6, h: 6 }, // Uniform - metrics grid
      "trade-list": { w: 6, h: 6 }, // Uniform - scrollable list
    };
    return sizeMap[widgetId] || { w: 6, h: 6 };
  };

  const addWidget = (widgetId: string) => {
    if (!activeWidgets.includes(widgetId)) {
      setActiveWidgets([...activeWidgets, widgetId]);
      const size = getWidgetSize(widgetId);
      const newWidget = {
        i: widgetId,
        x: 0,
        y: Math.max(...layouts.map(l => l.y + l.h), 0),
        w: size.w,
        h: size.h,
        minW: size.w,
        minH: size.h,
        maxW: size.w,
        maxH: size.h,
      };
      setLayouts([...layouts, newWidget]);
    }
    setShowWidgetSelector(false);
  };

  const removeWidget = (widgetId: string) => {
    setActiveWidgets(activeWidgets.filter(id => id !== widgetId));
    setLayouts(layouts.filter(layout => layout.i !== widgetId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Floating Nav Bar */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-4">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-yellow-100/30 dark:border-yellow-900/30 rounded-2xl px-6 py-3 shadow-lg shadow-yellow-500/10 dark:shadow-yellow-400/10">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img 
                src={coinFeedlyLogo} 
                alt="CoinFeedly" 
                className="h-8 w-auto"
              />
              <div>
                <h1 className="text-lg font-light tracking-wider text-gray-900 dark:text-white">
                  Coin<span className="font-medium ml-1">Feedly</span>
                </h1>
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
                  className="pl-10 bg-yellow-50/30 dark:bg-yellow-950/30 border-yellow-200/30 dark:border-yellow-800/30 backdrop-blur-sm focus:border-yellow-400 dark:focus:border-yellow-600"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                onClick={() => setShowTradeEntry(!showTradeEntry)}
                className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white border-0 shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all duration-300"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Trade
              </Button>
              
              <Button
                variant={isCustomizing ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsCustomizing(!isCustomizing)}
                className={isCustomizing 
                  ? "bg-yellow-600 text-white hover:bg-yellow-700" 
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                {isCustomizing ? "Done" : "Customize"}
              </Button>
              
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.href = "/settings"}
              >
                <Settings className="h-4 w-4" />
              </Button>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center">
                  <span className="text-white dark:text-black text-sm font-medium">
                    {user?.firstName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 px-4 pb-8">
        <div className="max-w-7xl mx-auto"
             style={{ 
               paddingLeft: '0px', 
               paddingRight: '0px' 
             }}>
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {getGreeting()}, {user?.firstName || user?.email?.split('@')[0]}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Here's your trading overview and quick actions.
            </p>
          </div>

          {/* Stats Cards with Glass Effect */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
               style={{ 
                 marginLeft: '16px', 
                 marginRight: '16px' 
               }}>
            {/* Total P&L Card */}
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg glass-transition hover:shadow-xl hover:scale-105 min-w-0">
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total P&L</h3>
                  <BarChart3 className="w-4 h-4 text-green-500" />
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${stats?.totalPnL?.toFixed(2) || '0.00'}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400">
                    {stats?.totalPnL && stats.totalPnL >= 0 ? 'Positive' : 'Negative'}
                  </div>
                </div>
              </div>
            </div>

            {/* Win Rate Card */}
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg glass-transition hover:shadow-xl hover:scale-105 min-w-0">
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Win Rate</h3>
                  <div className="w-4 h-4 bg-blue-500 rounded-full" />
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats?.winRate?.toFixed(1) || '0.0'}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {stats?.totalTrades || 0} {stats?.totalTrades === 1 ? 'trade' : 'trades'}
                  </div>
                </div>
              </div>
            </div>

            {/* Total Trades Card */}
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg glass-transition hover:shadow-xl hover:scale-105 min-w-0">
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Trades</h3>
                  <div className="w-4 h-4 bg-purple-500 rounded-full" />
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats?.totalTrades || 0}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    This period
                  </div>
                </div>
              </div>
            </div>

            {/* Plan Card */}
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg glass-transition hover:shadow-xl hover:scale-105 min-w-0">
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Plan</h3>
                  <Badge variant="outline" className="text-xs capitalize">
                    {subscriptionStatus?.plan || 'free'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {subscriptionStatus?.plan === 'free' ? (
                      `${subscriptionStatus.tradeCount}/5`
                    ) : (
                      'Unlimited'
                    )}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Trades used
                  </div>
                </div>
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
                <UnifiedTradeEntry subscriptionStatus={subscriptionStatus} showHeader={false} />
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
            <div className="mb-8 relative" 
                 style={{ 
                   minHeight: '1000px',
                   marginLeft: '16px', 
                   marginRight: '16px' 
                 }}>
              <GridLayout
                className="layout"
                layout={layouts}
                cols={12}
                rowHeight={85}
                width={1168}
                autoSize={true}
                isDraggable={isCustomizing}
                isResizable={false}
                onLayoutChange={handleLayoutChange}
                margin={[16, 16]}
                containerPadding={[0, 0]}
                useCSSTransforms={true}
                preventCollision={true}
                compactType="vertical"
              >
                {activeWidgets.map(widgetId => (
                  <div key={widgetId} className={isCustomizing ? "drag-handle cursor-move border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-lg transition-all relative group" : "relative"}>
                    {isCustomizing && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeWidget(widgetId);
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="absolute -top-2 -right-2 z-50 w-8 h-8 bg-red-500 text-white rounded-full text-sm flex items-center justify-center opacity-90 hover:opacity-100 transition-all duration-200 hover:bg-red-600 hover:scale-110 shadow-lg cursor-pointer"
                        style={{ pointerEvents: 'auto' }}
                      >
                        ×
                      </button>
                    )}
                    {renderWidget(widgetId)}
                  </div>
                ))}
              </GridLayout>
              
              {/* Enhanced Widget Selector Button */}
              <Button
                onClick={() => setShowWidgetSelector(!showWidgetSelector)}
                className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 rounded-full w-12 h-12 transition-all duration-300 transform hover:scale-110 active:scale-95 backdrop-blur-sm border border-white/20"
                size="sm"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%), linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  boxShadow: '0 8px 32px rgba(245, 158, 11, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                }}
              >
                <Plus className="w-5 h-5" />
              </Button>
              
              {/* Enhanced Widget Selector Panel */}
              {showWidgetSelector && (
                <>
                  <div 
                    className="fixed inset-0 z-40 bg-black/20" 
                    onClick={() => setShowWidgetSelector(false)}
                  />
                  <div className="fixed bottom-20 right-6 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-4 shadow-xl min-w-[320px] max-h-[400px] overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Add Widget</h4>
                      <button
                        onClick={() => setShowWidgetSelector(false)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        ×
                      </button>
                    </div>
                    <div className="space-y-2">
                      {availableWidgets.map((widget) => {
                        const isActive = activeWidgets.includes(widget.id);
                        return (
                          <button
                            key={widget.id}
                            className={`w-full flex items-start p-3 text-left rounded-lg transition-all border ${
                              isActive 
                                ? 'bg-yellow-50/50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700 opacity-50 cursor-not-allowed' 
                                : 'hover:bg-gray-100/50 dark:hover:bg-gray-800/50 border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                            }`}
                            onClick={() => !isActive && addWidget(widget.id)}
                            disabled={isActive}
                          >
                            <widget.icon className="w-5 h-5 mr-3 mt-0.5 text-gray-600 dark:text-gray-400" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{widget.name}</span>
                                {isActive && (
                                  <span className="text-xs text-yellow-600 dark:text-yellow-400 ml-2">Active</span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{widget.description}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
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
                <p className="text-gray-600 dark:text-gray-400">
                  Use the quick trade entry form above to log your trades and see powerful analytics
                </p>
              </div>
            </div>
          )}

          {/* Recent Trades with Glass Effect */}
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg glass-transition hover:shadow-xl"
               style={{ 
                 marginLeft: '16px', 
                 marginRight: '16px' 
               }}>
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
                          parseFloat(String(trade.pnl || '0')) >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {parseFloat(String(trade.pnl || '0')) >= 0 ? '+' : ''}${String(trade.pnl || '0.00')}
                        </div>
                        {trade.tags && (() => {
                          try {
                            const tags = typeof trade.tags === 'string' ? JSON.parse(trade.tags) : trade.tags;
                            return tags && tags.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {tags.slice(0, 2).map((tag: string, index: number) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            );
                          } catch {
                            return null;
                          }
                        })()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No trades yet</h4>
                  <p className="text-gray-500 dark:text-gray-400">
                    Your completed trades will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}