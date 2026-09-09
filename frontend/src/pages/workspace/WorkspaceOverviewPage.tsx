import React from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { Material } from '../../types';
import { Button } from '../../components/ui/Button';
import {
  Eye,
  BookOpen,
  Zap,
  ListTree,
  Key,
  Sigma,
  BookMarked,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Award,
  Target,
  Brain,
} from 'lucide-react';

export const WorkspaceOverviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const context = useOutletContext<{ material?: Material }>();
  const material = context?.material;

  if (!material) return null;

  const modules = [
    {
      title: 'Quick Glance',
      subtitle: '1-min core idea overview & key concepts',
      icon: <Eye className="w-5 h-5 text-brand-600" />,
      badge: '1 Min Read',
      to: `/workspace/${id}/quick-glance`,
    },
    {
      title: 'Deep Summary',
      subtitle: 'Structured chapter explanations & proofs',
      icon: <BookOpen className="w-5 h-5 text-indigo-600" />,
      badge: 'Textbook Grade',
      to: `/workspace/${id}/deep-summary`,
    },
    {
      title: 'Exam Cram Sheet',
      subtitle: 'High-speed revision, traps, and checklist',
      icon: <Zap className="w-5 h-5 text-amber-600" />,
      badge: 'Fast Revision',
      to: `/workspace/${id}/exam-cram`,
    },
    {
      title: 'Chapters Breakdown',
      subtitle: 'Hierarchical accordion topics',
      icon: <ListTree className="w-5 h-5 text-purple-600" />,
      badge: `${material.chapterCount || 4} Chapters`,
      to: `/workspace/${id}/chapters`,
    },
    {
      title: 'Key Points',
      subtitle: 'Core concepts & memorable takeaways',
      icon: <Key className="w-5 h-5 text-rose-600" />,
      badge: 'Core Principles',
      to: `/workspace/${id}/key-points`,
    },
    {
      title: 'Formulas & Rules',
      subtitle: 'Normalization equations & math rules',
      icon: <Sigma className="w-5 h-5 text-emerald-600" />,
      badge: `${material.formulaCount || 12} Rules`,
      to: `/workspace/${id}/formulas`,
    },
    {
      title: 'Subject Glossary',
      subtitle: 'Instant search term definitions',
      icon: <BookMarked className="w-5 h-5 text-cyan-600" />,
      badge: `${material.glossaryCount || 20} Definitions`,
      to: `/workspace/${id}/glossary`,
    },
    {
      title: 'Flashcards',
      subtitle: 'Active recall & spaced repetition',
      icon: <Layers className="w-5 h-5 text-blue-600" />,
      badge: `${material.flashcardCount || 25} Cards`,
      to: `/workspace/${id}/flashcards`,
    },
    {
      title: 'Quiz Assessment',
      subtitle: 'Adaptive self-assessment with instant scoring',
      icon: <Sparkles className="w-5 h-5 text-purple-600" />,
      badge: 'Test Knowledge',
      to: `/workspace/${id}/quiz/setup`,
    },
    {
      title: 'Export Study Kit',
      subtitle: 'Print-ready PDF, markdown download & clipboard',
      icon: <ArrowRight className="w-5 h-5 text-emerald-600" />,
      badge: 'PDF / Markdown',
      to: `/workspace/${id}/export`,
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto pb-10">
      {/* 1. STUDY ROADMAP HERO */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-violet-800 text-white shadow-elevated relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-56 h-56" />
        </div>
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> Study Kit Ready
            </span>
            <span className="text-xs text-brand-100">
              {material.subject} &bull; {material.pages} pages &bull; {material.difficulty} Level
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Let&apos;s get you exam-ready
            </h1>
            <p className="text-xs sm:text-sm text-brand-100 mt-1 max-w-2xl leading-relaxed">
              We parsed <strong>{material.title}</strong> into a 4-stage study journey: Understand the concept, lock it in memory, practice questions, and revise before the exam.
            </p>
          </div>

          {/* Recommended First Action Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-brand-700 flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-sm">
                👁
              </div>
              <div>
                <p className="text-[11px] font-bold text-brand-200 uppercase tracking-wider">Recommended First Step</p>
                <h3 className="text-sm sm:text-base font-bold text-white">Start with the big picture: Quick Glance</h3>
                <p className="text-xs text-brand-100 mt-0.5">
                  Understand the core concepts in about 1 minute before diving into detailed chapters.
                </p>
              </div>
            </div>

            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate(`/workspace/${id}/quick-glance`)}
              className="gap-2 shadow-sm bg-white text-brand-700 hover:bg-gray-100 whitespace-nowrap font-bold text-xs self-start sm:self-auto"
            >
              <span>Start Quick Glance</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* 2. THE 4-STAGE GUIDED STUDY JOURNEY */}
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-bold text-ink">Your Structured Study Roadmap</h2>
          <p className="text-xs text-ink-muted mt-0.5">
            Follow this proven progression from foundational understanding to full exam mastery
          </p>
        </div>

        {/* STAGE 1: UNDERSTAND */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h3 className="text-sm font-bold text-ink uppercase tracking-wider">
              Understand &bull; Grasp the Concepts
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              onClick={() => navigate(`/workspace/${id}/quick-glance`)}
              className="bg-white border-2 border-brand-500 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-brand-50 text-brand-600">
                    <Eye className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-bold text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-full">
                    Start Here &bull; 1 min
                  </span>
                </div>
                <h4 className="text-sm font-bold text-ink group-hover:text-brand-600 transition-colors">
                  Quick Glance
                </h4>
                <p className="text-xs text-ink-muted leading-relaxed">
                  High-level bullet points, core definitions, and overarching context in 60 seconds.
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-brand-600 gap-1 pt-1">
                <span>Read Overview</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div
              onClick={() => navigate(`/workspace/${id}/deep-summary`)}
              className="bg-white border border-edge hover:border-brand-300 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                    <BookOpen className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-bold text-ink-muted bg-gray-100 border border-edge px-2 py-0.5 rounded-full">
                    Chapter Rigor
                  </span>
                </div>
                <h4 className="text-sm font-bold text-ink group-hover:text-brand-600 transition-colors">
                  Deep Summary
                </h4>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Chapter-by-chapter breakdowns, simple examples, and core concept proofs.
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-brand-600 gap-1 pt-1">
                <span>Explore Chapters</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div
              onClick={() => navigate(`/workspace/${id}/chapters`)}
              className="bg-white border border-edge hover:border-brand-300 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
                    <ListTree className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-bold text-ink-muted bg-gray-100 border border-edge px-2 py-0.5 rounded-full">
                    {material.chapterCount || 4} Chapters
                  </span>
                </div>
                <h4 className="text-sm font-bold text-ink group-hover:text-brand-600 transition-colors">
                  Chapters Breakdown
                </h4>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Navigate syllabus topics sequentially with expandable sub-sections.
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-brand-600 gap-1 pt-1">
                <span>View Outline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* STAGE 2: REMEMBER */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h3 className="text-sm font-bold text-ink uppercase tracking-wider">
              Remember &bull; Lock into Memory
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => navigate(`/workspace/${id}/flashcards`)}
              className="bg-white border-2 border-purple-300 hover:border-purple-500 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
                    <Layers className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                    {material.flashcardCount || 25} Cards
                  </span>
                </div>
                <h4 className="text-sm font-bold text-ink group-hover:text-brand-600 transition-colors">
                  Flashcards
                </h4>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Active recall flip cards with spaced repetition confidence ratings.
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-purple-600 gap-1 pt-1">
                <span>Practice Cards</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div
              onClick={() => navigate(`/workspace/${id}/formulas`)}
              className="bg-white border border-edge hover:border-brand-300 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <Sigma className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-bold text-ink-muted bg-gray-100 border border-edge px-2 py-0.5 rounded-full">
                    {material.formulaCount || 12} Rules
                  </span>
                </div>
                <h4 className="text-sm font-bold text-ink group-hover:text-brand-600 transition-colors">
                  Formulas & Rules
                </h4>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Key normalization rules, functional dependency equations, and proofs.
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-brand-600 gap-1 pt-1">
                <span>View Rules</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div
              onClick={() => navigate(`/workspace/${id}/key-points`)}
              className="bg-white border border-edge hover:border-brand-300 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
                    <Key className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-bold text-ink-muted bg-gray-100 border border-edge px-2 py-0.5 rounded-full">
                    Key Insights
                  </span>
                </div>
                <h4 className="text-sm font-bold text-ink group-hover:text-brand-600 transition-colors">
                  Key Points
                </h4>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Essential principles, exam traps to avoid, and memorable takeaways.
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-brand-600 gap-1 pt-1">
                <span>View Key Points</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div
              onClick={() => navigate(`/workspace/${id}/glossary`)}
              className="bg-white border border-edge hover:border-brand-300 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-cyan-50 text-cyan-600">
                    <BookMarked className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-bold text-ink-muted bg-gray-100 border border-edge px-2 py-0.5 rounded-full">
                    {material.glossaryCount || 20} Terms
                  </span>
                </div>
                <h4 className="text-sm font-bold text-ink group-hover:text-brand-600 transition-colors">
                  Subject Glossary
                </h4>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Searchable definitions dictionary with immediate context references.
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-brand-600 gap-1 pt-1">
                <span>Open Glossary</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* STAGE 3 & 4: PRACTICE & REVISE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* STAGE 3: PRACTICE */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h3 className="text-sm font-bold text-ink uppercase tracking-wider">
                Practice &bull; Test Knowledge
              </h3>
            </div>
            <div
              onClick={() => navigate(`/workspace/${id}/quiz/setup`)}
              className="bg-white border-2 border-emerald-300 hover:border-emerald-500 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between space-y-3 group h-full"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Diagnostic Quiz
                  </span>
                </div>
                <h4 className="text-sm font-bold text-ink group-hover:text-brand-600 transition-colors">
                  Quiz Assessment
                </h4>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Self-assessment with MCQs, True/False, and short answer questions, instant grading, and concept feedback.
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-emerald-700 gap-1 pt-1">
                <span>Take Practice Quiz</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* STAGE 4: REVISE */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center">
                4
              </span>
              <h3 className="text-sm font-bold text-ink uppercase tracking-wider">
                Revise &bull; Exam Preparation
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => navigate(`/workspace/${id}/exam-cram`)}
                className="bg-white border border-edge hover:border-amber-400 rounded-2xl p-4 shadow-card hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between space-y-2 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                      <Zap className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-[9px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                      Fast
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-ink group-hover:text-brand-600 transition-colors">
                    Exam Cram
                  </h4>
                  <p className="text-[11px] text-ink-muted leading-relaxed mt-0.5">
                    10-minute high-yield cram sheet.
                  </p>
                </div>
                <span className="text-[11px] font-bold text-amber-700 pt-1 flex items-center gap-1">
                  Review &rarr;
                </span>
              </div>

              <div
                onClick={() => navigate(`/workspace/${id}/export`)}
                className="bg-white border border-edge hover:border-emerald-400 rounded-2xl p-4 shadow-card hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between space-y-2 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                      PDF/MD
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-ink group-hover:text-brand-600 transition-colors">
                    Export Kit
                  </h4>
                  <p className="text-[11px] text-ink-muted leading-relaxed mt-0.5">
                    Print or save formatted study notes.
                  </p>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 pt-1 flex items-center gap-1">
                  Export &rarr;
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phase 2 — Smart Tools */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-ink">Phase 2 Smart Tools</h2>
          <span className="text-[10px] font-bold text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-full">NEW</span>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-violet-50 p-5 mb-2">
          <p className="text-xs text-brand-700 font-medium leading-relaxed">
            🚀 <strong>AI-powered differentiator features</strong> — Adaptive quizzes, mastery tracking, weak topic detection, and personalized coaching all powered by your study data.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              title: 'Weak Topics',
              subtitle: 'AI-detected problem areas from quiz history',
              icon: <AlertTriangle className="w-5 h-5 text-rose-600" />,
              badge: 'Post-Quiz',
              bg: 'hover:border-rose-300 hover:bg-rose-50/30',
              to: `/workspace/${id}/weak-topics`,
            },
            {
              title: 'Mastery Dashboard',
              subtitle: 'Per-subject progress with trend tracking',
              icon: <Award className="w-5 h-5 text-brand-600" />,
              badge: 'Progress',
              bg: 'hover:border-brand-300 hover:bg-brand-50/30',
              to: `/workspace/${id}/mastery`,
            },
            {
              title: 'Revision Planner',
              subtitle: 'Day-by-day study plan before your exam',
              icon: <Target className="w-5 h-5 text-violet-600" />,
              badge: 'Personalized',
              bg: 'hover:border-violet-300 hover:bg-violet-50/30',
              to: `/workspace/${id}/revision-planner`,
            },
            {
              title: 'Adaptive Quiz',
              subtitle: 'Auto-adjusts Easy→Hard based on answers',
              icon: <Zap className="w-5 h-5 text-amber-600" />,
              badge: 'AI Engine',
              bg: 'hover:border-amber-300 hover:bg-amber-50/30',
              to: `/workspace/${id}/adaptive-quiz`,
            },
            {
              title: 'AI Coach',
              subtitle: 'Personalized suggestions and learning insights',
              icon: <Brain className="w-5 h-5 text-emerald-600" />,
              badge: 'AI-Powered',
              bg: 'hover:border-emerald-300 hover:bg-emerald-50/30',
              to: `/workspace/${id}/ai-coach`,
            },
          ].map((mod) => (
            <div
              key={mod.title}
              onClick={() => navigate(mod.to)}
              className={`bg-white border border-edge rounded-2xl p-5 shadow-card transition-all cursor-pointer flex flex-col justify-between space-y-4 group ${mod.bg}`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-edge group-hover:bg-white/80 transition-colors">
                    {mod.icon}
                  </div>
                  <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                    {mod.badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-ink">
                  {mod.title}
                </h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  {mod.subtitle}
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-brand-600 gap-1 group-hover:translate-x-1 transition-transform">
                <span>Open</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
