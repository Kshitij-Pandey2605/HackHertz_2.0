import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useOutletContext, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Flashcard, Material } from '../../types';
import { WorkspaceSkeleton } from '../../components/ui/WorkspaceSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../contexts/ToastContext';
import {
  Layers,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Sparkles,
  Clock,
  Filter,
} from 'lucide-react';

export const FlashcardsView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const context = useOutletContext<{ material?: Material }>();
  const materialDifficulty = context?.material?.difficulty || 'MEDIUM';
  const { showToast } = useToast();

  const [cards, setCards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active Index & Flip State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('ALL');
  const [reviewSuggestion, setReviewSuggestion] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const res = await api.workspace.getFlashcards(id, {
          topic: selectedTopic,
        });
        setCards(res.data);
        setCurrentIndex(0);
        setIsFlipped(false);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load flashcards.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, selectedTopic]);

  // Extract unique topics for filter
  const topics = useMemo(() => {
    const set = new Set<string>();
    cards.forEach((c) => set.add(c.topic));
    return ['ALL', ...Array.from(set)];
  }, [cards]);

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
      setReviewSuggestion(null);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
      setReviewSuggestion(null);
    }
  };

  const handleFeedback = async (rating: 'AGAIN' | 'GOOD' | 'EASY') => {
    if (!currentCard || !id) return;
    try {
      const res = await api.workspace.submitFlashcardFeedback(id, {
        flashcardId: currentCard.id,
        rating,
      });
      setReviewSuggestion(res.data.nextReview);
      showToast(res.message || `Rating saved`, 'success');

      // Auto advance to next card after brief pause
      setTimeout(() => {
        if (currentIndex < cards.length - 1) {
          handleNext();
        }
      }, 1000);
    } catch {
      showToast('Could not record feedback', 'error');
    }
  };

  if (isLoading) return <WorkspaceSkeleton type="flashcard" />;

  if (error) {
    return (
      <ErrorState
        title="Unable to load Flashcards"
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (cards.length === 0) {
    return (
      <EmptyState
        title="No Flashcards Available"
        description="No flashcards match your selected topic filter."
        actionLabel="Reset Filters"
        onAction={() => setSelectedTopic('ALL')}
      />
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / cards.length) * 100);

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto pb-10">
      {/* Header Banner */}
      <div className="bg-white border border-edge rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
                Flashcards & Spaced Repetition
              </h1>
              <p className="text-xs text-ink-muted">
                Turn what you learned into active recall.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="brand" size="sm">
              {materialDifficulty} Level
            </Badge>
            <span className="text-xs font-bold text-ink bg-gray-100 px-3 py-1 rounded-full border border-edge">
              Card {currentIndex + 1} of {cards.length}
            </span>
          </div>
        </div>

        {/* Progress Bar & Topic Filter */}
        <div className="space-y-3 pt-2">
          <ProgressBar progress={progressPercent} showLabel={false} height="sm" />

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-ink-muted" />
              <span className="text-ink-muted font-medium">Topic Filter:</span>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="bg-gray-50 border border-edge rounded-lg px-2.5 py-1 text-xs font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {topics.map((t) => (
                  <option key={t} value={t}>
                    {t === 'ALL' ? 'All Topics' : t}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-ink-muted font-medium">
              {progressPercent}% Completed
            </span>
          </div>
        </div>
      </div>

      {/* Main Flashcard 3D Container */}
      <div className="perspective-1000">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`w-full min-h-[320px] sm:min-h-[360px] bg-white border border-edge rounded-3xl p-6 sm:p-10 shadow-elevated cursor-pointer transition-transform duration-500 transform-style-preserve-3d relative flex flex-col justify-between select-none ${
            isFlipped ? 'rotate-y-180 bg-gradient-to-br from-white via-brand-50/20 to-purple-50/30' : 'hover:border-brand-300'
          }`}
        >
          {/* Top Card Badge */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-100">
              {isFlipped ? 'ANSWER' : 'QUESTION'}
            </span>
            <span className="text-[11px] font-semibold text-ink-muted bg-gray-100 px-2 py-0.5 rounded">
              {currentCard.topic}
            </span>
          </div>

          {/* Card Main Text */}
          <div className="my-auto py-6 text-center space-y-4">
            {!isFlipped ? (
              <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-ink leading-snug">
                "{currentCard.question}"
              </h2>
            ) : (
              <div className="space-y-3">
                <h2 className="text-base sm:text-xl font-semibold text-brand-900 leading-relaxed">
                  {currentCard.answer}
                </h2>
                {currentCard.explanation && (
                  <p className="text-xs text-ink-muted italic border-t border-edge/60 pt-3 max-w-md mx-auto">
                    Note: {currentCard.explanation}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Bottom Flip Indicator */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-brand-600 font-semibold pt-2">
            <RotateCw className="w-3.5 h-3.5" />
            <span>{isFlipped ? 'Click to show question' : 'Click to reveal answer'}</span>
          </div>
        </div>
      </div>

      {/* Flashcard Controls (Previous, Flip, Next) */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-edge bg-white text-xs font-semibold text-ink hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-subtle"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        <button
          type="button"
          onClick={() => setIsFlipped(!isFlipped)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold hover:bg-brand-100 transition-colors shadow-subtle"
        >
          <RotateCw className="w-4 h-4" />
          <span>{isFlipped ? 'Show Question' : 'Show Answer'}</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-edge bg-white text-xs font-semibold text-ink hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-subtle"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Spaced Repetition Buttons (Revealed on Back) */}
      {isFlipped && (
        <div className="bg-white border border-edge rounded-2xl p-5 shadow-card space-y-3 text-center animate-fadeIn">
          <p className="text-xs font-bold text-ink">How well did you remember this?</p>
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => handleFeedback('AGAIN')}
              className="p-3 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors space-y-0.5 text-rose-900"
            >
              <span className="text-xs font-bold block">Again</span>
              <span className="text-[10px] text-rose-700 block">Later today</span>
            </button>

            <button
              type="button"
              onClick={() => handleFeedback('GOOD')}
              className="p-3 rounded-xl bg-brand-50 border border-brand-200 hover:bg-brand-100 transition-colors space-y-0.5 text-brand-900"
            >
              <span className="text-xs font-bold block">Good</span>
              <span className="text-[10px] text-brand-700 block">Tomorrow</span>
            </button>

            <button
              type="button"
              onClick={() => handleFeedback('EASY')}
              className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors space-y-0.5 text-emerald-900"
            >
              <span className="text-xs font-bold block">Easy</span>
              <span className="text-[10px] text-emerald-700 block">In 3 days</span>
            </button>
          </div>

          {reviewSuggestion && (
            <p className="text-xs text-emerald-700 font-semibold pt-1 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Suggested review: {reviewSuggestion}
            </p>
          )}
        </div>
      )}

      {/* Bottom CTA to Quiz Assessment */}
      <div className="bg-white border border-edge rounded-2xl p-6 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-ink">Ready to test your knowledge?</h3>
          <p className="text-xs text-ink-muted mt-0.5">
            Take a self-assessment quiz based on your study material.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(`/workspace/${id}/quiz/setup`)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-brand-600 text-white rounded-xl text-xs font-bold hover:from-purple-700 hover:to-brand-700 transition-all shadow-sm whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4" />
          <span>Test Yourself →</span>
        </button>
      </div>
    </div>
  );
};
