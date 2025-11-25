const pool = require('../config/db');
const crypto = require('crypto');
const { generateCertificatePDF, generateCertificateHTML } = require('../services/pdfService');
const { uploadFile } = require('../services/cloudinaryService');
const { sendEmail, templates } = require('../services/emailService');

// Generate certificate
const generateCertificate = async (req, res) => {
  try {
    const { course_id } = req.params;
    const user_id = req.user.id;

    // Check if user has completed the course
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

    if (completionPercentage < 100) {
      return res.status(400).json({ 
        error: 'Course not completed yet',
        progress: completionPercentage 
      });
    }

    // Check if certificate already exists
    const existingCert = await pool.query(
      'SELECT * FROM certificates WHERE user_id = ? AND course_id = ?',
      [user_id, course_id]
    );

    if (existingCert.rows.length > 0) {
      return res.json({ 
        message: 'Certificate already exists',
        certificate: existingCert.rows[0]
      });
    }

    // Get course and user details
    const courseResult = await pool.query('SELECT * FROM courses WHERE id = ?', [course_id]);
    const userResult = await pool.query('SELECT * FROM users WHERE id = ?', [user_id]);

    if (courseResult.rows.length === 0 || userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Course or user not found' });
    }

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
        // It's a PDF buffer
        const fileName = `certificate-${certificateId}.pdf`;
        certificateUrl = await uploadFile(pdfBuffer, fileName, 'certificates');
      } else {
        // It's HTML (fallback)
        console.log('PDF generation returned HTML. Consider installing pdfkit for PDF generation.');
      }
    } catch (error) {
      console.error('Error generating/uploading certificate PDF:', error);
      // Continue without PDF URL
    }

    // Create certificate record
    const result = await pool.query(
      `INSERT INTO certificates (user_id, course_id, certificate_id, certificate_url, issued_at)
       VALUES (?, ?, ?, ?, NOW()) RETURNING *`,
      [user_id, course_id, certificateId, certificateUrl]
    );

    // Send certificate issued email
    try {
      const emailTemplate = templates.certificateIssued(user.name, course.title, certificateId);
      await sendEmail(user.email, emailTemplate.subject, emailTemplate.html, null, user_id, 'certificate_issued');
    } catch (emailError) {
      console.error('Error sending certificate email:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({ 
      message: 'Certificate generated successfully',
      certificate: {
        ...result.rows[0],
        course_title: course.title,
        user_name: user.name
      }
    });
  } catch (error) {
    console.error('Generate certificate error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user certificates
const getUserCertificates = async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await pool.query(
      `SELECT 
        c.*,
        co.title as course_title,
        co.category,
        co.thumbnail
       FROM certificates c
       JOIN courses co ON c.course_id = co.id
       WHERE c.user_id = ?
       ORDER BY c.issued_at DESC`,
      [user_id]
    );

    res.json({ certificates: result.rows });
  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get certificate by ID
const getCertificateById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const result = await pool.query(
      `SELECT 
        c.*,
        co.title as course_title,
        co.category,
        co.description,
        u.name as user_name,
        u.email
       FROM certificates c
       JOIN courses co ON c.course_id = co.id
       JOIN users u ON c.user_id = u.id
       WHERE c.id = ? AND c.user_id = ?`,
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    res.json({ certificate: result.rows[0] });
  } catch (error) {
    console.error('Get certificate error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  generateCertificate,
  getUserCertificates,
  getCertificateById
};

