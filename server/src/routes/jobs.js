const express = require('express');
const {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob
} = require('../controllers/jobController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Public route - get active jobs
router.get('/', getAllJobs);

// Admin routes
router.get('/admin/all', authMiddleware, adminMiddleware, getAllJobs);
router.get('/:id', getJobById);
router.post('/', authMiddleware, adminMiddleware, createJob);
router.put('/:id', authMiddleware, adminMiddleware, updateJob);
router.delete('/:id', authMiddleware, adminMiddleware, deleteJob);

module.exports = router;

