const express = require('express');
const bcrypt = require('bcryptjs');
const { query } = require('../../config/db');
const { ecommerceAuthMiddleware, generateEcommerceToken } = require('../../middleware/ecommerceAuth');

const router = express.Router();

// Register - creates user in ecommerce_users table or users table
router.post('/register', async (req, res) => {
  try {
    const { email, name, password, phone } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ success: false, error: 'Email, name, and password are required' });
    }

    // Try ecommerce_users table first, fallback to users table
    let existingResult;
    try {
      existingResult = await query(
        'SELECT id FROM ecommerce_users WHERE email = ?',
        [email.toLowerCase()]
      );
    } catch (err) {
      existingResult = await query(
        'SELECT id FROM users WHERE email = ?',
        [email.toLowerCase()]
      );
    }

    if (existingResult.rows && existingResult.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Try to insert into ecommerce_users, fallback to users
    let insertResult;
    try {
      insertResult = await query(
        'INSERT INTO ecommerce_users (email, name, password, role, phone, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
        [email.toLowerCase(), name, hashedPassword, 'user', phone || null]
      );
      const userId = insertResult.insertId || insertResult.rows?.[0]?.id;
      
      const userResult = await query(
        'SELECT id, email, name, role FROM ecommerce_users WHERE id = ?',
        [userId]
      );
      const user = userResult.rows[0];
      const token = generateEcommerceToken(user.id);

      return res.status(201).json({
        success: true,
        data: { user, token }
      });
    } catch (insertErr) {
      // Fallback to users table
      const { v4: uuidv4 } = require('uuid');
      const userId = uuidv4();
      await query(
        'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
        [userId, name, email.toLowerCase(), hashedPassword, 'user']
      );

      const userResult = await query(
        'SELECT id, email, name, role FROM users WHERE id = ?',
        [userId]
      );
      const user = userResult.rows[0];
      const token = generateEcommerceToken(user.id);

      return res.status(201).json({
        success: true,
        data: { user, token }
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    // Try ecommerce_users table first, fallback to users table
    let userResult;
    try {
      userResult = await query(
        'SELECT * FROM ecommerce_users WHERE email = ?',
        [email.toLowerCase()]
      );
    } catch (err) {
      userResult = await query(
        'SELECT * FROM users WHERE email = ?',
        [email.toLowerCase()]
      );
    }

    if (!userResult.rows || userResult.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = generateEcommerceToken(user.id);

    return res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role || 'user'
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, error: 'Login failed' });
  }
});

// Get current user
router.get('/me', ecommerceAuthMiddleware, async (req, res) => {
  try {
    let userResult;
    try {
      userResult = await query(
        'SELECT id, email, name, role, phone, avatar, created_at FROM ecommerce_users WHERE id = ?',
        [req.user.id]
      );
    } catch (err) {
      userResult = await query(
        'SELECT id, email, name, role, phone, avatar, created_at FROM users WHERE id = ?',
        [req.user.id]
      );
    }

    if (!userResult.rows || userResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    return res.json({ success: true, data: userResult.rows[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ success: false, error: 'Failed to get profile' });
  }
});

// Update profile
router.put('/profile', ecommerceAuthMiddleware, async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;

    const updates = [];
    const values = [];

    if (name) {
      updates.push('name = ?');
      values.push(name);
    }
    if (phone !== undefined) {
      updates.push('phone = ?');
      values.push(phone);
    }
    if (avatar !== undefined) {
      updates.push('avatar = ?');
      values.push(avatar);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, error: 'No fields to update' });
    }

    updates.push('updated_at = NOW()');
    values.push(req.user.id);

    // Try ecommerce_users table first
    try {
      await query(
        `UPDATE ecommerce_users SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
      const userResult = await query(
        'SELECT id, email, name, role, phone, avatar FROM ecommerce_users WHERE id = ?',
        [req.user.id]
      );
      return res.json({ success: true, data: userResult.rows[0] });
    } catch (err) {
      // Fallback to users table
      await query(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
      const userResult = await query(
        'SELECT id, email, name, role, phone, avatar FROM users WHERE id = ?',
        [req.user.id]
      );
      return res.json({ success: true, data: userResult.rows[0] });
    }
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
});

module.exports = router;
