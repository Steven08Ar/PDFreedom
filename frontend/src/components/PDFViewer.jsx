import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

// Configure worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PDFViewer = ({ file }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between bg-secondary p-2 rounded-t-lg border-b border-gray-700 mb-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                        disabled={pageNumber <= 1}
                        className="p-1 hover:bg-gray-700 rounded disabled:opacity-50"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm">
                        Page {pageNumber} of {numPages || '--'}
                    </span>
                    <button
                        onClick={() => setPageNumber(Math.min(numPages || 1, pageNumber + 1))}
                        disabled={pageNumber >= numPages}
                        className="p-1 hover:bg-gray-700 rounded disabled:opacity-50"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="p-1 hover:bg-gray-700 rounded">
                        <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-sm w-12 text-center">{Math.round(scale * 100)}%</span>
                    <button onClick={() => setScale(s => Math.min(2.0, s + 0.1))} className="p-1 hover:bg-gray-700 rounded">
                        <ZoomIn className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto flex justify-center bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <Document
                    file={file}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="shadow-lg"
                    loading={<div className="text-center p-10">Loading PDF...</div>}
                >
                    <Page
                        pageNumber={pageNumber}
                        scale={scale}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="shadow-xl"
                    />
                </Document>
            </div>
        </div>
    );
};

export default PDFViewer;
