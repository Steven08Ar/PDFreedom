const { PDFDocument } = require('pdf-lib');

exports.mergePDFs = async (files) => {
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
        const pdf = await PDFDocument.load(file.buffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    return await mergedPdf.save();
};

exports.splitPDF = async (file, pageIndices) => {
    // pageIndices is an array of 0-based page numbers to KEEP
    const pdfDoc = await PDFDocument.load(file.buffer);
    const newPdf = await PDFDocument.create();

    const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
    copiedPages.forEach((page) => newPdf.addPage(page));

    return await newPdf.save();
};

exports.clonePDF = async (file) => {
    const pdfDoc = await PDFDocument.load(file.buffer);
    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    copiedPages.forEach((page) => newPdf.addPage(page));
    return await newPdf.save();
}
