const pool = require('../config/db');

// Create discussion
const createDiscussion = async (req, res) => {
  try {
    const { course_id, lesson_id, title, content } = req.body;
    const user_id = req.user.id;

    if (!course_id || !title || !content) {
      return res.status(400).json({ error: 'Course ID, title, and content are required' });
    }

    const result = await pool.query(
      `INSERT INTO discussions (user_id, course_id, lesson_id, title, content)
       VALUES (?, ?, ?, ?, ?) RETURNING *`,
      [user_id, course_id, lesson_id || null, title, content]
    );

    // Get user details for response
    const userResult = await pool.query('SELECT name, email FROM users WHERE id = ?', [user_id]);
    const discussion = {
      ...result.rows[0],
      user_name: userResult.rows[0]?.name,
      user_email: userResult.rows[0]?.email
    };

    res.status(201).json({ message: 'Discussion created successfully', discussion });
  } catch (error) {
    console.error('Create discussion error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get discussions for a course or lesson
const getDiscussions = async (req, res) => {
  try {
    const { course_id, lesson_id } = req.query;
    const user_id = req.user.id;

    let query = `
      SELECT 
        d.*,
        u.name as user_name,
        u.email as user_email,
        COUNT(dr.id) as reply_count
      FROM discussions d
      JOIN users u ON d.user_id = u.id
      LEFT JOIN discussion_replies dr ON d.id = dr.discussion_id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (course_id) {
      query += ` AND d.course_id = $${paramCount++}`;
      params.push(course_id);
    }

    if (lesson_id) {
      query += ` AND d.lesson_id = $${paramCount++}`;
      params.push(lesson_id);
    }

    query += ` GROUP BY d.id, u.name, u.email ORDER BY d.created_at DESC`;

    const result = await pool.query(query, params);

    res.json({ discussions: result.rows });
  } catch (error) {
    console.error('Get discussions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get single discussion with replies
const getDiscussionById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get discussion
    const discussionResult = await pool.query(
      `SELECT 
        d.*,
        u.name as user_name,
        u.email as user_email
       FROM discussions d
       JOIN users u ON d.user_id = u.id
       WHERE d.id = ?`,
      [id]
    );

    if (discussionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Discussion not found' });
    }

    // Get replies
    const repliesResult = await pool.query(
      `SELECT 
        dr.*,
        u.name as user_name,
        u.email as user_email
       FROM discussion_replies dr
       JOIN users u ON dr.user_id = u.id
       WHERE dr.discussion_id = ?
       ORDER BY dr.created_at ASC`,
      [id]
    );

    res.json({
      discussion: discussionResult.rows[0],
      replies: repliesResult.rows
    });
  } catch (error) {
    console.error('Get discussion error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create reply
const createReply = async (req, res) => {
  try {
    const { discussion_id, content } = req.body;
    const user_id = req.user.id;

    if (!discussion_id || !content) {
      return res.status(400).json({ error: 'Discussion ID and content are required' });
    }

    const result = await pool.query(
      `INSERT INTO discussion_replies (discussion_id, user_id, content)
       VALUES (?, ?, ?) RETURNING *`,
      [discussion_id, user_id, content]
    );

    // Get user details
    const userResult = await pool.query('SELECT name, email FROM users WHERE id = ?', [user_id]);
    const reply = {
      ...result.rows[0],
      user_name: userResult.rows[0]?.name,
      user_email: userResult.rows[0]?.email
    };

    res.status(201).json({ message: 'Reply created successfully', reply });
  } catch (error) {
    console.error('Create reply error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete discussion
const deleteDiscussion = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Check if user owns the discussion
    const discussionResult = await pool.query(
      'SELECT * FROM discussions WHERE id = ? AND user_id = ?',
      [id, user_id]
    );

    if (discussionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Discussion not found or unauthorized' });
    }

    await pool.query('DELETE FROM discussions WHERE id = ?', [id]);

    res.json({ message: 'Discussion deleted successfully' });
  } catch (error) {
    console.error('Delete discussion error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createDiscussion,
  getDiscussions,
  getDiscussionById,
  createReply,
  deleteDiscussion
};

