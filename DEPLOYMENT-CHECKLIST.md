# CoinFeedly Deployment Checklist

## ✅ Environment Variables Required in Dokploy

Set these in your Dokploy app's Environment Variables section:

```
NODE_ENV=production
PORT=3000
SESSION_SECRET=your-actual-session-secret-here
DATABASE_URL=your-postgresql-connection-string
```

## ✅ Files Configuration

The following files are properly configured for nixpacks deployment:

- ✅ `package.json` - start script points to `node dist/index.js`
- ✅ `nixpacks.toml` - nixpacks configuration for Node.js 20
- ✅ `Procfile` - web process defined as `npm start`
- ✅ `start.sh` - production startup script (PORT=3000)

## ✅ Application Startup Sequence

1. **Build Phase**: `npm ci && npm run build`
2. **Start Phase**: `npm start` → `node dist/index.js`
3. **Server**: Listens on `0.0.0.0:3000`
4. **Health Check**: Available at `/api/health`

## 🔧 Troubleshooting

### If Caddy shows 404 errors:

1. **Check Node.js Logs**: Look for startup errors in Dokploy logs
2. **Verify Environment Variables**: Ensure SESSION_SECRET and DATABASE_URL are set
3. **Check Port Configuration**: Application should start on port 3000
4. **Test Health Endpoint**: `curl http://localhost:3000/api/health`

### Common Issues:

- **Missing SESSION_SECRET**: App will crash on startup
- **Wrong PORT**: Caddy expects service on port 3000
- **Database Connection**: Verify DATABASE_URL is accessible from container
- **Build Failures**: Check that `npm run build` completes successfully

## 📋 Deployment Status

- ✅ Application builds successfully
- ✅ Production server starts on port 3000
- ✅ Database connection works
- ✅ Health check endpoint available
- ❓ Environment variables properly set in Dokploy (verify this)
- ❓ Caddy reverse proxy configuration (check Dokploy settings)