import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db, schema } from '../db/index.js';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'ecommerce-secret-key';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
    role: 'user' | 'admin';
  };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ success: false, error: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

    const users = await db
      .select({
        id: schema.ecommerceUsers.id,
        email: schema.ecommerceUsers.email,
        name: schema.ecommerceUsers.name,
        role: schema.ecommerceUsers.role
      })
      .from(schema.ecommerceUsers)
      .where(eq(schema.ecommerceUsers.id, decoded.userId))
      .limit(1);

    if (users.length === 0) {
      res.status(401).json({ success: false, error: 'User not found' });
      return;
    }

    req.user = users[0];
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

export const adminMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ success: false, error: 'Admin access required' });
    return;
  }
  next();
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

    const users = await db
      .select({
        id: schema.ecommerceUsers.id,
        email: schema.ecommerceUsers.email,
        name: schema.ecommerceUsers.name,
        role: schema.ecommerceUsers.role
      })
      .from(schema.ecommerceUsers)
      .where(eq(schema.ecommerceUsers.id, decoded.userId))
      .limit(1);

    if (users.length > 0) {
      req.user = users[0];
    }
    next();
  } catch {
    next();
  }
};

export const generateToken = (userId: number): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};
