import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Euro, PoundSterling } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$", icon: DollarSign },
  { code: "EUR", name: "Euro", symbol: "€", icon: Euro },
  { code: "GBP", name: "British Pound", symbol: "£", icon: PoundSterling },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", icon: DollarSign },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", icon: DollarSign },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", icon: DollarSign },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", icon: DollarSign },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", icon: DollarSign },
  { code: "INR", name: "Indian Rupee", symbol: "₹", icon: DollarSign },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", icon: DollarSign },
  { code: "KRW", name: "South Korean Won", symbol: "₩", icon: DollarSign },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", icon: DollarSign },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", icon: DollarSign },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", icon: DollarSign },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", icon: DollarSign },
  { code: "DKK", name: "Danish Krone", symbol: "kr", icon: DollarSign },
  { code: "PLN", name: "Polish Zloty", symbol: "zł", icon: DollarSign },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč", icon: DollarSign },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft", icon: DollarSign },
  { code: "RUB", name: "Russian Ruble", symbol: "₽", icon: DollarSign },
];

export function CurrencySelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const updateCurrencyMutation = useMutation({
    mutationFn: async (currency: string) => {
      const response = await fetch("/api/user/currency", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferredCurrency: currency }),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to update currency");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({ title: "Currency updated successfully" });
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error updating currency",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const currentCurrency = user?.preferredCurrency || "USD";
  const currentCurrencyData = CURRENCIES.find(c => c.code === currentCurrency) || CURRENCIES[0];
  const CurrentIcon = currentCurrencyData.icon;

  const handleCurrencyChange = () => {
    if (selectedCurrency && selectedCurrency !== currentCurrency) {
      updateCurrencyMutation.mutate(selectedCurrency);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <CurrentIcon className="h-4 w-4" />
          <span>{currentCurrency}</span>
          <Badge variant="secondary" className="text-xs">
            {currentCurrencyData.symbol}
          </Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Select Currency</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Choose your preferred currency for displaying trade values and P&L calculations.
          </div>
          
          <Select
            value={selectedCurrency}
            onValueChange={setSelectedCurrency}
            defaultValue={currentCurrency}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a currency" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {CURRENCIES.map((currency) => {
                const Icon = currency.icon;
                return (
                  <SelectItem key={currency.code} value={currency.code}>
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{currency.code}</span>
                        <span className="text-muted-foreground">•</span>
                        <span>{currency.name}</span>
                        <Badge variant="outline" className="text-xs ml-2">
                          {currency.symbol}
                        </Badge>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="text-sm font-medium mb-1">Current Currency</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CurrentIcon className="h-4 w-4" />
              <span>{currentCurrencyData.name} ({currentCurrencyData.code})</span>
              <Badge variant="secondary" className="text-xs">
                {currentCurrencyData.symbol}
              </Badge>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCurrencyChange}
              disabled={updateCurrencyMutation.isPending || selectedCurrency === currentCurrency}
            >
              {updateCurrencyMutation.isPending ? "Updating..." : "Update Currency"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Currency formatting utility
export function formatCurrency(amount: number, currency: string = "USD"): string {
  const currencyData = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];
  
  // Handle special cases for certain currencies
  if (currency === "JPY" || currency === "KRW") {
    // These currencies typically don't use decimal places
    return `${currencyData.symbol}${Math.round(amount).toLocaleString()}`;
  }
  
  return `${currencyData.symbol}${amount.toFixed(2)}`;
}