import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, TrendingUp, TrendingDown, Clock, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@/components/currency-selector";
import { useAuth } from "@/hooks/use-auth";
import type { Trade } from "@shared/schema";

interface TradeListWidgetProps {
  trades: Trade[];
  className?: string;
}

export function TradeListWidget({ trades, className }: TradeListWidgetProps) {
  const { user } = useAuth();
  const currency = user?.preferredCurrency || "USD";
  const [activeTab, setActiveTab] = useState("recent");

  // Separate open and closed trades
  const openTrades = trades.filter(trade => !trade.isCompleted);
  const closedTrades = trades.filter(trade => trade.isCompleted);
  
  // Sort trades by most recent first
  const sortedRecentTrades = [...closedTrades].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  const sortedOpenTrades = [...openTrades].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <Card className={`h-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg glass-transition hover:shadow-xl ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-lg font-semibold text-gray-900 dark:text-white">
          <div className="flex items-center">
            <List className="w-5 h-5 mr-2 text-gray-500" />
            Trades
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">
              {openTrades.length} open
            </Badge>
            <Badge variant="outline" className="text-xs">
              {closedTrades.length} closed
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mx-6 mb-3">
            <TabsTrigger value="open" className="text-xs">
              Open Positions
            </TabsTrigger>
            <TabsTrigger value="recent" className="text-xs">
              Recent Trades
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="open" className="m-0">
            <ScrollArea className="h-[320px]">
              <div className="space-y-1 px-6 py-0">
                {sortedOpenTrades.length > 0 ? (
                  sortedOpenTrades.slice(0, 10).map((trade) => (
                    <TradeItem key={trade.id} trade={trade} currency={currency} isOpen={true} />
                  ))
                ) : (
                  <div className="flex items-center justify-center h-40 text-center">
                    <div className="text-muted-foreground">
                      <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No open positions</p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="recent" className="m-0">
            <ScrollArea className="h-[320px]">
              <div className="space-y-1 px-6 py-0">
                {sortedRecentTrades.length > 0 ? (
                  sortedRecentTrades.slice(0, 10).map((trade) => (
                    <TradeItem key={trade.id} trade={trade} currency={currency} isOpen={false} />
                  ))
                ) : (
                  <div className="flex items-center justify-center h-40 text-center">
                    <div className="text-muted-foreground">
                      <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No completed trades</p>
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

interface TradeItemProps {
  trade: Trade;
  currency: string;
  isOpen: boolean;
}

function TradeItem({ trade, currency, isOpen }: TradeItemProps) {
  const currentPnL = isOpen ? 
    (trade.entryPrice && trade.exitPrice ? 
      (trade.direction === 'long' ? 
        (parseFloat(trade.exitPrice) - parseFloat(trade.entryPrice)) * trade.size :
        (parseFloat(trade.entryPrice) - parseFloat(trade.exitPrice)) * trade.size
      ) : 0
    ) : parseFloat(trade.pnl || '0');

  return (
    <div className="flex items-center justify-between p-2.5 mx-1 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg border border-gray-200/30 dark:border-gray-700/30 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors">
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
            {isOpen ? `Opened ${format(new Date(trade.tradeDate), "MM/dd/yyyy")}` : 
             format(new Date(trade.createdAt), "MM/dd/yyyy")}
          </div>
        </div>
      </div>
      
      <div className="text-right">
        {isOpen ? (
          <>
            <div className={`font-semibold text-sm ${
              currentPnL >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {currentPnL >= 0 ? '+' : ''}{formatCurrency(currentPnL, currency)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              @ {formatCurrency(parseFloat(trade.entryPrice || '0'), currency)}
            </div>
          </>
        ) : (
          <>
            <div className={`font-semibold text-sm ${
              currentPnL >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {currentPnL >= 0 ? '+' : ''}{formatCurrency(currentPnL, currency)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {trade.size} shares
            </div>
          </>
        )}
      </div>
    </div>
  );
}