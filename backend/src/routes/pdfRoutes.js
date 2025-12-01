const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfController = require('../controllers/pdfController');

// Multer setup for memory storage
const upload = multer({ storage: multer.memoryStorage() });

router.post('/merge', upload.array('files'), pdfController.mergePDFs);
router.post('/split', upload.single('file'), pdfController.splitPDF);
router.post('/clone', upload.single('file'), pdfController.clonePDF);
router.post('/organize', upload.single('file'), pdfController.organizePDF);
router.post('/watermark', upload.single('file'), pdfController.addWatermark);
router.post('/edit', upload.single('file'), pdfController.editPDF);

module.exports = router;
