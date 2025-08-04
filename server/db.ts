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

// Determine SSL configuration based on deployment platform
const getSSLConfig = () => {
  // Disable SSL for local Docker environments (like Dokploy)
  if (DATABASE_URL.includes('localhost') || 
      DATABASE_URL.includes('127.0.0.1') || 
      DATABASE_URL.includes('coin-feedly-database') ||
      process.env.DISABLE_SSL === 'true') {
    return false;
  }
  
  // Enable SSL for cloud providers (Neon, Supabase, Railway, etc.)
  if (process.env.NODE_ENV === 'production' && 
      (DATABASE_URL.includes('neon.tech') || 
       DATABASE_URL.includes('supabase.co') || 
       DATABASE_URL.includes('railway.app') ||
       DATABASE_URL.includes('?sslmode=require'))) {
    return { rejectUnauthorized: false };
  }
  
  return false;
};

console.log('Database connection info:', {
  url: DATABASE_URL.replace(/:[^:@]*@/, ':****@'), // Hide password
  isProduction: process.env.NODE_ENV === 'production',
  sslEnabled: getSSLConfig() !== false,
  platform: DATABASE_URL.includes('neon.tech') ? 'Neon' : 
           DATABASE_URL.includes('supabase.co') ? 'Supabase' :
           DATABASE_URL.includes('railway.app') ? 'Railway' :
           DATABASE_URL.includes('coin-feedly-database') ? 'Dokploy' : 'Other'
});

const pool = new Pool({ 
  connectionString: DATABASE_URL,
  ssl: getSSLConfig(),
  // Add connection timeout and retry settings for production
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 10,
  ...(process.env.NODE_ENV === 'production' && {
    retryDelayMillis: 2000,
    acquireTimeoutMillis: 60000
  })
});

export const db = drizzle(pool, { schema });
export { pool };