import { 
  users, 
  trades, 
  sessions,
  type User, 
  type InsertUser, 
  type Trade, 
  type InsertTrade, 
  type UpdateTrade,
  type UpdateProfileData
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count, sum, avg, lt } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStripeInfo(userId: number, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User>;
  updateUserProStatus(userId: number, isProUser: boolean): Promise<User>;
  updateUserProfile(userId: number, updates: UpdateProfileData): Promise<User>;
  updateUserPassword(userId: number, hashedPassword: string): Promise<User>;
  deleteUser(userId: number): Promise<boolean>;
  
  // Email verification
  setEmailVerificationToken(userId: number, token: string): Promise<void>;
  verifyEmailWithToken(token: string): Promise<User | null>;
  
  // Password reset
  setPasswordResetToken(email: string, token: string, expiresAt: Date): Promise<void>;
  getUserByPasswordResetToken(token: string): Promise<User | null>;
  clearPasswordResetToken(userId: number): Promise<void>;
  
  // Subscription management
  updateUserSubscription(userId: number, plan: string, status: string, stripeCustomerId?: string, stripeSubscriptionId?: string): Promise<User>;
  
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
    // Use PostgreSQL session store for production
    if (process.env.DATABASE_URL) {
      const pgStore = connectPg(session);
      this.sessionStore = new pgStore({
        conString: process.env.DATABASE_URL,
        createTableIfMissing: false,
        ttl: 7 * 24 * 60 * 60, // 7 days
        tableName: 'sessions',
      });
    } else {
      // Fallback to memory store for development
      const MemoryStore = require('memorystore')(session);
      this.sessionStore = new MemoryStore({ 
        checkPeriod: 86400000 // prune expired entries every 24h
      });
    }
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
        firstName: insertUser.firstName,
        lastName: insertUser.lastName,
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

  async updateUserProfile(userId: number, updates: UpdateProfileData): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserPassword(userId: number, hashedPassword: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async setEmailVerificationToken(userId: number, token: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        emailVerificationToken: token,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  async verifyEmailWithToken(token: string): Promise<User | null> {
    const [user] = await db
      .update(users)
      .set({ 
        isEmailVerified: true,
        emailVerificationToken: null,
        updatedAt: new Date(),
      })
      .where(eq(users.emailVerificationToken, token))
      .returning();
    
    return user || null;
  }

  async setPasswordResetToken(email: string, token: string, expiresAt: Date): Promise<void> {
    await db
      .update(users)
      .set({ 
        passwordResetToken: token,
        passwordResetExpires: expiresAt,
        updatedAt: new Date(),
      })
      .where(eq(users.email, email));
  }

  async getUserByPasswordResetToken(token: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.passwordResetToken, token),
          // Token hasn't expired (compare with current timestamp)
          lt(new Date(), users.passwordResetExpires)
        )
      );
    
    return user || null;
  }

  async clearPasswordResetToken(userId: number): Promise<void> {
    await db
      .update(users)
      .set({ 
        passwordResetToken: null,
        passwordResetExpires: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  async updateUserSubscription(userId: number, plan: string, status: string, stripeCustomerId?: string, stripeSubscriptionId?: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        subscriptionPlan: plan,
        subscriptionStatus: status,
        isProUser: plan !== 'free',
        stripeCustomerId,
        stripeSubscriptionId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async deleteUser(userId: number): Promise<boolean> {
    // First delete all user's trades
    await db.delete(trades).where(eq(trades.userId, userId));
    
    // Then delete the user
    const result = await db.delete(users).where(eq(users.id, userId));
    return (result.rowCount || 0) > 0;
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
        pnl = (exitPrice - entryPrice) * size;
      } else {
        pnl = (entryPrice - exitPrice) * size;
      }
    }

    const [newTrade] = await db
      .insert(trades)
      .values({
        userId: trade.userId,
        asset: trade.asset,
        direction: trade.direction,
        entryPrice: typeof trade.entryPrice === 'string' ? parseFloat(trade.entryPrice) : trade.entryPrice,
        exitPrice: trade.exitPrice ? (typeof trade.exitPrice === 'string' ? parseFloat(trade.exitPrice) : trade.exitPrice) : null,
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
      const entryPrice = typeof updates.entryPrice === 'string' ? parseFloat(updates.entryPrice) : updates.entryPrice;
      const exitPrice = typeof updates.exitPrice === 'string' ? parseFloat(updates.exitPrice) : updates.exitPrice;
      const size = updates.size || 0;
      
      if (updates.direction === 'long') {
        pnl = (exitPrice - entryPrice) * size;
      } else if (updates.direction === 'short') {
        pnl = (entryPrice - exitPrice) * size;
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
