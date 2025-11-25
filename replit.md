# Nano Flows - Futuristic AI Website

## Overview

Nano Flows is a modern, AI-focused marketing website built with React, TypeScript, and Vite. The application showcases AI-powered services through an interactive, visually striking interface with dynamic animations, dark/light theme switching, and comprehensive service presentations. The platform features a main landing page with multiple sections (Hero, About, Services, Features, Case Studies, Contact), an Education Dashboard (Udemy-style learning platform), and an AI Tools Showcase page with 12 free AI tools.

## Recent Changes (November 2025)

### E-Learning Platform Public Landing Page (November 25, 2025)
- **Created Public E-Learning Landing Page**: New comprehensive course browsing page at `/elearning` accessible without authentication
- **Top Navigation Integration**: Updated second button in top feature bar to route to e-learning platform (changed from `/products` to `/elearning`)
- **Hero Section**: Professional academy branding with NanoFlows Academy title, descriptive tagline, CTA buttons ("Start Learning Today", "Explore Courses"), and stat cards (courses, students, certificates, rating)
- **Advanced Filtering System**: 
  - Search bar for real-time course filtering by title and description
  - Category filter with 9 categories (Web Development, Backend Development, Data Science, Mobile Development, DevOps, AI & ML, Database, Cloud Computing)
  - Level filter (Beginner, Intermediate, Advanced)
- **Course Cards**: Responsive grid layout with:
  - Thumbnail placeholders and video icons
  - Category tags and level badges
  - Course title and description
  - Duration and student enrollment counts
  - Pricing (Free or ₹ amount)
  - Click-to-login functionality (redirects to login with course redirect)
- **Robust Error Handling**:
  - Null-safe filtering for course title and description fields
  - Loading skeleton during initial load and retry operations
  - User-friendly error messages with retry button when API fails
  - Graceful degradation when backend is unavailable
  - Empty state message when no courses match filters
- **Full Theme Integration**: Consistent dark/light mode styling matching existing design system with electric blue/green (dark) and accent red/blue (light) color schemes
- **Backend Integration**: Connects to existing courses API endpoint (`GET /api/courses`) with proper published course filtering
- **Responsive Design**: Mobile-first approach with sidebar filters and 2-column course grid

### New Service Categories in Navigation (November 19, 2025)
- **Added SaaS Development Service Category**: Complete SaaS solutions including MVP development, multi-tenant architecture, subscription/billing integration, and platform modernization
- **Added Internet of Things Service Category**: IoT solutions covering device integration, data analytics, smart home/building automation, and industrial IoT (IIoT)
- **Products Navigation Enhancement**: Navigation bar now displays 5 service categories (AI Experience Suite, Cloud & Performance Platform, Growth & Analytics Hub, SaaS Development, Internet of Things) in the Products dropdown menu
- **Service Items**: Each new category includes 4 detailed service offerings with descriptions and slugs for future page development

### n8n Workflow Automation Integration (November 19, 2025)
- **Added n8n Service to Services Section**: Comprehensive n8n Workflow Automation service card with setup, custom workflows, integrations, and self-hosted solutions
- **Created Dedicated n8n Industry Page**: Complete automation page at `/industry/n8n-workflow-automation` with hero, 6 core services, 6 highlights, 4 solution categories, and 4 FAQs
- **Updated Features Section**: Rebranded "Seamless Integration" feature to "n8n Workflow Automation" emphasizing 400+ app integrations and expert n8n positioning
- **Consistent n8n Messaging**: All content positions Nano Flows as premier n8n automation partner with enterprise-grade capabilities, self-hosted security, and migration expertise

### Comprehensive Theme System Implementation
- **Centralized Theme Architecture**: Created comprehensive theme system with darkTheme.ts and lightTheme.ts files containing ALL styling tokens
- **Theme Configuration Files**: 
  - `darkTheme.ts`: Electric blue (#00F0FF) and electric green (#00E881) color scheme with all component styling classes
  - `lightTheme.ts`: Accent red (#EB3232) color scheme with matching light-mode component classes
  - `theme.ts`: Theme selector that returns the appropriate theme based on current mode
- **Tailwind Config Update**: Updated with proper color definitions (electric-blue, electric-green, accent-red, dark-card)
- **Zero Conditional Logic - Components Refactored**: 
  - ✅ Login.jsx - using ONLY theme.classes.* without any theme === 'dark' ? conditionals
  - ✅ CaseStudy.tsx - fully refactored to use currentTheme.classes.* pattern (November 14, 2025)
- **Comprehensive Theme Classes**: Theme files include classes for backgrounds, text styles, buttons, form elements, error states, borders, shadows, focus rings, gradients, blur effects, navigation buttons, download buttons, dots (active/inactive), and more
- **Valid Tailwind Utilities**: All theme classes use valid Tailwind syntax with arbitrary values for shadows and colors
- **Scalable Architecture**: Theme system ready to be applied across remaining components (PlatformSelection, other main page sections)

### Login Flow & Platform Selection
- **Database Setup Complete (November 14, 2025)**: PostgreSQL database provisioned with all necessary tables (users, courses, videos, resources, purchases, progress)
- **Login Credentials**:
  - **Admin**: email: `admin@nanoflows.com`, password: `admin123`
  - **Test User**: email: `user@test.com`, password: `user123`
- **Added Platform Selection Page**: After successful login, all users (both admins and regular users) are presented with a professional platform chooser
- **Dual Platform Access**: Users can choose between:
  - **NanoFlows Academy**: Access learning dashboard, courses, and progress tracking (admins route to admin dashboard, users to learner dashboard)
  - **NanoFlows AI Tools**: Explore AI-powered tools and technologies
- **Professional Design**: Platform selection features animated cards with gradient effects, feature lists, and theme-aware styling
- **Consistent Theme Support**: Dark/light mode toggle available on platform selection page, synced with main website theme

### Mobile Case Study Improvements
- Fixed mobile alignment issues for better content display
- Reduced card height from 520px to auto with 420px minHeight for optimal viewport usage
- Adjusted padding from p-4 to p-3 on mobile for tighter, cleaner layout
- Optimized image and text spacing to ensure CTA button is visible without excessive scrolling
- Improved responsive button sizing (px-5 py-2.5 text-sm on mobile)

### About Section Enhancement
- Replaced the Nano Flows logo with an AI-themed visual (robot emoji, gradient background)
- Visual displays "AI-Powered Solutions" with tagline about transforming businesses
- Fully responsive with theme-aware styling and hover effects

### Contact Section Map Integration
- Updated Google Maps coordinates to reflect actual Visakhapatnam location (17.6868, 83.2185)
- Integrated Google Maps link (https://maps.app.goo.gl/vzoeyseTBKvJNWZR6) for direct navigation
- Location card now opens both modal map view and external Google Maps link
- Users can click location to view map or open in Google Maps app

### Social Media Integration
- Added professional social media sidebar to Hero section with Facebook, Twitter, LinkedIn, Instagram, and GitHub icons
- Sidebar features smooth animations, theme-aware styling, and responsive design (hidden on mobile, visible on desktop)
- Icons include hover effects with scale and rotation animations

### AI Tools Page Enhancements
- Repositioned Back button to right side beside theme toggle for improved navigation hierarchy
- Implemented live search dropdown with filtered results showing matching tools as user types
- Search dropdown displays tool icons, names, and categories with smooth animations
- Added "Explore All Tools" button functionality to clear search filters

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework**: React 18 with TypeScript for type-safe component development
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: React Router DOM v7 for client-side navigation between main page and education dashboard
- **Styling**: Tailwind CSS with custom design system featuring dark/light themes
- **Animation Library**: Framer Motion for page transitions, component animations, and interactive effects
- **State Management**: React Context API for global theme management

**Design System:**
- **Centralized Theme System**: Theme configuration files (darkTheme.ts, lightTheme.ts) containing all styling tokens
- **Dark Mode Colors**: Electric blue (#00F0FF), electric green (#00E881), dark card background (#071021)
- **Light Mode Colors**: Accent red (#EB3232), white backgrounds, complementary light grays
- Three custom font families: Orbitron (headings), Exo 2 (body), and Poppins (UI elements)
- Dark mode as default with comprehensive light mode support
- Responsive design with mobile-first approach using Tailwind breakpoints
- **Zero Conditional Styling**: All components use currentTheme.classes.* instead of theme === 'dark' ? conditionals

**Component Architecture:**
- Modular component structure with separation of concerns
- Reusable Gen-AI animation components in `/components/animations/` directory:
  - **AICursorGlow**: Animated cursor aura with gradient trail (currently inactive)
  - **AIGlowBackground**: Ambient gradient glow with particle effects for Hero section
  - **AIPulseButton**: Animated buttons with pulse and hover effects  
  - **AITokenStream**: Typewriter animation for text streaming effects
  - **AIThinkingAnimation**: AI thinking dots with Lottie animations
  - **FloatingParticles**: Particle system for background effects
  - **PageTransition**: Smooth page transitions with AnimatePresence
- Custom hooks pattern through ThemeContext
- Page-level components (Hero, About, Services, Features, CaseStudy, Contact, EducationDashboard)
- Shared UI components (Header, Footer, SocialMediaBar, AIChat)

**Key Architectural Decisions:**

1. **Theme Management**: Centralized theme system with comprehensive styling tokens in darkTheme.ts and lightTheme.ts. Context-based theme switching persists to localStorage. Components consume theme.classes.* for all styling without conditional logic, ensuring maintainability and scalability

2. **Animation Strategy**: Centralized animation components (AIPulseButton, AIGlowBackground, AITokenStream, AIThinkingAnimation) provide consistent motion design across the application

3. **Routing Pattern**: Simple two-route structure - main landing page (/) and education dashboard (/educationdashboard) with AnimatePresence for smooth transitions

4. **Responsive Design**: Mobile-first approach with swipeable carousels for case studies, hamburger menu for mobile navigation, and adaptive layouts using Tailwind breakpoints

5. **Component Isolation**: Each major section is a self-contained component with its own state management, reducing coupling and improving maintainability

### External Dependencies

**Core Libraries:**
- **@supabase/supabase-js** (^2.57.4): Backend-as-a-Service integration (configured but not actively used in current codebase)
- **framer-motion** (^12.23.24): Advanced animation library for page transitions and interactive elements
- **react-router-dom** (^7.9.5): Client-side routing and navigation

**UI/UX Enhancement:**
- **lucide-react** (^0.344.0): Icon library for consistent iconography
- **react-icons** (^5.5.0): Additional icon sets for social media and UI elements
- **@tsparticles/react** + **@tsparticles/slim**: Particle background effects for futuristic aesthetic
- **lottie-react** (^2.4.1): Lottie animation player for complex animations
- **google-map-react** (^2.2.5): Interactive map integration in Contact section
- **react-swipeable** (^7.0.2): Touch gesture support for mobile carousels

**Development Tools:**
- **TypeScript** (^5.5.3): Type safety and enhanced developer experience
- **ESLint** with React and TypeScript plugins: Code quality and consistency
- **Tailwind CSS** (^3.4.1) + PostCSS + Autoprefixer: Utility-first styling with vendor prefixing
- **Vite** (^7.1.10): Fast development server with HMR and optimized builds

**API Integration:**
- **axios** (^1.12.2): HTTP client for potential API calls (prepared for future backend integration)

**Third-Party Services:**
- **Supabase**: Backend infrastructure configured for potential database, authentication, and storage needs
- **Google Maps API**: Embedded map functionality in Contact section for location display

**Build Configuration:**
- Vite configured for Replit deployment with WebSocket HMR over WSS protocol
- Server exposed on all interfaces (0.0.0.0) for container compatibility
- Custom port 5000 for both development and preview modes
- Optimized dependency pre-bundling excluding lucide-react for better tree-shaking