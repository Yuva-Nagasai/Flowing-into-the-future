# NanoFlows Academy Server

Backend server for the NanoFlows Academy e-learning platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the `backend` directory with the following variables:

```env
# Database Configuration (REQUIRED)
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# JWT Secret (REQUIRED)
JWT_SECRET=your-secret-jwt-key-change-this-in-production

# Server Port (optional, defaults to 3001)
PORT=3001

# Supabase Configuration (optional, if using Supabase)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key

# Node Environment
NODE_ENV=development
```

3. Set up your PostgreSQL database using the schema in `DATABASE_SCHEMA.md`

4. Run the server:
```bash
npm run dev
```

## Required Environment Variables

- **DATABASE_URL**: PostgreSQL connection string
  - Format: `postgresql://username:password@host:port/database`
  - Example: `postgresql://postgres:mypassword@localhost:5432/nanoflows_academy`

- **JWT_SECRET**: Secret key for JWT token generation
  - Generate a secure random string for production
  - Example: `openssl rand -base64 32`

## Database Setup

See `DATABASE_SCHEMA.md` for the complete database schema and setup instructions.

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/courses` - List courses
- `GET /api/courses/:id` - Get course details
- `POST /api/purchases` - Create purchase
- `GET /api/videos/:courseId` - Get course videos

