import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Edit, TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from "lucide-react";
import { format, isSameDay, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths, getDay, startOfWeek, endOfWeek } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Trade } from "@shared/schema";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const updateFormSchema = z.object({
  asset: z.string().min(1, "Asset is required"),
  direction: z.enum(["long", "short"]),
  entryPrice: z.string().min(1, "Entry price is required"),
  exitPrice: z.string().optional(),
  size: z.coerce.number().int().positive("Size must be a positive integer"),
  tradeDate: z.string().min(1, "Trade date is required"),
  notes: z.string().optional(),
  tags: z.string().optional(),
  isCompleted: z.boolean(),
});

export function CalendarWidget() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const queryClient = useQueryClient();

  const { data: trades = [] } = useQuery<Trade[]>({
    queryKey: ["/api/trades"],
  });

  const updateTradeMutation = useMutation({
    mutationFn: async (data: { id: number; updates: any }) => {
      const response = await fetch(`/api/trades/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data.updates),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to update trade");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trades"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setEditingTrade(null);
      toast({ title: "Trade updated successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating trade",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<z.infer<typeof updateFormSchema>>({
    resolver: zodResolver(updateFormSchema),
  });

  // Get trades for selected date
  const getTradesForDate = (date: Date) => {
    return trades.filter(trade => 
      isSameDay(new Date(trade.tradeDate), date)
    );
  };

  // Get daily data for calendar display
  const getDailyData = (date: Date) => {
    const dayTrades = getTradesForDate(date);
    const totalPnL = dayTrades.reduce((sum, trade) => sum + (parseFloat(String(trade.pnl || 0))), 0);
    const tradeCount = dayTrades.length;
    
    return {
      trades: dayTrades,
      totalPnL,
      tradeCount,
      hasProfit: totalPnL > 0,
      hasLoss: totalPnL < 0,
      isBreakeven: totalPnL === 0 && tradeCount > 0
    };
  };

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  };

  const calendarDays = generateCalendarDays();

  const handleEditTrade = (trade: Trade) => {
    setEditingTrade(trade);
    form.reset({
      asset: trade.asset,
      direction: trade.direction as "long" | "short",
      entryPrice: trade.entryPrice.toString(),
      exitPrice: trade.exitPrice?.toString() || "",
      size: trade.size,
      tradeDate: format(new Date(trade.tradeDate), "yyyy-MM-dd"),
      notes: trade.notes || "",
      tags: Array.isArray(trade.tags) ? trade.tags.join(", ") : trade.tags || "",
      isCompleted: trade.isCompleted || false,
    });
  };

  const onSubmit = (data: z.infer<typeof updateFormSchema>) => {
    if (!editingTrade) return;

    const updates = {
      ...data,
      entryPrice: parseFloat(data.entryPrice),
      exitPrice: data.exitPrice ? parseFloat(data.exitPrice) : null,
      tags: data.tags ? data.tags.split(",").map(tag => tag.trim()).filter(Boolean) : [],
      tradeDate: data.tradeDate,
    };

    updateTradeMutation.mutate({
      id: editingTrade.id,
      updates,
    });
  };

  const selectedDateTrades = selectedDate ? getTradesForDate(selectedDate) : [];

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          Trade Calendar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          {/* Calendar Header */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-1 h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="font-semibold text-lg">
              {format(currentMonth, "MMMM yyyy")}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-1 h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Custom Calendar Grid */}
          <div className="border rounded-lg overflow-hidden">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-800">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="p-2 text-center text-xs font-medium text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, index) => {
                const dailyData = getDailyData(day);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                
                let bgColor = 'bg-white dark:bg-gray-900';
                let textColor = 'text-gray-900 dark:text-gray-100';
                
                if (dailyData.tradeCount > 0) {
                  if (dailyData.hasProfit) {
                    bgColor = 'bg-green-100 dark:bg-green-900/30';
                    textColor = 'text-green-800 dark:text-green-200';
                  } else if (dailyData.hasLoss) {
                    bgColor = 'bg-red-100 dark:bg-red-900/30';
                    textColor = 'text-red-800 dark:text-red-200';
                  } else {
                    bgColor = 'bg-gray-100 dark:bg-gray-800';
                    textColor = 'text-gray-700 dark:text-gray-300';
                  }
                }

                return (
                  <div
                    key={day.toISOString()}
                    className={`
                      min-h-[80px] p-2 border-r border-b border-gray-200 dark:border-gray-700 last:border-r-0 cursor-pointer
                      hover:bg-opacity-80 transition-all duration-200
                      ${bgColor} ${textColor}
                      ${!isCurrentMonth ? 'opacity-40' : ''}
                      ${isSelected ? 'ring-2 ring-blue-500' : ''}
                    `}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className="text-sm font-medium mb-1">
                      {format(day, 'd')}
                    </div>
                    
                    {dailyData.tradeCount > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs font-semibold">
                          {dailyData.totalPnL >= 0 ? '+' : ''}${dailyData.totalPnL.toFixed(0)}
                        </div>
                        <div className="text-xs opacity-75">
                          {dailyData.tradeCount} trade{dailyData.tradeCount === 1 ? '' : 's'}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Date Details */}
          {selectedDate && (
            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
              <h3 className="font-medium text-sm mb-3">
                Trades on {format(selectedDate, "MMM dd, yyyy")}
              </h3>
              {selectedDateTrades.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedDateTrades.map((trade) => (
                    <div
                      key={trade.id}
                      className="p-3 border rounded-lg space-y-2 hover:bg-white dark:hover:bg-gray-700/50 transition-colors bg-white/50 dark:bg-gray-700/30"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={trade.direction === "long" ? "default" : "secondary"}>
                            {trade.direction === "long" ? (
                              <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            {trade.direction.toUpperCase()}
                          </Badge>
                          <span className="font-medium text-sm">{trade.asset}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${
                            parseFloat(String(trade.pnl || '0')) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {parseFloat(String(trade.pnl || '0')) >= 0 ? '+' : ''}${String(trade.pnl || '0.00')}
                          </span>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditTrade(trade)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                              <DialogHeader>
                                <DialogTitle>Edit Trade</DialogTitle>
                              </DialogHeader>
                              <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                      control={form.control}
                                      name="asset"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Asset</FormLabel>
                                          <FormControl>
                                            <Input {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name="direction"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Direction</FormLabel>
                                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                              <SelectTrigger>
                                                <SelectValue />
                                              </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                              <SelectItem value="long">Long</SelectItem>
                                              <SelectItem value="short">Short</SelectItem>
                                            </SelectContent>
                                          </Select>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>

                                  <div className="grid grid-cols-3 gap-4">
                                    <FormField
                                      control={form.control}
                                      name="entryPrice"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Entry Price</FormLabel>
                                          <FormControl>
                                            <Input {...field} type="number" step="0.01" />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name="exitPrice"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Exit Price</FormLabel>
                                          <FormControl>
                                            <Input {...field} type="number" step="0.01" />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name="size"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Size</FormLabel>
                                          <FormControl>
                                            <Input {...field} type="number" />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>

                                  <FormField
                                    control={form.control}
                                    name="tradeDate"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Trade Date</FormLabel>
                                        <FormControl>
                                          <Input {...field} type="date" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name="notes"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Notes</FormLabel>
                                        <FormControl>
                                          <Textarea {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name="tags"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Tags (comma separated)</FormLabel>
                                        <FormControl>
                                          <Input {...field} placeholder="momentum, breakout, earnings" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <div className="flex justify-end space-x-2">
                                    <Button type="submit" disabled={updateTradeMutation.isPending}>
                                      {updateTradeMutation.isPending ? "Updating..." : "Update Trade"}
                                    </Button>
                                  </div>
                                </form>
                              </Form>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                      
                      {trade.notes && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                          {trade.notes}
                        </p>
                      )}
                      
                      {trade.tags && (() => {
                        try {
                          const tags = typeof trade.tags === 'string' ? JSON.parse(trade.tags) : trade.tags;
                          return tags && tags.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {tags.map((tag: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          );
                        } catch {
                          return null;
                        }
                      })()}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                  No trades on this date
                </div>
              )}
            </div>
          )}

          {/* Selected Date Trades */}
          <div className="flex-1 space-y-2">
            {selectedDate ? (
              <>
                <h3 className="font-medium text-sm">
                  Trades on {format(selectedDate, "MMM dd, yyyy")}
                </h3>
                {selectedDateTrades.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedDateTrades.map((trade) => (
                      <div
                        key={trade.id}
                        className="p-3 border rounded-lg space-y-2 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant={trade.direction === "long" ? "default" : "secondary"}>
                              {trade.direction === "long" ? (
                                <TrendingUp className="h-3 w-3 mr-1" />
                              ) : (
                                <TrendingDown className="h-3 w-3 mr-1" />
                              )}
                              {trade.direction.toUpperCase()}
                            </Badge>
                            <span className="font-medium text-sm">{trade.asset}</span>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditTrade(trade)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                              <DialogHeader>
                                <DialogTitle>Edit Trade</DialogTitle>
                              </DialogHeader>
                              <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                      control={form.control}
                                      name="asset"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Asset</FormLabel>
                                          <FormControl>
                                            <Input {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name="direction"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Direction</FormLabel>
                                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                              <SelectTrigger>
                                                <SelectValue />
                                              </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                              <SelectItem value="long">Long</SelectItem>
                                              <SelectItem value="short">Short</SelectItem>
                                            </SelectContent>
                                          </Select>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                      control={form.control}
                                      name="entryPrice"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Entry Price</FormLabel>
                                          <FormControl>
                                            <Input {...field} type="number" step="0.01" />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name="exitPrice"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Exit Price</FormLabel>
                                          <FormControl>
                                            <Input {...field} type="number" step="0.01" />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                      control={form.control}
                                      name="size"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Size</FormLabel>
                                          <FormControl>
                                            <Input {...field} type="number" />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name="tradeDate"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Trade Date</FormLabel>
                                          <FormControl>
                                            <Input {...field} type="date" />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                  <FormField
                                    control={form.control}
                                    name="tags"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Tags (comma-separated)</FormLabel>
                                        <FormControl>
                                          <Input {...field} placeholder="e.g., breakout, trend, scalp" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name="notes"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Notes</FormLabel>
                                        <FormControl>
                                          <Textarea {...field} rows={3} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <div className="flex justify-end space-x-2">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() => setEditingTrade(null)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      type="submit"
                                      disabled={updateTradeMutation.isPending}
                                    >
                                      {updateTradeMutation.isPending ? "Updating..." : "Update Trade"}
                                    </Button>
                                  </div>
                                </form>
                              </Form>
                            </DialogContent>
                          </Dialog>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>Entry: ${trade.entryPrice} • Size: {trade.size}</div>
                          {trade.exitPrice && (
                            <div>Exit: ${trade.exitPrice} • P&L: ${trade.pnl?.toFixed(2) || "0.00"}</div>
                          )}
                          {trade.notes && <div className="italic">{trade.notes}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No trades on this date</p>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Select a date to view trades</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}