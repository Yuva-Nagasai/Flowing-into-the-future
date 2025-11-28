import { pgTable, serial, varchar, text, integer, decimal, boolean, timestamp, json, pgEnum } from 'drizzle-orm/pg-core';

export const productCategoryEnum = pgEnum('product_category', [
  'electronics',
  'clothing',
  'home',
  'books',
  'sports',
  'beauty',
  'toys',
  'food',
  'other'
]);

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'completed',
  'failed',
  'refunded'
]);

export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);

export const ecommerceUsers = pgTable('ecommerce_users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  role: userRoleEnum('role').default('user').notNull(),
  phone: varchar('phone', { length: 50 }),
  avatar: text('avatar'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  description: text('description').notNull(),
  shortDescription: varchar('short_description', { length: 500 }),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  comparePrice: decimal('compare_price', { precision: 10, scale: 2 }),
  category: productCategoryEnum('category').notNull(),
  images: json('images').$type<string[]>().default([]),
  thumbnail: text('thumbnail'),
  stock: integer('stock').default(0).notNull(),
  sku: varchar('sku', { length: 100 }),
  featured: boolean('featured').default(false).notNull(),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const cartItems = pgTable('cart_items', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => ecommerceUsers.id, { onDelete: 'cascade' }).notNull(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  quantity: integer('quantity').default(1).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => ecommerceUsers.id, { onDelete: 'set null' }),
  orderNumber: varchar('order_number', { length: 50 }).unique().notNull(),
  status: orderStatusEnum('status').default('pending').notNull(),
  paymentStatus: paymentStatusEnum('payment_status').default('pending').notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }),
  paymentId: varchar('payment_id', { length: 255 }),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  tax: decimal('tax', { precision: 10, scale: 2 }).default('0').notNull(),
  shipping: decimal('shipping', { precision: 10, scale: 2 }).default('0').notNull(),
  discount: decimal('discount', { precision: 10, scale: 2 }).default('0').notNull(),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  shippingAddress: json('shipping_address').$type<{
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }>().notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'set null' }),
  productName: varchar('product_name', { length: 255 }).notNull(),
  productImage: text('product_image'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  quantity: integer('quantity').notNull(),
  total: decimal('total', { precision: 10, scale: 2 }).notNull()
});

export const wishlistItems = pgTable('wishlist_items', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => ecommerceUsers.id, { onDelete: 'cascade' }).notNull(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => ecommerceUsers.id, { onDelete: 'cascade' }).notNull(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  rating: integer('rating').notNull(),
  title: varchar('title', { length: 255 }),
  comment: text('comment').notNull(),
  verified: boolean('verified').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});
