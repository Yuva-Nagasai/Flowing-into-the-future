const express = require('express');
const {
  getHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide
} = require('../controllers/heroSlidesController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', getHeroSlides);
router.post('/', authMiddleware, adminMiddleware, createHeroSlide);
router.put('/:id', authMiddleware, adminMiddleware, updateHeroSlide);
router.delete('/:id', authMiddleware, adminMiddleware, deleteHeroSlide);

module.exports = router;

