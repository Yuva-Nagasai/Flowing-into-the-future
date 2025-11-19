const express = require('express');
const { uploadImage, uploadVideo, uploadThumbnail, uploadResource, uploadStudentFile } = require('../controllers/uploadController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Upload endpoints (admin only)
router.post('/image', authMiddleware, adminMiddleware, uploadImage);
router.post('/video', authMiddleware, adminMiddleware, uploadVideo);
router.post('/thumbnail', authMiddleware, adminMiddleware, uploadThumbnail);
router.post('/resource', authMiddleware, adminMiddleware, uploadResource);

// Student file upload (for assignments) - no admin required
router.post('/student-file', authMiddleware, uploadStudentFile);

module.exports = router;

