import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "../shared/schema.js";

// Support multiple database URL formats for different deployment platforms
const DATABASE_URL = process.env.DATABASE_URL || 
                    process.env.CLOUDRON_POSTGRESQL_URL || 
                    process.env.POSTGRESQL_URL ||
                    process.env.POSTGRES_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required');
  console.error('Available environment variables:', Object.keys(process.env).filter(k => !k.includes('PASSWORD')));
  console.error('NODE_ENV:', process.env.NODE_ENV);
  throw new Error('DATABASE_URL environment variable is required');
}

const pool = new Pool({ 
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export const db = drizzle(pool, { schema });
export { pool };