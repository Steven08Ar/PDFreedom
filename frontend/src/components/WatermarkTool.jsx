import React, { useState } from 'react';
import { Save, Type } from 'lucide-react';

const WatermarkTool = ({ onSave, onCancel }) => {
    const [text, setText] = useState('CONFIDENTIAL');
    const [size, setSize] = useState(50);
    const [opacity, setOpacity] = useState(0.3);
    const [rotation, setRotation] = useState(45);

    const handleSave = () => {
        onSave(text, { size, opacity, rotate: rotation });
    };

    return (
        <div className="h-full flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                        <Type className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Add Watermark</h2>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Watermark Text</label>
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. DRAFT"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Size ({size}px)</label>
                        <input
                            type="range"
                            min="10"
                            max="150"
                            value={size}
                            onChange={(e) => setSize(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Opacity ({Math.round(opacity * 100)}%)</label>
                        <input
                            type="range"
                            min="0.1"
                            max="1"
                            step="0.1"
                            value={opacity}
                            onChange={(e) => setOpacity(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rotation ({rotation}°)</label>
                        <input
                            type="range"
                            min="-90"
                            max="90"
                            value={rotation}
                            onChange={(e) => setRotation(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                    </div>
                </div>

                <div className="flex gap-3 mt-8">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <Save className="w-4 h-4" /> Apply
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WatermarkTool;
