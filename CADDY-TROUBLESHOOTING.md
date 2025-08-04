# Caddy 404 Error Fix for CoinFeedly

## Problem
Caddy returns 404 error for coinfeedly.com because it can't find a route handler.

## Root Cause
The Caddyfile in `/assets/Caddyfile` is missing the proper reverse proxy configuration to route requests from `coinfeedly.com` to your Node.js application.

## Solution

### 1. Basic Fix - Update Your Caddyfile
Replace your current Caddyfile with this minimal configuration:

```caddy
coinfeedly.com {
    reverse_proxy localhost:3000
}
```

### 2. Full Production Configuration
Use the provided `Caddyfile` in the project root which includes:
- Reverse proxy to Node.js app on port 3000
- Security headers
- Logging configuration  
- HTTPS/SSL automatic setup
- www to non-www redirect

### 3. Port Configuration Check
Based on your Node.js configuration:
- **Development**: Uses port 5000
- **Production**: Uses port 3000 (set by PORT environment variable)

Make sure your Dokploy environment has:
```env
PORT=3000
NODE_ENV=production
```

### 4. Dokploy Configuration Steps

1. **In Dokploy Dashboard**:
   - Go to your CoinFeedly application
   - Check "Domains" section
   - Ensure domain is set to `coinfeedly.com`
   - Verify port mapping: External 80/443 → Internal 3000

2. **Environment Variables**:
   ```env
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=your_database_url
   SESSION_SECRET=your_session_secret
   ```

3. **Copy Caddyfile**:
   - Copy the `Caddyfile` from this project
   - Place it in `/assets/Caddyfile` on your server
   - Or update your existing Caddyfile with the reverse proxy config

### 5. Testing the Fix

After updating the Caddyfile:

1. **Restart Caddy**:
   ```bash
   sudo systemctl reload caddy
   ```

2. **Check Caddy Status**:
   ```bash
   sudo systemctl status caddy
   ```

3. **Test the Endpoint**:
   ```bash
   curl -I https://coinfeedly.com
   ```
   Should return `200 OK` instead of `404 Not Found`

4. **Check Node.js is Running**:
   ```bash
   curl http://localhost:3000/api/health
   ```

### 6. Alternative Ports
If port 3000 doesn't work, try these alternatives in your Caddyfile:

```caddy
coinfeedly.com {
    # Try port 5000 if your app is running there
    reverse_proxy localhost:5000
}
```

### 7. Debug Commands

```bash
# Check what's listening on ports
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :5000

# Check Caddy configuration syntax
caddy validate --config /assets/Caddyfile

# Check Caddy logs
sudo journalctl -u caddy -f
```

## Expected Result
After fixing the Caddyfile, visiting `https://coinfeedly.com` should:
1. Return HTTP 200 status
2. Load the CoinFeedly trading journal interface
3. Show proper HTTPS certificate from Let's Encrypt

## Files Created
- `Caddyfile` - Full production configuration
- `Caddyfile.backup` - Simple backup configuration
- This troubleshooting guide

The main issue was that Caddy had no route handler for `coinfeedly.com`, so it returned 404. Adding the reverse proxy configuration routes all requests to your Node.js application.