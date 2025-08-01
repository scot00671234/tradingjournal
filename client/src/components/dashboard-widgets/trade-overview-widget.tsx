import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, Download, Filter, X, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Trade, User } from "@shared/schema";

interface TradeOverviewWidgetProps {
  trades: Trade[];
  user: User;
  isCustomizing?: boolean;
  onDelete?: () => void;
}

interface FilterState {
  instrument: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  tags: string[];
  searchTerm: string;
}

export function TradeOverviewWidget({ trades, user, isCustomizing, onDelete }: TradeOverviewWidgetProps) {
  const [filters, setFilters] = useState<FilterState>({
    instrument: "",
    dateFrom: undefined,
    dateTo: undefined,
    tags: [],
    searchTerm: ""
  });

  const [showInstrumentSearch, setShowInstrumentSearch] = useState(false);

  // Get unique instruments and tags from trades
  const { instruments, allTags } = useMemo(() => {
    const instrumentSet = new Set<string>();
    const tagSet = new Set<string>();
    
    trades.forEach(trade => {
      if (trade.asset && trade.asset.trim()) {
        instrumentSet.add(trade.asset.trim());
      }
      if (trade.tags && trade.tags.trim()) {
        try {
          const tradeTags = JSON.parse(trade.tags);
          if (Array.isArray(tradeTags)) {
            tradeTags.forEach(tag => {
              if (tag && typeof tag === 'string' && tag.trim()) {
                tagSet.add(tag.trim());
              }
            });
          }
        } catch (e) {
          // Handle non-JSON tags
          if (trade.tags.trim()) {
            tagSet.add(trade.tags.trim());
          }
        }
      }
    });
    
    return {
      instruments: Array.from(instrumentSet).filter(Boolean).sort(),
      allTags: Array.from(tagSet).filter(Boolean).sort()
    };
  }, [trades]);

  // Filter trades based on current filters
  const filteredTrades = useMemo(() => {
    return trades.filter(trade => {
      // Instrument filter
      if (filters.instrument && trade.asset !== filters.instrument) {
        return false;
      }

      // Date range filter
      const tradeDate = new Date(trade.tradeDate);
      if (filters.dateFrom && tradeDate < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo && tradeDate > filters.dateTo) {
        return false;
      }

      // Tags filter
      if (filters.tags.length > 0) {
        let tradeTags: string[] = [];
        if (trade.tags) {
          try {
            tradeTags = JSON.parse(trade.tags);
            if (!Array.isArray(tradeTags)) {
              tradeTags = [trade.tags];
            }
          } catch (e) {
            tradeTags = trade.tags ? [trade.tags] : [];
          }
        }
        
        const hasMatchingTag = filters.tags.some(filterTag => 
          tradeTags.some(tradeTag => 
            tradeTag.toLowerCase().includes(filterTag.toLowerCase())
          )
        );
        
        if (!hasMatchingTag) return false;
      }

      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          trade.asset.toLowerCase().includes(searchLower) ||
          trade.direction.toLowerCase().includes(searchLower) ||
          (trade.notes && trade.notes.toLowerCase().includes(searchLower)) ||
          (trade.tags && trade.tags.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [trades, filters]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const completedTrades = filteredTrades.filter(trade => trade.isCompleted && trade.pnl !== null);
    const totalPnL = completedTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const winningTrades = completedTrades.filter(trade => (trade.pnl || 0) > 0);
    const winRate = completedTrades.length > 0 ? (winningTrades.length / completedTrades.length) * 100 : 0;
    const avgWin = winningTrades.length > 0 ? winningTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0) / winningTrades.length : 0;
    const losingTrades = completedTrades.filter(trade => (trade.pnl || 0) < 0);
    const avgLoss = losingTrades.length > 0 ? Math.abs(losingTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0) / losingTrades.length) : 0;
    const profitFactor = avgLoss > 0 ? avgWin / avgLoss : avgWin > 0 ? Infinity : 0;

    return {
      totalTrades: filteredTrades.length,
      completedTrades: completedTrades.length,
      totalPnL,
      winRate,
      avgWin,
      avgLoss,
      profitFactor
    };
  }, [filteredTrades]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: user.preferredCurrency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const clearFilters = () => {
    setFilters({
      instrument: "",
      dateFrom: undefined,
      dateTo: undefined,
      tags: [],
      searchTerm: ""
    });
  };

  const addTagFilter = (tag: string) => {
    if (!filters.tags.includes(tag)) {
      setFilters(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTagFilter = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const generatePDF = async () => {
    try {
      // Create a simple PDF export using window.print() with custom styles
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      const filtersApplied = [
        filters.instrument && `Instrument: ${filters.instrument}`,
        filters.dateFrom && `From: ${format(filters.dateFrom, 'PPP')}`,
        filters.dateTo && `To: ${format(filters.dateTo, 'PPP')}`,
        filters.tags.length > 0 && `Tags: ${filters.tags.join(', ')}`,
        filters.searchTerm && `Search: ${filters.searchTerm}`
      ].filter(Boolean).join(' | ');

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>CoinFeedly Trade Overview Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px; }
            .filters { margin-bottom: 20px; font-size: 14px; color: #666; }
            .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
            .stat-card { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
            .stat-value { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
            .stat-label { font-size: 14px; color: #666; }
            .positive { color: #059669; }
            .negative { color: #dc2626; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>CoinFeedly Trade Overview Report</h1>
            <p>Generated on ${format(new Date(), 'PPP')}</p>
            ${filtersApplied ? `<p class="filters">Filters Applied: ${filtersApplied}</p>` : ''}
          </div>
          
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">${summaryStats.totalTrades}</div>
              <div class="stat-label">Total Trades</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${summaryStats.completedTrades}</div>
              <div class="stat-label">Completed Trades</div>
            </div>
            <div class="stat-card">
              <div class="stat-value ${summaryStats.totalPnL >= 0 ? 'positive' : 'negative'}">${formatCurrency(summaryStats.totalPnL)}</div>
              <div class="stat-label">Total P&L</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${summaryStats.winRate.toFixed(1)}%</div>
              <div class="stat-label">Win Rate</div>
            </div>
            <div class="stat-card">
              <div class="stat-value positive">${formatCurrency(summaryStats.avgWin)}</div>
              <div class="stat-label">Average Win</div>
            </div>
            <div class="stat-card">
              <div class="stat-value negative">${formatCurrency(summaryStats.avgLoss)}</div>
              <div class="stat-label">Average Loss</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${summaryStats.profitFactor === Infinity ? '∞' : summaryStats.profitFactor.toFixed(2)}</div>
              <div class="stat-label">Profit Factor</div>
            </div>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const filteredInstruments = instruments.filter(instrument =>
    instrument.toLowerCase().includes(filters.searchTerm.toLowerCase())
  );

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-amber-500" />
            <CardTitle className="text-lg">Trade Overview</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {isCustomizing && (
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.();
                }}
                className="opacity-70 hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={generatePDF}
              className="flex items-center gap-1"
              disabled={filteredTrades.length === 0}
            >
              <Download className="w-4 h-4" />
              PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Filter Controls */}
        <div className="space-y-3">
          {/* Search and Instrument Filter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search trades..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Instrument</Label>
              <Select value={filters.instrument || "all"} onValueChange={(value) => setFilters(prev => ({ ...prev, instrument: value === "all" ? "" : value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All instruments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All instruments</SelectItem>
                  {instruments.map(instrument => (
                    <SelectItem key={instrument} value={instrument}>
                      {instrument}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Range Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateFrom ? format(filters.dateFrom, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dateFrom}
                    onSelect={(date) => setFilters(prev => ({ ...prev, dateFrom: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateTo ? format(filters.dateTo, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dateTo}
                    onSelect={(date) => setFilters(prev => ({ ...prev, dateTo: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Strategy Tags */}
          <div className="space-y-2">
            <Label>Strategy Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {filters.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-500" 
                    onClick={() => removeTagFilter(tag)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {allTags.filter(tag => !filters.tags.includes(tag)).map(tag => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => addTagFilter(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {(filters.instrument || filters.dateFrom || filters.dateTo || filters.tags.length > 0 || filters.searchTerm) && (
            <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
              Clear All Filters
            </Button>
          )}
        </div>

        <Separator />

        {/* Summary Stats */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground">SUMMARY STATISTICS</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{summaryStats.totalTrades}</div>
              <div className="text-xs text-muted-foreground">Total Trades</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{summaryStats.completedTrades}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className={cn("text-2xl font-bold", summaryStats.totalPnL >= 0 ? "text-green-600" : "text-red-600")}>
                {formatCurrency(summaryStats.totalPnL)}
              </div>
              <div className="text-xs text-muted-foreground">Total P&L</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{summaryStats.winRate.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Win Rate</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{formatCurrency(summaryStats.avgWin)}</div>
              <div className="text-xs text-muted-foreground">Avg Win</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">{formatCurrency(summaryStats.avgLoss)}</div>
              <div className="text-xs text-muted-foreground">Avg Loss</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">
                {summaryStats.profitFactor === Infinity ? '∞' : summaryStats.profitFactor.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">Profit Factor</div>
            </div>
          </div>
        </div>

        {filteredTrades.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            No trades match the current filters
          </div>
        )}
      </CardContent>
    </Card>
  );
}