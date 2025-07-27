# CoinFeedly - Clean, Simple Trading Journal

## Overview

CoinFeedly is a beautiful, Notion-style trading journal with automatic trade sync and powerful insights. Built with React, Express, and PostgreSQL, it provides a clean, minimalist interface focused on clarity and speed for cryptocurrency traders.

**Tagline**: A beautiful, Notion-style trading journal with automatic trade sync and powerful insights.

## Recent Changes (January 27, 2025)
- ✓ Successfully migrated from Replit Agent to Replit environment (completed migration checklist)
- ✓ Improved footer organization with balanced sections and relevant pages
- ✓ Configured PostgreSQL database with proper environment variables  
- ✓ Resolved all dependency issues and server startup problems
- ✓ Verified full-stack application running on port 5000
- ✓ Enhanced footer with clean organization: Product, Resources, Legal sections
- ✓ Removed fake/placeholder pages and kept only authentic functional links
- ✓ Transformed into CoinFeedly with ultra-clean Vercel/Notion-style UI
- ✓ Completely removed sidebar and consolidated all features into single dashboard
- ✓ Implemented glassmorphism effects with backdrop blur and transparency
- ✓ Added floating navigation bar and collapsible trade entry form
- ✓ Integrated search functionality and simplified user experience
- ✓ Removed bouncing animations for stable, professional interface
- ✓ Fixed trade entry form validation and data type handling
- ✓ Implemented functional filter system with direction, asset, and timeframe filters
- ✓ Added comprehensive trading dashboard graphics:
  - Cumulative P&L area chart
  - Win/Loss distribution pie chart
  - Long vs Short performance bar chart
  - Individual trade P&L visualization
- ✓ Implemented customizable drag-and-drop dashboard with React Grid Layout
- ✓ Created four essential trading widgets:
  - Equity Curve: Professional account value progression with reference lines
  - Drawdown Analysis: Underwater equity curve with risk assessment
  - Performance Metrics: Key trading statistics (win rate, profit factor, R:R, expectancy)
  - Trade List: Scrollable recent trades with visual indicators
- ✓ Added customization mode with visual feedback and smooth animations
- ✓ Focused on the two most critical trading charts as per research
- ✓ Completely rebuilt landing page with minimal design system (January 27, 2025):
  - Inter font family as default typography
  - #00FFC2 accent color for CTA buttons and highlights
  - Minimal layout with soft shadows and clean typography
  - Black/white color scheme with single accent color
  - Lucide icons throughout for consistency
  - Value-focused messaging over feature lists
  - Mobile-responsive Tailwind implementation
- ✓ Enhanced landing page with powerful messaging and visuals (January 27, 2025):
  - Bold headline: "Serious traders journal. Losers just 'remember."
  - Ocean wave background image in hero section with proper overlay
  - Aligned header navigation buttons for professional appearance
  - Updated pricing to $29 Pro / $49 Elite with 7-day free trial
  - Removed free tier to focus on serious trader value proposition
  - Clean, truthful feature representation: Track trades, Analyze trends, Reflect & learn
  - Professional layout emphasizing the seriousness of trading journaling
- ✓ Dashboard fully customizable with professional trading analytics
- ✓ Landing page complete with minimal design system and compelling messaging
- ✓ Enhanced lifestyle gallery section with sophisticated visual presentation (January 27, 2025):
  - "Unlock Your Potential" title replacing "The destination"
  - Magazine-style asymmetric grid layout with modern villa as hero image
  - Added luxury lifestyle images: Rolex watch, blue Porsche, tropical villa
  - Improved spacing with 32px padding and professional visual hierarchy
  - Subtle animations and hover effects for premium user experience
  - Removed explicit messaging for more sophisticated presentation
- ✓ Created comprehensive SEO blog system (January 27, 2025):
  - Modern, clean footer with organized navigation and blog links
  - Professional blog page with 6 SEO-optimized articles targeting trader search intent
  - Individual blog post pages with proper SEO meta tags and structured content
  - Blog topics: Trading Psychology, Risk Management, Technical Analysis, Market Cycles
  - Clean typography and professional layout matching CoinFeedly design system
  - Strategic CTAs throughout blog content to drive conversions

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for development and production builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Authentication**: Session-based authentication with passport.js

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with local strategy and session management
- **Payment Processing**: Stripe integration for subscription management
- **Session Storage**: PostgreSQL-backed session store

### Database Design
- **ORM**: Drizzle ORM with PostgreSQL adapter
- **Connection**: Neon Database serverless connection
- **Schema**: Defined in shared/schema.ts with users and trades tables
- **Migrations**: Managed through Drizzle Kit

## Key Components

### Authentication System
- Session-based authentication using Passport.js
- Password hashing with Node.js crypto (scrypt)
- Protected routes with middleware
- User registration and login functionality

### Trading Data Management
- Trade entry with comprehensive fields (asset, direction, entry/exit prices, P&L, notes, tags)
- Trade history tracking and analytics
- Performance statistics calculation
- Image attachment support for trade screenshots

### Subscription Management
- Free tier (limited to 5 trades)
- Pro tier (unlimited trades)
- Stripe integration for payment processing
- Subscription status tracking and management

### User Interface
- Responsive design with mobile support
- Dark/light theme toggle
- Real-time data updates with React Query
- Form validation with React Hook Form and Zod
- Toast notifications for user feedback

## Data Flow

1. **User Authentication**: Users register/login through the auth system, creating a session
2. **Trade Entry**: Users input trade data through forms, validated on both client and server
3. **Data Persistence**: Trade data is stored in PostgreSQL with user association
4. **Statistics Calculation**: Server calculates performance metrics from trade data
5. **Subscription Management**: Stripe handles payment processing and subscription status
6. **Real-time Updates**: React Query manages cache invalidation and data synchronization

## External Dependencies

### Payment Processing
- **Stripe**: Handles subscription payments and customer management
- **Integration**: Server-side Stripe SDK for payment processing
- **Frontend**: Stripe Elements for payment form handling

### Database
- **Neon Database**: Serverless PostgreSQL hosting
- **Connection**: WebSocket-based connection for serverless environments
- **Session Storage**: PostgreSQL-backed session persistence

### UI Components
- **shadcn/ui**: Pre-built accessible components
- **Radix UI**: Headless UI primitives
- **Tailwind CSS**: Utility-first styling framework

### Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Type safety across the application
- **Replit Integration**: Development environment optimization

## Deployment Strategy

### Development Environment
- **Vite Dev Server**: Hot module replacement for frontend development
- **Express Server**: API server with middleware integration
- **Database**: Neon Database with development credentials

### Production Build
- **Frontend**: Vite builds optimized static assets
- **Backend**: esbuild bundles server code for Node.js
- **Database**: Production PostgreSQL instance
- **Environment Variables**: Separate configuration for production secrets

### Key Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session signing secret
- `STRIPE_SECRET_KEY`: Stripe API secret key
- `VITE_STRIPE_PUBLIC_KEY`: Stripe publishable key for frontend

The application follows a monorepo structure with shared TypeScript definitions, enabling type safety across the full stack while maintaining clear separation between client and server concerns.