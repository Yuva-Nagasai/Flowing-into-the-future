require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Main application routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const videoRoutes = require('./routes/videos');
const purchaseRoutes = require('./routes/purchases');
const jobRoutes = require('./routes/jobs');
const aiToolRoutes = require('./routes/aiTools');
const aboutRoutes = require('./routes/about');
const uploadRoutes = require('./routes/upload');
const moduleRoutes = require('./routes/modules');
const progressRoutes = require('./routes/progress');
const certificateRoutes = require('./routes/certificates');
const noteRoutes = require('./routes/notes');
const discussionRoutes = require('./routes/discussions');
const paymentRoutes = require('./routes/payments');
const quizRoutes = require('./routes/quizzes');
const assignmentRoutes = require('./routes/assignments');
const notificationRoutes = require('./routes/notifications');
const heroSlidesRoutes = require('./routes/heroSlides');

// Ecommerce routes (from ecommerce/backend)
const ecommerceAuthRoutes = require('./routes/ecommerce/auth');
const ecommerceProductRoutes = require('./routes/ecommerce/products');
const ecommerceCartRoutes = require('./routes/ecommerce/cart');
const ecommerceOrderRoutes = require('./routes/ecommerce/orders');
const ecommerceWishlistRoutes = require('./routes/ecommerce/wishlist');
const ecommerceReviewRoutes = require('./routes/ecommerce/reviews');

// Shop uses ecommerce routes (frontend uses /api/ecommerce)

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files (images, thumbnails - public)
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Protected video and file serving routes (requires authentication and purchase)
const { serveVideo, serveFile } = require('./controllers/videoServeController');
const { authMiddleware } = require('./middleware/auth');
app.get('/api/videos/serve/:filename', authMiddleware, serveVideo);
app.get('/api/files/serve/:filename', authMiddleware, serveFile);

// Health check endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'NanoFlows Academy API is running' });
});

app.get('/api/ecommerce/health', (req, res) => {
  res.json({ status: 'OK', message: 'Ecommerce API is running' });
});


// Main application routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/ai-tools', aiToolRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/hero-slides', heroSlidesRoutes);

// Ecommerce/Shop routes (Shop frontend uses /api/ecommerce)
app.use('/api/ecommerce/auth', ecommerceAuthRoutes);
app.use('/api/ecommerce/products', ecommerceProductRoutes);
app.use('/api/ecommerce/cart', ecommerceCartRoutes);
app.use('/api/ecommerce/orders', ecommerceOrderRoutes);
app.use('/api/ecommerce/wishlist', ecommerceWishlistRoutes);
app.use('/api/ecommerce/reviews', ecommerceReviewRoutes);

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
