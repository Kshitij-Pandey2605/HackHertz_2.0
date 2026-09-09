import React, { useEffect, useState } from 'react';
import { Outlet, useParams, useNavigate, useLocation, NavLink } from 'react-router-dom';
import { api } from '../../services/api';
import { Material } from '../../types';
import { WorkspaceHeader } from './WorkspaceHeader';
import { WorkspaceSidebar } from './WorkspaceSidebar';
import { StudyProgressBanner } from './StudyProgressBanner';
import { LoadingState } from '../ui/LoadingState';
import { ErrorState } from '../ui/ErrorState';
import { StudyCopilot } from '../copilot/StudyCopilot';
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
  let nextUrl: string | undefined = `/workspace/${id}/summary`;
  let nextLabel: string | undefined = 'View Summary Notes →';

  if (path.includes('summary')) {
    activeTitle = 'Summary Notes';
    nextUrl = `/workspace/${id}/quick-glance`;
    nextLabel = 'Quick Summary →';
  } else if (path.includes('quick-glance')) {
    activeTitle = 'Quick Summary';
    nextUrl = `/workspace/${id}/deep-summary`;
    nextLabel = 'Read Detailed Notes →';
  } else if (path.includes('deep-summary')) {
    activeTitle = 'Detailed Notes';
    nextUrl = `/workspace/${id}/exam-cram`;
    nextLabel = 'Review Exam Cram Sheet →';
  } else if (path.includes('exam-cram')) {
    activeTitle = 'Exam Cram Sheet';
    nextUrl = `/workspace/${id}/flashcards`;
    nextLabel = 'Practice Flashcards →';
  } else if (path.includes('chapters')) {
    activeTitle = 'Chapters & Topics';
    nextUrl = `/workspace/${id}/key-points`;
    nextLabel = 'View Key Takeaways →';
  } else if (path.includes('key-points')) {
    activeTitle = 'Key Takeaways';
    nextUrl = `/workspace/${id}/formulas`;
    nextLabel = 'View Formulas →';
  } else if (path.includes('formulas')) {
    activeTitle = 'Formulas & Rules';
    nextUrl = `/workspace/${id}/glossary`;
    nextLabel = 'Open Key Terms →';
  } else if (path.includes('glossary')) {
    activeTitle = 'Key Terms';
    nextUrl = `/workspace/${id}/flashcards`;
    nextLabel = 'Practice Flashcards →';
  } else if (path.includes('flashcards')) {
    activeTitle = 'Flashcards';
    nextUrl = `/workspace/${id}/quiz/setup`;
    nextLabel = 'Start Practice Quiz →';
  } else if (path.includes('quiz/setup')) {
    activeTitle = 'Quiz Setup';
    nextUrl = undefined;
    nextLabel = undefined;
  } else if (path.includes('quiz/results')) {
    activeTitle = 'Quiz Results';
    nextUrl = `/workspace/${id}/export`;
    nextLabel = 'Download Study Kit →';
  } else if (path.includes('quiz')) {
    activeTitle = 'Practice Quiz';
    nextUrl = undefined;
    nextLabel = undefined;
  } else if (path.includes('export')) {
    activeTitle = 'Download Study Kit';
    nextUrl = `/workspace/${id}/summary`;
    nextLabel = 'Back to Summary Notes →';
  } else if (path.includes('weak-topics')) {
    activeTitle = 'Topics to Review';
    nextUrl = `/workspace/${id}/mastery`;
    nextLabel = 'Topic Mastery →';
  } else if (path.includes('mastery')) {
    activeTitle = 'Topic Mastery';
    nextUrl = `/workspace/${id}/revision-planner`;
    nextLabel = 'Study Schedule →';
  } else if (path.includes('revision-planner')) {
    activeTitle = 'Study Schedule';
    nextUrl = `/workspace/${id}/adaptive-quiz`;
    nextLabel = 'Start Smart Quiz →';
  } else if (path.includes('adaptive-quiz')) {
    activeTitle = 'Smart Quiz';
    nextUrl = `/workspace/${id}/ai-coach`;
    nextLabel = 'Open Study Coach →';
  } else if (path.includes('ai-coach')) {
    activeTitle = 'Study Coach';
    nextUrl = `/workspace/${id}/summary`;
    nextLabel = 'Back to Summary Notes →';
  }

  const mobileNavItems = [
    { to: `/workspace/${id}/summary`, label: 'Summary', icon: <BookOpen className="w-4 h-4" /> },
    { to: `/workspace/${id}/quick-glance`, label: 'Quick', icon: <Eye className="w-4 h-4" /> },
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

      {/* Contextual AI Study Copilot */}
      <StudyCopilot />

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
