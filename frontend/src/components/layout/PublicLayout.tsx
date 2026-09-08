import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col justify-between">
      {/* Brand header */}
      <header className="w-full py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-600 to-violet-700 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-base font-bold tracking-tight text-ink">
            PreMind <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded border border-brand-200">AI</span>
          </span>
        </Link>
      </header>

      {/* Main card view */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-ink-muted">
        <p>&copy; {new Date().getFullYear()} PreMind AI. Smart Study Material Summarizer.</p>
      </footer>
    </div>
  );
};
