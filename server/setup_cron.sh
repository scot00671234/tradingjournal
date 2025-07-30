#!/bin/bash
# Setup daily cron job for price data fetching

echo "Setting up daily cron job for CoinFeedly price data..."

# Create the cron job entry
CRON_JOB="0 2 * * * cd $(pwd) && python3 server/cron_daily_prices.py >> /tmp/coinfeedly_cron.log 2>&1"

# Add to crontab
(crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

echo "✓ Cron job added successfully!"
echo "✓ Daily price fetch will run at 2:00 AM"
echo "✓ Logs will be saved to /tmp/coinfeedly_cron.log"

# Show current crontab
echo ""
echo "Current crontab:"
crontab -l

# Run initial price fetch
echo ""
echo "Running initial price data fetch..."
python3 server/cron_daily_prices.py