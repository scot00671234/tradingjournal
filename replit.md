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
- **Connection**: Neon Database (serverless)
- **Schema**: Includes users and trades tables, with migrations managed by Drizzle Kit.

### Core Features
- **Trading Journal**: Comprehensive trade entry (asset, direction, prices, P&L, notes, tags), history tracking, and analytics.
- **Dashboard**: Customizable with essential trading widgets including Equity Curve, Performance Metrics, Drawdown Analysis, Trade List, Daily P&L, and an enhanced visual Trade Calendar.
- **User Management**: Professional authentication, account settings, currency selection, and profile management.
- **Deployment Readiness**: Optimized for production VPS deployment (Docker, docker-compose, Nginx, Dokploy) and Cloudron integration.

## External Dependencies
- **Stripe**: For subscription management and payment processing.
- **Neon Database**: Serverless PostgreSQL hosting.
- **SendGrid**: For email verification and password reset functionalities.
- **shadcn/ui**: UI component library based on Radix UI and Tailwind CSS.
- **React Grid Layout**: For customizable drag-and-drop dashboard functionality.