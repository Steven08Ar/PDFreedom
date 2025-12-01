import React from 'react';
import { Layers, Scissors, Copy, FileText, ChevronLeft, Stamp } from 'lucide-react';

const Sidebar = ({ activeTool, setActiveTool, isOpen, toggleSidebar }) => {
    const tools = [
        { id: 'view', name: 'View PDF', icon: FileText, desc: 'Read' },
        { id: 'edit', name: 'Edit Content', icon: Scissors, desc: 'Modify' },
        { id: 'organize', name: 'Organize', icon: Layers, desc: 'Reorder' },
        { id: 'watermark', name: 'Watermark', icon: Stamp, desc: 'Stamp' },
        { id: 'merge', name: 'Merge', icon: Layers, desc: 'Combine' },
        { id: 'split', name: 'Split', icon: Scissors, desc: 'Extract' },
        { id: 'clone', name: 'Clone', icon: Copy, desc: 'Duplicate' },
    ];

    return (
        <aside
            className={`
        absolute inset-y-0 left-0 z-40 w-64 bg-light-surface dark:bg-dark-surface border-r border-light-border dark:border-dark-border transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}
        >
            <div className="h-full flex flex-col">
                <div className="p-4 border-b border-light-border dark:border-dark-border flex items-center justify-between lg:hidden">
                    <h3 className="font-semibold text-light-text dark:text-dark-text">Tools</h3>
                    <button onClick={toggleSidebar}>
                        <ChevronLeft className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-1">
                    {tools.map((tool) => (
                        <button
                            key={tool.id}
                            onClick={() => {
                                setActiveTool(tool.id);
                                if (window.innerWidth < 1024) toggleSidebar();
                            }}
                            className={`
                w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group
                ${activeTool === tool.id
                                    ? 'bg-primary/10 text-primary border-l-4 border-primary'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border-l-4 border-transparent'}
              `}
                        >
                            <tool.icon className={`w-5 h-5 ${activeTool === tool.id ? 'text-primary' : 'text-gray-500'}`} />

                            <div className="text-left">
                                <span className="block font-medium text-sm">
                                    {tool.name}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
