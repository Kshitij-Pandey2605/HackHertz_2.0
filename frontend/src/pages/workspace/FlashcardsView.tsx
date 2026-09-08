import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFlashcards } from '../../services/api';
import { BackendFlashcard } from '../../types';
import { WorkspaceSkeleton } from '../../components/ui/WorkspaceSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Button } from '../../components/ui/Button';
import {
  Layers,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Keyboard,
  ArrowRight,
} from 'lucide-react';

export const FlashcardsView: React.FC = () => {
  const { id, documentId } = useParams<{ id?: string; documentId?: string }>();
  const activeDocId = documentId || id || '123';
  const navigate = useNavigate();

  const [cards, setCards] = useState<BackendFlashcard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Active Card Index & Flip State
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Mastered / Needs Review tracking
  const [masteredIds, setMasteredIds] = useState<Set<number | string>>(new Set());

  const fetchFlashcardData = async () => {
    if (!activeDocId) {
      setError('Missing Document ID');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Step 5: Fetch from GET /api/flashcards/:documentId
      const res = await getFlashcards(activeDocId);
      if (res.success && Array.isArray(res.flashcards) && res.flashcards.length > 0) {
        setCards(res.flashcards);
      } else {
        setError('No flashcards found for this document.');
      }
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load flashcards from backend.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcardData();
  }, [activeDocId]);

  const handleNext = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  }, [currentIndex, cards.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  const toggleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  // Keyboard navigation listener (Space to flip, Left/Right arrow to navigate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        cards.length === 0
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        toggleFlip();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cards.length, handleNext, handlePrev, toggleFlip]);

  const handleMarkRetention = (cardId: number | string, mastered: boolean) => {
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (mastered) {
        next.add(cardId);
      } else {
        next.delete(cardId);
      }
      return next;
    });

    if (currentIndex < cards.length - 1) {
      handleNext();
    }
  };

  if (isLoading) return <WorkspaceSkeleton type="flashcard" />;

  if (error) {
    return (
      <div className="max-w-xl mx-auto my-12">
        <ErrorState
          title="Unable to load Flashcards"
          message={error}
          onRetry={fetchFlashcardData}
        />
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="max-w-xl mx-auto my-12">
        <EmptyState
          title="No Flashcards Available"
          description="There are currently no flashcards generated for this document ID."
          actionLabel="Upload Material"
          onAction={() => navigate('/upload')}
        />
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const isCurrentMastered = masteredIds.has(currentCard.id);
  const progressPercent = Math.round(((currentIndex + 1) / cards.length) * 100);

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto pb-10">
      {/* Header Banner */}
      <div className="bg-white border border-edge rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md">
                  Stage 2 &bull; Remember
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink mt-1">
                Active Recall Flashcards
              </h1>
              <p className="text-xs text-ink-muted">
                Flip through core definitions, candidate key rules, and normal form distinctions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-ink bg-purple-50 text-purple-900 border border-purple-200 px-3 py-1.5 rounded-full">
              Card {currentIndex + 1} of {cards.length}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={fetchFlashcardData}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Progress Counter, Mastered Stats & Progress Bar */}
        <div className="space-y-2 pt-1 border-t border-edge/60">
          <div className="flex flex-wrap items-center justify-between text-xs font-semibold text-ink-muted gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {masteredIds.size} Mastered
              </span>
              <span className="inline-flex items-center gap-1 text-ink-secondary bg-gray-100 px-2 py-0.5 rounded">
                {cards.length - masteredIds.size} In Review
              </span>
            </div>
            <span className="text-brand-600">{progressPercent}% Through Deck</span>
          </div>
          <ProgressBar progress={progressPercent} showLabel={false} height="sm" />
        </div>
      </div>

      {/* Main Flashcard with 3D Flip Animation */}
      <div className="perspective-1000">
        <div
          onClick={toggleFlip}
          className={`w-full min-h-[340px] sm:min-h-[380px] bg-white border rounded-3xl p-6 sm:p-10 shadow-elevated cursor-pointer transition-all duration-300 transform-style-preserve-3d relative flex flex-col justify-between select-none ${
            isFlipped
              ? 'bg-gradient-to-br from-emerald-50/40 via-white to-brand-50/40 border-emerald-300 shadow-xl'
              : 'border-edge hover:border-brand-400 hover:shadow-2xl'
          }`}
        >
          {/* Top Card Badge */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                  isFlipped
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    : 'text-brand-700 bg-brand-50 border-brand-200'
                }`}
              >
                {isFlipped ? 'ANSWER' : 'QUESTION'}
              </span>
              {isCurrentMastered && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Mastered
                </span>
              )}
            </div>
            <span className="text-[11px] font-mono text-ink-muted bg-gray-100 px-2.5 py-1 rounded-md">
              Card #{currentCard.id}
            </span>
          </div>

          {/* Card Main Content */}
          <div className="my-auto py-8 text-center space-y-4">
            {!isFlipped ? (
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink leading-relaxed px-4">
                {currentCard.question}
              </h2>
            ) : (
              <div className="space-y-3 px-4">
                <h2 className="text-lg sm:text-xl font-semibold text-emerald-950 leading-relaxed">
                  {currentCard.answer}
                </h2>
              </div>
            )}
          </div>

          {/* Bottom Flip Indicator */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-brand-600 font-semibold pt-3 border-t border-edge/60">
            <RotateCw className="w-3.5 h-3.5" />
            <span>{isFlipped ? 'Click card to show question' : 'Click card to reveal answer'}</span>
          </div>
        </div>
      </div>

      {/* Interactive Confidence Rating (Visible when flipped) */}
      {isFlipped && (
        <div className="p-4 bg-white border border-edge rounded-2xl shadow-card flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
          <span className="text-xs font-semibold text-ink">How well do you know this card?</span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleMarkRetention(currentCard.id, false)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100 transition-colors"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Still Learning</span>
            </button>
            <button
              type="button"
              onClick={() => handleMarkRetention(currentCard.id, true)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Got It! (Mastered)</span>
            </button>
          </div>
        </div>
      )}

      {/* Navigation Controls & Keyboard Hints */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="secondary"
            size="md"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
            className="shadow-subtle"
          >
            Previous Card
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={toggleFlip}
            leftIcon={<RotateCw className="w-4 h-4" />}
            className="bg-brand-50 text-brand-700 border-brand-200 hover:bg-brand-100"
          >
            {isFlipped ? 'Show Question' : 'Flip Card'}
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={handleNext}
            disabled={currentIndex === cards.length - 1}
            rightIcon={<ChevronRight className="w-4 h-4" />}
            className="shadow-subtle"
          >
            Next Card
          </Button>
        </div>

        {/* Keyboard shortcut pills */}
        <div className="flex items-center justify-center gap-3 text-[11px] text-ink-muted">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-gray-100 border border-edge rounded text-ink">Space</kbd>
            <span>flip card</span>
          </span>
          <span>&bull;</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-gray-100 border border-edge rounded text-ink">&larr;</kbd>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-gray-100 border border-edge rounded text-ink">&rarr;</kbd>
            <span>navigate cards</span>
          </span>
        </div>
      </div>

      {/* Bottom Practice CTA: Connect to Stage 3 Practice */}
      <div className="bg-white border border-edge rounded-2xl p-6 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Next Stage: Practice &bull; Self-Assessment</span>
          </div>
          <h3 className="text-sm font-bold text-ink">Ready to test what you memorized?</h3>
          <p className="text-xs text-ink-muted mt-0.5">
            Take a self-assessment quiz with Easy, Medium, and Hard difficulty levels.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate(`/workspace/${activeDocId}/quiz/setup`)}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="whitespace-nowrap shadow-elevated"
        >
          Setup Practice Quiz
        </Button>
      </div>
    </div>
  );
};

export default FlashcardsView;
