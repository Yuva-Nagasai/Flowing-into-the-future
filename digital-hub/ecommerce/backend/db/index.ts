import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle, NeonDatabase } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from './schema.js';

neonConfig.webSocketConstructor = ws;

export const isDatabaseAvailable = !!process.env.DATABASE_URL;

let db: NeonDatabase<typeof schema> | null = null;
let pool: Pool | null = null;

if (isDatabaseAvailable) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle(pool, { schema });
} else {
  console.warn('DATABASE_URL is not set. Using sample data fallback.');
}

export { db, pool, schema };
export type DbType = typeof db;
