# 🧠 OCR Service – Node.js + Tesseract.js

This project implements an **OCR (Optical Character Recognition)** service using a **Node.js** and **Express** backend. It provides a simple, RESTful API to extract text from image files using the [Tesseract.js](https://github.com/naptha/tesseract.js) library.

---

## 🚀 Features

- **📡 REST API**: Exposes a `POST /ocr` endpoint to handle OCR tasks and a `GET /` endpoint for health checks.
- **🧠 Tesseract.js Powered**: Uses the powerful [Tesseract OCR engine](https://tesseract.projectnaptha.com/) for text recognition (defaults to English).
- **📷 Image Upload**: Handles `multipart/form-data` image uploads using `multer`. The image is processed directly from memory.
- **⚙️ Express Framework**: Built with [Express.js](https://expressjs.com/) for easy setup and routing.
- **🌐 CORS Enabled**: Includes CORS middleware to support cross-origin requests.
- **🔐 Environment Config**: Loads config (e.g., `PORT`) from a `.env` file using `dotenv`.
- **⚡ Async/Await**: Fully asynchronous, non-blocking operations.
- **🚨 Error Handling**: Middleware for clean error responses and server stability.

---

## 📦 Installation

```bash
git clone https://github.com/Aaleen110/ocr-service.git
cd ocr-service
npm install
