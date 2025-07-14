import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertTradeSchema, updateTradeSchema, users, trades } from "@shared/schema";
import { z } from "zod";
import Stripe from "stripe";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Use default keys for development if not set
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_default');

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

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
      if (!req.user.isProUser && tradeCount >= 5) {
        return res.status(403).json({ 
          message: "Free plan limited to 5 trades. Upgrade to Pro for unlimited trades." 
        });
      }

      const validatedData = insertTradeSchema.parse(req.body);
      const trade = await storage.createTrade({
        ...validatedData,
        userId: req.user.id,
      });
      
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

  // Subscription routes
  app.post('/api/create-subscription', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    let user = req.user;

    // Check if user already has a subscription
    if (user.stripeSubscriptionId) {
      try {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        const invoice = await stripe.invoices.retrieve(subscription.latest_invoice as string);
        
        res.json({
          subscriptionId: subscription.id,
          clientSecret: (invoice as any).payment_intent?.client_secret,
        });
        return;
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
          name: user.username,
        });
        customerId = customer.id;
      }

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'TradeJournal Pro',
            },
            unit_amount: 1900, // $19.00 in cents
            recurring: {
              interval: 'month',
            },
          } as any,
        }],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
      });

      // Update user with Stripe info
      await storage.updateUserStripeInfo(user.id, customerId, subscription.id);

      const invoice = subscription.latest_invoice as any;
      res.json({
        subscriptionId: subscription.id,
        clientSecret: invoice.payment_intent.client_secret,
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

    const user = req.user;
    
    if (!user.stripeSubscriptionId) {
      return res.status(400).json({ message: 'No active subscription found' });
    }

    try {
      await stripe.subscriptions.cancel(user.stripeSubscriptionId);
      await storage.updateUserProStatus(user.id, false);
      
      res.json({ message: 'Subscription cancelled successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get('/api/subscription-status', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    const user = req.user;
    
    if (!user.stripeSubscriptionId) {
      return res.json({ 
        isActive: false, 
        plan: 'free',
        tradeCount: await storage.getUserTradeCount(user.id),
        tradeLimit: 5
      });
    }

    try {
      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
      const isActive = subscription.status === 'active';
      
      res.json({
        isActive,
        plan: isActive ? 'pro' : 'free',
        status: subscription.status,
        currentPeriodEnd: (subscription as any).current_period_end,
        tradeCount: await storage.getUserTradeCount(user.id),
        tradeLimit: isActive ? null : 5
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Stripe webhook for handling subscription events
  app.post('/api/webhook/stripe', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
      console.log(`Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        const subscriptionId = (invoice as any).subscription;
        
        // Update user to Pro status
        const usersResult = await db.select().from(users).where(eq(users.stripeSubscriptionId, subscriptionId));
        if (usersResult.length > 0) {
          await storage.updateUserProStatus(usersResult[0].id, true);
        }
        break;
        
      case 'invoice.payment_failed':
        const failedInvoice = event.data.object;
        const failedSubscriptionId = (failedInvoice as any).subscription;
        
        // Update user to free status
        const failedUsers = await db.select().from(users).where(eq(users.stripeSubscriptionId, failedSubscriptionId));
        if (failedUsers.length > 0) {
          await storage.updateUserProStatus(failedUsers[0].id, false);
        }
        break;
        
      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
        
        // Update user to free status
        const deletedUsers = await db.select().from(users).where(eq(users.stripeSubscriptionId, deletedSubscription.id));
        if (deletedUsers.length > 0) {
          await storage.updateUserProStatus(deletedUsers[0].id, false);
        }
        break;
    }

    res.json({ received: true });
  });

  // User account deletion
  app.delete("/api/user", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const user = req.user;
      
      // Cancel subscription if exists
      if (user.stripeSubscriptionId) {
        await stripe.subscriptions.cancel(user.stripeSubscriptionId);
      }
      
      // Delete user trades
      await db.delete(trades).where(eq(trades.userId, user.id));
      
      // Delete user account
      await db.delete(users).where(eq(users.id, user.id));
      
      res.json({ message: "Account deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
