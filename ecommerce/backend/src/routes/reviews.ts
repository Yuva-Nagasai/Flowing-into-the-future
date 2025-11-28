import { Router, Response } from 'express';
import { db, schema } from '../db/index.js';
import { eq, and, desc } from 'drizzle-orm';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

router.get('/product/:productId', async (req, res): Promise<void> => {
  try {
    const { productId } = req.params;

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
    .where(eq(schema.reviews.productId, parseInt(productId)))
    .orderBy(desc(schema.reviews.createdAt));

    res.json({ success: true, data: reviews });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch reviews' });
  }
});

router.post('/', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { productId, rating, title, comment } = req.body;

    if (!productId || !rating || !comment) {
      res.status(400).json({ success: false, error: 'Product ID, rating, and comment are required' });
      return;
    }

    if (rating < 1 || rating > 5) {
      res.status(400).json({ success: false, error: 'Rating must be between 1 and 5' });
      return;
    }

    const products = await db.select({ id: schema.products.id })
      .from(schema.products)
      .where(eq(schema.products.id, productId))
      .limit(1);

    if (products.length === 0) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }

    const existingReview = await db.select()
      .from(schema.reviews)
      .where(and(
        eq(schema.reviews.userId, req.user!.id),
        eq(schema.reviews.productId, productId)
      ))
      .limit(1);

    if (existingReview.length > 0) {
      res.status(400).json({ success: false, error: 'You have already reviewed this product' });
      return;
    }

    const purchasedOrders = await db.select()
      .from(schema.orders)
      .leftJoin(schema.orderItems, eq(schema.orders.id, schema.orderItems.orderId))
      .where(and(
        eq(schema.orders.userId, req.user!.id),
        eq(schema.orderItems.productId, productId),
        eq(schema.orders.status, 'delivered')
      ))
      .limit(1);

    const verified = purchasedOrders.length > 0;

    const result = await db.insert(schema.reviews).values({
      userId: req.user!.id,
      productId,
      rating,
      title: title || null,
      comment,
      verified
    }).returning();

    res.status(201).json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ success: false, error: 'Failed to create review' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { rating, title, comment } = req.body;

    const reviews = await db.select()
      .from(schema.reviews)
      .where(and(
        eq(schema.reviews.id, parseInt(id)),
        eq(schema.reviews.userId, req.user!.id)
      ))
      .limit(1);

    if (reviews.length === 0) {
      res.status(404).json({ success: false, error: 'Review not found' });
      return;
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        res.status(400).json({ success: false, error: 'Rating must be between 1 and 5' });
        return;
      }
      updateData.rating = rating;
    }
    if (title !== undefined) updateData.title = title;
    if (comment !== undefined) updateData.comment = comment;

    const result = await db.update(schema.reviews)
      .set(updateData)
      .where(eq(schema.reviews.id, parseInt(id)))
      .returning();

    res.json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ success: false, error: 'Failed to update review' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const whereClause = req.user!.role === 'admin'
      ? eq(schema.reviews.id, parseInt(id))
      : and(eq(schema.reviews.id, parseInt(id)), eq(schema.reviews.userId, req.user!.id));

    await db.delete(schema.reviews).where(whereClause);

    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete review' });
  }
});

export default router;
