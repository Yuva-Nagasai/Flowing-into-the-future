const express = require('express');
const router = express.Router();
const { getAllNotifications } = require('../controllers/notificationController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Get all notifications (Admin only)
router.get('/admin/all', authMiddleware, adminMiddleware, getAllNotifications);

module.exports = router;

