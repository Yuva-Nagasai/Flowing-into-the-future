const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

const createPurchase = async (req, res) => {
  try {
    const { course_id, razorpay_payment_id, razorpay_order_id, amount } = req.body;
    const user_id = req.user.id;

    if (!course_id) {
      return res.status(400).json({ error: 'Course ID is required' });
    }

    const existingPurchase = await pool.query(
      'SELECT * FROM purchases WHERE user_id = ? AND course_id = ?',
      [user_id, course_id]
    );

    if (existingPurchase.rows.length > 0) {
      return res.status(400).json({ error: 'Course already purchased' });
    }

    const purchaseId = uuidv4();

    await pool.query(
      `INSERT INTO purchases (id, user_id, course_id, razorpay_payment_id, razorpay_order_id, amount, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [purchaseId, user_id, course_id, razorpay_payment_id || 'FREE', razorpay_order_id || null, amount || 0, 'completed']
    );

    const purchaseResult = await pool.query('SELECT * FROM purchases WHERE id = ?', [purchaseId]);

    res.status(201).json({ message: 'Purchase successful', purchase: purchaseResult.rows[0] });
  } catch (error) {
    console.error('Create purchase error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getUserPurchases = async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await pool.query(
      `SELECT 
        p.id AS purchase_id,
        p.user_id,
        p.course_id,
        p.amount,
        p.status,
        p.purchased_at,
        c.id AS course_id_alt,
        c.title,
        c.description,
        c.price,
        c.category,
        c.thumbnail,
        c.instructor_name
       FROM purchases p
       JOIN courses c ON p.course_id = c.id
       WHERE p.user_id = ?
       ORDER BY p.purchased_at DESC`,
      [user_id]
    );

    const purchases = result.rows.map(row => ({
      purchase_id: row.purchase_id,
      id: row.purchase_id,
      user_id: row.user_id,
      course_id: row.course_id,
      amount: row.amount,
      status: row.status,
      purchased_at: row.purchased_at,
      // Flatten course data for easier access
      course_title: row.title,
      course_description: row.description,
      course_price: row.price,
      course_category: row.category,
      course_thumbnail: row.thumbnail,
      course_instructor: row.instructor_name,
      // Also include nested course object for backward compatibility
      course: {
        id: row.course_id,
        title: row.title,
        description: row.description,
        price: row.price,
        category: row.category,
        thumbnail: row.thumbnail,
        instructor_name: row.instructor_name
      }
    }));

    res.json({ purchases });
  } catch (error) {
    console.error('Get purchases error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const checkPurchase = async (req, res) => {
  try {
    const { course_id } = req.params;
    const user_id = req.user.id;

    // Check if course is free
    const courseResult = await pool.query('SELECT free FROM courses WHERE id = ?', [course_id]);
    const isFreeCourse = courseResult.rows.length > 0 && courseResult.rows[0].free === true;

    // Check if user has purchased/enrolled
    const result = await pool.query(
      'SELECT * FROM purchases WHERE user_id = ? AND course_id = ?',
      [user_id, course_id]
    );

    // User has access if course is free OR they have purchased it
    const hasAccess = isFreeCourse || result.rows.length > 0;

    res.json({ 
      purchased: hasAccess,
      isFree: isFreeCourse,
      enrolled: result.rows.length > 0
    });
  } catch (error) {
    res.json({ purchased: false, isFree: false, enrolled: false });
  }
};

const getAllPurchases = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.name as user_name, u.email, c.title as course_title
       FROM purchases p
       JOIN users u ON p.user_id = u.id
       JOIN courses c ON p.course_id = c.id
       ORDER BY p.purchased_at DESC`
    );

    res.json({ purchases: result.rows });
  } catch (error) {
    console.error('Get all purchases error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get student list per course (admin)
const getStudentsByCourse = async (req, res) => {
  try {
    const { course_id } = req.params;

    const result = await pool.query(
      `SELECT 
        p.*,
        u.id as user_id,
        u.name as user_name,
        u.email as user_email,
        u.created_at as user_joined_at,
        c.title as course_title,
        COUNT(DISTINCT CASE WHEN up.completed = true THEN up.lesson_id END) as completed_lessons,
        COUNT(DISTINCT l.id) as total_lessons
       FROM purchases p
       JOIN users u ON p.user_id = u.id
       JOIN courses c ON p.course_id = c.id
       LEFT JOIN modules m ON c.id = m.course_id
       LEFT JOIN lessons l ON m.id = l.module_id
       LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = u.id
       WHERE p.course_id = ?
       GROUP BY p.id, u.id, u.name, u.email, u.created_at, c.title
       ORDER BY p.purchased_at DESC`,
      [course_id]
    );

    const students = result.rows.map(row => ({
      purchase_id: row.id,
      user_id: row.user_id,
      user_name: row.user_name,
      user_email: row.user_email,
      user_joined_at: row.user_joined_at,
      course_title: row.course_title,
      purchased_at: row.purchased_at,
      amount: row.amount,
      status: row.status,
      progress: {
        completed_lessons: parseInt(row.completed_lessons) || 0,
        total_lessons: parseInt(row.total_lessons) || 0,
        progress_percentage: row.total_lessons > 0 
          ? Math.round((row.completed_lessons / row.total_lessons) * 100)
          : 0
      }
    }));

    res.json({ students, count: students.length });
  } catch (error) {
    console.error('Get students by course error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createPurchase,
  getUserPurchases,
  checkPurchase,
  getAllPurchases,
  getStudentsByCourse
};
