# Frontend - NanoFlows Academy

This is the frontend application built with React, TypeScript, and Vite.

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── academy/        # Academy-specific components
│   └── animations/     # Animation components
├── pages/              # Page components
│   ├── academy/        # Academy pages (courses, dashboard, etc.)
│   ├── products/       # Product pages
│   ├── industries/     # Industry pages
│   └── legal/          # Legal pages
├── contexts/           # React contexts (AuthContext)
├── context/           # Theme context
├── data/              # Static data files
├── themes/            # Theme configuration
├── utils/             # Utility functions
│   └── api.js         # API client configuration
└── App.tsx            # Main App component
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:3001/api
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` (or the port specified in vite.config.ts).

### Environment Variables

Create a `.env` file in the root directory with the following variables:

- `VITE_API_URL` - Backend API URL (default: `http://localhost:3001/api`)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## API Integration

The frontend communicates with the backend through the API client configured in `src/utils/api.js`. All API calls use the base URL from `VITE_API_URL` environment variable.

### API Endpoints Used

- `/api/auth` - Authentication (login, signup)
- `/api/courses` - Course management
- `/api/videos` - Video management
- `/api/purchases` - Purchase management
- `/api/payments` - Payment processing
- `/api/jobs` - Job listings
- `/api/ai-tools` - AI tools
- `/api/about` - About sections
- `/api/upload` - File uploads
- `/api/modules` - Course modules
- `/api/progress` - User progress tracking
- `/api/certificates` - Certificate generation
- `/api/notes` - User notes
- `/api/discussions` - Course discussions
- `/api/quizzes` - Quizzes
- `/api/assignments` - Assignments
- `/api/notifications` - Notifications

## Features

- **Theme System** - Dark/Light theme support
- **Authentication** - User login/signup with JWT
- **Course Management** - Browse, purchase, and learn from courses
- **Admin Panel** - Full admin dashboard for course management
- **Payment Integration** - Razorpay payment gateway
- **Responsive Design** - Mobile-first responsive design
- **Animations** - Smooth page transitions and animations

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

## Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

