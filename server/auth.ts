import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { 
  User as SelectUser, 
  insertUserSchema, 
  loginSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema,
  updateProfileSchema
} from "../shared/schema.js";
import { z } from "zod";
import { emailService, generateSecureToken } from "./email";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      const user = await storage.getUserByEmail(email);
      if (!user || !(await comparePasswords(password, user.password))) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });

  // Registration with email verification
  app.post("/api/register", async (req, res, next) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const user = await storage.createUser({
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        password: await hashPassword(validatedData.password),
        preferredCurrency: 'USD'
      });

      // Create default trading account for new user
      await storage.createTradingAccount(user.id, {
        name: "Main Account",
        description: "Your primary trading account",
        initialBalance: 0,
        currentBalance: 0,
        isActive: true,
      });

      // In development, auto-verify emails for easier testing
      if (process.env.NODE_ENV === 'development') {
        // Update the user to mark email as verified in development
        const updatedUser = await storage.getUser(user.id);
        if (updatedUser) {
          // For development, we'll just continue with the unverified user since email verification is disabled
        }
      }

      // In production, send verification email
      if (process.env.NODE_ENV !== 'development') {
        // Generate and store email verification token
        const verificationToken = generateSecureToken();
        await storage.setEmailVerificationToken(user.id, verificationToken);
        
        // Send verification email
        await emailService.sendVerificationEmail(
          user.email,
          verificationToken,
          user.firstName
        );

        res.status(201).json({ 
          message: "Registration successful. Please check your email to verify your account.",
          user: { id: user.id, email: user.email, firstName: user.firstName }
        });
      } else {
        // In development, log the user in immediately
        req.login(user, (err) => {
          if (err) return next(err);
          res.status(201).json({
            message: "Registration successful. You are now logged in (development mode).",
            user: user
          });
        });
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid registration data", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  // Email verification
  app.get("/api/verify-email", async (req, res) => {
    try {
      const { token } = req.query;
      if (!token) {
        return res.status(400).json({ message: "Verification token required" });
      }

      const user = await storage.verifyEmailWithToken(token as string);
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired verification token" });
      }

      // Send welcome email
      await emailService.sendWelcomeEmail(user.email, user.firstName);

      res.json({ message: "Email verified successfully. You can now log in." });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Login (only for verified users)
  app.post("/api/login", async (req, res, next) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // In development, allow login without email verification for testing
      if (!user.isEmailVerified && process.env.NODE_ENV !== 'development') {
        return res.status(403).json({ 
          message: "Please verify your email address before logging in",
          needsVerification: true
        });
      }

      if (!(await comparePasswords(validatedData.password, user.password))) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      req.login(user, (err) => {
        if (err) return next(err);
        res.json(user);
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid login data", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  // Forgot password
  app.post("/api/forgot-password", async (req, res) => {
    try {
      const validatedData = forgotPasswordSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        // Don't reveal if email exists or not for security
        return res.json({ message: "If an account with that email exists, we've sent a password reset link." });
      }

      const resetToken = generateSecureToken();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
      
      await storage.setPasswordResetToken(user.email, resetToken, expiresAt);
      await emailService.sendPasswordResetEmail(user.email, resetToken, user.firstName);

      res.json({ message: "If an account with that email exists, we've sent a password reset link." });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid email format", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  // Reset password
  app.post("/api/reset-password", async (req, res) => {
    try {
      const validatedData = resetPasswordSchema.parse(req.body);
      
      const user = await storage.getUserByPasswordResetToken(validatedData.token);
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }

      const hashedPassword = await hashPassword(validatedData.password);
      await storage.updateUserPassword(user.id, hashedPassword);
      await storage.clearPasswordResetToken(user.id);

      res.json({ message: "Password reset successfully. You can now log in with your new password." });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid password data", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  // Update profile
  app.put("/api/profile", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const validatedData = updateProfileSchema.parse(req.body);
      
      // Check if email is being changed and if it's already taken
      if (validatedData.email !== req.user.email) {
        const existingUser = await storage.getUserByEmail(validatedData.email);
        if (existingUser && existingUser.id !== req.user.id) {
          return res.status(400).json({ message: "Email already exists" });
        }
      }

      const updatedUser = await storage.updateUserProfile(req.user.id, validatedData);
      res.json(updatedUser);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  // Delete account
  app.delete("/api/account", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const success = await storage.deleteUser(req.user.id);
      if (!success) {
        return res.status(500).json({ message: "Failed to delete account" });
      }

      req.logout(() => {
        res.json({ message: "Account deleted successfully" });
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}

// Export the password hashing functions for use in routes
export { hashPassword, comparePasswords };
