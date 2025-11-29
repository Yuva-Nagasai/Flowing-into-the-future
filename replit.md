# NanoFlows Platform with Digital Hub

## Overview
NanoFlows is a comprehensive learning platform with an integrated Digital Hub e-commerce system that exclusively sells digital products (software, templates, courses, digital tools, e-books, design assets). The platform features a modern React frontend with multiple Node.js backends.

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
- Digital product categories (Software & Tools, Templates, Online Courses, E-Books, Design Assets, Audio & Music, Graphics, Plugins)
- Sample digital products

## Digital Hub Frontend Routes (`/shop/*`)

### Public Routes
- `/shop` - Shop homepage
- `/shop/products` - Product listing
- `/shop/products/:slug` - Product detail page
- `/shop/categories` - Category listing
- `/shop/categories/:slug` - Category products page
- `/shop/deals` - Deals page
- `/shop/about` - About page
- `/shop/contact` - Contact page
- `/shop/cart` - Shopping cart

### Authentication Routes
- `/shop/login` - User login
- `/shop/register` - User registration
- `/shop/forgot-password` - Password reset request
- `/shop/reset-password` - Password reset with token

### Protected User Routes (requires authentication)
- `/shop/checkout` - Checkout page
- `/shop/account` - User account dashboard
- `/shop/orders` - Order history
- `/shop/orders/:orderNumber` - Order detail page
- `/shop/order-success` - Order confirmation page

### Admin Routes (requires admin role)
- `/shop/admin` - Admin dashboard
- `/shop/admin/products` - Manage products
- `/shop/admin/categories` - Manage categories
- `/shop/admin/orders` - Manage orders
- `/shop/admin/reviews` - Manage reviews
- `/shop/admin/deals` - Manage deals
- `/shop/admin/announcements` - Manage announcements
- `/shop/admin/testimonials` - Manage testimonials
- `/shop/admin/newsletter` - Manage newsletter subscribers

### Key Frontend Components
- `ShopAuthContext` - Authentication context (user, cart, wishlist management)
- `ShopProtectedRoute` - Route protection with admin-only support
- `ShopNav` - Shop navigation with user/admin links
- `shopApi` - API utility for backend communication

## Workflows
- **Start application** - Frontend dev server (port 5000)
- **Backend API** - Main backend (port 3001)

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

### Shop Page Layout Updates (Latest)
Updated all 4 main shop pages with comprehensive new layouts:

**ShopHome.tsx:**
- Announcement bar with rotating messages at top
- Hero carousel with navigation arrows (left/right) and slide indicators
- Our Story section with background and content
- Why Choose Us section (6 benefit cards)
- Category grid section
- Featured Products grid with enhanced cards
- Product Request form section
- Testimonials section with quotes
- CTA section before footer

**ShopProducts.tsx:**
- Professional Digital Hub products page with comprehensive features
- Trust indicators bar at top (Instant Download, Secure Payment, Lifetime Access, Quality Assured)
- Featured products hero section (displays when not filtering)
- Two-column layout: enhanced sidebar filters + product grid
- Enhanced filter sidebar with:
  - Category filters with icons and count badges
  - Rating filter (4+ stars, 3+ stars, etc.)
  - Price range filters with radio buttons
  - Product type filter (Downloadable, Streaming, License Key)
  - Clear all filters button with active filter count
- Header: Title, product count, search bar, filter toggle, view mode (grid/list), sort dropdown
- Enhanced product cards featuring:
  - Digital product type badges (Course, eBook, Template, Software, etc.) with category-specific icons
  - Featured and discount badges
  - Star ratings with review count
  - Author info with avatar
  - Product metadata (file type, pages, duration, file size)
  - Instant download and license badges on hover
  - Wishlist toggle with authentication check (redirects to login if not authenticated)
  - Add to cart button with hover effects
- Quick view modal with:
  - Full product details
  - Trust indicators grid
  - Price with discount display
  - Add to cart, wishlist, and view full details buttons
- Improved empty state with icon, messaging, and action buttons
- Grid/List view toggle support with responsive layouts
- Mobile-responsive filter drawer with slide animation

**ShopDeals.tsx:**
- Centered header with icon and title
- Deal cards grid with: icon, title, discount badge, promo code display, validity date
- Modal/dialog for deal details with copy code functionality
- Graceful handling for deals without promo codes

**ShopContact.tsx:**
- Header section with icon and title
- Analytics/metrics cards (4-column grid): icons, values, change percentages
- Charts section (2-column): bar chart for monthly sales, progress bars for category performance
- Two-column contact container: contact info + embedded Google Map on left, contact form on right

**Types Updated:**
- Added optional `code` property to Deal interface for promo codes

### Digital Hub UI Enhancements
- Enhanced ShopNav with search bar functionality for product search
- Added Deals link to shop navigation
- Added Wishlist quick-access button in navigation (desktop + mobile)
- Updated TopFeatureNav to point "Digital Hub" to /shop
- Added Trust badges/Stats section (50K+ customers, 1,200+ products, 4.9 rating, 24/7 support)
- Added New Arrivals section with "New" badge and trending icon
- Added Customer Testimonials section with 5-star reviews
- Added Newsletter subscription section with email form
- Improved mobile navigation with expandable search and wishlist link

### Previous Changes
- Updated ShopAbout.tsx with Digital Hub branding (was NanoFlows Shop)
- Updated ShopContact.tsx for digital product support (removed physical product references)
- About page now highlights: Software & Tools, Templates & Assets, Digital Courses
- Contact page now has: Pre-Sales Questions, Technical Support, Feature Requests categories
- Updated FAQs for digital products (instant access, lifetime access, licensing)
- Fixed TypeScript errors in vite.config.ts (ESM-compatible __dirname)
- Converted main backend from MySQL to PostgreSQL
- Added graceful fallback data for hero slides and jobs when database unavailable
- Cleaned up duplicate ecommerce workflows
- Added @types/ws for TypeScript support in ecommerce backends
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
