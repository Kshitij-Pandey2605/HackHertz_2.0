import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Zap,
  CheckCircle2,
  XCircle,
  ChevronRight,
  TrendingUp,
  Trophy,
  BarChart2,
  ArrowRight,
} from 'lucide-react';
import { AdaptiveQuestion, AdaptiveDifficulty } from '../../types';
import { mockAdaptiveQuestions } from '../../data/phase2MockData';
import { Button } from '../../components/ui/Button';

const difficultyConfig: Record<
  AdaptiveDifficulty,
  { label: string; color: string; bg: string; border: string; barColor: string; glow: string }
> = {
  EASY: {
    label: 'Easy',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    barColor: 'bg-emerald-500',
    glow: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]',
  },
  MEDIUM: {
    label: 'Medium',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    barColor: 'bg-amber-500',
    glow: 'shadow-[0_0_15px_rgba(245,158,11,0.2)]',
  },
  HARD: {
    label: 'Hard',
    color: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-300',
    barColor: 'bg-rose-500',
    glow: 'shadow-[0_0_15px_rgba(244,63,94,0.2)]',
  },
};

type Phase = 'CALIBRATING' | 'QUIZ' | 'RESULT';

interface SessionState {
  difficulty: AdaptiveDifficulty;
  questionIndex: number;
  questions: AdaptiveQuestion[];
  correctStreak: number;
  totalAnswered: number;
  totalCorrect: number;
  selectedAnswer: string | null;
  isAnswered: boolean;
  isCorrect: boolean | null;
}

const STREAK_TO_UPGRADE = 3; // 3 correct → go harder
const WRONG_TO_DOWNGRADE = 2; // 2 wrong in a row → go easier
let wrongStreak = 0;

export const AdaptiveQuizView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('CALIBRATING');
  const [session, setSession] = useState<SessionState>({
    difficulty: 'MEDIUM',
    questionIndex: 0,
    questions: [],
    correctStreak: 0,
    totalAnswered: 0,
    totalCorrect: 0,
    selectedAnswer: null,
    isAnswered: false,
    isCorrect: null,
  });

  // Calibration animation
  useEffect(() => {
    if (phase === 'CALIBRATING') {
      const timer = setTimeout(() => {
        const initialQuestions = mockAdaptiveQuestions['MEDIUM'];
        setSession((s) => ({ ...s, questions: initialQuestions, difficulty: 'MEDIUM' }));
        setPhase('QUIZ');
        wrongStreak = 0;
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const currentQuestion = session.questions[session.questionIndex];
  const cfg = difficultyConfig[session.difficulty];

  const handleSelect = (option: string) => {
    if (session.isAnswered) return;
    const correct = option === currentQuestion.correctAnswer;
    if (correct) {
      wrongStreak = 0;
    } else {
      wrongStreak++;
    }
    setSession((s) => ({ ...s, selectedAnswer: option, isAnswered: true, isCorrect: correct }));
  };

  const handleNext = () => {
    const newTotal = session.totalAnswered + 1;
    const newCorrect = session.totalCorrect + (session.isCorrect ? 1 : 0);
    const newStreak = session.isCorrect ? session.correctStreak + 1 : 0;

    // Determine next difficulty
    let nextDiff = session.difficulty;
    let nextQuestions = session.questions;
    let nextIndex = session.questionIndex + 1;

    if (newStreak >= STREAK_TO_UPGRADE && session.difficulty !== 'HARD') {
      nextDiff = session.difficulty === 'EASY' ? 'MEDIUM' : 'HARD';
      nextQuestions = mockAdaptiveQuestions[nextDiff];
      nextIndex = 0;
    } else if (wrongStreak >= WRONG_TO_DOWNGRADE && session.difficulty !== 'EASY') {
      nextDiff = session.difficulty === 'HARD' ? 'MEDIUM' : 'EASY';
      nextQuestions = mockAdaptiveQuestions[nextDiff];
      nextIndex = 0;
      wrongStreak = 0;
    }

    // End quiz after 12 questions
    if (newTotal >= 12) {
      setSession((s) => ({
        ...s,
        totalAnswered: newTotal,
        totalCorrect: newCorrect,
        correctStreak: newStreak,
        difficulty: nextDiff,
      }));
      setPhase('RESULT');
      return;
    }

    // Wrap around questions if needed
    if (nextIndex >= nextQuestions.length) nextIndex = 0;

    setSession((s) => ({
      ...s,
      difficulty: nextDiff,
      questionIndex: nextIndex,
      questions: nextQuestions,
      correctStreak: newStreak,
      totalAnswered: newTotal,
      totalCorrect: newCorrect,
      selectedAnswer: null,
      isAnswered: false,
      isCorrect: null,
    }));
  };

  // ── CALIBRATING phase ───────────────────────────────────────────────────────
  if (phase === 'CALIBRATING') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fadeIn space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-600 to-violet-700 flex items-center justify-center shadow-elevated">
          <Zap className="w-10 h-10 text-white animate-pulse" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-ink mb-2">Calibrating to Your Level…</h2>
          <p className="text-sm text-ink-muted">Analyzing your mastery profile and selecting the optimal starting difficulty.</p>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-brand-600 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  // ── RESULT phase ────────────────────────────────────────────────────────────
  if (phase === 'RESULT') {
    const accuracy = Math.round((session.totalCorrect / session.totalAnswered) * 100);
    const finalCfg = difficultyConfig[session.difficulty];
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn pb-16">
        <div className="bg-white rounded-3xl border border-edge shadow-card p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-600 mx-auto flex items-center justify-center shadow-elevated">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-ink">Adaptive Quiz Complete!</h1>
          <p className="text-sm text-ink-muted">Your quiz adapted in real-time to match your knowledge level.</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-4">
            <div className="text-center">
              <div className="text-5xl font-black text-ink">{session.totalCorrect}<span className="text-2xl font-semibold text-ink-muted">/{session.totalAnswered}</span></div>
              <div className="text-xs font-semibold text-ink-muted uppercase tracking-wider mt-1">Score</div>
            </div>
            <div className="h-10 w-px bg-edge hidden sm:block" />
            <div className="text-center">
              <div className={`text-5xl font-black ${accuracy >= 70 ? 'text-emerald-600' : accuracy >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>{accuracy}%</div>
              <div className="text-xs font-semibold text-ink-muted uppercase tracking-wider mt-1">Accuracy</div>
            </div>
            <div className="h-10 w-px bg-edge hidden sm:block" />
            <div className="text-center">
              <div className={`text-5xl font-black ${finalCfg.color}`}>{session.difficulty}</div>
              <div className="text-xs font-semibold text-ink-muted uppercase tracking-wider mt-1">Final Level</div>
            </div>
          </div>

          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${finalCfg.bg} ${finalCfg.border} border text-sm font-semibold ${finalCfg.color}`}>
            <BarChart2 className="w-4 h-4" />
            {accuracy >= 70 ? 'Excellent performance! Ready for harder challenges.' : accuracy >= 50 ? 'Good effort! Keep practicing weak topics.' : 'Review weak topics and try again.'}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="secondary" size="md" onClick={() => { setPhase('CALIBRATING'); setSession(s => ({ ...s, totalAnswered: 0, totalCorrect: 0, correctStreak: 0, questionIndex: 0 })); wrongStreak = 0; }} leftIcon={<Zap className="w-4 h-4" />}>
            Retry Adaptive Quiz
          </Button>
          <Button variant="primary" size="md" onClick={() => navigate(`/workspace/${id}/weak-topics`)} rightIcon={<ArrowRight className="w-4 h-4" />}>
            View Weak Topics
          </Button>
        </div>
      </div>
    );
  }

  // ── QUIZ phase ──────────────────────────────────────────────────────────────
  const progress = (session.totalAnswered / 12) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-600 to-violet-700 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-ink">Adaptive Quiz Engine</h1>
        </div>
        <div className="flex items-center gap-2">
          {session.correctStreak >= 2 && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
              🔥 {session.correctStreak} streak
            </span>
          )}
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.border} ${cfg.color}`}>
            {cfg.label} Mode
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-ink-muted mb-1.5">
          <span>Question {session.totalAnswered + 1} of 12</span>
          <span>{session.totalCorrect} correct</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full ${cfg.barColor} rounded-full transition-all duration-500`} style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question card */}
      <div className={`bg-white rounded-3xl border shadow-card p-6 sm:p-8 transition-all ${cfg.border} ${cfg.glow}`}>
        <div className="flex items-center gap-2 mb-5">
          <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.border} ${cfg.color}`}>
            {cfg.label} · {currentQuestion?.topic}
          </span>
        </div>

        <p className="text-lg font-bold text-ink leading-snug mb-6">{currentQuestion?.question}</p>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion?.options.map((option, i) => {
            const isSelected = session.selectedAnswer === option;
            const isCorrectOpt = option === currentQuestion.correctAnswer;
            let optStyle = 'bg-white border-edge hover:border-brand-300 hover:bg-brand-50/30 cursor-pointer';
            if (session.isAnswered) {
              if (isCorrectOpt) optStyle = 'bg-emerald-50 border-emerald-400 cursor-default';
              else if (isSelected) optStyle = 'bg-rose-50 border-rose-400 cursor-default';
              else optStyle = 'bg-gray-50 border-edge opacity-60 cursor-default';
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(option)}
                disabled={session.isAnswered}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${optStyle}`}
              >
                <span className="w-7 h-7 rounded-xl bg-gray-100 text-ink-muted text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-sm font-medium text-ink flex-1">{option}</span>
                {session.isAnswered && isCorrectOpt && <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />}
                {session.isAnswered && isSelected && !isCorrectOpt && <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Explanation after answer */}
        {session.isAnswered && (
          <div className={`mt-5 p-4 rounded-2xl border text-sm animate-fadeIn ${session.isCorrect ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50/60 border-rose-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              {session.isCorrect ? (
                <><CheckCircle2 className="w-4 h-4 text-emerald-600" /><span className="text-sm font-bold text-emerald-700">Correct! {session.correctStreak > 0 ? `${session.correctStreak + 1} in a row!` : ''}</span></>
              ) : (
                <><XCircle className="w-4 h-4 text-rose-600" /><span className="text-sm font-bold text-rose-700">Incorrect</span></>
              )}
            </div>
            <p className="text-ink-secondary text-xs leading-relaxed">{currentQuestion.explanation}</p>
            {!session.isCorrect && session.correctStreak === 0 && session.totalAnswered > 0 && session.difficulty !== 'EASY' && (
              <p className="text-xs text-amber-700 font-semibold mt-2 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 rotate-180" />
                Adjusting difficulty to easier questions…
              </p>
            )}
            {session.isCorrect && session.correctStreak + 1 >= STREAK_TO_UPGRADE && session.difficulty !== 'HARD' && (
              <p className="text-xs text-emerald-700 font-semibold mt-2 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                Great streak! Leveling up to harder questions…
              </p>
            )}
          </div>
        )}
      </div>

      {/* Next button */}
      {session.isAnswered && (
        <Button
          variant="primary"
          size="lg"
          onClick={handleNext}
          rightIcon={<ChevronRight className="w-5 h-5" />}
          className="w-full animate-fadeIn"
        >
          {session.totalAnswered + 1 >= 12 ? 'View Results' : 'Next Question'}
        </Button>
      )}
    </div>
  );
};
