import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import path from 'path';
import bcrypt from 'bcryptjs';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';

import authRoutes from '../api/authRoutes.js';
import adminRoutes from '../api/adminRoutes.js';
import paymentRoutes from '../api/paymentRoutes.js';
import routes from '../api/routes.js';
import uploadRoutes from '../api/upload.js';
import sitemapRoutes from '../api/sitemap.js';
import storageRoutes from '../api/storage.js';
import * as schema from '../db/schema.js';

neonConfig.webSocketConstructor = ws;

declare module 'express-session' {
  interface SessionData {
    token?: string;
  }
}

async function runMigrations() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.log('DATABASE_URL not set, skipping migrations');
    return;
  }

  const pool = new Pool({ connectionString });

  try {
    console.log('Running database migrations...');

    await pool.query(`DO $$ BEGIN CREATE TYPE user_role AS ENUM ('user', 'admin'); EXCEPTION WHEN duplicate_object THEN null; END $$;`);
    await pool.query(`DO $$ BEGIN CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'); EXCEPTION WHEN duplicate_object THEN null; END $$;`);
    await pool.query(`DO $$ BEGIN CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded'); EXCEPTION WHEN duplicate_object THEN null; END $$;`);
    await pool.query(`DO $$ BEGIN CREATE TYPE payment_provider AS ENUM ('stripe', 'razorpay'); EXCEPTION WHEN duplicate_object THEN null; END $$;`);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role user_role DEFAULT 'user' NOT NULL,
        phone VARCHAR(50),
        avatar TEXT,
        address JSON,
        email_verified BOOLEAN DEFAULT FALSE NOT NULL,
        is_active BOOLEAN DEFAULT TRUE NOT NULL,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        image TEXT,
        parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        is_active BOOLEAN DEFAULT TRUE NOT NULL,
        sort_order INTEGER DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT NOT NULL,
        short_description VARCHAR(500),
        price DECIMAL(10, 2) NOT NULL,
        compare_price DECIMAL(10, 2),
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        images JSON DEFAULT '[]',
        thumbnail TEXT,
        stock INTEGER DEFAULT 0 NOT NULL,
        sku VARCHAR(100),
        featured BOOLEAN DEFAULT FALSE NOT NULL,
        is_active BOOLEAN DEFAULT TRUE NOT NULL,
        tags JSON DEFAULT '[]',
        metadata JSON,
        average_rating DECIMAL(3, 2) DEFAULT 0,
        total_reviews INTEGER DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS deals (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        discount_type VARCHAR(20) NOT NULL,
        discount_value DECIMAL(10, 2) NOT NULL,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        is_active BOOLEAN DEFAULT TRUE NOT NULL,
        banner_image TEXT,
        priority INTEGER DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS announcements (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'info' NOT NULL,
        is_active BOOLEAN DEFAULT TRUE NOT NULL,
        start_date TIMESTAMP,
        end_date TIMESTAMP,
        target_url TEXT,
        priority INTEGER DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE NOT NULL,
        quantity INTEGER DEFAULT 1 NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS wishlist (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        status order_status DEFAULT 'pending' NOT NULL,
        payment_status payment_status DEFAULT 'pending' NOT NULL,
        payment_method VARCHAR(50),
        payment_id VARCHAR(255),
        subtotal DECIMAL(10, 2) NOT NULL,
        tax DECIMAL(10, 2) DEFAULT 0 NOT NULL,
        shipping DECIMAL(10, 2) DEFAULT 0 NOT NULL,
        discount DECIMAL(10, 2) DEFAULT 0 NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        shipping_address JSON NOT NULL,
        billing_address JSON,
        notes TEXT,
        tracking_number VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
        product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
        product_name VARCHAR(255) NOT NULL,
        product_image TEXT,
        price DECIMAL(10, 2) NOT NULL,
        quantity INTEGER NOT NULL,
        total DECIMAL(10, 2) NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        provider payment_provider NOT NULL,
        provider_payment_id VARCHAR(255) NOT NULL,
        provider_order_id VARCHAR(255),
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'USD' NOT NULL,
        status payment_status DEFAULT 'pending' NOT NULL,
        metadata JSON,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE NOT NULL,
        order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
        rating INTEGER NOT NULL,
        title VARCHAR(255),
        comment TEXT NOT NULL,
        verified BOOLEAN DEFAULT FALSE NOT NULL,
        is_approved BOOLEAN DEFAULT FALSE NOT NULL,
        helpful_count INTEGER DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        avatar TEXT,
        company VARCHAR(255),
        role VARCHAR(255),
        content TEXT NOT NULL,
        rating INTEGER DEFAULT 5 NOT NULL,
        is_active BOOLEAN DEFAULT TRUE NOT NULL,
        featured BOOLEAN DEFAULT FALSE NOT NULL,
        sort_order INTEGER DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS login_events (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        success BOOLEAN DEFAULT TRUE NOT NULL,
        failure_reason VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE NOT NULL,
        subscribed_at TIMESTAMP DEFAULT NOW() NOT NULL,
        unsubscribed_at TIMESTAMP,
        source VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS product_requests (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        budget VARCHAR(100),
        status VARCHAR(50) DEFAULT 'pending' NOT NULL,
        admin_notes TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    console.log('Database migrations completed successfully!');
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await pool.end();
  }
}

const app = express();
const PORT = process.env.DIGITAL_HUB_ECOMMERCE_PORT || 3003;

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}));

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(process.cwd(), 'digital-hub/ecommerce/backend/uploads')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'digital-hub-ecommerce-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, error: 'Too many requests, please try again later' },
});

app.use('/api', limiter);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Digital Hub Ecommerce API is running', 
    version: '1.0.0',
    database: !!process.env.DATABASE_URL ? 'connected' : 'not configured'
  });
});

app.post('/api/seed', async (req, res) => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return res.status(503).json({ success: false, error: 'Database not configured' });
  }

  const pool = new Pool({ connectionString });
  const db = drizzle(pool, { schema });

  try {
    console.log('Starting database seed...');

    const adminPassword = await bcrypt.hash('admin123', 12);
    const userPassword = await bcrypt.hash('user123', 12);

    const existingAdmin = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, 'admin@nanoflows.com'),
    });

    if (!existingAdmin) {
      await db.insert(schema.users).values({
        email: 'admin@nanoflows.com',
        name: 'Admin User',
        password: adminPassword,
        role: 'admin',
        phone: '+1234567890',
        emailVerified: true,
        isActive: true,
      });
    }

    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, 'user@nanoflows.com'),
    });

    if (!existingUser) {
      await db.insert(schema.users).values({
        email: 'user@nanoflows.com',
        name: 'Demo User',
        password: userPassword,
        role: 'user',
        phone: '+0987654321',
        emailVerified: true,
        isActive: true,
      });
    }

    const categories = [
      { name: 'Electronics', slug: 'electronics', description: 'Gadgets and devices', sortOrder: 1 },
      { name: 'Clothing', slug: 'clothing', description: 'Fashion apparel', sortOrder: 2 },
      { name: 'Home & Garden', slug: 'home-garden', description: 'Home decor', sortOrder: 3 },
      { name: 'Books', slug: 'books', description: 'Physical and digital books', sortOrder: 4 },
      { name: 'Sports', slug: 'sports', description: 'Sports equipment', sortOrder: 5 },
      { name: 'Beauty', slug: 'beauty', description: 'Beauty products', sortOrder: 6 },
      { name: 'Toys', slug: 'toys', description: 'Toys and games', sortOrder: 7 },
      { name: 'Food', slug: 'food', description: 'Gourmet food', sortOrder: 8 },
    ];

    const insertedCategories: Record<string, number> = {};

    for (const cat of categories) {
      const existing = await db.query.categories.findFirst({
        where: (categories, { eq }) => eq(categories.slug, cat.slug),
      });

      if (!existing) {
        const [inserted] = await db.insert(schema.categories).values(cat).returning();
        insertedCategories[cat.slug] = inserted.id;
      } else {
        insertedCategories[cat.slug] = existing.id;
      }
    }

    const products = [
      { name: 'Wireless Headphones', slug: 'wireless-headphones', description: 'Premium wireless noise-canceling headphones', price: '299.99', categoryId: insertedCategories['electronics'], stock: 50, featured: true, thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
      { name: 'Smart Watch Pro', slug: 'smart-watch-pro', description: 'Advanced fitness smartwatch with GPS', price: '249.99', categoryId: insertedCategories['electronics'], stock: 75, featured: true, thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' },
      { name: 'Organic Cotton T-Shirt', slug: 'organic-cotton-tshirt', description: 'Sustainable organic cotton tee', price: '29.99', categoryId: insertedCategories['clothing'], stock: 300, featured: true, thumbnail: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' },
      { name: 'Minimalist Desk Lamp', slug: 'minimalist-desk-lamp', description: 'Modern LED desk lamp', price: '59.99', categoryId: insertedCategories['home-garden'], stock: 150, featured: true, thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
      { name: 'Bestselling Novel Collection', slug: 'bestselling-novels', description: 'Collection of 5 bestsellers', price: '69.99', categoryId: insertedCategories['books'], stock: 80, featured: true, thumbnail: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400' },
      { name: 'Professional Yoga Mat', slug: 'professional-yoga-mat', description: 'Premium yoga mat with alignment guides', price: '49.99', categoryId: insertedCategories['sports'], stock: 200, featured: true, thumbnail: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400' },
    ];

    for (const product of products) {
      const existing = await db.query.products.findFirst({
        where: (products, { eq }) => eq(products.slug, product.slug),
      });

      if (!existing) {
        await db.insert(schema.products).values(product);
      }
    }

    await pool.end();
    res.json({ 
      success: true, 
      message: 'Database seeded successfully',
      credentials: {
        admin: 'admin@nanoflows.com / admin123',
        user: 'user@nanoflows.com / user123'
      }
    });
  } catch (error) {
    console.error('Seed error:', error);
    await pool.end();
    res.status(500).json({ success: false, error: 'Seed failed' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api', routes);
app.use('/', sitemapRoutes);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

runMigrations().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Digital Hub Ecommerce API running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
});
