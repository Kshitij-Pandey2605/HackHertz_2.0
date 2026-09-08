import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  Layers,
  HelpCircle,
  BookOpen,
  Zap,
  UploadCloud,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { RecentActivityItem } from '../../types';

interface RecentActivityProps {
  items: RecentActivityItem[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ items }) => {
  const navigate = useNavigate();

  if (!items || items.length === 0) return null;

  const renderIcon = (type: RecentActivityItem['type']) => {
    switch (type) {
      case 'flashcards':
        return <Layers className="w-4 h-4 text-purple-600" />;
      case 'quiz':
        return <HelpCircle className="w-4 h-4 text-emerald-600" />;
      case 'deep_summary':
        return <BookOpen className="w-4 h-4 text-brand-600" />;
      case 'exam_cram':
        return <Zap className="w-4 h-4 text-amber-600" />;
      default:
        return <UploadCloud className="w-4 h-4 text-cyan-600" />;
    }
  };

  const getIconBg = (type: RecentActivityItem['type']) => {
    switch (type) {
      case 'flashcards':
        return 'bg-purple-50 border-purple-200';
      case 'quiz':
        return 'bg-emerald-50 border-emerald-200';
      case 'deep_summary':
        return 'bg-brand-50 border-brand-200';
      case 'exam_cram':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-cyan-50 border-cyan-200';
    }
  };

  // Group items by period
  const groups = ['Today', 'Yesterday', 'This Week'] as const;

  return (
    <div className="bg-white border border-edge rounded-2xl p-6 shadow-card space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-edge/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600 border border-brand-100">
            <Clock className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-ink">Recent Study Sessions</h3>
        </div>
        <span className="text-xs text-ink-muted">Timeline</span>
      </div>

      {/* Grouped Timeline */}
      <div className="space-y-6">
        {groups.map((group) => {
          const groupItems = items.filter((it) => it.periodGroup === group);
          if (groupItems.length === 0) return null;

          return (
            <div key={group} className="space-y-3">
              <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider block">
                {group}
              </span>

              <div className="space-y-2.5">
                {groupItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => item.targetUrl && navigate(item.targetUrl)}
                    className="p-3.5 rounded-xl border border-edge hover:border-brand-300 bg-gray-50/50 hover:bg-white transition-all cursor-pointer flex items-center justify-between gap-3 group shadow-subtle"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-xl border flex-shrink-0 ${getIconBg(item.type)}`}>
                        {renderIcon(item.type)}
                      </div>

                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-ink group-hover:text-brand-600 transition-colors truncate">
                            {item.title}
                          </h4>
                          {item.score && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full flex-shrink-0">
                              {item.score}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-ink-muted truncate">{item.subject}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[11px] text-ink-muted hidden sm:inline-block">
                        {item.timestamp}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-ink-muted group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;
