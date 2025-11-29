import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';

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
            className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragActive
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-600 hover:border-primary hover:bg-dark-light'
                }`}
        >
            <input {...getInputProps()} />
            <div className="bg-secondary p-4 rounded-full mb-4">
                <UploadCloud className="w-8 h-8 text-primary" />
            </div>
            <p className="text-lg font-medium text-gray-200">
                {isDragActive ? 'Drop PDF here' : 'Click or drag PDF files here'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
                Supports PDF files only
            </p>
        </div>
    );
};

export default FileUploader;
