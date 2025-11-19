const pool = require('../config/db');

// Get quizzes by course (admin)
const getQuizzesByCourse = async (req, res) => {
  try {
    const { course_id } = req.params;

    const result = await pool.query(
      `SELECT q.*, l.title as lesson_title, l.order_index as lesson_order, m.title as module_title
       FROM quizzes q
       JOIN lessons l ON q.lesson_id = l.id
       JOIN modules m ON l.module_id = m.id
       WHERE q.course_id = $1
       ORDER BY m.order_index, l.order_index, q.order_index`,
      [course_id]
    );

    res.json({ quizzes: result.rows });
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get quizzes by lesson (legacy support)
const getQuizzesByLesson = async (req, res) => {
  try {
    const { lesson_id } = req.params;

    const result = await pool.query(
      'SELECT * FROM quizzes WHERE lesson_id = $1 ORDER BY order_index ASC',
      [lesson_id]
    );

    res.json({ quizzes: result.rows });
  } catch (error) {
    console.error('Get quizzes by lesson error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get quizzes by module
const getQuizzesByModule = async (req, res) => {
  try {
    const { module_id } = req.params;

    const result = await pool.query(
      'SELECT * FROM quizzes WHERE module_id = $1 ORDER BY order_index ASC',
      [module_id]
    );

    res.json({ quizzes: result.rows });
  } catch (error) {
    console.error('Get quizzes by module error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create quiz
const createQuiz = async (req, res) => {
  try {
    const { lesson_id, module_id, course_id, question, options, correct_answer, points, order_index } = req.body;

    // Require either module_id or lesson_id (for backward compatibility)
    if ((!module_id && !lesson_id) || !course_id || !question || !options || correct_answer === undefined) {
      return res.status(400).json({ error: 'Missing required fields: module_id or lesson_id, course_id, question, options, and correct_answer are required' });
    }

    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ error: 'Options must be an array with at least 2 items' });
    }

    if (correct_answer < 0 || correct_answer >= options.length) {
      return res.status(400).json({ error: 'Invalid correct_answer index' });
    }

    const result = await pool.query(
      `INSERT INTO quizzes (lesson_id, module_id, course_id, question, options, correct_answer, points, order_index)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [lesson_id || null, module_id || null, course_id, question, options, correct_answer, points || 1, order_index || 0]
    );

    res.status(201).json({ message: 'Quiz created successfully', quiz: result.rows[0] });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update quiz
const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, options, correct_answer, points, order_index } = req.body;

    const updates = [];
    const params = [];
    let paramCount = 1;

    if (question !== undefined) {
      updates.push(`question = $${paramCount++}`);
      params.push(question);
    }
    if (options !== undefined) {
      if (!Array.isArray(options) || options.length < 2) {
        return res.status(400).json({ error: 'Options must be an array with at least 2 items' });
      }
      updates.push(`options = $${paramCount++}`);
      params.push(options);
    }
    if (correct_answer !== undefined) {
      if (options && (correct_answer < 0 || correct_answer >= options.length)) {
        return res.status(400).json({ error: 'Invalid correct_answer index' });
      }
      updates.push(`correct_answer = $${paramCount++}`);
      params.push(correct_answer);
    }
    if (points !== undefined) {
      updates.push(`points = $${paramCount++}`);
      params.push(points);
    }
    if (order_index !== undefined) {
      updates.push(`order_index = $${paramCount++}`);
      params.push(order_index);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(id);
    const query = `UPDATE quizzes SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;

    const result = await pool.query(query, params);

    res.json({ message: 'Quiz updated successfully', quiz: result.rows[0] });
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete quiz
const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM quizzes WHERE id = $1', [id]);

    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Submit quiz attempt
const submitQuizAttempt = async (req, res) => {
  try {
    const { quiz_id, lesson_id, course_id, selected_answer } = req.body;
    const user_id = req.user.id;

    if (!quiz_id || !lesson_id || !course_id || selected_answer === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get quiz details
    const quizResult = await pool.query('SELECT * FROM quizzes WHERE id = $1', [quiz_id]);
    if (quizResult.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const quiz = quizResult.rows[0];
    const is_correct = selected_answer === quiz.correct_answer;
    const score = is_correct ? quiz.points : 0;

    // Store quiz attempt
    const attemptResult = await pool.query(
      `INSERT INTO quiz_attempts (user_id, quiz_id, lesson_id, course_id, selected_answer, is_correct, score)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [user_id, quiz_id, lesson_id, course_id, selected_answer, is_correct, score]
    );

    res.status(201).json({
      message: 'Quiz attempt submitted',
      attempt: attemptResult.rows[0],
      is_correct,
      score
    });
  } catch (error) {
    console.error('Submit quiz attempt error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get quiz scores for a course (admin)
const getQuizScoresByCourse = async (req, res) => {
  try {
    const { course_id } = req.params;

    const result = await pool.query(
      `SELECT 
        qa.*,
        q.question,
        u.name as user_name,
        u.email as user_email,
        l.title as lesson_title
       FROM quiz_attempts qa
       JOIN quizzes q ON qa.quiz_id = q.id
       JOIN users u ON qa.user_id = u.id
       JOIN lessons l ON qa.lesson_id = l.id
       WHERE qa.course_id = $1
       ORDER BY qa.attempted_at DESC`,
      [course_id]
    );

    res.json({ attempts: result.rows });
  } catch (error) {
    console.error('Get quiz scores error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user quiz scores
const getUserQuizScores = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { course_id } = req.query;

    let query = `
      SELECT 
        qa.*,
        q.question,
        l.title as lesson_title,
        c.title as course_title
       FROM quiz_attempts qa
       JOIN quizzes q ON qa.quiz_id = q.id
       JOIN lessons l ON qa.lesson_id = l.id
       JOIN courses c ON qa.course_id = c.id
       WHERE qa.user_id = $1
    `;
    const params = [user_id];

    if (course_id) {
      query += ' AND qa.course_id = $2';
      params.push(course_id);
    }

    query += ' ORDER BY qa.attempted_at DESC';

    const result = await pool.query(query, params);

    res.json({ attempts: result.rows });
  } catch (error) {
    console.error('Get user quiz scores error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getQuizzesByCourse,
  getQuizzesByLesson,
  getQuizzesByModule,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuizAttempt,
  getQuizScoresByCourse,
  getUserQuizScores
};

