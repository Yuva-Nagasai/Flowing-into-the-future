const mysql = require('mysql2/promise');

const {
  MYSQLHOST = 'localhost',
  MYSQLPORT = '3306',
  MYSQLUSER = 'root',
  MYSQLPASSWORD = '',
  MYSQLDATABASE = 'nanoflows',
  DATABASE_URL
} = process.env;

const buildConfigFromUrl = () => {
  if (!DATABASE_URL || !DATABASE_URL.startsWith('mysql://')) {
    return null;
  }

  try {
    const url = new URL(DATABASE_URL);
    return {
      host: url.hostname,
      port: url.port ? parseInt(url.port, 10) : 3306,
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.replace('/', '') || MYSQLDATABASE
    };
  } catch (error) {
    console.warn('⚠️  Could not parse DATABASE_URL, falling back to individual MySQL vars:', error.message);
    return null;
  }
};

const connectionConfig = buildConfigFromUrl() || {
  host: MYSQLHOST,
  port: parseInt(MYSQLPORT, 10),
  user: MYSQLUSER,
  password: MYSQLPASSWORD,
  database: MYSQLDATABASE
};

const pool = mysql.createPool({
  ...connectionConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: false // keep this false for security; run extra selects separately
});

const normalizeQuery = (queryText = '') => {
  return queryText
    .replace(/LIKE/gi, 'LIKE')
    .replace(/\$(\d+)/g, '?');
};

const query = async (queryText, params = []) => {
  const sql = normalizeQuery(queryText);
  const [rows] = await pool.execute(sql, params);
  return { rows };
};

const isTransientError = (error) => {
  const transientCodes = ['ETIMEDOUT', 'ENOTFOUND', 'ECONNREFUSED', 'ER_LOCK_DEADLOCK', 'PROTOCOL_SEQUENCE_TIMEOUT'];
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

const getConnection = () => pool.getConnection();

module.exports = {
  query,
  queryWithRetry,
  getConnection,
  pool
};
