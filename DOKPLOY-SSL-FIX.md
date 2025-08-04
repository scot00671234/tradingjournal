# Dokploy SSL Connection Fix Guide

## The Problem
Your Dokploy PostgreSQL database doesn't support SSL connections, but the application tries to connect with SSL by default, causing this error:
```
Error: The server does not support SSL connections
Code: undefined
Detail: No additional details
```

## The Solution
The database configuration has been updated to automatically detect the deployment platform and disable SSL for Docker environments like Dokploy.

### 1. Code Changes Made
Updated `server/db.ts` to include smart SSL detection:
- Automatically disables SSL for Dokploy databases (contains `coin-feedly-database`)
- Keeps SSL enabled for cloud providers (Neon, Supabase, Railway)
- Adds `DISABLE_SSL=true` environment variable override option

### 2. Dokploy Environment Variables
In your Dokploy app configuration, make sure you have:

**Required:**
```
NODE_ENV=production
DATABASE_URL=postgresql://postgres:your_password@coin-feedly-database-vztqxv:5432/postgres
```

**Optional (if automatic detection fails):**
```
DISABLE_SSL=true
```

### 3. Database URL Format
Your DATABASE_URL should look like this for Dokploy:
```
postgresql://postgres:password@coin-feedly-database-vztqxv:5432/postgres
```

**Do NOT add** `?sslmode=require` or `?ssl=true` to the URL for Dokploy deployments.

### 4. Redeploy Steps
1. Update your code with the latest changes
2. Push to your Git repository
3. Trigger a new deployment in Dokploy
4. Check the logs - you should see SSL is disabled for Dokploy platform

### 5. Verification
In the application logs, you should see:
```
Database connection info: {
  url: 'postgresql://postgres:****@coin-feedly-database-vztqxv:5432/postgres',
  isProduction: true,
  sslEnabled: false,
  platform: 'Dokploy'
}
```

### 6. Alternative Solutions (if needed)
If the automatic detection doesn't work, you can:

**Option A:** Add environment variable
```
DISABLE_SSL=true
```

**Option B:** Modify your DATABASE_URL to explicitly disable SSL
```
postgresql://postgres:password@coin-feedly-database-vztqxv:5432/postgres?sslmode=disable
```

## Common Dokploy Issues & Solutions

### Issue: App not starting
- Check that `NODE_ENV=production` is set
- Verify DATABASE_URL points to your Dokploy database
- Ensure all required environment variables are set

### Issue: Port binding problems
- App should listen on `0.0.0.0:3000` (already configured)
- Don't change the port configuration

### Issue: Database connection timeout
- Database container must be running before app container
- Check database logs in Dokploy dashboard
- Verify database service name matches your DATABASE_URL

## Next Steps
1. Deploy the updated code to Dokploy
2. Monitor the deployment logs
3. Verify the application starts successfully
4. Test database connectivity

The SSL issue should now be resolved automatically based on your deployment platform.