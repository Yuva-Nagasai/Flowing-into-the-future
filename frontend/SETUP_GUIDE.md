# Setup Guide - NanoFlows Academy

This guide will help you set up both the frontend and backend of the NanoFlows Academy project.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MySQL database (v5.7 or higher)

## Step-by-Step Setup

### Step 1: Clone and Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### Step 2: Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE nanoflows;
```

2. Navigate to server directory and run migrations:
```bash
cd server
npm run migrate
```

This will create all necessary tables in your database.

### Step 3: Backend Configuration

1. Create `.env` file in the `server/` directory:
```bash
cd server
cp .env.example .env  # If .env.example exists, or create manually
```

2. Edit `server/.env` with your configuration:
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Generate a secure JWT secret
# You can use: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your-generated-secret-key-here

# Database Configuration
MYSQLHOST=localhost
MYSQLPORT=3306
MYSQLUSER=root
MYSQLPASSWORD=your-mysql-password
MYSQLDATABASE=nanoflows

# Razorpay (Required for payments)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Optional: Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Optional: Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Step 4: Frontend Configuration

1. Create `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:3001/api
```

For production, change this to your backend server URL:
```env
VITE_API_URL=https://your-backend-domain.com/api
```

### Step 5: Start the Application

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

You should see:
```
✅ Server running on port 3001
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

You should see:
```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### Step 6: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/api/health

## Verification

1. **Backend Health Check**: Visit `http://localhost:3001/api/health`
   - Should return: `{"status":"OK","message":"NanoFlows Academy API is running"}`

2. **Frontend Connection**: Open browser console and check for any API connection errors

3. **Database**: Verify tables were created:
```sql
USE nanoflows;
SHOW TABLES;
```

## Creating Admin User

After setup, you can create an admin user by:

1. Sign up through the frontend at `/academy/signup`
2. Manually update the user role in the database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

## Production Deployment

### Frontend
1. Build the frontend:
```bash
npm run build
```

2. Deploy the `dist/` folder to your hosting service (Vercel, Netlify, etc.)

3. Set environment variable:
   - `VITE_API_URL` = Your production backend URL

### Backend
1. Set production environment variables in `.env`
2. Use a process manager like PM2:
```bash
npm install -g pm2
cd server
pm2 start src/index.js --name nanoflows-api
```

3. Configure reverse proxy (nginx) if needed
4. Set up SSL certificate for HTTPS

## Troubleshooting

### Backend won't start
- Check MySQL is running: `mysql -u root -p`
- Verify database credentials in `.env`
- Check port 3001 is not in use

### Frontend can't connect to backend
- Verify `VITE_API_URL` in frontend `.env`
- Check backend is running
- Check CORS settings in backend
- Check browser console for errors

### Database connection errors
- Verify MySQL service is running
- Check database credentials
- Ensure database exists: `CREATE DATABASE nanoflows;`
- Run migrations again: `cd server && npm run migrate`

### Authentication not working
- Verify `JWT_SECRET` is set in backend `.env`
- Check token in browser localStorage
- Clear browser cache and try again

## Next Steps

- Read `FRONTEND_README.md` for frontend details
- Read `server/BACKEND_README.md` for backend details
- Read `PROJECT_STRUCTURE.md` for project overview

## Support

For issues or questions, refer to the documentation files:
- `FRONTEND_README.md`
- `server/BACKEND_README.md`
- `PROJECT_STRUCTURE.md`

