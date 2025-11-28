import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

const STORAGE_DIR = path.join(process.cwd(), 'digital-hub/ecommerce/backend/storage');
const DATA_DIR = path.join(STORAGE_DIR, 'data');
const CACHE_DIR = path.join(STORAGE_DIR, 'cache');
const TEMP_DIR = path.join(STORAGE_DIR, 'temp');

[STORAGE_DIR, DATA_DIR, CACHE_DIR, TEMP_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const readJsonFile = (filePath: string): any => {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error('Read file error:', error);
    return null;
  }
};

const writeJsonFile = (filePath: string, data: any): boolean => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Write file error:', error);
    return false;
  }
};

router.get('/data/:key', authenticate, async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const filePath = path.join(DATA_DIR, `${key}.json`);
    const data = readJsonFile(filePath);

    if (data === null) {
      return res.status(404).json({ success: false, error: 'Data not found' });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Get data error:', error);
    res.status(500).json({ success: false, error: 'Failed to get data' });
  }
});

router.post('/data/:key', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const filePath = path.join(DATA_DIR, `${key}.json`);

    const success = writeJsonFile(filePath, {
      ...req.body,
      _meta: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });

    if (!success) {
      return res.status(500).json({ success: false, error: 'Failed to save data' });
    }

    res.json({ success: true, message: 'Data saved successfully' });
  } catch (error) {
    console.error('Save data error:', error);
    res.status(500).json({ success: false, error: 'Failed to save data' });
  }
});

router.put('/data/:key', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const filePath = path.join(DATA_DIR, `${key}.json`);
    const existingData = readJsonFile(filePath) || {};

    const success = writeJsonFile(filePath, {
      ...existingData,
      ...req.body,
      _meta: {
        ...existingData._meta,
        updatedAt: new Date().toISOString(),
      },
    });

    if (!success) {
      return res.status(500).json({ success: false, error: 'Failed to update data' });
    }

    res.json({ success: true, message: 'Data updated successfully' });
  } catch (error) {
    console.error('Update data error:', error);
    res.status(500).json({ success: false, error: 'Failed to update data' });
  }
});

router.delete('/data/:key', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const filePath = path.join(DATA_DIR, `${key}.json`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'Data not found' });
    }

    fs.unlinkSync(filePath);
    res.json({ success: true, message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Delete data error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete data' });
  }
});

router.get('/cache/:key', async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const filePath = path.join(CACHE_DIR, `${key}.json`);
    const data = readJsonFile(filePath);

    if (data === null) {
      return res.status(404).json({ success: false, error: 'Cache not found' });
    }

    if (data._meta?.expiresAt && new Date(data._meta.expiresAt) < new Date()) {
      fs.unlinkSync(filePath);
      return res.status(404).json({ success: false, error: 'Cache expired' });
    }

    res.json({ success: true, data: data.value });
  } catch (error) {
    console.error('Get cache error:', error);
    res.status(500).json({ success: false, error: 'Failed to get cache' });
  }
});

router.post('/cache/:key', authenticate, async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const { value, ttl = 3600 } = req.body;
    const filePath = path.join(CACHE_DIR, `${key}.json`);

    const expiresAt = new Date(Date.now() + ttl * 1000).toISOString();

    const success = writeJsonFile(filePath, {
      value,
      _meta: {
        createdAt: new Date().toISOString(),
        expiresAt,
      },
    });

    if (!success) {
      return res.status(500).json({ success: false, error: 'Failed to set cache' });
    }

    res.json({ success: true, message: 'Cache set successfully' });
  } catch (error) {
    console.error('Set cache error:', error);
    res.status(500).json({ success: false, error: 'Failed to set cache' });
  }
});

router.delete('/cache/:key', authenticate, async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const filePath = path.join(CACHE_DIR, `${key}.json`);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ success: true, message: 'Cache cleared' });
  } catch (error) {
    console.error('Delete cache error:', error);
    res.status(500).json({ success: false, error: 'Failed to clear cache' });
  }
});

router.post('/cache/clear-all', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const files = fs.readdirSync(CACHE_DIR);

    files.forEach((file) => {
      fs.unlinkSync(path.join(CACHE_DIR, file));
    });

    res.json({ success: true, message: `Cleared ${files.length} cached items` });
  } catch (error) {
    console.error('Clear all cache error:', error);
    res.status(500).json({ success: false, error: 'Failed to clear cache' });
  }
});

router.get('/stats', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const getDirSize = (dirPath: string): number => {
      let size = 0;

      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        files.forEach((file) => {
          const filePath = path.join(dirPath, file);
          const stats = fs.statSync(filePath);
          size += stats.size;
        });
      }

      return size;
    };

    const getFileCount = (dirPath: string): number => {
      return fs.existsSync(dirPath) ? fs.readdirSync(dirPath).length : 0;
    };

    res.json({
      success: true,
      data: {
        data: {
          size: getDirSize(DATA_DIR),
          files: getFileCount(DATA_DIR),
        },
        cache: {
          size: getDirSize(CACHE_DIR),
          files: getFileCount(CACHE_DIR),
        },
        temp: {
          size: getDirSize(TEMP_DIR),
          files: getFileCount(TEMP_DIR),
        },
      },
    });
  } catch (error) {
    console.error('Storage stats error:', error);
    res.status(500).json({ success: false, error: 'Failed to get storage stats' });
  }
});

router.post('/cleanup', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    let cleaned = 0;

    const tempFiles = fs.existsSync(TEMP_DIR) ? fs.readdirSync(TEMP_DIR) : [];
    tempFiles.forEach((file) => {
      const filePath = path.join(TEMP_DIR, file);
      const stats = fs.statSync(filePath);
      const hourAgo = Date.now() - 60 * 60 * 1000;

      if (stats.mtimeMs < hourAgo) {
        fs.unlinkSync(filePath);
        cleaned++;
      }
    });

    const cacheFiles = fs.existsSync(CACHE_DIR) ? fs.readdirSync(CACHE_DIR) : [];
    cacheFiles.forEach((file) => {
      const filePath = path.join(CACHE_DIR, file);
      const data = readJsonFile(filePath);

      if (data?._meta?.expiresAt && new Date(data._meta.expiresAt) < new Date()) {
        fs.unlinkSync(filePath);
        cleaned++;
      }
    });

    res.json({ success: true, message: `Cleaned up ${cleaned} files` });
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({ success: false, error: 'Failed to cleanup storage' });
  }
});

export default router;
