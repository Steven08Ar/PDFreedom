import React from 'react';
import { FileText, Layers, Scissors, Copy, PenTool, Settings } from 'lucide-react';

const Sidebar = ({ activeTool, setActiveTool }) => {
    const tools = [
        { id: 'view', name: 'Viewer', icon: FileText },
        { id: 'merge', name: 'Merge', icon: Layers },
        { id: 'split', name: 'Split', icon: Scissors },
        { id: 'clone', name: 'Clone', icon: Copy },
        // { id: 'edit', name: 'Edit', icon: PenTool },
    ];

    return (
        <div className="w-64 bg-secondary h-screen flex flex-col border-r border-gray-700">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                    <FileText className="w-8 h-8" />
                    PDFreedom
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {tools.map((tool) => (
                    <button
                        key={tool.id}
                        onClick={() => setActiveTool(tool.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTool === tool.id
                                ? 'bg-primary text-white'
                                : 'text-gray-400 hover:bg-dark-light hover:text-white'
                            }`}
                    >
                        <tool.icon className="w-5 h-5" />
                        <span className="font-medium">{tool.name}</span>
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-700">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors">
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
