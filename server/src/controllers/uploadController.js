const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadFile } = require('../services/cloudinaryService');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const prefix = req.body.type || 'file';
    cb(null, prefix + '-' + uniqueSuffix + ext);
  }
});

// File filter for images and videos
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedVideoTypes = /mp4|webm|ogg|mov/;
  const allowedPdfTypes = /pdf/;
  
  const extname = path.extname(file.originalname).toLowerCase().replace('.', '');
  const mimetype = file.mimetype;

  if (allowedImageTypes.test(extname) && allowedImageTypes.test(mimetype)) {
    return cb(null, true);
  } else if (allowedVideoTypes.test(extname) && allowedVideoTypes.test(mimetype)) {
    return cb(null, true);
  } else if (allowedPdfTypes.test(extname) && allowedPdfTypes.test(mimetype)) {
    return cb(null, true);
  } else {
    cb(new Error('Only image (jpeg, jpg, png, gif, webp), video (mp4, webm, ogg, mov), and PDF files are allowed'));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB limit for videos
  },
  fileFilter: fileFilter
});

// Single file upload
const uploadSingle = upload.single('file');

const uploadImage = async (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      // Try to upload to Cloudinary/S3 first
      const fileBuffer = fs.readFileSync(req.file.path);
      const fileName = req.file.filename;
      const folder = req.body.folder || 'uploads';
      
      let fileUrl = null;
      if (process.env.CLOUDINARY_CLOUD_NAME || process.env.AWS_S3_BUCKET) {
        fileUrl = await uploadFile(fileBuffer, fileName, folder);
      }

      // If cloud upload failed or not configured, use local URL
      if (!fileUrl) {
        fileUrl = `/uploads/${req.file.filename}`;
      } else {
        // Delete local file if uploaded to cloud
        fs.unlinkSync(req.file.path);
      }

      res.json({
        success: true,
        url: fileUrl,
        filename: req.file.filename
      });
    } catch (error) {
      console.error('Upload error:', error);
      // Fallback to local URL
      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({
        success: true,
        url: fileUrl,
        filename: req.file.filename
      });
    }
  });
};

// Upload video (for course videos)
const uploadVideo = async (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      const fileBuffer = fs.readFileSync(req.file.path);
      const fileName = req.file.filename;
      const folder = 'videos';
      
      let fileUrl = null;
      if (process.env.CLOUDINARY_CLOUD_NAME || process.env.AWS_S3_BUCKET) {
        fileUrl = await uploadFile(fileBuffer, fileName, folder);
      }

      if (!fileUrl) {
        fileUrl = `/uploads/${req.file.filename}`;
      } else {
        fs.unlinkSync(req.file.path);
      }

      res.json({
        success: true,
        url: fileUrl,
        filename: req.file.filename,
        size: req.file.size
      });
    } catch (error) {
      console.error('Video upload error:', error);
      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({
        success: true,
        url: fileUrl,
        filename: req.file.filename,
        size: req.file.size
      });
    }
  });
};

// Upload resource file (PDFs, docs, zip, etc.)
const uploadResource = async (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      const fileBuffer = fs.readFileSync(req.file.path);
      const fileName = req.file.filename;
      const folder = 'resources';
      
      let fileUrl = null;
      if (process.env.CLOUDINARY_CLOUD_NAME || process.env.AWS_S3_BUCKET) {
        fileUrl = await uploadFile(fileBuffer, fileName, folder);
      }

      if (!fileUrl) {
        fileUrl = `/uploads/${req.file.filename}`;
      } else {
        fs.unlinkSync(req.file.path);
      }

      // Determine file type from extension
      const ext = path.extname(fileName).toLowerCase().replace('.', '');
      const fileType = ['pdf'].includes(ext) ? 'pdf' : 
                      ['doc', 'docx'].includes(ext) ? 'doc' : 
                      ['zip', 'rar', '7z'].includes(ext) ? 'zip' : 'other';

      res.json({
        success: true,
        url: fileUrl,
        filename: req.file.filename,
        size: req.file.size,
        file_type: fileType
      });
    } catch (error) {
      console.error('Resource upload error:', error);
      const fileUrl = `/uploads/${req.file.filename}`;
      const ext = path.extname(req.file.filename).toLowerCase().replace('.', '');
      const fileType = ['pdf'].includes(ext) ? 'pdf' : 
                      ['doc', 'docx'].includes(ext) ? 'doc' : 
                      ['zip', 'rar', '7z'].includes(ext) ? 'zip' : 'other';
      res.json({
        success: true,
        url: fileUrl,
        filename: req.file.filename,
        size: req.file.size,
        file_type: fileType
      });
    }
  });
};

// Upload thumbnail (for course thumbnails)
const uploadThumbnail = async (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      const fileBuffer = fs.readFileSync(req.file.path);
      const fileName = req.file.filename;
      const folder = 'thumbnails';
      
      let fileUrl = null;
      if (process.env.CLOUDINARY_CLOUD_NAME || process.env.AWS_S3_BUCKET) {
        fileUrl = await uploadFile(fileBuffer, fileName, folder);
      }

      if (!fileUrl) {
        fileUrl = `/uploads/${req.file.filename}`;
      } else {
        fs.unlinkSync(req.file.path);
      }

      res.json({
        success: true,
        url: fileUrl,
        filename: req.file.filename
      });
    } catch (error) {
      console.error('Thumbnail upload error:', error);
      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({
        success: true,
        url: fileUrl,
        filename: req.file.filename
      });
    }
  });
};

// Upload student file (for assignments) - students can upload
const uploadStudentFile = async (req, res) => {
  // Create a more permissive file filter for student uploads
  const studentFileFilter = (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|txt|zip|rar|jpg|jpeg|png|gif|webp|mp4|webm|ogg|mov/;
    const extname = path.extname(file.originalname).toLowerCase().replace('.', '');
    
    if (allowedTypes.test(extname)) {
      return cb(null, true);
    } else {
      cb(new Error('File type not allowed. Allowed: PDF, DOC, DOCX, TXT, ZIP, RAR, images, videos'));
    }
  };

  const studentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, 'student-' + uniqueSuffix + ext);
    }
  });

  const studentUpload = multer({
    storage: studentStorage,
    limits: {
      fileSize: 50 * 1024 * 1024 // 50MB limit for student files
    },
    fileFilter: studentFileFilter
  }).single('file');

  studentUpload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      const fileBuffer = fs.readFileSync(req.file.path);
      const fileName = req.file.filename;
      const folder = 'student-files';
      
      let fileUrl = null;
      if (process.env.CLOUDINARY_CLOUD_NAME || process.env.AWS_S3_BUCKET) {
        fileUrl = await uploadFile(fileBuffer, fileName, folder);
        if (fileUrl) {
          fs.unlinkSync(req.file.path);
        }
      }

      if (!fileUrl) {
        fileUrl = `/uploads/${req.file.filename}`;
      }

      const ext = path.extname(fileName).toLowerCase().replace('.', '');
      const fileType = ['pdf'].includes(ext) ? 'pdf' : 
                      ['doc', 'docx'].includes(ext) ? 'doc' : 
                      ['zip', 'rar', '7z'].includes(ext) ? 'zip' : 
                      ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext) ? 'image' :
                      ['mp4', 'webm', 'ogg', 'mov'].includes(ext) ? 'video' : 'other';

      res.json({
        success: true,
        fileUrl: fileUrl,
        url: fileUrl, // For compatibility
        filename: req.file.filename,
        size: req.file.size,
        file_type: fileType
      });
    } catch (error) {
      console.error('Student file upload error:', error);
      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({
        success: true,
        fileUrl: fileUrl,
        url: fileUrl,
        filename: req.file.filename,
        size: req.file.size,
        file_type: 'other'
      });
    }
  });
};

module.exports = {
  uploadImage,
  uploadVideo,
  uploadThumbnail,
  uploadResource,
  uploadStudentFile,
  upload
};

