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
    <div className="bg-white border-b border-edge -mx-4 sm:-mx-6 lg:-mx-8 -mt-6 sm:-mt-8 px-4 sm:px-6 lg:px-8 py-5 mb-6 shadow-subtle sticky top-0 lg:top-0 z-20">
      <div className="max-w-6xl mx-auto space-y-3">
        {/* Top Breadcrumb & Quick back button */}
        <div className="flex items-center justify-between gap-2 text-xs text-ink-muted">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <Link
              to="/dashboard"
              className="hover:text-brand-600 font-medium transition-colors flex items-center gap-1"
            >
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-ink-subtle flex-shrink-0" />
            <span className="font-semibold text-ink truncate max-w-[200px] sm:max-w-md">
              {material.title}
            </span>
            {activeModuleTitle && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-ink-subtle flex-shrink-0" />
                <span className="font-medium text-brand-600">{activeModuleTitle}</span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-ink-muted hover:text-ink transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </button>
        </div>

        {/* Title, Subtitle, Metadata & CTAs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded border border-edge">
                {material.fileType}
              </span>
              <Badge variant="brand" size="sm">
                {material.difficulty} Level
              </Badge>
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Processed recently
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
              {material.title}
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted">
              {material.pages} pages &bull; {material.subject} &bull; Uploaded{' '}
              {new Date(material.uploadDate).toLocaleDateString()}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            {nextModuleUrl && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(nextModuleUrl)}
                className="gap-2 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{nextModuleLabel}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
