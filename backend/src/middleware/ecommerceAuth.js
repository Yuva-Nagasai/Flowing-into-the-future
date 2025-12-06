const jwt = require('jsonwebtoken');
const { query } = require('../config/db');
const { JWT_SECRET } = require('./auth');

const ecommerceAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET || process.env.ECOMMERCE_JWT_SECRET || 'ecommerce-secret-key');

    // Check if user exists in ecommerce_users table, or fallback to users table
    let userResult;
    try {
      userResult = await query(
        'SELECT id, email, name, role, phone, avatar, created_at FROM ecommerce_users WHERE id = ?',
        [decoded.userId || decoded.id]
      );
    } catch (err) {
      // If ecommerce_users table doesn't exist, try users table
      userResult = await query(
        'SELECT id, email, name, role, phone, avatar, created_at FROM users WHERE id = ?',
        [decoded.userId || decoded.id]
      );
    }

    if (!userResult.rows || userResult.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    req.user = {
      id: userResult.rows[0].id,
      email: userResult.rows[0].email,
      name: userResult.rows[0].name,
      role: userResult.rows[0].role || 'user'
    };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

const ecommerceAdminMiddleware = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin access required' });
  }
  next();
};

const generateEcommerceToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.ECOMMERCE_JWT_SECRET || JWT_SECRET || 'ecommerce-secret-key',
    { expiresIn: '7d' }
  );
};

module.exports = {
  ecommerceAuthMiddleware,
  ecommerceAdminMiddleware,
  generateEcommerceToken
};

