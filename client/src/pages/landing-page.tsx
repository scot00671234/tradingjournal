import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { 
  TrendingUp, 
  BarChart3, 
  Target, 
  Check, 
  ArrowRight,
  Play
} from "lucide-react";
import oceanWaves from "@assets/pexels-pok-rie-33563-2064749_1753621776275.jpg";

export default function LandingPage() {
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: BarChart3,
      title: "Track Trades",
      description: "Log every trade with entry, exit, and P&L. Build your trading history systematically."
    },
    {
      icon: TrendingUp,
      title: "Analyze Trends",
      description: "See your performance over time with clear charts. Identify what's working and what isn't."
    },
    {
      icon: Target,
      title: "Reflect & Learn",
      description: "Add notes and tags to trades. Learn from mistakes and replicate successful patterns."
    }
  ];

  const pricingPlans = [
    {
      name: "Pro",
      price: "$29",
      period: "month",
      description: "For serious traders",
      features: [
        "Unlimited trades",
        "Advanced analytics",
        "Trade screenshots",
        "Custom tags & notes",
        "Export data",
        "Performance insights"
      ],
      buttonText: "Start 7-Day Free Trial",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: "Elite",
      price: "$49",
      period: "month",
      description: "For professional traders",
      features: [
        "Everything in Pro +",
        "Advanced risk metrics",
        "Portfolio optimization",
        "Custom strategy analysis",
        "Priority support",
        "API access"
      ],
      buttonText: "Start 7-Day Free Trial",
      buttonVariant: "outline" as const,
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-xl font-semibold text-black dark:text-white">
                CoinFeedly
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Pricing</a>
              <Button variant="outline" onClick={() => setLocation("/auth")}>
                Sign In
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={oceanWaves} 
            alt="Ocean waves" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-white/40 dark:bg-black/40"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-black dark:text-white mb-6 leading-tight">
            Serious traders journal.
            <br />
            <span className="text-gray-700 dark:text-gray-300">Losers just 'remember.</span>
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed">
            A clean, simple trading journal that helps you track trades, analyze performance, and learn from every decision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={() => setLocation("/auth")}
              className="bg-[#00FFC2] hover:bg-[#00E6AF] text-black font-medium px-8 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start 7-Day Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="lg"
              onClick={() => setLocation("/dashboard")}
              className="text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white bg-white/20 backdrop-blur-sm hover:bg-white/30"
            >
              <Play className="mr-2 h-4 w-4" />
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-black dark:text-white mb-4">
              Everything you need to improve your trading
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Simple tools that help you understand your trading patterns and make better decisions.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white dark:bg-gray-900">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-black dark:text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-black dark:text-white mb-4">
            See your trading progress clearly
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Clean charts and simple metrics help you understand what's working in your trading strategy.
          </p>
          <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-8 lg:p-12 shadow-lg">
            <div className="aspect-video bg-white dark:bg-gray-800 rounded-lg shadow-inner flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Dashboard Preview</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Clean analytics and trade history</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-black dark:text-white mb-4">
              Simple, honest pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              All plans include a 7-day free trial. No hidden fees or complicated tiers.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative border-2 shadow-sm hover:shadow-md transition-all duration-200 ${
                plan.popular 
                  ? 'border-[#00FFC2] bg-white dark:bg-gray-900' 
                  : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#00FFC2] text-black text-sm font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-black dark:text-white">
                    {plan.name}
                  </CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-black dark:text-white">{plan.price}</span>
                    <span className="text-gray-500 dark:text-gray-400">/{plan.period}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    {plan.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-700 dark:text-gray-300">
                        <Check className="h-4 w-4 text-[#00FFC2] mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-[#00FFC2] hover:bg-[#00E6AF] text-black' 
                        : 'bg-white hover:bg-gray-50 text-black border border-gray-300'
                    }`}
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

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-black dark:text-white mb-4">
            Ready to improve your trading?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join CoinFeedly today and start building better trading habits with a clean, simple journal.
          </p>
          <Button 
            size="lg" 
            onClick={() => setLocation("/auth")}
            className="bg-[#00FFC2] hover:bg-[#00E6AF] text-black font-medium px-8 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Start 7-Day Free Trial
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-12 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-xl font-semibold text-black dark:text-white mb-4">
              CoinFeedly
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              A clean, simple trading journal for crypto traders.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}