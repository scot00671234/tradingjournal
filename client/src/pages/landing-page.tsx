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
import heroVideo from "@assets/Copy of Black and White Modern Quote Motivation Success Video_1753634070768.mp4";
import coinFeedlyLogo from "@assets/logo coin feedly (1)_1753637229790.png";

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
        "1GB storage",
        "1 trading account",
        "Advanced analytics", 
        "Trade screenshots",
        "Custom tags & notes"
      ],
      buttonText: "Start for free now",
      popular: false
    },
    {
      name: "Elite",
      price: "$49", 
      period: "month",
      description: "For professional traders",
      features: [
        "Everything in Pro +",
        "5GB storage",
        "10 trading accounts",
        "Advanced risk metrics",
        "Priority support",
        "Portfolio optimization"
      ],
      buttonText: "Start for free now",
      popular: true
    },
    {
      name: "Diamond",
      price: "$89",
      period: "month", 
      description: "For trading teams",
      features: [
        "Everything in Elite +",
        "10GB storage",
        "20 trading accounts",
        "Advanced reporting",
        "Custom analytics",
        "Team collaboration"
      ],
      buttonText: "Start for free now",
      popular: false
    },
    {
      name: "Enterprise",
      price: "$129",
      period: "month",
      description: "For institutions",
      features: [
        "Everything in Diamond +", 
        "30GB storage",
        "Unlimited accounts",
        "Custom integrations",
        "Dedicated support",
        "White-label options"
      ],
      buttonText: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Glassy Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-2xl border-b border-yellow-100/30 dark:border-yellow-900/30 shadow-lg shadow-yellow-500/5 dark:shadow-yellow-400/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src={coinFeedlyLogo} 
                alt="CoinFeedly" 
                className="h-8 w-auto"
              />
              <span className="ml-3 text-xl font-light tracking-wider text-black dark:text-white">
                Coin<span className="font-medium ml-1">Feedly</span>
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">Features</a>
              <a href="#pricing" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">Pricing</a>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setLocation("/auth")}
                className="border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-950/50"
              >
                Sign In
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden">
        {/* Hero Video Background */}
        <div className="absolute inset-0 z-0">
          <video 
            src={heroVideo} 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover opacity-50 dark:opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/70 dark:from-black/60 dark:via-black/40 dark:to-black/70"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-yellow-50 dark:bg-yellow-950/50 border border-yellow-200 dark:border-yellow-800 text-xs font-medium text-yellow-700 dark:text-yellow-300">
              <Sparkles className="w-3 h-3 mr-2" />
              Professional Trading Journal
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl lg:text-6xl font-bold text-black dark:text-white mb-6 tracking-tight leading-tight"
          >
            Imagine where you'd be if you tracked every trade.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl lg:text-2xl text-gray-600 dark:text-gray-400 mb-8 font-light leading-relaxed"
          >
            Have you imagined yet? Now live it with the trading journal that separates winners from losers.
          </motion.p>



          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button 
              size="lg" 
              variant="ghost"
              onClick={() => setLocation("/auth")}
              className="bg-yellow-400 hover:bg-yellow-400 text-white border-none font-medium px-8 py-3 h-auto rounded-full transition-all duration-200 shadow-lg"
            >
              Start for free now
              <ArrowRight className="ml-2 h-4 w-4 text-white" />
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

      {/* Second Hero - Transformation Section */}
      <section className="py-32 bg-gradient-to-b from-gray-50/30 to-white dark:from-gray-950/30 dark:to-black relative overflow-hidden">
        {/* Subtle background elements */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.08]">
          <div className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full bg-yellow-500 blur-3xl"></div>
          <div className="absolute bottom-1/2 right-1/3 w-24 h-24 rounded-full bg-amber-600 blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <h2 className="text-4xl lg:text-6xl font-bold text-black dark:text-white mb-8 tracking-tight leading-tight">
              Winners journal.
              <br />
              <span className="text-gray-600 dark:text-gray-400 font-light italic text-3xl lg:text-5xl">
                Losers just forget.
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <p className="text-xl lg:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto font-light">
              Transform your trading into a systematic wealth-building machine. Track every 
              trade, master your psychology, and unlock the financial freedom you've been chasing.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4">Every Trade Matters</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Build an unbreakable record that reveals your true edge. No trade forgotten, no pattern missed.
              </p>
            </div>

            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4">Master Your Mind</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Document decisions and emotions. Break destructive patterns. Develop unshakeable discipline.
              </p>
            </div>

            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4">Scale What Works</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Identify the setups that print money. Eliminate what drains your account. Compound your edge.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Button 
              size="lg" 
              variant="ghost"
              onClick={() => setLocation("/auth")}
              className="bg-yellow-400 hover:bg-yellow-400 text-white border-none font-medium px-12 py-4 h-auto text-lg rounded-full transition-all duration-200 shadow-lg"
            >
              Start Your Transformation
              <ArrowRight className="ml-2 h-5 w-5 text-white" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Quote Section 1 */}
      <section className="py-20 bg-black dark:bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black dark:from-white dark:via-gray-100 dark:to-white"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <p className="text-2xl lg:text-4xl font-light text-white dark:text-black leading-relaxed tracking-wide">
              You've wasted 100 hours watching charts and learned nothing.
              <br />
              <span className="font-medium text-yellow-400 dark:text-yellow-600 mt-4 block">
                Track 10 trades and you'll learn more than in 10 months.
              </span>
            </p>
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

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gray-50/50 dark:bg-gray-950/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-black dark:text-white mb-6 tracking-tight">
              The price of this journal is nothing.
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-400 mb-12 font-light max-w-3xl mx-auto">
              Compared to what your mistakes are costing you.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
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
                    ? 'border-yellow-400 ring-2 ring-yellow-400/20' 
                    : 'border-gray-200 dark:border-gray-800'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg">
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
                          ? 'bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white shadow-lg shadow-yellow-400/30' 
                          : 'backdrop-blur-[12px] bg-white/80 hover:bg-white/90 dark:bg-gray-900/80 dark:hover:bg-gray-900/90 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
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
          
          {/* Trial Information Below Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              All plans include a 7-day free trial. No hidden fees or complicated tiers.
            </p>
          </motion.div>
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

      {/* Quote Section 2 */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900 dark:from-gray-100 dark:via-white dark:to-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/6 w-40 h-40 rounded-full bg-yellow-500 blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-32 h-32 rounded-full bg-amber-600 blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            <p className="text-2xl lg:text-4xl font-light text-white dark:text-black leading-relaxed tracking-wide mb-6">
              The Market Doesn't Care About Your Feelings.
            </p>
            <p className="text-xl lg:text-3xl font-medium text-yellow-400 dark:text-yellow-600 leading-relaxed tracking-wide">
              But your journal can discipline you towards fortune.
            </p>
          </motion.div>
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
            Tired of emotional trades draining your account?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Build the system. Control your edge.
          </p>
          
          <Button 
            size="lg" 
            onClick={() => setLocation("/auth")}
            className="bg-yellow-400 hover:bg-yellow-400 text-white border-none font-medium px-8 py-3 h-auto rounded-full transition-all duration-200 shadow-lg"
          >
            Start for free now
            <ArrowRight className="ml-2 h-4 w-4 text-white" />
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
                  variant="ghost"
                  onClick={() => setLocation("/auth")}
                  className="btn-golden text-sm"
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
                <li><a href="/auth" className="hover:text-black dark:hover:text-white transition-colors">Login</a></li>
                <li><a href="/auth" className="hover:text-black dark:hover:text-white transition-colors">Get Started</a></li>
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h3 className="font-semibold text-black dark:text-white mb-4">Legal</h3>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="/privacy" className="hover:text-black dark:hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-black dark:hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="/contact" className="hover:text-black dark:hover:text-white transition-colors">Contact</a></li>
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