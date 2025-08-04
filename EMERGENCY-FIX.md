# EMERGENCY FIX - CoinFeedly Not Starting

## PROBLEM IDENTIFIED
Your deployment builds successfully but **Node.js application is NOT running**.

Caddy starts but has nothing to proxy to because your app isn't running on port 3000.

## ROOT CAUSE
Dokploy is using Nixpacks which is:
1. ✅ Building your app correctly 
2. ✅ Installing dependencies
3. ✅ Starting Caddy
4. ❌ **NOT starting your Node.js application**

## IMMEDIATE FIXES

### Fix 1: Update Your Start Command in Dokploy

In your Dokploy dashboard:
1. Go to your CoinFeedly app
2. Find "Start Command" or "Custom Start Command" 
3. Change it to:

```bash
NODE_ENV=production node dist/index.js & caddy run --config /assets/Caddyfile --adapter caddyfile
```

This starts BOTH your Node.js app AND Caddy.

### Fix 2: Alternative - Use Process Manager

```bash
npm install -g pm2
pm2 start dist/index.js --name coinfeedly & caddy run --config /assets/Caddyfile --adapter caddyfile
```

### Fix 3: Create a Startup Script

Create this file in your project root as `start.sh`:

```bash
#!/bin/bash
echo "Starting CoinFeedly..."

# Start Node.js app in background
NODE_ENV=production PORT=3000 node dist/index.js &
NODE_PID=$!

# Start Caddy in foreground
caddy run --config /assets/Caddyfile --adapter caddyfile &
CADDY_PID=$!

# Wait for both processes
wait $NODE_PID $CADDY_PID
```

Then in Dokploy, set start command to: `chmod +x start.sh && ./start.sh`

## VERIFY THE FIX

After applying the fix, you should see BOTH processes in the logs:
```
🚀 CoinFeedly server running on http://0.0.0.0:3000
[Caddy logs showing server running]
```

## WHY THIS HAPPENED

Nixpacks automatically detected your project as Node.js but defaulted to only starting Caddy because of the Caddyfile presence. It didn't know it needed to start BOTH services.

## ENVIRONMENT VARIABLES TO SET

Make sure these are set in Dokploy:
```
NODE_ENV=production
PORT=3000
DATABASE_URL=your_database_url
SESSION_SECRET=your_session_secret
```

The fix is simple: start your Node.js app AND Caddy together!