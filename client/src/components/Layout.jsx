import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { MessageSquare, Settings, Sparkles, Box } from 'lucide-react';

const Layout = () => {
    const location = useLocation();

    const NavItem = ({ to, icon: Icon, label }) => {
        const isActive = location.pathname === to;
        return (
            <Link
                to={to}
                className={`relative group flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${isActive
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30 scale-110'
                    : 'text-slate-500 hover:bg-slate-800 hover:text-orange-500 hover:scale-105'
                    }`}
            >
                <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />

                {/* Tooltip */}
                <span className="absolute left-16 px-3 py-1.5 bg-orange-600 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50 shadow-xl">
                    {label}
                    <span className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-orange-600"></span>
                </span>
            </Link>
        );
    };

    return (
        <div className="flex h-screen bg-[#020617] overflow-hidden font-sans">
            {/* Sidebar */}
            <div className="w-24 flex-shrink-0 flex flex-col items-center py-8 z-20 bg-[#0f172a] m-4 rounded-[2.5rem] shadow-2xl shadow-black/50 border border-slate-800">
                {/* Logo */}
                <div className="mb-10">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 animate-pulse-slow">
                        <Sparkles className="w-7 h-7 text-white" />
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 flex flex-col gap-6 w-full items-center">
                    <NavItem to="/" icon={MessageSquare} label="Chat" />
                    <NavItem to="/admin" icon={Box} label="Knowledge" />
                </nav>

                {/* Bottom Actions */}
                <div className="mt-auto">
                    {/* Placeholder for user profile or settings */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 border-2 border-slate-700 shadow-lg cursor-pointer hover:border-orange-500 transition-colors"></div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative my-4 mr-4 bg-[#0f172a]/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-800 shadow-2xl shadow-black/50 overflow-hidden flex flex-col">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
