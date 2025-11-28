const express = require('express');
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCoursesAdmin,
  getCourseDetailsAdmin
} = require('../controllers/courseController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllCourses);
router.get('/admin/all', authMiddleware, adminMiddleware, getAllCoursesAdmin);
router.get('/admin/:id', authMiddleware, adminMiddleware, getCourseDetailsAdmin);
router.get('/:id', getCourseById);
router.post('/', authMiddleware, adminMiddleware, createCourse);
router.put('/:id', authMiddleware, adminMiddleware, updateCourse);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCourse);

module.exports = router;
