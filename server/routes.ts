import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertTradeSchema, updateTradeSchema, updateCurrencySchema, users, trades, notes, tradingAccounts, insertNoteSchema, updateNoteSchema, insertTradingAccountSchema, updateTradingAccountSchema, type BillingInfo, SUBSCRIPTION_PLANS, type Note, type TradingAccount } from "../shared/schema.js";
import { z } from "zod";
import Stripe from "stripe";
import { db } from "./db";
import { eq } from "drizzle-orm";
import multer from "multer";
import path from "path";
import fs from "fs";
import { nanoid } from "nanoid";

// Initialize Stripe with production-ready configuration
const stripe = process.env.STRIPE_SECRET_KEY ? 
  new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-07-30.basil',
    appInfo: {
      name: 'CoinFeedly',
      version: '1.0.0',
    },
  }) : 
  null;

// Configure multer for image uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = nanoid(12);
      const ext = path.extname(file.originalname);
      cb(null, `trade-${uniqueSuffix}${ext}`);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for Docker and load balancers
  app.get("/api/health", async (req, res) => {
    try {
      // Test database connection
      await db.execute("SELECT 1");
      res.status(200).json({ 
        status: "healthy", 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          PORT: process.env.PORT,
          hasDatabase: !!process.env.DATABASE_URL,
          hasSession: !!process.env.SESSION_SECRET
        }
      });
    } catch (error: any) {
      res.status(503).json({ 
        status: "unhealthy", 
        error: error.message,
        timestamp: new Date().toISOString(),
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          PORT: process.env.PORT,
          hasDatabase: !!process.env.DATABASE_URL,
          hasSession: !!process.env.SESSION_SECRET
        }
      });
    }
  });

  // Debug endpoint to check environment (remove in production)
  app.get("/api/debug/env", (req, res) => {
    res.json({
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      hasDatabase: !!process.env.DATABASE_URL,
      hasSession: !!process.env.SESSION_SECRET,
      databaseUrlPrefix: process.env.DATABASE_URL ? process.env.DATABASE_URL.split('://')[0] + '://' : 'missing'
    });
  });

  // Setup authentication routes
  setupAuth(app);

  // Serve uploaded images
  app.get("/uploads/:filename", (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(uploadDir, filename);
    
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ message: "Image not found" });
    }
  });

  // Image upload endpoint with storage limit check
  app.post("/api/upload-image", upload.single('image'), async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    try {
      const user = req.user;
      const planKey = user.subscriptionPlan || 'free';
      const planConfig = SUBSCRIPTION_PLANS[planKey as keyof typeof SUBSCRIPTION_PLANS] || SUBSCRIPTION_PLANS.free;
      
      // Calculate current storage usage
      const currentStorageUsage = await calculateUserStorageUsage(user.id);
      const newTotalUsage = currentStorageUsage + req.file.size;
      
      // Check if upload would exceed storage limit
      if (newTotalUsage > planConfig.storageLimit) {
        // Delete the uploaded file since it exceeds limit
        fs.unlinkSync(req.file.path);
        
        const formatFileSize = (bytes: number): string => {
          if (bytes === 0) return '0 B';
          const k = 1024;
          const sizes = ['B', 'KB', 'MB', 'GB'];
          const i = Math.floor(Math.log(bytes) / Math.log(k));
          return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
        };
        
        return res.status(413).json({ 
          message: `Storage limit exceeded. File size: ${formatFileSize(req.file.size)}, Available: ${formatFileSize(planConfig.storageLimit - currentStorageUsage)}, Plan limit: ${formatFileSize(planConfig.storageLimit)}`,
          currentUsage: currentStorageUsage,
          limit: planConfig.storageLimit,
          fileSize: req.file.size
        });
      }

      const imageUrl = `/uploads/${req.file.filename}`;
      res.json({ imageUrl });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Trade routes
  app.get("/api/trades", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const trades = await storage.getUserTrades(req.user.id);
      res.json(trades);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/trades", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      // Check if user is within trade limits
      const tradeCount = await storage.getUserTradeCount(req.user.id);
      const planKey = req.user.subscriptionPlan || 'free';
      const planConfig = SUBSCRIPTION_PLANS[planKey as keyof typeof SUBSCRIPTION_PLANS] || SUBSCRIPTION_PLANS.free;
      
      if (planConfig.tradeLimit && tradeCount >= planConfig.tradeLimit) {
        return res.status(403).json({ 
          message: `${planConfig.name} plan limited to ${planConfig.tradeLimit} trades. Upgrade to Pro for unlimited trades.` 
        });
      }

      const validatedData = insertTradeSchema.parse(req.body);
      
      // Keep validated data as-is since schema expects strings but storage will handle conversion
      const tradeData = {
        ...validatedData,
        userId: req.user.id,
      };
      
      const trade = await storage.createTrade(tradeData);
      
      res.status(201).json(trade);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid trade data", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/trades/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const tradeId = parseInt(req.params.id);
      const validatedData = updateTradeSchema.parse(req.body);
      
      const trade = await storage.updateTrade(tradeId, req.user.id, validatedData);
      
      if (!trade) {
        return res.status(404).json({ message: "Trade not found" });
      }
      
      res.json(trade);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid trade data", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/trades/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const tradeId = parseInt(req.params.id);
      const success = await storage.deleteTrade(tradeId, req.user.id);
      
      if (!success) {
        return res.status(404).json({ message: "Trade not found" });
      }
      
      res.sendStatus(200);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Notes routes
  app.get("/api/notes", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const userNotes = await storage.getUserNotes(req.user.id);
      res.json(userNotes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/notes", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const validatedData = insertNoteSchema.parse(req.body);
      const note = await storage.createNote(req.user.id, validatedData);
      res.json(note);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid note data", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/notes/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const noteId = parseInt(req.params.id);
      const validatedData = updateNoteSchema.parse(req.body);
      
      const note = await storage.updateNote(noteId, req.user.id, validatedData);
      
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      
      res.json(note);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid note data", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/notes/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const noteId = parseInt(req.params.id);
      const success = await storage.deleteNote(noteId, req.user.id);
      
      if (!success) {
        return res.status(404).json({ message: "Note not found" });
      }
      
      res.sendStatus(200);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Analytics routes
  app.get("/api/stats", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const stats = await storage.getUserStats(req.user.id);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Subscription and billing routes
  app.post('/api/create-subscription', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    if (!stripe) {
      return res.status(503).json({ message: "Payment processing not available" });
    }

    const { plan = 'pro' } = req.body; // pro or elite
    const user = req.user;

    // Check if user already has a subscription
    if (user.stripeSubscriptionId) {
      try {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        if (subscription.status === 'active') {
          return res.json({
            subscriptionId: subscription.id,
            status: 'existing',
            message: 'You already have an active subscription'
          });
        }
      } catch (error) {
        console.error('Error retrieving existing subscription:', error);
      }
    }

    try {
      let customerId = user.stripeCustomerId;
      
      // Create customer if doesn't exist
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          metadata: {
            userId: user.id.toString()
          }
        });
        customerId = customer.id;
      }

      // Plan pricing
      const planPricing = {
        pro: { amount: 2900, name: 'CoinFeedly Pro' }, // $29/month
        elite: { amount: 4900, name: 'CoinFeedly Elite' } // $49/month
      };

      const selectedPlan = planPricing[plan as keyof typeof planPricing] || planPricing.pro;

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{
          price_data: {
            currency: 'usd',
            product: 'prod_trading_plan', // Stripe product ID - needs to be created in Stripe dashboard
            unit_amount: selectedPlan.amount,
            recurring: {
              interval: 'month',
            },
          },
        }],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
        trial_period_days: 7, // 7-day free trial
      });

      // Update user subscription info
      await storage.updateUserSubscription(user.id, plan, 'trialing', customerId, subscription.id);

      const invoice = subscription.latest_invoice as any;
      res.json({
        subscriptionId: subscription.id,
        clientSecret: invoice.payment_intent?.client_secret,
        status: 'created',
        trialEnd: subscription.trial_end
      });
    } catch (error: any) {
      console.error('Subscription creation error:', error);
      res.status(400).json({ error: { message: error.message } });
    }
  });

  app.post('/api/cancel-subscription', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    if (!stripe) {
      return res.status(503).json({ message: "Payment processing not available" });
    }

    const user = req.user;
    
    if (!user.stripeSubscriptionId) {
      return res.status(400).json({ message: 'No active subscription found' });
    }

    try {
      // Cancel at period end instead of immediately
      const subscription = await stripe.subscriptions.update(user.stripeSubscriptionId, {
        cancel_at_period_end: true
      }) as any;
      
      await storage.updateUserSubscription(user.id, user.subscriptionPlan || 'free', 'cancel_at_period_end');
      
      res.json({ 
        message: 'Subscription will be cancelled at the end of the current billing period',
        periodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/api/reactivate-subscription', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    if (!stripe) {
      return res.status(503).json({ message: "Payment processing not available" });
    }

    const user = req.user;
    
    if (!user.stripeSubscriptionId) {
      return res.status(400).json({ message: 'No subscription found' });
    }

    try {
      // Remove cancellation
      await stripe.subscriptions.update(user.stripeSubscriptionId, {
        cancel_at_period_end: false
      });
      
      await storage.updateUserSubscription(user.id, user.subscriptionPlan || 'free', 'active');
      
      res.json({ message: 'Subscription reactivated successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Trading accounts routes
  app.get("/api/trading-accounts", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const accounts = await storage.getUserTradingAccounts(req.user.id);
      res.json(accounts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/trading-accounts", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      // Check if user can create more trading accounts
      const existingAccounts = await storage.getUserTradingAccounts(req.user.id);
      const planKey = req.user.subscriptionPlan || 'free';
      const planConfig = SUBSCRIPTION_PLANS[planKey as keyof typeof SUBSCRIPTION_PLANS] || SUBSCRIPTION_PLANS.free;
      
      if (planConfig.maxTradingAccounts !== -1 && existingAccounts.length >= planConfig.maxTradingAccounts) {
        return res.status(403).json({ 
          message: `${planConfig.name} plan limited to ${planConfig.maxTradingAccounts} trading account${planConfig.maxTradingAccounts > 1 ? 's' : ''}. Upgrade for more accounts.` 
        });
      }

      const validatedData = insertTradingAccountSchema.parse(req.body);
      const account = await storage.createTradingAccount(req.user.id, validatedData);
      
      res.status(201).json(account);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid account data", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/trading-accounts/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const accountId = parseInt(req.params.id);
      const validatedData = updateTradingAccountSchema.parse(req.body);
      
      const account = await storage.updateTradingAccount(accountId, req.user.id, validatedData);
      
      if (!account) {
        return res.status(404).json({ message: "Trading account not found" });
      }
      
      res.json(account);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid account data", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/trading-accounts/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const accountId = parseInt(req.params.id);
      const success = await storage.deleteTradingAccount(accountId, req.user.id);
      
      if (!success) {
        return res.status(404).json({ message: "Trading account not found" });
      }
      
      res.sendStatus(200);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Function to calculate user storage usage
  const calculateUserStorageUsage = async (userId: number): Promise<number> => {
    try {
      const userTrades = await db.select({
        imageUrl: trades.imageUrl
      }).from(trades).where(eq(trades.userId, userId));

      let totalSize = 0;
      for (const trade of userTrades) {
        if (trade.imageUrl && trade.imageUrl.startsWith('/uploads/')) {
          const filename = trade.imageUrl.replace('/uploads/', '');
          const filePath = path.join(uploadDir, filename);
          if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            totalSize += stats.size;
          }
        }
      }
      return totalSize;
    } catch (error) {
      console.error('Error calculating storage usage:', error);
      return 0;
    }
  };

  app.get('/api/subscription-status', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    const user = req.user;
    const tradeCount = await storage.getUserTradeCount(user.id);
    const storageUsedBytes = await calculateUserStorageUsage(user.id);
    
    const planKey = user.subscriptionPlan || 'free';
    const planConfig = SUBSCRIPTION_PLANS[planKey as keyof typeof SUBSCRIPTION_PLANS] || SUBSCRIPTION_PLANS.free;
    
    if (!user.stripeSubscriptionId || !stripe) {
      return res.json({ 
        isActive: false, 
        plan: planKey,
        status: 'inactive',
        tradeCount,
        tradeLimit: planConfig.tradeLimit,
        storageUsedBytes,
        storageLimit: planConfig.storageLimit,
        maxTradingAccounts: planConfig.maxTradingAccounts
      });
    }

    try {
      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId) as any;
      const isActive = ['active', 'trialing'].includes(subscription.status);
      
      res.json({
        isActive,
        plan: planKey,
        status: subscription.status,
        currentPeriodStart: subscription.current_period_start ? new Date(subscription.current_period_start * 1000) : null,
        currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        trialEnd: subscription.trial_end,
        tradeCount,
        tradeLimit: isActive ? planConfig.tradeLimit : 5,
        storageUsedBytes,
        storageLimit: planConfig.storageLimit,
        maxTradingAccounts: planConfig.maxTradingAccounts
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get billing information and payment method
  app.get('/api/billing', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    if (!stripe) {
      return res.status(503).json({ message: "Billing information not available" });
    }

    const user = req.user;
    
    if (!user.stripeCustomerId) {
      return res.json({
        plan: 'free',
        status: 'inactive'
      });
    }

    try {
      const customer = await stripe.customers.retrieve(user.stripeCustomerId);
      let billingInfo: BillingInfo = {
        plan: user.subscriptionPlan || 'free',
        status: user.subscriptionStatus || 'inactive'
      };

      if (user.stripeSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId) as any;
        
        billingInfo = {
          ...billingInfo,
          subscriptionId: subscription.id,
          currentPeriodStart: subscription.current_period_start ? new Date(subscription.current_period_start * 1000).toISOString() : undefined,
          currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : undefined,
          cancelAtPeriodEnd: subscription.cancel_at_period_end || false
        };

        // Get payment method
        if (subscription.default_payment_method) {
          const paymentMethodId = typeof subscription.default_payment_method === 'string' 
            ? subscription.default_payment_method 
            : subscription.default_payment_method.id;
          const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
          if (paymentMethod.card) {
            billingInfo.paymentMethod = {
              brand: paymentMethod.card.brand,
              last4: paymentMethod.card.last4,
              expMonth: paymentMethod.card.exp_month,
              expYear: paymentMethod.card.exp_year
            };
          }
        }
      }

      res.json(billingInfo);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update payment method
  app.post('/api/update-payment-method', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    if (!stripe) {
      return res.status(503).json({ message: "Payment processing not available" });
    }

    const user = req.user;
    const { paymentMethodId } = req.body;

    if (!user.stripeCustomerId || !paymentMethodId) {
      return res.status(400).json({ message: "Invalid request" });
    }

    try {
      // Attach payment method to customer
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: user.stripeCustomerId,
      });

      // Set as default payment method
      await stripe.customers.update(user.stripeCustomerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      // Update subscription if exists
      if (user.stripeSubscriptionId) {
        await stripe.subscriptions.update(user.stripeSubscriptionId, {
          default_payment_method: paymentMethodId,
        });
      }

      res.json({ message: "Payment method updated successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Stripe webhook for handling subscription events
  app.post('/api/webhook/stripe', async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ message: "Webhook processing not available" });
    }

    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body, 
        sig!, 
        process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test'
      );
    } catch (err: any) {
      console.log(`Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    try {
      switch (event.type) {
        case 'invoice.payment_succeeded':
          const successInvoice = event.data.object as any;
          const successSubscriptionId = successInvoice.subscription;
          
          if (successSubscriptionId) {
            const usersResult = await db.select().from(users).where(eq(users.stripeSubscriptionId, successSubscriptionId));
            if (usersResult.length > 0) {
              await storage.updateUserSubscription(usersResult[0].id, usersResult[0].subscriptionPlan || 'pro', 'active');
              console.log(`Subscription activated for user ${usersResult[0].id}`);
            }
          }
          break;
          
        case 'invoice.payment_failed':
          const failedInvoice = event.data.object as any;
          const failedSubscriptionId = failedInvoice.subscription;
          
          if (failedSubscriptionId) {
            const usersResult = await db.select().from(users).where(eq(users.stripeSubscriptionId, failedSubscriptionId));
            if (usersResult.length > 0) {
              await storage.updateUserSubscription(usersResult[0].id, usersResult[0].subscriptionPlan || 'pro', 'past_due');
              console.log(`Subscription payment failed for user ${usersResult[0].id}`);
            }
          }
          break;
          
        case 'customer.subscription.deleted':
          const deletedSubscription = event.data.object as any;
          const usersResult = await db.select().from(users).where(eq(users.stripeSubscriptionId, deletedSubscription.id));
          if (usersResult.length > 0) {
            await storage.updateUserSubscription(usersResult[0].id, 'free', 'canceled');
            console.log(`Subscription cancelled for user ${usersResult[0].id}`);
          }
          break;
          
        case 'customer.subscription.updated':
          const updatedSubscription = event.data.object as any;
          const updateUsersResult = await db.select().from(users).where(eq(users.stripeSubscriptionId, updatedSubscription.id));
          if (updateUsersResult.length > 0) {
            let status = updatedSubscription.status;
            if (updatedSubscription.cancel_at_period_end) {
              status = 'cancel_at_period_end';
            }
            await storage.updateUserSubscription(updateUsersResult[0].id, updateUsersResult[0].subscriptionPlan || 'pro', status);
            console.log(`Subscription updated for user ${updateUsersResult[0].id}: ${status}`);
          }
          break;
          
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error('Webhook processing error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update user currency preference
  app.put("/api/user/currency", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const validatedData = updateCurrencySchema.parse(req.body);
      await storage.updateUserCurrency(req.user.id, validatedData.preferredCurrency);
      res.json({ message: "Currency updated successfully" });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid currency data", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });



  const httpServer = createServer(app);
  return httpServer;
}
