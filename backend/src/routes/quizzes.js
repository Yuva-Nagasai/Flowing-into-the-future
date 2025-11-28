const express = require('express');
const {
  getQuizzesByCourse,
  getQuizzesByLesson,
  getQuizzesByModule,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuizAttempt,
  getQuizScoresByCourse,
  getUserQuizScores
} = require('../controllers/quizController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Admin routes
router.get('/course/:course_id', authMiddleware, adminMiddleware, getQuizzesByCourse);
router.get('/course/:course_id/scores', authMiddleware, adminMiddleware, getQuizScoresByCourse);
router.post('/', authMiddleware, adminMiddleware, createQuiz);
router.put('/:id', authMiddleware, adminMiddleware, updateQuiz);
router.delete('/:id', authMiddleware, adminMiddleware, deleteQuiz);

// User routes
router.get('/lesson/:lesson_id', authMiddleware, getQuizzesByLesson);
router.get('/module/:module_id', authMiddleware, getQuizzesByModule);
router.post('/attempt', authMiddleware, submitQuizAttempt);
router.get('/scores', authMiddleware, getUserQuizScores);

module.exports = router;

