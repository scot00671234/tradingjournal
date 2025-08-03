#!/bin/sh

set -e

echo "Starting CoinFeedly in production mode..."
echo "Node.js version: $(node --version)"
echo "Environment: $NODE_ENV"

# Set default port if not provided
export PORT=${PORT:-3000}
echo "Port: $PORT"

# Wait for database to be ready (only if DATABASE_URL is provided)
if [ -n "$DATABASE_URL" ]; then
  echo "Database URL provided, checking connection..."
  echo "DATABASE_URL format: ${DATABASE_URL%%:*}://****"
  
  # Test database connection with retry
  RETRY_COUNT=0
  MAX_RETRIES=30
  
  until node -e "
  const { Pool } = require('pg');
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
  pool.query('SELECT 1').then(() => {
    console.log('Database connected successfully');
    pool.end();
    process.exit(0);
  }).catch((err) => {
    console.log('Database connection failed:', err.message);
    process.exit(1);
  });
  " 2>/dev/null; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -gt $MAX_RETRIES ]; then
      echo "Database connection failed after $MAX_RETRIES attempts. Exiting."
      exit 1
    fi
    echo "Database unavailable (attempt $RETRY_COUNT/$MAX_RETRIES) - sleeping 2s"
    sleep 2
  done

  # Run database migrations
  echo "Running database migrations..."
  if npx drizzle-kit push --config=drizzle.config.ts; then
    echo "Database migrations completed successfully"
  else
    echo "Database migrations failed, but continuing..."
  fi
else
  echo "No DATABASE_URL provided, skipping database setup"
fi

# Start the application
echo "Starting application on port $PORT..."
echo "Checking if dist/index.js exists..."
if [ -f "dist/index.js" ]; then
  echo "dist/index.js found, starting application..."
  exec node dist/index.js
else
  echo "ERROR: dist/index.js not found!"
  ls -la dist/ || echo "dist directory not found"
  exit 1
fi