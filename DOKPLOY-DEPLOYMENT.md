# CoinFeedly - Dokploy VPS Deployment Guide

## Prerequisites

1. **VPS Server** with Dokploy installed
2. **Domain name** pointing to your VPS
3. **PostgreSQL database** (external or self-hosted)
4. **Required API keys**:
   - Stripe (live keys for production)
   - SendGrid API key
   - Session secret

## Quick Deployment Steps

### 1. Clone Repository to Dokploy

1. In Dokploy dashboard, create new application
2. Connect your Git repository (GitHub/GitLab)
3. Use the existing `dokploy.json` configuration

### 2. Environment Variables

Set these environment variables in Dokploy:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://username:password@hostname:5432/database_name
SESSION_SECRET=your-super-secure-session-secret-here
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
SENDGRID_API_KEY=SG.your_sendgrid_api_key
FROM_EMAIL=noreply@yourdomain.com
BASE_URL=https://yourdomain.com
```

### 3. Domain Configuration

Update `dokploy.json` domains section:
```json
"domains": [
  {
    "host": "your-domain.com",
    "port": 3000,
    "https": true
  }
]
```

### 4. Database Setup

**Option A: External Database (Recommended)**
- Use Neon, Railway, or Supabase PostgreSQL
- Update DATABASE_URL with connection string

**Option B: Self-hosted Database**
- Use the included `docker-compose.yml`
- Set PostgreSQL environment variables

### 5. SSL Certificate

Dokploy automatically handles SSL certificates via Let's Encrypt when you:
1. Set `"https": true` in domain configuration
2. Ensure your domain points to the VPS IP

## Production Features

✅ **Multi-stage Docker build** for optimized image size  
✅ **Health checks** for automatic restart on failure  
✅ **Non-root user** for security  
✅ **Database migration** on startup  
✅ **Volume mounting** for persistent uploads  
✅ **Memory and CPU limits** configured  
✅ **Production logging** and error handling  

## File Structure

```
coinfeedly/
├── Dockerfile              # Production-ready container
├── dokploy.json           # Dokploy configuration
├── docker-compose.yml     # Full stack deployment
├── start-production.sh    # Production startup script
├── .env.production.example # Environment template
└── nginx.conf             # Nginx configuration (optional)
```

## Monitoring

The application includes:
- Health check endpoint: `/api/health`
- Automatic database connection retry
- Graceful shutdown handling
- Error logging and monitoring

## Stripe Webhook Configuration

After deployment, configure Stripe webhooks:
1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select events: `customer.subscription.*`, `invoice.*`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

## Security Checklist

- [ ] Use strong SESSION_SECRET (32+ characters)
- [ ] Use live Stripe keys for production
- [ ] Configure proper CORS origins
- [ ] Enable HTTPS/SSL
- [ ] Use external PostgreSQL database
- [ ] Regularly backup database
- [ ] Monitor application logs

## Support

- Check logs in Dokploy dashboard
- Verify environment variables are set
- Ensure database connectivity
- Test Stripe webhook endpoints

## Cost Optimization

- **Memory**: 512Mi-1024Mi should be sufficient
- **CPU**: 250m-500m for most workloads
- **Storage**: Volume for uploads only
- **Database**: External PostgreSQL recommended