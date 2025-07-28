import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  isProUser: integer("is_pro_user", { mode: 'boolean' }).default(false),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const trades = sqliteTable("trades", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  asset: text("asset", { length: 10 }).notNull(),
  direction: text("direction", { length: 5 }).notNull(), // 'long' or 'short'
  entryPrice: real("entry_price").notNull(),
  exitPrice: real("exit_price"),
  size: integer("size").notNull(),
  pnl: real("pnl"),
  notes: text("notes"),
  tags: text("tags"), // SQLite doesn't have arrays, so we'll store as JSON string
  imageUrl: text("image_url"),
  tradeDate: integer("trade_date", { mode: 'timestamp' }).notNull(),
  isCompleted: integer("is_completed", { mode: 'boolean' }).default(false),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const userRelations = relations(users, ({ many }) => ({
  trades: many(trades),
}));

export const tradeRelations = relations(trades, ({ one }) => ({
  user: one(users, {
    fields: [trades.userId],
    references: [users.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  username: true,
  createdAt: true,
  isProUser: true,
  stripeCustomerId: true,
  stripeSubscriptionId: true,
}).extend({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const insertTradeSchema = createInsertSchema(trades).omit({
  id: true,
  userId: true,
  createdAt: true,
  pnl: true,
}).extend({
  entryPrice: z.string().min(1, "Entry price is required"),
  exitPrice: z.string().optional(),
  size: z.coerce.number().int().positive("Size must be a positive integer"),
  tradeDate: z.string().min(1, "Trade date is required"),
});

export const updateTradeSchema = createInsertSchema(trades).omit({
  id: true,
  userId: true,
  createdAt: true,
}).partial();

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTrade = z.infer<typeof insertTradeSchema>;
export type UpdateTrade = z.infer<typeof updateTradeSchema>;
export type Trade = typeof trades.$inferSelect;

// Additional types for API responses
export type TradeStats = {
  totalTrades: number;
  totalPnL: number;
  winRate: number;
  avgRiskReward: number;
  largestWin: number;
  largestLoss: number;
  maxDrawdown: number;
};

export type SubscriptionStatus = {
  plan: string;
  tradeCount: number;
  tradeLimit: number | null;
};
