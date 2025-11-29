import type {
  User,
  Product,
  Category,
  CartItem,
  WishlistItem,
  Order,
  Review,
  Deal,
  Announcement,
  Testimonial,
  NewsletterSubscriber,
  ProductRequest,
  LoginEvent,
  ApiResponse,
  PaginatedResponse,
  CartResponse,
  AuthResponse,
  CheckoutData,
  DashboardStats,
} from '../types/shop';

const API_BASE = '/api/ecommerce';

class ShopApi {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('shop_token');
    }
  }

  private getHeaders(includeAuth = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('shop_token', token);
    } else {
      localStorage.removeItem('shop_token');
    }
  }

  getToken() {
    return this.token;
  }

  async register(data: { email: string; password: string; name: string }): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (result.token) {
      this.setToken(result.token);
    }
    return result;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    const result = await res.json();
    if (result.token) {
      this.setToken(result.token);
    }
    return result;
  }

  async logout(): Promise<ApiResponse<void>> {
    const res = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: this.getHeaders(true),
    });
    this.setToken(null);
    return res.json();
  }

  async getMe(): Promise<ApiResponse<User>> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: this.getHeaders(true),
    });
    return res.json();
  }

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<ApiResponse<void>> {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email }),
    });
    return res.json();
  }

  async resetPassword(token: string, password: string): Promise<ApiResponse<void>> {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ token, password }),
    });
    return res.json();
  }

  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    featured?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    minPrice?: number;
    maxPrice?: number;
  }): Promise<PaginatedResponse<Product>> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.set(key, String(value));
      });
    }
    const res = await fetch(`${API_BASE}/products?${query}`);
    return res.json();
  }

  async getFeaturedProducts(): Promise<ApiResponse<Product[]>> {
    const res = await fetch(`${API_BASE}/products/featured`);
    return res.json();
  }

  async getProduct(slug: string): Promise<ApiResponse<Product>> {
    const res = await fetch(`${API_BASE}/products/${slug}`);
    return res.json();
  }

  async searchProducts(query: string, limit = 20): Promise<ApiResponse<Product[]>> {
    const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    return res.json();
  }

  async getCategories(): Promise<ApiResponse<Category[]>> {
    const res = await fetch(`${API_BASE}/categories`);
    return res.json();
  }

  async getCategory(slug: string, page = 1, limit = 20): Promise<ApiResponse<{ category: Category; products: Product[] }>> {
    const res = await fetch(`${API_BASE}/categories/${slug}?page=${page}&limit=${limit}`);
    return res.json();
  }

  async getCart(): Promise<ApiResponse<CartResponse>> {
    const res = await fetch(`${API_BASE}/cart`, {
      headers: this.getHeaders(true),
    });
    return res.json();
  }

  async addToCart(productId: number, quantity = 1): Promise<ApiResponse<CartItem>> {
    const res = await fetch(`${API_BASE}/cart`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ productId, quantity }),
    });
    return res.json();
  }

  async updateCartItem(id: number, quantity: number): Promise<ApiResponse<CartItem>> {
    const res = await fetch(`${API_BASE}/cart/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify({ quantity }),
    });
    return res.json();
  }

  async removeFromCart(id: number): Promise<ApiResponse<void>> {
    const res = await fetch(`${API_BASE}/cart/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });
    return res.json();
  }

  async clearCart(): Promise<ApiResponse<void>> {
    const res = await fetch(`${API_BASE}/cart`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });
    return res.json();
  }

  async getWishlist(): Promise<ApiResponse<WishlistItem[]>> {
    const res = await fetch(`${API_BASE}/wishlist`, {
      headers: this.getHeaders(true),
    });
    return res.json();
  }

  async addToWishlist(productId: number): Promise<ApiResponse<WishlistItem>> {
    const res = await fetch(`${API_BASE}/wishlist`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ productId }),
    });
    return res.json();
  }

  async removeFromWishlist(productId: number): Promise<ApiResponse<void>> {
    const res = await fetch(`${API_BASE}/wishlist/${productId}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });
    return res.json();
  }

  async getOrders(): Promise<ApiResponse<Order[]>> {
    const res = await fetch(`${API_BASE}/orders`, {
      headers: this.getHeaders(true),
    });
    return res.json();
  }

  async getOrder(orderNumber: string): Promise<ApiResponse<Order>> {
    const res = await fetch(`${API_BASE}/orders/${orderNumber}`, {
      headers: this.getHeaders(true),
    });
    return res.json();
  }

  async createReview(data: { productId: number; rating: number; title?: string; comment: string }): Promise<ApiResponse<Review>> {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async getDeals(): Promise<ApiResponse<Deal[]>> {
    const res = await fetch(`${API_BASE}/deals`);
    return res.json();
  }

  async getAnnouncements(): Promise<ApiResponse<Announcement[]>> {
    const res = await fetch(`${API_BASE}/announcements`);
    return res.json();
  }

  async getTestimonials(): Promise<ApiResponse<Testimonial[]>> {
    const res = await fetch(`${API_BASE}/testimonials`);
    return res.json();
  }

  async subscribeNewsletter(email: string, name?: string): Promise<ApiResponse<void>> {
    const res = await fetch(`${API_BASE}/newsletter/subscribe`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, name, source: 'shop' }),
    });
    return res.json();
  }

  async submitProductRequest(data: {
    name: string;
    email: string;
    productName: string;
    description?: string;
    category?: string;
    budget?: string;
  }): Promise<ApiResponse<ProductRequest>> {
    const res = await fetch(`${API_BASE}/product-request`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async createStripeSession(orderId: number): Promise<ApiResponse<{ sessionId: string; url: string }>> {
    const res = await fetch(`${API_BASE}/payments/create-stripe-session`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ orderId }),
    });
    return res.json();
  }

  async createRazorpayOrder(orderId: number): Promise<ApiResponse<{ orderId: string; amount: number; currency: string }>> {
    const res = await fetch(`${API_BASE}/payments/create-razorpay-order`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ orderId }),
    });
    return res.json();
  }

  async verifyStripePayment(sessionId: string): Promise<ApiResponse<Order>> {
    const res = await fetch(`${API_BASE}/payments/verify-stripe-payment`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ sessionId }),
    });
    return res.json();
  }

  async verifyRazorpayPayment(data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Promise<ApiResponse<Order>> {
    const res = await fetch(`${API_BASE}/payments/verify-razorpay-payment`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async checkout(data: CheckoutData): Promise<ApiResponse<Order>> {
    const res = await fetch(`${API_BASE}/checkout`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async getAdminDashboard(): Promise<ApiResponse<DashboardStats>> {
    const res = await fetch(`${API_BASE}/admin/dashboard`, {
      headers: this.getHeaders(true),
    });
    return res.json();
  }

  async getAdminProducts(params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Product>> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.set(key, String(value));
      });
    }
    const res = await fetch(`${API_BASE}/admin/products?${query}`, {
      headers: this.getHeaders(true),
    });
    return res.json();
  }

  async createProduct(data: FormData): Promise<ApiResponse<Product>> {
    const res = await fetch(`${API_BASE}/admin/products`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.token}` },
      body: data,
    });
    return res.json();
  }

  async updateProduct(id: number, data: FormData): Promise<ApiResponse<Product>> {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${this.token}` },
      body: data,
    });
    return res.json();
  }

  async deleteProduct(id: number): Promise<ApiResponse<void>> {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });
    return res.json();
  }

  async getAdminCategories(): Promise<ApiResponse<Category[]>> {
    const res = await fetch(`${API_BASE}/admin/categories`, {
      headers: this.getHeaders(true),
    });
    return res.json();
  }

  async createCategory(data: Partial<Category>): Promise<ApiResponse<Category>> {
    const res = await fetch(`${API_BASE}/admin/categories`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async updateCategory(id: number, data: Partial<Category>): Promise<ApiResponse<Category>> {
    const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async deleteCategory(id: number): Promise<ApiResponse<void>> {
    const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });
    return res.json();
  }

  async getAdminDeals(): Promise<ApiResponse<Deal[]>> {
    const res = await fetch(`${API_BASE}/admin/deals`, {
      headers: this.getHeaders(true),
    });
    return res.json();
  }

  async createDeal(data: Partial<Deal>): Promise<ApiResponse<Deal>> {
    const res = await fetch(`${API_BASE}/admin/deals`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async updateDeal(id: number, data: Partial<Deal>): Promise<ApiResponse<Deal>> {
    const res = await fetch(`${API_BASE}/admin/deals/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async deleteDeal(id: number): Promise<ApiResponse<void>> {
    const res = await fetch(`${API_BASE}/admin/deals/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });
    return res.json();
  }

  async getAdminAnnouncements(): Promise<ApiResponse<Announcement[]>> {
    const res = await fetch(`${API_BASE}/admin/announcements`, {
      headers: this.getHeaders(true),
    });
    return res.json();
  }

  async createAnnouncement(data: Partial<Announcement>): Promise<ApiResponse<Announcement>> {
    const res = await fetch(`${API_BASE}/admin/announcements`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async updateAnnouncement(id: number, data: Partial<Announcement>): Promise<ApiResponse<Announcement>> {
    const res = await fetch(`${API_BASE}/admin/announcements/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async deleteAnnouncement(id: number): Promise<ApiResponse<void>> {
    const res = await fetch(`${API_BASE}/admin/announcements/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });
    return res.json();
  }

  async getAdminTestimonials(): Promise<ApiResponse<Testimonial[]>> {
    const res = await fetch(`${API_BASE}/admin/testimonials`, {
      headers: this.getHeaders(true),
    });
    return res.json();
  }

  async createTestimonial(data: Partial<Testimonial>): Promise<ApiResponse<Testimonial>> {
    const res = await fetch(`${API_BASE}/admin/testimonials`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async updateTestimonial(id: number, data: Partial<Testimonial>): Promise<ApiResponse<Testimonial>> {
    const res = await fetch(`${API_BASE}/admin/testimonials/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async deleteTestimonial(id: number): Promise<ApiResponse<void>> {
    const res = await fetch(`${API_BASE}/admin/testimonials/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });
    return res.json();
  }

  async getAdminNewsletterSubscribers(params?: { page?: number; limit?: number }): Promise<PaginatedResponse<NewsletterSubscriber>> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.set(key, String(value));
      });
    }
    const res = await fetch(`${API_BASE}/admin/newsletter?${query}`, {
      headers: this.getHeaders(true),
    });
    return res.json();
  }

  async deleteNewsletterSubscriber(id: number): Promise<ApiResponse<void>> {
    const res = await fetch(`${API_BASE}/admin/newsletter/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });
    return res.json();
  }

  async getAdminProductRequests(params?: { page?: number; limit?: number; status?: string }): Promise<PaginatedResponse<ProductRequest>> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.set(key, String(value));
      });
    }
    const res = await fetch(`${API_BASE}/admin/product-requests?${query}`, {
      headers: this.getHeaders(true),
    });
    return res.json();
  }

  async updateProductRequest(id: number, data: { status: string; adminNotes?: string }): Promise<ApiResponse<ProductRequest>> {
    const res = await fetch(`${API_BASE}/admin/product-requests/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async getAdminReviews(params?: { page?: number; limit?: number; approved?: boolean }): Promise<PaginatedResponse<Review>> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.set(key, String(value));
      });
    }
    const res = await fetch(`${API_BASE}/admin/reviews?${query}`, {
      headers: this.getHeaders(true),
    });
    return res.json();
  }

  async approveReview(id: number): Promise<ApiResponse<Review>> {
    const res = await fetch(`${API_BASE}/admin/reviews/${id}/approve`, {
      method: 'PUT',
      headers: this.getHeaders(true),
    });
    return res.json();
  }

  async rejectReview(id: number): Promise<ApiResponse<void>> {
    const res = await fetch(`${API_BASE}/admin/reviews/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });
    return res.json();
  }

  async getAdminOrders(params?: { page?: number; limit?: number; status?: string }): Promise<PaginatedResponse<Order>> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.set(key, String(value));
      });
    }
    const res = await fetch(`${API_BASE}/admin/orders?${query}`, {
      headers: this.getHeaders(true),
    });
    return res.json();
  }

  async updateOrderStatus(id: number, status: string): Promise<ApiResponse<Order>> {
    const res = await fetch(`${API_BASE}/admin/orders/${id}/status`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify({ status }),
    });
    return res.json();
  }

  async getLoginAnalytics(days = 30): Promise<ApiResponse<LoginEvent[]>> {
    const res = await fetch(`${API_BASE}/admin/login-analytics?days=${days}`, {
      headers: this.getHeaders(true),
    });
    return res.json();
  }

  async uploadImage(file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.token}` },
      body: formData,
    });
    return res.json();
  }
}

export const shopApi = new ShopApi();
export default shopApi;
