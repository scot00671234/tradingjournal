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
  Zap,
  ChevronRight,
  Sparkles,
  Trophy,
  Rocket,
  Eye,
  Brain,
  DollarSign,
  Play,
  ArrowUpRight,
  Smartphone,
  Lock,
  Award
} from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: Brain,
      title: "Smart Pattern Recognition",
      description: "AI identifies your winning setups automatically. Know exactly which strategies print money.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Zap,
      title: "Instant Exchange Sync",
      description: "Connect Binance, Bybit, or any exchange. Your trades appear in real-time. Zero manual work.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: DollarSign,
      title: "Profit Factor Analytics",
      description: "See exactly how much money each strategy makes. Stop bleeding cash on losing setups.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Target,
      title: "Risk Management Dashboard",
      description: "Prevent account blow-ups with real-time drawdown tracking. Your money is protected.",
      gradient: "from-red-500 to-orange-500"
    },
    {
      icon: Trophy,
      title: "Performance Leaderboard",
      description: "Compare your results with top traders. See how you rank and what to improve.",
      gradient: "from-yellow-500 to-amber-500"
    },
    {
      icon: Eye,
      title: "Trade Screenshot Gallery",
      description: "Visual proof of every setup. Build a library of winning trades to replicate success.",
      gradient: "from-indigo-500 to-purple-500"
    },
  ];

  const pricingPlans = [
    {
      name: "Pro Trader",
      price: "$29",
      period: "month",
      description: "For serious traders ready to scale",
      features: [
        "Unlimited trade tracking",
        "Exchange auto-sync (5 exchanges)",
        "AI pattern recognition",
        "Risk management alerts",
        "Performance analytics",
        "Export to tax software"
      ],
      buttonText: "Start 14-Day Free Trial",
      buttonVariant: "default" as const,
      popular: true,
      savings: "Save $120/year vs manual tracking"
    },
    {
      name: "Elite Trader",
      price: "$49",
      period: "month",
      description: "For professional day traders",
      features: [
        "Everything in Pro +",
        "Unlimited exchanges & APIs",
        "Custom strategy backtesting",
        "Live performance leaderboard",
        "Priority support & coaching",
        "Tax optimization reports"
      ],
      buttonText: "Upgrade to Elite",
      buttonVariant: "outline" as const,
      popular: false,
      savings: "Used by 500+ profitable traders"
    },
  ];

  const testimonials = [
    {
      name: "Alex Chen",
      role: "Day Trader • $2.3M Portfolio",
      content: "Increased my win rate from 52% to 71% in 3 months. The AI pattern recognition is insane - it found setups I didn't even know I was trading.",
      rating: 5,
      profit: "+$180K profit this quarter",
      avatar: "AC"
    },
    {
      name: "Maria Rodriguez", 
      role: "Crypto Trader • $890K Portfolio",
      content: "Used to lose money on emotional trades. CoinFeedly's risk alerts saved me from a $50K loss last week. Worth every penny.",
      rating: 5,
      profit: "Prevented $127K in losses",
      avatar: "MR"
    },
    {
      name: "James Thompson",
      role: "Swing Trader • $1.2M Portfolio", 
      content: "My profit factor went from 1.2 to 2.8. The performance analytics showed me exactly which strategies were bleeding money.",
      rating: 5,
      profit: "2.3x profit increase in 6 months",
      avatar: "JT"
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Subtle Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-gray-100/50 to-gray-200/50 dark:from-gray-800/20 dark:to-gray-700/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-br from-gray-200/50 to-gray-300/50 dark:from-gray-700/20 dark:to-gray-600/20 rounded-full blur-3xl"></div>
      </div>

      {/* Clean Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white dark:text-black" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">CoinFeedly</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Clean, Simple Trading Journal</div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium"
                onClick={() => setLocation("/auth")}
              >
                Login
              </Button>
              <Button 
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 font-medium px-6"
                onClick={() => setLocation("/auth")}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Clean Minimal Style */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Trade Smarter.
            <br />
            <span className="text-gray-500 dark:text-gray-400">
              Your crypto journey, logged.
            </span>
          </motion.h1>
          
          <motion.div 
            className="flex justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Button 
              size="lg" 
              className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 px-8 py-3 rounded-lg font-medium"
              onClick={() => setLocation("/auth")}
            >
              Join CoinFeedly
            </Button>
          </motion.div>

          {/* Three Core Features - Clean Layout */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Track Trades */}
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl flex items-center justify-center mx-auto">
                  <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Track trades</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Easily log details of every coin trade with date, price, and notes for ongoing review.
              </p>
            </div>

            {/* Analyze Trends */}
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl flex items-center justify-center mx-auto">
                  <BarChart3 className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Analyze trends</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Spot trading patterns, review gains and losses, and develop smarter strategies.
              </p>
            </div>

            {/* Reflect & Learn */}
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-2xl flex items-center justify-center mx-auto">
                  <Brain className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Reflect & learn</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Write reflections, record market sentiment, and keep improving long term.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem/Solution Section - Clean Cards */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Problems Column */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Sound familiar?</h2>
              <div className="space-y-6">
                {[
                  'Lost money but don\'t know why?',
                  'Forget your strategy mid-trade?',
                  'No idea how your performance really looks?'
                ].map((problem, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                    <p className="text-lg text-gray-700 dark:text-gray-300">{problem}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Solutions Column */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">CoinFeedly solves this:</h2>
              <div className="space-y-6">
                {[
                  'Log trades with reason, entry, exit',
                  'See P/L over time',
                  'Track emotions & discipline',
                  'See patterns → become a smarter trader'
                ].map((solution, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <p className="text-lg text-gray-700 dark:text-gray-300">{solution}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Used By Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-24 text-center"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-12">Used by:</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
              {[
                'Day traders',
                'Swing traders', 
                'Crypto degens',
                'Stock scalpers',
                'Funded challenge traders'
              ].map((trader, index) => (
                <div key={index} className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{trader}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Clean CTA Section */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Start journaling today
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Elevate your portfolio with daily trade logs.
            </p>
            <Button 
              size="lg" 
              className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 px-8 py-3 rounded-lg font-medium"
              onClick={() => setLocation("/auth")}
            >
              Join CoinFeedly
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section - Clean Vercel Style */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple pricing
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Start free, upgrade when you're ready for more.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`relative p-8 rounded-xl border ${
                  plan.popular 
                    ? 'border-black dark:border-white bg-gray-50 dark:bg-gray-800' 
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                      <span className="text-gray-500 dark:text-gray-400">/{plan.period}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{plan.description}</p>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setLocation("/auth")}
                  >
                    {plan.buttonText}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-500 dark:text-gray-400">
              30-day money-back guarantee • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section - Clean Cards */}
      <section className="py-24 px-6 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What traders are saying
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Real feedback from our community.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <blockquote className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</div>
                      <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                        {testimonial.profit}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section - Clean */}
      <section className="py-24 px-6 bg-black dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to start?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join thousands of traders who've transformed their performance with CoinFeedly.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-gray-100 px-8 py-3 font-medium transition-colors"
                onClick={() => setLocation("/auth")}
              >
                Get Started
              </Button>
              <Button 
                variant="outline"
                size="lg" 
                className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3 font-medium transition-colors"
                onClick={() => setLocation("/auth")}
              >
                Learn More
              </Button>
            </div>

            <p className="text-gray-400 text-sm">
              14-day free trial • No credit card required
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer - Clean */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-6 md:mb-0">
              <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white dark:text-black" />
              </div>
              <div>
                <span className="text-gray-900 dark:text-white font-bold text-lg">CoinFeedly</span>
                <div className="text-gray-500 dark:text-gray-400 text-sm">Trading Journal</div>
              </div>
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-sm text-center md:text-right">
              <div>© 2025 CoinFeedly. All rights reserved.</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}