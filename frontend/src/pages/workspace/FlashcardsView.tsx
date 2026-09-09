import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
  Filter,
} from 'lucide-react';

export type CardLevelFilter = 'ALL' | 'EASY' | 'MEDIUM' | 'HARD';

export const FlashcardsView: React.FC = () => {
  const { id, documentId } = useParams<{ id?: string; documentId?: string }>();
  const activeDocId = documentId || id || '123';
  const navigate = useNavigate();

  const [cards, setCards] = useState<BackendFlashcard[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<CardLevelFilter>('ALL');
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

  // Strict Level Filtering:
  // Easy -> Show ONLY Easy flashcards
  // Medium -> Show ONLY Medium flashcards
  // Hard -> Show ONLY Hard flashcards
  // All -> Show ALL flashcards
  // Unselected levels are excluded from the active deck!
  const filteredCards = useMemo(() => {
    if (selectedLevel === 'ALL') return cards;
    return cards.filter((c) => (c.difficulty || 'MEDIUM').toUpperCase() === selectedLevel);
  }, [cards, selectedLevel]);

  const handleNext = useCallback(() => {
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  }, [currentIndex, filteredCards.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  const toggleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleLevelChange = (level: CardLevelFilter) => {
    setSelectedLevel(level);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Keyboard navigation listener (Space to flip, Left/Right arrow to navigate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        filteredCards.length === 0
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
  }, [filteredCards.length, handleNext, handlePrev, toggleFlip]);

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

    if (currentIndex < filteredCards.length - 1) {
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
          description="There are currently no flashcards generated for this study file."
          actionLabel="Upload Notes"
          onAction={() => navigate('/upload')}
        />
      </div>
    );
  }

  const currentCard = filteredCards[currentIndex];
  const isCurrentMastered = currentCard ? masteredIds.has(currentCard.id) : false;
  const progressPercent =
    filteredCards.length > 0 ? Math.round(((currentIndex + 1) / filteredCards.length) * 100) : 0;

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
                  Stage 2 &bull; Review
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink mt-1">
                Study Flashcards
              </h1>
              <p className="text-xs text-ink-muted">
                Flip through key terms, formulas, and concepts to test your recall.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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

        {/* Level Filter Bar */}
        <div className="pt-2 border-t border-edge flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-ink-muted" />
            <span className="text-xs font-semibold text-ink-secondary">Difficulty Level:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { key: 'ALL', label: 'All Levels (Mixed)', count: cards.length },
                {
                  key: 'EASY',
                  label: 'Easy',
                  count: cards.filter((c) => (c.difficulty || 'MEDIUM').toUpperCase() === 'EASY').length,
                },
                {
                  key: 'MEDIUM',
                  label: 'Medium',
                  count: cards.filter((c) => (c.difficulty || 'MEDIUM').toUpperCase() === 'MEDIUM').length,
                },
                {
                  key: 'HARD',
                  label: 'Hard',
                  count: cards.filter((c) => (c.difficulty || 'MEDIUM').toUpperCase() === 'HARD').length,
                },
              ] as { key: CardLevelFilter; label: string; count: number }[]
            ).map(({ key, label, count }) => {
              const isActive = selectedLevel === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleLevelChange(key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-sm ring-2 ring-offset-1 ring-purple-400'
                      : 'bg-gray-100 text-ink-secondary hover:bg-gray-200'
                  }`}
                >
                  <span>{label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-white text-ink-muted'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Progress Counter, Mastered Stats & Progress Bar */}
        {filteredCards.length > 0 && (
          <div className="space-y-2 pt-1 border-t border-edge/60">
            <div className="flex flex-wrap items-center justify-between text-xs font-semibold text-ink-muted gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {masteredIds.size} Mastered
                </span>
                <span className="inline-flex items-center gap-1 text-ink-secondary bg-gray-100 px-2 py-0.5 rounded">
                  {filteredCards.length - masteredIds.size} In Review
                </span>
              </div>
              <span className="text-purple-600">
                Card {currentIndex + 1} of {filteredCards.length} ({progressPercent}%)
              </span>
            </div>
            <ProgressBar progress={progressPercent} showLabel={false} height="sm" />
          </div>
        )}
      </div>

      {/* No Flashcards in this level */}
      {filteredCards.length === 0 ? (
        <div className="bg-white border border-edge rounded-2xl p-8 text-center space-y-3">
          <p className="text-sm text-ink-muted font-medium">
            No flashcards match the &ldquo;{selectedLevel}&rdquo; difficulty level.
          </p>
          <Button variant="secondary" size="sm" onClick={() => handleLevelChange('ALL')}>
            Show All Flashcards
          </Button>
        </div>
      ) : (
        <>
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
                  {currentCard.difficulty && (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-gray-100 text-ink-secondary border border-edge">
                      {currentCard.difficulty}
                    </span>
                  )}
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

              {/* Card Main Body */}
              <div className="my-auto py-6 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2">
                  {currentCard.topic || 'Concept Review'}
                </p>
                <h2 className="text-xl sm:text-2xl font-bold text-ink leading-relaxed">
                  {isFlipped ? currentCard.answer : currentCard.question}
                </h2>
              </div>

              {/* Bottom Instructions / Hint */}
              <div className="flex items-center justify-between pt-4 border-t border-edge/60 text-xs text-ink-muted">
                <span className="flex items-center gap-1.5">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Click anywhere or press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono border">Space</kbd> to flip</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1">
                  <Keyboard className="w-3.5 h-3.5" />
                  <span>Use &larr; &rarr; arrow keys</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action & Navigation Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="secondary"
                size="md"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
                className="flex-1 sm:flex-initial"
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={handleNext}
                disabled={currentIndex === filteredCards.length - 1}
                rightIcon={<ChevronRight className="w-4 h-4" />}
                className="flex-1 sm:flex-initial"
              >
                Next
              </Button>
            </div>

            {/* Retention feedback buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="md"
                onClick={() => handleMarkRetention(currentCard.id, false)}
                className="flex-1 sm:flex-initial text-rose-700 border-rose-200 hover:bg-rose-50 text-xs"
              >
                Need Review
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => handleMarkRetention(currentCard.id, true)}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
                className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700 text-xs shadow-sm"
              >
                I Know This
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FlashcardsView;
