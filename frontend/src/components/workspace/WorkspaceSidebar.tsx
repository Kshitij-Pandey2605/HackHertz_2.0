import React, { useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  LayoutDashboard,
  Eye,
  BookOpen,
  Zap,
  ListTree,
  Key,
  Sigma,
  BookMarked,
  Layers,
  HelpCircle,
  Download,
  LogOut,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
export const WorkspaceSidebar: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const understandNav = [
    {
      to: `/workspace/${id}`,
      label: 'Study Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
      end: true,
    },
    {
      to: `/workspace/${id}/summary`,
      label: 'Study Summary',
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      to: `/workspace/${id}/quick-glance`,
      label: 'Quick Glance',
      icon: <Eye className="w-4 h-4" />,
    },
    {
      to: `/workspace/${id}/deep-summary`,
      label: 'Deep Summary',
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      to: `/workspace/${id}/chapters`,
      label: 'Chapters',
      icon: <ListTree className="w-4 h-4" />,
    },
  ];

  const rememberNav = [
    {
      to: `/workspace/${id}/key-points`,
      label: 'Key Points',
      icon: <Key className="w-4 h-4" />,
    },
    {
      to: `/workspace/${id}/formulas`,
      label: 'Formulas & Rules',
      icon: <Sigma className="w-4 h-4" />,
    },
    {
      to: `/workspace/${id}/glossary`,
      label: 'Glossary',
      icon: <BookMarked className="w-4 h-4" />,
    },
    {
      to: `/workspace/${id}/flashcards`,
      label: 'Flashcards',
      icon: <Layers className="w-4 h-4" />,
    },
  ];

  const practiceNav = [
    {
      to: `/workspace/${id}/quiz/setup`,
      label: 'Quiz Assessment',
      icon: <HelpCircle className="w-4 h-4" />,
    },
  ];

  const reviseNav = [
    {
      to: `/workspace/${id}/exam-cram`,
      label: 'Exam Cram',
      icon: <Zap className="w-4 h-4" />,
    },
    {
      to: `/workspace/${id}/export`,
      label: 'Export Cheat Sheet',
      icon: <Download className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-edge bg-white h-screen sticky top-0 select-none flex-shrink-0">
        {/* Workspace Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-edge">
          <NavLink to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl overflow-hidden bg-white shadow-sm border border-slate-100 flex items-center justify-center flex-shrink-0">
              <img src="/logo.png" alt="PreMind AI Logo" className="w-full h-full object-contain p-0.5" />
            </div>
            <span className="text-base font-bold tracking-tight text-ink">
              PreMind <span className="text-[10px] text-brand-600 font-semibold bg-brand-50 px-1 py-0.5 rounded border border-brand-100">AI</span>
            </span>
          </NavLink>

          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-gray-100 transition-colors"
            title="Return to main dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Workspace Side Navigation */}
        <div className="flex-1 py-4 px-3 flex flex-col justify-between overflow-y-auto space-y-6">
          <div className="space-y-5">
            {/* 1. UNDERSTAND */}
            <div>
              <p className="px-3 text-[10px] font-bold text-ink-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                1. Understand
              </p>
              <nav className="space-y-0.5">
                {understandNav.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-brand-50 text-brand-700 font-semibold border border-brand-200/60'
                          : 'text-ink-secondary hover:bg-gray-50 hover:text-ink'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      {link.icon}
                      <span>{link.label}</span>
                    </div>
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* 2. REMEMBER */}
            <div>
              <p className="px-3 text-[10px] font-bold text-ink-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                2. Remember
              </p>
              <nav className="space-y-0.5">
                {rememberNav.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-brand-50 text-brand-700 font-semibold border border-brand-200/60'
                          : 'text-ink-secondary hover:bg-gray-50 hover:text-ink'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      {link.icon}
                      <span>{link.label}</span>
                    </div>
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* 3. PRACTICE */}
            <div>
              <p className="px-3 text-[10px] font-bold text-ink-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                3. Practice
              </p>
              <nav className="space-y-0.5">
                {practiceNav.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-brand-50 text-brand-700 font-semibold border border-brand-200/60'
                          : 'text-ink-secondary hover:bg-gray-50 hover:text-ink'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      {link.icon}
                      <span>{link.label}</span>
                    </div>
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* 4. REVISE */}
            <div>
              <p className="px-3 text-[10px] font-bold text-ink-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                4. Revise
              </p>
              <nav className="space-y-0.5">
                {reviseNav.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-brand-50 text-brand-700 font-semibold border border-brand-200/60'
                          : 'text-ink-secondary hover:bg-gray-50 hover:text-ink'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      {link.icon}
                      <span>{link.label}</span>
                    </div>
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>

          {/* User profile & Logout */}
          <div className="pt-4 border-t border-edge space-y-3">
            <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-edge">
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
                type="button"
                onClick={handleLogout}
                className="text-ink-muted hover:text-rose-600 p-1.5 rounded-lg hover:bg-white transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
    </aside>
  );
};
