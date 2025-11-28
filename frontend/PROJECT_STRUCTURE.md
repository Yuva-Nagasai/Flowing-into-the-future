# Project Structure - NanoFlows Academy

This project is separated into **Frontend** and **Backend** directories for better organization and maintainability.

## Directory Structure

```
Flowing-into-the-future/
├── frontend/               # Frontend (React + TypeScript + Vite)
│   ├── src/                # React source (components, pages, contexts, utils)
│   ├── public/             # Static frontend assets
│   ├── package.json        # Frontend dependencies/scripts
│   └── ...
├── backend/                # Backend (Express.js + MySQL/PostgreSQL)
│   ├── src/                # Backend source (config, controllers, routes, etc.)
│   ├── migrations/         # Database migrations & seed helpers
│   ├── public/             # Uploads and publicly served backend files
│   ├── package.json        # Backend dependencies/scripts
│   └── ...
└── attached_assets/        # Shared design references and supporting media
```

## Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (see backend/BACKEND_README.md for details)
# Copy the example and fill in your values

# Run database migrations
npm run migrate

# Start the backend server
npm start
```

Backend will run on `http://localhost:3001`

### 2. Frontend Setup

```bash
# Navigate to the frontend workspace
cd frontend
npm install

# Create .env file
# VITE_API_URL=http://localhost:3001/api

# Start the frontend development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## Environment Variables

### Frontend (`frontend/.env`)
- `VITE_API_URL` - Backend API URL (default: `http://localhost:3001/api`)

### Backend (`backend/.env`)
- `PORT` - Server port (default: 3001)
- `JWT_SECRET` - JWT secret key
- `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE` - Database config
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` - Payment gateway
- See `backend/BACKEND_README.md` for complete list

## API Communication

The frontend communicates with the backend through:
- **Base URL**: Configured via `VITE_API_URL` environment variable
- **Authentication**: JWT tokens stored in localStorage
- **API Client**: `src/utils/api.js` handles all API calls

All API endpoints are prefixed with `/api`:
- `/api/auth` - Authentication
- `/api/courses` - Courses
- `/api/payments` - Payments
- etc.

## Development Workflow

1. **Start Backend First**: The frontend depends on the backend API
2. **Start Frontend**: After backend is running, start the frontend
3. **Hot Reload**: Both support hot reload during development

## Production Deployment

### Frontend
```bash
cd frontend
npm run build
```
Deploy the `frontend/dist/` folder to your hosting service.

### Backend
```bash
cd backend
npm start
```
Deploy the `backend/` directory to your server. Make sure to:
- Set production environment variables
- Configure database connection
- Set up file storage (Cloudinary/S3 or local)

## Key Features

### Frontend
- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- React Router for navigation
- Theme system (dark/light mode)
- Responsive design

### Backend
- Express.js REST API
- MySQL database
- JWT authentication
- File upload support (local/Cloudinary/S3)
- Payment integration (Razorpay)
- Email notifications

## Documentation

- **Frontend**: See `FRONTEND_README.md`
- **Backend**: See `backend/BACKEND_README.md`
- **API Endpoints**: See `backend/BACKEND_README.md` for complete API documentation

## Important Notes

1. **No API Changes**: All API endpoints remain the same after separation
2. **Environment Variables**: Make sure both `.env` files are properly configured
3. **CORS**: Backend is configured to accept requests from the frontend
4. **File Paths**: All file paths remain relative to their respective directories

## Troubleshooting

### Frontend can't connect to backend
- Check `VITE_API_URL` in frontend `.env`
- Ensure backend is running on the correct port
- Check CORS configuration in backend

### Database connection errors
- Verify MySQL is running
- Check database credentials in backend `.env`
- Run migrations: `cd backend && npm run migrate`

### Authentication issues
- Verify `JWT_SECRET` is set in backend `.env`
- Check token storage in browser localStorage
- Ensure backend middleware is working correctly

