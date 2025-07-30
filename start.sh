#!/bin/bash

set -eu

echo "Starting CoinFeedly..."

# Set environment variables for Cloudron
export NODE_ENV=production
export PORT=5000

# Use Cloudron PostgreSQL if available
if [ -n "${CLOUDRON_POSTGRESQL_URL:-}" ]; then
    export DATABASE_URL="$CLOUDRON_POSTGRESQL_URL"
fi

# Push database schema changes
echo "Setting up database..."
npm run db:push

# Start the application
echo "Starting application on port $PORT..."
exec npm start