import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertTradeSchema, updateTradeSchema, users, trades, type BillingInfo } from "@shared/schema";
import { z } from "zod";
import Stripe from "stripe";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Initialize Stripe (will use environment variables in production)
const stripe = process.env.STRIPE_SECRET_KEY ? 
  new Stripe(process.env.STRIPE_SECRET_KEY) : 
  null;

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
      
      // Convert string prices to numbers for database storage
      const tradeData = {
        ...validatedData,
        userId: req.user.id,
        entryPrice: parseFloat(validatedData.entryPrice),
        exitPrice: validatedData.exitPrice ? parseFloat(validatedData.exitPrice) : undefined,
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
            product_data: {
              name: selectedPlan.name,
            },
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
      });
      
      await storage.updateUserSubscription(user.id, user.subscriptionPlan, 'cancel_at_period_end');
      
      res.json({ 
        message: 'Subscription will be cancelled at the end of the current billing period',
        periodEnd: subscription.current_period_end
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
      
      await storage.updateUserSubscription(user.id, user.subscriptionPlan, 'active');
      
      res.json({ message: 'Subscription reactivated successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get('/api/subscription-status', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    const user = req.user;
    const tradeCount = await storage.getUserTradeCount(user.id);
    
    if (!user.stripeSubscriptionId || !stripe) {
      return res.json({ 
        isActive: false, 
        plan: 'free',
        status: 'inactive',
        tradeCount,
        tradeLimit: 5
      });
    }

    try {
      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
      const isActive = ['active', 'trialing'].includes(subscription.status);
      
      res.json({
        isActive,
        plan: user.subscriptionPlan,
        status: subscription.status,
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        trialEnd: subscription.trial_end,
        tradeCount,
        tradeLimit: isActive ? null : 5
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
        plan: user.subscriptionPlan,
        status: user.subscriptionStatus
      };

      if (user.stripeSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        
        billingInfo = {
          ...billingInfo,
          subscriptionId: subscription.id,
          currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
          cancelAtPeriodEnd: subscription.cancel_at_period_end
        };

        // Get payment method
        if (subscription.default_payment_method) {
          const paymentMethod = await stripe.paymentMethods.retrieve(subscription.default_payment_method as string);
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
              await storage.updateUserSubscription(usersResult[0].id, usersResult[0].subscriptionPlan, 'active');
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
              await storage.updateUserSubscription(usersResult[0].id, usersResult[0].subscriptionPlan, 'past_due');
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
            await storage.updateUserSubscription(updateUsersResult[0].id, updateUsersResult[0].subscriptionPlan, status);
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

  const httpServer = createServer(app);
  return httpServer;
}
