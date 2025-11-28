const express = require('express');
const {
  getModulesByCourse,
  createModule,
  updateModule,
  deleteModule,
  createLesson,
  updateLesson,
  deleteLesson
} = require('../controllers/moduleController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/course/:course_id', authMiddleware, getModulesByCourse);
router.post('/module', authMiddleware, adminMiddleware, createModule);
router.put('/module/:id', authMiddleware, adminMiddleware, updateModule);
router.delete('/module/:id', authMiddleware, adminMiddleware, deleteModule);
router.post('/lesson', authMiddleware, adminMiddleware, createLesson);
router.put('/lesson/:id', authMiddleware, adminMiddleware, updateLesson);
router.delete('/lesson/:id', authMiddleware, adminMiddleware, deleteLesson);

module.exports = router;

