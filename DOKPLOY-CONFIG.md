# Dokploy Docker Configuration Guide

## Required Dokploy Settings

### Build Configuration
- **Build Type**: ✅ Dockerfile (SELECTED)
- **Docker File**: `Dockerfile.web`
- **Docker Context Path**: `.` (root directory)
- **Docker Build Stage**: `production`

### Environment Variables (Required)
Set these in Dokploy Environment section:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://username:password@host:5432/database
SESSION_SECRET=your-super-secure-random-string-here
```

### Optional Environment Variables
```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
SENDGRID_API_KEY=SG.xxxxx
```

### Port Configuration
- **Internal Port**: 3000
- **External Port**: 80 or 443 (for HTTPS)

### Domain Configuration
- **Domain**: coinfeedly.com
- **HTTPS**: Enabled
- **Auto SSL**: Enabled

### Health Check
- **Path**: `/api/health`
- **Interval**: 30s
- **Timeout**: 10s
- **Retries**: 3

## Deployment Steps

1. **Ensure Docker build type is selected** ✅
2. **Set Docker File to**: `Dockerfile.web`
3. **Add all environment variables** (especially DATABASE_URL)
4. **Configure domain and SSL**
5. **Deploy**

## Troubleshooting

### If build fails:
- Check logs for specific error messages
- Ensure DATABASE_URL is properly formatted
- Verify all environment variables are set

### If app doesn't start:
- Check container logs in Dokploy
- Verify health check endpoint: `https://yourdomain.com/api/health`
- Ensure port 3000 is correctly mapped

### Database Connection Issues:
- Test DATABASE_URL format: `postgresql://user:pass@host:port/db`
- Ensure database is accessible from your VPS
- Check database logs for connection attempts

## Expected Build Output
When deployment works correctly, you should see:
```
✅ Docker build completed
✅ Container started successfully
✅ Health check passing at /api/health
✅ Application accessible at your domain
```