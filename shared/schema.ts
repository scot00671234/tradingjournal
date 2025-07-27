import { pgTable, text, serial, integer, boolean, timestamp, decimal, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  isProUser: boolean("is_pro_user").default(false),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const trades = pgTable("trades", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  asset: varchar("asset", { length: 10 }).notNull(),
  direction: varchar("direction", { length: 5 }).notNull(), // 'long' or 'short'
  entryPrice: decimal("entry_price", { precision: 10, scale: 2 }).notNull(),
  exitPrice: decimal("exit_price", { precision: 10, scale: 2 }),
  size: integer("size").notNull(),
  pnl: decimal("pnl", { precision: 10, scale: 2 }),
  notes: text("notes"),
  tags: text("tags").array(),
  imageUrl: text("image_url"),
  tradeDate: timestamp("trade_date").notNull(),
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const insertTradeSchema = createInsertSchema(trades).omit({
  id: true,
  userId: true,
  createdAt: true,
  pnl: true,
}).extend({
  entryPrice: z.coerce.number().positive("Entry price must be positive"),
  exitPrice: z.coerce.number().positive("Exit price must be positive").optional(),
  size: z.coerce.number().int().positive("Size must be a positive integer"),
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
