import React, { useEffect, useState } from 'react';
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
  HelpCircle,
  RefreshCw,
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

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
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

  const progressPercent = Math.round(((currentIndex + 1) / cards.length) * 100);

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto pb-10">
      {/* Header Banner */}
      <div className="bg-white border border-edge rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
                Flashcards Review
              </h1>
              <p className="text-xs text-ink-muted">
                Active recall practice powered by your study document.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-ink bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full">
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

        {/* Progress Counter & Progress Bar */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs font-semibold text-ink-muted">
            <span>Progress: Card {currentIndex + 1} of {cards.length}</span>
            <span className="text-brand-600">{progressPercent}% Completed</span>
          </div>
          <ProgressBar progress={progressPercent} showLabel={false} height="sm" />
        </div>
      </div>

      {/* Main Flashcard with 3D Flip Animation */}
      <div className="perspective-1000">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`w-full min-h-[340px] sm:min-h-[380px] bg-white border border-edge rounded-3xl p-6 sm:p-10 shadow-elevated cursor-pointer transition-all duration-500 transform-style-preserve-3d relative flex flex-col justify-between select-none ${
            isFlipped
              ? 'bg-gradient-to-br from-emerald-50/40 via-white to-brand-50/40 border-emerald-300 shadow-xl'
              : 'hover:border-brand-400 hover:shadow-2xl'
          }`}
        >
          {/* Top Card Badge */}
          <div className="flex items-center justify-between text-xs">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                isFlipped
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  : 'text-brand-700 bg-brand-50 border-brand-200'
              }`}
            >
              {isFlipped ? 'ANSWER' : 'QUESTION'}
            </span>
            <span className="text-[11px] font-mono text-ink-muted bg-gray-100 px-2.5 py-1 rounded-md">
              Card #{currentCard.id}
            </span>
          </div>

          {/* Card Main Text */}
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

      {/* Flashcard Navigation Controls */}
      <div className="flex items-center justify-between gap-4 pt-2">
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
          onClick={() => setIsFlipped(!isFlipped)}
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

      {/* Bottom Practice CTA */}
      <div className="bg-white border border-edge rounded-2xl p-6 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-ink">Ready to test what you memorized?</h3>
          <p className="text-xs text-ink-muted mt-0.5">
            Take a self-assessment quiz with Easy, Medium, and Hard difficulty levels.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate(`/workspace/${activeDocId}/quiz`)}
          rightIcon={<Sparkles className="w-4 h-4" />}
          className="whitespace-nowrap"
        >
          Start Quiz Now
        </Button>
      </div>
    </div>
  );
};

export default FlashcardsView;
