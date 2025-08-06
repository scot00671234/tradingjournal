# CoinFeedly - Production-Ready Trading Journal SaaS

## Overview
CoinFeedly is a production-ready SaaS trading journal designed for cryptocurrency traders. It offers a clean, Notion-style interface with professional authentication, payments, and email systems. The platform focuses on providing powerful insights and automatic trade synchronization, helping traders track, analyze, and learn from their trading activities. The business vision is to provide a premium journaling solution that emphasizes clarity, simplicity, and actionable data, positioning itself as an essential tool for serious traders aiming to improve their performance.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture
### Frontend
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter
- **Authentication**: Session-based with Passport.js
- **UI/UX**: Clean, minimalist design inspired by Notion and Vercel. Features a black/white color scheme with a golden/yellow accent. Utilizes glassmorphism effects, floating navigation, and a focus on visual hierarchy with consistent spacing and typography (Inter font family, Lucide icons). Dashboard widgets are designed for professional trading analytics with fixed sizes and drag-and-drop customization via React Grid Layout.

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ES modules)
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js (local strategy, session management, email verification, password reset)
- **Payment Processing**: Stripe for subscriptions (Pro and Elite tiers, 7-day free trial)
- **Session Storage**: PostgreSQL-backed sessions
- **Email System**: SendGrid for transactional emails (verification, password reset)

### Database Design
- **ORM**: Drizzle ORM with PostgreSQL adapter
- **Connection**: PostgreSQL (serverless compatible)
- **Schema**: Includes users, trades, trading_accounts, notes, and sessions tables, with migrations managed by Drizzle Kit.

### Core Features
- **Trading Journal**: Comprehensive trade entry (asset, direction, prices, P&L, notes, tags), history tracking, and analytics.
- **Trading Accounts**: Multi-account management based on subscription tiers (Free: 1 account, Pro: 1, Elite: 10, Diamond: 20, Enterprise: unlimited).
- **Subscription Model**: 3-trade limit for free users (changed from 7-day trial), with Pro/Elite/Diamond/Enterprise tiers offering unlimited trades.
- **Dashboard**: Customizable with essential trading widgets including Equity Curve, Performance Metrics, Drawdown Analysis, Trade List, Daily P&L, and an enhanced visual Trade Calendar.
- **User Management**: Professional authentication, account settings, currency selection, and profile management.
- **Deployment Readiness**: Production-ready with multi-stage Docker builds, health checks, database migrations, and Dokploy configuration for seamless VPS deployment.

## External Dependencies
- **Stripe**: For subscription management and payment processing (production-ready with test/live key support).
- **PostgreSQL**: Database hosting (compatible with Neon, Railway, Supabase, etc.).
- **SendGrid**: For email verification and password reset functionalities.
- **shadcn/ui**: UI component library based on Radix UI and Tailwind CSS.
- **React Grid Layout**: For customizable drag-and-drop dashboard functionality.

## Recent Changes (January 2025)
- **Migration Complete**: Successfully migrated from Replit Agent to standard Replit environment with PostgreSQL database (January 6, 2025)
- **Logo Restoration**: Restored original Bitcoin icon logo in orange color scheme across sidebar and authentication pages
- **Production Deployment**: Fixed Dokploy deployment configuration to properly detect Node.js (not Python), added proper .dockerignore, Procfile, and comprehensive troubleshooting guide
- **Docker Configuration**: Enhanced Dockerfile with proper health checks, ES modules support, and production optimizations
- **Database Connection**: Enhanced database connection with intelligent SSL detection for different platforms (Dokploy, Neon, Supabase, Railway)
- **SSL Configuration**: Fixed SSL connection issues for Docker deployments by automatically disabling SSL for local databases while maintaining SSL for cloud providers
- **Environment Variables**: Standardized environment variable handling for consistent deployment across platforms
- **Port Configuration**: Fixed port handling to ensure proper listening on 0.0.0.0:3000 in production
- **Troubleshooting**: Added DOKPLOY-SSL-FIX.md guide specifically for resolving SSL connection issues in Docker environments
- **UI Improvements**: Refined golden button styling with better font rendering and proportional sizing  
- **Golden Avatar**: Implemented light gold avatar button with dropdown logout menu functionality
- **Button Consistency**: All golden buttons now use consistent styling with white text and proper hover states
- **Subscription Model**: Changed from 7-day free trial to 3-trade limit for free users
- **Trading Accounts**: Added multi-account functionality with subscription-based limits
- **Database Schema**: Extended to include trading_accounts table with proper relations
- **Stripe Integration**: Enhanced with production-ready configuration and API versioning
- **Emergency Deployment Fix**: Fixed critical issue where Caddy was running but Node.js app wasn't starting in production. Created comprehensive startup script (start.sh) and Nixpacks configuration to ensure both services start correctly. Added emergency troubleshooting guides and proper Caddyfile configuration for coinfeedly.com domain routing.
- **Production 404 Fix (Jan 6, 2025)**: Resolved persistent coinfeedly.com 404 errors by simplifying the deployment architecture. The root issue was overcomplicating the setup with dual services (Node.js + Caddy). Solution: Removed all custom Nixpacks configuration and Caddyfile to let Nixpacks auto-detect the Node.js application. The Node.js server already handles both API routes and static file serving in production via the serveStatic function. Now Nixpacks simply runs npm install, npm run build, and npm start - exactly what it's designed for.