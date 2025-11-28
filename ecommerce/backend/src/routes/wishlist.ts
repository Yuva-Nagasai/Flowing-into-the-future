import { Router, Response } from 'express';
import { db, schema } from '../db/index.js';
import { eq, and } from 'drizzle-orm';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

router.get('/', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const items = await db.select({
      id: schema.wishlistItems.id,
      productId: schema.wishlistItems.productId,
      createdAt: schema.wishlistItems.createdAt,
      product: {
        id: schema.products.id,
        name: schema.products.name,
        slug: schema.products.slug,
        price: schema.products.price,
        comparePrice: schema.products.comparePrice,
        thumbnail: schema.products.thumbnail,
        stock: schema.products.stock
      }
    })
    .from(schema.wishlistItems)
    .leftJoin(schema.products, eq(schema.wishlistItems.productId, schema.products.id))
    .where(eq(schema.wishlistItems.userId, req.user!.id));

    res.json({ success: true, data: items });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch wishlist' });
  }
});

router.post('/add', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { productId } = req.body;

    if (!productId) {
      res.status(400).json({ success: false, error: 'Product ID is required' });
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

    const existing = await db.select()
      .from(schema.wishlistItems)
      .where(and(
        eq(schema.wishlistItems.userId, req.user!.id),
        eq(schema.wishlistItems.productId, productId)
      ))
      .limit(1);

    if (existing.length > 0) {
      res.json({ success: true, message: 'Already in wishlist' });
      return;
    }

    await db.insert(schema.wishlistItems).values({
      userId: req.user!.id,
      productId
    });

    res.json({ success: true, message: 'Added to wishlist' });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ success: false, error: 'Failed to add to wishlist' });
  }
});

router.delete('/:productId', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;

    await db.delete(schema.wishlistItems)
      .where(and(
        eq(schema.wishlistItems.userId, req.user!.id),
        eq(schema.wishlistItems.productId, parseInt(productId))
      ));

    res.json({ success: true, message: 'Removed from wishlist' });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ success: false, error: 'Failed to remove from wishlist' });
  }
});

export default router;
