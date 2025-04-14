import ocrService from '../services/ocrService.js';

// Controller for the health check endpoint
const handleHealthCheck = (req, res) => {
    res.json({ message: 'OCR server is running!' });
};

// Controller for the OCR endpoint
const handleOCRRequest = async (req, res, next) => { // Added next for error handling
    if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
    }

    try {
        const text = await ocrService.performOCR(req.file.buffer);
        res.json({ text });
    } catch (error) {
        // Log the specific service error
        console.error('OCR request failed:', error.message);
        // Pass a generic error to the central error handler
        // Alternatively, could send specific response here: res.status(500).json({ error: 'OCR processing failed' });
        next(new Error('OCR processing failed')); 
    }
};

export { handleHealthCheck, handleOCRRequest };
