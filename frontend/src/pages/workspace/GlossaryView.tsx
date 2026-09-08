import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { GlossaryTerm } from '../../types';
import { WorkspaceSkeleton } from '../../components/ui/WorkspaceSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { BookMarked, Search, ChevronDown, ChevronRight, Tag, Sparkles, ArrowRight } from 'lucide-react';

export const GlossaryView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [expandedTermIds, setExpandedTermIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const res = await api.workspace.getGlossary(id);
        setTerms(res.data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load glossary.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    terms.forEach((t) => set.add(t.topic));
    return ['ALL', ...Array.from(set)];
  }, [terms]);

  // Filtered terms
  const filteredTerms = useMemo(() => {
    return terms.filter((t) => {
      const matchesSearch =
        t.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.definition.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'ALL' || t.topic.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [terms, searchQuery, selectedCategory]);

  // Group terms alphabetically
  const groupedTerms = useMemo(() => {
    const map: Record<string, GlossaryTerm[]> = {};
    filteredTerms.forEach((t) => {
      const firstLetter = t.term[0].toUpperCase();
      if (!map[firstLetter]) map[firstLetter] = [];
      map[firstLetter].push(t);
    });
    return map;
  }, [filteredTerms]);

  const toggleExpand = (termId: string) => {
    setExpandedTermIds((prev) => ({ ...prev, [termId]: !prev[termId] }));
  };

  if (isLoading) return <WorkspaceSkeleton type="grid" />;

  if (error) {
    return (
      <ErrorState
        title="Unable to load Glossary"
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const alphabet = Object.keys(groupedTerms).sort();

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="bg-white border border-edge rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
            <BookMarked className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
              Subject Glossary
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted">
              Every important term from your material, explained clearly.
            </p>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-ink-subtle absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search definitions or terms..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-edge rounded-xl text-xs text-ink placeholder-ink-subtle focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-gray-100 text-ink-muted hover:bg-gray-200 hover:text-ink'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filtered Term List */}
      {alphabet.length === 0 ? (
        <EmptyState
          title="No Glossary Terms Found"
          description={`No terms match your search "${searchQuery}". Try clearing filters.`}
          actionLabel="Clear Search"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('ALL');
          }}
        />
      ) : (
        <div className="space-y-6">
          {alphabet.map((letter) => (
            <div key={letter} className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 font-bold text-sm flex items-center justify-center border border-purple-200">
                  {letter}
                </span>
                <div className="h-px bg-edge flex-1" />
              </div>

              <div className="space-y-3">
                {groupedTerms[letter].map((termItem) => {
                  const isExpanded = !!expandedTermIds[termItem.id];

                  return (
                    <div
                      key={termItem.id}
                      className="bg-white border border-edge rounded-2xl p-4 shadow-card hover:border-purple-200 transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => toggleExpand(termItem.id)}
                        className="w-full text-left flex items-start justify-between gap-3"
                      >
                        <div>
                          <h3 className="text-sm font-bold text-ink hover:text-purple-700 transition-colors">
                            {termItem.term}
                          </h3>
                          <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                            {termItem.definition}
                          </p>
                        </div>
                        <span className="p-1 rounded-lg text-ink-muted hover:bg-gray-100 flex-shrink-0">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </span>
                      </button>

                      {/* Optional Example & Topic Metadata */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-edge/60 space-y-2 text-xs">
                          {termItem.example && (
                            <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 text-purple-950 font-mono text-[11px]">
                              <span className="font-bold text-purple-800 block mb-0.5">Example:</span>
                              {termItem.example}
                            </div>
                          )}
                          <div className="flex items-center justify-between text-[11px] text-ink-muted">
                            <span className="flex items-center gap-1">
                              <Tag className="w-3 h-3 text-purple-600" />
                              <span>{termItem.topic}</span>
                            </span>
                            <span>{termItem.chapter}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom CTA to Flashcards / Quiz */}
      <div className="bg-white border border-edge rounded-2xl p-6 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Active Recall Practice</span>
          </div>
          <h3 className="text-sm font-bold text-ink">Test your vocabulary retention</h3>
          <p className="text-xs text-ink-muted mt-0.5">
            Turn these definitions into interactive flashcard drills or self-assessment questions.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate(`/workspace/${id}/quiz/setup`)}
            className="flex-1 sm:flex-none whitespace-nowrap"
          >
            Practice Quiz
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate(`/workspace/${id}/flashcards`)}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="flex-1 sm:flex-none whitespace-nowrap shadow-elevated"
          >
            Review Flashcards
          </Button>
        </div>
      </div>
    </div>
  );
};
