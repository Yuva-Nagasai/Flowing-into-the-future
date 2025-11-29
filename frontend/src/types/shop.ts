export interface User {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin';
  phone?: string;
  avatar?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  emailVerified: boolean;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: string;
  comparePrice?: string;
  categoryId?: number;
  category?: Category;
  images: string[];
  thumbnail?: string;
  stock: number;
  sku?: string;
  featured: boolean;
  isActive: boolean;
  tags: string[];
  metadata?: Record<string, any>;
  averageRating: string;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
  reviews?: Review[];
}

export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  product?: Product;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  id: number;
  userId: number;
  productId: number;
  product?: Product;
  createdAt: string;
}

export interface OrderAddress {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId?: number;
  productName: string;
  productImage?: string;
  price: string;
  quantity: number;
  total: string;
}

export interface Order {
  id: number;
  userId?: number;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod?: string;
  paymentId?: string;
  subtotal: string;
  tax: string;
  shipping: string;
  discount: string;
  total: string;
  shippingAddress: OrderAddress;
  billingAddress?: OrderAddress;
  notes?: string;
  trackingNumber?: string;
  items?: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: number;
  orderId: number;
  userId?: number;
  provider: 'stripe' | 'razorpay';
  providerPaymentId: string;
  providerOrderId?: string;
  amount: string;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: number;
  userId: number;
  user?: User;
  productId: number;
  orderId?: number;
  rating: number;
  title?: string;
  comment: string;
  verified: boolean;
  isApproved: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: number;
  title: string;
  description?: string;
  discountType: string;
  discountValue: string;
  code?: string;
  productId?: number;
  categoryId?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  bannerImage?: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  type: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  targetUrl?: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: number;
  name: string;
  email?: string;
  avatar?: string;
  company?: string;
  role?: string;
  content: string;
  rating: number;
  isActive: boolean;
  featured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterSubscriber {
  id: number;
  email: string;
  name?: string;
  isActive: boolean;
  subscribedAt: string;
  unsubscribedAt?: string;
  source?: string;
  createdAt: string;
}

export interface ProductRequest {
  id: number;
  userId?: number;
  name: string;
  email: string;
  productName: string;
  description?: string;
  category?: string;
  budget?: string;
  status: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginEvent {
  id: number;
  userId: number;
  user?: User;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  failureReason?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CartResponse {
  items: CartItem[];
  total: number;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

export interface CheckoutData {
  shippingAddress: OrderAddress;
  billingAddress?: OrderAddress;
  paymentMethod: 'stripe' | 'razorpay';
  notes?: string;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  totalCategories: number;
  recentOrders: Order[];
  topProducts: Product[];
  loginAnalytics: { date: string; count: number }[];
}
