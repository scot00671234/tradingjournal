import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { invalidateAllTradeRelatedQueries } from "@/lib/cache-utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History, Search, Filter, Edit, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { format } from "date-fns";

export default function TradeHistoryPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: trades, isLoading } = useQuery({
    queryKey: ["/api/trades"],
    enabled: !!user,
  });

  const filteredTrades = trades?.filter((trade: any) => {
    const matchesSearch = trade.asset.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || trade.direction === filter;
    return matchesSearch && matchesFilter;
  }) || [];

  const deleteTradeMutation = useMutation({
    mutationFn: async (tradeId: number) => {
      const res = await apiRequest("DELETE", `/api/trades/${tradeId}`);
      return res;
    },
    onSuccess: () => {
      // Use centralized cache invalidation for data sync
      invalidateAllTradeRelatedQueries(queryClient);
      toast({
        title: "Trade Deleted",
        description: "Trade has been successfully removed from your journal.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDeleteTrade = (tradeId: number) => {
    if (window.confirm("Are you sure you want to delete this trade?")) {
      deleteTradeMutation.mutate(tradeId);
    }
  };

  const handleEditTrade = (tradeId: number) => {
    // For now, just show a toast - can be enhanced later
    toast({
      title: "Edit Trade",
      description: "Edit functionality will be available soon.",
    });
  };

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center space-x-2">
                <History className="w-8 h-8" />
                <span>Trade History</span>
              </h1>
              <p className="text-muted-foreground">Review and manage your trading activity</p>
            </div>
            <Badge variant="outline" className="text-sm">
              {filteredTrades.length} trades
            </Badge>
          </div>

          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by asset..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Trades</SelectItem>
                <SelectItem value="long">Long Only</SelectItem>
                <SelectItem value="short">Short Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Trading Activity</CardTitle>
              <CardDescription>
                Complete history of your trades with performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredTrades.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {search || filter !== "all" ? "No trades match your filters" : "No trades recorded yet"}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Asset</TableHead>
                        <TableHead>Direction</TableHead>
                        <TableHead>Entry</TableHead>
                        <TableHead>Exit</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>P&L</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTrades.map((trade: any) => (
                        <TableRow key={trade.id}>
                          <TableCell className="font-medium">
                            {format(new Date(trade.createdAt), "MMM dd, yyyy")}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{trade.asset}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {trade.direction === "long" ? (
                                <TrendingUp className="w-4 h-4 text-green-500" />
                              ) : (
                                <TrendingDown className="w-4 h-4 text-red-500" />
                              )}
                              <span className="capitalize">{trade.direction}</span>
                            </div>
                          </TableCell>
                          <TableCell>${trade.entryPrice}</TableCell>
                          <TableCell>${trade.exitPrice}</TableCell>
                          <TableCell>{trade.quantity}</TableCell>
                          <TableCell>
                            <span className={`font-semibold ${
                              trade.pnl >= 0 ? "text-green-600" : "text-red-600"
                            }`}>
                              ${trade.pnl}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-32 truncate text-sm text-muted-foreground">
                              {trade.notes || "No notes"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditTrade(trade.id)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteTrade(trade.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}