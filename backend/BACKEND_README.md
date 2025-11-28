# Backend - NanoFlows Academy API

This is the backend Express.js server for NanoFlows Academy.

## Project Structure

```
server/
├── src/
│   ├── config/          # Configuration files
│   │   ├── db.js       # Database connection
│   │   └── supabase.js # Supabase client
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   │   └── auth.js     # Authentication middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic services
│   │   ├── cloudinaryService.js
│   │   ├── emailService.js
│   │   └── pdfService.js
│   └── index.js         # Server entry point
├── migrations/          # Database migration files
├── public/              # Public files (uploads)
└── package.json         # Dependencies
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MySQL database
- npm or yarn

### Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `server/` directory:
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-secret-key-here
MYSQLHOST=localhost
MYSQLPORT=3306
MYSQLUSER=root
MYSQLPASSWORD=your-password
MYSQLDATABASE=nanoflows
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
```

4. Set up the database:
```bash
npm run migrate
```

5. Start the server:
```bash
npm start
# or for development
npm run dev
```

The server will be available at `http://localhost:3001`.

## Environment Variables

Create a `.env` file in the `server/` directory with the following variables:

### Required

- `PORT` - Server port (default: 3001)
- `JWT_SECRET` - Secret key for JWT tokens
- `MYSQLHOST` - MySQL host
- `MYSQLPORT` - MySQL port (default: 3306)
- `MYSQLUSER` - MySQL username
- `MYSQLPASSWORD` - MySQL password
- `MYSQLDATABASE` - MySQL database name
- `RAZORPAY_KEY_ID` - Razorpay key ID
- `RAZORPAY_KEY_SECRET` - Razorpay key secret

### Optional

- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS and email links
- `DATABASE_URL` - Alternative to individual MySQL vars (format: `mysql://user:password@host:port/database`)
- `SUPABASE_URL` - Supabase URL (if using Supabase)
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `EMAIL_SERVICE` - Email service (default: gmail)
- `EMAIL_USER` - Email address for sending emails
- `EMAIL_PASSWORD` - Email password or app password
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `AWS_ACCESS_KEY_ID` - AWS access key (alternative to Cloudinary)
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_REGION` - AWS region (default: us-east-1)
- `AWS_S3_BUCKET` - S3 bucket name

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course (Admin only)
- `PUT /api/courses/:id` - Update course (Admin only)
- `DELETE /api/courses/:id` - Delete course (Admin only)

### Videos
- `POST /api/videos` - Add video (Admin only)
- `PUT /api/videos/:id` - Update video (Admin only)
- `DELETE /api/videos/:id` - Delete video (Admin only)
- `GET /api/videos/serve/:filename` - Serve video (Protected)

### Purchases
- `POST /api/purchases` - Create purchase
- `GET /api/purchases/my-purchases` - Get user purchases
- `GET /api/purchases/check/:courseId` - Check if user purchased course

### Payments
- `POST /api/payments/create-order` - Create payment order
- `POST /api/payments/verify` - Verify payment
- `POST /api/payments/enroll-free` - Enroll in free course

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create job (Admin only)
- `PUT /api/jobs/:id` - Update job (Admin only)
- `DELETE /api/jobs/:id` - Delete job (Admin only)

### AI Tools
- `GET /api/ai-tools` - Get all AI tools
- `GET /api/ai-tools/:id` - Get AI tool by ID
- `POST /api/ai-tools` - Create AI tool (Admin only)
- `PUT /api/ai-tools/:id` - Update AI tool (Admin only)
- `DELETE /api/ai-tools/:id` - Delete AI tool (Admin only)

### About
- `GET /api/about` - Get all about sections
- `GET /api/about/type/:type` - Get about section by type
- `POST /api/about` - Create/update about section (Admin only)
- `PUT /api/about/:id` - Update about section (Admin only)
- `DELETE /api/about/:id` - Delete about section (Admin only)

### Upload
- `POST /api/upload/image` - Upload image
- `POST /api/upload/video` - Upload video
- `POST /api/upload/thumbnail` - Upload thumbnail
- `POST /api/upload/resource` - Upload resource file
- `POST /api/upload/student-file` - Upload student file

### Modules
- `GET /api/modules/course/:courseId` - Get modules by course
- `POST /api/modules/module` - Create module (Admin only)
- `PUT /api/modules/module/:id` - Update module (Admin only)
- `DELETE /api/modules/module/:id` - Delete module (Admin only)

### Progress
- `POST /api/progress` - Update progress
- `GET /api/progress/course/:courseId` - Get course progress
- `GET /api/progress/user` - Get user progress

### Certificates
- `POST /api/certificates/course/:courseId` - Generate certificate
- `GET /api/certificates/user` - Get user certificates
- `GET /api/certificates/:id` - Get certificate by ID

### Notes
- `POST /api/notes` - Save note
- `GET /api/notes/lesson/:lessonId` - Get lesson notes
- `GET /api/notes/course/:courseId` - Get course notes
- `DELETE /api/notes/:id` - Delete note

### Discussions
- `POST /api/discussions` - Create discussion
- `GET /api/discussions` - Get all discussions
- `GET /api/discussions/:id` - Get discussion by ID
- `POST /api/discussions/:id/reply` - Reply to discussion
- `DELETE /api/discussions/:id` - Delete discussion

### Quizzes
- `GET /api/quizzes/course/:courseId` - Get quizzes by course
- `GET /api/quizzes/lesson/:lessonId` - Get quizzes by lesson
- `GET /api/quizzes/module/:moduleId` - Get quizzes by module
- `POST /api/quizzes` - Create quiz (Admin only)
- `PUT /api/quizzes/:id` - Update quiz (Admin only)
- `DELETE /api/quizzes/:id` - Delete quiz (Admin only)
- `POST /api/quizzes/attempt` - Submit quiz attempt

### Assignments
- `GET /api/assignments/course/:courseId` - Get assignments by course
- `GET /api/assignments/lesson/:lessonId` - Get assignments by lesson
- `GET /api/assignments/module/:moduleId` - Get assignments by module
- `POST /api/assignments` - Create assignment (Admin only)
- `PUT /api/assignments/:id` - Update assignment (Admin only)
- `DELETE /api/assignments/:id` - Delete assignment (Admin only)
- `POST /api/assignments/submit` - Submit assignment

### Notifications
- `GET /api/notifications/admin/all` - Get all notifications (Admin only)

## Database Migrations

Run migrations to set up the database:

```bash
npm run migrate
```

Or run specific migrations:
```bash
npm run migrate:mysql
npm run migrate:elearning
npm run migrate:course-enhancement
npm run migrate:module-resources
npm run migrate:module-quizzes-assignments
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

## File Uploads

Files can be uploaded to:
- Local storage (default)
- Cloudinary (if configured)
- AWS S3 (if configured)

If neither Cloudinary nor S3 is configured, files are stored locally in `server/public/uploads/`.

## Tech Stack

- **Express.js** - Web framework
- **MySQL2** - MySQL database driver
- **JWT** - Authentication
- **Multer** - File upload handling
- **Razorpay** - Payment gateway
- **Nodemailer** - Email service
- **Cloudinary** - Cloud file storage (optional)
- **PDFKit** - PDF generation (optional)

## Security

- JWT tokens for authentication
- Password hashing with bcrypt
- CORS enabled for frontend
- Protected routes with middleware
- File upload validation

