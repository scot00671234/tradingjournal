# Trading Journal Application

## Overview

This is a full-stack trading journal application built with React, Express, and PostgreSQL. The application allows users to track their trading activities, analyze performance metrics, and manage their trading data with a subscription-based model using Stripe integration.

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