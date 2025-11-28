# NanoFlows Platform

## Overview
NanoFlows is a comprehensive learning platform with an integrated e-commerce shop system. The platform features a modern React frontend with a Node.js backend.

## Project Structure
```
/frontend          - React + Vite frontend (port 5000)
/backend           - Main backend API (port 3001) 
/ecommerce/backend - Shop backend API (port 3002)
```

## Technologies
- Frontend: React 18, TypeScript, Vite, TailwindCSS, Framer Motion
- Backend: Node.js, Express
- E-commerce Backend: Node.js, Express, Drizzle ORM
- Database: PostgreSQL (Neon-backed)

## Key Features

### E-commerce Shop System
- Integrated shop accessible via `/shop` route
- Product catalog with categories: Electronics, Clothing, Home, Books, Sports, Beauty, Toys, Food, Other
- Product search and filtering
- Shopping cart functionality
- User authentication system
- Wishlist and reviews support

### Navigation
- Top Feature Nav bar includes Shop icon with custom SVG
- Shop navigation: Home, Products, Categories

### Current Status
- Shop UI fully integrated into main frontend
- Sample products display when database not connected
- Database schema ready (ecommerce_users, products, cart_items, orders, order_items, wishlist_items, reviews)

## API Routes

### Main API (port 3001)
- `/api/*` - Main platform APIs

### E-commerce API (port 3002)
- `/api/ecommerce/products` - Products CRUD
- `/api/ecommerce/cart` - Cart management
- `/api/ecommerce/orders` - Order management
- `/api/ecommerce/auth` - User authentication
- `/api/ecommerce/wishlist` - Wishlist management
- `/api/ecommerce/reviews` - Product reviews

## Workflows
- **Start application** - Frontend dev server (port 5000)
- **Backend API** - Main backend (port 3001)
- **Ecommerce Backend** - Shop API (port 3002)

## Recent Changes (November 2025)
- Created PostgreSQL database with comprehensive e-commerce schema
- Integrated shop into main frontend navigation
- Built shop pages (ShopHome, ShopProducts, ShopCart)
- Added ShopContext for state management
- Configured Vite proxy for API routing
- Added sample products fallback for offline mode

## Notes
- The shop uses sample products when DATABASE_URL is not available
- Vite proxy routes `/api/ecommerce/*` to port 3002
- Frontend binds to 0.0.0.0:5000 for external access

## Database Setup
The PostgreSQL database is provisioned by Replit. To enable persistent product data:

1. The DATABASE_URL secret should be automatically available to workflows
2. If products aren't persisting, verify the DATABASE_URL secret in the Secrets tab
3. The shop will automatically use the database when DATABASE_URL is set, otherwise falls back to sample products

## Sample Products (Fallback Mode)
When database isn't connected, the shop displays 12 sample products across categories:
- Electronics: Wireless Headphones, Smart Watch, Portable Power Bank
- Clothing: Organic Cotton T-Shirt, Vintage Denim Jacket
- Home: Minimalist Desk Lamp, Indoor Plant Collection
- Books: Bestselling Novel Collection
- Sports: Professional Yoga Mat
- Beauty: Luxury Skincare Set
- Toys: Building Blocks Set
- Food: Gourmet Coffee Beans
