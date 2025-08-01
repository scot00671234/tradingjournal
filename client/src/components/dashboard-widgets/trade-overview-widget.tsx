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
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
      // Create new PDF document with CoinFeedly branding
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      
      // CoinFeedly brand colors
      const brandGold = [245, 158, 11]; // #f59e0b
      const brandDark = [17, 24, 39]; // #111827
      const textDark = [55, 65, 81]; // #374151
      const lightGray = [249, 250, 251]; // #f9fafb
      
      // Header with brand styling
      doc.setFillColor(...brandGold);
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      // CoinFeedly logo/title
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('CoinFeedly', 20, 25);
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'normal');
      doc.text('Trade Overview Report', pageWidth - 20, 25, { align: 'right' });
      
      // Report date
      doc.setTextColor(...textDark);
      doc.setFontSize(10);
      doc.text(`Generated on ${format(new Date(), 'PPP')}`, pageWidth - 20, 50, { align: 'right' });
      
      // Filters applied section
      const filtersApplied = [
        filters.instrument && `Asset: ${filters.instrument}`,
        filters.dateFrom && `From: ${format(filters.dateFrom, 'PPP')}`,
        filters.dateTo && `To: ${format(filters.dateTo, 'PPP')}`,
        filters.tags.length > 0 && `Tags: ${filters.tags.join(', ')}`,
        filters.searchTerm && `Search: ${filters.searchTerm}`
      ].filter(Boolean);
      
      if (filtersApplied.length > 0) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Applied Filters:', 20, 65);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(filtersApplied.join(' | '), 20, 75, { maxWidth: pageWidth - 40 });
      }
      
      // Summary statistics section
      let yPos = filtersApplied.length > 0 ? 90 : 70;
      
      doc.setFillColor(...lightGray);
      doc.rect(10, yPos, pageWidth - 20, 8, 'F');
      
      doc.setTextColor(...brandDark);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('SUMMARY STATISTICS', 20, yPos + 6);
      
      yPos += 20;
      
      // Stats grid
      const stats = [
        { label: 'Total Trades', value: summaryStats.totalTrades.toString() },
        { label: 'Completed Trades', value: summaryStats.completedTrades.toString() },
        { label: 'Total P&L', value: formatCurrency(summaryStats.totalPnL), color: summaryStats.totalPnL >= 0 ? [5, 150, 105] : [220, 38, 38] },
        { label: 'Win Rate', value: `${summaryStats.winRate.toFixed(1)}%` },
        { label: 'Average Win', value: formatCurrency(summaryStats.avgWin), color: [5, 150, 105] },
        { label: 'Average Loss', value: formatCurrency(summaryStats.avgLoss), color: [220, 38, 38] },
        { label: 'Profit Factor', value: summaryStats.profitFactor === Infinity ? '∞' : summaryStats.profitFactor.toFixed(2) }
      ];
      
      const colWidth = (pageWidth - 40) / 4;
      const rowHeight = 25;
      
      stats.forEach((stat, index) => {
        const col = index % 4;
        const row = Math.floor(index / 4);
        const x = 20 + col * colWidth;
        const y = yPos + row * rowHeight;
        
        // Stat card background
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(229, 231, 235);
        doc.rect(x, y, colWidth - 5, rowHeight - 5, 'FD');
        
        // Stat value
        doc.setTextColor(...(stat.color || textDark));
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(stat.value, x + 5, y + 12);
        
        // Stat label
        doc.setTextColor(...textDark);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(stat.label, x + 5, y + 20);
      });
      
      // Trades table
      if (filteredTrades.length > 0) {
        yPos += Math.ceil(stats.length / 4) * rowHeight + 20;
        
        doc.setFillColor(...lightGray);
        doc.rect(10, yPos, pageWidth - 20, 8, 'F');
        
        doc.setTextColor(...brandDark);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`FILTERED TRADES (${filteredTrades.length})`, 20, yPos + 6);
        
        yPos += 15;
        
        // Prepare table data
        const tableData = filteredTrades.map(trade => [
          format(new Date(trade.tradeDate), 'MMM d, yyyy'),
          trade.asset,
          trade.direction.toUpperCase(),
          formatCurrency(trade.entryPrice),
          trade.exitPrice ? formatCurrency(trade.exitPrice) : '-',
          trade.size.toString(),
          trade.pnl ? formatCurrency(trade.pnl) : 'Open',
          trade.notes ? (trade.notes.length > 30 ? trade.notes.substring(0, 30) + '...' : trade.notes) : '-'
        ]);
        
        // Add table using autoTable
        (doc as any).autoTable({
          head: [['Date', 'Asset', 'Direction', 'Entry', 'Exit', 'Size', 'P&L', 'Notes']],
          body: tableData,
          startY: yPos,
          theme: 'grid',
          headStyles: {
            fillColor: brandGold,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 10
          },
          bodyStyles: {
            fontSize: 9,
            textColor: textDark
          },
          columnStyles: {
            6: { // P&L column
              cellWidth: 20,
              halign: 'right'
            }
          },
          didParseCell: function(data: any) {
            // Color P&L column based on value
            if (data.column.index === 6 && data.section === 'body') {
              const pnlText = data.cell.text[0];
              if (pnlText && pnlText !== 'Open' && pnlText !== '-') {
                const isPositive = !pnlText.startsWith('-') && !pnlText.startsWith('($');
                data.cell.styles.textColor = isPositive ? [5, 150, 105] : [220, 38, 38];
              }
            }
          },
          margin: { left: 20, right: 20 }
        });
      }
      
      // Footer
      const footerY = pageHeight - 20;
      doc.setTextColor(...textDark);
      doc.setFontSize(8);
      doc.text('Generated by CoinFeedly Trading Journal', pageWidth / 2, footerY, { align: 'center' });
      
      // Save the PDF
      const fileName = `coinfeedly-trade-overview-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      doc.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to simple download
      const blob = new Blob([JSON.stringify(filteredTrades, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `coinfeedly-trades-${format(new Date(), 'yyyy-MM-dd')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
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
              <Label>Assets</Label>
              <Select value={filters.instrument || "all"} onValueChange={(value) => setFilters(prev => ({ ...prev, instrument: value === "all" ? "" : value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All assets" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All assets</SelectItem>
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

        {/* Trade List Section */}
        {filteredTrades.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground">FILTERED TRADES ({filteredTrades.length})</h3>
            <div className="max-h-64 overflow-y-auto space-y-2 border rounded-lg p-3 bg-muted/20">
              {filteredTrades.map((trade) => (
                <div
                  key={trade.id}
                  className="flex items-center justify-between p-3 bg-background rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      trade.direction === "long" ? "bg-green-500" : "bg-red-500"
                    )} />
                    <div>
                      <div className="font-medium text-sm">{trade.asset}</div>
                      <div className="text-xs text-muted-foreground">
                        {trade.direction.toUpperCase()} • {format(new Date(trade.tradeDate), "MMM d, yyyy")}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={cn(
                      "font-medium text-sm",
                      trade.pnl ? (trade.pnl >= 0 ? "text-green-600" : "text-red-600") : "text-muted-foreground"
                    )}>
                      {trade.pnl ? formatCurrency(trade.pnl) : "Open"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Size: {trade.size}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredTrades.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-muted-foreground py-8">
            <div className="text-center">
              <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No trades match the current filters</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}