#!/bin/bash
# Install Python dependencies for price data fetching

echo "Installing Python dependencies for CoinFeedly backtesting..."

# Install yfinance and psycopg2 using pip
python3 -m pip install --user yfinance psycopg2-binary pandas

echo "Python dependencies installed successfully"
echo "Available Python packages:"
python3 -c "import yfinance; import psycopg2; import pandas; print('✓ yfinance, psycopg2, pandas installed')"