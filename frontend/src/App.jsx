import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';

function App() {
    const [activeTool, setActiveTool] = useState('view');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [currentFileName, setCurrentFileName] = useState(null);
    const [hasFile, setHasFile] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <ThemeProvider>
            <div className="flex flex-col h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-300 overflow-hidden">
                <Header
                    toggleSidebar={toggleSidebar}
                    fileName={currentFileName}
                />

                <div className="flex-1 flex overflow-hidden relative">
                    {hasFile && (
                        <Sidebar
                            activeTool={activeTool}
                            setActiveTool={setActiveTool}
                            isOpen={isSidebarOpen}
                            toggleSidebar={toggleSidebar}
                        />
                    )}

                    <main className="flex-1 overflow-hidden relative flex flex-col bg-gray-100 dark:bg-[#0c0c0c]">
                        <div className="flex-1 overflow-hidden relative">
                            <Dashboard
                                activeTool={activeTool}
                                setActiveTool={setActiveTool}
                                onFileNameChange={setCurrentFileName}
                                onFileLoaded={setHasFile}
                            />
                        </div>
                    </main>

                    {isSidebarOpen && hasFile && (
                        <div
                            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                            onClick={toggleSidebar}
                        />
                    )}
                </div>
            </div>
        </ThemeProvider>
    );
}

export default App;
