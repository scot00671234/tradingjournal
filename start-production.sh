#!/bin/sh

set -e

echo "Starting CoinFeedly in production mode..."

# Set default port if not provided
export PORT=${PORT:-3000}

# Wait for database to be ready (only if DATABASE_URL is provided)
if [ -n "$DATABASE_URL" ]; then
  echo "Waiting for database connection..."
  until node -e "
  import { Pool } from 'pg';
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  pool.query('SELECT 1').then(() => {
    console.log('Database connected');
    process.exit(0);
  }).catch((err) => {
    console.log('Database not ready:', err.message);
    process.exit(1);
  });
  " 2>/dev/null; do
    echo "Database is unavailable - sleeping"
    sleep 2
  done

  # Run database migrations
  echo "Running database migrations..."
  npm run db:push
else
  echo "No DATABASE_URL provided, skipping database setup"
fi

# Start the application
echo "Starting application on port $PORT..."
exec node dist/index.js