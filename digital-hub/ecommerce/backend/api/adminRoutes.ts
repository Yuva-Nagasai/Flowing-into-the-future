import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { db, schema } from '../db/index.js';
import { eq, desc, asc, like, sql, and, gte, lte } from 'drizzle-orm';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { generateSlug } from '../utils/helpers.js';

const router = Router();

router.use(authenticate, requireAdmin);

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  shortDescription: z.string().optional(),
  price: z.number().positive(),
  comparePrice: z.number().positive().optional(),
  categoryId: z.number().optional(),
  images: z.array(z.string()).optional(),
  thumbnail: z.string().optional(),
  stock: z.number().min(0).default(0),
  sku: z.string().optional(),
  featured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  tags: z.array(z.string()).optional(),
});

const categorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  image: z.string().optional(),
  parentId: z.number().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

const dealSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().positive(),
  productId: z.number().optional(),
  categoryId: z.number().optional(),
  startDate: z.string(),
  endDate: z.string(),
  isActive: z.boolean().default(true),
  bannerImage: z.string().optional(),
  priority: z.number().default(0),
});

const announcementSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  type: z.enum(['info', 'warning', 'success', 'error']).default('info'),
  isActive: z.boolean().default(true),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  targetUrl: z.string().optional(),
  priority: z.number().default(0),
});

const testimonialSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  avatar: z.string().optional(),
  company: z.string().optional(),
  role: z.string().optional(),
  content: z.string().min(1),
  rating: z.number().min(1).max(5).default(5),
  isActive: z.boolean().default(true),
  featured: z.boolean().default(false),
  sortOrder: z.number().default(0),
});

router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const [
      usersCount,
      productsCount,
      ordersCount,
      totalRevenue,
      recentOrders,
      topProducts,
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(schema.users),
      db.select({ count: sql<number>`count(*)` }).from(schema.products),
      db.select({ count: sql<number>`count(*)` }).from(schema.orders),
      db.select({ total: sql<number>`COALESCE(SUM(total), 0)` }).from(schema.orders).where(eq(schema.orders.paymentStatus, 'completed')),
      db.query.orders.findMany({ limit: 5, orderBy: desc(schema.orders.createdAt), with: { user: true } }),
      db.query.products.findMany({ limit: 5, orderBy: desc(schema.products.totalReviews) }),
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers: usersCount[0]?.count || 0,
          totalProducts: productsCount[0]?.count || 0,
          totalOrders: ordersCount[0]?.count || 0,
          totalRevenue: totalRevenue[0]?.total || 0,
        },
        recentOrders,
        topProducts,
      },
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch dashboard data' });
  }
});

router.get('/users', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;

    let query = db.select().from(schema.users);
    
    if (search) {
      query = query.where(like(schema.users.email, `%${search}%`)) as any;
    }

    const users = await query
      .orderBy(desc(schema.users.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(schema.users);

    res.json({
      success: true,
      data: users.map(u => ({ ...u, password: undefined })),
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch users' });
  }
});

router.put('/users/:id', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const { id } = req.params;
    const { name, role, isActive, phone } = req.body;

    const [updated] = await db
      .update(schema.users)
      .set({ name, role, isActive, phone, updatedAt: new Date() })
      .where(eq(schema.users.id, parseInt(id)))
      .returning();

    res.json({ success: true, data: { ...updated, password: undefined } });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ success: false, error: 'Failed to update user' });
  }
});

router.delete('/users/:id', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const { id } = req.params;
    await db.delete(schema.users).where(eq(schema.users.id, parseInt(id)));
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete user' });
  }
});

router.get('/products', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const products = await db.query.products.findMany({
      orderBy: desc(schema.products.createdAt),
      limit,
      offset: (page - 1) * limit,
      with: { category: true },
    });

    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(schema.products);

    res.json({
      success: true,
      data: products,
      pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
});

router.post('/products', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const data = productSchema.parse(req.body);
    const slug = generateSlug(data.name);

    const [product] = await db
      .insert(schema.products)
      .values({
        ...data,
        slug,
        price: data.price.toString(),
        comparePrice: data.comparePrice?.toString(),
      })
      .returning();

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.errors });
    }
    console.error('Create product error:', error);
    res.status(500).json({ success: false, error: 'Failed to create product' });
  }
});

router.put('/products/:id', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const { id } = req.params;
    const data = productSchema.partial().parse(req.body);

    const updateData: any = { ...data, updatedAt: new Date() };
    if (data.name) {
      updateData.slug = generateSlug(data.name);
    }
    if (data.price) {
      updateData.price = data.price.toString();
    }
    if (data.comparePrice) {
      updateData.comparePrice = data.comparePrice.toString();
    }

    const [product] = await db
      .update(schema.products)
      .set(updateData)
      .where(eq(schema.products.id, parseInt(id)))
      .returning();

    res.json({ success: true, data: product });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.errors });
    }
    console.error('Update product error:', error);
    res.status(500).json({ success: false, error: 'Failed to update product' });
  }
});

router.delete('/products/:id', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const { id } = req.params;
    await db.delete(schema.products).where(eq(schema.products.id, parseInt(id)));
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete product' });
  }
});

router.get('/categories', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const categories = await db.query.categories.findMany({
      orderBy: asc(schema.categories.sortOrder),
    });

    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
});

router.post('/categories', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const data = categorySchema.parse(req.body);
    const slug = generateSlug(data.name);

    const [category] = await db.insert(schema.categories).values({ ...data, slug }).returning();

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.errors });
    }
    console.error('Create category error:', error);
    res.status(500).json({ success: false, error: 'Failed to create category' });
  }
});

router.put('/categories/:id', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const { id } = req.params;
    const data = categorySchema.partial().parse(req.body);
    const updateData: any = { ...data, updatedAt: new Date() };
    if (data.name) {
      updateData.slug = generateSlug(data.name);
    }

    const [category] = await db
      .update(schema.categories)
      .set(updateData)
      .where(eq(schema.categories.id, parseInt(id)))
      .returning();

    res.json({ success: true, data: category });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ success: false, error: 'Failed to update category' });
  }
});

router.delete('/categories/:id', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const { id } = req.params;
    await db.delete(schema.categories).where(eq(schema.categories.id, parseInt(id)));
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete category' });
  }
});

router.get('/orders', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;

    const orders = await db.query.orders.findMany({
      orderBy: desc(schema.orders.createdAt),
      limit,
      offset: (page - 1) * limit,
      with: { user: true, items: true, payments: true },
    });

    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(schema.orders);

    res.json({
      success: true,
      data: orders,
      pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
});

router.put('/orders/:id', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const { id } = req.params;
    const { status, paymentStatus, trackingNumber, notes } = req.body;

    const [order] = await db
      .update(schema.orders)
      .set({ status, paymentStatus, trackingNumber, notes, updatedAt: new Date() })
      .where(eq(schema.orders.id, parseInt(id)))
      .returning();

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ success: false, error: 'Failed to update order' });
  }
});

router.get('/deals', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const deals = await db.query.deals.findMany({
      orderBy: desc(schema.deals.priority),
    });

    res.json({ success: true, data: deals });
  } catch (error) {
    console.error('Get deals error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch deals' });
  }
});

router.post('/deals', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const data = dealSchema.parse(req.body);
    const [deal] = await db
      .insert(schema.deals)
      .values({
        ...data,
        discountValue: data.discountValue.toString(),
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      })
      .returning();

    res.status(201).json({ success: true, data: deal });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.errors });
    }
    console.error('Create deal error:', error);
    res.status(500).json({ success: false, error: 'Failed to create deal' });
  }
});

router.put('/deals/:id', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const { id } = req.params;
    const data = dealSchema.partial().parse(req.body);

    const updateData: any = { ...data, updatedAt: new Date() };
    if (data.discountValue) updateData.discountValue = data.discountValue.toString();
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.endDate) updateData.endDate = new Date(data.endDate);

    const [deal] = await db
      .update(schema.deals)
      .set(updateData)
      .where(eq(schema.deals.id, parseInt(id)))
      .returning();

    res.json({ success: true, data: deal });
  } catch (error) {
    console.error('Update deal error:', error);
    res.status(500).json({ success: false, error: 'Failed to update deal' });
  }
});

router.delete('/deals/:id', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const { id } = req.params;
    await db.delete(schema.deals).where(eq(schema.deals.id, parseInt(id)));
    res.json({ success: true, message: 'Deal deleted successfully' });
  } catch (error) {
    console.error('Delete deal error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete deal' });
  }
});

router.get('/announcements', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const announcements = await db.query.announcements.findMany({
      orderBy: desc(schema.announcements.priority),
    });

    res.json({ success: true, data: announcements });
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch announcements' });
  }
});

router.post('/announcements', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const data = announcementSchema.parse(req.body);
    const [announcement] = await db
      .insert(schema.announcements)
      .values({
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      })
      .returning();

    res.status(201).json({ success: true, data: announcement });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.errors });
    }
    console.error('Create announcement error:', error);
    res.status(500).json({ success: false, error: 'Failed to create announcement' });
  }
});

router.put('/announcements/:id', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const { id } = req.params;
    const data = announcementSchema.partial().parse(req.body);

    const updateData: any = { ...data, updatedAt: new Date() };
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.endDate) updateData.endDate = new Date(data.endDate);

    const [announcement] = await db
      .update(schema.announcements)
      .set(updateData)
      .where(eq(schema.announcements.id, parseInt(id)))
      .returning();

    res.json({ success: true, data: announcement });
  } catch (error) {
    console.error('Update announcement error:', error);
    res.status(500).json({ success: false, error: 'Failed to update announcement' });
  }
});

router.delete('/announcements/:id', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const { id } = req.params;
    await db.delete(schema.announcements).where(eq(schema.announcements.id, parseInt(id)));
    res.json({ success: true, message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete announcement' });
  }
});

router.get('/testimonials', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const testimonials = await db.query.testimonials.findMany({
      orderBy: asc(schema.testimonials.sortOrder),
    });

    res.json({ success: true, data: testimonials });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch testimonials' });
  }
});

router.post('/testimonials', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const data = testimonialSchema.parse(req.body);
    const [testimonial] = await db.insert(schema.testimonials).values(data).returning();

    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.errors });
    }
    console.error('Create testimonial error:', error);
    res.status(500).json({ success: false, error: 'Failed to create testimonial' });
  }
});

router.put('/testimonials/:id', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const { id } = req.params;
    const data = testimonialSchema.partial().parse(req.body);

    const [testimonial] = await db
      .update(schema.testimonials)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.testimonials.id, parseInt(id)))
      .returning();

    res.json({ success: true, data: testimonial });
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({ success: false, error: 'Failed to update testimonial' });
  }
});

router.delete('/testimonials/:id', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const { id } = req.params;
    await db.delete(schema.testimonials).where(eq(schema.testimonials.id, parseInt(id)));
    res.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete testimonial' });
  }
});

router.get('/reviews', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const reviews = await db.query.reviews.findMany({
      orderBy: desc(schema.reviews.createdAt),
      limit,
      offset: (page - 1) * limit,
      with: { user: true, product: true },
    });

    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(schema.reviews);

    res.json({
      success: true,
      data: reviews,
      pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch reviews' });
  }
});

router.put('/reviews/:id', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const { id } = req.params;
    const { isApproved, verified } = req.body;

    const [review] = await db
      .update(schema.reviews)
      .set({ isApproved, verified, updatedAt: new Date() })
      .where(eq(schema.reviews.id, parseInt(id)))
      .returning();

    res.json({ success: true, data: review });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ success: false, error: 'Failed to update review' });
  }
});

router.delete('/reviews/:id', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const { id } = req.params;
    await db.delete(schema.reviews).where(eq(schema.reviews.id, parseInt(id)));
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete review' });
  }
});

router.get('/newsletter-subscribers', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const subscribers = await db.query.newsletterSubscribers.findMany({
      orderBy: desc(schema.newsletterSubscribers.subscribedAt),
    });

    res.json({ success: true, data: subscribers });
  } catch (error) {
    console.error('Get subscribers error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch subscribers' });
  }
});

router.get('/product-requests', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const requests = await db.query.productRequests.findMany({
      orderBy: desc(schema.productRequests.createdAt),
    });

    res.json({ success: true, data: requests });
  } catch (error) {
    console.error('Get product requests error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch product requests' });
  }
});

router.put('/product-requests/:id', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const [request] = await db
      .update(schema.productRequests)
      .set({ status, adminNotes, updatedAt: new Date() })
      .where(eq(schema.productRequests.id, parseInt(id)))
      .returning();

    res.json({ success: true, data: request });
  } catch (error) {
    console.error('Update product request error:', error);
    res.status(500).json({ success: false, error: 'Failed to update product request' });
  }
});

router.get('/login-events', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    const events = await db.query.loginEvents.findMany({
      orderBy: desc(schema.loginEvents.createdAt),
      limit,
      offset: (page - 1) * limit,
    });

    res.json({ success: true, data: events });
  } catch (error) {
    console.error('Get login events error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch login events' });
  }
});

export default router;
