import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UploadCloud,
  FileText,
  BookOpen,
  Sparkles,
  LogOut,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      to: '/documents',
      label: 'My Documents',
      icon: <FileText className="w-4 h-4" />,
      badge: 'Live API',
    },
    {
      to: '/upload',
      label: 'Upload Material',
      icon: <UploadCloud className="w-4 h-4" />,
      badge: 'New',
    },
    {
      to: '/workspace/mat_dbms_01/flashcards',
      label: 'Study Flashcards',
      icon: <BookOpen className="w-4 h-4" />,
      badge: 'Ready',
    },
    {
      to: '/workspace/mat_dbms_01/quiz/setup',
      label: 'Quiz Assessment',
      icon: <Sparkles className="w-4 h-4" />,
      badge: 'Ready',
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-edge bg-white h-screen sticky top-0 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-edge">
        <NavLink to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-600 to-violet-700 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-ink flex items-center gap-1.5">
              PreMind <span className="text-[10px] font-semibold text-brand-600 bg-brand-50 px-1 py-0.5 rounded border border-brand-100">AI</span>
            </span>
          </div>
        </NavLink>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 py-6 px-3 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-6">
          <div>
            <p className="px-3 text-[11px] font-semibold text-ink-muted uppercase tracking-wider mb-2">
              Workspace
            </p>
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 font-semibold'
                        : 'text-ink-secondary hover:bg-gray-50 hover:text-ink'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    {link.icon}
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[10px] bg-brand-100 text-brand-700 font-semibold px-1.5 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        {/* Support note */}
        <div className="mt-auto pt-6 border-t border-edge">
          <div className="p-3 bg-canvas rounded-xl border border-edge/60 mb-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-ink mb-1">
              <HelpCircle className="w-3.5 h-3.5 text-brand-600" />
              <span>Smart Summarizer</span>
            </div>
            <p className="text-[11px] text-ink-muted leading-relaxed">
              Upload notes or textbooks to automatically generate structured cram sheets & quizzes.
            </p>
          </div>

          {/* User profile & Logout */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50/70 border border-edge/60">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-ink truncate">{user?.name || 'Student'}</p>
                <p className="text-[11px] text-ink-muted truncate">{user?.email || 'user@premind.ai'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-ink-muted hover:text-rose-600 p-1.5 rounded-lg hover:bg-white transition-colors"
              title="Log out"
              aria-label="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
