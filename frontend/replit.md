# Nano Flows - Futuristic AI Website

## Overview
Nano Flows is an AI-focused marketing website built with React, TypeScript, and Vite. It showcases AI-powered services through an interactive, visually striking interface with dynamic animations, dark/light theme switching, and comprehensive service presentations. The platform features a main landing page, an Education Dashboard (Udemy-style learning platform), and an AI Tools Showcase page with 12 free AI tools. The project aims to position Nano Flows as a premier partner for AI and automation solutions, including SaaS development and IoT.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
**Technology Stack:**
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS with custom design system
- **Animation Library**: Framer Motion
- **State Management**: React Context API for global theme management

**Design System:**
- **Centralized Theme System**: `darkTheme.ts` and `lightTheme.ts` define all styling tokens.
- **Color Schemes**: Dark mode uses electric blue (#00F0FF) and electric green (#00E881); light mode uses accent red (#EB3232).
- **Typography**: Three custom font families: Orbitron (headings), Exo 2 (body), and Poppins (UI elements).
- Dark mode is default with comprehensive light mode support.
- Responsive design with a mobile-first approach.
- **Zero Conditional Styling**: Components use `currentTheme.classes.*` for styling to avoid conditional logic.

**Component Architecture:**
- Modular structure with reusable AI-themed animation components in `/components/animations/`, including `AIGlowBackground`, `AIPulseButton`, and `AITokenStream`.
- Custom hooks pattern through ThemeContext.
- Page-level components for main sections (Hero, About, Services, Features, CaseStudy, Contact) and dedicated dashboards (EducationDashboard, AI Tools).
- Shared UI components like Header, Footer, and SocialMediaBar.

**Key Architectural Decisions:**
1.  **Theme Management**: Centralized, context-based theme system with persistence to localStorage, ensuring consistent styling without conditional rendering in components.
2.  **Animation Strategy**: A library of centralized animation components ensures consistent and engaging motion design.
3.  **Routing Pattern**: Simple two-route structure (`/` for main landing, `/elearning` for e-learning platform) with smooth transitions via AnimatePresence.
4.  **Responsive Design**: Mobile-first approach with adaptive layouts, swipeable carousels, and hamburger menus.
5.  **Component Isolation**: Major sections are self-contained components for improved maintainability.

### System Design Choices
- **E-Learning Platform (NanoFlows Academy)**: A distinct, standalone experience with its own navigation (Home, Courses, About, Contact), features, and layout, while maintaining visual brand consistency. Includes an advanced filtering system for courses (by category, level, and price), unique feature showcases, and instructor profiles. The Courses page (`/elearning/courses`) displays available courses with search and filtering capabilities.
- **Login & Platform Selection**: After login, users are presented with a platform chooser to access either NanoFlows Academy or NanoFlows AI Tools.
- **AI Tools Separation**: AI Tools are exclusively available in the NanoFlows AI Tools platform (`/ai-tools`), separate from NanoFlows Academy to maintain clear separation between learning content and tool discovery.
- **n8n Workflow Automation Integration**: Dedicated service offering and industry page positioning Nano Flows as an n8n expert.
- **Service Categories**: Expanded navigation to include SaaS Development and Internet of Things (IoT) as distinct service offerings.
- **Contact Section**: Integrated Google Maps for location display and navigation.
- **AI Tools Platform**: A comprehensive, multi-page AI tools directory platform accessible from Platform Selection. Includes:
  - **Home Page** (`/ai-tools`): Hero section with image slider, featured tools, statistics, category browse, and call-to-action sections
  - **Explore Page** (`/ai-tools/explore`): Full tools listing with search, category filters, pricing filters, and grid/list view toggle
  - **Tool Detail Page** (`/ai-tools/tool/:id`): Individual tool information with features, related tools, and external link
  - **About Page** (`/ai-tools/about`): Platform mission, values, statistics, timeline, and benefits
  - Uses dedicated navigation (`AIToolsNav`) with back button to Platform Selection
  - **Dedicated Footer** (`AIToolsFooter`): Comprehensive footer with AI Tools navigation links, social media icons, platform links, legal links, and scroll-to-top button - integrated across all AI Tools pages
  - Connected to backend API at `/api/ai-tools` for dynamic tool data
  - Professional stock images integrated throughout the platform

## External Dependencies

**Core Libraries:**
-   **@supabase/supabase-js**: For potential Backend-as-a-Service integration.
-   **framer-motion**: For advanced animations and transitions.
-   **react-router-dom**: For client-side routing.

**UI/UX Enhancement:**
-   **lucide-react** & **react-icons**: Icon libraries.
-   **@tsparticles/react** & **@tsparticles/slim**: For particle background effects.
-   **lottie-react**: For complex Lottie animations.
-   **google-map-react**: For interactive map integration.
-   **react-swipeable**: For touch gesture support.

**Development Tools:**
-   **TypeScript**: For type safety.
-   **ESLint**: For code quality.
-   **Tailwind CSS**, PostCSS, Autoprefixer: For styling.
-   **Vite**: Build tool.

**API Integration:**
-   **axios**: HTTP client for API calls.

**Third-Party Services:**
-   **Supabase**: Backend infrastructure (configured for database, auth, storage).
-   **Google Maps API**: Embedded map in the Contact section.