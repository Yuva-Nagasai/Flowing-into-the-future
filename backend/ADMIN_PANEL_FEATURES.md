# Admin Panel Backend Features - Complete Implementation

This document outlines all the implemented features for the admin panel backend according to the requirements.

## A. Course Module ✅

### Features Implemented:
- ✅ **Create Course** - `POST /api/courses` (Admin only)
- ✅ **Edit Course** - `PUT /api/courses/:id` (Admin only)
- ✅ **Delete Course** - `DELETE /api/courses/:id` (Admin only)
- ✅ **Get All Courses** - `GET /api/courses/admin/all` (Admin only)
- ✅ **Get Course Details** - `GET /api/courses/admin/:id` (Admin only) - Returns course with all modules, lessons, and enrollment count
- ✅ **Upload Thumbnails** - `POST /api/upload/thumbnail` (Admin only) - Supports Cloudinary/S3
- ✅ **Upload Videos** - `POST /api/upload/video` (Admin only) - Supports Cloudinary/S3

### Controller: `courseController.js`
- `createCourse` - Creates a new course
- `updateCourse` - Updates course details
- `deleteCourse` - Deletes a course
- `getAllCoursesAdmin` - Gets all courses for admin
- `getCourseDetailsAdmin` - Gets detailed course information with all content

## B. Content Module ✅

### Course Structure:
**Course → Modules → Lessons → Videos / PDFs / Quizzes / Assignments**

### Features Implemented:
- ✅ **Upload** - Create modules, lessons, quizzes, assignments
- ✅ **Update** - Update modules, lessons, quizzes, assignments
- ✅ **Delete** - Delete modules, lessons, quizzes, assignments
- ✅ **Fetch by Course** - Get all content for a course (admin endpoint)

### Endpoints:

#### Modules & Lessons:
- `GET /api/modules/course/:course_id` - Get all modules with lessons for a course
- `POST /api/modules/module` - Create module (Admin)
- `PUT /api/modules/module/:id` - Update module (Admin)
- `DELETE /api/modules/module/:id` - Delete module (Admin)
- `POST /api/modules/lesson` - Create lesson (Admin)
- `PUT /api/modules/lesson/:id` - Update lesson (Admin)
- `DELETE /api/modules/lesson/:id` - Delete lesson (Admin)

#### Quizzes:
- `GET /api/quizzes/course/:course_id` - Get all quizzes for a course (Admin)
- `GET /api/quizzes/lesson/:lesson_id` - Get quizzes for a lesson
- `POST /api/quizzes` - Create quiz (Admin)
- `PUT /api/quizzes/:id` - Update quiz (Admin)
- `DELETE /api/quizzes/:id` - Delete quiz (Admin)
- `POST /api/quizzes/attempt` - Submit quiz attempt
- `GET /api/quizzes/scores` - Get user quiz scores
- `GET /api/quizzes/course/:course_id/scores` - Get all quiz scores for a course (Admin)

#### Assignments:
- `GET /api/assignments/course/:course_id` - Get all assignments for a course (Admin)
- `GET /api/assignments/lesson/:lesson_id` - Get assignments for a lesson
- `POST /api/assignments` - Create assignment (Admin)
- `PUT /api/assignments/:id` - Update assignment (Admin)
- `DELETE /api/assignments/:id` - Delete assignment (Admin)
- `POST /api/assignments/submit` - Submit assignment
- `PUT /api/assignments/submission/:id/grade` - Grade assignment (Admin)
- `GET /api/assignments/submissions` - Get user submissions
- `GET /api/assignments/course/:course_id/submissions` - Get all submissions for a course (Admin)

### Controllers:
- `moduleController.js` - Handles modules and lessons
- `quizController.js` - Handles quizzes and quiz attempts
- `assignmentController.js` - Handles assignments and submissions

## C. Enrollment Module ✅

### Features Implemented:
- ✅ **Enroll user after payment** - Automatically handled in `paymentController.js` via `verifyPayment`
- ✅ **Check if user is already enrolled** - `GET /api/purchases/check/:course_id`
- ✅ **Store student list per course** - `GET /api/purchases/course/:course_id/students` (Admin)

### Endpoints:
- `POST /api/purchases` - Create purchase (enrollment)
- `GET /api/purchases/my-purchases` - Get user's purchases
- `GET /api/purchases/check/:course_id` - Check if user is enrolled
- `GET /api/purchases/all` - Get all purchases (Admin)
- `GET /api/purchases/course/:course_id/students` - Get student list per course (Admin)

### Controller: `purchaseController.js`
- `createPurchase` - Creates enrollment after payment
- `checkPurchase` - Checks if user is enrolled
- `getStudentsByCourse` - Gets all students enrolled in a course with progress

## D. Progress Tracking Module ✅

### Features Implemented:
- ✅ **Completed videos** - Tracked in `user_progress` table
- ✅ **Quiz scores** - Tracked in `quiz_attempts` table
- ✅ **Assignment submissions** - Tracked in `assignment_submissions` table
- ✅ **Auto-generate certificate on completion** - Automatically generates certificate when course is 100% complete

### Endpoints:
- `POST /api/progress` - Update user progress
- `GET /api/progress/course/:course_id` - Get course progress
- `GET /api/progress/user` - Get user's overall progress
- `GET /api/progress/all` - Get all student progress (Admin)

### Controller: `progressController.js`
- `updateProgress` - Updates lesson progress and auto-generates certificate on completion
- `getCourseProgress` - Gets progress for a specific course
- `getUserProgress` - Gets user's progress across all courses
- `getAllProgress` - Gets all student progress with quiz and assignment stats (Admin)

## E. Payments (Razorpay) ✅

### Features Implemented:
- ✅ **Create Order** - `POST /api/payments/create-order`
- ✅ **Verify Payment Signature** - `POST /api/payments/verify`
- ✅ **Store Payment Details** - Stored in `payment_orders` table
- ✅ **Activate Course** - Automatically enrolls user after payment verification

### Endpoints:
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment and enroll user
- `GET /api/payments/history` - Get payment history

### Controller: `paymentController.js`
- `createOrder` - Creates Razorpay order
- `verifyPayment` - Verifies payment signature and enrolls user
- `getPaymentHistory` - Gets user's payment history

## F. Certificate Generation ✅

### Features Implemented:
- ✅ **Generate unique certificate ID** - Format: `NFC-{random}-{timestamp}`
- ✅ **Add student name** - Included in certificate
- ✅ **Add course name** - Included in certificate
- ✅ **Add completion date** - Included in certificate
- ✅ **Convert HTML to PDF** - Using PDFKit (optional dependency)
- ✅ **Store on Cloudinary / S3** - Automatic upload after generation

### Endpoints:
- `POST /api/certificates/course/:course_id` - Generate certificate
- `GET /api/certificates/user` - Get user's certificates
- `GET /api/certificates/:id` - Get certificate by ID

### Controller: `certificateController.js`
- `generateCertificate` - Generates PDF certificate and uploads to Cloudinary/S3
- `getUserCertificates` - Gets all user certificates
- `getCertificateById` - Gets specific certificate

### Services:
- `pdfService.js` - Handles PDF generation (PDFKit or HTML fallback)
- `cloudinaryService.js` - Handles Cloudinary and S3 uploads

## G. Notifications Module ✅

### Features Implemented:
- ✅ **Signup Email** - Sent automatically on user registration
- ✅ **Payment Success Email** - Sent after successful payment
- ✅ **Course Update Notifications** - Sent when new modules/lessons are added
- ✅ **Certificate Issued Email** - Sent when certificate is generated

### Email Templates:
- `signup` - Welcome email for new users
- `paymentSuccess` - Payment confirmation email
- `courseUpdate` - Course update notification
- `certificateIssued` - Certificate generation notification

### Service: `emailService.js`
- Uses Nodemailer for email sending
- Supports Gmail and other SMTP services
- Gracefully handles email failures (doesn't break requests)

## File Upload Support ✅

### Features:
- ✅ **Thumbnail Upload** - `POST /api/upload/thumbnail` (Admin)
- ✅ **Video Upload** - `POST /api/upload/video` (Admin)
- ✅ **Image Upload** - `POST /api/upload/image` (Admin)
- ✅ **Cloudinary Support** - Automatic upload if configured
- ✅ **S3 Support** - Automatic upload if configured
- ✅ **Local Fallback** - Falls back to local storage if cloud not configured

### Controller: `uploadController.js`
- `uploadThumbnail` - Uploads course thumbnails
- `uploadVideo` - Uploads course videos
- `uploadImage` - Uploads general images

## Environment Variables Required

### Required:
- `JWT_SECRET` - For JWT token signing
- `DATABASE_URL` - PostgreSQL connection string
- `EMAIL_USER` - Email service username (optional)
- `EMAIL_PASSWORD` - Email service password (optional)
- `RAZORPAY_KEY_ID` - Razorpay key ID
- `RAZORPAY_KEY_SECRET` - Razorpay key secret

### Optional (for Cloudinary):
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### Optional (for AWS S3):
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_S3_BUCKET`
- `AWS_REGION`

### Optional (for PDF generation):
- Install `pdfkit` package: `npm install pdfkit`

## Database Tables Used

- `courses` - Course information
- `modules` - Course modules
- `lessons` - Course lessons
- `quizzes` - Quiz questions
- `quiz_attempts` - User quiz attempts and scores
- `assignments` - Assignment details
- `assignment_submissions` - User assignment submissions
- `purchases` - Course enrollments
- `payment_orders` - Payment records
- `user_progress` - User progress tracking
- `certificates` - Generated certificates
- `users` - User accounts

## All Admin Endpoints Summary

### Course Management:
- `GET /api/courses/admin/all` - Get all courses
- `GET /api/courses/admin/:id` - Get course details
- `POST /api/courses` - Create course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Content Management:
- `POST /api/modules/module` - Create module
- `PUT /api/modules/module/:id` - Update module
- `DELETE /api/modules/module/:id` - Delete module
- `POST /api/modules/lesson` - Create lesson
- `PUT /api/modules/lesson/:id` - Update lesson
- `DELETE /api/modules/lesson/:id` - Delete lesson
- `POST /api/quizzes` - Create quiz
- `PUT /api/quizzes/:id` - Update quiz
- `DELETE /api/quizzes/:id` - Delete quiz
- `POST /api/assignments` - Create assignment
- `PUT /api/assignments/:id` - Update assignment
- `DELETE /api/assignments/:id` - Delete assignment
- `PUT /api/assignments/submission/:id/grade` - Grade assignment

### File Uploads:
- `POST /api/upload/thumbnail` - Upload thumbnail
- `POST /api/upload/video` - Upload video
- `POST /api/upload/image` - Upload image

### Student Management:
- `GET /api/purchases/all` - Get all purchases
- `GET /api/purchases/course/:course_id/students` - Get students per course
- `GET /api/progress/all` - Get all student progress
- `GET /api/quizzes/course/:course_id/scores` - Get quiz scores
- `GET /api/assignments/course/:course_id/submissions` - Get assignment submissions

## Notes

1. All admin endpoints require authentication (`authMiddleware`) and admin role (`adminMiddleware`)
2. PDF generation requires `pdfkit` package (optional - falls back to HTML if not installed)
3. Cloudinary/S3 uploads are optional - system falls back to local storage
4. Email notifications are optional - system continues to work if email fails
5. Certificate auto-generation happens when course completion reaches 100%
6. Course update notifications are sent automatically when new modules/lessons are added

