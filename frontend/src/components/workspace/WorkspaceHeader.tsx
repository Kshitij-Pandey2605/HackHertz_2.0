import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronRight,
  Sparkles,
  FileText,
  BookOpen,
  GraduationCap,
} from 'lucide-react';
import { Material } from '../../types';
import { Button } from '../ui/Button';

interface WorkspaceHeaderProps {
  material: Material;
  activeModuleTitle?: string;
  nextModuleUrl?: string;
  nextModuleLabel?: string;
}

// Convert complex terms to student-friendly names
const formatStudentTitle = (rawTitle: string): string => {
  if (!rawTitle) return 'Study Notes';
  return rawTitle
    .replace(/Database Management Systems/gi, 'DBMS Notes')
    .replace(/Functional Dependencies/gi, 'Normalization Basics')
    .replace(/Operating Systems/gi, 'OS Notes')
    .replace(/Process Synchronization & Deadlocks/gi, 'Process & Deadlocks')
    .replace(/Computer Networks/gi, 'CN Notes');
};

const getBreadcrumbTitle = (rawTitle: string): string => {
  if (!rawTitle) return 'Study Notes';
  const simplified = formatStudentTitle(rawTitle);
  if (simplified.includes('—')) {
    return simplified.split('—')[0].trim();
  }
  if (simplified.includes('-')) {
    return simplified.split('-')[0].trim();
  }
  return simplified.length > 18 ? `${simplified.slice(0, 16)}...` : simplified;
};

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  material,
  activeModuleTitle,
  nextModuleUrl,
  nextModuleLabel = 'Continue Learning',
}) => {
  const navigate = useNavigate();

  const displayTitle = formatStudentTitle(material.title);
  const breadcrumbDocTitle = getBreadcrumbTitle(material.title);

  // Difficulty badge styling
  const diffConfig = {
    EASY: {
      label: 'Beginner Level',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      dotClass: 'bg-emerald-500',
    },
    MEDIUM: {
      label: 'Medium Level',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/80',
      dotClass: 'bg-amber-500',
    },
    HARD: {
      label: 'Advanced Level',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200/80',
      dotClass: 'bg-rose-500',
    },
  }[material.difficulty] || {
    label: 'Standard Level',
    badgeClass: 'bg-slate-50 text-slate-700 border-slate-200',
    dotClass: 'bg-slate-400',
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-edge sticky top-0 z-20 shadow-xs mb-6">
      <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 space-y-3">
        {/* 1. Back Navigation & Responsive Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-ink-muted flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={() => navigate('/documents')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-ink-secondary hover:text-ink bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all flex-shrink-0"
            title="Back to My Study Files"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <span className="text-slate-300 hidden sm:inline">|</span>

          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 min-w-0"
          >
            <Link
              to="/dashboard"
              className="hover:text-brand-600 font-medium text-slate-500 transition-colors flex-shrink-0"
            >
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />

            <Link
              to="/documents"
              className="hover:text-brand-600 font-medium text-slate-500 transition-colors flex-shrink-0"
            >
              My Study Files
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />

            <Link
              to={`/workspace/${material.id}`}
              className="hover:text-brand-600 font-medium text-slate-700 truncate max-w-[120px] sm:max-w-[180px] transition-colors flex-shrink-0"
              title={material.title || displayTitle}
            >
              {breadcrumbDocTitle}
            </Link>

            {activeModuleTitle && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                <span className="font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-100 flex-shrink-0 truncate">
                  {activeModuleTitle}
                </span>
              </>
            )}
          </nav>
        </div>

        {/* 2. Main Title Row & Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
          <div className="min-w-0 flex-1">
            <h1
              className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight text-ink truncate max-w-full sm:max-w-lg md:max-w-xl cursor-default"
              title={`Full Document: ${material.title || displayTitle}`}
            >
              {displayTitle}
            </h1>
          </div>

          {nextModuleUrl && (
            <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-center">
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(nextModuleUrl)}
                className="gap-1.5 shadow-sm text-xs py-2 px-3.5 rounded-xl font-semibold bg-brand-600 hover:bg-brand-700 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{nextModuleLabel}</span>
              </Button>
            </div>
          )}
        </div>

        {/* 3. Sleek Metadata Badge Cluster */}
        <div className="flex items-center gap-2 flex-wrap pt-0.5">
          {/* File type badge */}
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <FileText className="w-3 h-3 text-slate-500" />
            <span>{material.fileType || 'PDF'}</span>
          </span>

          {/* Difficulty badge */}
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${diffConfig.badgeClass}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${diffConfig.dotClass}`} />
            <span>{diffConfig.label}</span>
          </span>

          {/* Pages badge */}
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200/80">
            <BookOpen className="w-3 h-3 text-slate-400" />
            <span>{material.pages} Pages</span>
          </span>

          {/* Subject badge */}
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-50/70 text-brand-700 border border-brand-200/60">
            <GraduationCap className="w-3.5 h-3.5 text-brand-500" />
            <span>{material.subject || 'General'}</span>
          </span>
        </div>
      </div>
    </header>
  );
};

export default WorkspaceHeader;
