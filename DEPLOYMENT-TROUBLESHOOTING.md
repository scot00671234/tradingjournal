# Deployment Troubleshooting Guide

## Issues and Solutions for Dokploy/VPS Deployment

### Issue 1: Railpack Detecting Python Instead of Node.js

**Problem**: Dokploy is using Railpack which detects this as a Python project due to `uv.lock` and `pyproject.toml` files.

**Solutions**:
1. **Force Dockerfile Build**: In Dokploy settings, ensure "Build Type" is set to "Dockerfile" (not "Automatic")
2. **Remove Python Files**: The `.dockerignore` file now excludes Python-related files from Docker context
3. **Use nixpacks.toml**: Added configuration to override detection

### Issue 2: Bad Gateway (502) Error

**Problem**: Application not starting properly in production.

**Solutions**:
1. **Check Environment Variables**: Ensure these are set in Dokploy:
   - `NODE_ENV=production`
   - `PORT=3000`
   - `DATABASE_URL` (your PostgreSQL connection string)
   - `SESSION_SECRET` (generate a secure random string)

2. **Check Health Endpoint**: The app has a health check at `/api/health`

3. **Check Logs**: In Dokploy, check the application logs for startup errors

### Issue 3: Domain Not Working

**Potential Causes**:
1. **DNS Configuration**: Ensure your domain points to your VPS IP
2. **Port Configuration**: App runs on port 3000, ensure Dokploy proxy is configured correctly
3. **SSL Certificate**: Make sure HTTPS is properly configured

### Dokploy Configuration Checklist

1. **Project Settings**:
   - Build Type: Dockerfile ✓
   - Source Type: GitHub ✓
   - Start Command: `./start-production.sh` ✓

2. **Environment Variables** (Required):
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=postgresql://user:password@host:port/database
   SESSION_SECRET=your-secure-random-string-here
   ```

3. **Optional Environment Variables**:
   ```
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   SENDGRID_API_KEY=SG.xxxxx
   ```

4. **Domain Configuration**:
   - Host: your-domain.com
   - Port: 3000
   - HTTPS: Enabled

### Manual Build Test

To test the build process locally:

```bash
# Build the Docker image
docker build -t coinfeedly .

# Run the container
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=your-db-url \
  -e SESSION_SECRET=your-secret \
  coinfeedly
```

### Health Check URLs

Once deployed, test these endpoints:
- `https://your-domain.com/api/health` - Should return 200 with health status
- `https://your-domain.com/` - Should serve the application

### Common Fixes

1. **Force Node.js Detection**: Ensure `package.json` is in root and no Python files interfere
2. **Database Connection**: Verify DATABASE_URL format and database accessibility
3. **Port Binding**: App binds to 0.0.0.0:3000 for Docker compatibility
4. **File Permissions**: start-production.sh has execute permissions in Dockerfile

### Next Steps if Still Not Working

1. Check Dokploy application logs
2. Verify DNS records point to correct IP
3. Test health endpoint directly: `curl https://your-domain.com/api/health`
4. Check if port 3000 is accessible on your VPS
5. Verify SSL certificate is properly configured