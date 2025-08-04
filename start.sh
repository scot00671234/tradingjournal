#!/bin/bash
set -e

echo "🚀 Starting CoinFeedly Production Server..."

# Ensure we're in the right directory
cd /app

# Show environment info
echo "Environment: $NODE_ENV"
echo "Port: $PORT"
echo "Database URL present: $([[ -n "$DATABASE_URL" ]] && echo "Yes" || echo "No")"

# Start Node.js application in background
echo "📱 Starting Node.js application..."
NODE_ENV=production PORT=3000 node dist/index.js &
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
for i in {1..10}; do
    if curl -s http://localhost:3000/api/health > /dev/null; then
        echo "✅ Node.js application is responding on port 3000"
        break
    fi
    if [ $i -eq 10 ]; then
        echo "❌ Node.js application is not responding after 10 attempts"
        kill $NODE_PID
        exit 1
    fi
    echo "⏳ Waiting for Node.js app to respond (attempt $i/10)..."
    sleep 2
done

# Start Caddy in foreground
echo "🌐 Starting Caddy reverse proxy..."
exec caddy run --config /assets/Caddyfile --adapter caddyfile

# If we get here, something went wrong
echo "❌ Startup script ended unexpectedly"
exit 1