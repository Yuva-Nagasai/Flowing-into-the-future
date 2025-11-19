const pool = require('../config/db');
const Razorpay = require('razorpay');

// Initialize Razorpay
let razorpay;
try {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.warn('⚠️ Razorpay credentials not configured. Payment features will not work.');
    razorpay = null;
  } else {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    console.log('✅ Razorpay initialized successfully');
  }
} catch (error) {
  console.error('❌ Error initializing Razorpay:', error);
  razorpay = null;
}

// Create Razorpay order
const createOrder = async (req, res) => {
  try {
    // Check if Razorpay is configured
    if (!razorpay) {
      return res.status(503).json({ 
        error: 'Payment gateway not configured',
        message: 'Razorpay credentials are missing. Please configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables.'
      });
    }

    const { course_id, amount } = req.body;
    const user_id = req.user.id;

    if (!course_id || !amount) {
      return res.status(400).json({ error: 'Course ID and amount are required' });
    }

    // Validate amount
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Get course details
    const courseResult = await pool.query('SELECT * FROM courses WHERE id = $1', [course_id]);
    if (courseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if already purchased
    const purchaseCheck = await pool.query(
      'SELECT * FROM purchases WHERE user_id = $1 AND course_id = $2',
      [user_id, course_id]
    );

    if (purchaseCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Course already purchased' });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(numericAmount * 100), // Razorpay amount in paise (must be integer)
      currency: 'INR',
      receipt: `course_${course_id}_${user_id}_${Date.now()}`,
      notes: {
        course_id,
        user_id,
        course_title: courseResult.rows[0].title
      }
    };

    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create(options);
    } catch (razorpayError) {
      console.error('Razorpay API error:', razorpayError);
      return res.status(502).json({ 
        error: 'Payment gateway error',
        message: razorpayError.error?.description || razorpayError.message || 'Failed to create payment order'
      });
    }

    // Store order in database
    let orderResult;
    try {
      orderResult = await pool.query(
        `INSERT INTO payment_orders (user_id, course_id, razorpay_order_id, amount, currency, status)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [user_id, course_id, razorpayOrder.id, numericAmount, 'INR', 'pending']
      );
    } catch (dbError) {
      console.error('Database error storing order:', dbError);
      // If table doesn't exist, provide helpful error
      if (dbError.code === '42P01') {
        return res.status(500).json({ 
          error: 'Database error',
          message: 'payment_orders table does not exist. Please run the database migrations.',
          details: dbError.message
        });
      }
      throw dbError;
    }

    res.status(201).json({
      message: 'Order created successfully',
      order: orderResult.rows[0],
      razorpay_order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key_id: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ 
      error: 'Server error', 
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Verify payment
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, course_id } = req.body;
    const user_id = req.user.id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !course_id) {
      return res.status(400).json({ error: 'All payment details are required' });
    }

    // Verify signature
    const crypto = require('crypto');
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Get order from database
    const orderResult = await pool.query(
      'SELECT * FROM payment_orders WHERE razorpay_order_id = $1 AND user_id = $2',
      [razorpay_order_id, user_id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];

    // Update order status
    await pool.query(
      `UPDATE payment_orders 
       SET status = 'paid', razorpay_payment_id = $1, updated_at = NOW() 
       WHERE id = $2`,
      [razorpay_payment_id, order.id]
    );

    // Create purchase
    const purchaseResult = await pool.query(
      `INSERT INTO purchases (user_id, course_id, razorpay_payment_id, razorpay_order_id, amount, status)
       VALUES ($1, $2, $3, $4, $5, $6) 
       ON CONFLICT (user_id, course_id) DO NOTHING
       RETURNING *`,
      [user_id, course_id, razorpay_payment_id, razorpay_order_id, order.amount, 'completed']
    );

    if (purchaseResult.rows.length === 0) {
      // Already purchased
      return res.status(400).json({ error: 'Course already purchased' });
    }

    // Send email notification
    try {
      const { sendEmail, templates } = require('../services/emailService');
      const userResult = await pool.query('SELECT name, email FROM users WHERE id = $1', [user_id]);
      const courseResult = await pool.query('SELECT title FROM courses WHERE id = $1', [course_id]);
      
      if (userResult.rows.length > 0 && courseResult.rows.length > 0) {
        const user = userResult.rows[0];
        const course = courseResult.rows[0];
        const emailTemplate = templates.paymentSuccess(
          user.name,
          course.title,
          order.amount,
          razorpay_order_id
        );
        
        await sendEmail(user.email, emailTemplate.subject, emailTemplate.html, null, user_id, 'payment_success');
      }
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
      // Don't fail the request if email fails
    }

    res.json({
      message: 'Payment verified and course enrolled successfully',
      purchase: purchaseResult.rows[0]
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Get payment history
const getPaymentHistory = async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await pool.query(
      `SELECT 
        po.*,
        c.title as course_title,
        c.thumbnail
       FROM payment_orders po
       JOIN courses c ON po.course_id = c.id
       WHERE po.user_id = $1
       ORDER BY po.created_at DESC`,
      [user_id]
    );

    res.json({ payments: result.rows });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Enroll in free course
const enrollFree = async (req, res) => {
  try {
    const { course_id } = req.body;
    const user_id = req.user.id;

    if (!course_id) {
      return res.status(400).json({ error: 'Course ID is required' });
    }

    // Get course details and check if it's free
    const courseResult = await pool.query('SELECT * FROM courses WHERE id = $1', [course_id]);
    if (courseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const course = courseResult.rows[0];
    if (!course.free) {
      return res.status(400).json({ error: 'This course is not free. Please use checkout for paid courses.' });
    }

    // Check if already enrolled
    const purchaseCheck = await pool.query(
      'SELECT * FROM purchases WHERE user_id = $1 AND course_id = $2',
      [user_id, course_id]
    );

    if (purchaseCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Course already enrolled' });
    }

    // Create free purchase
    const purchaseResult = await pool.query(
      `INSERT INTO purchases (user_id, course_id, razorpay_payment_id, razorpay_order_id, amount, status)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [user_id, course_id, 'FREE', null, 0, 'completed']
    );

    res.status(201).json({
      message: 'Successfully enrolled in free course',
      purchase: purchaseResult.rows[0]
    });
  } catch (error) {
    console.error('Free enrollment error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getPaymentHistory,
  enrollFree
};

