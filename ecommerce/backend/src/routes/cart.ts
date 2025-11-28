import { Router, Response } from 'express';
import { db, schema } from '../db/index.js';
import { eq, and } from 'drizzle-orm';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

router.get('/', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const items = await db.select({
      id: schema.cartItems.id,
      quantity: schema.cartItems.quantity,
      productId: schema.cartItems.productId,
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
    .from(schema.cartItems)
    .leftJoin(schema.products, eq(schema.cartItems.productId, schema.products.id))
    .where(eq(schema.cartItems.userId, req.user!.id));

    const cartItems = items.map(item => ({
      ...item,
      product: item.product
    }));

    const subtotal = cartItems.reduce((sum, item) => {
      const price = parseFloat(item.product?.price || '0');
      return sum + (price * item.quantity);
    }, 0);

    res.json({
      success: true,
      data: {
        items: cartItems,
        subtotal,
        itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch cart' });
  }
});

router.post('/add', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      res.status(400).json({ success: false, error: 'Product ID is required' });
      return;
    }

    const products = await db.select()
      .from(schema.products)
      .where(and(eq(schema.products.id, productId), eq(schema.products.active, true)))
      .limit(1);

    if (products.length === 0) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }

    const product = products[0];

    if (product.stock < quantity) {
      res.status(400).json({ success: false, error: 'Insufficient stock' });
      return;
    }

    const existing = await db.select()
      .from(schema.cartItems)
      .where(and(
        eq(schema.cartItems.userId, req.user!.id),
        eq(schema.cartItems.productId, productId)
      ))
      .limit(1);

    if (existing.length > 0) {
      const newQuantity = existing[0].quantity + quantity;
      if (newQuantity > product.stock) {
        res.status(400).json({ success: false, error: 'Insufficient stock' });
        return;
      }

      await db.update(schema.cartItems)
        .set({ quantity: newQuantity, updatedAt: new Date() })
        .where(eq(schema.cartItems.id, existing[0].id));
    } else {
      await db.insert(schema.cartItems).values({
        userId: req.user!.id,
        productId,
        quantity
      });
    }

    res.json({ success: true, message: 'Added to cart' });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, error: 'Failed to add to cart' });
  }
});

router.put('/:itemId', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      res.status(400).json({ success: false, error: 'Invalid quantity' });
      return;
    }

    const items = await db.select()
      .from(schema.cartItems)
      .where(and(
        eq(schema.cartItems.id, parseInt(itemId)),
        eq(schema.cartItems.userId, req.user!.id)
      ))
      .limit(1);

    if (items.length === 0) {
      res.status(404).json({ success: false, error: 'Cart item not found' });
      return;
    }

    const products = await db.select({ stock: schema.products.stock })
      .from(schema.products)
      .where(eq(schema.products.id, items[0].productId))
      .limit(1);

    if (products.length > 0 && quantity > products[0].stock) {
      res.status(400).json({ success: false, error: 'Insufficient stock' });
      return;
    }

    await db.update(schema.cartItems)
      .set({ quantity, updatedAt: new Date() })
      .where(eq(schema.cartItems.id, parseInt(itemId)));

    res.json({ success: true, message: 'Cart updated' });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ success: false, error: 'Failed to update cart' });
  }
});

router.delete('/:itemId', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { itemId } = req.params;

    await db.delete(schema.cartItems)
      .where(and(
        eq(schema.cartItems.id, parseInt(itemId)),
        eq(schema.cartItems.userId, req.user!.id)
      ));

    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ success: false, error: 'Failed to remove from cart' });
  }
});

router.delete('/', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    await db.delete(schema.cartItems)
      .where(eq(schema.cartItems.userId, req.user!.id));

    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ success: false, error: 'Failed to clear cart' });
  }
});

export default router;
