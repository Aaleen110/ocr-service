import { createWorker } from 'tesseract.js';

const performOCR = async (imageBuffer) => {
    const worker = await createWorker('eng');
    try {
        const { data: { text } } = await worker.recognize(imageBuffer);
        return text;
    } catch (error) {
        console.error('Error during OCR processing:', error);
        throw new Error('OCR processing failed'); // Re-throw for the controller to handle
    } finally {
        await worker.terminate();
        console.log('Tesseract worker terminated.');
    }
};

export default { performOCR };
