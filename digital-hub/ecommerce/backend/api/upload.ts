import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

const UPLOAD_DIR = path.join(process.cwd(), 'digital-hub/ecommerce/backend/uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subdir = req.query.type as string || 'general';
    const uploadPath = path.join(UPLOAD_DIR, subdir);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 10,
  },
});

router.post('/single', authenticate, upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.query.type || 'general'}/${req.file.filename}`;

    res.json({
      success: true,
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, error: 'File upload failed' });
  }
});

router.post('/multiple', authenticate, upload.array('files', 10), async (req: Request, res: Response) => {
  try {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({ success: false, error: 'No files uploaded' });
    }

    const files = (req.files as Express.Multer.File[]).map((file) => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `/uploads/${req.query.type || 'general'}/${file.filename}`,
    }));

    res.json({ success: true, data: files });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({ success: false, error: 'Files upload failed' });
  }
});

router.post('/product-images', authenticate, requireAdmin, upload.array('images', 10), async (req: Request, res: Response) => {
  try {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({ success: false, error: 'No images uploaded' });
    }

    const images = (req.files as Express.Multer.File[]).map((file) => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `/uploads/products/${file.filename}`,
    }));

    res.json({ success: true, data: images });
  } catch (error) {
    console.error('Product images upload error:', error);
    res.status(500).json({ success: false, error: 'Product images upload failed' });
  }
});

router.delete('/:type/:filename', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { type, filename } = req.params;
    const filePath = path.join(UPLOAD_DIR, type, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'File not found' });
    }

    fs.unlinkSync(filePath);
    res.json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete file' });
  }
});

router.get('/list/:type?', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const type = req.params.type || 'general';
    const dirPath = path.join(UPLOAD_DIR, type);

    if (!fs.existsSync(dirPath)) {
      return res.json({ success: true, data: [] });
    }

    const files = fs.readdirSync(dirPath).map((filename) => {
      const filePath = path.join(dirPath, filename);
      const stats = fs.statSync(filePath);

      return {
        filename,
        url: `/uploads/${type}/${filename}`,
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
      };
    });

    res.json({ success: true, data: files });
  } catch (error) {
    console.error('List files error:', error);
    res.status(500).json({ success: false, error: 'Failed to list files' });
  }
});

export default router;
