import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db, schema } from '../db/index.js';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'ecommerce-jwt-secret-key';

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const generateToken = (user: AuthUser): string => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token: string): AuthUser | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser;
  } catch {
    return null;
  }
};

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : req.session?.token;

    if (!token) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }

    if (db) {
      const user = await db.query.users.findFirst({
        where: eq(schema.users.id, decoded.id),
      });

      if (!user || !user.isActive) {
        return res.status(401).json({ success: false, error: 'User not found or inactive' });
      }
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ success: false, error: 'Authentication failed' });
  }
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : req.session?.token;

    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        req.user = decoded;
      }
    }

    next();
  } catch (error) {
    next();
  }
};

export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin access required' });
  }

  next();
};

export const requireVerifiedPurchase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || !db) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }

  const productId = parseInt(req.params.productId || req.body.productId);
  if (!productId) {
    return res.status(400).json({ success: false, error: 'Product ID required' });
  }

  const order = await db.query.orders.findFirst({
    where: eq(schema.orders.userId, req.user.id),
    with: {
      items: true,
    },
  });

  const hasPurchased = order?.items.some(
    (item: { productId: number | null }) => item.productId === productId
  );

  if (!hasPurchased) {
    return res.status(403).json({
      success: false,
      error: 'You must purchase this product before reviewing',
    });
  }

  next();
};
