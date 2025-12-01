const pdfService = require('../services/pdfService');

exports.mergePDFs = async (req, res) => {
    try {
        if (!req.files || req.files.length < 2) {
            return res.status(400).json({ error: 'Please upload at least 2 PDF files' });
        }
        const mergedPdfBuffer = await pdfService.mergePDFs(req.files);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=merged.pdf',
            'Content-Length': mergedPdfBuffer.length,
        });
        res.send(Buffer.from(mergedPdfBuffer));
    } catch (error) {
        console.error('Merge error:', error);
        res.status(500).json({ error: 'Failed to merge PDFs' });
    }
};

exports.splitPDF = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Please upload a PDF file' });
        }
        const { pageIndices } = req.body; // Expecting JSON string of array of indices
        if (!pageIndices) {
            return res.status(400).json({ error: 'Please provide page indices to split' });
        }

        const indices = JSON.parse(pageIndices);
        const splitPdfBuffer = await pdfService.splitPDF(req.file, indices);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=split.pdf',
            'Content-Length': splitPdfBuffer.length,
        });
        res.send(Buffer.from(splitPdfBuffer));
    } catch (error) {
        console.error('Split error:', error);
        res.status(500).json({ error: 'Failed to split PDF' });
    }
};

exports.clonePDF = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Please upload a PDF file' });
        }
        // Cloning is essentially just returning the file, but we can process it to ensure it's a valid new PDF
        const clonedPdfBuffer = await pdfService.clonePDF(req.file);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=cloned.pdf',
            'Content-Length': clonedPdfBuffer.length,
        });
        res.send(Buffer.from(clonedPdfBuffer));
    } catch (error) {
        console.error('Clone error:', error);
        res.status(500).json({ error: 'Failed to clone PDF' });
    }
};

exports.organizePDF = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Please upload a PDF file' });
        }
        const { pagesConfig } = req.body;
        if (!pagesConfig) {
            return res.status(400).json({ error: 'Please provide pages configuration' });
        }

        const config = JSON.parse(pagesConfig);
        const organizedPdfBuffer = await pdfService.organizePDF(req.file, config);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=organized.pdf',
            'Content-Length': organizedPdfBuffer.length,
        });
        res.send(Buffer.from(organizedPdfBuffer));
    } catch (error) {
        console.error('Organize error:', error);
        res.status(500).json({ error: 'Failed to organize PDF' });
    }
};

exports.addWatermark = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Please upload a PDF file' });
        }
        const { text, options } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Please provide watermark text' });
        }

        const parsedOptions = options ? JSON.parse(options) : {};
        const watermarkedPdfBuffer = await pdfService.addWatermark(req.file, text, parsedOptions);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=watermarked.pdf',
            'Content-Length': watermarkedPdfBuffer.length,
        });
        res.send(Buffer.from(watermarkedPdfBuffer));
    } catch (error) {
        console.error('Watermark error:', error);
        res.status(500).json({ error: 'Failed to add watermark' });
    }
};

exports.editPDF = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Please upload a PDF file' });
        }
        const { operations } = req.body;
        if (!operations) {
            return res.status(400).json({ error: 'Please provide edit operations' });
        }

        const parsedOps = JSON.parse(operations);
        // If there are images, we might need to handle them. 
        // For simplicity, we assume images are sent as base64 strings in the JSON for now,
        // or we could handle multipart uploads for images if we want to be more robust.
        // Given the complexity, base64 in JSON is easiest for a prototype.

        const editedPdfBuffer = await pdfService.editPDF(req.file, parsedOps);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=edited.pdf',
            'Content-Length': editedPdfBuffer.length,
        });
        res.send(Buffer.from(editedPdfBuffer));
    } catch (error) {
        console.error('Edit error:', error);
        res.status(500).json({ error: 'Failed to edit PDF' });
    }
};


