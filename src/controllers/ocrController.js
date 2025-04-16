import ocrService from '../services/ocrService.js';

// Controller for the health check endpoint
const handleHealthCheck = (req, res) => {
    res.json({ message: 'OCR server is running!' });
};

// Controller for the OCR endpoint (PDF)
const handleOCRRequest = async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No PDF uploaded' });
    }
    try {
        const text = await ocrService.performPDFOCR(req.file.buffer);
        res.json({ text });
    } catch (error) {
        console.error('PDF OCR request failed:', error.message);
        next(new Error('PDF OCR processing failed'));
    }
};

export { handleHealthCheck, handleOCRRequest };
