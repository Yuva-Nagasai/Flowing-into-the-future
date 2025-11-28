const { Pool } = require('pg');

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  console.warn('⚠️  DATABASE_URL is not set. Database features will use fallback data.');
}

const pool = DATABASE_URL ? new Pool({
  connectionString: DATABASE_URL,
  ssl: DATABASE_URL.includes('neon') ? { rejectUnauthorized: false } : false,
}) : null;

const query = async (queryText, params = []) => {
  if (!pool) {
    throw new Error('Database connection not available');
  }
  const result = await pool.query(queryText, params);
  return { rows: result.rows };
};

const isTransientError = (error) => {
  const transientCodes = ['ETIMEDOUT', 'ENOTFOUND', 'ECONNREFUSED', 'ECONNRESET', '40001'];
  return transientCodes.includes(error?.code);
};

const queryWithRetry = async (queryText, params = [], retries = 2) => {
  let attempt = 0;
  while (attempt <= retries) {
    try {
      return await query(queryText, params);
    } catch (error) {
      if (attempt === retries || !isTransientError(error)) {
        throw error;
      }
      const waitMs = 1000 * (attempt + 1);
      console.warn(`⚠️  Query failed (attempt ${attempt + 1}/${retries + 1}), retrying in ${waitMs}ms...`, error.message);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
      attempt += 1;
    }
  }
};

const getConnection = async () => {
  if (!pool) {
    throw new Error('Database connection not available');
  }
  return pool.connect();
};

const isDatabaseAvailable = () => !!pool;

module.exports = {
  query,
  queryWithRetry,
  getConnection,
  pool,
  isDatabaseAvailable
};
