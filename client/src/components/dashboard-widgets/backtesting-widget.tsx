import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  Clock,
  Target,
  DollarSign,
  Activity,
  Zap,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { format, addDays, parseISO } from "date-fns";
import { formatCurrency } from "@/components/currency-selector";
import { useAuth } from "@/hooks/use-auth";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ScatterChart,
  Scatter,
  Cell,
} from "recharts";

interface BacktestConfig {
  symbol: string;
  startDate: string;
  endDate: string;
  initialBalance: number;
  positionSize: number;
  strategy: string;
  timeframe: string;
  stopLoss?: number;
  takeProfit?: number;
  maxPositions: number;
}

interface BacktestResult {
  id: string;
  config: BacktestConfig;
  trades: BacktestTrade[];
  performance: PerformanceMetrics;
  equityCurve: EquityPoint[];
  drawdownCurve: DrawdownPoint[];
  status: 'running' | 'completed' | 'error';
  progress: number;
  createdAt: Date;
}

interface BacktestTrade {
  id: string;
  symbol: string;
  direction: 'long' | 'short';
  entryDate: Date;
  exitDate?: Date;
  entryPrice: number;
  exitPrice?: number;
  size: number;
  pnl?: number;
  commission: number;
  reason: string; // Entry/exit reason
  duration?: number; // In minutes
  status: 'open' | 'closed';
}

interface PerformanceMetrics {
  totalReturn: number;
  annualizedReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  totalTrades: number;
  avgWin: number;
  avgLoss: number;
  largestWin: number;
  largestLoss: number;
  avgTradeDuration: number;
  volatility: number;
  calmarRatio: number;
}

interface EquityPoint {
  date: string;
  equity: number;
  drawdown: number;
}

interface DrawdownPoint {
  date: string;
  drawdown: number;
  underwater: number;
}

// Mock market data generator for demonstration
const generateMockMarketData = (symbol: string, startDate: string, endDate: string) => {
  const data = [];
  let currentPrice = 100 + Math.random() * 400; // Random starting price
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let date = new Date(start); date <= end; date = addDays(date, 1)) {
    // Skip weekends for stock simulation
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      const volatility = 0.02; // 2% daily volatility
      const trend = 0.0002; // Slight upward bias
      const change = (Math.random() - 0.5) * volatility + trend;
      currentPrice *= (1 + change);
      
      data.push({
        date: format(date, 'yyyy-MM-dd'),
        open: currentPrice * (1 + (Math.random() - 0.5) * 0.005),
        high: currentPrice * (1 + Math.random() * 0.02),
        low: currentPrice * (1 - Math.random() * 0.02),
        close: currentPrice,
        volume: Math.floor(Math.random() * 1000000) + 100000,
      });
    }
  }
  return data;
};

// Simple moving average crossover strategy simulation
const simulateStrategy = (marketData: any[], config: BacktestConfig): BacktestResult => {
  const trades: BacktestTrade[] = [];
  const equityCurve: EquityPoint[] = [];
  const drawdownCurve: DrawdownPoint[] = [];
  
  let balance = config.initialBalance;
  let position: BacktestTrade | null = null;
  let tradeId = 1;
  let peak = balance;
  
  // Simple SMA crossover parameters
  const shortPeriod = 10;
  const longPeriod = 30;
  
  marketData.forEach((candle, index) => {
    if (index < longPeriod) return;
    
    // Calculate SMAs
    const shortSMA = marketData.slice(index - shortPeriod + 1, index + 1)
      .reduce((sum, c) => sum + c.close, 0) / shortPeriod;
    const longSMA = marketData.slice(index - longPeriod + 1, index + 1)
      .reduce((sum, c) => sum + c.close, 0) / longPeriod;
    
    const price = candle.close;
    const commission = 5; // $5 per trade
    
    // Entry signal: SMA crossover
    if (!position && shortSMA > longSMA && index > 0) {
      const prevShortSMA = marketData.slice(index - shortPeriod, index)
        .reduce((sum, c) => sum + c.close, 0) / shortPeriod;
      const prevLongSMA = marketData.slice(index - longPeriod, index)
        .reduce((sum, c) => sum + c.close, 0) / longPeriod;
      
      if (prevShortSMA <= prevLongSMA) { // Crossover occurred
        const positionValue = (balance * config.positionSize) / 100;
        const shares = Math.floor(positionValue / price);
        
        if (shares > 0) {
          position = {
            id: `trade-${tradeId++}`,
            symbol: config.symbol,
            direction: 'long',
            entryDate: new Date(candle.date),
            entryPrice: price,
            size: shares,
            commission,
            reason: 'SMA Crossover Bull',
            status: 'open',
          };
          
          balance -= (shares * price + commission);
        }
      }
    }
    
    // Exit signal: SMA cross back or stop loss/take profit
    if (position) {
      let shouldExit = false;
      let exitReason = '';
      
      // SMA cross back
      if (shortSMA < longSMA) {
        shouldExit = true;
        exitReason = 'SMA Crossover Bear';
      }
      
      // Stop loss
      if (config.stopLoss && price <= position.entryPrice * (1 - config.stopLoss / 100)) {
        shouldExit = true;
        exitReason = 'Stop Loss';
      }
      
      // Take profit
      if (config.takeProfit && price >= position.entryPrice * (1 + config.takeProfit / 100)) {
        shouldExit = true;
        exitReason = 'Take Profit';
      }
      
      if (shouldExit) {
        const exitValue = position.size * price;
        const pnl = exitValue - (position.size * position.entryPrice) - commission - position.commission;
        
        const completedTrade: BacktestTrade = {
          ...position,
          exitDate: new Date(candle.date),
          exitPrice: price,
          pnl,
          reason: `${position.reason} | ${exitReason}`,
          duration: (new Date(candle.date).getTime() - position.entryDate.getTime()) / (1000 * 60), // minutes
          status: 'closed',
        };
        
        trades.push(completedTrade);
        balance += exitValue - commission;
        position = null;
      }
    }
    
    // Calculate current equity (including open position)
    let currentEquity = balance;
    if (position) {
      currentEquity += position.size * price;
    }
    
    // Track peak and drawdown
    if (currentEquity > peak) {
      peak = currentEquity;
    }
    
    const drawdown = ((peak - currentEquity) / peak) * 100;
    
    equityCurve.push({
      date: candle.date,
      equity: currentEquity,
      drawdown,
    });
    
    drawdownCurve.push({
      date: candle.date,
      drawdown,
      underwater: currentEquity < peak ? drawdown : 0,
    });
  });
  
  // Calculate performance metrics
  const totalReturn = ((balance - config.initialBalance) / config.initialBalance) * 100;
  const tradingDays = marketData.length;
  const annualizedReturn = (Math.pow(balance / config.initialBalance, 252 / tradingDays) - 1) * 100;
  
  const wins = trades.filter(t => t.pnl! > 0);
  const losses = trades.filter(t => t.pnl! < 0);
  const winRate = trades.length > 0 ? (wins.length / trades.length) * 100 : 0;
  
  const grossWins = wins.reduce((sum, t) => sum + t.pnl!, 0);
  const grossLosses = Math.abs(losses.reduce((sum, t) => sum + t.pnl!, 0));
  const profitFactor = grossLosses > 0 ? grossWins / grossLosses : grossWins > 0 ? 999 : 0;
  
  const maxDrawdown = Math.max(...drawdownCurve.map(d => d.drawdown));
  
  const performance: PerformanceMetrics = {
    totalReturn,
    annualizedReturn,
    sharpeRatio: 0, // Simplified for demo
    maxDrawdown,
    winRate,
    profitFactor,
    totalTrades: trades.length,
    avgWin: wins.length > 0 ? grossWins / wins.length : 0,
    avgLoss: losses.length > 0 ? grossLosses / losses.length : 0,
    largestWin: wins.length > 0 ? Math.max(...wins.map(t => t.pnl!)) : 0,
    largestLoss: losses.length > 0 ? Math.min(...losses.map(t => t.pnl!)) : 0,
    avgTradeDuration: trades.length > 0 ? trades.reduce((sum, t) => sum + (t.duration || 0), 0) / trades.length : 0,
    volatility: 0, // Simplified for demo
    calmarRatio: maxDrawdown > 0 ? annualizedReturn / maxDrawdown : 0,
  };
  
  return {
    id: `backtest-${Date.now()}`,
    config,
    trades,
    performance,
    equityCurve,
    drawdownCurve,
    status: 'completed',
    progress: 100,
    createdAt: new Date(),
  };
};

export function BacktestingWidget() {
  const { user } = useAuth();
  const currency = user?.preferredCurrency || "USD";
  
  const [activeTab, setActiveTab] = useState("setup");
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<BacktestResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<BacktestResult | null>(null);
  
  const [config, setConfig] = useState<BacktestConfig>({
    symbol: "AAPL",
    startDate: "2023-01-01",
    endDate: "2024-01-01",
    initialBalance: 10000,
    positionSize: 25, // 25% of portfolio per trade
    strategy: "sma_crossover",
    timeframe: "1d",
    stopLoss: 5, // 5%
    takeProfit: 10, // 10%
    maxPositions: 1,
  });
  
  const runBacktest = useCallback(async () => {
    setIsRunning(true);
    setActiveTab("results");
    
    try {
      // Simulate loading with progress
      const mockProgress = [0, 25, 50, 75, 100];
      for (const progress of mockProgress) {
        await new Promise(resolve => setTimeout(resolve, 500));
        // Update progress here if needed
      }
      
      // Generate mock market data
      const marketData = generateMockMarketData(config.symbol, config.startDate, config.endDate);
      
      // Run strategy simulation
      const result = simulateStrategy(marketData, config);
      
      setResults(prev => [result, ...prev.slice(0, 4)]); // Keep last 5 results
      setSelectedResult(result);
      
    } catch (error) {
      console.error('Backtest failed:', error);
    } finally {
      setIsRunning(false);
    }
  }, [config]);
  
  const PerformanceCard = ({ title, value, change, icon: Icon, color = "text-gray-900" }: any) => (
    <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-lg p-3">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-gray-500" />
          <span className="text-xs text-gray-600 dark:text-gray-400">{title}</span>
        </div>
        {change !== undefined && (
          <Badge variant={change >= 0 ? "default" : "destructive"} className="text-xs">
            {change >= 0 ? "+" : ""}{change.toFixed(1)}%
          </Badge>
        )}
      </div>
      <div className={`text-sm font-semibold ${color}`}>
        {typeof value === 'number' && title.includes('$') ? formatCurrency(value, currency) : value}
      </div>
    </div>
  );
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-base font-medium">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Strategy Backtesting
          </div>
          <div className="flex items-center gap-2">
            {isRunning && <Progress value={75} className="w-20 h-2" />}
            <Badge variant="outline" className="text-xs">
              {results.length} tests
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="setup" className="text-xs">Setup</TabsTrigger>
            <TabsTrigger value="results" className="text-xs">Results</TabsTrigger>
            <TabsTrigger value="history" className="text-xs">History</TabsTrigger>
          </TabsList>
          
          {/* Setup Tab */}
          <TabsContent value="setup" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs">Symbol</Label>
                <Select value={config.symbol} onValueChange={(value) => setConfig(prev => ({ ...prev, symbol: value }))}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AAPL">AAPL</SelectItem>
                    <SelectItem value="MSFT">MSFT</SelectItem>
                    <SelectItem value="GOOGL">GOOGL</SelectItem>
                    <SelectItem value="TSLA">TSLA</SelectItem>
                    <SelectItem value="NVDA">NVDA</SelectItem>
                    <SelectItem value="BTC-USD">BTC-USD</SelectItem>
                    <SelectItem value="ETH-USD">ETH-USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">Strategy</Label>
                <Select value={config.strategy} onValueChange={(value) => setConfig(prev => ({ ...prev, strategy: value }))}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sma_crossover">SMA Crossover</SelectItem>
                    <SelectItem value="rsi_mean_reversion">RSI Mean Reversion</SelectItem>
                    <SelectItem value="breakout">Breakout Strategy</SelectItem>
                    <SelectItem value="pairs_trading">Pairs Trading</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs">Start Date</Label>
                <Input
                  type="date"
                  value={config.startDate}
                  onChange={(e) => setConfig(prev => ({ ...prev, startDate: e.target.value }))}
                  className="h-8 text-xs"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">End Date</Label>
                <Input
                  type="date"
                  value={config.endDate}
                  onChange={(e) => setConfig(prev => ({ ...prev, endDate: e.target.value }))}
                  className="h-8 text-xs"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs">Initial Balance</Label>
                <Input
                  type="number"
                  value={config.initialBalance}
                  onChange={(e) => setConfig(prev => ({ ...prev, initialBalance: Number(e.target.value) }))}
                  className="h-8 text-xs"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">Position Size (%)</Label>
                <Input
                  type="number"
                  value={config.positionSize}
                  onChange={(e) => setConfig(prev => ({ ...prev, positionSize: Number(e.target.value) }))}
                  min="1"
                  max="100"
                  className="h-8 text-xs"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs">Stop Loss (%)</Label>
                <Input
                  type="number"
                  value={config.stopLoss || ""}
                  onChange={(e) => setConfig(prev => ({ ...prev, stopLoss: e.target.value ? Number(e.target.value) : undefined }))}
                  placeholder="Optional"
                  min="0.1"
                  max="50"
                  step="0.1"
                  className="h-8 text-xs"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">Take Profit (%)</Label>
                <Input
                  type="number"
                  value={config.takeProfit || ""}
                  onChange={(e) => setConfig(prev => ({ ...prev, takeProfit: e.target.value ? Number(e.target.value) : undefined }))}
                  placeholder="Optional"
                  min="0.1"
                  max="100"
                  step="0.1"
                  className="h-8 text-xs"
                />
              </div>
            </div>
            
            <Button
              onClick={runBacktest}
              disabled={isRunning}
              className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white"
            >
              {isRunning ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Running Backtest...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Backtest
                </>
              )}
            </Button>
          </TabsContent>
          
          {/* Results Tab */}
          <TabsContent value="results" className="space-y-4 mt-4">
            {selectedResult ? (
              <div className="space-y-4">
                {/* Performance Summary */}
                <div className="grid grid-cols-2 gap-2">
                  <PerformanceCard
                    title="Total Return"
                    value={`${selectedResult.performance.totalReturn.toFixed(2)}%`}
                    change={selectedResult.performance.totalReturn}
                    icon={TrendingUp}
                    color={selectedResult.performance.totalReturn >= 0 ? "text-green-600" : "text-red-600"}
                  />
                  <PerformanceCard
                    title="Max Drawdown"
                    value={`${selectedResult.performance.maxDrawdown.toFixed(2)}%`}
                    icon={TrendingDown}
                    color="text-red-600"
                  />
                  <PerformanceCard
                    title="Win Rate"
                    value={`${selectedResult.performance.winRate.toFixed(1)}%`}
                    icon={Target}
                    color={selectedResult.performance.winRate >= 50 ? "text-green-600" : "text-red-600"}
                  />
                  <PerformanceCard
                    title="Total Trades"
                    value={selectedResult.performance.totalTrades}
                    icon={BarChart3}
                  />
                </div>
                
                {/* Equity Curve */}
                <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-lg p-3">
                  <h4 className="text-xs font-medium mb-2 flex items-center gap-2">
                    <TrendingUp className="h-3 w-3" />
                    Equity Curve
                  </h4>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedResult.equityCurve}>
                        <XAxis 
                          dataKey="date" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10 }}
                          tickFormatter={(value) => format(new Date(value), "MMM")}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10 }}
                          tickFormatter={(value) => `$${(value/1000).toFixed(0)}K`}
                        />
                        <Tooltip 
                          formatter={(value: any) => [formatCurrency(value, currency), "Equity"]}
                          labelFormatter={(value) => format(new Date(value), "MMM dd, yyyy")}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="equity" 
                          stroke="#f59e0b" 
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Recent Trades */}
                <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-lg p-3">
                  <h4 className="text-xs font-medium mb-2 flex items-center gap-2">
                    <Activity className="h-3 w-3" />
                    Recent Trades
                  </h4>
                  <ScrollArea className="h-24">
                    <div className="space-y-1">
                      {selectedResult.trades.slice(-5).map((trade) => (
                        <div key={trade.id} className="flex items-center justify-between p-2 bg-white/50 dark:bg-gray-700/50 rounded text-xs">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${trade.pnl! >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span>{trade.symbol}</span>
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              {trade.direction}
                            </Badge>
                          </div>
                          <div className={`font-medium ${trade.pnl! >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {trade.pnl! >= 0 ? '+' : ''}{formatCurrency(trade.pnl!, currency)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-center">
                <div className="text-muted-foreground">
                  <Play className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No backtest results yet</p>
                  <p className="text-xs mt-1">Configure and run a backtest to see results</p>
                </div>
              </div>
            )}
          </TabsContent>
          
          {/* History Tab */}
          <TabsContent value="history" className="space-y-4 mt-4">
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {results.length > 0 ? (
                  results.map((result) => (
                    <div
                      key={result.id}
                      onClick={() => {
                        setSelectedResult(result);
                        setActiveTab("results");
                      }}
                      className="p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{result.config.symbol}</span>
                          <Badge variant="outline" className="text-xs">
                            {result.config.strategy.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {result.status === 'completed' ? (
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                          ) : result.status === 'error' ? (
                            <AlertCircle className="h-3 w-3 text-red-500" />
                          ) : (
                            <Clock className="h-3 w-3 text-yellow-500" />
                          )}
                          <span className="text-xs text-gray-500">
                            {format(result.createdAt, "MMM dd")}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Return:</span>
                          <div className={`font-medium ${result.performance.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {result.performance.totalReturn.toFixed(1)}%
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Trades:</span>
                          <div className="font-medium">{result.performance.totalTrades}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Win Rate:</span>
                          <div className="font-medium">{result.performance.winRate.toFixed(0)}%</div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-40 text-center">
                    <div className="text-muted-foreground">
                      <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No backtest history</p>
                      <p className="text-xs mt-1">Completed backtests will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}