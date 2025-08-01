import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar, Download, Filter, X, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { cn } from "@/lib/utils";
import type { Trade } from "@shared/schema";

interface TradeOverviewWidgetProps {
  onDelete?: () => void;
  showDeleteButton?: boolean;
}

interface FilterState {
  instrument: string;
  startDate: Date | null;
  endDate: Date | null;
  tags: string[];
  searchTerm: string;
}

interface SummaryStats {
  totalPnL: number;
  winRate: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  avgWin: number;
  avgLoss: number;
  largestWin: number;
  largestLoss: number;
  profitFactor: number;
}

export function TradeOverviewWidget({ onDelete, showDeleteButton }: TradeOverviewWidgetProps) {
  const queryClient = useQueryClient();
  
  const [filters, setFilters] = useState<FilterState>({
    instrument: "all",
    startDate: startOfMonth(subMonths(new Date(), 2)),
    endDate: endOfMonth(new Date()),
    tags: [],
    searchTerm: ""
  });

  const [showFilters, setShowFilters] = useState(false);
  const [tagInput, setTagInput] = useState("");

  // Fetch all trades
  const { data: trades = [], isLoading } = useQuery<Trade[]>({
    queryKey: ['/api/trades']
  });

  // Get unique instruments and tags for filter options
  const { instruments, allTags } = useMemo(() => {
    const instrumentSet = new Set<string>();
    const tagSet = new Set<string>();
    
    trades.forEach(trade => {
      instrumentSet.add(trade.asset);
      if (trade.tags) {
        try {
          const tradeTags = JSON.parse(trade.tags);
          if (Array.isArray(tradeTags)) {
            tradeTags.forEach(tag => tagSet.add(tag));
          }
        } catch {
          // Handle legacy string tags
          trade.tags.split(',').forEach(tag => tagSet.add(tag.trim()));
        }
      }
    });

    return {
      instruments: Array.from(instrumentSet).sort(),
      allTags: Array.from(tagSet).sort()
    };
  }, [trades]);

  // Filter trades based on current filters
  const filteredTrades = useMemo(() => {
    return trades.filter(trade => {
      // Instrument filter
      if (filters.instrument !== "all" && trade.asset !== filters.instrument) {
        return false;
      }

      // Date range filter
      const tradeDate = new Date(trade.tradeDate);
      if (filters.startDate && tradeDate < filters.startDate) return false;
      if (filters.endDate && tradeDate > filters.endDate) return false;

      // Tags filter
      if (filters.tags.length > 0) {
        let tradeTags: string[] = [];
        if (trade.tags) {
          try {
            const parsed = JSON.parse(trade.tags);
            tradeTags = Array.isArray(parsed) ? parsed : [];
          } catch {
            tradeTags = trade.tags.split(',').map(tag => tag.trim());
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
        const matchesAsset = trade.asset.toLowerCase().includes(searchLower);
        const matchesNotes = trade.notes?.toLowerCase().includes(searchLower);
        const matchesDirection = trade.direction.toLowerCase().includes(searchLower);
        
        if (!matchesAsset && !matchesNotes && !matchesDirection) return false;
      }

      return true;
    });
  }, [trades, filters]);

  // Calculate summary statistics
  const summaryStats = useMemo((): SummaryStats => {
    const completedTrades = filteredTrades.filter(trade => trade.isCompleted && trade.pnl !== null);
    
    if (completedTrades.length === 0) {
      return {
        totalPnL: 0,
        winRate: 0,
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        avgWin: 0,
        avgLoss: 0,
        largestWin: 0,
        largestLoss: 0,
        profitFactor: 0
      };
    }

    const winningTrades = completedTrades.filter(trade => (trade.pnl || 0) > 0);
    const losingTrades = completedTrades.filter(trade => (trade.pnl || 0) < 0);
    
    const totalPnL = completedTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const winRate = (winningTrades.length / completedTrades.length) * 100;
    
    const totalWins = winningTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const totalLosses = Math.abs(losingTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0));
    
    const avgWin = winningTrades.length > 0 ? totalWins / winningTrades.length : 0;
    const avgLoss = losingTrades.length > 0 ? totalLosses / losingTrades.length : 0;
    
    const largestWin = winningTrades.length > 0 ? Math.max(...winningTrades.map(t => t.pnl || 0)) : 0;
    const largestLoss = losingTrades.length > 0 ? Math.min(...losingTrades.map(t => t.pnl || 0)) : 0;
    
    const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? 999 : 0;

    return {
      totalPnL,
      winRate,
      totalTrades: completedTrades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      avgWin,
      avgLoss,
      largestWin,
      largestLoss,
      profitFactor
    };
  }, [filteredTrades]);

  const handleAddTag = (tag: string) => {
    if (tag && !filters.tags.includes(tag)) {
      setFilters(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      instrument: "all",
      startDate: startOfMonth(subMonths(new Date(), 2)),
      endDate: endOfMonth(new Date()),
      tags: [],
      searchTerm: ""
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const exportToPDF = async () => {
    // Create a comprehensive PDF export
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>CoinFeedly - Trade Overview Report</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 20px; color: #333; }
            .header { border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { margin: 0; color: #1f2937; font-size: 28px; }
            .header .subtitle { color: #6b7280; margin: 5px 0; }
            .filters-section { background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
            .filters-section h3 { margin-top: 0; color: #374151; }
            .filter-item { margin: 8px 0; }
            .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
            .stat-card { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; text-align: center; }
            .stat-value { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
            .stat-label { color: #6b7280; font-size: 14px; }
            .positive { color: #059669; }
            .negative { color: #dc2626; }
            .neutral { color: #6b7280; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>CoinFeedly Trade Overview Report</h1>
            <div class="subtitle">Generated on ${new Date().toLocaleString()}</div>
          </div>
          
          <div class="filters-section">
            <h3>Applied Filters</h3>
            <div class="filter-item"><strong>Instrument:</strong> ${filters.instrument === 'all' ? 'All Instruments' : filters.instrument}</div>
            <div class="filter-item"><strong>Date Range:</strong> ${filters.startDate ? format(filters.startDate, 'MMM dd, yyyy') : 'No start date'} - ${filters.endDate ? format(filters.endDate, 'MMM dd, yyyy') : 'No end date'}</div>
            <div class="filter-item"><strong>Tags:</strong> ${filters.tags.length > 0 ? filters.tags.join(', ') : 'None'}</div>
            <div class="filter-item"><strong>Search Term:</strong> ${filters.searchTerm || 'None'}</div>
          </div>

          <h3>Summary Statistics</h3>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value ${summaryStats.totalPnL >= 0 ? 'positive' : 'negative'}">${formatCurrency(summaryStats.totalPnL)}</div>
              <div class="stat-label">Total P&L</div>
            </div>
            <div class="stat-card">
              <div class="stat-value neutral">${summaryStats.winRate.toFixed(1)}%</div>
              <div class="stat-label">Win Rate</div>
            </div>
            <div class="stat-card">
              <div class="stat-value neutral">${summaryStats.totalTrades}</div>
              <div class="stat-label">Total Trades</div>
            </div>
            <div class="stat-card">
              <div class="stat-value positive">${formatCurrency(summaryStats.avgWin)}</div>
              <div class="stat-label">Avg Win</div>
            </div>
            <div class="stat-card">
              <div class="stat-value negative">${formatCurrency(Math.abs(summaryStats.avgLoss))}</div>
              <div class="stat-label">Avg Loss</div>
            </div>
            <div class="stat-card">
              <div class="stat-value neutral">${summaryStats.profitFactor.toFixed(2)}</div>
              <div class="stat-label">Profit Factor</div>
            </div>
          </div>

          <div class="footer">
            <p>CoinFeedly Trading Journal - Professional Trading Analysis</p>
            <p>This report contains ${filteredTrades.length} filtered trades out of ${trades.length} total trades.</p>
          </div>
        </body>
      </html>
    `;

    // Open print dialog
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Trade Overview
            {showDeleteButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48">
            <div className="text-gray-500">Loading trades...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            Trade Overview
            <Badge variant="secondary">{filteredTrades.length} trades</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportToPDF}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              PDF
            </Button>
            {showDeleteButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filter Controls */}
        {showFilters && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filters</h4>
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Instrument Filter */}
              <div>
                <Label htmlFor="instrument">Instrument</Label>
                <Select value={filters.instrument} onValueChange={(value) => setFilters(prev => ({ ...prev, instrument: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select instrument" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Instruments</SelectItem>
                    {instruments.map(instrument => (
                      <SelectItem key={instrument} value={instrument}>{instrument}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search */}
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search trades..."
                    value={filters.searchTerm}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Date Range */}
              <div>
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />
                      {filters.startDate ? format(filters.startDate, "MMM dd, yyyy") : "Select start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={filters.startDate || undefined}
                      onSelect={(date) => setFilters(prev => ({ ...prev, startDate: date || null }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />
                      {filters.endDate ? format(filters.endDate, "MMM dd, yyyy") : "Select end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={filters.endDate || undefined}
                      onSelect={(date) => setFilters(prev => ({ ...prev, endDate: date || null }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Tags Filter */}
            <div>
              <Label htmlFor="tags">Strategy Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {filters.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddTag(tagInput);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleAddTag(tagInput)}
                  disabled={!tagInput}
                >
                  Add
                </Button>
              </div>
              {allTags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {allTags.filter(tag => !filters.tags.includes(tag)).slice(0, 10).map(tag => (
                    <Button
                      key={tag}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddTag(tag)}
                      className="text-xs h-6 px-2"
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <Separator />

        {/* Summary Stats */}
        <div>
          <h4 className="font-medium mb-4">Summary Statistics</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={cn("text-2xl font-bold", summaryStats.totalPnL >= 0 ? "text-green-600" : "text-red-600")}>
                {formatCurrency(summaryStats.totalPnL)}
              </div>
              <div className="text-sm text-gray-600">Total P&L</div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {summaryStats.winRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Win Rate</div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {summaryStats.totalTrades}
              </div>
              <div className="text-sm text-gray-600">Total Trades</div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(summaryStats.avgWin)}
              </div>
              <div className="text-sm text-gray-600">Avg Win</div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(Math.abs(summaryStats.avgLoss))}
              </div>
              <div className="text-sm text-gray-600">Avg Loss</div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {summaryStats.profitFactor.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Profit Factor</div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Winning Trades:</span>
            <span className="font-medium text-green-600">{summaryStats.winningTrades}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Losing Trades:</span>
            <span className="font-medium text-red-600">{summaryStats.losingTrades}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Largest Win:</span>
            <span className="font-medium text-green-600">{formatCurrency(summaryStats.largestWin)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Largest Loss:</span>
            <span className="font-medium text-red-600">{formatCurrency(summaryStats.largestLoss)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}