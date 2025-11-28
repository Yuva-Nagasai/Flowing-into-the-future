const express = require('express');
const {
  getAllAboutSections,
  getAllAboutSectionsAdmin,
  getAboutSectionByType,
  upsertAboutSection,
  deleteAboutSection
} = require('../controllers/aboutController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getAllAboutSections);
router.get('/type/:type', getAboutSectionByType);

// Admin routes
router.get('/admin/all', authMiddleware, adminMiddleware, getAllAboutSectionsAdmin);
router.post('/', authMiddleware, adminMiddleware, upsertAboutSection);
router.put('/:id', authMiddleware, adminMiddleware, upsertAboutSection);
router.delete('/:id', authMiddleware, adminMiddleware, deleteAboutSection);

module.exports = router;

