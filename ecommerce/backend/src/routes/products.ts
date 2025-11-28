import { Router, Request, Response } from 'express';
import { db, schema, isDatabaseAvailable } from '../db/index.js';
import { eq, ilike, and, or, desc, asc, sql, inArray } from 'drizzle-orm';
import { authMiddleware, adminMiddleware, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

const sampleProducts = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    slug: 'wireless-bluetooth-headphones',
    description: 'Premium wireless headphones with active noise cancellation and 30-hour battery life.',
    shortDescription: 'Premium wireless headphones with ANC',
    price: '149.99',
    comparePrice: '199.99',
    category: 'electronics',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
    stock: 50,
    sku: 'WBH-001',
    featured: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    name: 'Smart Fitness Watch',
    slug: 'smart-fitness-watch',
    description: 'Track your health and fitness goals with this advanced smartwatch featuring heart rate monitoring and GPS.',
    shortDescription: 'Advanced smartwatch with health tracking',
    price: '249.99',
    comparePrice: '299.99',
    category: 'electronics',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'],
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
    stock: 35,
    sku: 'SFW-002',
    featured: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 3,
    name: 'Organic Cotton T-Shirt',
    slug: 'organic-cotton-tshirt',
    description: 'Comfortable and sustainable organic cotton t-shirt in multiple colors.',
    shortDescription: 'Sustainable organic cotton tee',
    price: '29.99',
    comparePrice: '39.99',
    category: 'clothing',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'],
    thumbnail: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300',
    stock: 100,
    sku: 'OCT-003',
    featured: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 4,
    name: 'Minimalist Desk Lamp',
    slug: 'minimalist-desk-lamp',
    description: 'Modern LED desk lamp with adjustable brightness and color temperature for the perfect workspace lighting.',
    shortDescription: 'Modern LED desk lamp',
    price: '79.99',
    comparePrice: '99.99',
    category: 'home',
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600'],
    thumbnail: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300',
    stock: 45,
    sku: 'MDL-004',
    featured: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 5,
    name: 'Bestselling Novel Collection',
    slug: 'bestselling-novel-collection',
    description: 'A curated collection of 5 bestselling novels from various genres.',
    shortDescription: 'Collection of 5 bestselling novels',
    price: '49.99',
    comparePrice: '79.99',
    category: 'books',
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600'],
    thumbnail: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300',
    stock: 25,
    sku: 'BNC-005',
    featured: false,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 6,
    name: 'Professional Yoga Mat',
    slug: 'professional-yoga-mat',
    description: 'Extra thick, non-slip yoga mat perfect for all types of yoga and exercise routines.',
    shortDescription: 'Extra thick non-slip yoga mat',
    price: '45.99',
    comparePrice: '59.99',
    category: 'sports',
    images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600'],
    thumbnail: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=300',
    stock: 60,
    sku: 'PYM-006',
    featured: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 7,
    name: 'Luxury Skincare Set',
    slug: 'luxury-skincare-set',
    description: 'Complete skincare routine with cleanser, toner, serum, and moisturizer for radiant skin.',
    shortDescription: 'Complete luxury skincare routine',
    price: '129.99',
    comparePrice: '179.99',
    category: 'beauty',
    images: ['https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600'],
    thumbnail: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=300',
    stock: 30,
    sku: 'LSS-007',
    featured: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 8,
    name: 'Building Blocks Set',
    slug: 'building-blocks-set',
    description: 'Creative building blocks set with 500 pieces for endless building possibilities.',
    shortDescription: '500-piece building blocks set',
    price: '34.99',
    comparePrice: '44.99',
    category: 'toys',
    images: ['https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600'],
    thumbnail: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=300',
    stock: 40,
    sku: 'BBS-008',
    featured: false,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 9,
    name: 'Gourmet Coffee Beans',
    slug: 'gourmet-coffee-beans',
    description: 'Premium arabica coffee beans from Colombia, freshly roasted for the perfect cup.',
    shortDescription: 'Premium Colombian arabica beans',
    price: '24.99',
    comparePrice: '29.99',
    category: 'food',
    images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600'],
    thumbnail: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300',
    stock: 75,
    sku: 'GCB-009',
    featured: false,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 10,
    name: 'Portable Power Bank',
    slug: 'portable-power-bank',
    description: 'High-capacity 20000mAh power bank with fast charging support for all devices.',
    shortDescription: '20000mAh fast-charging power bank',
    price: '39.99',
    comparePrice: '49.99',
    category: 'electronics',
    images: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600'],
    thumbnail: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300',
    stock: 55,
    sku: 'PPB-010',
    featured: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 11,
    name: 'Vintage Denim Jacket',
    slug: 'vintage-denim-jacket',
    description: 'Classic vintage-style denim jacket with a modern fit and distressed details.',
    shortDescription: 'Classic vintage-style denim jacket',
    price: '89.99',
    comparePrice: '119.99',
    category: 'clothing',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600'],
    thumbnail: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300',
    stock: 25,
    sku: 'VDJ-011',
    featured: false,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 12,
    name: 'Indoor Plant Collection',
    slug: 'indoor-plant-collection',
    description: 'Set of 3 low-maintenance indoor plants perfect for home or office decoration.',
    shortDescription: '3 low-maintenance indoor plants',
    price: '54.99',
    comparePrice: '69.99',
    category: 'home',
    images: ['https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600'],
    thumbnail: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=300',
    stock: 20,
    sku: 'IPC-012',
    featured: false,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

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

    if (!isDatabaseAvailable) {
      let filteredProducts = [...sampleProducts];
      
      if (category && category !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === category);
      }
      
      if (search) {
        const searchLower = (search as string).toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(searchLower) || 
          p.description.toLowerCase().includes(searchLower)
        );
      }
      
      if (featured === 'true') {
        filteredProducts = filteredProducts.filter(p => p.featured);
      }
      
      if (minPrice) {
        filteredProducts = filteredProducts.filter(p => parseFloat(p.price) >= parseFloat(minPrice as string));
      }
      
      if (maxPrice) {
        filteredProducts = filteredProducts.filter(p => parseFloat(p.price) <= parseFloat(maxPrice as string));
      }
      
      switch (sort) {
        case 'price_asc':
          filteredProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
          break;
        case 'price_desc':
          filteredProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
          break;
        case 'name_asc':
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name_desc':
          filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
          break;
      }
      
      const total = filteredProducts.length;
      const paginatedProducts = filteredProducts.slice(offset, offset + limitNum);
      
      res.json({
        success: true,
        data: {
          items: paginatedProducts,
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum)
        }
      });
      return;
    }

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
      db!.select()
        .from(schema.products)
        .where(whereClause)
        .orderBy(orderBy)
        .limit(limitNum)
        .offset(offset),
      db!.select({ count: sql<number>`count(*)` })
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

    if (!isDatabaseAvailable) {
      const featuredProducts = sampleProducts.filter(p => p.featured).slice(0, limit);
      res.json({ success: true, data: featuredProducts });
      return;
    }

    const products = await db!.select()
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
    if (!isDatabaseAvailable) {
      const categoryCount: Record<string, number> = {};
      sampleProducts.forEach(p => {
        categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
      });
      const categories = Object.entries(categoryCount).map(([category, count]) => ({
        category,
        count
      }));
      res.json({ success: true, data: categories });
      return;
    }

    const categories = await db!.select({
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

    if (!isDatabaseAvailable) {
      const product = sampleProducts.find(p => p.slug === slug);
      if (!product) {
        res.status(404).json({ success: false, error: 'Product not found' });
        return;
      }
      res.json({
        success: true,
        data: {
          ...product,
          reviews: [],
          averageRating: 4.5,
          reviewCount: 0
        }
      });
      return;
    }

    const products = await db!.select()
      .from(schema.products)
      .where(eq(schema.products.slug, slug))
      .limit(1);

    if (products.length === 0) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }

    const product = products[0];

    const reviews = await db!.select({
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

    if (!isDatabaseAvailable || !db) {
      res.status(503).json({ success: false, error: 'Database not available' });
      return;
    }

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
    if (!isDatabaseAvailable || !db) {
      res.status(503).json({ success: false, error: 'Database not available' });
      return;
    }

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
    if (!isDatabaseAvailable || !db) {
      res.status(503).json({ success: false, error: 'Database not available' });
      return;
    }

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
