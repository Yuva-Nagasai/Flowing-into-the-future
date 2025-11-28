import { Router, Response } from 'express';
import { db, schema } from '../db/index.js';
import { eq, desc, and, sql } from 'drizzle-orm';
import { authMiddleware, adminMiddleware, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

router.get('/', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, parseInt(req.query.limit as string) || 10);
    const offset = (page - 1) * limit;

    const whereClause = req.user!.role === 'admin' 
      ? undefined 
      : eq(schema.orders.userId, req.user!.id);

    const [orders, countResult] = await Promise.all([
      db.select()
        .from(schema.orders)
        .where(whereClause)
        .orderBy(desc(schema.orders.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: sql<number>`count(*)` })
        .from(schema.orders)
        .where(whereClause)
    ]);

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await db.select()
          .from(schema.orderItems)
          .where(eq(schema.orderItems.orderId, order.id));
        return { ...order, items };
      })
    );

    const total = Number(countResult[0]?.count || 0);

    res.json({
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
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
});

router.get('/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const whereClause = req.user!.role === 'admin'
      ? eq(schema.orders.id, parseInt(id))
      : and(eq(schema.orders.id, parseInt(id)), eq(schema.orders.userId, req.user!.id));

    const orders = await db.select()
      .from(schema.orders)
      .where(whereClause)
      .limit(1);

    if (orders.length === 0) {
      res.status(404).json({ success: false, error: 'Order not found' });
      return;
    }

    const order = orders[0];
    const items = await db.select()
      .from(schema.orderItems)
      .where(eq(schema.orderItems.orderId, order.id));

    res.json({ success: true, data: { ...order, items } });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch order' });
  }
});

router.post('/', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { shippingAddress, paymentMethod, notes } = req.body;

    if (!shippingAddress || !paymentMethod) {
      res.status(400).json({ success: false, error: 'Shipping address and payment method are required' });
      return;
    }

    const cartItems = await db.select({
      id: schema.cartItems.id,
      quantity: schema.cartItems.quantity,
      product: {
        id: schema.products.id,
        name: schema.products.name,
        price: schema.products.price,
        thumbnail: schema.products.thumbnail,
        stock: schema.products.stock
      }
    })
    .from(schema.cartItems)
    .leftJoin(schema.products, eq(schema.cartItems.productId, schema.products.id))
    .where(eq(schema.cartItems.userId, req.user!.id));

    if (cartItems.length === 0) {
      res.status(400).json({ success: false, error: 'Cart is empty' });
      return;
    }

    for (const item of cartItems) {
      if (!item.product) {
        res.status(400).json({ success: false, error: 'Product not found' });
        return;
      }
      if (item.product.stock < item.quantity) {
        res.status(400).json({ success: false, error: `Insufficient stock for ${item.product.name}` });
        return;
      }
    }

    const subtotal = cartItems.reduce((sum, item) => {
      const price = parseFloat(item.product?.price || '0');
      return sum + (price * item.quantity);
    }, 0);

    const tax = subtotal * 0.1;
    const shipping = subtotal > 100 ? 0 : 10;
    const total = subtotal + tax + shipping;

    const orderResult = await db.insert(schema.orders).values({
      userId: req.user!.id,
      orderNumber: generateOrderNumber(),
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod,
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      shipping: shipping.toFixed(2),
      discount: '0',
      total: total.toFixed(2),
      shippingAddress,
      notes: notes || null
    }).returning();

    const order = orderResult[0];

    for (const item of cartItems) {
      const itemPrice = parseFloat(item.product!.price);
      const itemTotal = itemPrice * item.quantity;

      await db.insert(schema.orderItems).values({
        orderId: order.id,
        productId: item.product!.id,
        productName: item.product!.name,
        productImage: item.product!.thumbnail || null,
        price: itemPrice.toFixed(2),
        quantity: item.quantity,
        total: itemTotal.toFixed(2)
      });

      await db.update(schema.products)
        .set({ 
          stock: sql`${schema.products.stock} - ${item.quantity}`,
          updatedAt: new Date()
        })
        .where(eq(schema.products.id, item.product!.id));
    }

    await db.delete(schema.cartItems)
      .where(eq(schema.cartItems.userId, req.user!.id));

    const items = await db.select()
      .from(schema.orderItems)
      .where(eq(schema.orderItems.orderId, order.id));

    res.status(201).json({ success: true, data: { ...order, items } });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, error: 'Failed to create order' });
  }
});

router.put('/:id/status', authMiddleware, adminMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const result = await db.update(schema.orders)
      .set(updateData)
      .where(eq(schema.orders.id, parseInt(id)))
      .returning();

    if (result.length === 0) {
      res.status(404).json({ success: false, error: 'Order not found' });
      return;
    }

    res.json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ success: false, error: 'Failed to update order' });
  }
});

router.post('/:id/cancel', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const whereClause = req.user!.role === 'admin'
      ? eq(schema.orders.id, parseInt(id))
      : and(eq(schema.orders.id, parseInt(id)), eq(schema.orders.userId, req.user!.id));

    const orders = await db.select()
      .from(schema.orders)
      .where(whereClause)
      .limit(1);

    if (orders.length === 0) {
      res.status(404).json({ success: false, error: 'Order not found' });
      return;
    }

    const order = orders[0];

    if (!['pending', 'processing'].includes(order.status)) {
      res.status(400).json({ success: false, error: 'Cannot cancel this order' });
      return;
    }

    const items = await db.select()
      .from(schema.orderItems)
      .where(eq(schema.orderItems.orderId, order.id));

    for (const item of items) {
      if (item.productId) {
        await db.update(schema.products)
          .set({ 
            stock: sql`${schema.products.stock} + ${item.quantity}`,
            updatedAt: new Date()
          })
          .where(eq(schema.products.id, item.productId));
      }
    }

    const result = await db.update(schema.orders)
      .set({ status: 'cancelled', updatedAt: new Date() })
      .where(eq(schema.orders.id, order.id))
      .returning();

    res.json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ success: false, error: 'Failed to cancel order' });
  }
});

export default router;
