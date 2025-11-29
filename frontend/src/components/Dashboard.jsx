import React, { useState, useEffect } from 'react';
import FileUploader from './FileUploader';
import PDFViewer from './PDFViewer';
import { mergePDFs, splitPDF, clonePDF } from '../api';
import { X, Download, Play } from 'lucide-react';

const Dashboard = ({ activeTool }) => {
    const [files, setFiles] = useState([]);
    const [processedFile, setProcessedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [splitIndices, setSplitIndices] = useState('');

    // Reset state when tool changes
    useEffect(() => {
        setFiles([]);
        setProcessedFile(null);
        setSplitIndices('');
    }, [activeTool]);

    const handleFilesSelected = (newFiles) => {
        if (activeTool === 'merge') {
            setFiles((prev) => [...prev, ...newFiles]);
        } else {
            setFiles([newFiles[0]]);
        }
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleProcess = async () => {
        setLoading(true);
        try {
            let resultBlob;
            if (activeTool === 'merge') {
                resultBlob = await mergePDFs(files);
            } else if (activeTool === 'split') {
                // Parse indices "1, 3, 5" -> [0, 2, 4] (user uses 1-based, api uses 0-based usually, but let's stick to 0-based for simplicity or convert)
                // Let's assume user inputs 0-based for now to match backend logic or 1-based and we convert.
                // Let's keep it simple: User enters comma separated numbers.
                const indices = splitIndices.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
                resultBlob = await splitPDF(files[0], indices);
            } else if (activeTool === 'clone') {
                resultBlob = await clonePDF(files[0]);
            }

            if (resultBlob) {
                // Create URL for download/preview
                const url = URL.createObjectURL(resultBlob);
                setProcessedFile(url);
            }
        } catch (error) {
            console.error('Error processing PDF:', error);
            alert('Error processing PDF. Check console.');
        } finally {
            setLoading(false);
        }
    };

    const downloadFile = () => {
        if (!processedFile) return;
        const a = document.createElement('a');
        a.href = processedFile;
        a.download = `pdfreedom_${activeTool}_result.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="h-full flex flex-col gap-6">
            {/* Input Section */}
            {!processedFile && (
                <div className="flex-1 flex flex-col gap-4">
                    <div className="bg-secondary p-6 rounded-xl border border-gray-700">
                        <h3 className="text-lg font-semibold mb-4 text-gray-200">
                            {activeTool === 'merge' ? 'Select PDFs to Merge' : 'Select PDF File'}
                        </h3>

                        {files.length === 0 || activeTool === 'merge' ? (
                            <div className="mb-4">
                                <FileUploader
                                    onFilesSelected={handleFilesSelected}
                                    multiple={activeTool === 'merge'}
                                />
                            </div>
                        ) : null}

                        {files.length > 0 && (
                            <div className="space-y-2">
                                {files.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between bg-dark-light p-3 rounded-lg border border-gray-700">
                                        <span className="truncate text-sm">{file.name}</span>
                                        <button onClick={() => removeFile(index)} className="text-gray-400 hover:text-red-400">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Tool Specific Controls */}
                    {activeTool === 'split' && files.length > 0 && (
                        <div className="bg-secondary p-6 rounded-xl border border-gray-700">
                            <label className="block text-sm font-medium mb-2">Page Indices to Keep (0-based, comma separated)</label>
                            <input
                                type="text"
                                value={splitIndices}
                                onChange={(e) => setSplitIndices(e.target.value)}
                                placeholder="e.g. 0, 2, 5"
                                className="w-full bg-dark border border-gray-600 rounded p-2 text-white focus:border-primary outline-none"
                            />
                        </div>
                    )}

                    {/* Action Button */}
                    {files.length > 0 && activeTool !== 'view' && (
                        <button
                            onClick={handleProcess}
                            disabled={loading}
                            className="bg-primary hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : (
                                <>
                                    <Play className="w-5 h-5" />
                                    Process {activeTool}
                                </>
                            )}
                        </button>
                    )}
                </div>
            )}

            {/* Preview / Result Section */}
            {(activeTool === 'view' && files.length > 0) || processedFile ? (
                <div className="flex-1 flex flex-col min-h-0 bg-secondary rounded-xl border border-gray-700 overflow-hidden relative">
                    {processedFile && (
                        <div className="absolute top-4 right-4 z-10">
                            <button
                                onClick={downloadFile}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg"
                            >
                                <Download className="w-4 h-4" /> Download
                            </button>
                            <button
                                onClick={() => setProcessedFile(null)}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg ml-2 shadow-lg"
                            >
                                Close
                            </button>
                        </div>
                    )}
                    <PDFViewer file={processedFile || files[0]} />
                </div>
            ) : null}
        </div>
    );
};

export default Dashboard;
