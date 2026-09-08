import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UploadCloud, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const MobileNav: React.FC = () => {
  const { logout } = useAuth();

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-edge py-2 px-6 flex items-center justify-around shadow-elevated"
    >
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-medium transition-colors ${
            isActive ? 'text-brand-600' : 'text-ink-muted hover:text-ink'
          }`
        }
      >
        <LayoutDashboard className="w-5 h-5" />
        <span>Dashboard</span>
      </NavLink>

      <NavLink
        to="/upload"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-medium transition-colors ${
            isActive ? 'text-brand-600' : 'text-ink-muted hover:text-ink'
          }`
        }
      >
        <div className="relative">
          <UploadCloud className="w-5 h-5" />
          <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-brand-600" />
        </div>
        <span>Upload</span>
      </NavLink>

      <button
        type="button"
        onClick={() => logout()}
        className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-medium text-ink-muted hover:text-rose-600 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </nav>
  );
};
