import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Send,
  Sparkles,
  HelpCircle,
  RefreshCw,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { getQuiz } from '../../services/api';
import { BackendQuiz, BackendQuizQuestion } from '../../types';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';

type DifficultyTab = 'easy' | 'medium' | 'hard';

export const QuizPage: React.FC = () => {
  const { id, documentId } = useParams<{ id?: string; documentId?: string }>();
  const activeDocId = documentId || id || '123';
  const navigate = useNavigate();

  const [quizData, setQuizData] = useState<BackendQuiz | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyTab>('easy');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuizData = async () => {
    if (!activeDocId) {
      setError('Document ID is required.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Step 6: Fetch from GET /api/quiz/:documentId
      const res = await getQuiz(activeDocId);
      if (res.success && res.quiz) {
        setQuizData(res.quiz);
      } else {
        setError('No quiz questions returned for this document.');
      }
      setCurrentIndex(0);
      setSelectedAnswers({});
      setIsSubmitted(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load quiz from backend.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizData();
  }, [activeDocId]);

  // Current active questions based on selected difficulty tab
  const currentQuestions: BackendQuizQuestion[] =
    quizData && quizData[selectedDifficulty] ? quizData[selectedDifficulty] : [];

  const currentQuestion: BackendQuizQuestion | undefined = currentQuestions[currentIndex];

  const handleSelectOption = (option: string) => {
    if (isSubmitted || !currentQuestion) return;
    const qKey = `${selectedDifficulty}_${currentQuestion.id}`;
    setSelectedAnswers((prev) => ({
      ...prev,
      [qKey]: option,
    }));
  };

  const handleNext = () => {
    if (currentIndex < currentQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleDifficultyChange = (diff: DifficultyTab) => {
    setSelectedDifficulty(diff);
    setCurrentIndex(0);
    setIsSubmitted(false);
  };

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentIndex(0);
  };

  // Calculate score for the active difficulty level
  const calculateScore = () => {
    let score = 0;
    currentQuestions.forEach((q) => {
      const qKey = `${selectedDifficulty}_${q.id}`;
      if (selectedAnswers[qKey] === q.answer) {
        score += 1;
      }
    });
    return score;
  };

  if (isLoading) {
    return (
      <LoadingState
        fullPage
        title="Loading your practice quiz..."
        description="Fetching difficulty-based questions from backend."
      />
    );
  }

  if (error || !quizData) {
    return (
      <div className="max-w-xl mx-auto my-12">
        <ErrorState
          title="Could not load Quiz"
          message={error || 'No quiz data found.'}
          onRetry={fetchQuizData}
        />
      </div>
    );
  }

  const totalQuestions = currentQuestions.length;
  const answeredCount = currentQuestions.filter(
    (q) => selectedAnswers[`${selectedDifficulty}_${q.id}`] !== undefined
  ).length;
  const progressPercent =
    totalQuestions > 0 ? Math.round(((currentIndex + 1) / totalQuestions) * 100) : 0;
  const currentSelectedAnswer = currentQuestion
    ? selectedAnswers[`${selectedDifficulty}_${currentQuestion.id}`]
    : undefined;

  const score = calculateScore();
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-edge rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-ink">
                Self-Assessment Quiz
              </h1>
              <p className="text-xs text-ink-muted">
                Test your knowledge across difficulty levels.
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={fetchQuizData}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Reload Questions
          </Button>
        </div>

        {/* Difficulty Selector Tabs (Easy, Medium, Hard) */}
        <div className="flex items-center gap-2 pt-2 border-t border-edge">
          {(['easy', 'medium', 'hard'] as DifficultyTab[]).map((level) => {
            const count = quizData[level]?.length || 0;
            const isActive = selectedDifficulty === level;
            return (
              <button
                key={level}
                type="button"
                onClick={() => handleDifficultyChange(level)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all flex items-center gap-2 ${
                  isActive
                    ? level === 'easy'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : level === 'medium'
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-purple-600 text-white shadow-sm'
                    : 'bg-gray-100 text-ink-secondary hover:bg-gray-200'
                }`}
              >
                <span>{level}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white text-ink-muted'
                  }`}
                >
                  {count} Qs
                </span>
              </button>
            );
          })}
        </div>

        {/* Progress Bar */}
        {totalQuestions > 0 && (
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs font-semibold text-ink-muted">
              <span>
                Question {currentIndex + 1} of {totalQuestions} ({selectedDifficulty.toUpperCase()})
              </span>
              <span className="text-brand-600 font-bold">{progressPercent}%</span>
            </div>
            <ProgressBar progress={progressPercent} showLabel={false} height="sm" />
          </div>
        )}
      </div>

      {/* Quiz Submission Results Card (when submitted) */}
      {isSubmitted && (
        <div className="bg-white border border-edge rounded-2xl p-6 sm:p-8 shadow-card text-center space-y-4 animate-fadeIn">
          <div className="w-16 h-16 mx-auto rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600">
            <Sparkles className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-ink">
              Quiz Completed ({selectedDifficulty.toUpperCase()})!
            </h2>
            <p className="text-sm text-ink-muted mt-1">
              You scored <span className="font-bold text-brand-600">{score}</span> out of{' '}
              <span className="font-bold">{totalQuestions}</span> ({percentage}%)
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <Button
              variant="secondary"
              size="md"
              onClick={handleResetQuiz}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Retry Quiz
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(`/workspace/${activeDocId}/summary`)}
              leftIcon={<BookOpen className="w-4 h-4" />}
            >
              Review Summary
            </Button>
          </div>
        </div>
      )}

      {/* Question Card */}
      {currentQuestion && (
        <div className="bg-white border border-edge rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-edge pb-4">
            <span className="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full uppercase tracking-wider">
              Question {currentIndex + 1}
            </span>
            <span className="text-xs font-semibold text-ink-muted">
              {answeredCount}/{totalQuestions} Answered
            </span>
          </div>

          {/* Question Text */}
          <h2 className="text-lg sm:text-xl font-bold text-ink leading-snug">
            {currentQuestion.question}
          </h2>

          {/* Multiple Choice Options */}
          <div className="space-y-3 pt-2">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = currentSelectedAnswer === option;
              const isCorrect = option === currentQuestion.answer;

              let optionClasses =
                'w-full text-left p-4 rounded-xl border text-sm font-semibold transition-all flex items-center justify-between cursor-pointer';

              if (isSubmitted) {
                if (isCorrect) {
                  optionClasses += ' bg-emerald-50 border-emerald-400 text-emerald-950 font-bold';
                } else if (isSelected && !isCorrect) {
                  optionClasses += ' bg-rose-50 border-rose-400 text-rose-950';
                } else {
                  optionClasses += ' bg-gray-50 border-edge text-ink-muted opacity-60';
                }
              } else {
                if (isSelected) {
                  optionClasses +=
                    ' bg-brand-50 border-brand-500 text-brand-900 shadow-sm ring-2 ring-brand-500/20';
                } else {
                  optionClasses +=
                    ' bg-white border-edge text-ink hover:bg-gray-50 hover:border-brand-300';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(option)}
                  disabled={isSubmitted}
                  className={optionClasses}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-gray-100 text-ink-muted font-bold text-xs flex items-center justify-center">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {isSubmitted && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  )}
                  {isSubmitted && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Navigation and Submit Controls */}
          <div className="pt-4 border-t border-edge flex items-center justify-between gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {currentIndex < totalQuestions - 1 ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleNext}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Next Question
                </Button>
              ) : (
                !isSubmitted && (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleSubmitQuiz}
                    rightIcon={<Send className="w-4 h-4" />}
                    className="bg-brand-600 hover:bg-brand-700 font-bold px-6 shadow-elevated"
                  >
                    Submit Quiz
                  </Button>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
