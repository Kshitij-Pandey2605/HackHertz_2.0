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
import { Modal } from '../ui/Modal';

export const WorkspaceSidebar: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showPhase3Modal, setShowPhase3Modal] = useState(false);
  const [phase3Feature, setPhase3Feature] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePhase3Click = (featureName: string) => {
    setPhase3Feature(featureName);
    setShowPhase3Modal(true);
  };

  const workspaceNav = [
    {
      to: `/workspace/${id}`,
      label: 'Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
      end: true,
    },
    {
      to: `/workspace/${id}/quick-glance`,
      label: 'Quick Glance',
      icon: <Eye className="w-4 h-4" />,
      badge: '1 min',
    },
    {
      to: `/workspace/${id}/deep-summary`,
      label: 'Deep Summary',
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      to: `/workspace/${id}/exam-cram`,
      label: 'Exam Cram',
      icon: <Zap className="w-4 h-4" />,
      badge: 'Fast',
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
      badge: 'Active',
    },
  ];

  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 border-r border-edge bg-white h-screen sticky top-0 select-none flex-shrink-0">
        {/* Workspace Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-edge">
          <NavLink to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-600 to-violet-700 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
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
            {/* UNDERSTAND Section */}
            <div>
              <p className="px-3 text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-2">
                Workspace &bull; Understand
              </p>
              <nav className="space-y-1">
                {workspaceNav.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
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
                    {link.badge && (
                      <span className="text-[10px] bg-brand-100 text-brand-700 font-semibold px-1.5 py-0.5 rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* REMEMBER Section */}
            <div>
              <p className="px-3 text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-2">
                Remember
              </p>
              <nav className="space-y-1">
                {rememberNav.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
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
                    {link.badge && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* PRACTICE & EXPORT (Phase 3 Contextual Navigation) */}
            <div>
              <p className="px-3 text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-2">
                Practice & Export
              </p>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => handlePhase3Click('Self-Assessment Quiz')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm text-ink-secondary hover:bg-gray-50 text-left transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-purple-600" />
                    <span>Quiz Assessment</span>
                  </div>
                  <span className="text-[9px] bg-purple-50 text-purple-700 font-semibold px-1.5 py-0.5 rounded border border-purple-200">
                    Phase 3
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePhase3Click('Study Material Export')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm text-ink-secondary hover:bg-gray-50 text-left transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <Download className="w-4 h-4 text-amber-600" />
                    <span>Export Materials</span>
                  </div>
                  <span className="text-[9px] bg-amber-50 text-amber-700 font-semibold px-1.5 py-0.5 rounded border border-amber-200">
                    Phase 3
                  </span>
                </button>
              </div>
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

      {/* Phase 3 Informational Modal */}
      <Modal
        isOpen={showPhase3Modal}
        onClose={() => setShowPhase3Modal(false)}
        title={`${phase3Feature} — Coming in Phase 3`}
        footer={
          <button
            type="button"
            onClick={() => setShowPhase3Modal(false)}
            className="w-full sm:w-auto px-4 py-2 bg-brand-600 text-white text-xs font-semibold rounded-xl hover:bg-brand-700 transition-colors"
          >
            Got it, continue Phase 2
          </button>
        }
      >
        <div className="space-y-3 py-2">
          <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-purple-900">Phase 3 Navigation Preview</p>
              <p className="text-xs text-purple-800 mt-1">
                You are currently exploring <strong>Phase 2 (Understand & Remember)</strong>. Interactive Quiz assessments and export features will be unlocked in Phase 3.
              </p>
            </div>
          </div>
          <p className="text-xs text-ink-muted leading-relaxed">
            Please use the <strong>Quick Glance, Deep Summary, Exam Cram, Formulas, Glossary, and Flashcards</strong> modules to master this study material!
          </p>
        </div>
      </Modal>
    </>
  );
};
