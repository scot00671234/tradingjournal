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
import { Plus, TrendingUp, TrendingDown, Crown } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface TradeEntryFormProps {
  subscriptionStatus?: {
    plan: string;
    tradeCount: number;
    tradeLimit: number | null;
  };
}

const popularAssets = ["AAPL", "TSLA", "SPY", "QQQ", "MSFT", "NVDA", "AMZN", "GOOGL"];

export function TradeEntryForm({ subscriptionStatus }: TradeEntryFormProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [direction, setDirection] = useState<"long" | "short">("long");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const form = useForm<InsertTrade>({
    resolver: zodResolver(insertTradeSchema),
    defaultValues: {
      asset: "",
      direction: "long",
      entryPrice: "",
      exitPrice: "",
      size: 0,
      notes: "",
      tags: [],
      tradeDate: new Date().toISOString().split('T')[0],
      isCompleted: false,
    },
  });

  const createTradeMutation = useMutation({
    mutationFn: async (data: InsertTrade) => {
      const res = await apiRequest("POST", "/api/trades", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trades"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/subscription-status"] });
      toast({
        title: "Trade added successfully",
        description: "Your trade has been recorded in your journal.",
      });
      form.reset();
      setTags([]);
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

  const onSubmit = async (data: InsertTrade) => {
    const tradeData = {
      ...data,
      direction,
      tags,
      tradeDate: new Date(data.tradeDate).toISOString(),
    };
    
    createTradeMutation.mutate(tradeData);
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

  const isFreeLimitReached = subscriptionStatus?.plan === 'free' && 
    subscriptionStatus.tradeCount >= (subscriptionStatus.tradeLimit || 5);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">
            Quick Trade Entry
          </CardTitle>
          <Button 
            type="submit" 
            form="trade-form"
            disabled={createTradeMutation.isPending || isFreeLimitReached}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Trade
          </Button>
        </div>
        
        {subscriptionStatus && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-muted-foreground">Plan:</span>
              <Badge variant={subscriptionStatus.plan === 'pro' ? 'default' : 'secondary'}>
                {subscriptionStatus.plan === 'pro' ? (
                  <>
                    <Crown className="w-3 h-3 mr-1" />
                    Pro
                  </>
                ) : (
                  'Free'
                )}
              </Badge>
            </div>
            <div className="text-muted-foreground">
              {subscriptionStatus.plan === 'pro' ? (
                `${subscriptionStatus.tradeCount} trades`
              ) : (
                `${subscriptionStatus.tradeCount} / ${subscriptionStatus.tradeLimit} trades`
              )}
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {isFreeLimitReached && (
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              You've reached your free plan limit of 5 trades. 
              <Button 
                variant="link" 
                className="p-0 h-auto text-yellow-800 dark:text-yellow-200 underline ml-1"
                onClick={() => setLocation("/subscribe")}
              >
                Upgrade to Pro
              </Button> 
              for unlimited trades.
            </p>
          </div>
        )}

        <form id="trade-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="asset">Asset</Label>
              <Select
                value={form.watch("asset")}
                onValueChange={(value) => form.setValue("asset", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select asset" />
                </SelectTrigger>
                <SelectContent>
                  {popularAssets.map((asset) => (
                    <SelectItem key={asset} value={asset}>
                      {asset}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Direction</Label>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant={direction === "long" ? "default" : "outline"}
                  onClick={() => setDirection("long")}
                  className="flex-1"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Long
                </Button>
                <Button
                  type="button"
                  variant={direction === "short" ? "default" : "outline"}
                  onClick={() => setDirection("short")}
                  className="flex-1"
                >
                  <TrendingDown className="w-4 h-4 mr-2" />
                  Short
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="entryPrice">Entry Price</Label>
              <Input
                id="entryPrice"
                type="number"
                step="0.01"
                placeholder="245.50"
                {...form.register("entryPrice")}
              />
            </div>

            <div>
              <Label htmlFor="exitPrice">Exit Price (Optional)</Label>
              <Input
                id="exitPrice"
                type="number"
                step="0.01"
                placeholder="251.20"
                {...form.register("exitPrice")}
              />
            </div>

            <div>
              <Label htmlFor="size">Position Size</Label>
              <Input
                id="size"
                type="number"
                placeholder="100"
                {...form.register("size", { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="tradeDate">Trade Date</Label>
              <Input
                id="tradeDate"
                type="date"
                {...form.register("tradeDate")}
              />
            </div>
          </div>

          <div>
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="cursor-pointer">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                placeholder="Add tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Trade notes and observations..."
              className="h-20"
              {...form.register("notes")}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
