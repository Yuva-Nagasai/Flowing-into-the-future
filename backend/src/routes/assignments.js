const express = require('express');
const {
  getAssignmentsByCourse,
  getAssignmentsByLesson,
  getAssignmentsByModule,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  gradeAssignment,
  getSubmissionsByCourse,
  getUserSubmissions
} = require('../controllers/assignmentController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Admin routes
router.get('/course/:course_id', authMiddleware, adminMiddleware, getAssignmentsByCourse);
router.get('/course/:course_id/submissions', authMiddleware, adminMiddleware, getSubmissionsByCourse);
router.post('/', authMiddleware, adminMiddleware, createAssignment);
router.put('/:id', authMiddleware, adminMiddleware, updateAssignment);
router.delete('/:id', authMiddleware, adminMiddleware, deleteAssignment);
router.put('/submission/:id/grade', authMiddleware, adminMiddleware, gradeAssignment);

// User routes
router.get('/lesson/:lesson_id', authMiddleware, getAssignmentsByLesson);
router.get('/module/:module_id', authMiddleware, getAssignmentsByModule);
router.post('/submit', authMiddleware, submitAssignment);
router.get('/submissions', authMiddleware, getUserSubmissions);

module.exports = router;

