import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Send,
  Sparkles,
  AlertTriangle,
  ArrowLeft,
  Clock,
  HelpCircle,
} from 'lucide-react';
import { api } from '../../services/api';
import { QuizSession } from '../../types';
import { QuestionCard } from '../../components/quiz/QuestionCard';
import { QuestionNavigator } from '../../components/quiz/QuestionNavigator';
import { GradingOverlay } from '../../components/quiz/GradingOverlay';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../contexts/ToastContext';

export const QuizPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [session, setSession] = useState<QuizSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quiz active state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGrading, setShowGrading] = useState(false);
  const [showUnansweredModal, setShowUnansweredModal] = useState(false);

  // Load quiz session and restored saved answers from localStorage
  useEffect(() => {
    const loadQuiz = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const res = await api.quiz.getQuizSession(id);
        setSession(res.data);

        // Restore any in-progress answers
        const savedAnswers = localStorage.getItem(`premind_quiz_answers_${id}`);
        if (savedAnswers) {
          try {
            setAnswers(JSON.parse(savedAnswers));
          } catch (e) {
            console.error('Failed to parse saved answers', e);
          }
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load quiz session.');
      } finally {
        setIsLoading(false);
      }
    };

    loadQuiz();
  }, [id]);

  // Persist answers to localStorage whenever changed
  const handleAnswerChange = (questionId: string, answerText: string) => {
    setAnswers((prev) => {
      const updated = { ...prev, [questionId]: answerText };
      if (id) {
        localStorage.setItem(`premind_quiz_answers_${id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const handleNext = () => {
    if (!session) return;
    if (currentIndex < session.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const calculateUnanswered = (): number => {
    if (!session) return 0;
    let count = 0;
    session.questions.forEach((q) => {
      if (!(answers[q.id] || '').trim()) {
        count += 1;
      }
    });
    return count;
  };

  const handleSubmitAttempt = () => {
    const unanswered = calculateUnanswered();
    if (unanswered > 0) {
      setShowUnansweredModal(true);
    } else {
      performSubmission();
    }
  };

  const performSubmission = async () => {
    if (!id) return;
    setShowUnansweredModal(false);
    setIsSubmitting(true);
    setShowGrading(true);

    try {
      await api.quiz.submitQuiz(id, answers);

      // Clean up in-progress answers
      localStorage.removeItem(`premind_quiz_answers_${id}`);

      // Allow grading animation to complete before redirecting
      setTimeout(() => {
        navigate(`/workspace/${id}/quiz/results`);
      }, 1500);
    } catch (err: unknown) {
      setShowGrading(false);
      setIsSubmitting(false);
      showToast(
        err instanceof Error ? err.message : 'Failed to evaluate quiz responses.',
        'error'
      );
    }
  };

  if (isLoading) {
    return (
      <LoadingState
        fullPage
        title="Loading your practice questions..."
        description="Initializing the assessment engine and question bank"
      />
    );
  }

  if (error || !session || session.questions.length === 0) {
    return (
      <ErrorState
        fullPage
        title="Quiz Not Ready"
        message={error || 'No questions could be loaded for this session.'}
        retryLabel="Configure Quiz"
        onRetry={() => navigate(`/workspace/${id}/quiz/setup`)}
      />
    );
  }

  const currentQuestion = session.questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / session.questions.length) * 100);
  const isLastQuestion = currentIndex === session.questions.length - 1;
  const unansweredCount = calculateUnanswered();

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Top Bar with Exit & Progress */}
      <div className="bg-white border border-edge rounded-2xl p-4 sm:p-5 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => navigate(`/workspace/${id}/quiz/setup`)}
            className="p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-gray-100 transition-colors"
            title="Exit quiz"
            aria-label="Exit quiz"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-ink truncate max-w-sm">
              {session.materialTitle}
            </h2>
            <div className="flex items-center gap-2 text-xs text-ink-muted mt-0.5">
              <span>Assessment Session</span>
              <span>&bull;</span>
              <Badge
                variant={
                  session.difficulty === 'EASY'
                    ? 'success'
                    : session.difficulty === 'HARD'
                    ? 'violet'
                    : 'brand'
                }
                size="sm"
              >
                {session.difficulty} Level
              </Badge>
            </div>
          </div>
        </div>

        {/* Question Counter & Progress */}
        <div className="flex items-center gap-4 sm:self-auto min-w-[200px]">
          <div className="w-full">
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-ink">
                Question {currentIndex + 1} of {session.questions.length}
              </span>
              <span className="text-brand-600">{progressPercent}%</span>
            </div>
            <ProgressBar progress={progressPercent} size="sm" />
          </div>
        </div>
      </div>

      {/* Main Quiz Area (2 Columns on large screens) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Question Card Column */}
        <div className="lg:col-span-8 space-y-6">
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={session.questions.length}
            currentAnswer={answers[currentQuestion.id] || ''}
            onAnswerChange={(ans) => handleAnswerChange(currentQuestion.id, ans)}
          />

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <Button
              variant="secondary"
              size="md"
              onClick={handlePrev}
              disabled={currentIndex === 0 || isSubmitting}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {isLastQuestion ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSubmitAttempt}
                  isLoading={isSubmitting}
                  rightIcon={<Send className="w-4 h-4" />}
                  className="bg-brand-600 hover:bg-brand-700 font-bold px-6 shadow-elevated"
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Next Question
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Question Navigator */}
        <div className="lg:col-span-4 space-y-4">
          <QuestionNavigator
            questions={session.questions}
            currentIndex={currentIndex}
            answers={answers}
            onSelectQuestion={(idx) => setCurrentIndex(idx)}
          />

          <div className="bg-canvas border border-edge rounded-2xl p-4 text-xs text-ink-muted leading-relaxed">
            <p className="font-semibold text-ink mb-1 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-brand-600" /> Assessment Tip
            </p>
            Answers are saved automatically as you type or click. You can jump freely between questions before submitting.
          </div>
        </div>
      </div>

      {/* Unanswered Questions Warning Modal */}
      <Modal
        isOpen={showUnansweredModal}
        onClose={() => setShowUnansweredModal(false)}
        title="Unanswered Questions"
        description="Confirm quiz submission"
      >
        <div className="space-y-4 py-2">
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-900">
                You still have {unansweredCount} unanswered question{unansweredCount === 1 ? '' : 's'}.
              </p>
              <p className="text-xs text-amber-800 mt-1">
                Unanswered questions will be scored as 0. You can return to answer them or submit anyway.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowUnansweredModal(false)}
            >
              Continue Quiz
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={performSubmission}
              isLoading={isSubmitting}
            >
              Submit Anyway
            </Button>
          </div>
        </div>
      </Modal>

      {/* Progressive Grading Animation Overlay */}
      <GradingOverlay isOpen={showGrading} />
    </div>
  );
};
