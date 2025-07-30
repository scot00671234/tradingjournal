import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Cloudron PostgreSQL addon provides these environment variables
const DATABASE_URL = process.env.DATABASE_URL || 
                    process.env.CLOUDRON_POSTGRESQL_URL || 
                    process.env.POSTGRESQL_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

const pool = new Pool({ 
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export const db = drizzle(pool, { schema });
export { pool };