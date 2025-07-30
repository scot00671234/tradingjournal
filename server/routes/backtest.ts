import express from "express";
import { db } from "../db";
import { eq, and, gte, lte } from "drizzle-orm";
import { sql } from "drizzle-orm";

const router = express.Router();

interface PriceData {
  symbol: string;
  date: string;
  open_price: number;
  high_price: number;
  low_price: number;
  close_price: number;
  volume: number;
}

interface BacktestConfig {
  symbol: string;
  strategy: string;
  timeframe: string;
  startDate: string;
  endDate: string;
  initialBalance: number;
}

interface BacktestResult {
  totalReturn: number;
  winRate: number;
  maxDrawdown: number;
  totalTrades: number;
  profitFactor: number;
  equityCurve: { date: string; value: number }[];
}

// Get cached price data for backtesting
router.get("/api/backtest/prices/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: "startDate and endDate are required" });
    }

    const prices = await db.execute(sql`
      SELECT symbol, date, open_price, high_price, low_price, close_price, volume
      FROM price_data 
      WHERE symbol = ${symbol} 
        AND date >= ${startDate as string}
        AND date <= ${endDate as string}
      ORDER BY date ASC
    `);

    res.json(prices.rows);
  } catch (error) {
    console.error("Error fetching price data:", error);
    res.status(500).json({ error: "Failed to fetch price data" });
  }
});

// Get available symbols for backtesting
router.get("/api/backtest/symbols", async (req, res) => {
  try {
    const symbols = await db.execute(sql`
      SELECT DISTINCT symbol 
      FROM price_data 
      ORDER BY symbol
    `);

    res.json(symbols.rows.map(row => row.symbol));
  } catch (error) {
    console.error("Error fetching symbols:", error);
    res.status(500).json({ error: "Failed to fetch symbols" });
  }
});

// Simple Moving Average Crossover Strategy
function maStrategy(prices: PriceData[], fastPeriod = 10, slowPeriod = 20): BacktestResult {
  const trades: any[] = [];
  let position = 0; // 0 = no position, 1 = long
  let entryPrice = 0;
  let balance = 10000;
  const equityCurve = [];

  // Calculate moving averages
  const fastMA = calculateSMA(prices, fastPeriod);
  const slowMA = calculateSMA(prices, slowPeriod);

  for (let i = slowPeriod; i < prices.length; i++) {
    const currentPrice = prices[i].close_price;
    const prevFastMA = fastMA[i - 1];
    const currFastMA = fastMA[i];
    const prevSlowMA = slowMA[i - 1];
    const currSlowMA = slowMA[i];

    // Entry signal: Fast MA crosses above Slow MA
    if (position === 0 && prevFastMA <= prevSlowMA && currFastMA > currSlowMA) {
      position = 1;
      entryPrice = currentPrice;
    }
    // Exit signal: Fast MA crosses below Slow MA
    else if (position === 1 && prevFastMA >= prevSlowMA && currFastMA < currSlowMA) {
      const pnl = ((currentPrice - entryPrice) / entryPrice) * balance;
      balance += pnl;
      
      trades.push({
        entry: entryPrice,
        exit: currentPrice,
        pnl: pnl,
        date: prices[i].date
      });
      
      position = 0;
    }

    equityCurve.push({
      date: prices[i].date,
      value: balance
    });
  }

  return calculatePerformanceMetrics(trades, balance, 10000, equityCurve);
}

// RSI Mean Reversion Strategy
function rsiStrategy(prices: PriceData[], period = 14, oversold = 30, overbought = 70): BacktestResult {
  const trades: any[] = [];
  let position = 0;
  let entryPrice = 0;
  let balance = 10000;
  const equityCurve = [];

  const rsi = calculateRSI(prices, period);

  for (let i = period + 1; i < prices.length; i++) {
    const currentPrice = prices[i].close_price;
    const currentRSI = rsi[i];

    // Entry signal: RSI oversold
    if (position === 0 && currentRSI < oversold) {
      position = 1;
      entryPrice = currentPrice;
    }
    // Exit signal: RSI overbought
    else if (position === 1 && currentRSI > overbought) {
      const pnl = ((currentPrice - entryPrice) / entryPrice) * balance;
      balance += pnl;
      
      trades.push({
        entry: entryPrice,
        exit: currentPrice,
        pnl: pnl,
        date: prices[i].date
      });
      
      position = 0;
    }

    equityCurve.push({
      date: prices[i].date,
      value: balance
    });
  }

  return calculatePerformanceMetrics(trades, balance, 10000, equityCurve);
}

// Price Breakout Strategy
function breakoutStrategy(prices: PriceData[], lookback = 20): BacktestResult {
  const trades: any[] = [];
  let position = 0;
  let entryPrice = 0;
  let balance = 10000;
  const equityCurve = [];

  for (let i = lookback; i < prices.length; i++) {
    const currentPrice = prices[i].close_price;
    const recentPrices = prices.slice(i - lookback, i);
    const highestHigh = Math.max(...recentPrices.map(p => p.high_price));
    const lowestLow = Math.min(...recentPrices.map(p => p.low_price));

    // Entry signal: Price breaks above recent high
    if (position === 0 && currentPrice > highestHigh) {
      position = 1;
      entryPrice = currentPrice;
    }
    // Exit signal: Price breaks below recent low
    else if (position === 1 && currentPrice < lowestLow) {
      const pnl = ((currentPrice - entryPrice) / entryPrice) * balance;
      balance += pnl;
      
      trades.push({
        entry: entryPrice,
        exit: currentPrice,
        pnl: pnl,
        date: prices[i].date
      });
      
      position = 0;
    }

    equityCurve.push({
      date: prices[i].date,
      value: balance
    });
  }

  return calculatePerformanceMetrics(trades, balance, 10000, equityCurve);
}

// Run backtest
router.post("/api/backtest/run", async (req, res) => {
  try {
    const config: BacktestConfig = req.body;
    
    // Get price data from cache
    const prices = await db.execute(sql`
      SELECT symbol, date, open_price, high_price, low_price, close_price, volume
      FROM price_data 
      WHERE symbol = ${config.symbol} 
        AND date >= ${config.startDate}
        AND date <= ${config.endDate}
      ORDER BY date ASC
    `);

    if (prices.rows.length === 0) {
      return res.status(404).json({ error: "No price data found for the specified period" });
    }

    let result: BacktestResult;
    
    // Run strategy based on selection
    const priceData = prices.rows as unknown as PriceData[];
    switch (config.strategy) {
      case 'ma_cross':
        result = maStrategy(priceData);
        break;
      case 'rsi_reversal':
        result = rsiStrategy(priceData);
        break;
      case 'breakout':
        result = breakoutStrategy(priceData);
        break;
      default:
        return res.status(400).json({ error: "Invalid strategy" });
    }

    res.json({
      config,
      result,
      dataPoints: prices.rows.length
    });

  } catch (error) {
    console.error("Error running backtest:", error);
    res.status(500).json({ error: "Failed to run backtest" });
  }
});

// Helper functions
function calculateSMA(prices: PriceData[], period: number): number[] {
  const sma = [];
  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      sma.push(0);
    } else {
      const sum = prices.slice(i - period + 1, i + 1)
        .reduce((acc, p) => acc + p.close_price, 0);
      sma.push(sum / period);
    }
  }
  return sma;
}

function calculateRSI(prices: PriceData[], period: number): number[] {
  const rsi = [];
  const gains = [];
  const losses = [];

  for (let i = 1; i < prices.length; i++) {
    const change = prices[i].close_price - prices[i - 1].close_price;
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }

  for (let i = 0; i < gains.length; i++) {
    if (i < period - 1) {
      rsi.push(50);
    } else {
      const avgGain = gains.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
      const avgLoss = losses.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
      
      if (avgLoss === 0) {
        rsi.push(100);
      } else {
        const rs = avgGain / avgLoss;
        rsi.push(100 - (100 / (1 + rs)));
      }
    }
  }

  return [50, ...rsi]; // Prepend 50 for first price
}

function calculatePerformanceMetrics(trades: any[], finalBalance: number, initialBalance: number, equityCurve: any[]): BacktestResult {
  const totalReturn = ((finalBalance - initialBalance) / initialBalance) * 100;
  const winningTrades = trades.filter(t => t.pnl > 0);
  const winRate = trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0;
  
  // Calculate max drawdown
  let maxDrawdown = 0;
  let peak = initialBalance;
  
  for (const point of equityCurve) {
    if (point.value > peak) {
      peak = point.value;
    }
    const drawdown = ((peak - point.value) / peak) * 100;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }

  // Calculate profit factor
  const grossProfit = winningTrades.reduce((sum, t) => sum + t.pnl, 0);
  const grossLoss = Math.abs(trades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0));
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 10 : 1;

  return {
    totalReturn,
    winRate,
    maxDrawdown,
    totalTrades: trades.length,
    profitFactor,
    equityCurve
  };
}

export default router;