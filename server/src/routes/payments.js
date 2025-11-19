const express = require('express');
const {
  createOrder,
  verifyPayment,
  getPaymentHistory,
  enrollFree
} = require('../controllers/paymentController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/create-order', authMiddleware, createOrder);
router.post('/verify', authMiddleware, verifyPayment);
router.post('/enroll-free', authMiddleware, enrollFree);
router.get('/history', authMiddleware, getPaymentHistory);

module.exports = router;

