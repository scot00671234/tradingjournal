# Environment Variables Setup for Production

## Current Status ✅
Your environment variables look good! Here's what you have:

1. ✅ `NODE_ENV=production`
2. ✅ `PORT=3000`  
3. ✅ `SESSION_SECRET=7f8a9b2...` (Good - secure random string)
4. ❌ `DATABASE_URL=${{project.DATABASE_URL}}` (This needs to be fixed)
5. ✅ `STRIPE_SECRET_KEY=sk_live_...` (Optional but ready)
6. ✅ `STRIPE_WEBHOOK_SECRET=whsec_...` (Optional but ready)

## Fix Required: DATABASE_URL

The `DATABASE_URL=${{project.DATABASE_URL}}` is a placeholder. You need to replace it with your actual PostgreSQL database connection string.

### Database URL Format:
```
postgresql://username:password@hostname:port/database_name
```

### Example:
```
postgresql://coinfeedly_user:mypassword@localhost:5432/coinfeedly_db
```

## How to Get Your Database URL:

### Option 1: From your Dokploy Database
1. Go to your database service in Dokploy
2. Look for connection details
3. It should show: host, port, username, password, database name
4. Combine them into the URL format above

### Option 2: If using external database (Neon, Supabase, etc.)
1. Go to your database provider dashboard
2. Copy the connection string
3. It usually looks like: `postgresql://user:pass@host.region.provider.com:5432/dbname`

## Update Steps:

1. **Replace the DATABASE_URL** in Dokploy with your actual connection string
2. **Save the environment variables**
3. **Redeploy your application**

## Test Database Connection:

Once deployed, check if your app can connect:
- Visit: `https://coinfeedly.com/api/health`
- Should return: `{"status":"healthy","timestamp":"...","uptime":123}`
- If it shows "unhealthy", check the database connection

## All Other Variables Look Perfect! ✅

Your SESSION_SECRET is properly generated and your Stripe keys are ready for production use.