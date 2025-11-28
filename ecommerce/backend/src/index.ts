import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import session from 'express-session';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import wishlistRoutes from './routes/wishlist.js';
import reviewRoutes from './routes/reviews.js';

const app = express();
const PORT = process.env.ECOMMERCE_PORT || 3002;

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false
}));

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'ecommerce-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: 'Too many requests, please try again later' }
});

app.use('/api/ecommerce', limiter);

app.get('/api/ecommerce/health', (req, res) => {
  res.json({ status: 'OK', message: 'Ecommerce API is running' });
});

app.use('/api/ecommerce/auth', authRoutes);
app.use('/api/ecommerce/products', productRoutes);
app.use('/api/ecommerce/cart', cartRoutes);
app.use('/api/ecommerce/orders', orderRoutes);
app.use('/api/ecommerce/wishlist', wishlistRoutes);
app.use('/api/ecommerce/reviews', reviewRoutes);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Ecommerce API running on port ${PORT}`);
});
