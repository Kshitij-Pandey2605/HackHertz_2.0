import React, { useEffect, useState } from 'react';
import { Outlet, useParams, useNavigate, useLocation, NavLink } from 'react-router-dom';
import { api } from '../../services/api';
import { Material } from '../../types';
import { WorkspaceHeader } from './WorkspaceHeader';
import { WorkspaceSidebar } from './WorkspaceSidebar';
import { StudyProgressBanner } from './StudyProgressBanner';
import { LoadingState } from '../ui/LoadingState';
import { ErrorState } from '../ui/ErrorState';
import { Sparkles, Eye, BookOpen, Zap, Layers, ListTree, Key, Sigma, BookMarked } from 'lucide-react';

export const WorkspaceLayout: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [material, setMaterial] = useState<Material | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMaterial = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const res = await api.materials.getById(id);
        setMaterial(res.data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Material not found');
      } finally {
        setIsLoading(false);
      }
    };

    loadMaterial();
  }, [id]);

  if (isLoading) {
    return (
      <LoadingState
        fullPage
        title="Opening PreMind AI Workspace..."
        description="Extracting functional dependencies, key terms, formulas, and flashcards"
      />
    );
  }

  if (error || !material) {
    return (
      <ErrorState
        fullPage
        title="Workspace Not Found"
        message={error || 'Could not find requested study material.'}
        retryLabel="Back to Dashboard"
        onRetry={() => navigate('/dashboard')}
      />
    );
  }

  // Derive next CTA label & URL based on current sub-path
  const path = location.pathname;
  let activeTitle = 'Overview';
  let nextUrl = `/workspace/${id}/quick-glance`;
  let nextLabel = 'Quick Glance →';

  if (path.includes('quick-glance')) {
    activeTitle = 'Quick Glance';
    nextUrl = `/workspace/${id}/deep-summary`;
    nextLabel = 'Read Deep Summary →';
  } else if (path.includes('deep-summary')) {
    activeTitle = 'Deep Summary';
    nextUrl = `/workspace/${id}/exam-cram`;
    nextLabel = 'Review Exam Cram →';
  } else if (path.includes('exam-cram')) {
    activeTitle = 'Exam Cram';
    nextUrl = `/workspace/${id}/flashcards`;
    nextLabel = 'Review Flashcards →';
  } else if (path.includes('chapters')) {
    activeTitle = 'Chapters';
    nextUrl = `/workspace/${id}/key-points`;
    nextLabel = 'Explore Key Points →';
  } else if (path.includes('key-points')) {
    activeTitle = 'Key Points';
    nextUrl = `/workspace/${id}/formulas`;
    nextLabel = 'View Formulas →';
  } else if (path.includes('formulas')) {
    activeTitle = 'Formulas & Rules';
    nextUrl = `/workspace/${id}/glossary`;
    nextLabel = 'Open Glossary →';
  } else if (path.includes('glossary')) {
    activeTitle = 'Glossary';
    nextUrl = `/workspace/${id}/flashcards`;
    nextLabel = 'Practice Flashcards →';
  } else if (path.includes('flashcards')) {
    activeTitle = 'Flashcards';
    nextUrl = `/workspace/${id}/quick-glance`;
    nextLabel = 'Review Quick Glance →';
  }

  const mobileNavItems = [
    { to: `/workspace/${id}/quick-glance`, label: 'Glance', icon: <Eye className="w-4 h-4" /> },
    { to: `/workspace/${id}/deep-summary`, label: 'Deep', icon: <BookOpen className="w-4 h-4" /> },
    { to: `/workspace/${id}/exam-cram`, label: 'Cram', icon: <Zap className="w-4 h-4" /> },
    { to: `/workspace/${id}/flashcards`, label: 'Cards', icon: <Layers className="w-4 h-4" /> },
    { to: `/workspace/${id}/formulas`, label: 'Rules', icon: <Sigma className="w-4 h-4" /> },
    { to: `/workspace/${id}/glossary`, label: 'Terms', icon: <BookMarked className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col lg:flex-row">
      {/* Desktop Workspace Sidebar */}
      <WorkspaceSidebar />

      {/* Main Workspace Scrollable Container */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-10">
        <WorkspaceHeader
          material={material}
          activeModuleTitle={activeTitle}
          nextModuleUrl={nextUrl}
          nextModuleLabel={nextLabel}
        />

        <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <StudyProgressBanner />
          <Outlet context={{ material }} />
        </div>
      </div>

      {/* Mobile Workspace Quick Bottom Bar */}
      <nav
        aria-label="Workspace Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-edge py-2 px-2 flex items-center justify-around shadow-elevated"
      >
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[11px] font-medium transition-colors ${
                isActive ? 'text-brand-600 font-bold bg-brand-50' : 'text-ink-muted hover:text-ink'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
