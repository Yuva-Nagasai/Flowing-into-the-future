import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { z } from 'zod';
import { db, schema } from '../db/index.js';
import { eq } from 'drizzle-orm';
import { authenticate } from '../middleware/auth.js';
import { generateOrderNumber } from '../utils/helpers.js';

const router = Router();

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

const checkoutSchema = z.object({
  items: z.array(z.object({
    productId: z.number(),
    quantity: z.number().min(1),
  })),
  shippingAddress: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    street: z.string(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }),
  billingAddress: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    street: z.string(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }).optional(),
  paymentMethod: z.enum(['stripe', 'razorpay']),
  couponCode: z.string().optional(),
});

router.post('/create-stripe-session', authenticate, async (req: Request, res: Response) => {
  try {
    if (!stripe) {
      return res.status(503).json({ success: false, error: 'Stripe is not configured' });
    }

    if (!db || !req.user) {
      return res.status(503).json({ success: false, error: 'Service not available' });
    }

    const data = checkoutSchema.parse(req.body);

    const products = await Promise.all(
      data.items.map(async (item) => {
        const product = await db.query.products.findFirst({
          where: eq(schema.products.id, item.productId),
        });
        return { ...product, quantity: item.quantity };
      })
    );

    const validProducts = products.filter((p) => p && p.isActive);

    if (validProducts.length === 0) {
      return res.status(400).json({ success: false, error: 'No valid products in cart' });
    }

    const subtotal = validProducts.reduce((sum, p) => {
      return sum + parseFloat(p!.price as string) * p.quantity;
    }, 0);

    const tax = subtotal * 0.1;
    const shipping = subtotal > 100 ? 0 : 10;
    const total = subtotal + tax + shipping;

    const orderNumber = generateOrderNumber();

    const [order] = await db
      .insert(schema.orders)
      .values({
        userId: req.user.id,
        orderNumber,
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: 'stripe',
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        shipping: shipping.toFixed(2),
        total: total.toFixed(2),
        shippingAddress: data.shippingAddress,
        billingAddress: data.billingAddress || data.shippingAddress,
      })
      .returning();

    await Promise.all(
      validProducts.map((p) =>
        db.insert(schema.orderItems).values({
          orderId: order.id,
          productId: p!.id,
          productName: p!.name,
          productImage: p!.thumbnail,
          price: p!.price as string,
          quantity: p.quantity,
          total: (parseFloat(p!.price as string) * p.quantity).toFixed(2),
        })
      )
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: validProducts.map((p) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: p!.name,
            images: p!.thumbnail ? [p!.thumbnail] : [],
          },
          unit_amount: Math.round(parseFloat(p!.price as string) * 100),
        },
        quantity: p.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5000'}/shop/order-success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5000'}/shop/cart`,
      metadata: {
        orderId: order.id.toString(),
        orderNumber,
      },
    });

    await db
      .update(schema.orders)
      .set({ paymentId: session.id })
      .where(eq(schema.orders.id, order.id));

    res.json({
      success: true,
      data: {
        sessionId: session.id,
        sessionUrl: session.url,
        orderId: order.id,
        orderNumber,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.errors });
    }
    console.error('Stripe session error:', error);
    res.status(500).json({ success: false, error: 'Failed to create payment session' });
  }
});

router.post('/create-razorpay-order', authenticate, async (req: Request, res: Response) => {
  try {
    if (!razorpay) {
      return res.status(503).json({ success: false, error: 'Razorpay is not configured' });
    }

    if (!db || !req.user) {
      return res.status(503).json({ success: false, error: 'Service not available' });
    }

    const data = checkoutSchema.parse(req.body);

    const products = await Promise.all(
      data.items.map(async (item) => {
        const product = await db.query.products.findFirst({
          where: eq(schema.products.id, item.productId),
        });
        return { ...product, quantity: item.quantity };
      })
    );

    const validProducts = products.filter((p) => p && p.isActive);

    if (validProducts.length === 0) {
      return res.status(400).json({ success: false, error: 'No valid products in cart' });
    }

    const subtotal = validProducts.reduce((sum, p) => {
      return sum + parseFloat(p!.price as string) * p.quantity;
    }, 0);

    const tax = subtotal * 0.1;
    const shipping = subtotal > 100 ? 0 : 10;
    const total = subtotal + tax + shipping;

    const orderNumber = generateOrderNumber();

    const [order] = await db
      .insert(schema.orders)
      .values({
        userId: req.user.id,
        orderNumber,
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: 'razorpay',
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        shipping: shipping.toFixed(2),
        total: total.toFixed(2),
        shippingAddress: data.shippingAddress,
        billingAddress: data.billingAddress || data.shippingAddress,
      })
      .returning();

    await Promise.all(
      validProducts.map((p) =>
        db.insert(schema.orderItems).values({
          orderId: order.id,
          productId: p!.id,
          productName: p!.name,
          productImage: p!.thumbnail,
          price: p!.price as string,
          quantity: p.quantity,
          total: (parseFloat(p!.price as string) * p.quantity).toFixed(2),
        })
      )
    );

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100),
      currency: 'INR',
      receipt: orderNumber,
      notes: {
        orderId: order.id.toString(),
        orderNumber,
      },
    });

    await db
      .update(schema.orders)
      .set({ paymentId: razorpayOrder.id })
      .where(eq(schema.orders.id, order.id));

    res.json({
      success: true,
      data: {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        orderId: order.id,
        orderNumber,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.errors });
    }
    console.error('Razorpay order error:', error);
    res.status(500).json({ success: false, error: 'Failed to create Razorpay order' });
  }
});

router.post('/verify-stripe-payment', async (req: Request, res: Response) => {
  try {
    if (!stripe) {
      return res.status(503).json({ success: false, error: 'Stripe is not configured' });
    }

    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const { sessionId, orderId } = req.body;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      await db
        .update(schema.orders)
        .set({
          paymentStatus: 'completed',
          status: 'processing',
          updatedAt: new Date(),
        })
        .where(eq(schema.orders.id, parseInt(orderId)));

      const order = await db.query.orders.findFirst({
        where: eq(schema.orders.id, parseInt(orderId)),
      });

      if (order) {
        await db.insert(schema.payments).values({
          orderId: order.id,
          userId: order.userId,
          provider: 'stripe',
          providerPaymentId: session.payment_intent as string,
          providerOrderId: session.id,
          amount: order.total,
          currency: 'USD',
          status: 'completed',
          metadata: { session },
        });
      }

      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, error: 'Payment not completed' });
    }
  } catch (error) {
    console.error('Stripe verification error:', error);
    res.status(500).json({ success: false, error: 'Failed to verify payment' });
  }
});

router.post('/verify-razorpay-payment', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, error: 'Invalid payment signature' });
    }

    await db
      .update(schema.orders)
      .set({
        paymentStatus: 'completed',
        status: 'processing',
        paymentId: razorpay_payment_id,
        updatedAt: new Date(),
      })
      .where(eq(schema.orders.id, parseInt(orderId)));

    const order = await db.query.orders.findFirst({
      where: eq(schema.orders.id, parseInt(orderId)),
    });

    if (order) {
      await db.insert(schema.payments).values({
        orderId: order.id,
        userId: order.userId,
        provider: 'razorpay',
        providerPaymentId: razorpay_payment_id,
        providerOrderId: razorpay_order_id,
        amount: order.total,
        currency: 'INR',
        status: 'completed',
        metadata: { razorpay_order_id, razorpay_payment_id },
      });
    }

    res.json({ success: true, message: 'Payment verified successfully' });
  } catch (error) {
    console.error('Razorpay verification error:', error);
    res.status(500).json({ success: false, error: 'Failed to verify payment' });
  }
});

router.post('/webhook/stripe', async (req: Request, res: Response) => {
  try {
    if (!stripe) {
      return res.status(503).json({ success: false, error: 'Stripe is not configured' });
    }

    const sig = req.headers['stripe-signature'] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    if (endpointSecret) {
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
    } else {
      event = req.body;
    }

    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const orderId = session.metadata?.orderId;

        if (orderId) {
          await db
            .update(schema.orders)
            .set({
              paymentStatus: 'completed',
              status: 'processing',
              updatedAt: new Date(),
            })
            .where(eq(schema.orders.id, parseInt(orderId)));
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        console.log('Payment failed:', paymentIntent.id);
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ success: false, error: 'Webhook processing failed' });
  }
});

router.post('/refund', authenticate, async (req: Request, res: Response) => {
  try {
    if (!stripe) {
      return res.status(503).json({ success: false, error: 'Stripe is not configured' });
    }

    if (!db || !req.user) {
      return res.status(503).json({ success: false, error: 'Service not available' });
    }

    const { orderId, reason } = req.body;

    const order = await db.query.orders.findFirst({
      where: eq(schema.orders.id, parseInt(orderId)),
    });

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    if (order.paymentMethod === 'stripe' && order.paymentId) {
      const session = await stripe.checkout.sessions.retrieve(order.paymentId);

      if (session.payment_intent) {
        const refund = await stripe.refunds.create({
          payment_intent: session.payment_intent as string,
          reason: 'requested_by_customer',
        });

        await db
          .update(schema.orders)
          .set({
            paymentStatus: 'refunded',
            status: 'refunded',
            notes: reason,
            updatedAt: new Date(),
          })
          .where(eq(schema.orders.id, order.id));

        res.json({ success: true, data: { refundId: refund.id } });
      }
    } else {
      res.status(400).json({ success: false, error: 'Refund not supported for this payment method' });
    }
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ success: false, error: 'Failed to process refund' });
  }
});

export default router;
