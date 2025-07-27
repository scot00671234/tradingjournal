import { useLocation, useRoute } from "wouter";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, User, Brain, Shield, BarChart3, TrendingUp } from "lucide-react";

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
  seoTitle: string;
  metaDescription: string;
}

const blogPosts: { [key: string]: BlogPost } = {
  "crypto-trading-psychology": {
    id: "crypto-trading-psychology",
    title: "Master Your Trading Psychology: 7 Mental Traps That Destroy Crypto Profits",
    excerpt: "Discover the psychological pitfalls that cause 90% of crypto traders to lose money and learn proven strategies to maintain emotional discipline.",
    content: `
# Master Your Trading Psychology: 7 Mental Traps That Destroy Crypto Profits

Trading cryptocurrency is 90% psychology and 10% strategy. The most sophisticated technical analysis means nothing if you can't control your emotions when real money is on the line.

## Why Most Crypto Traders Fail Psychologically

The cryptocurrency market is uniquely designed to exploit human psychology. Unlike traditional markets, crypto never sleeps. Prices can swing 20% in hours. FOMO and fear dominate decision-making.

**Statistics don't lie:**
- 95% of day traders lose money within their first year
- 80% of losses come from emotional decisions, not bad analysis
- Successful traders spend more time managing psychology than studying charts

## The 7 Deadly Mental Traps

### 1. Revenge Trading
After a loss, you immediately enter another trade to "get even." This emotional state leads to bigger position sizes and worse decisions.

**Solution:** Implement a mandatory cooling-off period after any loss exceeding 2% of your account.

### 2. FOMO (Fear of Missing Out)
You see a coin pumping 50% and jump in at the peak, convinced you're missing life-changing gains.

**Solution:** Keep a list of assets you're watching. Only enter positions based on your predetermined criteria, not price movement.

### 3. Overconfidence After Wins
A few successful trades make you feel invincible. You start taking bigger risks and ignoring your rules.

**Solution:** Track your win rate and average returns. Most "hot streaks" are luck, not skill.

### 4. Analysis Paralysis
You research endlessly but never actually trade, paralyzed by the fear of making the wrong decision.

**Solution:** Set research time limits. Make decisions with 80% of available information rather than waiting for 100%.

### 5. The Sunk Cost Fallacy
You hold losing positions too long because you've already "invested" so much time and money.

**Solution:** Every day, ask yourself: "Would I buy this asset today at this price?" If not, sell.

### 6. Confirmation Bias
You only seek information that confirms your existing positions while ignoring contrary evidence.

**Solution:** Actively seek out opposing viewpoints. Set up alerts for negative news about your holdings.

### 7. Loss Aversion
The pain of losing $1,000 feels twice as strong as the pleasure of gaining $1,000, leading to poor risk management.

**Solution:** Focus on probabilities and expected value, not individual outcomes.

## The Professional Trader's Mental Framework

### Pre-Trade Checklist
- [ ] I am emotionally neutral
- [ ] This position size won't affect my sleep
- [ ] I have a clear exit strategy for both profit and loss
- [ ] This trade fits my documented strategy

### During Trade Management
- Set alerts instead of watching charts
- Journal your emotional state hourly
- Never add to losing positions
- Take partial profits as planned

### Post-Trade Review
- Was this trade executed according to plan?
- What emotions did I experience?
- What can I improve next time?

## Building Mental Resilience

**Daily Practices:**
1. **Meditation:** Even 10 minutes daily improves emotional control
2. **Physical Exercise:** Reduces stress hormones that cloud judgment  
3. **Journaling:** Track both trades and emotions
4. **Sleep:** Poor sleep = poor decisions

**Weekly Practices:**
1. **Performance Review:** Analyze what worked and what didn't
2. **Goal Reassessment:** Are you on track?
3. **Strategy Refinement:** Small improvements compound

## The Power of a Trading Journal

Every professional trader keeps a detailed journal. Not just of trades, but of:
- Emotional state before entering
- Reasons for the trade
- Market conditions
- Exit strategy
- Post-trade emotions
- Lessons learned

This creates a feedback loop that identifies psychological patterns before they become expensive habits.

## Conclusion

Mastering trading psychology isn't optional—it's the difference between consistent profits and blown accounts. The traders who survive and thrive are those who develop systematic approaches to managing their mental game.

Start with small position sizes. Focus on process over profits. Build the psychological foundation first, and the profits will follow.

**Remember:** Every professional trader has blown accounts early in their career. The difference is they learned from it and developed the mental discipline to never repeat those mistakes.

The market will always be there. Your capital won't be if you don't master your psychology first.
`,
    author: "Trading Team",
    date: "2025-01-27",
    readTime: "8 min read",
    category: "Psychology", 
    tags: ["Trading Psychology", "Emotional Control", "Risk Management"],
    seoTitle: "Crypto Trading Psychology: Master Your Mind to Maximize Profits",
    metaDescription: "Learn how to overcome emotional trading mistakes that destroy crypto profits. Master trading psychology with proven strategies from professional traders."
  },
  "risk-management-strategies": {
    id: "risk-management-strategies",
    title: "Risk Management Strategies That Actually Work in Volatile Crypto Markets",
    excerpt: "Professional risk management techniques that protect your capital during extreme market volatility and help you survive crypto winters.",
    content: `
# Risk Management Strategies That Actually Work in Volatile Crypto Markets

Risk management isn't just about stop losses. In crypto's volatile environment, it's a comprehensive system that determines whether you'll be trading in five years or watching from the sidelines.

## The Harsh Reality of Crypto Volatility

Bitcoin can drop 20% in a day. Altcoins can lose 50% overnight. This isn't a bug—it's a feature of an emerging, 24/7 market with massive speculation.

**The statistics are sobering:**
- Even Bitcoin, the "stable" crypto, has experienced 80%+ drawdowns multiple times
- The average altcoin loses 95% of its value from peak to trough
- 70% of crypto traders lose money in their first year

## The 3 Pillars of Crypto Risk Management

### Pillar 1: Position Sizing
**Never risk more than 1-2% of your total capital on a single trade.**

This might seem conservative, but here's the math:
- 10 consecutive losses at 2% each = 18.3% total loss
- 10 consecutive losses at 10% each = 65.1% total loss

The second scenario is nearly impossible to recover from psychologically and financially.

### Pillar 2: Diversification 
**Don't put all your eggs in one blockchain.**

Effective crypto diversification includes:
- Market cap tiers (large, mid, small cap)
- Sectors (DeFi, NFTs, Infrastructure, etc.)
- Geographic exposure (different regulatory environments)
- Time diversification (DCA strategies)

### Pillar 3: Risk-Adjusted Returns
**Focus on risk-adjusted returns, not absolute returns.**

A 50% gain with 80% volatility is worse than a 30% gain with 20% volatility from a risk-adjusted perspective.

## Advanced Position Sizing Strategies

### The Kelly Criterion
Formula: f = (bp - q) / b
- f = fraction of capital to wager
- b = odds of winning
- p = probability of winning  
- q = probability of losing

Most traders should use 25% of the Kelly recommendation to account for estimation errors.

### The 6% Rule
Never have more than 6% of your portfolio in any single asset outside of BTC/ETH. This prevents concentration risk while allowing for meaningful exposure.

### Volatility-Adjusted Position Sizing
Scale your position size inverse to volatility:
- High volatility asset = smaller position
- Low volatility asset = larger position

## Stop Loss Strategies for Crypto

### Technical Stop Losses
- Below support levels
- Below moving averages (20, 50, 200 day)
- Percentage-based (typically 8-15% for crypto)

### Time-Based Stops
If a trade hasn't moved in your favor within X days/weeks, exit regardless of price.

### Volatility Stops
Use Average True Range (ATR) to set stops based on normal price movement rather than arbitrary percentages.

## Portfolio Heat Management

**Portfolio Heat** = Sum of all position risks

Keep total portfolio heat under 10%. If you have 5 positions each risking 2%, you're at maximum heat and shouldn't add new positions.

## The Crypto Winter Survival Guide

### Cash Reserves
Maintain 20-30% cash during bull markets, 50-70% during bear markets. Cash is a position.

### Layered Defense Strategy
1. **Core Holdings** (40-60%): BTC, ETH in cold storage
2. **Trading Capital** (20-30%): Active positions with strict risk management  
3. **Speculation** (10-20%): High-risk, high-reward plays
4. **Cash** (20-40%): Opportunity fund and safety net

### Bear Market Tactics
- Reduce position sizes by 50%
- Extend stop losses (volatility increases)
- Focus on shorting or cash preservation
- DCA into quality projects at extreme discounts

## Psychological Risk Management

### The 2AM Test
If a market crash at 2AM would cause you to lose sleep, your position is too large.

### The Dinner Party Test  
If you can't enjoy dinner with friends because you're checking crypto prices, your risk is too high.

### Regular Stress Testing
Monthly ask yourself: "If my portfolio dropped 50% tomorrow, could I continue trading rationally?"

## Common Risk Management Mistakes

### Mistake 1: Moving Stop Losses
Once set, don't move stops against your position. This defeats the entire purpose.

### Mistake 2: Risking Rent Money
Only trade with money you can afford to lose completely. This isn't a cliche—it's survival.

### Mistake 3: Averaging Down
Adding to losing positions violates risk management principles. Cut losses, don't compound them.

### Mistake 4: Ignoring Correlation
During crashes, correlation approaches 1. "Diversified" crypto portfolios often move together.

## Building Your Risk Management System

### Step 1: Calculate Your Risk Capital
Total investable assets × Risk tolerance percentage = Maximum crypto allocation

### Step 2: Set Portfolio Rules
- Maximum position size
- Maximum portfolio heat
- Stop loss methodology
- Diversification requirements

### Step 3: Create Checklists
Pre-trade, during-trade, and post-trade checklists ensure you follow your rules when emotions are high.

### Step 4: Regular Reviews
Weekly: Review individual positions
Monthly: Assess overall portfolio risk
Quarterly: Refine risk management rules

## Conclusion

Risk management in crypto isn't about avoiding risk—it's about taking calculated risks that allow you to stay in the game long enough for your edge to play out.

The goal isn't to be right all the time. It's to make sure your winners are bigger than your losers and that you never take a loss that ends your trading career.

**Remember:** You can't predict the future, but you can control your risk. Focus on what you can control, and let probabilities work in your favor over time.

In crypto, the traders who survive the longest aren't the ones who make the most money fastest—they're the ones who lose the least money when they're wrong.
`,
    author: "Trading Team",
    date: "2025-01-26",
    readTime: "12 min read",
    category: "Risk Management",
    tags: ["Risk Management", "Position Sizing", "Stop Loss"],
    seoTitle: "Crypto Risk Management: Strategies for Volatile Markets 2025",
    metaDescription: "Discover professional risk management strategies for crypto trading. Learn position sizing, stop loss techniques, and capital preservation methods."
  },
  "technical-analysis-guide": {
    id: "technical-analysis-guide",
    title: "Technical Analysis for Crypto: Complete Guide to Reading Charts Like a Pro",
    excerpt: "Master chart patterns, indicators, and technical analysis techniques specifically designed for cryptocurrency market dynamics.",
    content: `
# Technical Analysis for Crypto: Complete Guide to Reading Charts Like a Pro

Technical analysis in crypto requires adapting traditional methods to a 24/7, highly volatile market. This guide covers everything you need to analyze crypto charts like a professional trader.

## Why Technical Analysis Works in Crypto

Crypto markets are driven by:
- **Pure sentiment** (no fundamental anchors like earnings)
- **Retail participation** (emotional, pattern-driven behavior)  
- **Limited institutional presence** (patterns remain "pure")
- **High volume** (patterns have statistical significance)

This makes technical analysis particularly effective compared to traditional markets.

## Essential Chart Timeframes

### Multi-Timeframe Analysis
Always analyze multiple timeframes:
- **Monthly**: Overall trend and major support/resistance
- **Weekly**: Intermediate trend and swing levels  
- **Daily**: Short-term trend and entry/exit points
- **4-Hour**: Intraday trend and precise timing
- **1-Hour**: Scalping and day trading entries

### The Rule of Three
For any trade:
1. **Higher timeframe** confirms overall trend
2. **Trading timeframe** provides entry signal
3. **Lower timeframe** fine-tunes entry and stop placement

## Core Chart Patterns for Crypto

### Reversal Patterns

**Head and Shoulders**
- Most reliable reversal pattern
- Volume should decrease on the right shoulder
- Measure from head to neckline for price target

**Double Top/Bottom**
- Second test of level with diverging volume/momentum
- Break of middle trough/peak confirms reversal
- Common at psychological levels ($10,000, $50,000, etc.)

**Wedges**
- Rising wedge = bearish (despite higher highs)
- Falling wedge = bullish (despite lower lows)
- Volume typically diminishes throughout pattern

### Continuation Patterns

**Flags and Pennants**
- Brief consolidation after sharp moves
- Volume dries up during consolidation
- Breakout volume should exceed flag volume

**Triangles**
- Symmetrical: neutral bias, trade the breakout
- Ascending: bullish bias
- Descending: bearish bias

**Rectangles**  
- Horizontal support and resistance
- Multiple touches of each level
- Volume often increases near boundaries

## Key Technical Indicators for Crypto

### Trend Indicators

**Moving Averages**
- 20 EMA: Short-term trend
- 50 SMA: Intermediate trend  
- 200 SMA: Long-term trend
- Golden Cross (50 above 200) = bullish
- Death Cross (50 below 200) = bearish

**MACD (Moving Average Convergence Divergence)**
- Signal line crossovers for entries
- Histogram for momentum changes
- Divergences signal trend exhaustion

### Momentum Indicators

**RSI (Relative Strength Index)**
- 70+ = potentially overbought
- 30- = potentially oversold
- Divergences more important than absolute levels
- Works better on higher timeframes in crypto

**Stochastic Oscillator**
- %K and %D line crossovers
- Effective in ranging markets
- Less reliable during strong trends

### Volume Indicators

**Volume Profile**
- Shows price levels with most trading activity
- Value Area High/Low = key levels
- Point of Control = highest volume node

**On-Balance Volume (OBV)**
- Confirms price movements with volume
- Divergences signal potential reversals
- Particularly important in crypto

## Crypto-Specific Technical Concepts

### Psychological Levels
Round numbers have special significance:
- $10, $100, $1,000, $10,000 for BTC
- $1, $10, $100 for altcoins
- All-time highs often act as strong resistance

### Weekend Effects
- Lower volume Saturday/Sunday
- Patterns may extend or false breakouts increase
- Monday gaps common in traditional markets, less so in crypto

### Exchange-Specific Analysis
- Different exchanges can show different patterns
- Use volume-weighted charts when possible
- Arbitrage opportunities at technical levels

## Advanced Pattern Recognition

### Elliott Wave Theory
Crypto often follows Elliott Wave patterns:
- 5 waves up (impulse)
- 3 waves down (correction)
- Fibonacci relationships between waves
- Particularly evident in major trends

### Wyckoff Method
Institutional accumulation/distribution patterns:
- Phase A: Selling climax
- Phase B: Building supply/demand
- Phase C: Test of supply/demand
- Phase D: Evidence of strength/weakness

### Market Structure
- Higher highs and higher lows = uptrend
- Lower highs and lower lows = downtrend
- Break of structure = potential trend change

## Building Your Analysis Framework

### Step 1: Market Context
- What's the overall crypto market doing?
- Bitcoin's influence on altcoins
- Major news or events pending?

### Step 2: Multiple Timeframe Analysis
- Monthly: Major trend
- Weekly: Swing structure  
- Daily: Entry setup
- Lower: Precise timing

### Step 3: Pattern Identification
- What patterns are forming?
- Are they continuation or reversal?
- Volume confirmation present?

### Step 4: Indicator Confluence
- Do multiple indicators align?
- Any divergences present?
- Support/resistance confluence?

### Step 5: Risk Assessment
- Where would this analysis be wrong?
- Risk/reward ratio acceptable?
- Position sizing appropriate?

## Common Technical Analysis Mistakes

### Mistake 1: Indicator Overload
More indicators don't equal better analysis. Master a few rather than using many.

### Mistake 2: Ignoring Volume
Price without volume is just noise. Volume confirms the validity of moves.

### Mistake 3: Forcing Patterns
Not every price movement is a pattern. Sometimes markets just move randomly.

### Mistake 4: Single Timeframe Analysis
Always confirm your analysis across multiple timeframes.

### Mistake 5: Backtesting Bias
What worked historically may not work in current market conditions.

## Practical Application Tips

### Chart Setup
- Clean charts with minimal clutter
- Consistent color scheme
- Save template for efficiency

### Pattern Recognition
- Mark key levels before they're tested
- Use alerts rather than watching screens
- Document patterns that work/don't work

### Continuous Learning
- Review trades win or lose
- Study historical patterns
- Adapt to changing market conditions

## Conclusion

Technical analysis in crypto is both art and science. The patterns and indicators provide the science—the art comes from experience, context, and intuition.

Focus on:
- **Multiple timeframe confirmation**
- **Volume validation**  
- **Risk management above all**
- **Continuous learning and adaptation**

Remember: Technical analysis gives you probabilities, not certainties. The goal is to find high-probability setups with favorable risk/reward ratios.

The best technical analysts aren't right more often—they just make sure their wins are bigger than their losses and that they live to trade another day.

**Start simple.** Master basic support/resistance and trend analysis before moving to complex patterns. The fundamentals executed well will take you far in crypto markets.
`,
    author: "Trading Team", 
    date: "2025-01-25",
    readTime: "15 min read",
    category: "Technical Analysis",
    tags: ["Technical Analysis", "Chart Patterns", "Indicators"],
    seoTitle: "Crypto Technical Analysis Guide: Read Charts Like a Professional",
    metaDescription: "Complete guide to crypto technical analysis. Master chart patterns, indicators, and trading techniques for cryptocurrency markets."
  }
};

const categoryIcons = {
  "Psychology": Brain,
  "Risk Management": Shield,
  "Technical Analysis": BarChart3,
  "Trading Strategy": TrendingUp,
  "Market Analysis": TrendingUp
};

export default function BlogPostPage() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/blog/:slug");
  
  if (!match || !params?.slug) {
    return <div>Loading...</div>;
  }

  const post = blogPosts[params.slug];
  
  if (!post) {
    return <div>Post not found</div>;
  }

  const getCategoryIcon = (category: string) => {
    const Icon = categoryIcons[category as keyof typeof categoryIcons] || TrendingUp;
    return <Icon className="h-4 w-4" />;
  };

  // Set SEO meta tags
  if (typeof document !== 'undefined') {
    document.title = post.seoTitle;
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', post.metaDescription);
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="border-b border-gray-100 dark:border-gray-900 bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setLocation("/blog")}
              className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
            <Button 
              onClick={() => setLocation("/auth")}
              className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black"
            >
              Start Trading Journal
            </Button>
          </div>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center space-x-4 mb-6">
            <Badge variant="secondary" className="flex items-center space-x-1">
              {getCategoryIcon(post.category)}
              <span>{post.category}</span>
            </Badge>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-3 w-3 mr-1" />
              {post.readTime}
            </div>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-black dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <User className="h-4 w-4 mr-2" />
              <span>By {post.author}</span>
            </div>
            <time className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(post.date).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
            </time>
          </div>
        </motion.header>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-lg dark:prose-invert max-w-none"
        >
          <div 
            className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{ 
              __html: post.content
                .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-black dark:text-white">$1</strong>')
                .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold text-black dark:text-white mt-6 mb-3">$1</h3>')
                .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-black dark:text-white mt-8 mb-4">$1</h2>')
                .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-black dark:text-white mt-10 mb-6">$1</h1>')
                .replace(/^\d+\. (.*$)/gm, '• $1')
                .replace(/((?:^• .*$\n?)+)/gm, '<ul class="list-none ml-6 mb-4 space-y-2">$1</ul>')
                .replace(/^• (.*$)/gm, '<li class="mb-1 flex items-start"><span class="text-black dark:text-white mr-2">•</span><span>$1</span></li>')
                .replace(/((?:^- .*$\n?)+)/gm, '<ul class="list-none ml-6 mb-4 space-y-2">$1</ul>')
                .replace(/^- (.*$)/gm, '<li class="mb-1 flex items-start"><span class="text-black dark:text-white mr-2">•</span><span>$1</span></li>')
                .replace(/\n\n/g, '</p><p class="mb-4">')
                .replace(/\n/g, '<br/>')
            }}
          />
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-900"
        >
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </motion.div>
      </article>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50/50 dark:bg-gray-950/50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-black dark:text-white mb-4">
            Ready to apply these strategies?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Start implementing professional trading techniques with CoinFeedly's trading journal.
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