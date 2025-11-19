const pool = require('../config/db');

const getAllCourses = async (req, res) => {
  try {
    const { search, category, sortBy } = req.query;

    let query = 'SELECT * FROM courses WHERE published = true';
    const params = [];
    let paramCount = 1;

    if (search) {
      query += ` AND title ILIKE $${paramCount}`;
      params.push(`%${search}%`);
      paramCount++;
    }

    if (category) {
      query += ` AND category = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    if (sortBy === 'price_low') {
      query += ' ORDER BY price ASC';
    } else if (sortBy === 'price_high') {
      query += ' ORDER BY price DESC';
    } else {
      query += ' ORDER BY created_at DESC';
    }

    const result = await pool.query(query, params);

    res.json({ courses: result.rows });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const courseResult = await pool.query(
      'SELECT * FROM courses WHERE id = $1',
      [id]
    );

    if (courseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const videosResult = await pool.query(
      'SELECT * FROM videos WHERE course_id = $1 ORDER BY order_index ASC',
      [id]
    );

    const resourcesResult = await pool.query(
      'SELECT * FROM resources WHERE course_id = $1',
      [id]
    );

    res.json({
      course: courseResult.rows[0],
      videos: videosResult.rows,
      resources: resourcesResult.rows
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const createCourse = async (req, res) => {
  try {
    const { title, description, short_description, price, category, thumbnail, promotional_video, instructor_name, published, free } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ error: 'Missing required fields: title, description, category' });
    }

    // If free course, price should be 0 or not required
    const isFree = free === true || free === 'true';
    const coursePrice = isFree ? 0 : (price || 0);
    
    // Validate: if not free, price must be provided
    if (!isFree && (price === undefined || price === null || price === '')) {
      return res.status(400).json({ error: 'Price is required for paid courses' });
    }

    // Use published value from request, default to false if not provided
    const isPublished = published === true || published === 'true';
    // Use instructor_name from request, fallback to user name or 'Admin'
    const instructorName = instructor_name || req.user.name || 'Admin';

    const result = await pool.query(
      `INSERT INTO courses (title, description, short_description, price, category, thumbnail, promotional_video, instructor_name, published, free)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [title, description, short_description || null, coursePrice, category, thumbnail || null, promotional_video || null, instructorName, isPublished, isFree]
    );

    const message = isFree 
      ? (isPublished ? 'Free course created and published successfully!' : 'Free course created successfully! (Currently unpublished)')
      : (isPublished ? 'Course created and published successfully!' : 'Course created successfully! (Currently unpublished)');

    res.status(201).json({ 
      message: 'Course created successfully',
      course: result.rows[0],
      note: message
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, short_description, price, category, thumbnail, promotional_video, instructor_name, published, free } = req.body;

    console.log('=== BACKEND UPDATE DEBUG ===');
    console.log('Full request body:', JSON.stringify(req.body, null, 2));
    console.log('Instructor name extracted:', instructor_name);
    console.log('Instructor name type:', typeof instructor_name);
    console.log('Instructor name value:', JSON.stringify(instructor_name));

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
    if (short_description !== undefined) {
      updates.push(`short_description = $${paramCount++}`);
      params.push(short_description || null);
      console.log('Adding short_description field to update:', short_description || null); // Debug log
    }
    if (free !== undefined) {
      const isFree = free === true || free === 'true';
      updates.push(`free = $${paramCount++}`);
      params.push(isFree);
      console.log('Adding free field to update:', isFree); // Debug log
      // If marking as free and price not explicitly set, also set price to 0
      if (isFree && price === undefined) {
        updates.push(`price = $${paramCount++}`);
        params.push(0);
      }
    }
    if (price !== undefined) {
      // If course is being marked as free, force price to 0
      const isFree = free !== undefined ? (free === true || free === 'true') : null;
      if (isFree === true) {
        // Force price to 0 for free courses
        // Check if price update is already added above
        const priceAlreadySet = updates.some(update => update.startsWith('price ='));
        if (!priceAlreadySet) {
          updates.push(`price = $${paramCount++}`);
          params.push(0);
        }
      } else if (isFree === null) {
        // Check current free status from database
        const currentCourse = await pool.query('SELECT free FROM courses WHERE id = $1', [id]);
        if (currentCourse.rows.length > 0 && currentCourse.rows[0].free) {
          // Course is currently free, ensure price stays 0
          const priceAlreadySet = updates.some(update => update.startsWith('price ='));
          if (!priceAlreadySet) {
            updates.push(`price = $${paramCount++}`);
            params.push(0);
          }
        } else {
          // Course is not free, update price normally
          const priceAlreadySet = updates.some(update => update.startsWith('price ='));
          if (!priceAlreadySet) {
            updates.push(`price = $${paramCount++}`);
            params.push(price);
          }
        }
      } else {
        // Course is being marked as paid (free = false), update price normally
        const priceAlreadySet = updates.some(update => update.startsWith('price ='));
        if (!priceAlreadySet) {
          updates.push(`price = $${paramCount++}`);
          params.push(price);
        }
      }
    }
    if (category !== undefined) {
      updates.push(`category = $${paramCount++}`);
      params.push(category);
    }
    if (thumbnail !== undefined) {
      updates.push(`thumbnail = $${paramCount++}`);
      params.push(thumbnail);
    }
    if (promotional_video !== undefined) {
      updates.push(`promotional_video = $${paramCount++}`);
      params.push(promotional_video);
    }
    if (instructor_name !== undefined) {
      updates.push(`instructor_name = $${paramCount++}`);
      // Preserve the value exactly as provided - trim whitespace
      // If empty string or null, use 'Admin' as fallback (database requires NOT NULL)
      // But if user provides a value (even if it's just whitespace that gets trimmed), use it
      let trimmedName;
      if (instructor_name === null || instructor_name === undefined) {
        trimmedName = 'Admin';
      } else if (typeof instructor_name === 'string') {
        trimmedName = instructor_name.trim();
        // Only use 'Admin' if the trimmed string is completely empty
        if (trimmedName === '') {
          trimmedName = 'Admin';
        }
      } else {
        trimmedName = instructor_name;
      }
      console.log('Processing instructor_name:', { original: instructor_name, trimmed: trimmedName }); // Debug log
      params.push(trimmedName);
    }
    if (published !== undefined) {
      // Convert to boolean if it's a string
      const isPublished = published === true || published === 'true';
      updates.push(`published = $${paramCount++}`);
      params.push(isPublished);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(id);
    const query = `UPDATE courses SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;

    console.log('Updates array:', updates); // Debug log
    console.log('Update query:', query); // Debug log
    console.log('Update params:', params); // Debug log
    console.log('Free field in updates:', updates.find(u => u.startsWith('free'))); // Debug log
    console.log('Short description in updates:', updates.find(u => u.startsWith('short_description'))); // Debug log

    const result = await pool.query(query, params);

    console.log('Updated course:', result.rows[0]); // Debug log

    res.json({ message: 'Course updated successfully', course: result.rows[0] });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM courses WHERE id = $1', [id]);

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getAllCoursesAdmin = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM courses ORDER BY created_at DESC');
    res.json({ courses: result.rows });
  } catch (error) {
    console.error('Get all courses error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get course details with all content (admin)
const getCourseDetailsAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Get course
    const courseResult = await pool.query('SELECT * FROM courses WHERE id = $1', [id]);
    if (courseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Get modules with lessons
    const modulesResult = await pool.query(
      `SELECT m.*, 
        COUNT(l.id) as lesson_count
       FROM modules m
       LEFT JOIN lessons l ON m.id = l.module_id
       WHERE m.course_id = $1
       GROUP BY m.id
       ORDER BY m.order_index ASC`,
      [id]
    );

    const modules = await Promise.all(
      modulesResult.rows.map(async (module) => {
        const lessonsResult = await pool.query(
          `SELECT l.*, 
            COUNT(DISTINCT q.id) as quiz_count,
            COUNT(DISTINCT a.id) as assignment_count
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

    // Get enrollment count
    const enrollmentResult = await pool.query(
      'SELECT COUNT(DISTINCT user_id) as enrollment_count FROM purchases WHERE course_id = $1',
      [id]
    );

    res.json({
      course: courseResult.rows[0],
      modules,
      enrollment_count: parseInt(enrollmentResult.rows[0].enrollment_count) || 0
    });
  } catch (error) {
    console.error('Get course details error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCoursesAdmin,
  getCourseDetailsAdmin
};
