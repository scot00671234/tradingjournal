import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from "@shared/schema";

// Use SQLite for development, PostgreSQL for production
const isDevelopment = process.env.NODE_ENV !== 'production';

let db: any;

if (isDevelopment) {
  const sqlite = new Database('dev.db');
  
  // Create tables if they don't exist
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      is_pro_user INTEGER DEFAULT 0,
      stripe_customer_id TEXT,
      stripe_subscription_id TEXT,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS trades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      asset TEXT NOT NULL,
      direction TEXT NOT NULL,
      entry_price REAL NOT NULL,
      exit_price REAL,
      size INTEGER NOT NULL,
      pnl REAL,
      notes TEXT,
      tags TEXT,
      image_url TEXT,
      trade_date INTEGER NOT NULL,
      is_completed INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL
    );
  `);
  
  db = drizzle(sqlite, { schema });
} else {
  // For production, fall back to PostgreSQL if available
  const { Pool } = require('pg');
  const { drizzle: pgDrizzle } = require('drizzle-orm/node-postgres');
  
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL must be set in production');
  }
  
  const pool = new Pool({ 
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  db = pgDrizzle({ client: pool, schema });
}

export { db };
export const pool = null; // Not used in SQLite mode