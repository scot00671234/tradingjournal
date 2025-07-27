import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { 
  TrendingUp, 
  BarChart3, 
  Target, 
  Shield, 
  Crown, 
  Check, 
  Users, 
  Star,
  ArrowRight,
  PieChart,
  FileText,
  Zap
} from "lucide-react";

export default function LandingPage() {
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: TrendingUp,
      title: "Manual Logging",
      description: "Fast entry for trades (pair, entry/exit, P&L, notes). Clean, minimal interface.",
    },
    {
      icon: Zap,
      title: "Auto-Sync",
      description: "Connect exchange (e.g., Binance, Bybit) or import CSV to auto-log trades.",
    },
    {
      icon: Target,
      title: "Tag & Strategy Tracking",
      description: "Categorize trades and view strategy breakdowns. Identify your best setups.",
    },
    {
      icon: FileText,
      title: "Notes & Charts",
      description: "Attach screenshots or thoughts to each trade. Visual documentation made easy.",
    },
    {
      icon: BarChart3,
      title: "Dashboard",
      description: "Key metrics (P&L, win rate, drawdown, strategy ROI). Notion-level clean.",
    },
    {
      icon: PieChart,
      title: "Export",
      description: "CSV + PDF exports. Take your data anywhere.",
    },
  ];

  const pricingPlans = [
    {
      name: "Pro",
      price: "$29",
      period: "month",
      description: "Clean manual journal",
      features: [
        "Clean manual journal",
        "Auto trade sync",
        "Strategy tracking",
        "Export tools",
      ],
      buttonText: "Start Free Trial",
      buttonVariant: "default" as const,
      popular: true,
    },
    {
      name: "Advanced",
      price: "$49",
      period: "month",
      description: "Multiple dashboards & filters",
      features: [
        "Multiple dashboards",
        "Advanced filters (by pair, time, tags)",
        "Custom data views",
        "Priority support",
      ],
      buttonText: "Get Advanced",
      buttonVariant: "outline" as const,
      popular: false,
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Day Trader",
      content: "TradeJournal has completely transformed how I analyze my trading performance. The insights are invaluable.",
      rating: 5,
    },
    {
      name: "Mike Rodriguez",
      role: "Swing Trader",
      content: "The tagging system helps me identify my best setups. My win rate has improved by 15% since using this.",
      rating: 5,
    },
    {
      name: "Emma Thompson",
      role: "Options Trader",
      content: "Clean interface, powerful analytics. Exactly what I needed to track my options strategies.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white dark:text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">CoinFeedly</h1>
                <span className="text-xs text-gray-500 dark:text-gray-400">Clean, Simple Trading Journal</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                onClick={() => setLocation("/auth")}
              >
                Login
              </Button>
              <Button 
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                onClick={() => setLocation("/auth")}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700">
            <Zap className="w-3 h-3 mr-1" />
            Trusted by 10,000+ traders
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            CoinFeedly
            <span className="text-gray-600 dark:text-gray-300"> Clean, Simple Trading Journal</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            A beautiful, Notion-style trading journal with automatic trade sync and powerful insights. 
            Most tools are outdated or ugly → CoinFeedly is Notion-level clean.
          </p>
          
          <div className="flex justify-center">
            <Button 
              size="lg" 
              className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 text-lg px-8"
              onClick={() => setLocation("/auth")}
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <div className="mt-12 flex items-center justify-center space-x-8 text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>10,000+ Users</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5" />
              <span>4.9/5 Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Bank-level Security</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Trade Better
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Professional-grade tools designed for traders who are serious about improving their performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <div className="w-12 h-12 bg-black/10 dark:bg-white/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-black dark:text-white" />
                  </div>
                  <CardTitle className="text-gray-900 dark:text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Start free, upgrade when you're ready for more advanced features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative ${
                  plan.popular 
                    ? 'bg-white dark:bg-gray-800 border-black dark:border-white ring-2 ring-black dark:ring-white' 
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-black dark:bg-white text-white dark:text-black">
                      <Crown className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-gray-900 dark:text-white">{plan.name}</CardTitle>
                  <div className="py-4">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                    <span className="text-gray-500 dark:text-gray-400">/{plan.period}</span>
                  </div>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-black dark:text-white" />
                        <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                    variant={plan.buttonVariant}
                    size="lg"
                    onClick={() => setLocation("/auth")}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by Traders Worldwide
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              See what our users are saying about their trading journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-slate-900/50 border-slate-700">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-300 mb-6">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-slate-400">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Trading?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Join thousands of traders who have improved their performance with TradeJournal.
              Start your free trial today and see the difference data-driven trading can make.
            </p>
            <Button 
              size="lg" 
              className="bg-emerald-500 hover:bg-emerald-600 text-lg px-8"
              onClick={() => setLocation("/auth")}
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-900/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-semibold">TradeJournal</span>
            </div>
            <div className="text-slate-400 text-sm">
              © 2024 TradeJournal. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}