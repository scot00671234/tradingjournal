import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { List, TrendingUp, TrendingDown } from "lucide-react";
import type { Trade } from "@shared/schema";

interface TradeListWidgetProps {
  trades: Trade[];
  className?: string;
}

export function TradeListWidget({ trades, className }: TradeListWidgetProps) {
  // Sort trades by most recent first
  const sortedTrades = [...trades].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <Card className={`bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg glass-transition hover:shadow-xl ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg font-semibold text-gray-900 dark:text-white">
          <div className="flex items-center">
            <List className="w-5 h-5 mr-2 text-gray-500" />
            Recent Trades
          </div>
          <Badge variant="outline" className="text-xs">
            {trades.length} total
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <div className="space-y-1 p-6 pt-0">
            {sortedTrades.length > 0 ? (
              sortedTrades.slice(0, 10).map((trade, index) => (
                <div 
                  key={trade.id} 
                  className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg border border-gray-200/30 dark:border-gray-700/30 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      trade.direction === 'long' 
                        ? 'bg-green-500/20 text-green-600' 
                        : 'bg-red-500/20 text-red-600'
                    }`}>
                      {trade.direction === 'long' ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white text-sm">
                        {trade.asset}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(trade.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`font-semibold text-sm ${
                      parseFloat(trade.pnl || '0') >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {parseFloat(trade.pnl || '0') >= 0 ? '+' : ''}${trade.pnl || '0.00'}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {trade.size} shares
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <List className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-sm">No trades yet</p>
                <p className="text-xs mt-1">Start by adding your first trade</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}