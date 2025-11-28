import 'dotenv/config';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import bcrypt from 'bcryptjs';
import ws from 'ws';
import * as schema from './db/schema.js';

neonConfig.webSocketConstructor = ws;

const seedDatabase = async () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
  }

  const pool = new Pool({ connectionString });
  const db = drizzle(pool, { schema });

  console.log('Starting database seed...');

  try {
    const adminPassword = await bcrypt.hash('admin123', 12);
    const userPassword = await bcrypt.hash('user123', 12);

    console.log('Creating users...');

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
      console.log('Admin user created: admin@nanoflows.com / admin123');
    } else {
      console.log('Admin user already exists');
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
      console.log('Demo user created: user@nanoflows.com / user123');
    } else {
      console.log('Demo user already exists');
    }

    console.log('Creating categories...');

    const categories = [
      { name: 'Electronics', slug: 'electronics', description: 'Gadgets, devices, and electronic accessories', sortOrder: 1 },
      { name: 'Clothing', slug: 'clothing', description: 'Fashion apparel and accessories', sortOrder: 2 },
      { name: 'Home & Garden', slug: 'home-garden', description: 'Home decor, furniture, and garden supplies', sortOrder: 3 },
      { name: 'Books', slug: 'books', description: 'Physical and digital books', sortOrder: 4 },
      { name: 'Sports & Outdoors', slug: 'sports-outdoors', description: 'Sports equipment and outdoor gear', sortOrder: 5 },
      { name: 'Beauty & Health', slug: 'beauty-health', description: 'Beauty products and health supplements', sortOrder: 6 },
      { name: 'Toys & Games', slug: 'toys-games', description: 'Toys, games, and entertainment', sortOrder: 7 },
      { name: 'Food & Beverages', slug: 'food-beverages', description: 'Gourmet food and specialty beverages', sortOrder: 8 },
    ];

    const insertedCategories: Record<string, number> = {};

    for (const cat of categories) {
      const existing = await db.query.categories.findFirst({
        where: (categories, { eq }) => eq(categories.slug, cat.slug),
      });

      if (!existing) {
        const [inserted] = await db.insert(schema.categories).values(cat).returning();
        insertedCategories[cat.slug] = inserted.id;
        console.log(`Category created: ${cat.name}`);
      } else {
        insertedCategories[cat.slug] = existing.id;
        console.log(`Category exists: ${cat.name}`);
      }
    }

    console.log('Creating products...');

    const products = [
      {
        name: 'Wireless Noise-Canceling Headphones',
        slug: 'wireless-noise-canceling-headphones',
        description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio quality.',
        shortDescription: 'Premium ANC headphones with 30hr battery',
        price: '299.99',
        comparePrice: '349.99',
        categoryId: insertedCategories['electronics'],
        thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
        stock: 50,
        sku: 'ELEC-HP-001',
        featured: true,
        tags: ['headphones', 'wireless', 'noise-canceling'],
      },
      {
        name: 'Smart Fitness Watch Pro',
        slug: 'smart-fitness-watch-pro',
        description: 'Advanced fitness tracking smartwatch with heart rate monitor, GPS, sleep tracking, and 7-day battery life.',
        shortDescription: 'Fitness smartwatch with GPS & health tracking',
        price: '249.99',
        comparePrice: '299.99',
        categoryId: insertedCategories['electronics'],
        thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
        stock: 75,
        sku: 'ELEC-SW-002',
        featured: true,
        tags: ['smartwatch', 'fitness', 'health'],
      },
      {
        name: 'Portable Power Bank 20000mAh',
        slug: 'portable-power-bank-20000',
        description: 'High-capacity portable charger with fast charging support, dual USB ports, and LED indicator.',
        shortDescription: '20000mAh fast-charging power bank',
        price: '49.99',
        comparePrice: '69.99',
        categoryId: insertedCategories['electronics'],
        thumbnail: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400',
        images: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800'],
        stock: 200,
        sku: 'ELEC-PB-003',
        featured: false,
        tags: ['charger', 'portable', 'power bank'],
      },
      {
        name: 'Organic Cotton T-Shirt',
        slug: 'organic-cotton-tshirt',
        description: 'Comfortable and sustainable organic cotton t-shirt in various colors. Eco-friendly and soft on skin.',
        shortDescription: 'Sustainable organic cotton tee',
        price: '29.99',
        comparePrice: '39.99',
        categoryId: insertedCategories['clothing'],
        thumbnail: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
        stock: 300,
        sku: 'CLTH-TS-001',
        featured: true,
        tags: ['organic', 'cotton', 't-shirt', 'sustainable'],
      },
      {
        name: 'Vintage Denim Jacket',
        slug: 'vintage-denim-jacket',
        description: 'Classic vintage-style denim jacket with a modern fit. Perfect for layering in any season.',
        shortDescription: 'Classic vintage denim jacket',
        price: '89.99',
        comparePrice: '119.99',
        categoryId: insertedCategories['clothing'],
        thumbnail: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
        images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'],
        stock: 100,
        sku: 'CLTH-JK-002',
        featured: false,
        tags: ['denim', 'jacket', 'vintage'],
      },
      {
        name: 'Minimalist Desk Lamp',
        slug: 'minimalist-desk-lamp',
        description: 'Modern LED desk lamp with adjustable brightness and color temperature. USB charging port included.',
        shortDescription: 'LED desk lamp with USB port',
        price: '59.99',
        comparePrice: '79.99',
        categoryId: insertedCategories['home-garden'],
        thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'],
        stock: 150,
        sku: 'HOME-LP-001',
        featured: true,
        tags: ['lamp', 'desk', 'LED', 'minimalist'],
      },
      {
        name: 'Indoor Plant Collection',
        slug: 'indoor-plant-collection',
        description: 'Set of 3 easy-care indoor plants perfect for home or office. Includes decorative pots.',
        shortDescription: '3-piece indoor plant set with pots',
        price: '79.99',
        comparePrice: '99.99',
        categoryId: insertedCategories['home-garden'],
        thumbnail: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400',
        images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800'],
        stock: 50,
        sku: 'HOME-PL-002',
        featured: false,
        tags: ['plants', 'indoor', 'decor'],
      },
      {
        name: 'Bestselling Novel Collection',
        slug: 'bestselling-novel-collection',
        description: 'Curated collection of 5 bestselling novels from award-winning authors. Perfect gift for book lovers.',
        shortDescription: '5-book bestseller collection',
        price: '69.99',
        comparePrice: '89.99',
        categoryId: insertedCategories['books'],
        thumbnail: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
        images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800'],
        stock: 80,
        sku: 'BOOK-NV-001',
        featured: true,
        tags: ['books', 'novels', 'bestseller'],
      },
      {
        name: 'Professional Yoga Mat',
        slug: 'professional-yoga-mat',
        description: 'Extra-thick, non-slip yoga mat with alignment guides. Eco-friendly materials, includes carrying strap.',
        shortDescription: 'Premium yoga mat with alignment guides',
        price: '49.99',
        comparePrice: '69.99',
        categoryId: insertedCategories['sports-outdoors'],
        thumbnail: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
        images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800'],
        stock: 200,
        sku: 'SPRT-YG-001',
        featured: true,
        tags: ['yoga', 'fitness', 'mat'],
      },
      {
        name: 'Luxury Skincare Set',
        slug: 'luxury-skincare-set',
        description: 'Complete 5-piece luxury skincare routine including cleanser, toner, serum, moisturizer, and eye cream.',
        shortDescription: '5-piece luxury skincare collection',
        price: '149.99',
        comparePrice: '199.99',
        categoryId: insertedCategories['beauty-health'],
        thumbnail: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400',
        images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800'],
        stock: 60,
        sku: 'BEAU-SK-001',
        featured: true,
        tags: ['skincare', 'beauty', 'luxury'],
      },
      {
        name: 'Creative Building Blocks Set',
        slug: 'creative-building-blocks-set',
        description: '500-piece colorful building blocks set for endless creativity. Compatible with major brands.',
        shortDescription: '500-piece building blocks set',
        price: '39.99',
        comparePrice: '54.99',
        categoryId: insertedCategories['toys-games'],
        thumbnail: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400',
        images: ['https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800'],
        stock: 150,
        sku: 'TOYS-BB-001',
        featured: false,
        tags: ['toys', 'building', 'creative', 'kids'],
      },
      {
        name: 'Gourmet Coffee Beans Selection',
        slug: 'gourmet-coffee-beans-selection',
        description: 'Premium single-origin coffee beans from around the world. Set includes 4 different roasts.',
        shortDescription: '4-pack premium coffee beans',
        price: '44.99',
        comparePrice: '59.99',
        categoryId: insertedCategories['food-beverages'],
        thumbnail: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
        images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800'],
        stock: 120,
        sku: 'FOOD-CF-001',
        featured: true,
        tags: ['coffee', 'gourmet', 'beans'],
      },
    ];

    for (const product of products) {
      const existing = await db.query.products.findFirst({
        where: (products, { eq }) => eq(products.slug, product.slug),
      });

      if (!existing) {
        await db.insert(schema.products).values(product);
        console.log(`Product created: ${product.name}`);
      } else {
        console.log(`Product exists: ${product.name}`);
      }
    }

    console.log('Creating testimonials...');

    const testimonials = [
      {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        company: 'Tech Solutions Inc.',
        role: 'Marketing Manager',
        content: 'The quality of products and customer service is exceptional. I always recommend NanoFlows to my colleagues.',
        rating: 5,
        featured: true,
        sortOrder: 1,
      },
      {
        name: 'Michael Chen',
        email: 'michael@example.com',
        company: 'Design Studio',
        role: 'Creative Director',
        content: 'Fast shipping and great products. The electronics section has everything I need for my home office.',
        rating: 5,
        featured: true,
        sortOrder: 2,
      },
      {
        name: 'Emily Rodriguez',
        email: 'emily@example.com',
        company: 'Wellness Co.',
        role: 'Founder',
        content: 'Love the sustainable product options! The organic clothing line is perfect for our eco-conscious brand.',
        rating: 5,
        featured: true,
        sortOrder: 3,
      },
    ];

    for (const testimonial of testimonials) {
      const existing = await db.query.testimonials.findFirst({
        where: (t, { eq }) => eq(t.email, testimonial.email!),
      });

      if (!existing) {
        await db.insert(schema.testimonials).values(testimonial);
        console.log(`Testimonial created: ${testimonial.name}`);
      } else {
        console.log(`Testimonial exists: ${testimonial.name}`);
      }
    }

    console.log('Creating sample announcements...');

    const announcements = [
      {
        title: 'Welcome to NanoFlows Shop!',
        content: 'Explore our wide range of products with exclusive online discounts.',
        type: 'info',
        priority: 10,
        isActive: true,
      },
      {
        title: 'Free Shipping on Orders Over $100',
        content: 'Enjoy free standard shipping on all orders above $100. Limited time offer!',
        type: 'success',
        priority: 5,
        isActive: true,
      },
    ];

    for (const announcement of announcements) {
      const existing = await db.query.announcements.findFirst({
        where: (a, { eq }) => eq(a.title, announcement.title),
      });

      if (!existing) {
        await db.insert(schema.announcements).values(announcement);
        console.log(`Announcement created: ${announcement.title}`);
      } else {
        console.log(`Announcement exists: ${announcement.title}`);
      }
    }

    console.log('\nDatabase seed completed successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin: admin@nanoflows.com / admin123');
    console.log('User: user@nanoflows.com / user123');

  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

seedDatabase();
