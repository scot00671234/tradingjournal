import { QueryClient } from "@tanstack/react-query";

// Centralized cache invalidation function to ensure data sync across all pages
export function invalidateAllTradeRelatedQueries(queryClient: QueryClient) {
  // Invalidate ALL queries related to trades to ensure comprehensive data sync
  queryClient.invalidateQueries({ queryKey: ["/api/trades"] });
  queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
  queryClient.invalidateQueries({ queryKey: ["/api/subscription-status"] });
  queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
  queryClient.invalidateQueries({ queryKey: ["/api/tags"] });
}

// Optimistic update function for trade operations
export function updateTradeInCache(queryClient: QueryClient, tradeId: number, updateData: any) {
  queryClient.setQueryData(["/api/trades"], (oldData: any) => {
    if (!oldData) return oldData;
    return oldData.map((trade: any) => 
      trade.id === tradeId ? { ...trade, ...updateData } : trade
    );
  });
}

// Remove trade from cache optimistically
export function removeTradeFromCache(queryClient: QueryClient, tradeId: number) {
  queryClient.setQueryData(["/api/trades"], (oldData: any) => {
    if (!oldData) return oldData;
    return oldData.filter((trade: any) => trade.id !== tradeId);
  });
}

// Add trade to cache optimistically
export function addTradeToCache(queryClient: QueryClient, newTrade: any) {
  queryClient.setQueryData(["/api/trades"], (oldData: any) => {
    if (!oldData) return [newTrade];
    return [...oldData, newTrade];
  });
}