const pool = require('../config/db');
const { sendEmail, templates } = require('../services/emailService');

// Get all modules for a course
const getModulesByCourse = async (req, res) => {
  try {
    const { course_id } = req.params;
    
    const modulesResult = await pool.query(
      `SELECT m.*, 
        COUNT(l.id) as lesson_count
       FROM modules m
       LEFT JOIN lessons l ON m.id = l.module_id
       WHERE m.course_id = $1
       GROUP BY m.id
       ORDER BY m.order_index ASC`,
      [course_id]
    );

    // Get lessons for each module
    const modules = await Promise.all(
      modulesResult.rows.map(async (module) => {
        const lessonsResult = await pool.query(
          `SELECT l.*, 
            COUNT(q.id) as quiz_count,
            COUNT(a.id) as assignment_count
           FROM lessons l
           LEFT JOIN quizzes q ON l.id = q.lesson_id
           LEFT JOIN assignments a ON l.id = a.lesson_id
           WHERE l.module_id = $1
           GROUP BY l.id
           ORDER BY l.order_index ASC`,
          [module.id]
        );
        return {
          ...module,
          lessons: lessonsResult.rows
        };
      })
    );

    res.json({ modules });
  } catch (error) {
    console.error('Get modules error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create module
const createModule = async (req, res) => {
  try {
    const { course_id, title, description, order_index } = req.body;

    if (!course_id || !title) {
      return res.status(400).json({ error: 'Course ID and title are required' });
    }

    const result = await pool.query(
      `INSERT INTO modules (course_id, title, description, order_index)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [course_id, title, description || null, order_index || 0]
    );

    // Send course update notification to enrolled students
    try {
      await sendCourseUpdateNotification(course_id);
    } catch (notifError) {
      console.error('Error sending course update notification:', notifError);
      // Don't fail the request if notification fails
    }

    res.status(201).json({ message: 'Module created successfully', module: result.rows[0] });
  } catch (error) {
    console.error('Create module error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update module
const updateModule = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, order_index } = req.body;

    const updates = [];
    const params = [];
    let paramCount = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramCount++}`);
      params.push(title);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      params.push(description);
    }
    if (order_index !== undefined) {
      updates.push(`order_index = $${paramCount++}`);
      params.push(order_index);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(id);
    const query = `UPDATE modules SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;

    const result = await pool.query(query, params);

    res.json({ message: 'Module updated successfully', module: result.rows[0] });
  } catch (error) {
    console.error('Update module error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete module
const deleteModule = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM modules WHERE id = $1', [id]);

    res.json({ message: 'Module deleted successfully' });
  } catch (error) {
    console.error('Delete module error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create lesson
const createLesson = async (req, res) => {
  try {
    const { module_id, course_id, title, description, video_url, video_duration, content_type, order_index } = req.body;

    if (!module_id || !course_id || !title) {
      return res.status(400).json({ error: 'Module ID, Course ID, and title are required' });
    }

    const result = await pool.query(
      `INSERT INTO lessons (module_id, course_id, title, description, video_url, video_duration, content_type, order_index)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [module_id, course_id, title, description || null, video_url || null, video_duration || '0:00', content_type || 'video', order_index || 0]
    );

    // Send course update notification to enrolled students
    try {
      await sendCourseUpdateNotification(course_id);
    } catch (notifError) {
      console.error('Error sending course update notification:', notifError);
      // Don't fail the request if notification fails
    }

    res.status(201).json({ message: 'Lesson created successfully', lesson: result.rows[0] });
  } catch (error) {
    console.error('Create lesson error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update lesson
const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, video_url, video_duration, content_type, order_index } = req.body;

    const updates = [];
    const params = [];
    let paramCount = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramCount++}`);
      params.push(title);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      params.push(description);
    }
    if (video_url !== undefined) {
      updates.push(`video_url = $${paramCount++}`);
      params.push(video_url);
    }
    if (video_duration !== undefined) {
      updates.push(`video_duration = $${paramCount++}`);
      params.push(video_duration);
    }
    if (content_type !== undefined) {
      updates.push(`content_type = $${paramCount++}`);
      params.push(content_type);
    }
    if (order_index !== undefined) {
      updates.push(`order_index = $${paramCount++}`);
      params.push(order_index);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(id);
    const query = `UPDATE lessons SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;

    const result = await pool.query(query, params);

    res.json({ message: 'Lesson updated successfully', lesson: result.rows[0] });
  } catch (error) {
    console.error('Update lesson error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete lesson
const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM lessons WHERE id = $1', [id]);

    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Delete lesson error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Helper function to send course update notifications
const sendCourseUpdateNotification = async (course_id) => {
  try {
    // Get course details
    const courseResult = await pool.query('SELECT title FROM courses WHERE id = $1', [course_id]);
    if (courseResult.rows.length === 0) return;

    const course = courseResult.rows[0];

    // Get all enrolled students
    const studentsResult = await pool.query(
      `SELECT DISTINCT u.id, u.name, u.email
       FROM purchases p
       JOIN users u ON p.user_id = u.id
       WHERE p.course_id = $1 AND p.status = 'completed'`,
      [course_id]
    );

    // Send email to each student
    for (const student of studentsResult.rows) {
      try {
        const emailTemplate = templates.courseUpdate(student.name, course.title);
        await sendEmail(student.email, emailTemplate.subject, emailTemplate.html, null, student.id, 'course_update');
      } catch (emailError) {
        console.error(`Error sending email to ${student.email}:`, emailError);
      }
    }
  } catch (error) {
    console.error('Error in sendCourseUpdateNotification:', error);
  }
};

module.exports = {
  getModulesByCourse,
  createModule,
  updateModule,
  deleteModule,
  createLesson,
  updateLesson,
  deleteLesson
};

