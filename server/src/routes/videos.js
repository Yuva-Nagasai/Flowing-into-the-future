const express = require('express');
const {
  addVideo,
  updateVideo,
  deleteVideo,
  addResource,
  deleteResource,
  getResourcesByModule
} = require('../controllers/videoController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, adminMiddleware, addVideo);
router.put('/:id', authMiddleware, adminMiddleware, updateVideo);
router.delete('/:id', authMiddleware, adminMiddleware, deleteVideo);
router.post('/resources', authMiddleware, adminMiddleware, addResource);
router.delete('/resources/:id', authMiddleware, adminMiddleware, deleteResource);
router.get('/resources/module/:module_id', authMiddleware, getResourcesByModule);

module.exports = router;
