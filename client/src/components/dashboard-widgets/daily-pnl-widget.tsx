import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, TrendingDown, Info } from "lucide-react";
import { format, parseISO, startOfDay, isSameDay } from "date-fns";
import { formatCurrency } from "@/components/currency-selector";
import { useAuth } from "@/hooks/use-auth";
import type { Trade } from "@shared/schema";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts";

interface DailyPnLWidgetProps {
  trades?: Trade[];
}

export function DailyPnLWidget({ trades = [] }: DailyPnLWidgetProps) {
  const { user } = useAuth();
  const currency = user?.preferredCurrency || "USD";

  const dailyPnLData = useMemo(() => {
    if (!trades.length) return [];

    // Group trades by date and calculate daily P&L
    const dailyGroups = trades.reduce((acc, trade) => {
      if (!trade.pnl || !trade.isCompleted) return acc;
      
      const tradeDate = format(new Date(trade.tradeDate), "yyyy-MM-dd");
      if (!acc[tradeDate]) {
        acc[tradeDate] = {
          date: tradeDate,
          pnl: 0,
          trades: 0,
        };
      }
      
      acc[tradeDate].pnl += parseFloat(trade.pnl.toString());
      acc[tradeDate].trades += 1;
      
      return acc;
    }, {} as Record<string, { date: string; pnl: number; trades: number }>);

    // Convert to array and sort by date (last 30 days)
    return Object.values(dailyGroups)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 30)
      .reverse();
  }, [trades]);

  const totalDailyPnL = dailyPnLData.reduce((sum, day) => sum + day.pnl, 0);
  const profitableDays = dailyPnLData.filter(day => day.pnl > 0).length;
  const totalDays = dailyPnLData.length;
  const winRate = totalDays > 0 ? (profitableDays / totalDays) * 100 : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{format(new Date(label), "MMM dd, yyyy")}</p>
          <p className={`text-sm ${data.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            P&L: {formatCurrency(data.pnl, currency)}
          </p>
          <p className="text-xs text-muted-foreground">
            {data.trades} trade{data.trades !== 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!dailyPnLData.length) {
    return (
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Net Daily P&L
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-full min-h-[200px]">
          <div className="text-center text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No completed trades yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Net Daily P&L
          <Info className="h-3 w-3 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total P&L</p>
            <p className={`text-sm font-medium ${totalDailyPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalDailyPnL, currency)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Win Rate</p>
            <p className="text-sm font-medium">
              {winRate.toFixed(1)}%
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Days</p>
            <p className="text-sm font-medium">
              {profitableDays}/{totalDays}
            </p>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyPnLData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: 'currentColor' }}
                tickFormatter={(value) => format(new Date(value), "MM/dd")}
                interval="preserveStartEnd"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: 'currentColor' }}
                tickFormatter={(value) => `${formatCurrency(value, currency).replace(/[^-$€£¥₹₩]+/g, '')}${Math.abs(value) >= 1000 ? (Math.abs(value)/1000).toFixed(0)+'K' : Math.abs(value).toFixed(0)}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="pnl" radius={[2, 2, 0, 0]}>
                {dailyPnLData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.pnl >= 0 ? '#10b981' : '#ef4444'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Performance */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Recent Performance</p>
          <div className="flex flex-wrap gap-1">
            {dailyPnLData.slice(-7).map((day, index) => (
              <div
                key={day.date}
                className={`w-4 h-4 rounded-sm ${
                  day.pnl >= 0 ? 'bg-green-500' : 'bg-red-500'
                }`}
                title={`${format(new Date(day.date), "MMM dd")}: ${formatCurrency(day.pnl, currency)}`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}