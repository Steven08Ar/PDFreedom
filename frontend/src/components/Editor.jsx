import React, { useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Type, Image as ImageIcon, Eraser, Save, MousePointer, X } from 'lucide-react';

// Configure worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const Editor = ({ file, onSave, onCancel }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [tool, setTool] = useState('cursor'); // cursor, text, image, eraser
    const [elements, setElements] = useState([]); // { type, x, y, page, content, ... }
    const [tempText, setTempText] = useState('');

    const pdfWrapperRef = useRef(null);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const handlePageClick = (e) => {
        if (tool === 'cursor') return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / scale;
        const y = (e.clientY - rect.top) / scale;

        if (tool === 'text') {
            const text = prompt('Enter text:');
            if (text) {
                setElements([...elements, {
                    type: 'text',
                    x,
                    y,
                    page: pageNumber - 1, // 0-based for backend
                    text,
                    size: 12,
                    color: { r: 0, g: 0, b: 0 }
                }]);
            }
        } else if (tool === 'eraser') {
            // Add a white rectangle
            setElements([...elements, {
                type: 'rectangle',
                x,
                y,
                page: pageNumber - 1,
                width: 100, // Default width
                height: 20, // Default height
                color: { r: 1, g: 1, b: 1 }
            }]);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                // We'll place it at 0,0 initially or center
                setElements([...elements, {
                    type: 'image',
                    x: 50,
                    y: 50,
                    page: pageNumber - 1,
                    image: event.target.result, // base64
                    imageType: file.type.includes('png') ? 'png' : 'jpg',
                    width: 100,
                    height: 100
                }]);
                setTool('cursor');
            };
            reader.readAsArrayBuffer(file); // For backend we might need ArrayBuffer, but for preview we need base64. 
            // Actually for pdf-lib embedPng/Jpg it takes ArrayBuffer or Base64. 
            // Let's use Base64 for simplicity in JSON.
        }
    };

    // Helper to read file as base64 for JSON transport
    const readFileAsBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleSave = async () => {
        // Convert elements to backend operations
        // We need to handle images carefully.
        const operations = await Promise.all(elements.map(async (el) => {
            if (el.type === 'image' && typeof el.image !== 'string') {
                // If we stored it as something else
            }
            return el;
        }));

        onSave(JSON.stringify(operations));
    };

    return (
        <div className="h-full flex flex-col bg-gray-100 dark:bg-gray-900">
            {/* Toolbar */}
            <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center shadow-sm z-10">
                <div className="flex gap-2">
                    <button
                        onClick={() => setTool('cursor')}
                        className={`p-2 rounded-lg ${tool === 'cursor' ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        title="Select"
                    >
                        <MousePointer className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setTool('text')}
                        className={`p-2 rounded-lg ${tool === 'text' ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        title="Add Text"
                    >
                        <Type className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setTool('eraser')}
                        className={`p-2 rounded-lg ${tool === 'eraser' ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        title="Whiteout / Redact"
                    >
                        <Eraser className="w-5 h-5" />
                    </button>
                    <label className={`p-2 rounded-lg cursor-pointer ${tool === 'image' ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                        <ImageIcon className="w-5 h-5" />
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                readFileAsBase64(file).then(base64 => {
                                    setElements([...elements, {
                                        type: 'image',
                                        x: 50,
                                        y: 50,
                                        page: pageNumber - 1,
                                        image: base64, // Data URL
                                        imageType: file.type.includes('png') ? 'png' : 'jpg',
                                        width: 100,
                                        height: 100
                                    }]);
                                });
                            }
                        }} />
                    </label>
                </div>

                <div className="flex gap-2">
                    <button onClick={onCancel} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover flex items-center gap-2">
                        <Save className="w-4 h-4" /> Save PDF
                    </button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 overflow-auto flex justify-center p-8 relative bg-gray-200 dark:bg-gray-900">
                <div className="relative shadow-lg" ref={pdfWrapperRef}>
                    <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                        <Page
                            pageNumber={pageNumber}
                            scale={scale}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            onClick={handlePageClick}
                            className="cursor-crosshair"
                        />
                    </Document>

                    {/* Overlays */}
                    {elements.filter(el => el.page === pageNumber - 1).map((el, i) => (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                left: el.x * scale,
                                top: el.y * scale,
                                width: el.width ? el.width * scale : 'auto',
                                height: el.height ? el.height * scale : 'auto',
                                color: el.color ? `rgb(${el.color.r * 255},${el.color.g * 255},${el.color.b * 255})` : 'black',
                                fontSize: el.size ? el.size * scale : 12,
                                backgroundColor: el.type === 'rectangle' ? 'white' : 'transparent',
                                border: tool === 'cursor' ? '1px dashed blue' : 'none',
                                pointerEvents: tool === 'cursor' ? 'auto' : 'none'
                            }}
                            className="select-none"
                        >
                            {el.type === 'text' && el.text}
                            {el.type === 'image' && <img src={el.image} alt="inserted" className="w-full h-full object-contain" />}
                            {el.type === 'rectangle' && <div className="w-full h-full bg-white opacity-100" />}

                            {tool === 'cursor' && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setElements(elements.filter((_, idx) => idx !== i));
                                    }}
                                    className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-0.5"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg flex items-center gap-4">
                <button onClick={() => setPageNumber(Math.max(1, pageNumber - 1))} disabled={pageNumber <= 1}>&lt;</button>
                <span>{pageNumber} / {numPages}</span>
                <button onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))} disabled={pageNumber >= numPages}>&gt;</button>
            </div>
        </div>
    );
};

export default Editor;
