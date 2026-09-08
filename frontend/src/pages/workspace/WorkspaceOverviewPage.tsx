import React from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { Material } from '../../types';
import { Button } from '../../components/ui/Button';
import {
  Eye,
  BookOpen,
  Zap,
  ListTree,
  Key,
  Sigma,
  BookMarked,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const WorkspaceOverviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const context = useOutletContext<{ material?: Material }>();
  const material = context?.material;

  if (!material) return null;

  const modules = [
    {
      title: 'Quick Glance',
      subtitle: '1-min core idea overview & key concepts',
      icon: <Eye className="w-5 h-5 text-brand-600" />,
      badge: '1 Min Read',
      to: `/workspace/${id}/quick-glance`,
    },
    {
      title: 'Deep Summary',
      subtitle: 'Structured chapter explanations & proofs',
      icon: <BookOpen className="w-5 h-5 text-indigo-600" />,
      badge: 'Textbook Grade',
      to: `/workspace/${id}/deep-summary`,
    },
    {
      title: 'Exam Cram Sheet',
      subtitle: 'High-speed revision, traps, and checklist',
      icon: <Zap className="w-5 h-5 text-amber-600" />,
      badge: 'Fast Revision',
      to: `/workspace/${id}/exam-cram`,
    },
    {
      title: 'Chapters Breakdown',
      subtitle: 'Hierarchical accordion topics',
      icon: <ListTree className="w-5 h-5 text-purple-600" />,
      badge: `${material.chapterCount || 4} Chapters`,
      to: `/workspace/${id}/chapters`,
    },
    {
      title: 'Key Points',
      subtitle: 'Core concepts & memorable takeaways',
      icon: <Key className="w-5 h-5 text-rose-600" />,
      badge: 'Core Principles',
      to: `/workspace/${id}/key-points`,
    },
    {
      title: 'Formulas & Rules',
      subtitle: 'Normalization equations & math rules',
      icon: <Sigma className="w-5 h-5 text-emerald-600" />,
      badge: `${material.formulaCount || 12} Rules`,
      to: `/workspace/${id}/formulas`,
    },
    {
      title: 'Subject Glossary',
      subtitle: 'Instant search term definitions',
      icon: <BookMarked className="w-5 h-5 text-cyan-600" />,
      badge: `${material.glossaryCount || 20} Definitions`,
      to: `/workspace/${id}/glossary`,
    },
    {
      title: 'Flashcards',
      subtitle: 'Active recall & spaced repetition',
      icon: <Layers className="w-5 h-5 text-blue-600" />,
      badge: `${material.flashcardCount || 25} Cards`,
      to: `/workspace/${id}/flashcards`,
    },
    {
      title: 'Quiz Assessment',
      subtitle: 'Adaptive self-assessment with instant scoring',
      icon: <Sparkles className="w-5 h-5 text-purple-600" />,
      badge: 'Test Knowledge',
      to: `/workspace/${id}/quiz/setup`,
    },
    {
      title: 'Export Study Kit',
      subtitle: 'Print-ready PDF, markdown download & clipboard',
      icon: <ArrowRight className="w-5 h-5 text-emerald-600" />,
      badge: 'PDF / Markdown',
      to: `/workspace/${id}/export`,
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto pb-10">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-violet-800 text-white shadow-elevated relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-56 h-56" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-white/15 text-white px-3 py-1 rounded-full backdrop-blur-sm">
            <CheckCircle2 className="w-3.5 h-3.5" /> Workspace Prepared
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Study Workspace Overview
          </h1>
          <p className="text-xs sm:text-sm text-brand-100 max-w-2xl leading-relaxed">
            Your document <strong>{material.title}</strong> has been converted into exam-ready knowledge modules.
          </p>
          <div className="pt-2">
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate(`/workspace/${id}/quick-glance`)}
              className="gap-2 shadow-sm bg-white text-brand-700 hover:bg-gray-100"
            >
              <span>Start Learning: Quick Glance</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Grid of Prepared Study Modules */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-ink">Prepared Study Modules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((mod) => (
            <div
              key={mod.title}
              onClick={() => navigate(mod.to)}
              className="bg-white border border-edge rounded-2xl p-5 shadow-card hover:shadow-card-hover hover:border-brand-300 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-edge group-hover:bg-brand-50 transition-colors">
                    {mod.icon}
                  </div>
                  <span className="text-[10px] font-bold text-ink-muted bg-gray-100 px-2 py-0.5 rounded border border-edge">
                    {mod.badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-ink group-hover:text-brand-600 transition-colors">
                  {mod.title}
                </h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  {mod.subtitle}
                </p>
              </div>

              <div className="flex items-center text-xs font-semibold text-brand-600 gap-1 group-hover:translate-x-1 transition-transform">
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
