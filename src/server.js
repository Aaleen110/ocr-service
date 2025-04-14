import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { createWorker } from 'tesseract.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const upload = multer({ storage: multer.memoryStorage() });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// OCR endpoint
app.post('/ocr', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }

  const worker = await createWorker('eng');

  try {
    const {
      data: { text },
    } = await worker.recognize(req.file.buffer);

    res.json({ text });
  } catch (err) {
    console.error('OCR failed:', err);
    res.status(500).json({ error: 'OCR processing failed' });
  } finally {
    await worker.terminate();
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'OCR server is running!' });
});

// Start server
app.listen(port, () => {
  console.log(`🧠 OCR server listening at http://localhost:${port}`);
});
