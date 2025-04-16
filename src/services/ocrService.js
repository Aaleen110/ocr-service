import { createWorker } from 'tesseract.js';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tempDir = path.join(__dirname, '../temp');

// Ensure temp directory exists
await fs.mkdir(tempDir, { recursive: true });

const performOCR = async (imageBuffer) => {
    const worker = await createWorker('eng');
    try {
        const { data: { text } } = await worker.recognize(imageBuffer);
        return text;
    } catch (error) {
        console.error('Error during OCR processing:', error);
        throw new Error('OCR processing failed');
    } finally {
        await worker.terminate();
        console.log('Tesseract worker terminated.');
    }
};

const performPDFOCR = async (pdfBuffer) => {
    let worker = null;
    const tempFiles = [];
    try {
        // Save the uploaded PDF to a temporary file
        const pdfPath = path.join(tempDir, `temp_${Date.now()}.pdf`);
        await fs.writeFile(pdfPath, pdfBuffer);
        tempFiles.push(pdfPath);

        // Convert PDF to images using pdftoppm
        const outputPrefix = path.join(tempDir, `page_${Date.now()}`);
        await execAsync(`pdftoppm -png -r 300 "${pdfPath}" "${outputPrefix}"`);

        // Get all generated PNG files
        const files = await fs.readdir(tempDir);
        const pageFiles = files
            .filter(file => file.startsWith(path.basename(outputPrefix)))
            .sort();

        // Initialize worker
        worker = await createWorker('eng');
        let extractedText = '';

        // Process each page
        for (const pageFile of pageFiles) {
            const pagePath = path.join(tempDir, pageFile);
            tempFiles.push(pagePath);
            const imageBuffer = await fs.readFile(pagePath);

            // Process image with sharp for better OCR results
            const processedImage = await sharp(imageBuffer)
                .sharpen()
                .toBuffer();

            // Perform OCR on the processed image
            const { data: { text } } = await worker.recognize(processedImage);
            extractedText += text + '\n\n';
        }
        return extractedText.trim();
    } catch (err) {
        console.error('PDF OCR failed:', err);
        throw new Error('PDF OCR processing failed');
    } finally {
        // Clean up worker
        if (worker) {
            await worker.terminate();
        }
        // Clean up temporary files
        for (const file of tempFiles) {
            try {
                await fs.unlink(file);
            } catch (err) {
                console.error(`Failed to delete temporary file ${file}:`, err);
            }
        }
    }
};

export default { performOCR, performPDFOCR };
