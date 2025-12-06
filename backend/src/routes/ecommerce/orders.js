const express = require('express');
const { query } = require('../../config/db');
const { ecommerceAuthMiddleware, ecommerceAdminMiddleware } = require('../../middleware/ecommerceAuth');

const router = express.Router();

const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

// Get orders
router.get('/', ecommerceAuthMiddleware, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE user_id = ?';
    const params = [req.user.id];

    if (req.user.role === 'admin') {
      whereClause = '';
      params.pop();
    }

    const ordersResult = await query(
      `SELECT * FROM orders ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      whereClause ? [...params, limit, offset] : [limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as total FROM orders ${whereClause}`,
      params
    );

    const total = countResult.rows[0]?.total || 0;

    // Get order items for each order
    const ordersWithItems = await Promise.all(
      (ordersResult.rows || []).map(async (order) => {
        const itemsResult = await query(
          'SELECT * FROM order_items WHERE order_id = ?',
          [order.id]
        );
        return {
          ...order,
          items: itemsResult.rows || []
        };
      })
    );

    return res.json({
      success: true,
      data: {
        items: ordersWithItems,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/:id', ecommerceAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    let whereClause = 'WHERE id = ?';
    const params = [id];

    if (req.user.role !== 'admin') {
      whereClause += ' AND user_id = ?';
      params.push(req.user.id);
    }

    const orderResult = await query(
      `SELECT * FROM orders ${whereClause}`,
      params
    );

    if (!orderResult.rows || orderResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const order = orderResult.rows[0];
    const itemsResult = await query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [order.id]
    );

    return res.json({
      success: true,
      data: {
        ...order,
        items: itemsResult.rows || []
      }
    });
  } catch (error) {
    console.error('Get order error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch order' });
  }
});

// Create order
router.post('/', ecommerceAuthMiddleware, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, notes } = req.body;

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ success: false, error: 'Shipping address and payment method are required' });
    }

    // Get cart items
    const cartResult = await query(
      `SELECT ci.*, p.name, p.price, p.thumbnail, p.stock
       FROM cart_items ci
       LEFT JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?`,
      [req.user.id]
    );

    const cartItems = cartResult.rows || [];

    if (cartItems.length === 0) {
      return res.status(400).json({ success: false, error: 'Cart is empty' });
    }

    // Validate stock
    for (const item of cartItems) {
      if (!item.name) {
        return res.status(400).json({ success: false, error: 'Product not found' });
      }
      if (item.stock < item.quantity) {
        return res.status(400).json({ success: false, error: `Insufficient stock for ${item.name}` });
      }
    }

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => {
      return sum + (parseFloat(item.price || '0') * item.quantity);
    }, 0);

    const tax = subtotal * 0.1;
    const shipping = subtotal > 100 ? 0 : 10;
    const total = subtotal + tax + shipping;

    const orderNumber = generateOrderNumber();

    // Create order
    const orderResult = await query(
      `INSERT INTO orders (user_id, order_number, status, payment_status, payment_method, 
        subtotal, tax, shipping, discount, total, shipping_address, notes, created_at, updated_at)
       VALUES (?, ?, 'pending', 'pending', ?, ?, ?, ?, 0, ?, ?, ?, NOW(), NOW())`,
      [
        req.user.id,
        orderNumber,
        paymentMethod,
        subtotal.toFixed(2),
        tax.toFixed(2),
        shipping.toFixed(2),
        total.toFixed(2),
        JSON.stringify(shippingAddress),
        notes || null
      ]
    );

    const orderId = orderResult.insertId;

    // Create order items and update stock
    for (const item of cartItems) {
      const itemTotal = parseFloat(item.price) * item.quantity;
      
      await query(
        `INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity, total)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.product_id,
          item.name,
          item.thumbnail,
          item.price,
          item.quantity,
          itemTotal.toFixed(2)
        ]
      );

      // Update product stock
      await query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    // Clear cart
    await query('DELETE FROM cart_items WHERE user_id = ?', [req.user.id]);

    // Get created order with items
    const createdOrderResult = await query('SELECT * FROM orders WHERE id = ?', [orderId]);
    const itemsResult = await query('SELECT * FROM order_items WHERE order_id = ?', [orderId]);

    return res.status(201).json({
      success: true,
      data: {
        ...createdOrderResult.rows[0],
        items: itemsResult.rows || []
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    return res.status(500).json({ success: false, error: 'Failed to create order' });
  }
});

module.exports = router;
