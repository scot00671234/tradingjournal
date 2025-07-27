import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import type { Trade } from "@shared/schema";

interface EquityCurveWidgetProps {
  trades: Trade[];
  className?: string;
}

export function EquityCurveWidget({ trades, className }: EquityCurveWidgetProps) {
  // Calculate equity curve data
  const equityData = trades.map((trade, index) => {
    const cumulativePnL = trades.slice(0, index + 1).reduce((sum, t) => sum + parseFloat(t.pnl || '0'), 0);
    const startingBalance = 10000; // Starting balance - could be configurable
    
    return {
      tradeNumber: index + 1,
      equity: startingBalance + cumulativePnL,
      pnl: parseFloat(trade.pnl || '0'),
      date: new Date(trade.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      asset: trade.asset,
      direction: trade.direction
    };
  });

  // Calculate key metrics
  const currentEquity = equityData.length > 0 ? equityData[equityData.length - 1].equity : 10000;
  const totalReturn = ((currentEquity - 10000) / 10000) * 100;
  const isPositive = totalReturn >= 0;

  // Find peaks for drawdown calculation
  let peak = 10000;
  let maxDrawdown = 0;
  
  equityData.forEach(point => {
    if (point.equity > peak) {
      peak = point.equity;
    }
    const drawdown = ((peak - point.equity) / peak) * 100;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  });

  return (
    <Card className={`bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg glass-transition hover:shadow-xl ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg font-semibold text-gray-900 dark:text-white">
          <div className="flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-500" />
            Equity Curve
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {isPositive ? '+' : ''}{totalReturn.toFixed(2)}%
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              ${currentEquity.toLocaleString()}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={equityData}>
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
              domain={['dataMin - 500', 'dataMax + 500']}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: number, name: string) => [
                `$${value.toLocaleString()}`, 
                'Account Value'
              ]}
              labelFormatter={(label) => `Trade #${label}`}
            />
            <ReferenceLine 
              y={10000} 
              stroke="#6b7280" 
              strokeDasharray="5 5" 
              opacity={0.5}
              label={{ value: "Break Even", position: "insideTopRight", fontSize: 11 }}
            />
            <Line 
              type="monotone" 
              dataKey="equity" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#3b82f6' }}
            />
          </LineChart>
        </ResponsiveContainer>
        
        <div className="mt-4 flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <div>
            <span className="font-medium">Max Drawdown:</span> {maxDrawdown.toFixed(2)}%
          </div>
          <div>
            <span className="font-medium">Total Trades:</span> {trades.length}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}