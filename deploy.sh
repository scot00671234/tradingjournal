#!/bin/bash

set -e

echo "🚀 Deploying CoinFeedly to production..."

# Check if required environment variables are set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL environment variable is required"
    exit 1
fi

if [ -z "$SESSION_SECRET" ]; then
    echo "❌ SESSION_SECRET environment variable is required"
    exit 1
fi

# Build the application
echo "📦 Building application..."
npm run build

# Build Docker image
echo "🐳 Building Docker image..."
docker build -t coinfeedly:latest .

# Stop existing container if running
echo "🛑 Stopping existing container..."
docker stop coinfeedly 2>/dev/null || true
docker rm coinfeedly 2>/dev/null || true

# Run new container
echo "▶️  Starting new container..."
docker run -d \
  --name coinfeedly \
  --restart unless-stopped \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e DATABASE_URL="$DATABASE_URL" \
  -e SESSION_SECRET="$SESSION_SECRET" \
  -e STRIPE_SECRET_KEY="${STRIPE_SECRET_KEY:-}" \
  -e STRIPE_WEBHOOK_SECRET="${STRIPE_WEBHOOK_SECRET:-}" \
  -e SENDGRID_API_KEY="${SENDGRID_API_KEY:-}" \
  -e FROM_EMAIL="${FROM_EMAIL:-noreply@coinfeedly.com}" \
  -v coinfeedly-uploads:/app/uploads \
  coinfeedly:latest

# Wait for container to start
echo "⏳ Waiting for application to start..."
sleep 10

# Health check
echo "🏥 Performing health check..."
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ CoinFeedly deployed successfully!"
    echo "🌐 Application is running on http://localhost:3000"
    echo "📊 Health check: http://localhost:3000/api/health"
else
    echo "❌ Health check failed - checking logs..."
    docker logs coinfeedly --tail 20
    exit 1
fi

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Configure your reverse proxy (Nginx/Apache) to point to port 3000"
echo "2. Set up SSL certificate for HTTPS"
echo "3. Configure Stripe webhook endpoint: https://yourdomain.com/api/stripe/webhook"
echo "4. Test user registration and payment flows"
echo ""
echo "Logs: docker logs coinfeedly -f"
echo "Stop: docker stop coinfeedly"
echo "Start: docker start coinfeedly"