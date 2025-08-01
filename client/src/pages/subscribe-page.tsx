import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Check, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

// Use a default key for development
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_default';

const stripePromise = loadStripe(stripePublicKey);

const SubscribeForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Welcome to TradeJournal Pro!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/subscription-status"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setLocation("/dashboard");
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-yellow-300 to-amber-400 hover:from-yellow-400 hover:to-amber-500 text-gray-900 font-semibold shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/50 transition-all duration-200" 
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Crown className="w-4 h-4 mr-2" />
            Subscribe to Pro - $19/month
          </>
        )}
      </Button>
    </form>
  );
};

export default function SubscribePage() {
  const { user } = useAuth();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      apiRequest("POST", "/api/create-subscription")
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error creating subscription:", error);
          setLoading(false);
        });
    }
  }, [user]);

  const proFeatures = [
    "Unlimited trade entries",
    "Advanced analytics suite",
    "Chart/image uploads",
    "CSV export functionality",
    "Trade editing and tagging",
    "Advanced filters",
    "Review and summary features",
    "Data sync and backup",
    "Priority support",
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex bg-background">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Setting up your subscription...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Upgrade to Pro</h2>
              <p className="text-muted-foreground">Unlock unlimited trades and premium features</p>
            </div>
          </div>
        </header>

        {/* Subscribe Content */}
        <div className="p-6 max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Plan Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  <span>TradeJournal Pro</span>
                </CardTitle>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-foreground">$19</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {proFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                {clientSecret ? (
                  <Elements 
                    stripe={stripePromise} 
                    options={{ 
                      clientSecret,
                      appearance: {
                        theme: 'stripe',
                        variables: {
                          colorPrimary: '#10b981',
                        },
                      },
                    }}
                  >
                    <SubscribeForm />
                  </Elements>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Unable to load payment form</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
