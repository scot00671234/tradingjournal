import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, AlertTriangle, Shield } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import type { Trade } from "@shared/schema";

interface DrawdownWidgetProps {
  trades: Trade[];
  className?: string;
}

export function DrawdownWidget({ trades, className }: DrawdownWidgetProps) {
  // Calculate drawdown data (underwater equity curve)
  const startingBalance = 10000;
  let peak = startingBalance;
  
  const drawdownData = trades.map((trade, index) => {
    const cumulativePnL = trades.slice(0, index + 1).reduce((sum, t) => sum + parseFloat(t.pnl || '0'), 0);
    const currentEquity = startingBalance + cumulativePnL;
    
    // Update peak if we have a new high
    if (currentEquity > peak) {
      peak = currentEquity;
    }
    
    // Calculate drawdown percentage
    const drawdownPercent = ((peak - currentEquity) / peak) * 100;
    
    return {
      tradeNumber: index + 1,
      drawdown: -drawdownPercent, // Negative for visual representation
      drawdownDollar: peak - currentEquity,
      date: new Date(trade.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      asset: trade.asset,
      equity: currentEquity,
      peak: peak
    };
  });

  // Calculate key drawdown metrics
  const maxDrawdown = Math.max(...drawdownData.map(d => Math.abs(d.drawdown)));
  const currentDrawdown = drawdownData.length > 0 ? Math.abs(drawdownData[drawdownData.length - 1].drawdown) : 0;
  
  // Calculate recovery metrics
  const isInDrawdown = currentDrawdown > 0.1; // More than 0.1% drawdown
  const drawdownLevel = maxDrawdown < 5 ? 'low' : maxDrawdown < 15 ? 'moderate' : 'high';
  
  // Count days in drawdown (simplified - counting trades in drawdown)
  const tradesInDrawdown = drawdownData.filter(d => Math.abs(d.drawdown) > 0.1).length;

  return (
    <Card className={`bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg glass-transition hover:shadow-xl ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg font-semibold text-gray-900 dark:text-white">
          <div className="flex items-center">
            <TrendingDown className="w-5 h-5 mr-2 text-red-500" />
            Drawdown Analysis
          </div>
          <div className="flex items-center space-x-2">
            {drawdownLevel === 'low' && <Shield className="w-4 h-4 text-green-500" />}
            {drawdownLevel === 'moderate' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
            {drawdownLevel === 'high' && <AlertTriangle className="w-4 h-4 text-red-500" />}
            <span className={`text-sm font-medium ${
              drawdownLevel === 'low' ? 'text-green-600' : 
              drawdownLevel === 'moderate' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {drawdownLevel.toUpperCase()}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {maxDrawdown.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Max Drawdown
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
              {currentDrawdown.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Current DD
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {tradesInDrawdown}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Trades in DD
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={drawdownData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
            <XAxis 
              dataKey="tradeNumber" 
              stroke="#6b7280" 
              fontSize={12}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              stroke="#6b7280" 
              fontSize={12}
              axisLine={false}
              tickLine={false}
              domain={['dataMin', 1]}
              tickFormatter={(value) => `${value.toFixed(1)}%`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: number, name: string) => [
                `${Math.abs(value).toFixed(2)}%`, 
                'Drawdown'
              ]}
              labelFormatter={(label) => `Trade #${label}`}
            />
            <ReferenceLine 
              y={0} 
              stroke="#6b7280" 
              strokeDasharray="2 2" 
              opacity={0.5}
            />
            <ReferenceLine 
              y={-20} 
              stroke="#dc2626" 
              strokeDasharray="5 5" 
              opacity={0.7}
              label={{ value: "20% DD", position: "insideTopRight", fontSize: 11 }}
            />
            <Area 
              type="monotone" 
              dataKey="drawdown" 
              stroke="#dc2626" 
              fill="url(#drawdownGradient)"
              strokeWidth={2}
            />
            <defs>
              <linearGradient id="drawdownGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#dc2626" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>

        <div className="mt-4 flex justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${isInDrawdown ? 'text-red-600' : 'text-green-600'}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${isInDrawdown ? 'bg-red-500' : 'bg-green-500'}`} />
              {isInDrawdown ? 'In Drawdown' : 'At Peak'}
            </div>
          </div>
          <div className="text-gray-500 dark:text-gray-400">
            Target: Keep under 20%
          </div>
        </div>
      </CardContent>
    </Card>
  );
}