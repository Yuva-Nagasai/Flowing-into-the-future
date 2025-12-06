const express = require('express');
const { query } = require('../../config/db');
const { ecommerceAuthMiddleware } = require('../../middleware/ecommerceAuth');

const router = express.Router();

// Get wishlist
router.get('/', ecommerceAuthMiddleware, async (req, res) => {
  try {
    const wishlistResult = await query(
      `SELECT wi.id, wi.product_id as productId, wi.created_at as createdAt,
              p.id as product_id, p.name, p.slug, p.price, p.compare_price as comparePrice, 
              p.thumbnail, p.stock
       FROM wishlist_items wi
       LEFT JOIN products p ON wi.product_id = p.id
       WHERE wi.user_id = ?`,
      [req.user.id]
    );

    return res.json({
      success: true,
      data: (wishlistResult.rows || []).map(item => ({
        id: item.id,
        productId: item.productId || item.product_id,
        createdAt: item.createdAt,
        product: item.product_id ? {
          id: item.product_id,
          name: item.name,
          slug: item.slug,
          price: item.price,
          comparePrice: item.comparePrice,
          thumbnail: item.thumbnail,
          stock: item.stock
        } : null
      }))
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch wishlist' });
  }
});

// Add to wishlist
router.post('/add', ecommerceAuthMiddleware, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, error: 'Product ID is required' });
    }

    // Check if product exists
    const productResult = await query('SELECT id FROM products WHERE id = ?', [productId]);
    if (!productResult.rows || productResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Check if already in wishlist
    const existingResult = await query(
      'SELECT * FROM wishlist_items WHERE user_id = ? AND product_id = ?',
      [req.user.id, productId]
    );

    if (existingResult.rows && existingResult.rows.length > 0) {
      return res.json({ success: true, message: 'Already in wishlist' });
    }

    await query(
      'INSERT INTO wishlist_items (user_id, product_id, created_at) VALUES (?, ?, NOW())',
      [req.user.id, productId]
    );

    return res.json({ success: true, message: 'Added to wishlist' });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    return res.status(500).json({ success: false, error: 'Failed to add to wishlist' });
  }
});

// Remove from wishlist
router.delete('/:productId', ecommerceAuthMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;

    await query(
      'DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?',
      [req.user.id, productId]
    );

    return res.json({ success: true, message: 'Removed from wishlist' });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    return res.status(500).json({ success: false, error: 'Failed to remove from wishlist' });
  }
});

module.exports = router;
