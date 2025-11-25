const fs = require('fs');
const path = require('path');
const pool = require('../config/db');
const { authMiddleware } = require('../middleware/auth');

// Protected video serving - only for users who purchased the course
const serveVideo = async (req, res) => {
  try {
    const { filename } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Find the lesson that uses this video
    const lessonResult = await pool.query(
      `SELECT l.*, m.course_id 
       FROM lessons l
       JOIN modules m ON l.module_id = m.id
       WHERE l.video_url LIKE ?`,
      [`%/uploads/${filename}%`]
    );

    if (lessonResult.rows.length === 0) {
      // Check if it's a course promotional video
      const courseResult = await pool.query(
        `SELECT id FROM courses WHERE promotional_video LIKE ?`,
        [`%/uploads/${filename}%`]
      );

      if (courseResult.rows.length === 0) {
        return res.status(404).json({ error: 'Video not found' });
      }

      const courseId = courseResult.rows[0].id;
      
      // Check if user purchased the course
      const purchaseResult = await pool.query(
        'SELECT id FROM purchases WHERE user_id = ? AND course_id = ?',
        [userId, courseId]
      );

      if (purchaseResult.rows.length === 0 && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Please purchase the course to view videos.' });
      }
    } else {
      const courseId = lessonResult.rows[0].course_id;

      // Check if user purchased the course
      const purchaseResult = await pool.query(
        'SELECT id FROM purchases WHERE user_id = ? AND course_id = ?',
        [userId, courseId]
      );

      if (purchaseResult.rows.length === 0 && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Please purchase the course to view videos.' });
      }
    }

    // Serve the video file
    const videoPath = path.join(__dirname, '../../public/uploads', filename);
    
    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({ error: 'Video file not found' });
    }

    // Determine content type based on file extension
    const ext = path.extname(filename).toLowerCase();
    const contentTypes = {
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.ogg': 'video/ogg',
      '.mov': 'video/quicktime',
      '.avi': 'video/x-msvideo'
    };
    const contentType = contentTypes[ext] || 'video/mp4';

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      // Handle range requests for video streaming
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      // Serve full video
      const head = {
        'Content-Length': fileSize,
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error) {
    console.error('Error serving video:', error);
    res.status(500).json({ error: 'Error serving video' });
  }
};

// Protected file serving - only for users who purchased the course
const serveFile = async (req, res) => {
  try {
    const { filename } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Find the resource that uses this file
    const resourceResult = await pool.query(
      `SELECT r.*, r.course_id 
       FROM resources r
       WHERE r.file_url LIKE ?`,
      [`%/uploads/${filename}%`]
    );

    if (resourceResult.rows.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    const courseId = resourceResult.rows[0].course_id;

    // Check if user purchased the course
    const purchaseResult = await pool.query(
      'SELECT id FROM purchases WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );

    if (purchaseResult.rows.length === 0 && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Please purchase the course to download resources.' });
    }

    // Serve the file
    const filePath = path.join(__dirname, '../../public/uploads', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Determine content type based on file extension
    const ext = path.extname(filename).toLowerCase();
    const contentTypes = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.zip': 'application/zip',
      '.rar': 'application/x-rar-compressed',
      '.7z': 'application/x-7z-compressed',
      '.txt': 'text/plain',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };
    const contentType = contentTypes[ext] || 'application/octet-stream';

    // Set headers for file download
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error serving file:', error);
    res.status(500).json({ error: 'Error serving file' });
  }
};

module.exports = {
  serveVideo,
  serveFile
};

