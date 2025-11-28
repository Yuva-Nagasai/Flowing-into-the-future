const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

// Update user progress
const updateProgress = async (req, res) => {
  try {
    const { course_id, lesson_id, completed, completion_percentage, time_spent, last_position } = req.body;
    const user_id = req.user.id;

    if (!course_id || !lesson_id) {
      return res.status(400).json({ error: 'Course ID and Lesson ID are required' });
    }

    // Check if progress exists
    const existingProgress = await pool.query(
      'SELECT * FROM user_progress WHERE user_id = ? AND lesson_id = ?',
      [user_id, lesson_id]
    );

    if (existingProgress.rows.length > 0) {
      // Update existing progress
      const updates = [];
      const params = [];

      if (completed !== undefined) {
        updates.push('completed = ?');
        params.push(completed);
      }
      if (completion_percentage !== undefined) {
        updates.push('completion_percentage = ?');
        params.push(completion_percentage);
      }
      if (time_spent !== undefined) {
        updates.push('time_spent = time_spent + ?');
        params.push(time_spent);
      }
      if (last_position !== undefined) {
        updates.push('last_position = ?');
        params.push(last_position);
      }

      updates.push('updated_at = NOW()');
      params.push(user_id, lesson_id);

      const query = `UPDATE user_progress SET ${updates.join(', ')} WHERE user_id = ? AND lesson_id = ?`;
      await pool.query(query, params);

      const updatedResult = await pool.query(
        'SELECT * FROM user_progress WHERE user_id = ? AND lesson_id = ?',
        [user_id, lesson_id]
      );

      res.json({ message: 'Progress updated successfully', progress: updatedResult.rows[0] });
    } else {
      // Create new progress
      const progressId = uuidv4();

      await pool.query(
        `INSERT INTO user_progress (id, user_id, course_id, lesson_id, completed, completion_percentage, time_spent, last_position)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [progressId, user_id, course_id, lesson_id, completed || false, completion_percentage || 0, time_spent || 0, last_position || 0]
      );

      const newProgress = await pool.query('SELECT * FROM user_progress WHERE id = ?', [progressId]);

      res.status(201).json({ message: 'Progress created successfully', progress: newProgress.rows[0] });
    }

    // Check if course is completed and auto-generate certificate
    if (completed === true) {
      try {
        const courseProgressResult = await pool.query(
          `SELECT 
            COUNT(DISTINCT l.id) as total_lessons,
            COUNT(DISTINCT CASE WHEN up.completed THEN l.id END) as completed_lessons
           FROM lessons l
           JOIN modules m ON l.module_id = m.id
           LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = ?
           WHERE m.course_id = ?`,
          [user_id, course_id]
        );

        const stats = courseProgressResult.rows[0];
        const completionPercentage = stats.total_lessons > 0 
          ? (stats.completed_lessons / stats.total_lessons) * 100
          : 0;

        // If course is 100% complete, check if certificate exists and generate if not
        if (completionPercentage >= 100) {
          const existingCert = await pool.query(
            'SELECT * FROM certificates WHERE user_id = ? AND course_id = ?',
            [user_id, course_id]
          );

          if (existingCert.rows.length === 0) {
            // Auto-generate certificate asynchronously
            setImmediate(async () => {
              try {
                const crypto = require('crypto');
                const { generateCertificatePDF } = require('../services/pdfService');
                const { uploadFile } = require('../services/cloudinaryService');
                const { sendEmail, templates } = require('../services/emailService');

                // Get course and user details
                const courseResult = await pool.query('SELECT * FROM courses WHERE id = ?', [course_id]);
                const userResult = await pool.query('SELECT * FROM users WHERE id = ?', [user_id]);

                if (courseResult.rows.length === 0 || userResult.rows.length === 0) return;

                const course = courseResult.rows[0];
                const user = userResult.rows[0];

                // Generate unique certificate ID
                const certificateId = `NFC-${crypto.randomBytes(6).toString('hex').toUpperCase()}-${Date.now().toString().slice(-6)}`;
                const issuedDate = new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                });

                // Generate PDF certificate
                let certificateUrl = null;
                try {
                  const pdfBuffer = await generateCertificatePDF(course, user, certificateId, issuedDate);
                  if (Buffer.isBuffer(pdfBuffer)) {
                    const fileName = `certificate-${certificateId}.pdf`;
                    certificateUrl = await uploadFile(pdfBuffer, fileName, 'certificates');
                  }
                } catch (pdfError) {
                  console.error('Error generating certificate PDF:', pdfError);
                }

                // Create certificate record
                await pool.query(
                  `INSERT INTO certificates (user_id, course_id, certificate_id, certificate_url, issued_at)
                   VALUES (?, ?, ?, ?, NOW())`,
                  [user_id, course_id, certificateId, certificateUrl]
                );

                // Send certificate issued email
                try {
                  const emailTemplate = templates.certificateIssued(user.name, course.title, certificateId);
                  await sendEmail(user.email, emailTemplate.subject, emailTemplate.html, null, user_id, 'certificate_issued');
                } catch (emailError) {
                  console.error('Error sending certificate email:', emailError);
                }
              } catch (certError) {
                console.error('Error auto-generating certificate:', certError);
              }
            });
          }
        }
      } catch (certCheckError) {
        console.error('Error checking course completion for certificate:', certCheckError);
        // Don't fail the progress update if certificate check fails
      }
    }
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user progress for a course
const getCourseProgress = async (req, res) => {
  try {
    const { course_id } = req.params;
    const user_id = req.user.id;

    const result = await pool.query(
      `SELECT 
        up.*,
        l.title as lesson_title,
        l.order_index as lesson_order,
        m.title as module_title,
        m.order_index as module_order
       FROM user_progress up
       JOIN lessons l ON up.lesson_id = l.id
       JOIN modules m ON l.module_id = m.id
       WHERE up.user_id = ? AND up.course_id = ?
       ORDER BY m.order_index, l.order_index`,
      [user_id, course_id]
    );

    // Calculate overall course progress based on videos only
    const courseStatsResult = await pool.query(
      `SELECT 
        COUNT(DISTINCT l.id) as total_videos,
        COUNT(DISTINCT CASE WHEN up.completed THEN l.id END) as completed_videos,
        COALESCE(SUM(up.time_spent), 0) as total_time_spent
       FROM lessons l
       LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = ?
       WHERE l.course_id = ? AND l.content_type = 'video'`,
      [user_id, course_id]
    );

    const stats = courseStatsResult.rows[0];
    const progressPercentage = stats.total_videos > 0 
      ? Math.round((stats.completed_videos / stats.total_videos) * 100)
      : 0;

    res.json({
      progress: result.rows,
      stats: {
        total_videos: parseInt(stats.total_videos),
        completed_videos: parseInt(stats.completed_videos),
        progress_percentage: progressPercentage,
        total_time_spent: parseInt(stats.total_time_spent)
      }
    });
  } catch (error) {
    console.error('Get course progress error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user's overall progress
const getUserProgress = async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await pool.query(
      `SELECT 
        c.id as course_id,
        c.title as course_title,
        c.thumbnail,
        COUNT(DISTINCT l.id) as total_lessons,
        COUNT(DISTINCT CASE WHEN up.completed THEN l.id END) as completed_lessons,
        COALESCE(SUM(up.time_spent), 0) as total_time_spent
       FROM courses c
       JOIN purchases p ON c.id = p.course_id
       LEFT JOIN modules m ON c.id = m.course_id
       LEFT JOIN lessons l ON m.id = l.module_id
       LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = ?
       WHERE p.user_id = ?
       GROUP BY c.id, c.title, c.thumbnail
       ORDER BY c.title`,
      [user_id]
    );

    const courses = result.rows.map(row => ({
      course_id: row.course_id,
      course_title: row.course_title,
      thumbnail: row.thumbnail,
      total_lessons: parseInt(row.total_lessons),
      completed_lessons: parseInt(row.completed_lessons),
      progress_percentage: row.total_lessons > 0 
        ? Math.round((row.completed_lessons / row.total_lessons) * 100)
        : 0,
      total_time_spent: parseInt(row.total_time_spent)
    }));

    res.json({ courses });
  } catch (error) {
    console.error('Get user progress error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all student progress (Admin only)
const getAllProgress = async (req, res) => {
  try {
    // Get all non-admin users to ensure every student appears in the dashboard
    const usersResult = await pool.query(
      `SELECT id, name, email, role, created_at
       FROM users
       WHERE role != 'admin'
       ORDER BY created_at DESC`
    );

    // Map user signup dates for quick lookup
    const signupDateMap = new Map(
      usersResult.rows.map((user) => [user.id, user.created_at])
    );

    // Get all enrollments (purchases)
    const purchasesResult = await pool.query(
      `SELECT DISTINCT
        p.user_id,
        p.course_id,
        p.purchased_at,
        u.name as user_name,
        u.email as user_email,
        c.title as course_title
       FROM purchases p
       JOIN users u ON p.user_id = u.id
       JOIN courses c ON p.course_id = c.id
       ORDER BY p.purchased_at DESC`
    );

    // Get progress for each user-course combination
    const progressPromises = purchasesResult.rows.map(async (purchase) => {
      const progressResult = await pool.query(
        `SELECT 
          COUNT(DISTINCT l.id) as total_lessons,
          COUNT(DISTINCT CASE WHEN up.completed THEN l.id END) as completed_lessons,
          COALESCE(SUM(up.time_spent), 0) as total_time_spent
         FROM courses c
         LEFT JOIN modules m ON c.id = m.course_id
         LEFT JOIN lessons l ON m.id = l.module_id
         LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = ?
         WHERE c.id = ?`,
        [purchase.user_id, purchase.course_id]
      );

      // Get quiz scores
      const quizScoresResult = await pool.query(
        `SELECT 
          COUNT(*) as total_attempts,
          SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct_attempts,
          SUM(score) as total_score
         FROM quiz_attempts
         WHERE user_id = ? AND course_id = ?`,
        [purchase.user_id, purchase.course_id]
      );

      // Get assignment submissions
      const assignmentResult = await pool.query(
        `SELECT 
          COUNT(*) as total_submissions,
          COUNT(CASE WHEN score IS NOT NULL THEN 1 END) as graded_submissions,
          COALESCE(AVG(score), 0) as average_score
         FROM assignment_submissions
         WHERE user_id = ? AND course_id = ?`,
        [purchase.user_id, purchase.course_id]
      );

      const stats = progressResult.rows[0];
      const total_lessons = parseInt(stats.total_lessons, 10) || 0;
      const completed_lessons = parseInt(stats.completed_lessons, 10) || 0;
      const progress_percentage = total_lessons > 0 
        ? Math.round((completed_lessons / total_lessons) * 100)
        : 0;

      const signupDate = signupDateMap.get(purchase.user_id) || null;
      const status = progress_percentage >= 100
        ? 'completed'
        : progress_percentage > 0
          ? 'in_progress'
          : 'enrolled';

      return {
        id: `${purchase.user_id}-${purchase.course_id}`,
        user_id: purchase.user_id,
        user_name: purchase.user_name,
        user_email: purchase.user_email,
        course_id: purchase.course_id,
        course_title: purchase.course_title,
        total_lessons,
        completed_lessons,
        progress_percentage,
        total_time_spent: parseInt(stats.total_time_spent, 10) || 0,
        signup_date: signupDate,
        enrollment_date: purchase.purchased_at,
        status,
        quiz_stats: {
          total_attempts: parseInt(quizScoresResult.rows[0].total_attempts, 10) || 0,
          correct_attempts: parseInt(quizScoresResult.rows[0].correct_attempts, 10) || 0,
          total_score: parseInt(quizScoresResult.rows[0].total_score, 10) || 0
        },
        assignment_stats: {
          total_submissions: parseInt(assignmentResult.rows[0].total_submissions, 10) || 0,
          graded_submissions: parseInt(assignmentResult.rows[0].graded_submissions, 10) || 0,
          average_score: parseFloat(assignmentResult.rows[0].average_score) || 0
        }
      };
    });

    const enrolledCourses = await Promise.all(progressPromises);
    const enrolledUserIds = new Set(enrolledCourses.map((entry) => entry.user_id));

    // Add placeholder entries for users who have not enrolled in any course yet
    const notEnrolledEntries = usersResult.rows
      .filter((user) => !enrolledUserIds.has(user.id))
      .map((user) => ({
        id: `${user.id}-none`,
        user_id: user.id,
        user_name: user.name,
        user_email: user.email,
        course_id: null,
        course_title: 'Not enrolled yet',
        total_lessons: 0,
        completed_lessons: 0,
        progress_percentage: 0,
        total_time_spent: 0,
        signup_date: user.created_at,
        enrollment_date: null,
        status: 'not_enrolled',
        quiz_stats: {
          total_attempts: 0,
          correct_attempts: 0,
          total_score: 0
        },
        assignment_stats: {
          total_submissions: 0,
          graded_submissions: 0,
          average_score: 0
        }
      }));

    const sortByMostRecent = (a, b) => {
      const dateA = new Date(a.enrollment_date || a.signup_date || 0).getTime();
      const dateB = new Date(b.enrollment_date || b.signup_date || 0).getTime();
      return dateB - dateA;
    };

    const courses = [...enrolledCourses, ...notEnrolledEntries].sort(sortByMostRecent);

    const signups = usersResult.rows.map((user) => ({
      user_id: user.id,
      user_name: user.name,
      user_email: user.email,
      created_at: user.created_at
    }));

    res.json({ courses, signups });
  } catch (error) {
    console.error('Get all progress error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  updateProgress,
  getCourseProgress,
  getUserProgress,
  getAllProgress
};

