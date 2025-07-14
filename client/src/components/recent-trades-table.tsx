import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Filter, Download } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { invalidateAllTradeRelatedQueries } from "@/lib/cache-utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface RecentTradesTableProps {
  trades?: any[];
}

export function RecentTradesTable({ trades }: RecentTradesTableProps) {
  const { toast } = useToast();
  const [selectedTrade, setSelectedTrade] = useState<number | null>(null);

  const deleteTradeMutation = useMutation({
    mutationFn: async (tradeId: number) => {
      await apiRequest("DELETE", `/api/trades/${tradeId}`);
    },
    onSuccess: () => {
      // Use centralized cache invalidation for data sync
      invalidateAllTradeRelatedQueries(queryClient);
      toast({
        title: "Trade deleted",
        description: "The trade has been removed from your journal.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting trade",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const exportTrades = () => {
    if (!trades || trades.length === 0) {
      toast({
        title: "No trades to export",
        description: "Add some trades to your journal first.",
        variant: "destructive",
      });
      return;
    }

    const csvContent = [
      ["Asset", "Direction", "Entry Price", "Exit Price", "Size", "P/L", "Date", "Notes"],
      ...trades.map(trade => [
        trade.asset,
        trade.direction,
        trade.entryPrice,
        trade.exitPrice || "",
        trade.size,
        trade.pnl || "",
        new Date(trade.tradeDate).toLocaleDateString(),
        trade.notes || ""
      ])
    ];

    const csvString = csvContent.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "trades.csv";
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: "Your trades have been exported to CSV.",
    });
  };

  const formatCurrency = (value: string | number) => {
    const num = parseFloat(value?.toString() || "0");
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num);
  };

  if (!trades) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-4"></div>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">
            Recent Trades
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" onClick={exportTrades}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {trades.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No trades recorded yet.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Use the form above to add your first trade.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Direction</TableHead>
                  <TableHead>Entry</TableHead>
                  <TableHead>Exit</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>P/L</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trades.slice(0, 10).map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell className="font-medium">{trade.asset}</TableCell>
                    <TableCell>
                      <Badge variant={trade.direction === 'long' ? 'default' : 'secondary'}>
                        {trade.direction.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(trade.entryPrice)}</TableCell>
                    <TableCell>
                      {trade.exitPrice ? formatCurrency(trade.exitPrice) : "-"}
                    </TableCell>
                    <TableCell>{trade.size}</TableCell>
                    <TableCell>
                      {trade.pnl ? (
                        <span className={
                          parseFloat(trade.pnl) >= 0 ? 'text-emerald-500' : 'text-red-500'
                        }>
                          {parseFloat(trade.pnl) >= 0 ? '+' : ''}{formatCurrency(trade.pnl)}
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(trade.tradeDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Trade</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this trade? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteTradeMutation.mutate(trade.id)}
                                disabled={deleteTradeMutation.isPending}
                              >
                                {deleteTradeMutation.isPending ? "Deleting..." : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {trades.length > 10 && (
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-muted-foreground">
                  Showing 10 of {trades.length} trades
                </span>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Previous</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
