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

      {/* Hero Section - Premium Apple/Vercel Style */}
      <section className="relative pt-24 pb-20 px-6 overflow-hidden">
        {/* Premium gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%)]"></div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 px-4 py-2 rounded-full text-sm text-gray-600 dark:text-gray-400 shadow-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Trusted by 47,000+ traders worldwide
              </div>
            </motion.div>

            <motion.h1 
              className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 text-gray-900 dark:text-white tracking-tight leading-[0.9]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              The trading journal
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-600">
                professionals use
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Transform your trading with institutional-grade analytics, AI-powered insights, and the most beautiful interface ever created for traders.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => setLocation("/auth")}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Trading Smarter
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline"
                size="lg" 
                className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-4 rounded-xl font-semibold backdrop-blur-sm transition-all duration-300"
                onClick={() => setLocation("/auth")}
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </motion.div>

            <motion.div 
              className="flex justify-center items-center gap-8 text-sm text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                Enterprise security
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-500" />
                Real-time sync
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-500" />
                Award winning
              </div>
            </motion.div>
          </div>

          {/* Dashboard Preview */}
          <motion.div
            className="relative max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.8 }}
          >
            <div className="relative">
              {/* Glass container for dashboard */}
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl p-8">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Live Dashboard Preview</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Real-time data
                    </div>
                  </div>
                </div>
                
                {/* Mock dashboard content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Performance Chart */}
                  <div className="lg:col-span-2 bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Portfolio Performance</h4>
                      <div className="text-sm text-green-600 dark:text-green-400 font-medium">+23.4%</div>
                    </div>
                    <div className="h-48 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg flex items-end justify-between p-4">
                      {[40, 60, 45, 80, 65, 90, 75, 95].map((height, i) => (
                        <div key={i} className={`bg-gradient-to-t from-blue-500 to-purple-500 rounded-t w-8`} style={{height: `${height}%`}}></div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Win Rate</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">73.2%</div>
                      <div className="text-xs text-green-600 dark:text-green-400">↗ +5.2%</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Profit Factor</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">2.84</div>
                      <div className="text-xs text-green-600 dark:text-green-400">↗ +0.3</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Trades</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">1,247</div>
                      <div className="text-xs text-blue-600 dark:text-blue-400">This month</div>
                    </div>
                  </div>
                </div>
                
                {/* Recent trades */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Trades</h4>
                  <div className="space-y-3">
                    {[
                      { symbol: 'BTC/USD', pnl: '+$1,234', time: '2 min ago', color: 'green' },
                      { symbol: 'ETH/USD', pnl: '+$892', time: '5 min ago', color: 'green' },
                      { symbol: 'SOL/USD', pnl: '-$156', time: '12 min ago', color: 'red' }
                    ].map((trade, i) => (
                      <div key={i} className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">₿</div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{trade.symbol}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{trade.time}</div>
                          </div>
                        </div>
                        <div className={`font-semibold ${trade.color === 'green' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {trade.pnl}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-xl opacity-60 animate-pulse"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-purple-500 to pink-500 rounded-full blur-xl opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
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

      {/* Premium Features Showcase */}
      <section className="py-32 px-6 relative overflow-hidden">
        {/* Premium background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.02),transparent_50%)]"></div>
        
        <div className="relative max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">professional</span> traders
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Every feature engineered to give you the competitive edge that separates winning traders from the rest.
            </p>
          </motion.div>

          {/* Interactive Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* AI Analytics Feature */}
            <motion.div
              className="group"
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-3xl p-8 shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">AI Pattern Recognition</h3>
                    <p className="text-gray-600 dark:text-gray-400">Institutional-grade intelligence</p>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                  Our AI analyzes 10,000+ data points from your trades to identify profitable patterns you never knew existed. 
                  <span className="font-semibold text-purple-600 dark:text-purple-400"> Average 34% improvement in win rate.</span>
                </p>
                
                {/* Mini preview */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Pattern Detected: Morning Breakout</span>
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded">87% Win Rate</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Time Range</span>
                      <span className="text-gray-900 dark:text-white">9:30-10:30 AM EST</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Avg Profit</span>
                      <span className="text-green-600 dark:text-green-400 font-semibold">+$1,247</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Real-time Sync Feature */}
            <motion.div
              className="group"
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-3xl p-8 shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Universal Exchange Sync</h3>
                    <p className="text-gray-600 dark:text-gray-400">Zero manual work</p>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                  Connect any exchange in 30 seconds. Binance, Coinbase, Bybit, or custom APIs. 
                  <span className="font-semibold text-blue-600 dark:text-blue-400"> Your trades sync instantly.</span>
                </p>
                
                {/* Exchange logos preview */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-3">Connected Exchanges</div>
                  <div className="flex items-center gap-4">
                    {['Binance', 'Coinbase', 'Bybit', 'Kraken'].map((exchange, i) => (
                      <div key={i} className="flex items-center gap-2 bg-white dark:bg-gray-700 px-3 py-2 rounded-lg shadow-sm">
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{exchange[0]}</span>
                        </div>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{exchange}</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Risk Management Feature */}
            <motion.div
              className="group"
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-3xl p-8 shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Risk Protection System</h3>
                    <p className="text-gray-600 dark:text-gray-400">Never blow your account</p>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                  Real-time drawdown alerts, position sizing calculator, and risk-reward optimization. 
                  <span className="font-semibold text-red-600 dark:text-red-400"> Prevents 95% of account blow-ups.</span>
                </p>
                
                {/* Risk dashboard preview */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Account Risk Level</span>
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded">SAFE</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Max Drawdown</span>
                      <span className="text-sm text-gray-900 dark:text-white font-medium">8.2% / 15%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '55%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Mobile App Feature */}
            <motion.div
              className="group"
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-3xl p-8 shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Smartphone className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Native Mobile Apps</h3>
                    <p className="text-gray-600 dark:text-gray-400">Trade anywhere, anytime</p>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                  Full-featured iOS and Android apps with offline support, push notifications, and Touch ID security. 
                  <span className="font-semibold text-green-600 dark:text-green-400"> 4.9★ rating on App Store.</span>
                </p>
                
                {/* App preview */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-3">Available On</div>
                  <div className="flex gap-3">
                    <div className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
                      <div className="w-4 h-4 bg-white rounded-sm"></div>
                      App Store
                    </div>
                    <div className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
                      <div className="w-4 h-4 bg-white rounded-sm"></div>
                      Google Play
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stats Banner */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white shadow-2xl">
              <h3 className="text-3xl md:text-4xl font-bold mb-8">Trusted by the world's best traders</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <div className="text-4xl md:text-5xl font-bold mb-2">47,000+</div>
                  <div className="text-blue-100">Active Traders</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold mb-2">$2.1B</div>
                  <div className="text-blue-100">Volume Tracked</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold mb-2">127%</div>
                  <div className="text-blue-100">Avg Performance Boost</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold mb-2">4.9★</div>
                  <div className="text-blue-100">User Rating</div>
                </div>
              </div>
            </div>
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