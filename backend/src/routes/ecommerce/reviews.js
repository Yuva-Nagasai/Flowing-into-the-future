const express = require('express');
const { query } = require('../../config/db');
const { ecommerceAuthMiddleware } = require('../../middleware/ecommerceAuth');

const router = express.Router();

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const reviewsResult = await query(
      `SELECT r.*, u.name as userName
       FROM reviews r
       LEFT JOIN ecommerce_users u ON r.user_id = u.id
       WHERE r.product_id = ?
       ORDER BY r.created_at DESC`,
      [productId]
    );

    return res.json({
      success: true,
      data: reviewsResult.rows || []
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch reviews' });
  }
});

// Create review
router.post('/', ecommerceAuthMiddleware, async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({ success: false, error: 'Product ID, rating, and comment are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, error: 'Rating must be between 1 and 5' });
    }

    // Check if product exists
    const productResult = await query('SELECT id FROM products WHERE id = ?', [productId]);
    if (!productResult.rows || productResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Check if user already reviewed
    const existingResult = await query(
      'SELECT * FROM reviews WHERE user_id = ? AND product_id = ?',
      [req.user.id, productId]
    );

    if (existingResult.rows && existingResult.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'You have already reviewed this product' });
    }

    // Check if user has purchased (for verified review)
    const purchaseResult = await query(
      `SELECT oi.* FROM order_items oi
       INNER JOIN orders o ON oi.order_id = o.id
       WHERE o.user_id = ? AND oi.product_id = ? AND o.status = 'delivered'
       LIMIT 1`,
      [req.user.id, productId]
    );

    const verified = purchaseResult.rows && purchaseResult.rows.length > 0;

    const reviewResult = await query(
      `INSERT INTO reviews (user_id, product_id, rating, title, comment, verified, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [req.user.id, productId, rating, title || null, comment, verified ? 1 : 0]
    );

    const reviewId = reviewResult.insertId;
    const newReviewResult = await query('SELECT * FROM reviews WHERE id = ?', [reviewId]);

    return res.status(201).json({
      success: true,
      data: newReviewResult.rows[0]
    });
  } catch (error) {
    console.error('Create review error:', error);
    return res.status(500).json({ success: false, error: 'Failed to create review' });
  }
});

// Update review
router.put('/:id', ecommerceAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, title, comment } = req.body;

    // Check if review exists and belongs to user
    const reviewResult = await query(
      'SELECT * FROM reviews WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (!reviewResult.rows || reviewResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }

    const updates = [];
    const values = [];

    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ success: false, error: 'Rating must be between 1 and 5' });
      }
      updates.push('rating = ?');
      values.push(rating);
    }
    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (comment !== undefined) {
      updates.push('comment = ?');
      values.push(comment);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, error: 'No fields to update' });
    }

    updates.push('updated_at = NOW()');
    values.push(id);

    await query(
      `UPDATE reviews SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const updatedResult = await query('SELECT * FROM reviews WHERE id = ?', [id]);

    return res.json({
      success: true,
      data: updatedResult.rows[0]
    });
  } catch (error) {
    console.error('Update review error:', error);
    return res.status(500).json({ success: false, error: 'Failed to update review' });
  }
});

// Delete review
router.delete('/:id', ecommerceAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    let whereClause = 'WHERE id = ?';
    const params = [id];

    if (req.user.role !== 'admin') {
      whereClause += ' AND user_id = ?';
      params.push(req.user.id);
    }

    await query(`DELETE FROM reviews ${whereClause}`, params);

    return res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    console.error('Delete review error:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete review' });
  }
});

module.exports = router;
