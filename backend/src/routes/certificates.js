const express = require('express');
const {
  generateCertificate,
  getUserCertificates,
  getCertificateById
} = require('../controllers/certificateController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/course/:course_id', authMiddleware, generateCertificate);
router.get('/user', authMiddleware, getUserCertificates);
router.get('/:id', authMiddleware, getCertificateById);

module.exports = router;

