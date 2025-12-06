const express = require('express');
const { query } = require('../../config/db');
const { ecommerceAuthMiddleware, ecommerceAdminMiddleware } = require('../../middleware/ecommerceAuth');

const router = express.Router();

// Get all products with filtering, pagination, and sorting
router.get('/', async (req, res) => {
  try {
    const {
      category,
      search,
      featured,
      minPrice,
      maxPrice,
      sort = 'newest',
      page = '1',
      limit = '12'
    } = req.query;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 12));
    const offset = (pageNum - 1) * limitNum;

    let whereConditions = ['active = 1'];
    const params = [];

    if (category && category !== 'all') {
      whereConditions.push('category = ?');
      params.push(category);
    }

    if (search) {
      whereConditions.push('(name LIKE ? OR description LIKE ?)');
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    if (featured === 'true') {
      whereConditions.push('featured = 1');
    }

    if (minPrice) {
      whereConditions.push('price >= ?');
      params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      whereConditions.push('price <= ?');
      params.push(parseFloat(maxPrice));
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    let orderBy = 'ORDER BY created_at DESC';
    switch (sort) {
      case 'price_asc':
        orderBy = 'ORDER BY price ASC';
        break;
      case 'price_desc':
        orderBy = 'ORDER BY price DESC';
        break;
      case 'name_asc':
        orderBy = 'ORDER BY name ASC';
        break;
      case 'name_desc':
        orderBy = 'ORDER BY name DESC';
        break;
      case 'oldest':
        orderBy = 'ORDER BY created_at ASC';
        break;
      default:
        orderBy = 'ORDER BY created_at DESC';
    }

    // Get products
    const productsResult = await query(
      `SELECT * FROM products ${whereClause} ${orderBy} LIMIT ? OFFSET ?`,
      [...params, limitNum, offset]
    );

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM products ${whereClause}`,
      params
    );

    const total = countResult.rows[0]?.total || 0;

    return res.json({
      success: true,
      data: {
        items: productsResult.rows || [],
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
});

// Get featured products
router.get('/featured', async (req, res) => {
  try {
    const limit = Math.min(20, parseInt(req.query.limit) || 8);

    const productsResult = await query(
      'SELECT * FROM products WHERE active = 1 AND featured = 1 ORDER BY created_at DESC LIMIT ?',
      [limit]
    );

    return res.json({
      success: true,
      data: productsResult.rows || []
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch featured products' });
  }
});

// Get categories
router.get('/categories', async (req, res) => {
  try {
    const categoriesResult = await query(
      `SELECT category, COUNT(*) as count 
       FROM products 
       WHERE active = 1 
       GROUP BY category`
    );

    return res.json({
      success: true,
      data: categoriesResult.rows || []
    });
  } catch (error) {
    console.error('Get categories error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
});

// Get product by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const productResult = await query(
      'SELECT * FROM products WHERE slug = ? AND active = 1',
      [slug]
    );

    if (!productResult.rows || productResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const product = productResult.rows[0];

    // Get reviews for the product
    const reviewsResult = await query(
      `SELECT r.*, u.name as userName
       FROM reviews r
       LEFT JOIN ecommerce_users u ON r.user_id = u.id
       WHERE r.product_id = ?
       ORDER BY r.created_at DESC`,
      [product.id]
    );

    const reviews = reviewsResult.rows || [];
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    return res.json({
      success: true,
      data: {
        ...product,
        reviews,
        averageRating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length
      }
    });
  } catch (error) {
    console.error('Get product error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch product' });
  }
});

// Create product (Admin only)
router.post('/', ecommerceAuthMiddleware, ecommerceAdminMiddleware, async (req, res) => {
  try {
    const {
      name,
      description,
      shortDescription,
      price,
      comparePrice,
      category,
      images,
      thumbnail,
      stock,
      sku,
      featured
    } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        error: 'Name, description, price, and category are required'
      });
    }

    // Generate slug
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);

    const productResult = await query(
      `INSERT INTO products (name, slug, description, short_description, price, compare_price, 
        category, images, thumbnail, stock, sku, featured, active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
      [
        name,
        slug,
        description,
        shortDescription || null,
        price.toString(),
        comparePrice ? comparePrice.toString() : null,
        category,
        JSON.stringify(images || []),
        thumbnail || null,
        stock || 0,
        sku || null,
        featured ? 1 : 0
      ]
    );

    const productId = productResult.insertId;
    const newProductResult = await query('SELECT * FROM products WHERE id = ?', [productId]);

    return res.status(201).json({
      success: true,
      data: newProductResult.rows[0]
    });
  } catch (error) {
    console.error('Create product error:', error);
    return res.status(500).json({ success: false, error: 'Failed to create product' });
  }
});

// Update product (Admin only)
router.put('/:id', ecommerceAuthMiddleware, ecommerceAdminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if product exists
    const existingResult = await query('SELECT id FROM products WHERE id = ?', [id]);
    if (!existingResult.rows || existingResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const updateFields = [];
    const values = [];

    const allowedFields = [
      'name', 'description', 'short_description', 'price', 'compare_price',
      'category', 'images', 'thumbnail', 'stock', 'sku', 'featured', 'active'
    ];

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        if (field === 'images') {
          updateFields.push(`${field} = ?`);
          values.push(JSON.stringify(updates[field]));
        } else if (field === 'price' || field === 'compare_price') {
          updateFields.push(`${field} = ?`);
          values.push(updates[field]?.toString() || null);
        } else {
          updateFields.push(`${field} = ?`);
          values.push(updates[field]);
        }
      }
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, error: 'No fields to update' });
    }

    updateFields.push('updated_at = NOW()');
    values.push(id);

    await query(
      `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`,
      values
    );

    const updatedResult = await query('SELECT * FROM products WHERE id = ?', [id]);

    return res.json({
      success: true,
      data: updatedResult.rows[0]
    });
  } catch (error) {
    console.error('Update product error:', error);
    return res.status(500).json({ success: false, error: 'Failed to update product' });
  }
});

// Delete product (Admin only)
router.delete('/:id', ecommerceAuthMiddleware, ecommerceAdminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    await query('DELETE FROM products WHERE id = ?', [id]);

    return res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete product' });
  }
});

module.exports = router;
