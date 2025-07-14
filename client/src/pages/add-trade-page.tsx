import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTradeSchema, type InsertTrade } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { invalidateAllTradeRelatedQueries } from "@/lib/cache-utils";
import { ArrowLeft, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { Sidebar } from "@/components/sidebar";

export default function AddTradePage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertTrade>({
    resolver: zodResolver(insertTradeSchema),
    defaultValues: {
      asset: "",
      direction: "long",
      entryPrice: 0,
      exitPrice: 0,
      quantity: 0,
      pnl: 0,
      notes: "",
      tags: [],
    },
  });

  const addTradeMutation = useMutation({
    mutationFn: async (data: InsertTrade) => {
      // Calculate P&L if not provided
      const calculatedPnl = data.direction === "long" 
        ? (data.exitPrice - data.entryPrice) * data.quantity
        : (data.entryPrice - data.exitPrice) * data.quantity;
      
      const tradeData = {
        ...data,
        pnl: data.pnl || calculatedPnl,
      };
      
      const res = await apiRequest("POST", "/api/trades", tradeData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Trade Added",
        description: "Your trade has been successfully recorded.",
      });
      // Use centralized cache invalidation for data sync
      invalidateAllTradeRelatedQueries(queryClient);
      setLocation("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertTrade) => {
    addTradeMutation.mutate(data);
  };

  const handleCalculatePnL = () => {
    const entryPrice = form.getValues("entryPrice");
    const exitPrice = form.getValues("exitPrice");
    const quantity = form.getValues("quantity");
    const direction = form.getValues("direction");
    
    if (entryPrice && exitPrice && quantity) {
      const pnl = direction === "long" 
        ? (exitPrice - entryPrice) * quantity
        : (entryPrice - exitPrice) * quantity;
      
      form.setValue("pnl", pnl);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="px-6 py-8">
          <div className="flex items-center space-x-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation("/dashboard")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Add New Trade</h1>
              <p className="text-muted-foreground">Record your trading activity</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Trade Details</span>
                  </CardTitle>
                  <CardDescription>
                    Enter the details of your trade
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="asset"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Asset/Symbol</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., AAPL, BTC/USD" {...field} />
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
                                    <SelectValue placeholder="Select direction" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="long">
                                    <div className="flex items-center space-x-2">
                                      <TrendingUp className="w-4 h-4 text-green-500" />
                                      <span>Long</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="short">
                                    <div className="flex items-center space-x-2">
                                      <TrendingDown className="w-4 h-4 text-red-500" />
                                      <span>Short</span>
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="entryPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Entry Price</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  step="0.01" 
                                  placeholder="0.00"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(parseFloat(e.target.value) || 0);
                                    handleCalculatePnL();
                                  }}
                                />
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
                                <Input 
                                  type="number" 
                                  step="0.01" 
                                  placeholder="0.00"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(parseFloat(e.target.value) || 0);
                                    handleCalculatePnL();
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="quantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantity</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  step="0.01" 
                                  placeholder="0"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(parseFloat(e.target.value) || 0);
                                    handleCalculatePnL();
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="pnl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>P&L</FormLabel>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <Input 
                                  type="number" 
                                  step="0.01" 
                                  placeholder="0.00"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="sm"
                                  onClick={handleCalculatePnL}
                                >
                                  Calculate
                                </Button>
                              </div>
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
                              <Textarea 
                                placeholder="Add any notes about this trade..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end space-x-4">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setLocation("/dashboard")}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit"
                          disabled={addTradeMutation.isPending}
                        >
                          {addTradeMutation.isPending ? "Adding..." : "Add Trade"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Trade Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Asset:</span>
                      <span className="text-sm font-medium">{form.watch("asset") || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Direction:</span>
                      <span className="text-sm font-medium">{form.watch("direction")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Quantity:</span>
                      <span className="text-sm font-medium">{form.watch("quantity") || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Entry:</span>
                      <span className="text-sm font-medium">${form.watch("entryPrice") || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Exit:</span>
                      <span className="text-sm font-medium">${form.watch("exitPrice") || 0}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-sm font-medium">P&L:</span>
                      <span className={`text-sm font-bold ${
                        (form.watch("pnl") || 0) >= 0 ? "text-green-600" : "text-red-600"
                      }`}>
                        ${form.watch("pnl") || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}