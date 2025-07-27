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
import luxuryCar from "@assets/pexels-pixabay-326259_1753623060677.jpg";
import luxuryRoom from "@assets/pexels-joao-gustavo-rezende-15265-68389_1753623060676.jpg";
import watchCollection from "@assets/pexels-bemistermister-380782_1753623060677.jpg";
import penthouseView from "@assets/pexels-rpnickson-2417842_1753623060678.jpg";
import tradingCharts from "@assets/pexels-energepic-com-27411-159888_1753623332929.jpg";
import bmwTrading from "@assets/pexels-dvaughnbell-2068664_1753623332929.jpg";
import modernVilla from "@assets/pexels-alex-staudinger-829197-1732414_1753624512468.jpg";
import rolexWatch from "@assets/pexels-pixabay-364822_1753624512469.jpg";
import porscheSports from "@assets/pexels-adrian-dorobantu-989175-2127740_1753624512469.jpg";
import tropicalVilla from "@assets/pexels-asadphoto-3155666_1753624512470.jpg";

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
        {/* Luxury Car Hero Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src={luxuryCar} 
            alt="Luxury car interior" 
            className="w-full h-full object-cover opacity-30 dark:opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/90 dark:from-black/80 dark:via-black/60 dark:to-black/90"></div>
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

      {/* Features Section with Lifestyle Images */}
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
            {features.map((feature, index) => {
              const featureImages = [tradingCharts, luxuryRoom, bmwTrading];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="border-0 shadow-sm bg-white dark:bg-black hover:shadow-md transition-shadow duration-200 overflow-hidden">
                    {/* Feature Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={featureImages[index]} 
                        alt={`${feature.title} lifestyle`}
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <feature.icon className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    <CardHeader className="text-center pb-4">
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
              );
            })}
          </div>
        </div>
      </section>

      {/* Lifestyle Gallery - Visual Aspirations */}
      <section className="py-32 bg-gradient-to-b from-white to-gray-50/30 dark:from-black dark:to-gray-950/30 relative overflow-hidden">
        {/* Subtle background patterns */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.05]">
          <div className="absolute top-1/4 left-1/6 w-20 h-20 rounded-full bg-black dark:bg-white blur-xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-16 h-16 rounded-full bg-black dark:bg-white blur-xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header with improved spacing */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl lg:text-6xl font-bold text-black dark:text-white mb-8 tracking-tight leading-tight">
              Unlock Your Potential
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Discipline your trades. Command your future.
            </p>
          </motion.div>

          {/* Main Gallery Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">
            {/* Hero Villa - Large */}
            <motion.div 
              className="lg:col-span-8 relative h-80 lg:h-96 rounded-2xl overflow-hidden group"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              whileHover={{ scale: 1.02 }}
            >
              <img 
                src={modernVilla} 
                alt="Modern architecture"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </motion.div>

            {/* Side Stack */}
            <div className="lg:col-span-4 space-y-6">
              <motion.div 
                className="relative h-36 lg:h-44 rounded-2xl overflow-hidden group"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                whileHover={{ scale: 1.03 }}
              >
                <img 
                  src={rolexWatch} 
                  alt="Precision craftsmanship"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </motion.div>

              <motion.div 
                className="relative h-36 lg:h-44 rounded-2xl overflow-hidden group"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.4 }}
                whileHover={{ scale: 1.03 }}
              >
                <img 
                  src={porscheSports} 
                  alt="Engineering excellence"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </motion.div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              className="relative h-64 rounded-2xl overflow-hidden group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <img 
                src={tropicalVilla} 
                alt="Freedom redefined"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </motion.div>

            <motion.div 
              className="relative h-64 rounded-2xl overflow-hidden group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <img 
                src={penthouseView} 
                alt="Elevated perspective"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </motion.div>
          </div>

          {/* Subtle Call to Action */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-center mt-20"
          >
            <p className="text-lg text-gray-500 dark:text-gray-500 italic max-w-2xl mx-auto">
              The goal you envision isn't just a dream. It's the inevitable result of disciplined trading.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gray-50/50 dark:bg-gray-950/50">
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

      {/* CTA Section with Penthouse Background */}
      <section className="relative py-24 overflow-hidden">
        {/* Penthouse Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src={penthouseView} 
            alt="Luxury penthouse view" 
            className="w-full h-full object-cover opacity-20 dark:opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/80 to-white/90 dark:from-black/90 dark:via-black/80 dark:to-black/90"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-black dark:text-white mb-4 tracking-tight">
            Ready to become consistently profitable?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Stop losing money to emotional trades. Start building the systematic approach that turns trading into wealth.
          </p>
          
          <Button 
            size="lg" 
            onClick={() => setLocation("/auth")}
            className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black px-8 py-3 h-auto font-medium shadow-lg"
          >
            Start 7-Day Free Trial
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Modern Clean Footer */}
      <footer className="bg-white dark:bg-black border-t border-gray-100 dark:border-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand Column */}
            <div className="md:col-span-1">
              <div className="text-2xl font-bold text-black dark:text-white mb-4">
                CoinFeedly
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
                The professional trading journal for serious crypto traders who want to build systematic wealth.
              </p>
              <div className="flex space-x-4">
                <Button 
                  size="sm" 
                  onClick={() => setLocation("/auth")}
                  className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black text-sm"
                >
                  Start Free Trial
                </Button>
              </div>
            </div>

            {/* Product Column */}
            <div>
              <h3 className="font-semibold text-black dark:text-white mb-4">Product</h3>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#features" className="hover:text-black dark:hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-black dark:hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/dashboard" className="hover:text-black dark:hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="/auth" className="hover:text-black dark:hover:text-white transition-colors">Sign Up</a></li>
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h3 className="font-semibold text-black dark:text-white mb-4">Resources</h3>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="/blog" className="hover:text-black dark:hover:text-white transition-colors">Blog</a></li>
                <li><a href="/blog/crypto-trading-psychology" className="hover:text-black dark:hover:text-white transition-colors">Trading Psychology</a></li>
                <li><a href="/blog/risk-management-strategies" className="hover:text-black dark:hover:text-white transition-colors">Risk Management</a></li>
                <li><a href="/blog/technical-analysis-guide" className="hover:text-black dark:hover:text-white transition-colors">Technical Analysis</a></li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="font-semibold text-black dark:text-white mb-4">Company</h3>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="/about" className="hover:text-black dark:hover:text-white transition-colors">About</a></li>
                <li><a href="/contact" className="hover:text-black dark:hover:text-white transition-colors">Contact</a></li>
                <li><a href="/privacy" className="hover:text-black dark:hover:text-white transition-colors">Privacy</a></li>
                <li><a href="/terms" className="hover:text-black dark:hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-100 dark:border-gray-900 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-4 md:mb-0">
                © 2025 CoinFeedly. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-500">
                <span>Built for serious traders</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>All systems operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}