import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Menu, FileText, Settings, LogOut, User, Globe } from 'lucide-react';

const Header = ({ toggleSidebar, fileName }) => {
    const { isDarkMode, toggleTheme } = useTheme();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <header className="h-14 bg-light-surface dark:bg-dark-surface border-b border-light-border dark:border-dark-border flex items-center justify-between px-4 sticky top-0 z-50 transition-colors duration-300 relative">
            <div className="flex items-center gap-4 z-10">
                <button
                    onClick={toggleSidebar}
                    className="p-2 hover:bg-light-bg dark:hover:bg-dark-bg rounded-lg transition-colors lg:hidden"
                >
                    <Menu className="w-5 h-5 text-light-text dark:text-dark-text" />
                </button>

                <div className="flex items-center gap-2">
                    <div className="bg-red-600 p-1.5 rounded-lg">
                        <FileText className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg text-light-text dark:text-dark-text tracking-tight hidden sm:block">
                        PDFreedom
                    </span>
                </div>

                <nav className="hidden md:flex items-center gap-1 ml-6">
                    {['Home', 'Tools', 'Documents'].map((item) => (
                        <button
                            key={item}
                            className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-light-text dark:hover:text-dark-text hover:bg-light-bg dark:hover:bg-dark-bg rounded-md transition-colors"
                        >
                            {item}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Centered Filename */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-1/3 truncate pointer-events-none">
                {fileName && (
                    <span className="font-medium text-sm text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">
                        {fileName}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-2 z-10">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-light-bg dark:hover:bg-dark-bg transition-colors"
                    aria-label="Toggle Theme"
                >
                    {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="w-8 h-8 bg-primary hover:bg-primary-hover rounded-full flex items-center justify-center text-white font-medium text-sm transition-colors"
                    >
                        S
                    </button>

                    {isProfileOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setIsProfileOpen(false)}
                            />
                            <div className="absolute right-0 top-full mt-2 w-56 bg-light-surface dark:bg-dark-surface rounded-xl shadow-xl border border-light-border dark:border-dark-border py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                                <div className="px-4 py-3 border-b border-light-border dark:border-dark-border">
                                    <p className="text-sm font-semibold text-light-text dark:text-dark-text">Santiago</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">santiago@example.com</p>
                                </div>

                                <div className="py-1">
                                    <button className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-light-bg dark:hover:bg-dark-bg flex items-center gap-2">
                                        <User className="w-4 h-4" /> Profile
                                    </button>
                                    <button className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-light-bg dark:hover:bg-dark-bg flex items-center gap-2">
                                        <Settings className="w-4 h-4" /> Settings
                                    </button>
                                    <button className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-light-bg dark:hover:bg-dark-bg flex items-center gap-2">
                                        <Globe className="w-4 h-4" /> Language
                                    </button>
                                </div>

                                <div className="border-t border-light-border dark:border-dark-border py-1">
                                    <button className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                                        <LogOut className="w-4 h-4" /> Sign out
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
