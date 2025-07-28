import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertTradeSchema, type InsertTrade } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingUp, TrendingDown, Crown, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { invalidateAllTradeRelatedQueries } from "@/lib/cache-utils";
import { queryClient } from "@/lib/queryClient";

interface UnifiedTradeEntryProps {
  subscriptionStatus?: {
    plan: string;
    tradeCount: number;
    tradeLimit: number | null;
  };
  redirectAfterSubmit?: string;
  showHeader?: boolean;
  title?: string;
}

const defaultAssets = ["AAPL", "TSLA", "SPY", "QQQ", "MSFT", "NVDA", "AMZN", "GOOGL", "BTC", "ETH", "ADA", "SOL", "DOT", "MATIC", "AVAX", "LINK"];

export function UnifiedTradeEntry({ 
  subscriptionStatus, 
  redirectAfterSubmit, 
  showHeader = true,
  title = "Quick Trade Entry" 
}: UnifiedTradeEntryProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [direction, setDirection] = useState<"long" | "short">("long");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [customAssets, setCustomAssets] = useState<string[]>([]);
  const [allAssets, setAllAssets] = useState<string[]>(defaultAssets);
  const [newAsset, setNewAsset] = useState("");

  const form = useForm<InsertTrade>({
    resolver: zodResolver(insertTradeSchema),
    defaultValues: {
      asset: "",
      direction: "long",
      entryPrice: "",
      exitPrice: "",
      size: 0,
      notes: "",
      tags: "",
      tradeDate: new Date().toISOString().split('T')[0],
      isCompleted: false,
    },
  });

  const createTradeMutation = useMutation({
    mutationFn: async (data: InsertTrade) => {
      const tradeData = {
        ...data,
        direction,
        tags,
        tradeDate: new Date(data.tradeDate).toISOString(),
        entryPrice: data.entryPrice,
        exitPrice: data.exitPrice || undefined,
      };
      
      const res = await apiRequest("POST", "/api/trades", tradeData);
      return res.json();
    },
    onSuccess: () => {
      invalidateAllTradeRelatedQueries(queryClient);
      toast({
        title: "Trade added successfully",
        description: "Your trade has been recorded in your journal.",
      });
      form.reset();
      setTags([]);
      setDirection("long");
      
      if (redirectAfterSubmit) {
        setLocation(redirectAfterSubmit);
      }
    },
    onError: (error: Error) => {
      if (error.message.includes("limited to 5 trades")) {
        toast({
          title: "Trade limit reached",
          description: "Upgrade to Pro for unlimited trades.",
          variant: "destructive",
          action: (
            <Button variant="outline" size="sm" onClick={() => setLocation("/subscribe")}>
              Upgrade
            </Button>
          ),
        });
      } else {
        toast({
          title: "Error adding trade",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  const onSubmit = (data: InsertTrade) => {
    createTradeMutation.mutate(data);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const removeAsset = (assetToRemove: string) => {
    setAllAssets(allAssets.filter(asset => asset !== assetToRemove));
  };

  const removeCustomAsset = (assetToRemove: string) => {
    setCustomAssets(customAssets.filter(asset => asset !== assetToRemove));
  };

  const addCustomAsset = () => {
    const upperValue = newAsset.trim().toUpperCase();
    if (upperValue && !allAssets.includes(upperValue) && !customAssets.includes(upperValue)) {
      setCustomAssets([...customAssets, upperValue]);
      form.setValue("asset", upperValue);
      // Keep the asset in the input field, don't clear it
    }
  };

  const isFreeLimitReached = subscriptionStatus?.plan === 'free' && 
    subscriptionStatus.tradeCount >= (subscriptionStatus.tradeLimit || 5);

  return (
    <Card className="bg-card border-border">
      {showHeader && (
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {title}
            <div className="flex items-center space-x-2">
              {subscriptionStatus && (
                <Badge variant="outline" className="text-xs">
                  Plan: {subscriptionStatus.plan === 'free' ? 'Free' : 'Pro'}
                </Badge>
              )}
              {subscriptionStatus?.plan === 'free' && (
                <Badge variant="outline" className="text-xs">
                  {subscriptionStatus.tradeCount} / {subscriptionStatus.tradeLimit || 5} trades
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="space-y-6">
        <form onSubmit={form.handleSubmit((data) => onSubmit(data as InsertTrade))} className="space-y-4">
          {/* Asset Selection */}
          <div className="space-y-2">
            <Label htmlFor="asset">Assets</Label>
            
            {/* Main Assets Section */}
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {allAssets.map((asset) => (
                  <div key={asset} className="relative group">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        form.setValue("asset", asset);
                        setNewAsset(asset);
                      }}
                      className="text-xs pr-8"
                    >
                      {asset}
                    </Button>
                    <button
                      type="button"
                      onClick={() => removeAsset(asset)}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Assets Section */}
            {customAssets.length > 0 && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {customAssets.map((asset) => (
                    <div key={asset} className="relative group">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          form.setValue("asset", asset);
                          setNewAsset(asset);
                        }}
                        className="text-xs bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-900/30 border-blue-200 dark:border-blue-800 pr-8"
                      >
                        {asset}
                      </Button>
                      <button
                        type="button"
                        onClick={() => removeCustomAsset(asset)}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Single Asset Input */}
            <div className="flex gap-2">
              <Input
                id="asset"
                placeholder="Enter asset symbol (e.g., AAPL, BTC, ETH)"
                value={newAsset}
                onChange={(e) => {
                  setNewAsset(e.target.value);
                  form.setValue("asset", e.target.value);
                }}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomAsset())}
                className="text-xs"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCustomAsset}
                disabled={!newAsset.trim()}
                className="shrink-0"
              >
                Add
              </Button>
            </div>
            {form.formState.errors.asset && (
              <p className="text-red-500 text-sm">{form.formState.errors.asset.message}</p>
            )}
          </div>

          {/* Direction */}
          <div className="space-y-2">
            <Label>Direction</Label>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={direction === "long" ? "default" : "outline"}
                size="sm"
                onClick={() => setDirection("long")}
                className="flex-1"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Long
              </Button>
              <Button
                type="button"
                variant={direction === "short" ? "default" : "outline"}
                size="sm"
                onClick={() => setDirection("short")}
                className="flex-1"
              >
                <TrendingDown className="w-4 h-4 mr-2" />
                Short
              </Button>
            </div>
          </div>

          {/* Prices and Size */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entryPrice">Entry Price</Label>
              <Input
                id="entryPrice"
                type="number"
                step="0.01"
                placeholder="245.50"
                {...form.register("entryPrice")}
              />
              {form.formState.errors.entryPrice && (
                <p className="text-red-500 text-sm">{form.formState.errors.entryPrice.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="exitPrice">Exit Price (Optional)</Label>
              <Input
                id="exitPrice"
                type="number"
                step="0.01"
                placeholder="251.20"
                {...form.register("exitPrice")}
              />
              {form.formState.errors.exitPrice && (
                <p className="text-red-500 text-sm">{form.formState.errors.exitPrice.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="size">Position Size</Label>
              <Input
                id="size"
                type="number"
                placeholder="100"
                {...form.register("size", { valueAsNumber: true })}
              />
              {form.formState.errors.size && (
                <p className="text-red-500 text-sm">{form.formState.errors.size.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="tradeDate">Trade Date</Label>
              <Input
                id="tradeDate"
                type="date"
                {...form.register("tradeDate")}
              />
              {form.formState.errors.tradeDate && (
                <p className="text-red-500 text-sm">{form.formState.errors.tradeDate.message}</p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Add tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} size="sm">
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTag(tag)}
                      className="ml-1 h-4 w-4 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Trade notes and observations..."
              {...form.register("notes")}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            {isFreeLimitReached ? (
              <Button type="button" onClick={() => setLocation("/subscribe")} className="w-full">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Pro for Unlimited Trades
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={createTradeMutation.isPending}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                {createTradeMutation.isPending ? "Adding..." : "Add Trade"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}