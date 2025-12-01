import React, { useState, useEffect, useRef } from 'react';
import FileUploader from './FileUploader';
import PDFViewer from './PDFViewer';
import PageOrganizer from './PageOrganizer';
import WatermarkTool from './WatermarkTool';
import Editor from './Editor';
import { mergePDFs, splitPDF, clonePDF, organizePDF, addWatermark, editPDF } from '../api';
import {
    ArrowRight,
    Clock,
    Cloud,
    Download,
    FileText,
    FolderOpen,
    Layers as LayersIcon,
    LogIn,
    PenLine,
    ShieldCheck,
    Split,
    Stamp,
    Star,
    UploadCloud,
    Users,
    Wand2,
    X
} from 'lucide-react';

const Dashboard = ({ activeTool, setActiveTool = () => { }, onFileNameChange, onFileLoaded }) => {
    const [files, setFiles] = useState([]);
    const [processedFile, setProcessedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [splitIndices, setSplitIndices] = useState('');
    const fileInputRef = useRef(null);
    const fileInputMode = useRef('single');

    useEffect(() => {
        if (files.length > 0) {
            onFileNameChange(files[0].name);
            onFileLoaded(true);
        } else {
            onFileNameChange(null);
            onFileLoaded(false);
        }
    }, [files, onFileNameChange, onFileLoaded]);

    const triggerFileDialog = (mode = 'single') => {
        fileInputMode.current = mode;
        if (fileInputRef.current) {
            fileInputRef.current.multiple = mode === 'multiple';
            fileInputRef.current.value = '';
            fileInputRef.current.click();
        }
    };

    const handleQuickFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files || []);
        if (!selectedFiles.length) return;

        if (fileInputMode.current === 'multiple') {
            handleFilesSelected(selectedFiles);
        } else {
            handleFilesSelected([selectedFiles[0]]);
        }
    };

    const handleUseTool = (toolId, allowMultiple = false) => {
        setActiveTool(toolId);
        triggerFileDialog(allowMultiple ? 'multiple' : 'single');
    };

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
                const indices = splitIndices.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
                resultBlob = await splitPDF(files[0], indices);
            } else if (activeTool === 'clone') {
                resultBlob = await clonePDF(files[0]);
            }

            if (resultBlob) {
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

    const handleOrganizeSave = async (pagesConfig) => {
        setLoading(true);
        try {
            const resultBlob = await organizePDF(files[0], pagesConfig);
            const url = URL.createObjectURL(resultBlob);
            setProcessedFile(url);
        } catch (error) {
            console.error('Error organizing PDF:', error);
            alert('Error organizing PDF.');
        } finally {
            setLoading(false);
        }
    };

    const handleWatermarkSave = async (text, options) => {
        setLoading(true);
        try {
            const resultBlob = await addWatermark(files[0], text, options);
            const url = URL.createObjectURL(resultBlob);
            setProcessedFile(url);
        } catch (error) {
            console.error('Error adding watermark:', error);
            alert('Error adding watermark.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditorSave = async (operations) => {
        setLoading(true);
        try {
            const resultBlob = await editPDF(files[0], operations);
            const url = URL.createObjectURL(resultBlob);
            setProcessedFile(url);
        } catch (error) {
            console.error('Error editing PDF:', error);
            alert('Error editing PDF.');
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

    const getToolTitle = () => {
        switch (activeTool) {
            case 'merge': return 'Merge PDFs';
            case 'split': return 'Split PDF';
            case 'clone': return 'Clone PDF';
            case 'view': return 'View PDF';
            case 'organize': return 'Organize Pages';
            case 'watermark': return 'Add Watermark';
            case 'edit': return 'Edit Content';
            default: return 'PDF Tool';
        }
    };

    const showViewer = (activeTool === 'view' && files.length > 0) || processedFile;
    const showOrganizer = activeTool === 'organize' && files.length > 0 && !processedFile;
    const showWatermark = activeTool === 'watermark' && files.length > 0 && !processedFile;
    const showEditor = activeTool === 'edit' && files.length > 0 && !processedFile;
    const showHome = !showViewer && files.length === 0;

    const recommendedTools = [
        {
            id: 'view',
            title: 'Leer y comentar',
            description: 'Abre y revisa tus PDFs en segundos.',
            icon: FileText,
            accent: 'text-primary',
            accentBg: 'bg-primary/10'
        },
        {
            id: 'edit',
            title: 'Editar PDF',
            description: 'Actualiza texto o inserta nuevas imágenes.',
            icon: PenLine,
            accent: 'text-amber-600',
            accentBg: 'bg-amber-100'
        },
        {
            id: 'organize',
            title: 'Organizar páginas',
            description: 'Reordena, rota o elimina páginas rápidamente.',
            icon: LayersIcon,
            accent: 'text-teal-600',
            accentBg: 'bg-teal-100'
        },
        {
            id: 'split',
            title: 'Dividir PDF',
            description: 'Extrae solo las páginas que necesitas.',
            icon: Split,
            accent: 'text-rose-600',
            accentBg: 'bg-rose-100'
        },
        {
            id: 'merge',
            title: 'Combinar archivos',
            description: 'Une varios documentos en un solo PDF.',
            icon: Wand2,
            accent: 'text-indigo-600',
            accentBg: 'bg-indigo-100',
            allowMultiple: true
        },
        {
            id: 'watermark',
            title: 'Agregar marca de agua',
            description: 'Protege tu contenido con un sello personalizado.',
            icon: Stamp,
            accent: 'text-blue-600',
            accentBg: 'bg-blue-100'
        },
    ];

    const quickNav = [
        { label: 'Recientes', icon: Clock },
        { label: 'Marcados', icon: Star, badge: 'Nuevo' },
        { label: 'Subidos por mí', icon: UploadCloud },
        { label: 'Compartidos', icon: Users },
    ];

    const storageNav = [
        { label: 'Mi biblioteca', icon: FolderOpen },
        { label: 'Mi nube', icon: Cloud },
        { label: 'Equipo', icon: Users },
    ];

    const signInBenefits = [
        { title: 'Autorrellena formularios y firma más rápido.', icon: ShieldCheck },
        { title: 'Almacena y accede a tus archivos en cualquier dispositivo.', icon: Cloud },
        { title: 'Comparte PDFs con otros usuarios en segundos.', icon: Users },
    ];

    const recentFiles = [
        { name: 'Bienvenida.pdf', shared: 'Solo usted', updated: 'Ahora mismo', size: '—' },
        { name: 'Propuesta_cliente.pdf', shared: 'Solo usted', updated: 'Ayer', size: '2.3 MB' },
        { name: 'Contrato_firmado.pdf', shared: 'Compartido', updated: 'Hace 3 días', size: '1.8 MB' },
    ];

    const renderHomeScreen = () => (
        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-dark-bg">
            <div className="px-6 pt-8 pb-4">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Inicio</p>
                        <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">Te damos la bienvenida a PDFreedom</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Organiza, edita o comparte tus PDFs desde un solo lugar.</p>
                    </div>
                    <button className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 border border-light-border dark:border-dark-border rounded-lg hover:bg-light-bg dark:hover:bg-dark-bg transition-colors">
                        Ver todas las herramientas
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="px-6 space-y-6 pb-10">
                <div className="grid grid-cols-1 xl:grid-cols-[240px_1fr_320px] gap-6 items-start">
                    <div className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-2xl p-4 shadow-sm space-y-4">
                        <div className="space-y-1">
                            {quickNav.map((item) => (
                                <button
                                    key={item.label}
                                    type="button"
                                    className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-left text-light-text dark:text-dark-text hover:bg-light-bg dark:hover:bg-dark-bg transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm">{item.label}</span>
                                    </div>
                                    {item.badge && (
                                        <span className="text-[10px] uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">{item.badge}</span>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-light-border dark:border-dark-border">
                            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">Almacenamiento</p>
                            <div className="space-y-1">
                                {storageNav.map((item) => (
                                    <button
                                        key={item.label}
                                        type="button"
                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-light-text dark:text-dark-text hover:bg-light-bg dark:hover:bg-dark-bg transition-colors"
                                    >
                                        <item.icon className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-light-surface dark:bg-dark-surface rounded-2xl shadow-sm border border-light-border dark:border-dark-border p-4 sm:p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">Herramientas recomendadas para ti</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Atajos rápidos para lo que más usas</p>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                {recommendedTools.map((tool) => (
                                    <button
                                        key={tool.id}
                                        type="button"
                                        onClick={() => handleUseTool(tool.id, tool.allowMultiple)}
                                        className="group w-full text-left bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl p-4 hover:-translate-y-0.5 hover:border-primary/60 transition-all duration-200"
                                    >
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tool.accentBg} ${tool.accent} mb-3`}>
                                            <tool.icon className="w-5 h-5" />
                                        </div>
                                        <p className="font-semibold text-light-text dark:text-dark-text">{tool.title}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{tool.description}</p>
                                        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                                            Utilizar ahora <ArrowRight className="w-4 h-4" />
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-light-surface dark:bg-dark-surface rounded-2xl shadow-sm border border-light-border dark:border-dark-border p-4 sm:p-5">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                    <UploadCloud className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">Trabaja con tus PDFs de inmediato</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Arrastra un archivo o usa los botones para empezar.</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => handleUseTool('view')}
                                    className="bg-primary hover:bg-primary-hover text-white font-semibold px-4 py-2.5 rounded-lg transition-colors"
                                >
                                    Abrir archivo
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleUseTool('merge', true)}
                                    className="border border-light-border dark:border-dark-border text-primary hover:bg-light-bg dark:hover:bg-dark-bg px-4 py-2.5 rounded-lg font-semibold transition-colors"
                                >
                                    Combinar varios
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleUseTool('organize')}
                                    className="border border-light-border dark:border-dark-border text-light-text dark:text-dark-text hover:bg-light-bg dark:hover:bg-dark-bg px-4 py-2.5 rounded-lg font-semibold transition-colors"
                                >
                                    Organizar páginas
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">Consejo: también puedes soltar aquí tus PDFs para cargarlos.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-light-surface dark:bg-dark-surface rounded-2xl shadow-sm border border-light-border dark:border-dark-border p-4 sm:p-5">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-light-bg dark:bg-dark-bg">
                                    <FolderOpen className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Trabajar con un PDF ahora</p>
                                    <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">Abrir archivo</h3>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">Selecciona un PDF o arrástralo para abrirlo.</p>
                            <button
                                type="button"
                                onClick={() => handleUseTool('view')}
                                className="mt-4 w-full py-3 rounded-lg bg-primary text-white hover:bg-primary-hover font-semibold transition-colors shadow-sm"
                            >
                                Abrir archivo
                            </button>
                        </div>

                        <div className="bg-light-surface dark:bg-dark-surface rounded-2xl shadow-sm border border-light-border dark:border-dark-border p-4 sm:p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                    <LogIn className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">Consigue más al iniciar sesión</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Sincroniza tus archivos y firmas.</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {signInBenefits.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                                        <item.icon className="w-4 h-4 mt-0.5 text-primary" />
                                        <span>{item.title}</span>
                                    </div>
                                ))}
                            </div>

                            <button className="mt-4 w-full border border-light-border dark:border-dark-border rounded-lg py-2.5 font-medium text-light-text dark:text-dark-text hover:bg-light-bg dark:hover:bg-dark-bg transition-colors">
                                Iniciar sesión
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-light-surface dark:bg-dark-surface rounded-2xl shadow-sm border border-light-border dark:border-dark-border p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">Recientes</h3>
                        </div>
                        <button className="text-sm text-primary flex items-center gap-1 hover:text-primary-hover transition-colors">
                            Ver todo <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="overflow-x-auto -mx-2 sm:mx-0">
                        <table className="min-w-full text-sm">
                            <thead className="text-gray-500 dark:text-gray-400">
                                <tr>
                                    <th className="py-2 px-2 text-left font-semibold">Nombre</th>
                                    <th className="py-2 px-2 text-left font-semibold">Compartiendo</th>
                                    <th className="py-2 px-2 text-left font-semibold">Apertura</th>
                                    <th className="py-2 px-2 text-left font-semibold">Tamaño</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentFiles.map((doc, index) => (
                                    <tr key={doc.name + index} className="border-t border-light-border dark:border-dark-border hover:bg-light-bg dark:hover:bg-dark-bg/60 transition-colors">
                                        <td className="py-3 px-2">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                                                    <FileText className="w-4 h-4 text-red-600 dark:text-red-400" />
                                                </div>
                                                <span className="font-medium text-light-text dark:text-dark-text">{doc.name}</span>
                                            </div>
                                        </td>
                                        <td className="text-gray-600 dark:text-gray-300 px-2">{doc.shared}</td>
                                        <td className="text-gray-600 dark:text-gray-300 px-2">{doc.updated}</td>
                                        <td className="text-gray-600 dark:text-gray-300 px-2">{doc.size}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );

    if (showOrganizer) {
        return (
            <PageOrganizer
                file={files[0]}
                onSave={handleOrganizeSave}
                onCancel={() => setFiles([])}
            />
        );
    }

    if (showWatermark) {
        return (
            <WatermarkTool
                onSave={handleWatermarkSave}
                onCancel={() => setFiles([])}
            />
        );
    }

    if (showEditor) {
        return (
            <Editor
                file={files[0]}
                onSave={handleEditorSave}
                onCancel={() => setFiles([])}
            />
        );
    }

    return (
        <div className="h-full w-full flex flex-col">
            <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleQuickFileChange}
            />

            {showHome && renderHomeScreen()}

            {!showViewer && files.length > 0 && (
                <div className="flex-1 flex justify-center overflow-auto">
                    <div className="w-full max-w-4xl animate-in fade-in duration-500">
                        <div className="bg-light-surface dark:bg-dark-surface p-8 rounded-2xl shadow-sm border border-light-border dark:border-dark-border">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-1">
                                        {getToolTitle()}
                                    </h2>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        {activeTool === 'merge' ? 'Combine multiple files into one document' : 'Process your PDF documents efficiently'}
                                    </p>
                                </div>
                            </div>

                            {activeTool === 'merge' && (
                                <div className="mb-6">
                                    <FileUploader
                                        onFilesSelected={handleFilesSelected}
                                        multiple={true}
                                    />
                                </div>
                            )}

                            {files.length > 0 && (
                                <div className="space-y-3 mb-6">
                                    {files.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between bg-light-bg dark:bg-dark-bg p-4 rounded-xl border border-light-border dark:border-dark-border group">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                                    <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-light-text dark:text-dark-text text-sm">{file.name}</p>
                                                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                </div>
                                            </div>
                                            <button onClick={() => removeFile(index)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTool === 'split' && files.length > 0 && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                                        Page Indices to Keep (0-based)
                                    </label>
                                    <input
                                        type="text"
                                        value={splitIndices}
                                        onChange={(e) => setSplitIndices(e.target.value)}
                                        placeholder="e.g. 0, 2, 5"
                                        className="w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl p-3 text-light-text dark:text-dark-text focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">Enter page numbers separated by commas</p>
                                </div>
                            )}

                            {files.length > 0 && activeTool !== 'view' && activeTool !== 'organize' && activeTool !== 'watermark' && activeTool !== 'edit' && (
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleProcess}
                                        disabled={loading}
                                        className="bg-primary hover:bg-primary-hover text-white font-medium py-3 px-8 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                                    >
                                        {loading ? 'Processing...' : (
                                            <>
                                                Process PDF
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Preview / Result Section - Full Screen */}
            {showViewer ? (
                <div className="flex-1 flex flex-col min-h-0 bg-gray-200 dark:bg-[#1a1a1a] relative animate-in zoom-in-95 duration-300">
                    {processedFile && (
                        <div className="absolute top-4 right-4 z-10 flex gap-2">
                            <button
                                onClick={downloadFile}
                                className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-primary/20 transition-all font-medium text-sm"
                            >
                                <Download className="w-4 h-4" /> Download
                            </button>
                            <button
                                onClick={() => {
                                    setProcessedFile(null);
                                    if (activeTool === 'view' || activeTool === 'organize') setFiles([]);
                                }}
                                className="bg-white dark:bg-dark-surface text-light-text dark:text-dark-text border border-light-border dark:border-dark-border hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2 rounded-lg shadow-lg transition-all font-medium text-sm"
                            >
                                Close
                            </button>
                        </div>
                    )}
                    {/* Full screen viewer container without padding */}
                    <div className="flex-1 overflow-hidden">
                        <div className="h-full w-full bg-white dark:bg-dark-surface overflow-hidden">
                            <PDFViewer file={processedFile || files[0]} />
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default Dashboard;
