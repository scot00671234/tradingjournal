import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  Clock,
  Target,
  DollarSign
} from "lucide-react";
import { formatCurrency } from "@/components/currency-selector";
import { useAuth } from "@/hooks/use-auth";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface SimpleBacktestResult {
  totalReturn: number;
  winRate: number;
  maxDrawdown: number;
  totalTrades: number;
  profitFactor: number;
  equityCurve: { date: string; value: number }[];
  status: 'idle' | 'running' | 'completed';
  progress: number;
}

const strategies = [
  { id: 'ma_cross', name: 'Moving Average Crossover', description: 'Buy when fast MA crosses above slow MA' },
  { id: 'rsi_reversal', name: 'RSI Mean Reversion', description: 'Buy oversold, sell overbought' },
  { id: 'breakout', name: 'Price Breakout', description: 'Trade price breakouts from ranges' },
];

const timeframes = [
  { id: '1h', name: '1 Hour' },
  { id: '4h', name: '4 Hours' },
  { id: '1d', name: '1 Day' },
];

export function SimpleBacktestingWidget() {
  const { user } = useAuth();
  const [config, setConfig] = useState({
    symbol: 'BTCUSD',
    strategy: 'ma_cross',
    timeframe: '1d',
    initialBalance: 10000,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
  });
  
  const [result, setResult] = useState<SimpleBacktestResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  // Generate sample equity curve for demonstration
  const generateSampleResult = (): SimpleBacktestResult => {
    const equityCurve = [];
    let equity = config.initialBalance;
    
    for (let i = 0; i < 100; i++) {
      const change = (Math.random() - 0.45) * equity * 0.02; // Slight positive bias
      equity += change;
      equityCurve.push({
        date: new Date(2024, 0, 1 + i * 3).toISOString().split('T')[0],
        value: equity
      });
    }

    const finalReturn = ((equity - config.initialBalance) / config.initialBalance) * 100;
    const maxDrawdown = Math.random() * 15 + 5; // 5-20%
    const winRate = Math.random() * 30 + 55; // 55-85%
    const totalTrades = Math.floor(Math.random() * 50) + 20; // 20-70 trades
    const profitFactor = 1 + (finalReturn / 100) + Math.random() * 0.5; // Correlated with return

    return {
      totalReturn: finalReturn,
      winRate,
      maxDrawdown,
      totalTrades,
      profitFactor,
      equityCurve,
      status: 'completed',
      progress: 100
    };
  };

  const runBacktest = async () => {
    setIsRunning(true);
    setResult({ ...generateSampleResult(), status: 'running', progress: 0 });

    // Simulate progressive loading
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setResult(prev => prev ? { ...prev, progress: i } : null);
    }

    setResult(prev => prev ? { ...prev, status: 'completed' } : null);
    setIsRunning(false);
  };

  const resetBacktest = () => {
    setResult(null);
    setIsRunning(false);
  };

  const selectedStrategy = strategies.find(s => s.id === config.strategy);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Strategy Backtesting
        </CardTitle>
        <div className="flex gap-2">
          {!isRunning && (
            <Button 
              onClick={runBacktest} 
              size="sm" 
              className="bg-green-600 hover:bg-green-700"
              disabled={isRunning}
            >
              <Play className="h-3 w-3 mr-1" />
              Run
            </Button>
          )}
          <Button onClick={resetBacktest} size="sm" variant="outline">
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!result && (
          <div className="space-y-4">
            {/* Configuration */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Asset</Label>
                <Input
                  value={config.symbol}
                  onChange={(e) => setConfig({...config, symbol: e.target.value})}
                  className="h-8"
                  placeholder="BTCUSD"
                />
              </div>
              <div>
                <Label className="text-xs">Balance</Label>
                <Input
                  type="number"
                  value={config.initialBalance}
                  onChange={(e) => setConfig({...config, initialBalance: Number(e.target.value)})}
                  className="h-8"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs">Strategy</Label>
              <Select value={config.strategy} onValueChange={(value) => setConfig({...config, strategy: value})}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {strategies.map(strategy => (
                    <SelectItem key={strategy.id} value={strategy.id}>
                      {strategy.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedStrategy && (
                <p className="text-xs text-muted-foreground mt-1">{selectedStrategy.description}</p>
              )}
            </div>

            <div>
              <Label className="text-xs">Timeframe</Label>
              <Select value={config.timeframe} onValueChange={(value) => setConfig({...config, timeframe: value})}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeframes.map(tf => (
                    <SelectItem key={tf.id} value={tf.id}>
                      {tf.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Start Date</Label>
                <Input
                  type="date"
                  value={config.startDate}
                  onChange={(e) => setConfig({...config, startDate: e.target.value})}
                  className="h-8"
                />
              </div>
              <div>
                <Label className="text-xs">End Date</Label>
                <Input
                  type="date"
                  value={config.endDate}
                  onChange={(e) => setConfig({...config, endDate: e.target.value})}
                  className="h-8"
                />
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            {/* Progress */}
            {result.status === 'running' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Running Backtest...</span>
                  <span className="text-sm text-muted-foreground">{result.progress}%</span>
                </div>
                <Progress value={result.progress} className="h-2" />
              </div>
            )}

            {result.status === 'completed' && (
              <>
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="h-3 w-3" />
                      <span className="text-xs font-medium">Total Return</span>
                    </div>
                    <div className={`text-lg font-bold ${result.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {result.totalReturn >= 0 ? '+' : ''}{result.totalReturn.toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="h-3 w-3" />
                      <span className="text-xs font-medium">Win Rate</span>
                    </div>
                    <div className="text-lg font-bold">
                      {result.winRate.toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingDown className="h-3 w-3" />
                      <span className="text-xs font-medium">Max Drawdown</span>
                    </div>
                    <div className="text-lg font-bold text-red-600">
                      -{result.maxDrawdown.toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs font-medium">Total Trades</span>
                    </div>
                    <div className="text-lg font-bold">
                      {result.totalTrades}
                    </div>
                  </div>
                </div>

                {/* Equity Curve Chart */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Equity Curve</Label>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={result.equityCurve}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 10 }}
                          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
                        />
                        <YAxis 
                          tick={{ fontSize: 10 }}
                          tickFormatter={(value) => formatCurrency(value, user?.preferredCurrency || 'USD')}
                        />
                        <Tooltip 
                          formatter={(value: any) => [formatCurrency(value, user?.preferredCurrency || 'USD'), 'Equity']}
                          labelFormatter={(label) => new Date(label).toLocaleDateString()}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#3b82f6" 
                          strokeWidth={2} 
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}