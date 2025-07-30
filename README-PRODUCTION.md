# CoinFeedly Production Deployment Guide

This guide covers deploying CoinFeedly to production using Railpacks/Dokploy on VPS.

## 🚀 Quick Deployment with Dokploy

### Prerequisites
- VPS with Docker installed
- Dokploy installed on your VPS
- Domain name pointed to your VPS
- GitHub repository with your code

### 1. Dokploy Configuration

Upload the `dokploy.json` file to configure your deployment:

```json
{
  "name": "coinfeedly",
  "type": "application",
  "dockerFile": "Dockerfile",
  "buildType": "dockerfile",
  "sourceType": "github",
  "domains": [
    {
      "host": "your-domain.com",
      "port": 3000,
      "https": true
    }
  ],
  "healthCheck": {
    "enabled": true,
    "path": "/api/health",
    "interval": 30
  }
}
```

### 2. Environment Variables

Set these in Dokploy dashboard:

**Required:**
- `NODE_ENV=production`
- `PORT=3000`
- `DATABASE_URL=postgresql://user:password@host:5432/dbname`
- `SESSION_SECRET=your-super-secure-random-string`

**Payment Processing:**
- `STRIPE_SECRET_KEY=sk_live_...` (for subscriptions)
- `STRIPE_WEBHOOK_SECRET=whsec_...` (for webhook handling)

**Email Service:**
- `SENDGRID_API_KEY=SG....` (for email notifications)
- `FROM_EMAIL=noreply@yourdomain.com`

### 3. Database Setup

**Option A: Managed PostgreSQL**
1. Create PostgreSQL instance on your cloud provider
2. Set `DATABASE_URL` to connection string
3. Tables will auto-migrate on first deployment

**Option B: Docker Compose with Database**
```bash
# Use the included docker-compose.yml
docker-compose up -d
```

## 🐳 Manual Docker Deployment

### Build and Run

```bash
# Build the image
docker build -t coinfeedly .

# Run with environment variables
docker run -d \
  --name coinfeedly \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=your_db_url \
  -e SESSION_SECRET=your_session_secret \
  -e STRIPE_SECRET_KEY=your_stripe_key \
  -e SENDGRID_API_KEY=your_sendgrid_key \
  -v coinfeedly-uploads:/app/uploads \
  coinfeedly
```

### With Docker Compose

```bash
# Copy environment template
cp .env.production.example .env

# Edit .env with your values
nano .env

# Deploy
docker-compose up -d
```

## 📦 Features Included

### ✅ Production Ready
- **Multi-stage Docker build** - Optimized production images
- **Health checks** - `/api/health` endpoint for monitoring
- **Automatic migrations** - Database tables auto-created
- **Security** - Non-root user, proper signal handling
- **Monitoring** - Built-in health checks and error logging

### ✅ Scaling Ready
- **Stateless design** - Can run multiple instances
- **PostgreSQL** - Production database
- **Session storage** - Database-backed sessions
- **File uploads** - Volume-mounted storage

### ✅ Business Features
- **Stripe payments** - Pro ($29/mo) and Elite ($49/mo) plans
- **Email system** - Account verification and notifications
- **User management** - Registration, login, password reset
- **Trading journal** - Complete trade tracking and analytics

## 🔧 Configuration Details

### Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NODE_ENV` | Yes | Runtime environment | `production` |
| `PORT` | No | Server port | `3000` |
| `DATABASE_URL` | Yes | PostgreSQL connection | `postgresql://user:pass@host:5432/db` |
| `SESSION_SECRET` | Yes | Session encryption key | Random 64-char string |
| `STRIPE_SECRET_KEY` | Optional | Stripe payments | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Optional | Stripe webhooks | `whsec_...` |
| `SENDGRID_API_KEY` | Optional | Email service | `SG.xxx` |
| `FROM_EMAIL` | Optional | Sender email | `noreply@yourdomain.com` |

### Health Check

The app includes a health check endpoint at `/api/health`:

```bash
curl https://yourdomain.com/api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-30T21:15:00.000Z",
  "uptime": 3600.5
}
```

### Database Migrations

Tables are automatically created/updated on startup:
- Users table (authentication, billing info)
- Trades table (trading data)
- Sessions table (user sessions)

No manual migration needed - handled by Drizzle ORM.

## 🔒 Security

### Production Security Features
- Non-root Docker user
- Environment-based secrets
- Secure session handling
- Input validation with Zod
- SQL injection protection with Drizzle ORM

### SSL/HTTPS
Configure SSL through your reverse proxy (Nginx, Traefik) or use Dokploy's built-in SSL.

## 📊 Monitoring

### Logs
```bash
# Docker logs
docker logs coinfeedly -f

# Docker Compose logs
docker-compose logs -f app
```

### Health Monitoring
Set up monitoring to check `/api/health` endpoint:
- Status: 200 = healthy, 503 = unhealthy
- Includes database connectivity test
- Response time and uptime metrics

## 🚨 Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check DATABASE_URL format
echo $DATABASE_URL
# Should be: postgresql://user:password@host:port/database
```

**Health Check Failing**
```bash
# Test database connectivity
docker exec coinfeedly node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT 1').then(() => console.log('DB OK')).catch(console.error);
"
```

**Email Not Sending**
- Verify `SENDGRID_API_KEY` is correct
- Check SendGrid dashboard for sending limits
- Ensure `FROM_EMAIL` domain is verified in SendGrid

### Support

- Documentation: [docs.coinfeedly.com](https://docs.coinfeedly.com)
- Issues: GitHub repository issues
- Email: support@coinfeedly.com

## 🎯 Post-Deployment

1. **Test the app** - Visit your domain and create an account
2. **Configure Stripe** - Add webhook endpoint for subscriptions
3. **DNS setup** - Ensure domain points to your VPS
4. **SSL certificate** - Configure HTTPS
5. **Monitoring** - Set up uptime monitoring on `/api/health`

Your CoinFeedly trading journal is now live and ready for users! 🎉