const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

const addVideo = async (req, res) => {
  try {
    const { course_id, title, description, video_url, duration, order_index } = req.body;

    if (!course_id || !title || !video_url) {
      return res.status(400).json({ error: 'Missing required fields: course_id, title, and video_url are required' });
    }

    // Check if videos table exists, if not, suggest using modules/lessons structure
    try {
      const tableCheck = await pool.query(
        `SELECT COUNT(*) AS count
         FROM information_schema.tables 
         WHERE table_schema = DATABASE()
         AND table_name = 'videos';`
      );

      if (parseInt(tableCheck.rows[0].count, 10) === 0) {
        return res.status(400).json({ 
          error: 'Videos table does not exist. Please use the Content Management page to add videos through Modules and Lessons.',
          suggestion: 'Use /academy/admin/course/:id/content to manage course content'
        });
      }

      const videoId = uuidv4();

      await pool.query(
        `INSERT INTO videos (id, course_id, title, description, video_url, duration, order_index)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [videoId, course_id, title, description || null, video_url, duration || '0:00', order_index || 0]
      );

      const createdVideo = await pool.query('SELECT * FROM videos WHERE id = ?', [videoId]);

      res.status(201).json({ message: 'Video added successfully', video: createdVideo.rows[0] });
    } catch (dbError) {
      if (dbError.code === 'ER_NO_SUCH_TABLE') {
        // Table does not exist
        return res.status(400).json({ 
          error: 'Videos table does not exist. Please run the videos migration or use the Content Management page.',
          suggestion: 'Run: node server/run-videos-migration.js'
        });
      }
      throw dbError;
    }
  } catch (error) {
    console.error('Add video error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, video_url, duration, order_index } = req.body;

    const videoResult = await pool.query('SELECT * FROM videos WHERE id = ?', [id]);
    if (videoResult.rows.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
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
    if (video_url !== undefined) {
      updates.push('video_url = ?');
      params.push(video_url);
    }
    if (duration !== undefined) {
      updates.push('duration = ?');
      params.push(duration);
    }
    if (order_index !== undefined) {
      updates.push('order_index = ?');
      params.push(order_index);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(id);
    const query = `UPDATE videos SET ${updates.join(', ')} WHERE id = ?`;

    await pool.query(query, params);

    const updatedVideo = await pool.query('SELECT * FROM videos WHERE id = ?', [id]);

    res.json({ message: 'Video updated successfully', video: updatedVideo.rows[0] });
  } catch (error) {
    console.error('Update video error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM videos WHERE id = ?', [id]);

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const addResource = async (req, res) => {
  try {
    const { course_id, module_id, title, file_url, file_type } = req.body;

    if (!course_id || !title || !file_url) {
      return res.status(400).json({ error: 'Missing required fields: course_id, title, and file_url are required' });
    }

    // Check if resources table exists
    try {
      const tableCheck = await pool.query(
        `SELECT COUNT(*) AS count
         FROM information_schema.tables 
         WHERE table_schema = DATABASE()
         AND table_name = 'resources';`
      );

      if (parseInt(tableCheck.rows[0].count, 10) === 0) {
        return res.status(400).json({ 
          error: 'Resources table does not exist. Please use the Content Management page to add resources through Modules and Lessons.',
          suggestion: 'Use /academy/admin/course/:id/content to manage course content'
        });
      }

      const resourceId = uuidv4();

      await pool.query(
        `INSERT INTO resources (id, course_id, module_id, title, file_url, file_type)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [resourceId, course_id, module_id || null, title, file_url, file_type || 'pdf']
      );

      const createdResource = await pool.query('SELECT * FROM resources WHERE id = ?', [resourceId]);

      res.status(201).json({ message: 'Resource added successfully', resource: createdResource.rows[0] });
    } catch (dbError) {
      if (dbError.code === 'ER_NO_SUCH_TABLE') {
        return res.status(400).json({ 
          error: 'Resources table does not exist. Please run the videos migration or use the Content Management page.',
          suggestion: 'Run: node server/run-videos-migration.js'
        });
      }
      throw dbError;
    }
  } catch (error) {
    console.error('Add resource error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Get resources by module
const getResourcesByModule = async (req, res) => {
  try {
    const { module_id } = req.params;

    const result = await pool.query(
      'SELECT * FROM resources WHERE module_id = ? ORDER BY created_at DESC',
      [module_id]
    );

    res.json({ resources: result.rows });
  } catch (error) {
    console.error('Get resources by module error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM resources WHERE id = ?', [id]);

    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  addVideo,
  updateVideo,
  deleteVideo,
  addResource,
  deleteResource,
  getResourcesByModule
};
