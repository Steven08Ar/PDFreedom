import React, { useState, useEffect, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

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

    const handleZoomIn = useCallback(() => setScale(s => Math.min(3.0, s + 0.1)), []);
    const handleZoomOut = useCallback(() => setScale(s => Math.max(0.5, s - 0.1)), []);
    const handleZoomReset = useCallback(() => setScale(1.0), []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === '=' || e.key === '+') {
                    e.preventDefault();
                    handleZoomIn();
                } else if (e.key === '-') {
                    e.preventDefault();
                    handleZoomOut();
                } else if (e.key === '0') {
                    e.preventDefault();
                    handleZoomReset();
                }
            }
        };

        const handleWheel = (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                if (e.deltaY < 0) {
                    handleZoomIn();
                } else {
                    handleZoomOut();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('wheel', handleWheel);
        };
    }, [handleZoomIn, handleZoomOut, handleZoomReset]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between bg-secondary p-2 rounded-t-lg border-b border-gray-700 mb-4 hidden">
                {/* Hidden controls, relying on shortcuts or external UI if needed, 
                     but keeping structure if we want to revive them later or move them to header */}
            </div>

            <div className="flex-1 overflow-auto flex justify-center bg-gray-100 dark:bg-gray-900/50 p-4">
                <Document
                    file={file}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="shadow-lg"
                    loading={<div className="text-center p-10 text-gray-500">Loading PDF...</div>}
                >
                    <Page
                        pageNumber={pageNumber}
                        scale={scale}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                        className="shadow-xl"
                    />
                </Document>
            </div>

            {/* Floating Zoom Controls (Optional, for visual feedback) */}
            <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-black/70 backdrop-blur-sm text-white p-2 rounded-full shadow-xl z-20">
                <button onClick={handleZoomOut} className="p-1.5 hover:bg-white/20 rounded-full transition-colors">
                    <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-medium w-10 text-center">{Math.round(scale * 100)}%</span>
                <button onClick={handleZoomIn} className="p-1.5 hover:bg-white/20 rounded-full transition-colors">
                    <ZoomIn className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default PDFViewer;
