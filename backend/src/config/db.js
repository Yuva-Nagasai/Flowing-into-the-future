const mysql = require('mysql2/promise');
require('dotenv').config();

// Support both individual MySQL vars and a single DATABASE_URL (mysql://...)
const {
  MYSQLHOST,
  MYSQLPORT,
  MYSQLUSER,
  MYSQLPASSWORD,
  MYSQLDATABASE,
  DATABASE_URL
} = process.env;

let pool = null;

// Helper to build config from mysql:// URL
const buildConfigFromUrl = (urlString) => {
  try {
    const url = new URL(urlString);
    return {
      host: url.hostname,
      port: parseInt(url.port, 10) || 3306,
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.slice(1)
    };
  } catch (err) {
    console.error('❌ Error parsing DATABASE_URL:', err.message);
    return null;
  }
};

// Initialize MySQL pool
(() => {
  let config = null;

  if (DATABASE_URL && DATABASE_URL.startsWith('mysql://')) {
    config = buildConfigFromUrl(DATABASE_URL);
  } else if (MYSQLHOST || MYSQLUSER || MYSQLDATABASE) {
    config = {
      host: MYSQLHOST || 'localhost',
      port: parseInt(MYSQLPORT, 10) || 3306,
      user: MYSQLUSER || 'root',
      password: MYSQLPASSWORD || '',
      database: MYSQLDATABASE || 'test'
    };
  }

  if (!config) {
    console.warn('⚠️  MySQL configuration not found. Set either DATABASE_URL (mysql://...) or MYSQLHOST/MYSQLUSER/MYSQLDATABASE in backend/.env');
    return;
  }

  pool = mysql.createPool({
    ...config,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  console.log(`✅ MySQL pool initialized for ${config.user}@${config.host}:${config.port}/${config.database}`);
})();

const ensurePool = () => {
  if (!pool) {
    throw new Error('Database connection not available - check your MySQL env vars in backend/.env');
  }
};

const query = async (queryText, params = []) => {
  ensurePool();
  const [rows] = await pool.execute(queryText, params);
  // Keep the same shape used by controllers: { rows }
  return { rows };
};

const isTransientError = (error) => {
  const transientCodes = [
    'ETIMEDOUT',
    'ENOTFOUND',
    'ECONNREFUSED',
    'ECONNRESET',
    'PROTOCOL_CONNECTION_LOST',
    'ER_LOCK_DEADLOCK'
  ];
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

// Used by migration scripts (run-mysql-migration.js) – returns a raw connection
const getConnection = async () => {
  ensurePool();
  return pool.getConnection();
};

const isDatabaseAvailable = () => !!pool;

module.exports = {
  query,
  queryWithRetry,
  getConnection,
  pool,
  isDatabaseAvailable
};
