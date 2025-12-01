import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { RotateCw, Trash2, ArrowLeft, ArrowRight, Save } from 'lucide-react';

// Configure worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PageOrganizer = ({ file, onSave, onCancel }) => {
    const [numPages, setNumPages] = useState(null);
    const [pages, setPages] = useState([]); // [{ index: 0, rotation: 0, id: 0 }]

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        const initialPages = Array.from({ length: numPages }, (_, i) => ({
            index: i,
            rotation: 0,
            id: i
        }));
        setPages(initialPages);
    }

    const rotatePage = (id) => {
        setPages(pages.map(p => p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p));
    };

    const deletePage = (id) => {
        setPages(pages.filter(p => p.id !== id));
    };

    const movePage = (index, direction) => {
        if (direction === 'left' && index > 0) {
            const newPages = [...pages];
            [newPages[index], newPages[index - 1]] = [newPages[index - 1], newPages[index]];
            setPages(newPages);
        } else if (direction === 'right' && index < pages.length - 1) {
            const newPages = [...pages];
            [newPages[index], newPages[index + 1]] = [newPages[index + 1], newPages[index]];
            setPages(newPages);
        }
    };

    const handleSave = () => {
        onSave(pages);
    };

    return (
        <div className="h-full flex flex-col bg-gray-100 dark:bg-gray-900">
            <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Organize Pages</h3>
                <div className="flex gap-2">
                    <button onClick={onCancel} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover flex items-center gap-2">
                        <Save className="w-4 h-4" /> Save Changes
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    <Document file={file} onLoadSuccess={onDocumentLoadSuccess} className="hidden" />

                    {pages.map((page, i) => (
                        <div key={page.id} className="relative group bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:border-primary transition-colors">
                            <div className="aspect-[1/1.4] bg-gray-200 dark:bg-gray-900 rounded overflow-hidden relative flex items-center justify-center">
                                <Document file={file}>
                                    <Page
                                        pageNumber={page.index + 1}
                                        width={200}
                                        rotate={page.rotation}
                                        renderTextLayer={false}
                                        renderAnnotationLayer={false}
                                    />
                                </Document>
                                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                    {i + 1}
                                </div>
                            </div>

                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-lg">
                                <button onClick={() => rotatePage(page.id)} className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-full" title="Rotate">
                                    <RotateCw className="w-5 h-5" />
                                </button>
                                <button onClick={() => deletePage(page.id)} className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full" title="Delete">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mt-2 flex justify-between px-2">
                                <button onClick={() => movePage(i, 'left')} disabled={i === 0} className="text-gray-400 hover:text-primary disabled:opacity-30">
                                    <ArrowLeft className="w-4 h-4" />
                                </button>
                                <button onClick={() => movePage(i, 'right')} disabled={i === pages.length - 1} className="text-gray-400 hover:text-primary disabled:opacity-30">
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PageOrganizer;
