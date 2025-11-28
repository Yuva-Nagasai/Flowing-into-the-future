const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

// Get assignments by course (admin)
const getAssignmentsByCourse = async (req, res) => {
  try {
    const { course_id } = req.params;

    const result = await pool.query(
      `SELECT a.*, l.title as lesson_title, l.order_index as lesson_order, m.title as module_title
       FROM assignments a
       JOIN lessons l ON a.lesson_id = l.id
       JOIN modules m ON l.module_id = m.id
       WHERE a.course_id = ?
       ORDER BY m.order_index, l.order_index, a.created_at DESC`,
      [course_id]
    );

    res.json({ assignments: result.rows });
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get assignments by lesson (legacy support)
const getAssignmentsByLesson = async (req, res) => {
  try {
    const { lesson_id } = req.params;

    const result = await pool.query(
      'SELECT * FROM assignments WHERE lesson_id = ? ORDER BY created_at DESC',
      [lesson_id]
    );

    res.json({ assignments: result.rows });
  } catch (error) {
    console.error('Get assignments by lesson error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get assignments by module
const getAssignmentsByModule = async (req, res) => {
  try {
    const { module_id } = req.params;

    const result = await pool.query(
      'SELECT * FROM assignments WHERE module_id = ? ORDER BY created_at DESC',
      [module_id]
    );

    res.json({ assignments: result.rows });
  } catch (error) {
    console.error('Get assignments by module error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create assignment
const createAssignment = async (req, res) => {
  try {
    const { lesson_id, module_id, course_id, title, description, due_date, max_points } = req.body;

    // Require either module_id or lesson_id (for backward compatibility)
    if ((!module_id && !lesson_id) || !course_id || !title || !description) {
      return res.status(400).json({ error: 'Missing required fields: module_id or lesson_id, course_id, title, and description are required' });
    }

    const assignmentId = uuidv4();
    await pool.query(
      `INSERT INTO assignments (id, lesson_id, module_id, course_id, title, description, due_date, max_points)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [assignmentId, lesson_id || null, module_id || null, course_id, title, description, due_date || null, max_points || 100]
    );

    const assignmentResult = await pool.query('SELECT * FROM assignments WHERE id = ?', [assignmentId]);

    res.status(201).json({ message: 'Assignment created successfully', assignment: assignmentResult.rows[0] });
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update assignment
const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, due_date, max_points } = req.body;

    const existingAssignment = await pool.query('SELECT * FROM assignments WHERE id = ?', [id]);
    if (existingAssignment.rows.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const updates = [];
    const params = [];

    if (title !== undefined) {
      updates.push('title = ?');
      params.push(title);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }
    if (due_date !== undefined) {
      updates.push('due_date = ?');
      params.push(due_date);
    }
    if (max_points !== undefined) {
      updates.push('max_points = ?');
      params.push(max_points);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(id);
    const query = `UPDATE assignments SET ${updates.join(', ')} WHERE id = ?`;

    await pool.query(query, params);

    const updatedAssignment = await pool.query('SELECT * FROM assignments WHERE id = ?', [id]);

    res.json({ message: 'Assignment updated successfully', assignment: updatedAssignment.rows[0] });
  } catch (error) {
    console.error('Update assignment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete assignment
const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM assignments WHERE id = ?', [id]);

    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Delete assignment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Submit assignment
const submitAssignment = async (req, res) => {
  try {
    const { assignment_id, lesson_id, course_id, submission_text, submission_file_url } = req.body;
    const user_id = req.user.id;

    if (!assignment_id || !lesson_id || !course_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!submission_text && !submission_file_url) {
      return res.status(400).json({ error: 'Either submission text or file URL is required' });
    }

    // Check if already submitted
    const existingSubmission = await pool.query(
      'SELECT * FROM assignment_submissions WHERE user_id = ? AND assignment_id = ?',
      [user_id, assignment_id]
    );

    if (existingSubmission.rows.length > 0) {
      return res.status(400).json({ error: 'Assignment already submitted' });
    }

    const submissionId = uuidv4();
    await pool.query(
      `INSERT INTO assignment_submissions (id, user_id, assignment_id, lesson_id, course_id, submission_text, submission_file_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [submissionId, user_id, assignment_id, lesson_id, course_id, submission_text || null, submission_file_url || null]
    );

    const submissionResult = await pool.query('SELECT * FROM assignment_submissions WHERE id = ?', [submissionId]);

    res.status(201).json({ message: 'Assignment submitted successfully', submission: submissionResult.rows[0] });
  } catch (error) {
    console.error('Submit assignment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Grade assignment (admin)
const gradeAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { score, feedback } = req.body;

    if (score === undefined) {
      return res.status(400).json({ error: 'Score is required' });
    }

    const existingSubmission = await pool.query('SELECT * FROM assignment_submissions WHERE id = ?', [id]);
    if (existingSubmission.rows.length === 0) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    await pool.query(
      `UPDATE assignment_submissions 
       SET score = ?, feedback = ?, graded_at = NOW() 
       WHERE id = ?`,
      [score, feedback || null, id]
    );

    const updatedSubmission = await pool.query('SELECT * FROM assignment_submissions WHERE id = ?', [id]);

    res.json({ message: 'Assignment graded successfully', submission: updatedSubmission.rows[0] });
  } catch (error) {
    console.error('Grade assignment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get assignment submissions by course (admin)
const getSubmissionsByCourse = async (req, res) => {
  try {
    const { course_id } = req.params;

    const result = await pool.query(
      `SELECT 
        asub.*,
        a.title as assignment_title,
        u.name as user_name,
        u.email as user_email,
        l.title as lesson_title
       FROM assignment_submissions asub
       JOIN assignments a ON asub.assignment_id = a.id
       JOIN users u ON asub.user_id = u.id
       JOIN lessons l ON asub.lesson_id = l.id
       WHERE asub.course_id = ?
       ORDER BY asub.submitted_at DESC`,
      [course_id]
    );

    res.json({ submissions: result.rows });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user assignment submissions
const getUserSubmissions = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { course_id } = req.query;

    let query = `
      SELECT 
        asub.*,
        a.title as assignment_title,
        a.description as assignment_description,
        a.max_points,
        l.title as lesson_title,
        c.title as course_title
       FROM assignment_submissions asub
       JOIN assignments a ON asub.assignment_id = a.id
       JOIN lessons l ON asub.lesson_id = l.id
       JOIN courses c ON asub.course_id = c.id
       WHERE asub.user_id = ?
    `;
    const params = [user_id];

    if (course_id) {
      query += ' AND asub.course_id = ?';
      params.push(course_id);
    }

    query += ' ORDER BY asub.submitted_at DESC';

    const result = await pool.query(query, params);

    res.json({ submissions: result.rows });
  } catch (error) {
    console.error('Get user submissions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAssignmentsByCourse,
  getAssignmentsByLesson,
  getAssignmentsByModule,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  gradeAssignment,
  getSubmissionsByCourse,
  getUserSubmissions
};

