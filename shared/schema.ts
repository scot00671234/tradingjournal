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
  subscriptionPlan: text("subscription_plan").default("free"), // free, pro, elite
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
export type LoginData = z.infer<typeof loginSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
export type UpdateCurrencyData = z.infer<typeof updateCurrencySchema>;
export type UpdateProfileData = z.infer<typeof updateProfileSchema>;
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
  tradeCount?: number;
  tradeLimit?: number | null;
};

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
