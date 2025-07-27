import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { 
  TrendingUp, 
  BarChart3, 
  Target, 
  Check, 
  ArrowRight,
  Play,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import oceanWaves from "@assets/pexels-pok-rie-33563-2064749_1753621776275.jpg";

export default function LandingPage() {
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: BarChart3,
      title: "Track Every Trade",
      description: "Build an unbreakable record of your wins and losses. Turn trading from gambling into a data-driven business."
    },
    {
      icon: TrendingUp,
      title: "Master Your Edge", 
      description: "Identify the patterns that print money. Eliminate the trades that drain your account. Scale what works."
    },
    {
      icon: Target,
      title: "Control Your Mind",
      description: "Document your emotions and decisions. Break bad habits. Develop the discipline of profitable traders."
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
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Glassy Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/60 dark:bg-black/60 backdrop-blur-2xl border-b border-white/20 dark:border-gray-700/30 shadow-lg shadow-black/5 dark:shadow-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-semibold text-black dark:text-white">
              CoinFeedly
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">Features</a>
              <a href="#pricing" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">Pricing</a>
              <Button variant="outline" size="sm" onClick={() => setLocation("/auth")}>
                Sign In
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden">
        {/* Ocean Wave Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src={oceanWaves} 
            alt="Ocean waves" 
            className="w-full h-full object-cover opacity-20 dark:opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/50 to-white/90 dark:from-black/70 dark:via-black/50 dark:to-black/90"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300">
              <Sparkles className="w-3 h-3 mr-2" />
              Professional Trading Journal
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl lg:text-7xl font-bold text-black dark:text-white mb-6 tracking-tight leading-none"
          >
            Winners journal.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-2xl lg:text-3xl text-gray-600 dark:text-gray-400 mb-8 font-light italic"
          >
            Losers just remember.
          </motion.p>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Transform your trading into a systematic wealth-building machine. Track every trade, master your psychology, and unlock the financial freedom you've been chasing.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button 
              size="lg" 
              onClick={() => setLocation("/auth")}
              className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black px-8 py-3 h-auto font-medium"
            >
              Start 7-Day Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="lg"
              onClick={() => setLocation("/dashboard")}
              className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white px-6 py-3 h-auto"
            >
              <Play className="mr-2 h-4 w-4" />
              View Demo
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50/50 dark:bg-gray-950/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-black dark:text-white mb-4 tracking-tight">
              Turn trading into your money machine
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Professional tools to track patterns, eliminate emotions, and build consistent profits that compound into life-changing wealth.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-sm bg-white dark:bg-black hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="text-center pb-4">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-black dark:text-white">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-black dark:text-white mb-4 tracking-tight">
              Simple, honest pricing
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              All plans include a 7-day free trial. No hidden fees or complicated tiers.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`relative border shadow-sm hover:shadow-md transition-shadow duration-200 ${
                  plan.popular 
                    ? 'border-black dark:border-white' 
                    : 'border-gray-200 dark:border-gray-800'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-black dark:bg-white text-white dark:text-black text-xs font-medium px-3 py-1 rounded-full">
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
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      {plan.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-gray-700 dark:text-gray-300">
                          <Check className="h-4 w-4 text-black dark:text-white mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black' 
                          : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 text-black dark:text-white'
                      }`}
                      onClick={() => setLocation("/auth")}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-50/50 dark:bg-gray-950/50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-black dark:text-white mb-4 tracking-tight">
            Ready to become consistently profitable?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Stop losing money to emotional trades. Start building the systematic approach that turns trading into wealth.
          </p>
          
          <Button 
            size="lg" 
            onClick={() => setLocation("/auth")}
            className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black px-8 py-3 h-auto font-medium"
          >
            Start 7-Day Free Trial
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <div className="text-xl font-semibold text-black dark:text-white mb-4">
              CoinFeedly
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
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