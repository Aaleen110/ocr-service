import express from 'express';
import multer from 'multer';
import { handleHealthCheck, handleOCRRequest } from '../controllers/ocrController.js'; // We will create these functions next

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Health check route
router.get('/', handleHealthCheck);

// OCR route
router.post('/ocr', upload.single('image'), handleOCRRequest);

export default router;
