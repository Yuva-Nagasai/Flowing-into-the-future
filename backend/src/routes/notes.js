const express = require('express');
const {
  saveNote,
  getLessonNotes,
  getCourseNotes,
  deleteNote
} = require('../controllers/noteController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, saveNote);
router.get('/lesson/:lesson_id', authMiddleware, getLessonNotes);
router.get('/course/:course_id', authMiddleware, getCourseNotes);
router.delete('/:id', authMiddleware, deleteNote);

module.exports = router;

