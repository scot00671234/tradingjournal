#!/bin/sh

set -e

echo "Starting CoinFeedly in production mode..."

# Wait for database to be ready
echo "Waiting for database connection..."
until node -e "
const { Pool } = require('pg');
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

# Start the application
echo "Starting application on port 3000..."
exec node dist/index.js