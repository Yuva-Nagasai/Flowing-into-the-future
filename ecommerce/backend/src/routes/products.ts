import { Router, Request, Response } from 'express';
import { db, schema } from '../db/index.js';
import { eq, ilike, and, or, desc, asc, sql, inArray } from 'drizzle-orm';
import { authMiddleware, adminMiddleware, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
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

    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string) || 12));
    const offset = (pageNum - 1) * limitNum;

    const conditions = [eq(schema.products.active, true)];

    if (category && category !== 'all') {
      conditions.push(eq(schema.products.category, category as typeof schema.products.category.enumValues[number]));
    }

    if (search) {
      conditions.push(
        or(
          ilike(schema.products.name, `%${search}%`),
          ilike(schema.products.description, `%${search}%`)
        )!
      );
    }

    if (featured === 'true') {
      conditions.push(eq(schema.products.featured, true));
    }

    if (minPrice) {
      conditions.push(sql`${schema.products.price} >= ${parseFloat(minPrice as string)}`);
    }

    if (maxPrice) {
      conditions.push(sql`${schema.products.price} <= ${parseFloat(maxPrice as string)}`);
    }

    let orderBy;
    switch (sort) {
      case 'price_asc':
        orderBy = asc(schema.products.price);
        break;
      case 'price_desc':
        orderBy = desc(schema.products.price);
        break;
      case 'name_asc':
        orderBy = asc(schema.products.name);
        break;
      case 'name_desc':
        orderBy = desc(schema.products.name);
        break;
      case 'oldest':
        orderBy = asc(schema.products.createdAt);
        break;
      default:
        orderBy = desc(schema.products.createdAt);
    }

    const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

    const [products, countResult] = await Promise.all([
      db.select()
        .from(schema.products)
        .where(whereClause)
        .orderBy(orderBy)
        .limit(limitNum)
        .offset(offset),
      db.select({ count: sql<number>`count(*)` })
        .from(schema.products)
        .where(whereClause)
    ]);

    const total = Number(countResult[0]?.count || 0);

    res.json({
      success: true,
      data: {
        items: products,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
});

router.get('/featured', async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = Math.min(20, parseInt(req.query.limit as string) || 8);

    const products = await db.select()
      .from(schema.products)
      .where(and(eq(schema.products.active, true), eq(schema.products.featured, true)))
      .orderBy(desc(schema.products.createdAt))
      .limit(limit);

    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch featured products' });
  }
});

router.get('/categories', async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await db.select({
      category: schema.products.category,
      count: sql<number>`count(*)`
    })
    .from(schema.products)
    .where(eq(schema.products.active, true))
    .groupBy(schema.products.category);

    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
});

router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const products = await db.select()
      .from(schema.products)
      .where(eq(schema.products.slug, slug))
      .limit(1);

    if (products.length === 0) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }

    const product = products[0];

    const reviews = await db.select({
      id: schema.reviews.id,
      rating: schema.reviews.rating,
      title: schema.reviews.title,
      comment: schema.reviews.comment,
      verified: schema.reviews.verified,
      createdAt: schema.reviews.createdAt,
      userName: schema.ecommerceUsers.name
    })
    .from(schema.reviews)
    .leftJoin(schema.ecommerceUsers, eq(schema.reviews.userId, schema.ecommerceUsers.id))
    .where(eq(schema.reviews.productId, product.id))
    .orderBy(desc(schema.reviews.createdAt));

    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;

    res.json({
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
    res.status(500).json({ success: false, error: 'Failed to fetch product' });
  }
});

router.post('/', authMiddleware, adminMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, description, shortDescription, price, comparePrice, category, images, thumbnail, stock, sku, featured } = req.body;

    if (!name || !description || !price || !category) {
      res.status(400).json({ success: false, error: 'Name, description, price, and category are required' });
      return;
    }

    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);

    const result = await db.insert(schema.products).values({
      name,
      slug,
      description,
      shortDescription: shortDescription || null,
      price: price.toString(),
      comparePrice: comparePrice?.toString() || null,
      category,
      images: images || [],
      thumbnail: thumbnail || null,
      stock: stock || 0,
      sku: sku || null,
      featured: featured || false
    }).returning();

    res.status(201).json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, error: 'Failed to create product' });
  }
});

router.put('/:id', authMiddleware, adminMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const existing = await db.select({ id: schema.products.id })
      .from(schema.products)
      .where(eq(schema.products.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    const allowedFields = ['name', 'description', 'shortDescription', 'price', 'comparePrice', 'category', 'images', 'thumbnail', 'stock', 'sku', 'featured', 'active'];
    
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        if (field === 'price' || field === 'comparePrice') {
          updateData[field] = updates[field]?.toString() || null;
        } else {
          updateData[field] = updates[field];
        }
      }
    }

    const result = await db.update(schema.products)
      .set(updateData)
      .where(eq(schema.products.id, parseInt(id)))
      .returning();

    res.json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, error: 'Failed to update product' });
  }
});

router.delete('/:id', authMiddleware, adminMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await db.delete(schema.products)
      .where(eq(schema.products.id, parseInt(id)));

    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete product' });
  }
});

export default router;
