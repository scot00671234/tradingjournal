import { users, trades, type User, type InsertUser, type Trade, type InsertTrade, type UpdateTrade } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count, sum, avg } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStripeInfo(userId: number, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User>;
  updateUserProStatus(userId: number, isProUser: boolean): Promise<User>;
  
  getUserTrades(userId: number, limit?: number): Promise<Trade[]>;
  createTrade(trade: InsertTrade & { userId: number }): Promise<Trade>;
  updateTrade(tradeId: number, userId: number, updates: UpdateTrade): Promise<Trade | undefined>;
  deleteTrade(tradeId: number, userId: number): Promise<boolean>;
  getUserTradeCount(userId: number): Promise<number>;
  
  getUserStats(userId: number): Promise<{
    totalTrades: number;
    totalPnL: number;
    winRate: number;
    avgRiskReward: number;
    largestWin: number;
    largestLoss: number;
    maxDrawdown: number;
  }>;
  
  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        email: insertUser.email,
        password: insertUser.password,
        username: insertUser.email.split('@')[0], // Generate username from email
      })
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: number, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        stripeCustomerId, 
        stripeSubscriptionId,
        isProUser: true 
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserProStatus(userId: number, isProUser: boolean): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ isProUser })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getUserTrades(userId: number, limit?: number): Promise<Trade[]> {
    let query = db
      .select()
      .from(trades)
      .where(eq(trades.userId, userId))
      .orderBy(desc(trades.createdAt));
    
    if (limit) {
      return await query.limit(limit);
    }
    
    return await query;
  }

  async createTrade(trade: any): Promise<Trade> {
    // Calculate P&L if both entry and exit prices are provided
    let pnl = null;
    if (trade.entryPrice && trade.exitPrice) {
      const entryPrice = typeof trade.entryPrice === 'string' ? parseFloat(trade.entryPrice) : trade.entryPrice;
      const exitPrice = typeof trade.exitPrice === 'string' ? parseFloat(trade.exitPrice) : trade.exitPrice;
      const size = trade.size;
      
      if (trade.direction === 'long') {
        pnl = ((exitPrice - entryPrice) * size).toFixed(2);
      } else {
        pnl = ((entryPrice - exitPrice) * size).toFixed(2);
      }
    }

    const [newTrade] = await db
      .insert(trades)
      .values({
        userId: trade.userId,
        asset: trade.asset,
        direction: trade.direction,
        entryPrice: typeof trade.entryPrice === 'string' ? trade.entryPrice : trade.entryPrice.toString(),
        exitPrice: trade.exitPrice ? (typeof trade.exitPrice === 'string' ? trade.exitPrice : trade.exitPrice.toString()) : null,
        size: trade.size,
        notes: trade.notes || null,
        tags: trade.tags || null,
        imageUrl: trade.imageUrl || null,
        tradeDate: new Date(trade.tradeDate),
        pnl,
        isCompleted: !!(trade.exitPrice),
      })
      .returning();
    return newTrade;
  }

  async updateTrade(tradeId: number, userId: number, updates: UpdateTrade): Promise<Trade | undefined> {
    // Recalculate P&L if prices are updated
    let pnl = updates.pnl;
    if (updates.entryPrice && updates.exitPrice) {
      const entryPrice = parseFloat(updates.entryPrice.toString());
      const exitPrice = parseFloat(updates.exitPrice.toString());
      const size = updates.size || 0;
      
      if (updates.direction === 'long') {
        pnl = ((exitPrice - entryPrice) * size).toFixed(2);
      } else if (updates.direction === 'short') {
        pnl = ((entryPrice - exitPrice) * size).toFixed(2);
      }
    }

    const [updatedTrade] = await db
      .update(trades)
      .set({
        ...updates,
        pnl,
        isCompleted: !!(updates.exitPrice),
      })
      .where(and(eq(trades.id, tradeId), eq(trades.userId, userId)))
      .returning();
    
    return updatedTrade || undefined;
  }

  async deleteTrade(tradeId: number, userId: number): Promise<boolean> {
    const result = await db
      .delete(trades)
      .where(and(eq(trades.id, tradeId), eq(trades.userId, userId)));
    
    return (result.rowCount || 0) > 0;
  }

  async getUserTradeCount(userId: number): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(trades)
      .where(eq(trades.userId, userId));
    
    return result.count;
  }

  async getUserStats(userId: number): Promise<{
    totalTrades: number;
    totalPnL: number;
    winRate: number;
    avgRiskReward: number;
    largestWin: number;
    largestLoss: number;
    maxDrawdown: number;
  }> {
    const userTrades = await this.getUserTrades(userId);
    const completedTrades = userTrades.filter(t => t.isCompleted && t.pnl !== null);
    
    if (completedTrades.length === 0) {
      return {
        totalTrades: 0,
        totalPnL: 0,
        winRate: 0,
        avgRiskReward: 0,
        largestWin: 0,
        largestLoss: 0,
        maxDrawdown: 0,
      };
    }

    const totalPnL = completedTrades.reduce((sum, trade) => sum + parseFloat(trade.pnl?.toString() || '0'), 0);
    const winningTrades = completedTrades.filter(t => parseFloat(t.pnl?.toString() || '0') > 0);
    const winRate = (winningTrades.length / completedTrades.length) * 100;
    
    const pnlValues = completedTrades.map(t => parseFloat(t.pnl?.toString() || '0'));
    const largestWin = Math.max(...pnlValues);
    const largestLoss = Math.min(...pnlValues);
    
    // Calculate running P&L for drawdown
    let runningPnL = 0;
    let peak = 0;
    let maxDrawdown = 0;
    
    for (const trade of completedTrades) {
      runningPnL += parseFloat(trade.pnl?.toString() || '0');
      if (runningPnL > peak) peak = runningPnL;
      const drawdown = peak - runningPnL;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    }

    const avgWin = winningTrades.length > 0 ? 
      winningTrades.reduce((sum, t) => sum + parseFloat(t.pnl?.toString() || '0'), 0) / winningTrades.length : 0;
    const losingTrades = completedTrades.filter(t => parseFloat(t.pnl?.toString() || '0') < 0);
    const avgLoss = losingTrades.length > 0 ? 
      Math.abs(losingTrades.reduce((sum, t) => sum + parseFloat(t.pnl?.toString() || '0'), 0) / losingTrades.length) : 0;
    const avgRiskReward = avgLoss > 0 ? avgWin / avgLoss : 0;

    return {
      totalTrades: completedTrades.length,
      totalPnL,
      winRate,
      avgRiskReward,
      largestWin,
      largestLoss,
      maxDrawdown,
    };
  }
}

export const storage = new DatabaseStorage();
