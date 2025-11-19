const express = require('express');
const {
  createDiscussion,
  getDiscussions,
  getDiscussionById,
  createReply,
  deleteDiscussion
} = require('../controllers/discussionController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, createDiscussion);
router.get('/', authMiddleware, getDiscussions);
router.get('/:id', authMiddleware, getDiscussionById);
router.post('/:id/reply', authMiddleware, createReply);
router.delete('/:id', authMiddleware, deleteDiscussion);

module.exports = router;

