# NanoFlows Platform

## Overview
NanoFlows is a comprehensive learning platform with an integrated e-commerce shop system. The platform features a modern React frontend with multiple Node.js backends.

## Project Structure
```
/frontend                    - React + Vite frontend (port 5000)
/backend                     - Main backend API (port 3001) 
/ecommerce/backend           - Shop backend API (port 3002)
/digital-hub/ecommerce/backend - Digital Hub Ecommerce API (port 3003)
```

## Technologies
- Frontend: React 18, TypeScript, Vite, TailwindCSS, Framer Motion
- Backend: Node.js, Express
- E-commerce Backend: Node.js, Express, Drizzle ORM
- Digital Hub Backend: Node.js, Express, TypeScript, Drizzle ORM
- Database: PostgreSQL (Neon-backed)

## Digital Hub Ecommerce Backend (Part 2)

### Features
- Authentication (login, register, password reset, logout)
- Catalog / Products with categories
- Cart & Wishlist management
- Checkout with Stripe + Razorpay payment integration
- Orders management
- Reviews (verified purchases only)
- Testimonials
- Newsletter subscription
- Announcements
- Deals and promotions
- AI search ready
- AI recommendations ready
- AI chatbot API ready
- Admin panel with full CRUD

### API Structure (`/digital-hub/ecommerce/backend/api/`)
- `authRoutes.ts` - Authentication endpoints
- `adminRoutes.ts` - Admin panel CRUD operations
- `paymentRoutes.ts` - Stripe & Razorpay payment processing
- `routes.ts` - Main API routes (products, cart, wishlist, orders, reviews)
- `upload.ts` - File/image upload handling
- `sitemap.ts` - SEO sitemap generation
- `storage.ts` - File storage utilities

### Database Tables (Drizzle ORM)
- `users` - User accounts with roles
- `categories` - Product categories
- `products` - Product catalog
- `deals` - Promotional deals
- `announcements` - Site announcements
- `cart_items` - Shopping cart
- `wishlist` - User wishlists
- `orders` - Order records
- `order_items` - Order line items
- `payments` - Payment transactions
- `reviews` - Product reviews (verified only)
- `testimonials` - Customer testimonials
- `login_events` - Login audit trail
- `newsletter_subscribers` - Newsletter emails
- `product_requests` - Product request forms
- `password_reset_tokens` - Password reset tokens

### API Endpoints

#### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password with token
- `GET /me` - Get current user
- `PUT /profile` - Update profile
- `PUT /change-password` - Change password

#### Products & Catalog (`/api`)
- `GET /products` - List products (with pagination, filtering)
- `GET /products/featured` - Featured products
- `GET /products/:slug` - Get product by slug
- `GET /categories` - List categories
- `GET /categories/:slug` - Get category with products
- `GET /search?q=` - Search products
- `GET /deals` - Active deals
- `GET /announcements` - Active announcements
- `GET /testimonials` - Testimonials

#### Cart & Wishlist (`/api`)
- `GET /cart` - Get user cart
- `POST /cart` - Add to cart
- `PUT /cart/:id` - Update cart item
- `DELETE /cart/:id` - Remove from cart
- `DELETE /cart` - Clear cart
- `GET /wishlist` - Get wishlist
- `POST /wishlist` - Add to wishlist
- `DELETE /wishlist/:productId` - Remove from wishlist

#### Orders (`/api`)
- `GET /orders` - List user orders
- `GET /orders/:orderNumber` - Get order details
- `POST /reviews` - Create product review

#### Payments (`/api/payments`)
- `POST /create-stripe-session` - Create Stripe checkout session
- `POST /create-razorpay-order` - Create Razorpay order
- `POST /verify-stripe-payment` - Verify Stripe payment
- `POST /verify-razorpay-payment` - Verify Razorpay payment
- `POST /webhook/stripe` - Stripe webhook handler
- `POST /refund` - Process refund

#### Admin (`/api/admin`) - Requires admin role
- Dashboard, Users, Products, Categories, Orders, Deals, Announcements, Testimonials, Reviews, Newsletter, Product Requests, Login Events CRUD

### Seed Script
Run `npm run seed` in `/digital-hub/ecommerce/backend/` to seed:
- Admin user: `admin@nanoflows.com` / `admin123`
- Demo user: `user@nanoflows.com` / `user123`
- Sample categories (Electronics, Clothing, Home, Books, Sports, Beauty, Toys, Food)
- Sample products

## Workflows
- **Start application** - Frontend dev server (port 5000)
- **Backend API** - Main backend (port 3001)
- **Ecommerce Backend** - Shop API (port 3002)
- **Digital Hub Ecommerce API** - Digital Hub Shop API (port 3003)

## Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string (auto-provisioned by Replit)
- `SESSION_SECRET` - Session encryption key
- `JWT_SECRET` - JWT signing key
- `STRIPE_SECRET_KEY` - Stripe secret key (for payments)
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `RAZORPAY_KEY_ID` - Razorpay key ID
- `RAZORPAY_KEY_SECRET` - Razorpay secret key

## Database Setup
The PostgreSQL database is provisioned by Replit. The Digital Hub backend automatically runs migrations on startup when DATABASE_URL is available.

To manually seed the database after DATABASE_URL is configured:
```bash
cd digital-hub/ecommerce/backend
npm run seed
```

Or call the seed endpoint:
```bash
curl -X POST http://localhost:3003/api/seed
```

## Recent Changes (November 2025)
- Created Digital Hub Ecommerce backend with full feature set
- Added comprehensive Drizzle schema with 16 tables
- Implemented authentication with JWT and session support
- Added Stripe and Razorpay payment integration
- Created admin panel with full CRUD operations
- Added file upload and storage utilities
- Implemented sitemap generation for SEO
- Created seed script with demo data

## Notes
- The shop uses sample data fallback when DATABASE_URL is not available
- Frontend binds to 0.0.0.0:5000 for external access
- All backends use CORS with credentials enabled
- Rate limiting is enabled on all API routes
