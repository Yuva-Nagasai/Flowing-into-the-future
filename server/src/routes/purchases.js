const express = require('express');
const {
  createPurchase,
  getUserPurchases,
  checkPurchase,
  getAllPurchases,
  getStudentsByCourse
} = require('../controllers/purchaseController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, createPurchase);
router.get('/my-purchases', authMiddleware, getUserPurchases);
router.get('/check/:course_id', authMiddleware, checkPurchase);
router.get('/all', authMiddleware, adminMiddleware, getAllPurchases);
router.get('/course/:course_id/students', authMiddleware, adminMiddleware, getStudentsByCourse);

module.exports = router;
