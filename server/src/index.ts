import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { analyzeImageController } from './controllers/analyzeController';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Set up Multer for memory storage (max 10MB to avoid "Image too large" errors crashing node, though we handle it below)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported image'));
    }
  }
});

// Route
app.post('/api/analyze', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      if (err.message === 'Unsupported image') {
        return res.status(400).json({ error: 'Unsupported image' });
      }
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'Image too large' });
      }
      return res.status(500).json({ error: 'Processing failed' });
    }
    next();
  });
}, analyzeImageController);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
