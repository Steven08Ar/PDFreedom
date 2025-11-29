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
