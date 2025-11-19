const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  console.error('FATAL: DATABASE_URL environment variable is required');
  console.error('Please create a .env file in the server directory with DATABASE_URL');
  process.exit(1);
}

// Check if it's a Neon database (requires SSL)
const isNeon = process.env.DATABASE_URL.includes('neon.tech') || 
               process.env.DATABASE_URL.includes('aws.neon.tech');

// Configure SSL based on database type
const sslConfig = isNeon 
  ? { rejectUnauthorized: false } 
  : (process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
  max: 10, // Reduced pool size for better stability
  idleTimeoutMillis: 60000, // Close idle clients after 60 seconds
  connectionTimeoutMillis: 30000, // Increased to 30 seconds for Neon
  statement_timeout: 30000, // Query timeout
  query_timeout: 30000, // Query timeout
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err.message);
  // Don't exit on pool errors, let the app continue
});

pool.on('connect', () => {
  console.log('📊 New database client connected to pool');
});

pool.on('remove', () => {
  console.log('📊 Database client removed from pool');
});

// Test connection on startup with retry
const testConnection = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      console.log('✅ Database connection successful');
      client.release();
      return;
    } catch (err) {
      console.error(`❌ Database connection attempt ${i + 1}/${retries} failed:`, err.message);
      if (i < retries - 1) {
        console.log(`⏳ Retrying in 2 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        console.error('❌ All database connection attempts failed');
        console.error('Please check your DATABASE_URL in the .env file');
      }
    }
  }
};

testConnection();

// Helper function to execute queries with retry logic
const queryWithRetry = async (queryText, params, retries = 2) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await pool.query(queryText, params);
    } catch (error) {
      const isConnectionError = error.code === 'ETIMEDOUT' || 
                                error.code === 'ENOTFOUND' || 
                                error.code === 'ENETUNREACH' ||
                                error.code === 'ECONNREFUSED';
      
      if (isConnectionError && i < retries - 1) {
        console.warn(`⚠️ Query failed (attempt ${i + 1}/${retries}), retrying...`, error.message);
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
        continue;
      }
      throw error;
    }
  }
};

module.exports = pool;
module.exports.queryWithRetry = queryWithRetry;
