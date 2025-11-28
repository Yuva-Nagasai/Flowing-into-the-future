const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

// Create or update note
const saveNote = async (req, res) => {
  try {
    const { course_id, lesson_id, content, timestamp } = req.body;
    const user_id = req.user.id;

    if (!course_id || !lesson_id || !content) {
      return res.status(400).json({ error: 'Course ID, Lesson ID, and content are required' });
    }

    // Check if note exists for this lesson and timestamp
    const existingNote = await pool.query(
      'SELECT * FROM notes WHERE user_id = ? AND lesson_id = ? AND timestamp = ?',
      [user_id, lesson_id, timestamp || 0]
    );

    if (existingNote.rows.length > 0) {
      // Update existing note
      await pool.query(
        `UPDATE notes 
         SET content = ?, updated_at = NOW() 
         WHERE id = ?`,
        [content, existingNote.rows[0].id]
      );

      const updatedNote = await pool.query('SELECT * FROM notes WHERE id = ?', [existingNote.rows[0].id]);

      res.json({ message: 'Note updated successfully', note: updatedNote.rows[0] });
    } else {
      // Create new note
      const noteId = uuidv4();
      await pool.query(
        `INSERT INTO notes (id, user_id, course_id, lesson_id, content, timestamp)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [noteId, user_id, course_id, lesson_id, content, timestamp || 0]
      );

      const newNote = await pool.query('SELECT * FROM notes WHERE id = ?', [noteId]);

      res.status(201).json({ message: 'Note saved successfully', note: newNote.rows[0] });
    }
  } catch (error) {
    console.error('Save note error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get notes for a lesson
const getLessonNotes = async (req, res) => {
  try {
    const { lesson_id } = req.params;
    const user_id = req.user.id;

    const result = await pool.query(
      `SELECT * FROM notes 
       WHERE user_id = ? AND lesson_id = ? 
       ORDER BY timestamp ASC, created_at ASC`,
      [user_id, lesson_id]
    );

    res.json({ notes: result.rows });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all notes for a course
const getCourseNotes = async (req, res) => {
  try {
    const { course_id } = req.params;
    const user_id = req.user.id;

    const result = await pool.query(
      `SELECT 
        n.*,
        l.title as lesson_title,
        m.title as module_title
       FROM notes n
       JOIN lessons l ON n.lesson_id = l.id
       JOIN modules m ON l.module_id = m.id
       WHERE n.user_id = ? AND n.course_id = ?
       ORDER BY m.order_index, l.order_index, n.timestamp`,
      [user_id, course_id]
    );

    res.json({ notes: result.rows });
  } catch (error) {
    console.error('Get course notes error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete note
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const existingNote = await pool.query('SELECT * FROM notes WHERE id = ? AND user_id = ?', [id, user_id]);
    if (existingNote.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    await pool.query('DELETE FROM notes WHERE id = ? AND user_id = ?', [id, user_id]);

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  saveNote,
  getLessonNotes,
  getCourseNotes,
  deleteNote
};

