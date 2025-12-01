const { PDFDocument, degrees } = require('pdf-lib');

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

exports.organizePDF = async (file, pagesConfig) => {
    // pagesConfig: [{ index: number, rotation: number }]
    const pdfDoc = await PDFDocument.load(file.buffer);
    const newPdf = await PDFDocument.create();

    for (const config of pagesConfig) {
        const [page] = await newPdf.copyPages(pdfDoc, [config.index]);
        page.setRotation(degrees(config.rotation || 0));
        newPdf.addPage(page);
    }

    return await newPdf.save();
};

exports.addWatermark = async (file, text, options = {}) => {
    const {
        size = 50,
        opacity = 0.5,
        color = { r: 0.75, g: 0.75, b: 0.75 },
        rotate = 45
    } = options;

    const pdfDoc = await PDFDocument.load(file.buffer);
    const pages = pdfDoc.getPages();
    const { rgb } = require('pdf-lib');

    for (const page of pages) {
        const { width, height } = page.getSize();
        page.drawText(text, {
            x: width / 2 - (size * text.length) / 4,
            y: height / 2,
            size: size,
            opacity: opacity,
            color: rgb(color.r, color.g, color.b),
            rotate: degrees(rotate),
        });
    }

    return await pdfDoc.save();
};

exports.editPDF = async (file, operations) => {
    const pdfDoc = await PDFDocument.load(file.buffer);
    const pages = pdfDoc.getPages();
    const { rgb } = require('pdf-lib');

    for (const op of operations) {
        const page = pages[op.page];
        const { height } = page.getSize();
        const pdfY = height - op.y;

        if (op.type === 'text') {
            page.drawText(op.text, {
                x: op.x,
                y: pdfY - (op.size || 12),
                size: op.size || 12,
                color: op.color ? rgb(op.color.r, op.color.g, op.color.b) : rgb(0, 0, 0),
            });
        } else if (op.type === 'rectangle') {
            page.drawRectangle({
                x: op.x,
                y: pdfY - op.height,
                width: op.width,
                height: op.height,
                color: op.color ? rgb(op.color.r, op.color.g, op.color.b) : rgb(1, 1, 1),
            });
        } else if (op.type === 'image') {
            let embeddedImage;
            const imageData = op.image.split(',')[1];
            const buffer = Buffer.from(imageData, 'base64');

            if (op.imageType === 'png') {
                embeddedImage = await pdfDoc.embedPng(buffer);
            } else {
                embeddedImage = await pdfDoc.embedJpg(buffer);
            }

            page.drawImage(embeddedImage, {
                x: op.x,
                y: pdfY - op.height,
                width: op.width,
                height: op.height,
            });
        }
    }

    return await pdfDoc.save();
};
