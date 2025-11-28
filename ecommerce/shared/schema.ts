import { z } from 'zod';

export const ProductCategoryEnum = z.enum([
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

export type ProductCategory = z.infer<typeof ProductCategoryEnum>;

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  description: z.string(),
  shortDescription: z.string().max(500).optional(),
  price: z.number().positive(),
  comparePrice: z.number().positive().optional(),
  category: ProductCategoryEnum,
  images: z.array(z.string()).default([]),
  thumbnail: z.string().optional(),
  stock: z.number().int().min(0).default(0),
  sku: z.string().max(100).optional(),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const CreateProductSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const UpdateProductSchema = CreateProductSchema.partial();

export type Product = z.infer<typeof ProductSchema>;
export type CreateProduct = z.infer<typeof CreateProductSchema>;
export type UpdateProduct = z.infer<typeof UpdateProductSchema>;

export const CartItemSchema = z.object({
  id: z.number(),
  userId: z.number(),
  productId: z.number(),
  quantity: z.number().int().positive(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const AddToCartSchema = z.object({
  productId: z.number(),
  quantity: z.number().int().positive().default(1)
});

export type CartItem = z.infer<typeof CartItemSchema>;
export type AddToCart = z.infer<typeof AddToCartSchema>;

export const OrderStatusEnum = z.enum([
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
]);

export type OrderStatus = z.infer<typeof OrderStatusEnum>;

export const PaymentStatusEnum = z.enum([
  'pending',
  'completed',
  'failed',
  'refunded'
]);

export type PaymentStatus = z.infer<typeof PaymentStatusEnum>;

export const OrderSchema = z.object({
  id: z.number(),
  userId: z.number(),
  orderNumber: z.string(),
  status: OrderStatusEnum,
  paymentStatus: PaymentStatusEnum,
  paymentMethod: z.string().optional(),
  paymentId: z.string().optional(),
  subtotal: z.number(),
  tax: z.number().default(0),
  shipping: z.number().default(0),
  discount: z.number().default(0),
  total: z.number(),
  shippingAddress: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string()
  }),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const OrderItemSchema = z.object({
  id: z.number(),
  orderId: z.number(),
  productId: z.number(),
  productName: z.string(),
  productImage: z.string().optional(),
  price: z.number(),
  quantity: z.number().int().positive(),
  total: z.number()
});

export const CreateOrderSchema = z.object({
  shippingAddress: OrderSchema.shape.shippingAddress,
  paymentMethod: z.string(),
  notes: z.string().optional()
});

export type Order = z.infer<typeof OrderSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type CreateOrder = z.infer<typeof CreateOrderSchema>;

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(6),
  role: z.enum(['user', 'admin']).default('user'),
  phone: z.string().optional(),
  avatar: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const RegisterSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(6),
  phone: z.string().optional()
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export type User = z.infer<typeof UserSchema>;
export type Register = z.infer<typeof RegisterSchema>;
export type Login = z.infer<typeof LoginSchema>;

export const WishlistItemSchema = z.object({
  id: z.number(),
  userId: z.number(),
  productId: z.number(),
  createdAt: z.date()
});

export type WishlistItem = z.infer<typeof WishlistItemSchema>;

export const ReviewSchema = z.object({
  id: z.number(),
  userId: z.number(),
  productId: z.number(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(255).optional(),
  comment: z.string(),
  verified: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const CreateReviewSchema = z.object({
  productId: z.number(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(255).optional(),
  comment: z.string()
});

export type Review = z.infer<typeof ReviewSchema>;
export type CreateReview = z.infer<typeof CreateReviewSchema>;

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CartWithProducts extends CartItem {
  product: Product;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

export interface ProductWithReviews extends Product {
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
}
