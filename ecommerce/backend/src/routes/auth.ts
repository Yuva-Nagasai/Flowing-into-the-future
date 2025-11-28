import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db, schema } from '../db/index.js';
import { eq } from 'drizzle-orm';
import { authMiddleware, generateToken, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name, password, phone } = req.body;

    if (!email || !name || !password) {
      res.status(400).json({ success: false, error: 'Email, name, and password are required' });
      return;
    }

    const existing = await db
      .select({ id: schema.ecommerceUsers.id })
      .from(schema.ecommerceUsers)
      .where(eq(schema.ecommerceUsers.email, email.toLowerCase()))
      .limit(1);

    if (existing.length > 0) {
      res.status(400).json({ success: false, error: 'Email already registered' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.insert(schema.ecommerceUsers).values({
      email: email.toLowerCase(),
      name,
      password: hashedPassword,
      phone: phone || null
    }).returning({
      id: schema.ecommerceUsers.id,
      email: schema.ecommerceUsers.email,
      name: schema.ecommerceUsers.name,
      role: schema.ecommerceUsers.role
    });

    const user = result[0];
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      data: { user, token }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email and password are required' });
      return;
    }

    const users = await db
      .select()
      .from(schema.ecommerceUsers)
      .where(eq(schema.ecommerceUsers.email, email.toLowerCase()))
      .limit(1);

    if (users.length === 0) {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
      return;
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
      return;
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

router.get('/me', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const users = await db
      .select({
        id: schema.ecommerceUsers.id,
        email: schema.ecommerceUsers.email,
        name: schema.ecommerceUsers.name,
        role: schema.ecommerceUsers.role,
        phone: schema.ecommerceUsers.phone,
        avatar: schema.ecommerceUsers.avatar,
        createdAt: schema.ecommerceUsers.createdAt
      })
      .from(schema.ecommerceUsers)
      .where(eq(schema.ecommerceUsers.id, req.user!.id))
      .limit(1);

    if (users.length === 0) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    res.json({ success: true, data: users[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, error: 'Failed to get profile' });
  }
});

router.put('/profile', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, phone, avatar } = req.body;

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (avatar !== undefined) updateData.avatar = avatar;

    await db
      .update(schema.ecommerceUsers)
      .set(updateData)
      .where(eq(schema.ecommerceUsers.id, req.user!.id));

    const users = await db
      .select({
        id: schema.ecommerceUsers.id,
        email: schema.ecommerceUsers.email,
        name: schema.ecommerceUsers.name,
        role: schema.ecommerceUsers.role,
        phone: schema.ecommerceUsers.phone,
        avatar: schema.ecommerceUsers.avatar
      })
      .from(schema.ecommerceUsers)
      .where(eq(schema.ecommerceUsers.id, req.user!.id))
      .limit(1);

    res.json({ success: true, data: users[0] });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
});

export default router;
