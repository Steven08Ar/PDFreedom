import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import { FileText } from 'lucide-react';

function App() {
    const [activeTool, setActiveTool] = useState('view');

    return (
        <div className="flex h-screen bg-dark text-white overflow-hidden">
            <Sidebar activeTool={activeTool} setActiveTool={setActiveTool} />

            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <header className="h-16 bg-secondary border-b border-gray-700 flex items-center px-8 justify-between shrink-0">
                    <h2 className="text-xl font-semibold capitalize">{activeTool} Mode</h2>
                    <div className="text-sm text-gray-400">v1.0.0</div>
                </header>

                <div className="flex-1 overflow-auto p-6">
                    <Dashboard activeTool={activeTool} />
                </div>
            </main>
        </div>
    );
}

export default App;
