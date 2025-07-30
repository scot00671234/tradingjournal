#!/usr/bin/env python3
"""
Daily price data fetcher for CoinFeedly backtesting system.
Fetches OHLCV data once per day for all supported assets and caches in PostgreSQL.
"""

import yfinance as yf
import psycopg2
import psycopg2.extras
import os
import logging
import pandas as pd
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import json

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Supported assets for backtesting
SUPPORTED_ASSETS = [
    # Major stocks
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX',
    # ETFs
    'SPY', 'QQQ', 'IWM', 'VTI', 'VOO', 'VEA', 'VWO', 'TLT', 'GLD',
    # Crypto (Yahoo Finance format)
    'BTC-USD', 'ETH-USD', 'ADA-USD', 'SOL-USD', 'DOT-USD', 'MATIC-USD', 'AVAX-USD', 'LINK-USD'
]

class PriceDataFetcher:
    def __init__(self):
        self.db_url = os.getenv('DATABASE_URL')
        if not self.db_url:
            raise ValueError("DATABASE_URL environment variable not set")
        
    def get_db_connection(self):
        """Get PostgreSQL database connection."""
        return psycopg2.connect(self.db_url)
    
    def setup_price_data_table(self):
        """Create price_data table if it doesn't exist."""
        with self.get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS price_data (
                        id SERIAL PRIMARY KEY,
                        symbol VARCHAR(20) NOT NULL,
                        date DATE NOT NULL,
                        open_price DECIMAL(15,4) NOT NULL,
                        high_price DECIMAL(15,4) NOT NULL,
                        low_price DECIMAL(15,4) NOT NULL,
                        close_price DECIMAL(15,4) NOT NULL,
                        volume BIGINT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        UNIQUE(symbol, date)
                    );
                """)
                
                cur.execute("""
                    CREATE INDEX IF NOT EXISTS idx_price_data_symbol_date 
                    ON price_data(symbol, date);
                """)
                
                conn.commit()
                logger.info("Price data table setup completed")
    
    def fetch_symbol_data(self, symbol: str, days_back: int = 365) -> Optional[Dict]:
        """Fetch OHLCV data for a single symbol."""
        try:
            # Calculate date range
            end_date = datetime.now()
            start_date = end_date - timedelta(days=days_back)
            
            logger.info(f"Fetching {symbol} from {start_date.date()} to {end_date.date()}")
            
            # Fetch data using yfinance
            ticker = yf.Ticker(symbol)
            hist = ticker.history(start=start_date, end=end_date)
            
            if hist.empty:
                logger.warning(f"No data returned for {symbol}")
                return None
                
            # Convert to list of dictionaries
            data_points = []
            for date, row in hist.iterrows():
                data_points.append({
                    'symbol': symbol,
                    'date': date.date(),
                    'open': float(row['Open']),
                    'high': float(row['High']),
                    'low': float(row['Low']),
                    'close': float(row['Close']),
                    'volume': int(row['Volume']) if not pd.isna(row['Volume']) else 0
                })
            
            logger.info(f"Fetched {len(data_points)} data points for {symbol}")
            return {
                'symbol': symbol,
                'data_points': data_points,
                'count': len(data_points)
            }
            
        except Exception as e:
            logger.error(f"Error fetching data for {symbol}: {str(e)}")
            return None
    
    def save_price_data(self, symbol_data: Dict):
        """Save price data to PostgreSQL with conflict resolution."""
        with self.get_db_connection() as conn:
            with conn.cursor() as cur:
                data_points = symbol_data['data_points']
                
                # Use ON CONFLICT to handle duplicates
                insert_query = """
                    INSERT INTO price_data (symbol, date, open_price, high_price, low_price, close_price, volume)
                    VALUES (%(symbol)s, %(date)s, %(open)s, %(high)s, %(low)s, %(close)s, %(volume)s)
                    ON CONFLICT (symbol, date) 
                    DO UPDATE SET 
                        open_price = EXCLUDED.open_price,
                        high_price = EXCLUDED.high_price,
                        low_price = EXCLUDED.low_price,
                        close_price = EXCLUDED.close_price,
                        volume = EXCLUDED.volume,
                        created_at = CURRENT_TIMESTAMP
                """
                
                psycopg2.extras.execute_batch(cur, insert_query, data_points, page_size=100)
                conn.commit()
                
                logger.info(f"Saved {len(data_points)} records for {symbol_data['symbol']}")
    
    def fetch_and_cache_all_prices(self, days_back: int = 365):
        """Fetch and cache prices for all supported assets."""
        logger.info("Starting daily price data fetch")
        
        # Setup database table
        self.setup_price_data_table()
        
        success_count = 0
        error_count = 0
        
        for symbol in SUPPORTED_ASSETS:
            try:
                symbol_data = self.fetch_symbol_data(symbol, days_back)
                if symbol_data:
                    self.save_price_data(symbol_data)
                    success_count += 1
                else:
                    error_count += 1
                    
            except Exception as e:
                logger.error(f"Failed to process {symbol}: {str(e)}")
                error_count += 1
                continue
        
        logger.info(f"Price data fetch completed: {success_count} successful, {error_count} errors")
        return {
            'success_count': success_count,
            'error_count': error_count,
            'total_symbols': len(SUPPORTED_ASSETS)
        }
    
    def get_cached_prices(self, symbol: str, start_date: str, end_date: str) -> List[Dict]:
        """Get cached price data for backtesting."""
        with self.get_db_connection() as conn:
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                cur.execute("""
                    SELECT symbol, date, open_price, high_price, low_price, close_price, volume
                    FROM price_data 
                    WHERE symbol = %s AND date >= %s AND date <= %s
                    ORDER BY date ASC
                """, (symbol, start_date, end_date))
                
                results = cur.fetchall()
                
                # Convert to list of dictionaries
                return [dict(row) for row in results]

def main():
    """Main function for running the price data fetcher."""
    import pandas as pd  # Import here to avoid issues if not installed
    
    fetcher = PriceDataFetcher()
    
    # Fetch data for the last year by default
    result = fetcher.fetch_and_cache_all_prices(days_back=365)
    
    print(f"Price data fetch completed:")
    print(f"  Success: {result['success_count']}/{result['total_symbols']} assets")
    print(f"  Errors: {result['error_count']} assets")
    
    if result['error_count'] > 0:
        print("Check logs for error details")

if __name__ == "__main__":
    main()