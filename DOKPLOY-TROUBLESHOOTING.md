# Dokploy Deployment Troubleshooting Guide

## Current Issues & Solutions

### 1. Bad Gateway (502) Error
**Problem**: Your app shows "Bad Gateway" when accessing coinfeedly.com
**Root Cause**: App container is not starting properly or not responding on the expected port

### 2. Required Environment Variables
Based on your screenshots, you need to set these environment variables in Dokploy:

#### Critical Environment Variables (App won't start without these):
```
DATABASE_URL=postgresql://username:password@host:port/database_name
SESSION_SECRET=your-very-secure-random-string-here
NODE_ENV=production
PORT=3000
```

#### Optional (for full functionality):
```
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
SENDGRID_API_KEY=SG.your_sendgrid_api_key
```

### 3. Database Connection Setup
In your database environment settings, ensure:
```
NODE_ENV=production
PORT=5432
```

### 4. Step-by-Step Fix Instructions

#### Step 1: Set Environment Variables
1. Go to your app → Environment tab
2. Add the following variables:
   - `DATABASE_URL`: Use the project-level DATABASE_URL format: `{{project.DATABASE_URL}}`
   - `SESSION_SECRET`: Generate a secure random string (32+ characters)
   - `NODE_ENV`: Set to `production`
   - `PORT`: Set to `3000`

#### Step 2: Database Connection Format
Your DATABASE_URL should follow this format:
```
postgresql://username:password@host:port/database_name
```
Where `host` should be the internal Docker network name of your database container.

#### Step 3: Verify Port Configuration
- App should expose port `3000` (already configured in Dockerfile)
- Domain should point to port `3000` (already configured)
- Health check should use `/api/health` endpoint (already configured)

#### Step 4: Deploy and Test
1. Save all environment variables
2. Trigger a manual deployment
3. Check logs for any startup errors
4. Test health endpoint: `https://coinfeedly.com/api/health`

### 5. Common Dokploy Deployment Issues

#### Issue: Container Exits Immediately
**Solution**: Check if all required environment variables are set

#### Issue: Database Connection Failed
**Solutions**:
- Verify DATABASE_URL format
- Ensure database container is running
- Check network connectivity between containers
- Verify database credentials

#### Issue: Build Succeeds but App Won't Start
**Solutions**:
- Check if NODE_ENV is set to 'production'
- Verify all dependencies are installed in Docker image
- Check startup script permissions (`chmod +x start-production.sh`)

### 6. Debugging Commands

#### Check Container Logs
In Dokploy, go to Logs tab to see real-time application logs

#### Health Check Test
```bash
curl -f http://localhost:3000/api/health
```

#### Database Connection Test
```bash
node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT NOW()').then(res => console.log('DB Connected:', res.rows[0])).catch(console.error);
"
```

### 7. Expected Startup Sequence
When deployment is successful, you should see these logs:
```
Starting CoinFeedly in production mode...
Waiting for database connection...
Database connected
Running database migrations...
Starting application on port 3000...
serving on port 3000
```

### 8. Quick Fix Checklist
- [ ] DATABASE_URL environment variable is set and correctly formatted
- [ ] SESSION_SECRET is set with a secure random string
- [ ] NODE_ENV=production is set
- [ ] PORT=3000 is set
- [ ] Database container is running and accessible
- [ ] Domain is configured to point to port 3000
- [ ] SSL/HTTPS is properly configured
- [ ] No firewall blocking port 3000

### 9. Contact Points
If issues persist after following this guide:
1. Check Dokploy community forums
2. Verify all environment variables match the requirements
3. Test database connectivity separately
4. Review container resource limits (memory/CPU)

Remember: The 502 Bad Gateway typically means the reverse proxy (Traefik) can't reach your application container, usually due to the app not starting properly or environment variable issues.