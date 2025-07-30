#!/usr/bin/env python3
"""
Daily cron job script for fetching price data.
Run this script daily at 2:00 AM to keep price data updated.

Usage: python3 server/cron_daily_prices.py
"""

import sys
import os
import logging
from datetime import datetime

# Add the server directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import our price data fetcher
try:
    # Use proper module import
    from price_data import PriceDataFetcher
    logging.info("Successfully imported PriceDataFetcher")
except ImportError as e:
    logging.error(f"Failed to import PriceDataFetcher: {e}")
    # Try alternative import method
    try:
        import importlib.util
        spec = importlib.util.spec_from_file_location("price_data", os.path.join(os.path.dirname(__file__), "price-data.py"))
        price_data_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(price_data_module)
        PriceDataFetcher = price_data_module.PriceDataFetcher
        logging.info("Successfully imported PriceDataFetcher via alternative method")
    except Exception as e2:
        logging.error(f"Failed to import PriceDataFetcher via alternative method: {e2}")
        sys.exit(1)

def main():
    """Main cron job function."""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - CRON - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler('/tmp/coinfeedly_price_fetch.log'),
            logging.StreamHandler()
        ]
    )
    
    logger = logging.getLogger(__name__)
    logger.info("=== Starting daily price data fetch ===")
    
    try:
        fetcher = PriceDataFetcher()
        result = fetcher.fetch_and_cache_all_prices(days_back=30)  # Fetch last 30 days
        
        logger.info(f"Price fetch completed successfully:")
        logger.info(f"  - Success: {result['success_count']}/{result['total_symbols']} assets")
        logger.info(f"  - Errors: {result['error_count']} assets")
        
        if result['error_count'] > 0:
            logger.warning(f"Some assets failed to fetch. Check logs for details.")
            
    except Exception as e:
        logger.error(f"Critical error in daily price fetch: {str(e)}")
        sys.exit(1)
        
    logger.info("=== Daily price data fetch completed ===")

if __name__ == "__main__":
    main()