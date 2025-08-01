import { pgTable, text, integer, real, boolean, timestamp, serial, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  isProUser: boolean("is_pro_user").default(false),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: text("subscription_status").default("inactive"), // active, canceled, past_due
  subscriptionPlan: text("subscription_plan").default("free"), // free, pro, elite, diamond, enterprise
  storageUsedBytes: integer("storage_used_bytes").default(0),
  maxTradingAccounts: integer("max_trading_accounts").default(1),
  isEmailVerified: boolean("is_email_verified").default(false),
  emailVerificationToken: text("email_verification_token"),
  passwordResetToken: text("password_reset_token"),
  passwordResetExpires: timestamp("password_reset_expires"),
  preferredCurrency: text("preferred_currency").default("USD"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Session storage table for production
export const sessions = pgTable("sessions", {
  sid: text("sid").primaryKey(),
  sess: text("sess").notNull(), // JSON session data
  expire: timestamp("expire").notNull(),
}, (table) => [
  index("idx_sessions_expire").on(table.expire),
]);

export const trades = pgTable("trades", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  tradingAccountId: integer("trading_account_id").references(() => tradingAccounts.id).notNull(),
  asset: text("asset").notNull(),
  direction: text("direction").notNull(), // 'long' or 'short'
  entryPrice: real("entry_price").notNull(),
  exitPrice: real("exit_price"),
  size: integer("size").notNull(),
  pnl: real("pnl"),
  notes: text("notes"),
  tags: text("tags"), // JSON string for PostgreSQL compatibility
  imageUrl: text("image_url"),
  tradeDate: timestamp("trade_date").notNull(),
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  index("idx_trades_user_id").on(table.userId),
  index("idx_trades_trading_account_id").on(table.tradingAccountId),
]);

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const tradingAccounts = pgTable("trading_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  initialBalance: real("initial_balance").notNull().default(0),
  currentBalance: real("current_balance").notNull().default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  index("idx_trading_accounts_user_id").on(table.userId),
]);

export const userRelations = relations(users, ({ many }) => ({
  trades: many(trades),
  notes: many(notes),
  tradingAccounts: many(tradingAccounts),
}));

export const tradeRelations = relations(trades, ({ one }) => ({
  user: one(users, {
    fields: [trades.userId],
    references: [users.id],
  }),
  tradingAccount: one(tradingAccounts, {
    fields: [trades.tradingAccountId],
    references: [tradingAccounts.id],
  }),
}));

export const noteRelations = relations(notes, ({ one }) => ({
  user: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
}));

export const tradingAccountRelations = relations(tradingAccounts, ({ one, many }) => ({
  user: one(users, {
    fields: [tradingAccounts.userId],
    references: [users.id],
  }),
  trades: many(trades),
}));

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  username: true,
  createdAt: true,
  updatedAt: true,
  isProUser: true,
  stripeCustomerId: true,
  stripeSubscriptionId: true,
  subscriptionStatus: true,
  subscriptionPlan: true,
  isEmailVerified: true,
  emailVerificationToken: true,
  passwordResetToken: true,
  passwordResetExpires: true,
}).extend({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
});

export const updateCurrencySchema = z.object({
  preferredCurrency: z.string().min(1, "Currency is required"),
});

export const insertTradeSchema = createInsertSchema(trades).omit({
  id: true,
  userId: true,
  createdAt: true,
  pnl: true,
}).extend({
  tradingAccountId: z.number().int().positive("Trading account is required"),
  entryPrice: z.string().min(1, "Entry price is required"),
  exitPrice: z.string().optional(),
  size: z.coerce.number().int().positive("Size must be a positive integer"),
  tradeDate: z.string().min(1, "Trade date is required"),
  imageUrl: z.string().optional(),
});

export const updateTradeSchema = createInsertSchema(trades).omit({
  id: true,
  userId: true,
  createdAt: true,
}).partial();

export const insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  content: z.string().max(10000, "Content must be less than 10,000 characters"),
});

export const updateNoteSchema = createInsertSchema(notes).omit({
  id: true,
  userId: true,
  createdAt: true,
}).partial();

export const insertTradingAccountSchema = createInsertSchema(tradingAccounts).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  name: z.string().min(1, "Account name is required").max(100, "Account name must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  initialBalance: z.coerce.number().min(0, "Initial balance must be non-negative"),
});

export const updateTradingAccountSchema = createInsertSchema(tradingAccounts).omit({
  id: true,
  userId: true,
  createdAt: true,
}).partial();

export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
export type UpdateCurrencyData = z.infer<typeof updateCurrencySchema>;
export type UpdateProfileData = z.infer<typeof updateProfileSchema>;
export type User = typeof users.$inferSelect;
export type InsertTrade = z.infer<typeof insertTradeSchema>;
export type UpdateTrade = z.infer<typeof updateTradeSchema>;
export type Trade = typeof trades.$inferSelect;
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type UpdateNote = z.infer<typeof updateNoteSchema>;
export type Note = typeof notes.$inferSelect;
export type InsertTradingAccount = z.infer<typeof insertTradingAccountSchema>;
export type UpdateTradingAccount = z.infer<typeof updateTradingAccountSchema>;
export type TradingAccount = typeof tradingAccounts.$inferSelect;

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

export type SubscriptionInfo = {
  plan: string;
  status: string;
  tradeCount: number;
  tradeLimit: number | null;
  nextBillingDate?: string;
  cancelAtPeriodEnd?: boolean;
};

export type SubscriptionStatus = {
  isActive: boolean;
  plan: string;
  status: string;
  tradeCount: number;
  tradeLimit: number | null;
  storageUsedBytes: number;
  storageLimit: number; // in bytes
  maxTradingAccounts: number;
};

// Plan configurations
export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    storageLimit: 100 * 1024 * 1024, // 100MB
    maxTradingAccounts: 1,
    tradeLimit: 3,
    features: ['3 free trades', 'Basic trade tracking', 'Simple analytics', '100MB storage']
  },
  pro: {
    name: 'Pro',
    price: 29,
    storageLimit: 1 * 1024 * 1024 * 1024, // 1GB
    maxTradingAccounts: 1,
    tradeLimit: null,
    features: ['Unlimited trades', 'Advanced analytics', '1GB storage', '1 trading account', 'Trade screenshots', 'Custom tags & notes']
  },
  elite: {
    name: 'Elite',
    price: 49,
    storageLimit: 5 * 1024 * 1024 * 1024, // 5GB
    maxTradingAccounts: 10,
    tradeLimit: null,
    features: ['Everything in Pro +', '5GB storage', '10 trading accounts', 'Advanced risk metrics', 'Priority support', 'Portfolio optimization']
  },
  diamond: {
    name: 'Diamond',
    price: 89,
    storageLimit: 10 * 1024 * 1024 * 1024, // 10GB
    maxTradingAccounts: 20,
    tradeLimit: null,
    features: ['Everything in Elite +', '10GB storage', '20 trading accounts', 'Advanced reporting', 'Custom analytics', 'Team collaboration']
  },
  enterprise: {
    name: 'Enterprise',
    price: 129,
    storageLimit: 30 * 1024 * 1024 * 1024, // 30GB
    maxTradingAccounts: -1, // unlimited
    tradeLimit: null,
    features: ['Everything in Diamond +', '30GB storage', 'Unlimited accounts', 'Custom integrations', 'Dedicated support', 'White-label options']
  }
} as const;

export type BillingInfo = {
  stripeCustomerId?: string;
  subscriptionId?: string;
  plan: string;
  status: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  paymentMethod?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
};
