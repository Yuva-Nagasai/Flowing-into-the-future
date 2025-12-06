const express = require('express');
const { query } = require('../../config/db');
const { ecommerceAuthMiddleware } = require('../../middleware/ecommerceAuth');

const router = express.Router();

// Get cart
router.get('/', ecommerceAuthMiddleware, async (req, res) => {
  try {
    const cartResult = await query(
      `SELECT ci.id, ci.quantity, ci.product_id as productId,
              p.id as product_id, p.name, p.slug, p.price, p.compare_price as comparePrice, 
              p.thumbnail, p.stock
       FROM cart_items ci
       LEFT JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ? AND (p.active = 1 OR p.active IS NULL)`,
      [req.user.id]
    );

    const items = cartResult.rows || [];
    const subtotal = items.reduce((sum, item) => {
      const price = parseFloat(item.price || '0');
      return sum + (price * item.quantity);
    }, 0);

    return res.json({
      success: true,
      data: {
        items: items.map(item => ({
          id: item.id,
          quantity: item.quantity,
          productId: item.productId || item.product_id,
          product: item.product_id ? {
            id: item.product_id,
            name: item.name,
            slug: item.slug,
            price: item.price,
            comparePrice: item.comparePrice,
            thumbnail: item.thumbnail,
            stock: item.stock
          } : null
        })),
        subtotal,
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0)
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch cart' });
  }
});

// Add to cart
router.post('/add', ecommerceAuthMiddleware, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, error: 'Product ID is required' });
    }

    // Check if product exists and is active
    const productResult = await query(
      'SELECT * FROM products WHERE id = ? AND active = 1',
      [productId]
    );

    if (!productResult.rows || productResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const product = productResult.rows[0];

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, error: 'Insufficient stock' });
    }

    // Check if item already in cart
    const existingResult = await query(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
      [req.user.id, productId]
    );

    if (existingResult.rows && existingResult.rows.length > 0) {
      const existing = existingResult.rows[0];
      const newQuantity = existing.quantity + quantity;
      
      if (newQuantity > product.stock) {
        return res.status(400).json({ success: false, error: 'Insufficient stock' });
      }

      await query(
        'UPDATE cart_items SET quantity = ?, updated_at = NOW() WHERE id = ?',
        [newQuantity, existing.id]
      );
    } else {
      await query(
        'INSERT INTO cart_items (user_id, product_id, quantity, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
        [req.user.id, productId, quantity]
      );
    }

    return res.json({ success: true, message: 'Added to cart' });
  } catch (error) {
    console.error('Add to cart error:', error);
    return res.status(500).json({ success: false, error: 'Failed to add to cart' });
  }
});

// Update cart item
router.put('/:itemId', ecommerceAuthMiddleware, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, error: 'Invalid quantity' });
    }

    // Get cart item
    const itemResult = await query(
      'SELECT * FROM cart_items WHERE id = ? AND user_id = ?',
      [itemId, req.user.id]
    );

    if (!itemResult.rows || itemResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Cart item not found' });
    }

    const item = itemResult.rows[0];

    // Check product stock
    const productResult = await query(
      'SELECT stock FROM products WHERE id = ?',
      [item.product_id]
    );

    if (productResult.rows && productResult.rows.length > 0) {
      const stock = productResult.rows[0].stock;
      if (quantity > stock) {
        return res.status(400).json({ success: false, error: 'Insufficient stock' });
      }
    }

    await query(
      'UPDATE cart_items SET quantity = ?, updated_at = NOW() WHERE id = ?',
      [quantity, itemId]
    );

    return res.json({ success: true, message: 'Cart updated' });
  } catch (error) {
    console.error('Update cart error:', error);
    return res.status(500).json({ success: false, error: 'Failed to update cart' });
  }
});

// Remove from cart
router.delete('/:itemId', ecommerceAuthMiddleware, async (req, res) => {
  try {
    const { itemId } = req.params;

    await query(
      'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
      [itemId, req.user.id]
    );

    return res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    return res.status(500).json({ success: false, error: 'Failed to remove from cart' });
  }
});

// Clear cart
router.delete('/', ecommerceAuthMiddleware, async (req, res) => {
  try {
    await query(
      'DELETE FROM cart_items WHERE user_id = ?',
      [req.user.id]
    );

    return res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    return res.status(500).json({ success: false, error: 'Failed to clear cart' });
  }
});

module.exports = router;
