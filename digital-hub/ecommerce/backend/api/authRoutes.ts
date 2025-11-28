import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { db, schema } from '../db/index.js';
import { eq, and } from 'drizzle-orm';
import { generateToken, authenticate, AuthUser } from '../middleware/auth.js';
import { generateToken as generateResetToken, getClientIp, validateEmail } from '../utils/helpers.js';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const resetPasswordSchema = z.object({
  email: z.string().email(),
});

const newPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6),
});

router.post('/register', async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);

    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(schema.users.email, data.email),
    });

    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const [newUser] = await db
      .insert(schema.users)
      .values({
        email: data.email,
        password: hashedPassword,
        name: data.name,
        phone: data.phone,
        role: 'user',
      })
      .returning();

    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    });

    await db.insert(schema.loginEvents).values({
      userId: newUser.id,
      ipAddress: getClientIp(req),
      userAgent: req.headers['user-agent'],
      success: true,
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
        token,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.errors });
    }
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);

    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const user = await db.query.users.findFirst({
      where: eq(schema.users.email, data.email),
    });

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);

    await db.insert(schema.loginEvents).values({
      userId: user.id,
      ipAddress: getClientIp(req),
      userAgent: req.headers['user-agent'],
      success: isValidPassword,
      failureReason: isValidPassword ? null : 'Invalid password',
    });

    if (!isValidPassword) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, error: 'Account is deactivated' });
    }

    await db
      .update(schema.users)
      .set({ lastLogin: new Date() })
      .where(eq(schema.users.id, user.id));

    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    req.session.token = token;

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          phone: user.phone,
        },
        token,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.errors });
    }
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

router.post('/logout', authenticate, async (req: Request, res: Response) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
      }
    });

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ success: false, error: 'Logout failed' });
  }
});

router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const data = resetPasswordSchema.parse(req.body);

    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const user = await db.query.users.findFirst({
      where: eq(schema.users.email, data.email),
    });

    if (!user) {
      return res.json({
        success: true,
        message: 'If your email exists, you will receive a reset link',
      });
    }

    const token = generateResetToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await db.insert(schema.passwordResetTokens).values({
      userId: user.id,
      token,
      expiresAt,
    });

    res.json({
      success: true,
      message: 'If your email exists, you will receive a reset link',
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.errors });
    }
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, error: 'Request failed' });
  }
});

router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const data = newPasswordSchema.parse(req.body);

    if (!db) {
      return res.status(503).json({ success: false, error: 'Database not available' });
    }

    const resetToken = await db.query.passwordResetTokens.findFirst({
      where: and(
        eq(schema.passwordResetTokens.token, data.token),
      ),
    });

    if (!resetToken || resetToken.usedAt || new Date() > resetToken.expiresAt) {
      return res.status(400).json({ success: false, error: 'Invalid or expired token' });
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    await db
      .update(schema.users)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(eq(schema.users.id, resetToken.userId));

    await db
      .update(schema.passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(eq(schema.passwordResetTokens.id, resetToken.id));

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.errors });
    }
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, error: 'Password reset failed' });
  }
});

router.get('/me', authenticate, async (req: Request, res: Response) => {
  try {
    if (!db || !req.user) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }

    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, req.user.id),
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        address: user.address,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, error: 'Failed to get user data' });
  }
});

router.put('/profile', authenticate, async (req: Request, res: Response) => {
  try {
    const { name, phone, avatar, address } = req.body;

    if (!db || !req.user) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }

    const [updatedUser] = await db
      .update(schema.users)
      .set({
        name: name || undefined,
        phone: phone || undefined,
        avatar: avatar || undefined,
        address: address || undefined,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, req.user.id))
      .returning();

    res.json({
      success: true,
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar,
        address: updatedUser.address,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, error: 'Profile update failed' });
  }
});

router.put('/change-password', authenticate, async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!db || !req.user) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    }

    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, req.user.id),
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await db
      .update(schema.users)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(eq(schema.users.id, req.user.id));

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, error: 'Password change failed' });
  }
});

export default router;
