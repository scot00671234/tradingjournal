import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Target, TrendingUp, BarChart3 } from "lucide-react";
import type { Trade } from "@shared/schema";

interface PerformanceMetricsWidgetProps {
  trades: Trade[];
  className?: string;
}

export function PerformanceMetricsWidget({ trades, className }: PerformanceMetricsWidgetProps) {
  // Calculate key trading metrics
  const totalTrades = trades.length;
  const winningTrades = trades.filter(t => parseFloat(t.pnl || '0') > 0);
  const losingTrades = trades.filter(t => parseFloat(t.pnl || '0') < 0);
  
  const winRate = totalTrades > 0 ? (winningTrades.length / totalTrades) * 100 : 0;
  
  const totalWins = winningTrades.reduce((sum, t) => sum + parseFloat(t.pnl || '0'), 0);
  const totalLosses = Math.abs(losingTrades.reduce((sum, t) => sum + parseFloat(t.pnl || '0'), 0));
  
  const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? 999 : 0;
  
  const avgWin = winningTrades.length > 0 ? totalWins / winningTrades.length : 0;
  const avgLoss = losingTrades.length > 0 ? totalLosses / losingTrades.length : 0;
  
  const riskRewardRatio = avgLoss > 0 ? avgWin / avgLoss : avgWin > 0 ? 999 : 0;
  
  const expectancy = totalTrades > 0 ? 
    (winRate / 100) * avgWin - ((100 - winRate) / 100) * avgLoss : 0;

  // Performance rating
  const getPerformanceRating = () => {
    if (profitFactor >= 2.5 && winRate >= 60) return { rating: 'Excellent', color: 'text-green-600' };
    if (profitFactor >= 1.5 && winRate >= 50) return { rating: 'Good', color: 'text-blue-600' };
    if (profitFactor >= 1.0) return { rating: 'Average', color: 'text-yellow-600' };
    return { rating: 'Poor', color: 'text-red-600' };
  };

  const performance = getPerformanceRating();

  const metrics = [
    {
      label: 'Win Rate',
      value: `${winRate.toFixed(1)}%`,
      icon: Target,
      color: winRate >= 50 ? 'text-green-600' : 'text-red-600',
      bgColor: winRate >= 50 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'
    },
    {
      label: 'Profit Factor',
      value: profitFactor === 999 ? '∞' : profitFactor.toFixed(2),
      icon: TrendingUp,
      color: profitFactor >= 1.5 ? 'text-green-600' : profitFactor >= 1.0 ? 'text-yellow-600' : 'text-red-600',
      bgColor: profitFactor >= 1.5 ? 'bg-green-50 dark:bg-green-900/20' : profitFactor >= 1.0 ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-red-50 dark:bg-red-900/20'
    },
    {
      label: 'Risk:Reward',
      value: `1:${riskRewardRatio === 999 ? '∞' : riskRewardRatio.toFixed(1)}`,
      icon: BarChart3,
      color: riskRewardRatio >= 2 ? 'text-green-600' : riskRewardRatio >= 1 ? 'text-yellow-600' : 'text-red-600',
      bgColor: riskRewardRatio >= 2 ? 'bg-green-50 dark:bg-green-900/20' : riskRewardRatio >= 1 ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-red-50 dark:bg-red-900/20'
    },
    {
      label: 'Expectancy',
      value: `$${expectancy.toFixed(2)}`,
      icon: Award,
      color: expectancy > 0 ? 'text-green-600' : 'text-red-600',
      bgColor: expectancy > 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'
    }
  ];

  return (
    <Card className={`h-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg glass-transition hover:shadow-xl ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg font-semibold text-gray-900 dark:text-white">
          <div className="flex items-center">
            <Award className="w-5 h-5 mr-2 text-purple-500" />
            Performance Metrics
          </div>
          <div className={`text-sm font-medium ${performance.color}`}>
            {performance.rating}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className={`p-4 rounded-lg ${metric.bgColor} border border-gray-200/30 dark:border-gray-700/30`}>
                <div className="flex items-center mb-3">
                  <Icon className={`w-5 h-5 ${metric.color} mr-2`} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {metric.label}
                  </span>
                </div>
                <div className={`text-2xl font-bold ${metric.color}`}>
                  {metric.value}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Trading Summary</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Last {totalTrades} trades</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-green-600">{winningTrades.length}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Wins</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-red-600">{losingTrades.length}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Losses</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                {trades.filter(t => parseFloat(t.pnl || '0') === 0).length}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Breakeven</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}