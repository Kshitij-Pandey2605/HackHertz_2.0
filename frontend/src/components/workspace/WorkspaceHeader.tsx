import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Material } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface WorkspaceHeaderProps {
  material: Material;
  activeModuleTitle?: string;
  nextModuleUrl?: string;
  nextModuleLabel?: string;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  material,
  activeModuleTitle,
  nextModuleUrl,
  nextModuleLabel = 'Continue Learning',
}) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-edge px-4 sm:px-6 lg:px-8 h-16 flex items-center mb-6 shadow-subtle sticky top-0 z-20">
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between gap-3">
        {/* Left: Breadcrumb, Document Title & Badges */}
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-ink-muted overflow-hidden">
            <Link
              to="/dashboard"
              className="hover:text-brand-600 font-medium transition-colors flex items-center gap-1 flex-shrink-0"
            >
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-ink-subtle flex-shrink-0" />
            <span className="font-medium text-ink truncate max-w-[140px] sm:max-w-[200px]">
              {material.title}
            </span>
            {activeModuleTitle && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-ink-subtle flex-shrink-0" />
                <span className="font-semibold text-brand-600 truncate">{activeModuleTitle}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-sm sm:text-base font-bold text-ink truncate max-w-sm sm:max-w-md">
              {material.title}
            </h1>
            <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider bg-gray-100 px-1.5 py-0.5 rounded border border-edge">
              {material.fileType}
            </span>
            <Badge variant="brand" size="sm">
              {material.difficulty}
            </Badge>
            <span className="text-[11px] text-ink-muted hidden md:inline">
              &bull; {material.pages} pages &bull; {material.subject}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-ink-muted hover:text-ink transition-colors px-2.5 py-1.5 rounded-lg hover:bg-gray-100"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          {nextModuleUrl && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(nextModuleUrl)}
              className="gap-1.5 shadow-sm text-xs py-1.5 px-3"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{nextModuleLabel}</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
