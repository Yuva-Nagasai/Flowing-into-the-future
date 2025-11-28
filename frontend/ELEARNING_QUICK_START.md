# eLearning System - Quick Start Guide

## ✅ Backend Complete
All backend APIs are implemented and ready:
- ✅ Database migrations created (`server/migrations/create_elearning_tables.sql`)
- ✅ All controllers created (modules, progress, certificates, notes, discussions, payments)
- ✅ All routes registered in `server/src/index.js`
- ✅ API client updated in `src/utils/api.js`

## 🚀 Setup Steps

### 1. Run Database Migration
```bash
cd server
# Connect to your database and run:
psql $DATABASE_URL < migrations/create_elearning_tables.sql
```

### 2. Add Environment Variables
Add to `server/.env`:
```
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

### 3. Install Server Dependencies
```bash
cd server
npm install razorpay nodemailer
```

### 4. Frontend Pages Status
The following pages need to be built (backend APIs ready):
- Enhanced Course Details (uses modules/lessons)
- Enhanced Course Player (with notes, discussions)
- Payment Checkout page
- Payment Success/Failed pages
- Profile page

All backend APIs are ready to consume!

## 📚 API Endpoints Available

### Modules & Lessons
- `GET /api/modules/course/:course_id` - Get all modules/lessons for a course
- `POST /api/modules/module` - Create module (admin)
- `POST /api/modules/lesson` - Create lesson (admin)

### Progress Tracking
- `POST /api/progress` - Update user progress
- `GET /api/progress/course/:course_id` - Get course progress
- `GET /api/progress/user` - Get user's overall progress

### Certificates
- `POST /api/certificates/course/:course_id` - Generate certificate
- `GET /api/certificates/user` - Get user certificates

### Notes
- `POST /api/notes` - Save note
- `GET /api/notes/lesson/:lesson_id` - Get lesson notes
- `GET /api/notes/course/:course_id` - Get course notes

### Discussions
- `POST /api/discussions` - Create discussion
- `GET /api/discussions?course_id=:id&lesson_id=:id` - Get discussions
- `POST /api/discussions/:id/reply` - Create reply

### Payments (Razorpay)
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/history` - Get payment history

## 🎨 Theme Colors
- Dark mode: `electric-blue` (#00F0FF), `electric-green` (#00E881), `dark-bg`, `dark-card`
- Light mode: `accent-red` (#EB3232), white, gray shades
- Use `useTheme()` hook from `src/context/ThemeContext.tsx`

