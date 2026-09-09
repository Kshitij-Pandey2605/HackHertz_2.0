import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  ArrowRight,
  Layers,
  Zap,
  BookOpen,
  FileDown,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Check,
} from 'lucide-react';
import { api } from '../../services/api';
import { QuizResult, GradedQuestion } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { useToast } from '../../contexts/ToastContext';

export const QuizResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [result, setResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter for questions review: 'ALL' | 'INCORRECT' | 'CORRECT'
  const [reviewFilter, setReviewFilter] = useState<'ALL' | 'INCORRECT' | 'CORRECT'>('ALL');
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadResult = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const res = await api.quiz.getQuizResult(id);
        setResult(res.data);

        // By default expand all incorrect questions
        const initialExpanded: Record<string, boolean> = {};
        res.data.gradedQuestions.forEach((q) => {
          initialExpanded[q.questionId] = !q.isCorrect;
        });
        setExpandedQuestions(initialExpanded);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load quiz results.');
      } finally {
        setIsLoading(false);
      }
    };

    loadResult();
  }, [id]);

  const toggleExpand = (qId: string) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const handleRetry = async () => {
    if (!id || !result) return;
    try {
      await api.quiz.retryQuiz(id, {
        difficulty: result.difficulty,
        questionCount: result.totalQuestions,
        questionTypes: ['MCQ', 'TRUE_FALSE', 'FILL_BLANK', 'SHORT_ANSWER'],
      });
      showToast('Fresh quiz session prepared!', 'success');
      navigate(`/workspace/${id}/quiz`);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to restart quiz', 'error');
    }
  };

  if (isLoading) {
    return (
      <LoadingState
        fullPage
        title="Loading your evaluation results..."
        description="Calculating scores and question diagnostic explanations"
      />
    );
  }

  if (error || !result) {
    return (
      <ErrorState
        fullPage
        title="No Quiz Results Found"
        message={error || 'Take a practice quiz first to generate results.'}
        retryLabel="Start Quiz"
        onRetry={() => navigate(`/workspace/${id}/quiz/setup`)}
      />
    );
  }

  const filteredQuestions = result.gradedQuestions.filter((q) => {
    if (reviewFilter === 'CORRECT') return q.isCorrect;
    if (reviewFilter === 'INCORRECT') return !q.isCorrect;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* 1. RESULTS HEADER */}
      <div className="bg-white border border-edge rounded-3xl p-6 sm:p-8 shadow-card text-center space-y-4 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold">
          <span>Self-Assessment &bull; {result.difficulty} Level</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink">
          Quiz Complete 🎯
        </h1>

        <p className="text-xs sm:text-sm text-ink-muted max-w-lg mx-auto">
          {result.summaryMessage}
        </p>

        {/* Score & Percentage Hero Display */}
        <div className="pt-2 pb-4 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
          <div className="text-center">
            <span className="text-4xl sm:text-5xl font-black text-ink tracking-tight">
              {result.score}{' '}
              <span className="text-xl sm:text-2xl font-semibold text-ink-muted">
                / {result.totalQuestions}
              </span>
            </span>
            <span className="block text-xs font-semibold text-ink-muted mt-1 uppercase tracking-wider">
              Total Score
            </span>
          </div>

          <div className="h-10 w-px bg-edge hidden sm:block" />

          <div className="text-center">
            <span
              className={`text-4xl sm:text-5xl font-black tracking-tight ${
                result.percentage >= 80
                  ? 'text-emerald-600'
                  : result.percentage >= 60
                  ? 'text-brand-600'
                  : 'text-amber-600'
              }`}
            >
              {result.percentage}%
            </span>
            <span className="block text-xs font-semibold text-ink-muted mt-1 uppercase tracking-wider">
              Accuracy
            </span>
          </div>
        </div>

        {/* Breakdown counters (No gamification, purely instructional) */}
        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2 border-t border-edge/60 text-xs">
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
            <span className="font-bold text-base block text-emerald-700">
              {result.correctCount}
            </span>
            <span className="text-[11px] font-medium text-emerald-800">Correct</span>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950">
            <span className="font-bold text-base block text-rose-700">
              {result.incorrectCount}
            </span>
            <span className="text-[11px] font-medium text-rose-800">Incorrect</span>
          </div>
          <div className="p-2.5 rounded-xl bg-gray-50 border border-edge text-ink">
            <span className="font-bold text-base block text-ink-muted">
              {result.unansweredCount}
            </span>
            <span className="text-[11px] font-medium text-ink-muted">Unanswered</span>
          </div>
        </div>
      </div>

      {/* 2. CONTEXTUAL NEXT STEPS (Continuity Loop) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-ink-muted uppercase tracking-wider">
          Suggested Next Study Steps
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {result.incorrectCount > 0 && (
            <button
              type="button"
              onClick={() => setReviewFilter('INCORRECT')}
              className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span className="text-[10px] font-bold text-rose-700 bg-white px-1.5 py-0.5 rounded border border-rose-200">
                  {result.incorrectCount} items
                </span>
              </div>
              <h4 className="text-xs font-bold text-ink group-hover:text-rose-700 transition-colors">
                Review Missed Concepts
              </h4>
              <p className="text-[11px] text-ink-muted mt-0.5">
                Focus on questions answered incorrectly.
              </p>
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate(`/workspace/${id}/flashcards`)}
            className="p-4 rounded-xl border border-edge bg-white hover:border-brand-300 hover:bg-brand-50/20 text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <Layers className="w-4 h-4 text-purple-600" />
              <ArrowRight className="w-3.5 h-3.5 text-ink-subtle group-hover:text-purple-600" />
            </div>
            <h4 className="text-xs font-bold text-ink group-hover:text-brand-600 transition-colors">
              Study Flashcards
            </h4>
            <p className="text-[11px] text-ink-muted mt-0.5">
              Practice with flashcards to remember key facts.
            </p>
          </button>

          <button
            type="button"
            onClick={() => navigate(`/workspace/${id}/exam-cram`)}
            className="p-4 rounded-xl border border-edge bg-white hover:border-brand-300 hover:bg-brand-50/20 text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-4 h-4 text-amber-600" />
              <ArrowRight className="w-3.5 h-3.5 text-ink-subtle group-hover:text-amber-600" />
            </div>
            <h4 className="text-xs font-bold text-ink group-hover:text-brand-600 transition-colors">
              Exam Cram Sheet
            </h4>
            <p className="text-[11px] text-ink-muted mt-0.5">
              Quick review points and common exam traps.
            </p>
          </button>

          <button
            type="button"
            onClick={() => navigate(`/workspace/${id}/export`)}
            className="p-4 rounded-xl border border-edge bg-white hover:border-brand-300 hover:bg-brand-50/20 text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <FileDown className="w-4 h-4 text-emerald-600" />
              <ArrowRight className="w-3.5 h-3.5 text-ink-subtle group-hover:text-emerald-600" />
            </div>
            <h4 className="text-xs font-bold text-ink group-hover:text-brand-600 transition-colors">
              Download Study Kit
            </h4>
            <p className="text-[11px] text-ink-muted mt-0.5">
              Download PDF or Markdown study sheets.
            </p>
          </button>
        </div>
      </div>

      {/* 3. QUESTION-BY-QUESTION REVIEW LIST */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-edge">
          <div>
            <h3 className="text-base font-bold text-ink">Question Review</h3>
            <p className="text-xs text-ink-muted mt-0.5">
              Inspect answer correctness and view detailed syllabus explanations.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl border border-edge self-start sm:self-auto">
            {(['ALL', 'INCORRECT', 'CORRECT'] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setReviewFilter(filter)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  reviewFilter === filter
                    ? 'bg-white text-ink shadow-subtle'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {filter === 'ALL' ? 'All Questions' : filter === 'INCORRECT' ? 'Incorrect' : 'Correct'}
              </button>
            ))}
          </div>
        </div>

        {/* Questions list */}
        <div className="space-y-3">
          {filteredQuestions.map((q, idx) => {
            const isExpanded = !!expandedQuestions[q.questionId];

            return (
              <div
                key={q.questionId}
                className={`bg-white rounded-2xl border transition-all ${
                  q.isCorrect ? 'border-edge' : 'border-rose-200 bg-rose-50/10'
                }`}
              >
                {/* Header row */}
                <div
                  onClick={() => toggleExpand(q.questionId)}
                  className="p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-gray-50/60 rounded-2xl transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="mt-0.5 flex-shrink-0">
                      {q.isCorrect ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                          <XCircle className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-ink">
                          Question {idx + 1}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-100 border border-edge text-ink-secondary">
                          {q.type}
                        </span>
                        <span className="text-[11px] text-ink-muted">
                          {q.topic}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-ink leading-snug">
                        {q.question}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="p-1 rounded-lg text-ink-muted hover:text-ink flex-shrink-0"
                    aria-label={isExpanded ? 'Collapse' : 'Expand'}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-edge/60 space-y-3.5 text-xs animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div
                        className={`p-3 rounded-xl border ${
                          q.isCorrect
                            ? 'bg-emerald-50/50 border-emerald-200'
                            : 'bg-rose-50/60 border-rose-200'
                        }`}
                      >
                        <span className="text-[11px] font-bold uppercase tracking-wider block text-ink-muted mb-1">
                          Your Answer:
                        </span>
                        <p
                          className={`font-semibold ${
                            q.isCorrect ? 'text-emerald-900' : 'text-rose-900'
                          }`}
                        >
                          {q.userAnswer}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl border border-edge bg-gray-50">
                        <span className="text-[11px] font-bold uppercase tracking-wider block text-ink-muted mb-1">
                          Correct Answer:
                        </span>
                        <p className="font-semibold text-ink">{q.correctAnswer}</p>
                      </div>
                    </div>

                    {/* Explanation */}
                    <div className="p-3.5 rounded-xl bg-canvas border border-edge">
                      <span className="text-[11px] font-bold uppercase tracking-wider block text-ink-muted mb-1">
                        Syllabus Explanation:
                      </span>
                      <p className="text-ink-secondary leading-relaxed">{q.explanation}</p>
                    </div>

                    {/* Review Concept CTA - Links to relevant workspace section */}
                    {!q.isCorrect && q.targetSection && (
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-ink-muted">
                          Concept appears in {q.chapter} ({q.topic})
                        </span>
                        <button
                          type="button"
                          onClick={() => navigate(`/workspace/${id}/${q.targetSection}`)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 px-3 py-1.5 rounded-xl transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Review this concept &rarr;</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Actions Bar */}
      <div className="pt-4 border-t border-edge flex flex-col sm:flex-row items-center justify-between gap-3">
        <Button
          variant="secondary"
          size="md"
          onClick={handleRetry}
          leftIcon={<RotateCcw className="w-4 h-4" />}
        >
          Retry Quiz
        </Button>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate(`/workspace/${id}`)}
          >
            Study Overview
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => navigate(`/workspace/${id}/export`)}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="shadow-elevated"
          >
            Export Study Sheet
          </Button>
        </div>
      </div>
    </div>
  );
};
