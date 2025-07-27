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
  DollarSign
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-br from-green-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl px-4"
      >
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-2xl shadow-black/5">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <motion.div 
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    CoinFeedly
                  </h1>
                  <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">AI-Powered Trading Journal</span>
                </div>
              </motion.div>
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-300 font-medium"
                  onClick={() => setLocation("/auth")}
                >
                  Login
                </Button>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold px-6"
                    onClick={() => setLocation("/auth")}
                  >
                    Start Free Trial
                    <Sparkles className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative">
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Badge className="mb-8 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700/50 backdrop-blur-sm text-sm px-4 py-2 font-semibold shadow-lg">
              <Rocket className="w-4 h-4 mr-2" />
              Join 47,000+ profitable traders making $2M+ monthly
            </Badge>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
              Stop Losing Money
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-4xl md:text-5xl">
              Start Winning Trades
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed font-medium"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            AI-powered trading journal that <span className="text-green-600 font-bold">automatically identifies your winning patterns</span> and 
            <span className="text-red-600 font-bold"> eliminates losing strategies</span>. 
            <br className="hidden md:block" />
            <span className="text-blue-600 font-bold">Average user increases profit by 187% in 90 days.</span>
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-lg px-12 py-4 rounded-2xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 font-bold"
                onClick={() => setLocation("/auth")}
              >
                <DollarSign className="w-6 h-6 mr-2" />
                Start Making Profit Now
                <ChevronRight className="w-6 h-6 ml-2" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button 
                variant="outline"
                size="lg" 
                className="border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-lg px-8 py-4 rounded-2xl backdrop-blur-sm font-semibold"
                onClick={() => setLocation("/auth")}
              >
                <Eye className="w-5 h-5 mr-2" />
                Watch Demo (2 min)
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="text-center text-sm text-slate-500 dark:text-slate-400 space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <p className="font-semibold">⚡ 14-day free trial • No credit card required • Cancel anytime</p>
            <div className="flex justify-center items-center space-x-6 text-xs">
              <span className="flex items-center">
                <Check className="w-4 h-4 mr-1 text-green-500" />
                47,000+ active traders
              </span>
              <span className="flex items-center">
                <Check className="w-4 h-4 mr-1 text-green-500" />
                $2.1M+ profits tracked monthly
              </span>
              <span className="flex items-center">
                <Check className="w-4 h-4 mr-1 text-green-500" />
                4.9/5 rating (2,847 reviews)
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4 relative">
        <div className="container mx-auto relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Why Traders Love CoinFeedly
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-medium">
              The only trading journal that actually makes you money.
              <br />
              <span className="text-green-600 font-bold">Stop guessing. Start profiting.</span>
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <Card className="h-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:border-white/40 dark:hover:border-slate-600/50">
                  <CardHeader className="pb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20"></div>
        <div className="container mx-auto relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Invest In Your Trading Success
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-medium">
              <span className="text-green-600 font-bold">Average ROI: 380% in first year.</span>
              <br />
              One profitable trade pays for itself forever.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <Card 
                  className={`relative h-full ${
                    plan.popular 
                      ? 'bg-gradient-to-br from-white/80 to-blue-50/80 dark:from-slate-900/80 dark:to-blue-950/80 backdrop-blur-xl border-blue-200 dark:border-blue-700 ring-2 ring-blue-300/50 dark:ring-blue-600/50 shadow-2xl shadow-blue-500/10' 
                      : 'bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl'
                  } transition-all duration-500 hover:shadow-2xl`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
                        <Crown className="w-4 h-4 mr-1" />
                        Most Popular - Save 40%
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</CardTitle>
                    <div className="py-6">
                      <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{plan.price}</span>
                      <span className="text-slate-500 dark:text-slate-400 text-lg">/{plan.period}</span>
                    </div>
                    <CardDescription className="text-lg text-slate-600 dark:text-slate-300 font-medium">
                      {plan.description}
                    </CardDescription>
                    <div className="mt-4 text-sm font-semibold text-green-600 dark:text-green-400">
                      {plan.savings}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-8">
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3">
                          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-slate-700 dark:text-slate-300 font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        className={`w-full py-4 text-lg font-bold rounded-2xl transition-all duration-300 ${
                          plan.popular 
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                        }`}
                        onClick={() => setLocation("/auth")}
                      >
                        {plan.buttonText}
                        {plan.popular && <Sparkles className="w-5 h-5 ml-2" />}
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <p className="text-slate-600 dark:text-slate-400 font-medium mb-4">
              🔒 30-day money-back guarantee • Cancel anytime • No setup fees
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              Join 47,000+ traders who've already transformed their trading with CoinFeedly
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 px-4 relative">
        <div className="container mx-auto relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Real Traders, Real Results
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-medium">
              Don't just take our word for it.
              <br />
              <span className="text-green-600 font-bold">See how CoinFeedly transformed their trading.</span>
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <Card className="h-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:border-white/40 dark:hover:border-slate-600/50">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    
                    <blockquote className="text-slate-700 dark:text-slate-300 mb-6 text-lg leading-relaxed font-medium">
                      "{testimonial.content}"
                    </blockquote>
                    
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {testimonial.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-slate-900 dark:text-white text-lg">{testimonial.name}</div>
                          <div className="text-slate-600 dark:text-slate-400 text-sm font-medium">{testimonial.role}</div>
                          <div className="text-green-600 dark:text-green-400 text-sm font-bold mt-1">
                            {testimonial.profit}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-green-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto text-center relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Your Next Profitable Trade
              <br />
              <span className="text-2xl md:text-3xl text-blue-200">Starts Here</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-12 font-medium leading-relaxed">
              Stop leaving money on the table. Join 47,000+ traders who've already discovered
              <br className="hidden md:block" />
              <span className="text-yellow-300 font-bold">the patterns that actually make money.</span>
            </p>
            
            <motion.div 
              className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-12"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-blue-50 text-xl px-12 py-6 rounded-2xl shadow-2xl font-bold border-2 border-white/20"
                  onClick={() => setLocation("/auth")}
                >
                  <Trophy className="w-6 h-6 mr-3" />
                  Start Winning Trades Now
                  <ChevronRight className="w-6 h-6 ml-3" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button 
                  variant="outline"
                  size="lg" 
                  className="border-2 border-white/40 text-white hover:bg-white/10 text-xl px-8 py-6 rounded-2xl backdrop-blur-sm font-semibold"
                  onClick={() => setLocation("/auth")}
                >
                  <Eye className="w-5 h-5 mr-2" />
                  Watch Success Stories
                </Button>
              </motion.div>
            </motion.div>

            <motion.div 
              className="text-white/80 text-sm space-y-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <p className="font-semibold text-lg">⚡ 14-day free trial • No credit card • 30-day money-back guarantee</p>
              <div className="flex justify-center items-center space-x-8 text-white/70">
                <span className="flex items-center">
                  <Check className="w-4 h-4 mr-1 text-green-300" />
                  Setup in 60 seconds
                </span>
                <span className="flex items-center">
                  <Check className="w-4 h-4 mr-1 text-green-300" />
                  Cancel anytime
                </span>
                <span className="flex items-center">
                  <Check className="w-4 h-4 mr-1 text-green-300" />
                  No setup fees
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/80 backdrop-blur-xl border-t border-white/10">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3 mb-6 md:mb-0"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-white font-bold text-xl">CoinFeedly</span>
                <div className="text-slate-400 text-sm">AI-Powered Trading Journal</div>
              </div>
            </motion.div>
            <div className="text-slate-400 text-sm text-center md:text-right">
              <div className="mb-2">© 2025 CoinFeedly. All rights reserved.</div>
              <div className="text-xs">
                Trusted by 47,000+ traders • $2.1M+ profits tracked monthly
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}