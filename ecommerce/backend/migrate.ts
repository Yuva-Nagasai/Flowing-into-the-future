import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './src/db/schema.js';
import { sql } from 'drizzle-orm';

const { Pool } = pg;

async function migrate() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
  }
  
  console.log('Connecting to database...');
  
  const pool = new Pool({
    connectionString
  });
  
  const db = drizzle(pool, { schema });
  
  try {
    console.log('Creating enums...');
    
    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE product_category AS ENUM ('electronics', 'clothing', 'home', 'books', 'sports', 'beauty', 'toys', 'food', 'other');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    
    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    
    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    
    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE user_role AS ENUM ('user', 'admin');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    
    console.log('Creating tables...');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ecommerce_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role user_role DEFAULT 'user' NOT NULL,
        phone VARCHAR(50),
        avatar TEXT,
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
        category product_category NOT NULL,
        images JSON DEFAULT '[]',
        thumbnail TEXT,
        stock INTEGER DEFAULT 0 NOT NULL,
        sku VARCHAR(100),
        featured BOOLEAN DEFAULT FALSE NOT NULL,
        active BOOLEAN DEFAULT TRUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES ecommerce_users(id) ON DELETE CASCADE NOT NULL,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE NOT NULL,
        quantity INTEGER DEFAULT 1 NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES ecommerce_users(id) ON DELETE SET NULL,
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
        notes TEXT,
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
      CREATE TABLE IF NOT EXISTS wishlist_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES ecommerce_users(id) ON DELETE CASCADE NOT NULL,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES ecommerce_users(id) ON DELETE CASCADE NOT NULL,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE NOT NULL,
        rating INTEGER NOT NULL,
        title VARCHAR(255),
        comment TEXT NOT NULL,
        verified BOOLEAN DEFAULT FALSE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    
    console.log('All tables created successfully!');
    
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('Tables in database:', tables.rows.map(r => r.table_name));
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
