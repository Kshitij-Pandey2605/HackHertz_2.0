import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Chapter } from '../../types';
import { WorkspaceSkeleton } from '../../components/ui/WorkspaceSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Button } from '../../components/ui/Button';
import { ListTree, ChevronDown, ChevronRight, BookOpen, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';

export const ChaptersView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Expand states for chapter & topics
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({});
  const [openTopics, setOpenTopics] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const res = await api.workspace.getChapters(id);
        setChapters(res.data);
        // Initially expand first chapter & topics
        if (res.data.length > 0) {
          const firstChap = res.data[0];
          setOpenChapters({ [firstChap.id]: true });
          const initialTopics: Record<string, boolean> = {};
          firstChap.topics.forEach((t) => {
            initialTopics[t.id] = true;
          });
          setOpenTopics(initialTopics);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load chapters.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const toggleChapter = (chapId: string) => {
    setOpenChapters((prev) => ({ ...prev, [chapId]: !prev[chapId] }));
  };

  const toggleTopic = (topId: string) => {
    setOpenTopics((prev) => ({ ...prev, [topId]: !prev[topId] }));
  };

  if (isLoading) return <WorkspaceSkeleton type="grid" />;

  if (error || chapters.length === 0) {
    return (
      <ErrorState
        title="Unable to load Chapters"
        message={error || 'No chapters found.'}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="bg-white border border-edge rounded-2xl p-6 shadow-card space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
            <ListTree className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
              Chapters & Topics Breakdown
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted">
              Hierarchical exploration of functional dependencies and normal forms.
            </p>
          </div>
        </div>
      </div>

      {/* Accordion Chapters List */}
      <div className="space-y-4">
        {chapters.map((chap) => {
          const isChapOpen = !!openChapters[chap.id];

          return (
            <div
              key={chap.id}
              className="bg-white border border-edge rounded-2xl shadow-card overflow-hidden transition-all"
            >
              {/* Chapter Header Accordion Toggle */}
              <button
                type="button"
                onClick={() => toggleChapter(chap.id)}
                className="w-full p-5 text-left flex items-center justify-between bg-gray-50/70 hover:bg-gray-100/80 transition-colors border-b border-edge/60"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-brand-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                    {chap.number}
                  </span>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-ink">{chap.title}</h2>
                    <p className="text-xs text-ink-muted">{chap.topics.length} core topics extracted</p>
                  </div>
                </div>
                {isChapOpen ? (
                  <ChevronDown className="w-5 h-5 text-ink-muted" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-ink-muted" />
                )}
              </button>

              {/* Chapter Content Topics */}
              {isChapOpen && (
                <div className="p-5 space-y-4">
                  {chap.topics.map((topic) => {
                    const isTopicOpen = !!openTopics[topic.id];

                    return (
                      <div
                        key={topic.id}
                        className="rounded-xl border border-edge bg-white overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => toggleTopic(topic.id)}
                          className="w-full p-3.5 text-left flex items-center justify-between bg-gray-50/50 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <BookOpen className="w-4 h-4 text-brand-600" />
                            <span className="text-xs font-bold text-ink">{topic.title}</span>
                          </div>
                          {isTopicOpen ? (
                            <ChevronDown className="w-4 h-4 text-ink-muted" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-ink-muted" />
                          )}
                        </button>

                        {isTopicOpen && (
                          <div className="p-4 bg-white border-t border-edge/60 space-y-2">
                            <ul className="space-y-2 text-xs text-ink-secondary">
                              {topic.points.map((pt, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                  <span>{pt}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom CTA: Proceed to Stage 2 Remember */}
      <div className="bg-white border border-edge rounded-2xl p-6 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-brand-600 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Next: Stage 2 &bull; Remember</span>
          </div>
          <h3 className="text-sm font-bold text-ink">Finished exploring chapter breakdowns?</h3>
          <p className="text-xs text-ink-muted mt-0.5">
            Lock in what you learned by reviewing core Key Points or active recall Flashcards.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate(`/workspace/${id}/flashcards`)}
            className="flex-1 sm:flex-none whitespace-nowrap"
          >
            Flashcards
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate(`/workspace/${id}/key-points`)}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="flex-1 sm:flex-none whitespace-nowrap shadow-elevated"
          >
            Review Key Points
          </Button>
        </div>
      </div>
    </div>
  );
};
