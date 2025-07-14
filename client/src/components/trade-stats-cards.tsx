import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Percent, Scale, BarChart3 } from "lucide-react";

interface StatsCardsProps {
  stats?: {
    totalTrades: number;
    totalPnL: number;
    winRate: number;
    avgRiskReward: number;
    largestWin: number;
    largestLoss: number;
    maxDrawdown: number;
  };
}

export function TradeStatsCards({ stats }: StatsCardsProps) {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const cards = [
    {
      title: "Total P/L",
      value: formatCurrency(stats.totalPnL),
      change: stats.totalPnL >= 0 ? "positive" : "negative",
      icon: TrendingUp,
      color: stats.totalPnL >= 0 ? "text-emerald-500" : "text-red-500",
      bgColor: stats.totalPnL >= 0 ? "bg-emerald-500/20" : "bg-red-500/20",
    },
    {
      title: "Win Rate",
      value: `${stats.winRate.toFixed(1)}%`,
      change: `${stats.totalTrades} trades`,
      icon: Percent,
      color: "text-blue-500",
      bgColor: "bg-blue-500/20",
    },
    {
      title: "Avg Risk/Reward",
      value: stats.avgRiskReward > 0 ? `1:${stats.avgRiskReward.toFixed(1)}` : "N/A",
      change: stats.avgRiskReward > 1 ? "Above target" : "Below target",
      icon: Scale,
      color: "text-purple-500",
      bgColor: "bg-purple-500/20",
    },
    {
      title: "Total Trades",
      value: stats.totalTrades.toString(),
      change: "This period",
      icon: BarChart3,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <Card key={card.title} className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">{card.title}</p>
                <p className={`text-2xl font-bold ${card.color}`}>
                  {card.value}
                </p>
                <p className="text-sm text-muted-foreground">{card.change}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.bgColor}`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
