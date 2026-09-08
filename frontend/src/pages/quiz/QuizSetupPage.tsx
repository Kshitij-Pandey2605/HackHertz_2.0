import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Layers,
  Flame,
  Check,
  FileText,
  SlidersHorizontal,
} from 'lucide-react';
import { api } from '../../services/api';
import { DifficultyLevel, QuestionType, Material, QuizSettings } from '../../types';
import { Button } from '../../components/ui/Button';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { useToast } from '../../contexts/ToastContext';

export const QuizSetupPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [material, setMaterial] = useState<Material | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Settings State
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('MEDIUM');
  const [questionCount, setQuestionCount] = useState<number>(15);
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>([
    'MCQ',
    'TRUE_FALSE',
    'FILL_BLANK',
    'SHORT_ANSWER',
  ]);

  useEffect(() => {
    const loadSetup = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const res = await api.quiz.getQuizSetup(id);
        setMaterial(res.data.material);
        if (res.data.material.difficulty) {
          setDifficulty(res.data.material.difficulty);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load quiz setup.');
      } finally {
        setIsLoading(false);
      }
    };

    loadSetup();
  }, [id]);

  const toggleType = (type: QuestionType) => {
    if (selectedTypes.includes(type)) {
      if (selectedTypes.length === 1) {
        showToast('You must select at least one question type.', 'error');
        return;
      }
      setSelectedTypes((prev) => prev.filter((t) => t !== type));
    } else {
      setSelectedTypes((prev) => [...prev, type]);
    }
  };

  const handleStartQuiz = async () => {
    if (!id) return;
    if (selectedTypes.length === 0) {
      showToast('Please select at least one question type.', 'error');
      return;
    }

    setIsGenerating(true);
    try {
      const settings: QuizSettings = {
        difficulty,
        questionCount,
        questionTypes: selectedTypes,
      };

      await api.quiz.generateQuiz(id, settings);
      showToast('Preparing your practice questions...', 'info');

      setTimeout(() => {
        navigate(`/workspace/${id}/quiz`);
      }, 500);
    } catch (err: unknown) {
      setIsGenerating(false);
      showToast(err instanceof Error ? err.message : 'Failed to prepare quiz.', 'error');
    }
  };

  if (isLoading) {
    return (
      <LoadingState
        fullPage
        title="Loading Assessment Setup..."
        description="Configuring syllabus questions and testing parameters"
      />
    );
  }

  if (error || !material) {
    return (
      <ErrorState
        fullPage
        title="Quiz Setup Unavailable"
        message={error || 'Unable to configure quiz for this study material.'}
        retryLabel="Return to Workspace"
        onRetry={() => navigate(`/workspace/${id}`)}
      />
    );
  }

  const difficultyCards = [
    {
      id: 'EASY' as DifficultyLevel,
      title: 'Easy',
      subtitle: 'Foundational recall',
      icon: <BookOpen className="w-5 h-5 text-emerald-600" />,
      desc: 'Basic definitions, 1NF rules, candidate key concepts, and introductory recognition.',
      badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      id: 'MEDIUM' as DifficultyLevel,
      title: 'Medium',
      subtitle: 'Exam-oriented application',
      icon: <Sparkles className="w-5 h-5 text-brand-600" />,
      desc: '2NF and 3NF conditions, transitive dependencies, prime attributes, and college syllabus questions.',
      badgeColor: 'text-brand-700 bg-brand-50 border-brand-200',
    },
    {
      id: 'HARD' as DifficultyLevel,
      title: 'Hard',
      subtitle: 'Deep technical rigor',
      icon: <Flame className="w-5 h-5 text-purple-600" />,
      desc: 'BCNF trade-offs, lossless join theorems, Armstrong transitivity proofs, and scenario diagnostics.',
      badgeColor: 'text-purple-700 bg-purple-50 border-purple-200',
    },
  ];

  const questionCounts = [5, 10, 15, 20];

  const availableTypes: { id: QuestionType; label: string; desc: string }[] = [
    {
      id: 'MCQ',
      label: 'Multiple Choice',
      desc: '4-option standard conceptual questions',
    },
    {
      id: 'TRUE_FALSE',
      label: 'True / False',
      desc: 'Rapid verification statements',
    },
    {
      id: 'FILL_BLANK',
      label: 'Fill in the Blank',
      desc: 'Rule and definition completion',
    },
    {
      id: 'SHORT_ANSWER',
      label: 'Short Answer',
      desc: 'Nuance distinctions and comparisons',
    },
  ];

  const typeSummaryText =
    selectedTypes.length === 4
      ? 'Mixed question types'
      : selectedTypes.map((t) => availableTypes.find((at) => at.id === t)?.label).join(', ');

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Top back navigation */}
      <div>
        <button
          type="button"
          onClick={() => navigate(`/workspace/${id}/flashcards`)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink mb-3 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Flashcards
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-2">
              <Sparkles className="w-3 h-3 text-brand-600" />
              <span>Practice &bull; Self-Assessment Assessment</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              Ready to test yourself?
            </h1>
            <p className="text-sm text-ink-muted mt-1">
              Choose how you want to practice what you&apos;ve learned.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-ink-secondary bg-gray-50 border border-edge px-3 py-1.5 rounded-xl">
            <FileText className="w-4 h-4 text-brand-600" />
            <span className="font-semibold truncate max-w-[200px]">{material.title}</span>
          </div>
        </div>
      </div>

      {/* 1. DIFFICULTY SELECTION */}
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-bold text-ink flex items-center gap-2">
            1. Target Difficulty
          </h3>
          <p className="text-xs text-ink-muted">
            The questions adapt according to whether you need foundational brush-up or advanced exam challenge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {difficultyCards.map((card) => {
            const isSelected = difficulty === card.id;

            return (
              <button
                key={card.id}
                type="button"
                onClick={() => setDifficulty(card.id)}
                className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-brand-600 ring-2 ring-brand-500/20 bg-white shadow-card'
                    : 'border-edge bg-white hover:border-gray-300 hover:bg-gray-50/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-gray-50 border border-edge">
                      {card.icon}
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                        isSelected
                          ? 'bg-brand-600 border-brand-600 text-white'
                          : 'border-edge bg-gray-50 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-ink">{card.title}</h4>
                  <p className="text-xs text-brand-600 font-medium mb-2">{card.subtitle}</p>
                  <p className="text-[11px] text-ink-muted leading-relaxed">{card.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. QUESTION COUNT */}
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-bold text-ink">2. Number of Questions</h3>
          <p className="text-xs text-ink-muted">Select how many questions you want to solve in this session.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {questionCounts.map((count) => {
            const isSelected = questionCount === count;
            return (
              <button
                key={count}
                type="button"
                onClick={() => setQuestionCount(count)}
                className={`p-4 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/70 text-brand-900 font-bold ring-2 ring-brand-500/20 shadow-subtle'
                    : 'border-edge bg-white text-ink-secondary hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl font-bold block">{count}</span>
                <span className="text-xs font-normal text-ink-muted">Questions</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. QUESTION TYPES (Multi-select) */}
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-bold text-ink">3. Question Formats</h3>
          <p className="text-xs text-ink-muted">Choose which question types to include (multi-select).</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {availableTypes.map((t) => {
            const isChecked = selectedTypes.includes(t.id);
            return (
              <div
                key={t.id}
                onClick={() => toggleType(t.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                  isChecked
                    ? 'border-brand-500 bg-brand-50/30'
                    : 'border-edge bg-white hover:bg-gray-50'
                }`}
              >
                <div
                  className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-colors flex-shrink-0 ${
                    isChecked
                      ? 'bg-brand-600 border-brand-600 text-white'
                      : 'border-edge bg-white text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-ink">{t.label}</h4>
                  <p className="text-[11px] text-ink-muted mt-0.5">{t.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. QUIZ PREVIEW CARD */}
      <div className="bg-canvas border border-edge rounded-2xl p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-edge pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-ink">
            <SlidersHorizontal className="w-4 h-4 text-brand-600" />
            <span>Quiz Configuration Preview</span>
          </div>
          <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded">
            {questionCount} questions &bull; {difficulty} &bull; {typeSummaryText}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-ink-muted block text-[11px]">Questions:</span>
            <span className="font-bold text-ink text-sm">{questionCount}</span>
          </div>
          <div>
            <span className="text-ink-muted block text-[11px]">Difficulty:</span>
            <span className="font-bold text-ink text-sm">{difficulty}</span>
          </div>
          <div>
            <span className="text-ink-muted block text-[11px]">Types:</span>
            <span className="font-bold text-ink text-sm">
              {selectedTypes.length === 4 ? 'Mixed' : `${selectedTypes.length} Selected`}
            </span>
          </div>
          <div>
            <span className="text-ink-muted block text-[11px]">Topic Scope:</span>
            <span className="font-bold text-ink text-sm">Normalization & FDs</span>
          </div>
        </div>
      </div>

      {/* START QUIZ PRIMARY CTA */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-ink-muted text-center sm:text-left">
          Questions are timed only if you choose. You can freely navigate back and forth.
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={handleStartQuiz}
          isLoading={isGenerating}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          leftIcon={<Sparkles className="w-4 h-4" />}
          className="w-full sm:w-auto shadow-elevated px-8"
        >
          Start Quiz
        </Button>
      </div>
    </div>
  );
};
