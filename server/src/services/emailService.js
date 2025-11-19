const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verify email configuration
if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  transporter.verify((error, success) => {
    if (error) {
      console.log('❌ Email service not configured:', error.message);
    } else {
      console.log('✅ Email service ready');
    }
  });
}

const sendEmail = async (to, subject, html, text, userId = null, notificationType = null) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('⚠️ Email service not configured. Skipping email to:', to);
      // Still log notification even if email fails
      if (userId && notificationType) {
        try {
          const { createNotification } = require('../controllers/notificationController');
          await createNotification(userId, notificationType, subject, html.replace(/<[^>]*>/g, ''));
        } catch (notifError) {
          console.error('Error logging notification:', notifError);
        }
      }
      return { success: false, message: 'Email service not configured' };
    }

    const mailOptions = {
      from: `"NanoFlows Academy" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: text || html.replace(/<[^>]*>/g, ''), // Plain text fallback
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    
    // Log notification to database
    if (userId && notificationType) {
      try {
        const { createNotification } = require('../controllers/notificationController');
        await createNotification(userId, notificationType, subject, html.replace(/<[^>]*>/g, ''));
      } catch (notifError) {
        console.error('Error logging notification:', notifError);
        // Don't fail email send if notification logging fails
      }
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Email templates
const templates = {
  signup: (userName) => ({
    subject: 'Welcome to NanoFlows Academy!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #00E881;">Welcome to NanoFlows Academy!</h1>
        <p>Hi ${userName},</p>
        <p>Thank you for joining NanoFlows Academy! We're excited to have you on board.</p>
        <p>Start your learning journey by exploring our courses:</p>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/academy/courses" 
           style="display: inline-block; padding: 12px 24px; background-color: #00E881; color: #000; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px;">
          Browse Courses
        </a>
        <p style="margin-top: 30px; color: #666; font-size: 14px;">Happy Learning!</p>
        <p style="color: #666; font-size: 14px;">The NanoFlows Academy Team</p>
      </div>
    `
  }),

  paymentSuccess: (userName, courseTitle, amount, orderId) => ({
    subject: 'Payment Successful - NanoFlows Academy',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #00E881;">Payment Successful!</h1>
        <p>Hi ${userName},</p>
        <p>Your payment has been processed successfully.</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <p><strong>Course:</strong> ${courseTitle}</p>
          <p><strong>Amount:</strong> ₹${amount}</p>
          <p><strong>Order ID:</strong> ${orderId}</p>
        </div>
        <p>You can now start learning immediately:</p>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/academy/dashboard" 
           style="display: inline-block; padding: 12px 24px; background-color: #00E881; color: #000; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px;">
          Go to Dashboard
        </a>
        <p style="margin-top: 30px; color: #666; font-size: 14px;">Thank you for choosing NanoFlows Academy!</p>
        <p style="color: #666; font-size: 14px;">The NanoFlows Academy Team</p>
      </div>
    `
  }),

  courseUpdate: (userName, courseTitle) => ({
    subject: 'Course Update - NanoFlows Academy',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #00E881;">Course Updated!</h1>
        <p>Hi ${userName},</p>
        <p>We've added new content to a course you're enrolled in:</p>
        <p style="font-size: 18px; font-weight: bold; color: #00E881;">${courseTitle}</p>
        <p>Check out what's new:</p>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/academy/dashboard" 
           style="display: inline-block; padding: 12px 24px; background-color: #00E881; color: #000; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px;">
          View Course
        </a>
        <p style="margin-top: 30px; color: #666; font-size: 14px;">Happy Learning!</p>
        <p style="color: #666; font-size: 14px;">The NanoFlows Academy Team</p>
      </div>
    `
  }),

  certificateIssued: (userName, courseTitle, certificateId) => ({
    subject: 'Congratulations! Your Certificate is Ready - NanoFlows Academy',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #00E881;">🎉 Certificate Issued!</h1>
        <p>Hi ${userName},</p>
        <p>Congratulations! You've successfully completed:</p>
        <p style="font-size: 18px; font-weight: bold; color: #00E881;">${courseTitle}</p>
        <p>Your certificate has been issued and is available in your profile.</p>
        <p><strong>Certificate ID:</strong> ${certificateId}</p>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/academy/profile" 
           style="display: inline-block; padding: 12px 24px; background-color: #00E881; color: #000; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px;">
          View Certificate
        </a>
        <p style="margin-top: 30px; color: #666; font-size: 14px;">Keep up the great work!</p>
        <p style="color: #666; font-size: 14px;">The NanoFlows Academy Team</p>
      </div>
    `
  })
};

module.exports = {
  sendEmail,
  templates
};

