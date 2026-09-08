import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const AppLayout: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-edge px-4 h-14 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg overflow-hidden bg-white shadow-sm border border-slate-100 flex items-center justify-center flex-shrink-0">
            <img src="/logo.png" alt="PreMind AI Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-sm font-bold tracking-tight text-ink">
            PreMind <span className="text-[10px] text-brand-600 font-semibold bg-brand-50 px-1 rounded">AI</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-10">
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
};
