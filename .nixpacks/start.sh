#!/bin/bash
set -e

echo "🚀 Starting CoinFeedly Production Server..."

# Set environment variables
export NODE_ENV=production
export PORT=3000

# Ensure we're in the right directory
cd /app

echo "Environment: $NODE_ENV"
echo "Port: $PORT"
echo "Database URL present: $([[ -n "$DATABASE_URL" ]] && echo "Yes" || echo "No")"

# Start Node.js application in background
echo "📱 Starting Node.js application..."
node dist/index.js &
NODE_PID=$!

# Give Node.js app time to start
sleep 5

# Check if Node.js app is running
if ps -p $NODE_PID > /dev/null; then
    echo "✅ Node.js application started successfully (PID: $NODE_PID)"
else
    echo "❌ Node.js application failed to start"
    exit 1
fi

# Test if Node.js app is responding
echo "🔍 Testing Node.js application..."
for i in {1..15}; do
    if curl -s http://localhost:3000/ > /dev/null 2>&1; then
        echo "✅ Node.js application is responding on port 3000"
        break
    fi
    if [ $i -eq 15 ]; then
        echo "❌ Node.js application is not responding after 15 attempts"
        kill $NODE_PID || true
        exit 1
    fi
    echo "⏳ Waiting for Node.js app to respond (attempt $i/15)..."
    sleep 2
done

# Start Caddy in foreground
echo "🌐 Starting Caddy reverse proxy..."
exec caddy run --config /assets/Caddyfile --adapter caddyfile