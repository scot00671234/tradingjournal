import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { UnifiedTradeEntry } from "@/components/unified-trade-entry";
import { Button } from "@/components/ui/button";

export default function AddTradePage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: subscriptionStatus } = useQuery({
    queryKey: ["/api/subscription-status"],
    enabled: !!user,
  });

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
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

          <div className="max-w-4xl mx-auto">
            <UnifiedTradeEntry 
              subscriptionStatus={subscriptionStatus}
              redirectAfterSubmit="/dashboard"
              showHeader={false}
            />
          </div>
        </div>
      </main>
    </div>
  );
}