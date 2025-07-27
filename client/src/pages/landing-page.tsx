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
  Sparkles,
  Zap,
  Shield
} from "lucide-react";
import { motion } from "framer-motion";
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans overflow-x-hidden">
      {/* Floating particles background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#00FFC2]/30 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-[#00FFC2]/20 rounded-full animate-pulse delay-300"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-[#00FFC2]/25 rounded-full animate-pulse delay-700"></div>
      </div>

      {/* Enhanced Header */}
      <motion.header 
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-white/70 dark:bg-black/70 border-b border-white/20 dark:border-gray-800/30 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-3xl font-black text-black dark:text-white tracking-tight bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text">
                CoinFeedly
              </div>
            </motion.div>
            <nav className="hidden md:flex items-center space-x-12">
              <motion.a 
                href="#features" 
                className="text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white transition-all duration-300 font-medium text-lg"
                whileHover={{ y: -2, scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                Features
              </motion.a>
              <motion.a 
                href="#pricing" 
                className="text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white transition-all duration-300 font-medium text-lg"
                whileHover={{ y: -2, scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                Pricing
              </motion.a>
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Button 
                  variant="outline" 
                  onClick={() => setLocation("/auth")}
                  className="glass-morphism border-gray-300/50 dark:border-gray-600/50 hover:border-[#00FFC2]/50 bg-white/50 dark:bg-black/50 backdrop-blur-xl font-medium text-lg px-8 py-3 h-auto"
                >
                  Sign In
                </Button>
              </motion.div>
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Enhanced Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden min-h-screen flex items-center">
        {/* Enhanced Background Image */}
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.15 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src={oceanWaves} 
            alt="Ocean waves" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/60 dark:from-black/60 dark:via-black/40 dark:to-black/60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent dark:from-black/20"></div>
        </div>
        
        <motion.div 
          className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <div className="inline-block mb-8">
              <span className="glass-morphism px-6 py-3 rounded-full text-sm font-medium text-gray-700 dark:text-gray-200 bg-white/30 dark:bg-black/30 backdrop-blur-xl border border-white/20 dark:border-gray-800/20">
                <Sparkles className="inline w-4 h-4 mr-2" />
                Professional Trading Journal
              </span>
            </div>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-5xl lg:text-8xl font-black text-black dark:text-white mb-8 leading-[0.9] tracking-tight"
          >
            <span className="bg-gradient-to-r from-black via-gray-800 to-black dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
              Serious traders
            </span>
            <br />
            <span className="bg-gradient-to-r from-black via-gray-800 to-black dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
              journal.
            </span>
            <br />
            <motion.span 
              className="text-4xl lg:text-6xl text-gray-600 dark:text-gray-400 font-light italic"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              Losers just 'remember.
            </motion.span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-xl lg:text-2xl text-gray-700 dark:text-gray-200 mb-16 max-w-3xl mx-auto leading-relaxed font-light"
          >
            A clean, simple trading journal that helps you track trades, analyze performance, and learn from every decision.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button 
                size="lg" 
                onClick={() => setLocation("/auth")}
                className="bg-gradient-to-r from-[#00FFC2] to-[#00E6AF] hover:from-[#00E6AF] hover:to-[#00D199] text-black font-bold px-12 py-6 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-[#00FFC2]/25 text-lg h-auto border-0"
              >
                <Zap className="mr-3 h-5 w-5" />
                Start 7-Day Free Trial
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button 
                variant="ghost" 
                size="lg"
                onClick={() => setLocation("/dashboard")}
                className="glass-morphism text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white bg-white/30 dark:bg-black/30 backdrop-blur-xl hover:bg-white/50 dark:hover:bg-black/50 border border-white/20 dark:border-gray-800/20 font-medium px-12 py-6 rounded-2xl text-lg h-auto"
              >
                <Play className="mr-3 h-5 w-5" />
                View Demo
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="py-32 bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-950/50 dark:to-black relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00FFC2]/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-6xl font-black text-black dark:text-white mb-6 tracking-tight">
              Everything you need to improve your trading
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
              Simple tools that help you understand your trading patterns and make better decisions.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-10 lg:gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <Card className="glass-morphism border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white/60 dark:bg-black/60 backdrop-blur-xl border border-white/20 dark:border-gray-800/20 h-full">
                  <CardHeader className="text-center pb-6 pt-12">
                    <motion.div 
                      className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-[#00FFC2]/20 to-[#00E6AF]/10 flex items-center justify-center group-hover:from-[#00FFC2]/30 group-hover:to-[#00E6AF]/20 transition-all duration-500"
                      whileHover={{ rotate: 5, scale: 1.1 }}
                    >
                      <feature.icon className="h-10 w-10 text-[#00FFC2] dark:text-[#00FFC2]" />
                    </motion.div>
                    <CardTitle className="text-2xl font-bold text-black dark:text-white mb-4">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center px-8 pb-12">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg font-light">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Pricing Section */}
      <section id="pricing" className="py-32 bg-gradient-to-br from-white to-gray-50/50 dark:from-black dark:to-gray-950/50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#00FFC2]/10 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-6xl font-black text-black dark:text-white mb-6 tracking-tight">
              Simple, honest pricing
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light">
              All plans include a 7-day free trial. No hidden fees or complicated tiers.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -12, scale: 1.02 }}
                className="group relative"
              >
                <Card className={`relative glass-morphism border-2 shadow-2xl hover:shadow-3xl transition-all duration-500 backdrop-blur-xl h-full ${
                  plan.popular 
                    ? 'border-[#00FFC2]/50 bg-gradient-to-br from-[#00FFC2]/10 to-white/60 dark:to-black/60' 
                    : 'border-white/20 dark:border-gray-800/20 bg-white/60 dark:bg-black/60'
                }`}>
                  {plan.popular && (
                    <motion.div 
                      className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                    >
                      <span className="bg-gradient-to-r from-[#00FFC2] to-[#00E6AF] text-black text-sm font-bold px-6 py-2 rounded-full shadow-lg">
                        <Sparkles className="inline w-4 h-4 mr-1" />
                        Most Popular
                      </span>
                    </motion.div>
                  )}
                  
                  <CardHeader className="text-center pb-6 pt-12">
                    <CardTitle className="text-3xl font-black text-black dark:text-white mb-4">
                      {plan.name}
                    </CardTitle>
                    <div className="mb-6">
                      <span className="text-6xl font-black text-black dark:text-white">{plan.price}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-xl font-light">/{plan.period}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-lg font-light">
                      {plan.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="px-8 pb-12">
                    <ul className="space-y-4 mb-12">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.li 
                          key={featureIndex} 
                          className="flex items-center text-gray-700 dark:text-gray-300 text-lg"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: featureIndex * 0.1 }}
                        >
                          <Check className="h-6 w-6 text-[#00FFC2] mr-4 flex-shrink-0" />
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
                    
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        className={`w-full text-lg font-bold py-6 rounded-2xl transition-all duration-300 h-auto ${
                          plan.popular 
                            ? 'bg-gradient-to-r from-[#00FFC2] to-[#00E6AF] hover:from-[#00E6AF] hover:to-[#00D199] text-black shadow-xl hover:shadow-2xl' 
                            : 'glass-morphism bg-white/70 dark:bg-black/70 hover:bg-white/90 dark:hover:bg-black/90 text-black dark:text-white border border-gray-300/50 dark:border-gray-600/50'
                        }`}
                        onClick={() => setLocation("/auth")}
                      >
                        {plan.buttonText}
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00FFC2]/5 via-transparent to-[#00E6AF]/5"></div>
        <motion.div 
          className="max-w-5xl mx-auto px-6 lg:px-8 text-center relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl lg:text-6xl font-black text-black dark:text-white mb-8 tracking-tight">
            Ready to improve your trading?
          </h2>
          <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-16 max-w-3xl mx-auto font-light leading-relaxed">
            Join CoinFeedly today and start building better trading habits with a clean, simple journal.
          </p>
          
          <motion.div
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Button 
              size="lg" 
              onClick={() => setLocation("/auth")}
              className="bg-gradient-to-r from-[#00FFC2] to-[#00E6AF] hover:from-[#00E6AF] hover:to-[#00D199] text-black font-bold px-16 py-8 rounded-3xl transition-all duration-300 shadow-2xl hover:shadow-[#00FFC2]/30 text-xl h-auto border-0"
            >
              <Shield className="mr-4 h-6 w-6" />
              Start 7-Day Free Trial
              <ArrowRight className="ml-4 h-6 w-6" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Enhanced Footer */}
      <footer className="border-t border-gray-200/50 dark:border-gray-800/30 py-20 bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-950/50 dark:to-black backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-3xl font-black text-black dark:text-white mb-6 tracking-tight">
              CoinFeedly
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-12 text-lg font-light">
              A clean, simple trading journal for crypto traders.
            </p>
            <div className="flex justify-center space-x-12 text-gray-500 dark:text-gray-400">
              <motion.a 
                href="#" 
                className="hover:text-black dark:hover:text-white transition-colors font-medium"
                whileHover={{ y: -2 }}
              >
                Privacy
              </motion.a>
              <motion.a 
                href="#" 
                className="hover:text-black dark:hover:text-white transition-colors font-medium"
                whileHover={{ y: -2 }}
              >
                Terms
              </motion.a>
              <motion.a 
                href="#" 
                className="hover:text-black dark:hover:text-white transition-colors font-medium"
                whileHover={{ y: -2 }}
              >
                Support
              </motion.a>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}