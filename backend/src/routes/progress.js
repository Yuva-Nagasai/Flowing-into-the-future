const express = require('express');
const {
  updateProgress,
  getCourseProgress,
  getUserProgress,
  getAllProgress
} = require('../controllers/progressController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, updateProgress);
router.get('/course/:course_id', authMiddleware, getCourseProgress);
router.get('/user', authMiddleware, getUserProgress);
router.get('/all', authMiddleware, adminMiddleware, getAllProgress);

module.exports = router;

