import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ocrRoutes from './routes/ocrRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount Routes
app.use('/', ocrRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error caught by central handler:", err.stack);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
  console.log(`🧠 OCR server listening at http://localhost:${port}`);
});
