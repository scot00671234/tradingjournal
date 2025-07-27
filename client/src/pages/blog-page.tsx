import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, User, TrendingUp, Brain, Shield, BarChart3 } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  image?: string;
  seoTitle: string;
  metaDescription: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "crypto-trading-psychology",
    title: "Master Your Trading Psychology: 7 Mental Traps That Destroy Crypto Profits",
    excerpt: "Discover the psychological pitfalls that cause 90% of crypto traders to lose money and learn proven strategies to maintain emotional discipline.",
    content: "",
    author: "Trading Team",
    date: "2025-01-27",
    readTime: "8 min read",
    category: "Psychology",
    tags: ["Trading Psychology", "Emotional Control", "Risk Management"],
    seoTitle: "Crypto Trading Psychology: Master Your Mind to Maximize Profits",
    metaDescription: "Learn how to overcome emotional trading mistakes that destroy crypto profits. Master trading psychology with proven strategies from professional traders."
  },
  {
    id: "risk-management-strategies",
    title: "Risk Management Strategies That Actually Work in Volatile Crypto Markets",
    excerpt: "Professional risk management techniques that protect your capital during extreme market volatility and help you survive crypto winters.",
    content: "",
    author: "Trading Team",
    date: "2025-01-26",
    readTime: "12 min read",
    category: "Risk Management",
    tags: ["Risk Management", "Position Sizing", "Stop Loss"],
    seoTitle: "Crypto Risk Management: Strategies for Volatile Markets 2025",
    metaDescription: "Discover professional risk management strategies for crypto trading. Learn position sizing, stop loss techniques, and capital preservation methods."
  },
  {
    id: "technical-analysis-guide",
    title: "Technical Analysis for Crypto: Complete Guide to Reading Charts Like a Pro",
    excerpt: "Master chart patterns, indicators, and technical analysis techniques specifically designed for cryptocurrency market dynamics.",
    content: "",
    author: "Trading Team",
    date: "2025-01-25",
    readTime: "15 min read",
    category: "Technical Analysis",
    tags: ["Technical Analysis", "Chart Patterns", "Indicators"],
    seoTitle: "Crypto Technical Analysis Guide: Read Charts Like a Professional",
    metaDescription: "Complete guide to crypto technical analysis. Master chart patterns, indicators, and trading techniques for cryptocurrency markets."
  },
  {
    id: "trading-journal-benefits",
    title: "Why 95% of Profitable Traders Keep a Trading Journal (And How to Start Yours)",
    excerpt: "Discover why systematic trade journaling is the secret weapon of consistently profitable traders and how to implement it effectively.",
    content: "",
    author: "Trading Team",
    date: "2025-01-24",
    readTime: "10 min read",
    category: "Trading Strategy",
    tags: ["Trading Journal", "Performance Tracking", "Strategy"],
    seoTitle: "Trading Journal Benefits: Why Profitable Traders Journal Every Trade",
    metaDescription: "Learn why 95% of profitable traders keep trading journals. Discover how to start journaling trades for better performance and consistent profits."
  },
  {
    id: "crypto-market-cycles",
    title: "Understanding Crypto Market Cycles: How to Trade Bull and Bear Markets",
    excerpt: "Navigate crypto market cycles like a professional with strategies tailored for bull runs, bear markets, and sideways action.",
    content: "",
    author: "Trading Team",
    date: "2025-01-23",
    readTime: "11 min read",
    category: "Market Analysis",
    tags: ["Market Cycles", "Bull Market", "Bear Market"],
    seoTitle: "Crypto Market Cycles Guide: Trading Bull and Bear Markets 2025",
    metaDescription: "Master crypto market cycles with professional trading strategies for bull markets, bear markets, and sideways price action."
  },
  {
    id: "position-sizing-guide",
    title: "Position Sizing in Crypto: The Math Behind Consistent Profits",
    excerpt: "Learn the mathematical approach to position sizing that separates professional traders from gamblers in the crypto space.",
    content: "",
    author: "Trading Team",
    date: "2025-01-22",
    readTime: "9 min read",
    category: "Risk Management",
    tags: ["Position Sizing", "Money Management", "Risk Control"],
    seoTitle: "Crypto Position Sizing: Mathematical Approach to Trading Success",
    metaDescription: "Master position sizing for crypto trading. Learn the mathematical approach professionals use for consistent profits and risk control."
  }
];

const categoryIcons = {
  "Psychology": Brain,
  "Risk Management": Shield,
  "Technical Analysis": BarChart3,
  "Trading Strategy": TrendingUp,
  "Market Analysis": TrendingUp
};

export default function BlogPage() {
  const [, setLocation] = useLocation();

  const getCategoryIcon = (category: string) => {
    const Icon = categoryIcons[category as keyof typeof categoryIcons] || TrendingUp;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="border-b border-gray-100 dark:border-gray-900 bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setLocation("/")}
                className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <div className="text-2xl font-bold text-black dark:text-white">
                CoinFeedly Blog
              </div>
            </div>
            <Button 
              onClick={() => setLocation("/auth")}
              className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black"
            >
              Start Trading Journal
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gray-50/50 dark:bg-gray-950/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl lg:text-6xl font-bold text-black dark:text-white mb-6 tracking-tight">
              Trading Insights
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Professional strategies, psychology, and analysis to help you become a consistently profitable crypto trader.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-sm bg-white dark:bg-gray-950 hover:shadow-md transition-all duration-300 group cursor-pointer"
                      onClick={() => setLocation(`/blog/${post.id}`)}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        {getCategoryIcon(post.category)}
                        <span>{post.category}</span>
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3 mr-1" />
                        {post.readTime}
                      </div>
                    </div>
                    <CardTitle className="text-xl font-semibold text-black dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors line-clamp-2">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <User className="h-3 w-3 mr-1" />
                        {post.author}
                      </div>
                      <time className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(post.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </time>
                    </div>
                  </CardContent>
                </Card>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50/50 dark:bg-gray-950/50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-black dark:text-white mb-4">
            Ready to apply these strategies?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Start tracking your trades with CoinFeedly and implement these professional techniques.
          </p>
          <Button 
            size="lg"
            onClick={() => setLocation("/auth")}
            className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black px-8 py-3 h-auto font-medium"
          >
            Start Your Trading Journal
          </Button>
        </div>
      </section>
    </div>
  );
}