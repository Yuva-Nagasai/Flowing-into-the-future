const express = require('express');
const {
  getAllAITools,
  getAIToolById,
  createAITool,
  updateAITool,
  deleteAITool
} = require('../controllers/aiToolController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Public route - get active tools
router.get('/', getAllAITools);

// Admin routes
router.get('/admin/all', authMiddleware, adminMiddleware, getAllAITools);
router.get('/:id', getAIToolById);
router.post('/', authMiddleware, adminMiddleware, createAITool);
router.put('/:id', authMiddleware, adminMiddleware, updateAITool);
router.delete('/:id', authMiddleware, adminMiddleware, deleteAITool);

module.exports = router;

