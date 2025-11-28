const pool = require('../config/db');

// Get all notifications (Admin)
const getAllNotifications = async (req, res) => {
  try {
    // Get all notifications with user info and related data using optimized JOINs
    const result = await pool.query(
      `SELECT 
        n.*,
        u.name as recipient_name,
        u.email as recipient,
        -- Get course title from payment_orders for payment_success
        COALESCE(
          (SELECT c.title FROM payment_orders po 
           JOIN courses c ON po.course_id = c.id 
           WHERE po.user_id = n.user_id 
           AND n.type = 'payment_success'
           ORDER BY po.created_at DESC LIMIT 1),
          -- Get course title from purchases for course_update
          (SELECT c.title FROM purchases p 
           JOIN courses c ON p.course_id = c.id 
           WHERE p.user_id = n.user_id 
           AND n.type = 'course_update'
           ORDER BY p.purchased_at DESC LIMIT 1),
          -- Get course title from certificates for certificate_issued
          (SELECT c.title FROM certificates cert 
           JOIN courses c ON cert.course_id = c.id 
           WHERE cert.user_id = n.user_id 
           AND n.type = 'certificate_issued'
           ORDER BY cert.issued_at DESC LIMIT 1)
        ) as course_title,
        -- Get certificate_id for certificate_issued
        CASE 
          WHEN n.type = 'certificate_issued' THEN
            (SELECT cert.certificate_id FROM certificates cert 
             WHERE cert.user_id = n.user_id 
             ORDER BY cert.issued_at DESC LIMIT 1)
          ELSE NULL
        END as certificate_id
       FROM notifications n
       JOIN users u ON n.user_id = u.id
       ORDER BY n.created_at DESC
       LIMIT 1000`
    );

    // Map notifications to match frontend structure
    const notifications = result.rows.map(row => {
      let type = row.type;
      if (type === 'payment_success') type = 'payment';
      if (type === 'certificate_issued') type = 'certificate';

      return {
        id: row.id,
        type: type,
        recipient: row.recipient,
        recipient_name: row.recipient_name,
        subject: row.title,
        status: 'sent', // All stored notifications are sent
        sent_at: row.created_at,
        template: row.type,
        course_title: row.course_title,
        certificate_id: row.certificate_id
      };
    });

    res.json({ notifications });
  } catch (error) {
    console.error('Get all notifications error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create notification (called when sending emails)
const createNotification = async (user_id, type, title, message) => {
  try {
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, message)
       VALUES (?, ?, ?, ?)`,
      [user_id, type, title, message]
    );
  } catch (error) {
    console.error('Error creating notification:', error);
    // Don't throw - notifications are optional
  }
};

module.exports = {
  getAllNotifications,
  createNotification
};

