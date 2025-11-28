import { Router, Request, Response } from 'express';
import { db, schema } from '../db/index.js';
import { eq, desc, asc, like, sql, and, gte, lte } from 'drizzle-orm';
import { optionalAuth, authenticate } from '../middleware/auth.js';
import { z } from 'zod';

const router = Router();

router.get('/products', optionalAuth, async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const category = req.query.category as string;
    const search = req.query.search as string;
    const featured = req.query.featured === 'true';
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder as string || 'desc';

    const products = await db.query.products.findMany({
      where: eq(schema.products.isActive, true),
      orderBy: sortOrder === 'desc' ? desc(schema.products.createdAt) : asc(schema.products.createdAt),
      limit,
      offset: (page - 1) * limit,
      with: { category: true },
    });

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.products)
      .where(eq(schema.products.isActive, true));

    res.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
});

router.get('/products/featured', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const products = await db.query.products.findMany({
      where: and(eq(schema.products.isActive, true), eq(schema.products.featured, true)),
      limit: 8,
      with: { category: true },
    });

    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch featured products' });
  }
});

router.get('/products/:slug', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const { slug } = req.params;

    const product = await db.query.products.findFirst({
      where: eq(schema.products.slug, slug),
      with: {
        category: true,
        reviews: {
          where: eq(schema.reviews.isApproved, true),
          with: { user: true },
          limit: 10,
        },
      },
    });

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch product' });
  }
});

router.get('/categories', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const categories = await db.query.categories.findMany({
      where: eq(schema.categories.isActive, true),
      orderBy: asc(schema.categories.sortOrder),
    });

    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
});

router.get('/categories/:slug', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const { slug } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const category = await db.query.categories.findFirst({
      where: eq(schema.categories.slug, slug),
    });

    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    const products = await db.query.products.findMany({
      where: and(eq(schema.products.categoryId, category.id), eq(schema.products.isActive, true)),
      limit,
      offset: (page - 1) * limit,
    });

    res.json({
      success: true,
      data: { category, products },
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch category' });
  }
});

router.get('/cart', authenticate, async (req: Request, res: Response) => {
  try {
    if (!db || !req.user) {
      return res.status(503).json({ success: false, error: 'Service not available' });
    }

    const cartItems = await db.query.cartItems.findMany({
      where: eq(schema.cartItems.userId, req.user.id),
      with: { product: true },
    });

    const total = cartItems.reduce((sum, item) => {
      const price = parseFloat(item.product?.price as string || '0');
      return sum + price * item.quantity;
    }, 0);

    res.json({
      success: true,
      data: { items: cartItems, total },
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch cart' });
  }
});

router.post('/cart', authenticate, async (req: Request, res: Response) => {
  try {
    if (!db || !req.user) {
      return res.status(503).json({ success: false, error: 'Service not available' });
    }

    const { productId, quantity = 1 } = req.body;

    const existing = await db.query.cartItems.findFirst({
      where: and(
        eq(schema.cartItems.userId, req.user.id),
        eq(schema.cartItems.productId, productId)
      ),
    });

    if (existing) {
      const [updated] = await db
        .update(schema.cartItems)
        .set({ quantity: existing.quantity + quantity, updatedAt: new Date() })
        .where(eq(schema.cartItems.id, existing.id))
        .returning();

      return res.json({ success: true, data: updated });
    }

    const [item] = await db
      .insert(schema.cartItems)
      .values({ userId: req.user.id, productId, quantity })
      .returning();

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, error: 'Failed to add to cart' });
  }
});

router.put('/cart/:id', authenticate, async (req: Request, res: Response) => {
  try {
    if (!db || !req.user) {
      return res.status(503).json({ success: false, error: 'Service not available' });
    }

    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      await db.delete(schema.cartItems).where(eq(schema.cartItems.id, parseInt(id)));
      return res.json({ success: true, message: 'Item removed from cart' });
    }

    const [updated] = await db
      .update(schema.cartItems)
      .set({ quantity, updatedAt: new Date() })
      .where(and(eq(schema.cartItems.id, parseInt(id)), eq(schema.cartItems.userId, req.user.id)))
      .returning();

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ success: false, error: 'Failed to update cart' });
  }
});

router.delete('/cart/:id', authenticate, async (req: Request, res: Response) => {
  try {
    if (!db || !req.user) {
      return res.status(503).json({ success: false, error: 'Service not available' });
    }

    const { id } = req.params;

    await db
      .delete(schema.cartItems)
      .where(and(eq(schema.cartItems.id, parseInt(id)), eq(schema.cartItems.userId, req.user.id)));

    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ success: false, error: 'Failed to remove from cart' });
  }
});

router.delete('/cart', authenticate, async (req: Request, res: Response) => {
  try {
    if (!db || !req.user) {
      return res.status(503).json({ success: false, error: 'Service not available' });
    }

    await db.delete(schema.cartItems).where(eq(schema.cartItems.userId, req.user.id));

    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ success: false, error: 'Failed to clear cart' });
  }
});

router.get('/wishlist', authenticate, async (req: Request, res: Response) => {
  try {
    if (!db || !req.user) {
      return res.status(503).json({ success: false, error: 'Service not available' });
    }

    const wishlistItems = await db.query.wishlist.findMany({
      where: eq(schema.wishlist.userId, req.user.id),
      with: { product: true },
    });

    res.json({ success: true, data: wishlistItems });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch wishlist' });
  }
});

router.post('/wishlist', authenticate, async (req: Request, res: Response) => {
  try {
    if (!db || !req.user) {
      return res.status(503).json({ success: false, error: 'Service not available' });
    }

    const { productId } = req.body;

    const existing = await db.query.wishlist.findFirst({
      where: and(eq(schema.wishlist.userId, req.user.id), eq(schema.wishlist.productId, productId)),
    });

    if (existing) {
      return res.status(400).json({ success: false, error: 'Already in wishlist' });
    }

    const [item] = await db
      .insert(schema.wishlist)
      .values({ userId: req.user.id, productId })
      .returning();

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ success: false, error: 'Failed to add to wishlist' });
  }
});

router.delete('/wishlist/:productId', authenticate, async (req: Request, res: Response) => {
  try {
    if (!db || !req.user) {
      return res.status(503).json({ success: false, error: 'Service not available' });
    }

    const { productId } = req.params;

    await db
      .delete(schema.wishlist)
      .where(and(eq(schema.wishlist.userId, req.user.id), eq(schema.wishlist.productId, parseInt(productId))));

    res.json({ success: true, message: 'Removed from wishlist' });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ success: false, error: 'Failed to remove from wishlist' });
  }
});

router.get('/orders', authenticate, async (req: Request, res: Response) => {
  try {
    if (!db || !req.user) {
      return res.status(503).json({ success: false, error: 'Service not available' });
    }

    const orders = await db.query.orders.findMany({
      where: eq(schema.orders.userId, req.user.id),
      orderBy: desc(schema.orders.createdAt),
      with: { items: true },
    });

    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
});

router.get('/orders/:orderNumber', authenticate, async (req: Request, res: Response) => {
  try {
    if (!db || !req.user) {
      return res.status(503).json({ success: false, error: 'Service not available' });
    }

    const { orderNumber } = req.params;

    const order = await db.query.orders.findFirst({
      where: and(eq(schema.orders.orderNumber, orderNumber), eq(schema.orders.userId, req.user.id)),
      with: { items: true, payments: true },
    });

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch order' });
  }
});

const reviewSchema = z.object({
  productId: z.number(),
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().min(10),
});

router.post('/reviews', authenticate, async (req: Request, res: Response) => {
  try {
    if (!db || !req.user) {
      return res.status(503).json({ success: false, error: 'Service not available' });
    }

    const data = reviewSchema.parse(req.body);

    const order = await db.query.orders.findFirst({
      where: eq(schema.orders.userId, req.user.id),
      with: { items: true },
    });

    const hasPurchased = order?.items.some((item: { productId: number | null }) => item.productId === data.productId);

    const [review] = await db
      .insert(schema.reviews)
      .values({
        userId: req.user.id,
        productId: data.productId,
        orderId: order?.id,
        rating: data.rating,
        title: data.title,
        comment: data.comment,
        verified: hasPurchased || false,
      })
      .returning();

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.errors });
    }
    console.error('Create review error:', error);
    res.status(500).json({ success: false, error: 'Failed to create review' });
  }
});

router.get('/deals', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const now = new Date();

    const deals = await db.query.deals.findMany({
      where: and(
        eq(schema.deals.isActive, true),
        lte(schema.deals.startDate, now),
        gte(schema.deals.endDate, now)
      ),
      orderBy: desc(schema.deals.priority),
    });

    res.json({ success: true, data: deals });
  } catch (error) {
    console.error('Get deals error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch deals' });
  }
});

router.get('/announcements', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const now = new Date();

    const announcements = await db.query.announcements.findMany({
      where: eq(schema.announcements.isActive, true),
      orderBy: desc(schema.announcements.priority),
      limit: 5,
    });

    res.json({ success: true, data: announcements });
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch announcements' });
  }
});

router.get('/testimonials', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const testimonials = await db.query.testimonials.findMany({
      where: eq(schema.testimonials.isActive, true),
      orderBy: asc(schema.testimonials.sortOrder),
    });

    res.json({ success: true, data: testimonials });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch testimonials' });
  }
});

router.post('/newsletter/subscribe', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const { email, name, source } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    const existing = await db.query.newsletterSubscribers.findFirst({
      where: eq(schema.newsletterSubscribers.email, email),
    });

    if (existing) {
      if (!existing.isActive) {
        await db
          .update(schema.newsletterSubscribers)
          .set({ isActive: true, unsubscribedAt: null })
          .where(eq(schema.newsletterSubscribers.id, existing.id));

        return res.json({ success: true, message: 'Successfully resubscribed!' });
      }
      return res.status(400).json({ success: false, error: 'Already subscribed' });
    }

    await db.insert(schema.newsletterSubscribers).values({ email, name, source });

    res.status(201).json({ success: true, message: 'Successfully subscribed!' });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ success: false, error: 'Subscription failed' });
  }
});

router.post('/product-request', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const { name, email, productName, description, category, budget } = req.body;

    if (!name || !email || !productName) {
      return res.status(400).json({ success: false, error: 'Name, email, and product name are required' });
    }

    const [request] = await db
      .insert(schema.productRequests)
      .values({ name, email, productName, description, category, budget })
      .returning();

    res.status(201).json({ success: true, data: request });
  } catch (error) {
    console.error('Product request error:', error);
    res.status(500).json({ success: false, error: 'Failed to submit request' });
  }
});

router.get('/search', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const query = req.query.q as string;
    const limit = parseInt(req.query.limit as string) || 20;

    if (!query || query.length < 2) {
      return res.status(400).json({ success: false, error: 'Search query must be at least 2 characters' });
    }

    const products = await db.query.products.findMany({
      where: and(
        eq(schema.products.isActive, true),
        like(schema.products.name, `%${query}%`)
      ),
      limit,
      with: { category: true },
    });

    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ success: false, error: 'Search failed' });
  }
});

export default router;
