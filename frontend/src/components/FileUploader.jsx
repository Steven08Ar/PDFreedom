import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File } from 'lucide-react';

const FileUploader = ({ onFilesSelected, multiple = false }) => {
    const onDrop = useCallback((acceptedFiles) => {
        onFilesSelected(acceptedFiles);
    }, [onFilesSelected]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
        },
        multiple,
    });

    return (
        <div
            {...getRootProps()}
            className={`
        relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300
        flex flex-col items-center justify-center p-12 cursor-pointer group
        ${isDragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-light-border dark:border-dark-border hover:border-primary hover:bg-light-bg dark:hover:bg-dark-surface'}
      `}
        >
            <input {...getInputProps()} />

            <div className={`
        p-4 rounded-full mb-4 transition-transform duration-300 group-hover:scale-110
        ${isDragActive ? 'bg-primary text-white' : 'bg-light-bg dark:bg-dark-bg text-primary'}
      `}>
                <UploadCloud className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-2">
                {isDragActive ? 'Drop PDF here' : 'Select PDF file'}
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">
                {multiple ? 'Drag & drop multiple files' : 'Drag & drop a file'} or click to browse your computer
            </p>
        </div>
    );
};

export default FileUploader;
