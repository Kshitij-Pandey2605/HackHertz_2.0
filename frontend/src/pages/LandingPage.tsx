import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileUp,
  Sparkles,
  BookOpen,
  Layers,
  HelpCircle,
  FileCheck,
  ArrowRight,
  Zap,
  CheckCircle,
  Check,
  Download,
  Share2,
  Printer,
  Compass,
  Sigma,
  Flame,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col selection:bg-brand-100 selection:text-brand-900">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative isolate overflow-hidden pt-12 sm:pt-20 pb-16 sm:pb-24 border-b border-edge">
        {/* Subtle radial ambient background light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-brand-100/60 via-brand-50/20 to-transparent blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Hackathon PS Problem Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-6 animate-fadeIn">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Smart Study Material Summarizer &bull; EdTech & Smart Learning</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-ink max-w-4xl mx-auto leading-tight sm:leading-[1.15] mb-6">
            Turn any textbook into{' '}
            <span className="inline-block bg-gradient-to-r from-brand-600 via-violet-600 to-brand-700 bg-clip-text text-transparent pb-1">
              exam-ready knowledge.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-ink-muted max-w-2xl mx-auto leading-relaxed mb-8">
            Upload your notes, textbooks, or lecture slides. PreMind AI transforms them into structured summaries, formulas, flashcards, and quizzes.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/upload')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto shadow-elevated"
            >
              Transform My Material
            </Button>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 rounded-xl border border-edge bg-white text-sm font-semibold text-ink-secondary hover:text-ink hover:bg-gray-50 transition-colors"
            >
              See How It Works
            </a>
          </div>

          {/* Visual Progression Journey Pipeline */}
          <div className="bg-white rounded-2xl border border-edge shadow-card p-6 sm:p-8 max-w-4xl mx-auto text-left">
            <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-4 text-center">
              The PreMind Learning Journey: Study Material &rarr; Understand &rarr; Remember &rarr; Practice &rarr; Master
            </p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
              {/* Step 1: Document */}
              <div className="p-4 rounded-xl bg-gray-50/80 border border-edge flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-lg bg-white border border-edge flex items-center justify-center text-brand-600 mb-2 shadow-subtle">
                  <FileUp className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-ink">1. Document</h4>
                <p className="text-[11px] text-ink-muted mt-0.5">PDF, PPTX, Notes</p>
              </div>

              {/* Step 2: AI Processing */}
              <div className="p-4 rounded-xl bg-brand-50/50 border border-brand-200 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-lg bg-brand-600 text-white flex items-center justify-center mb-2 shadow-subtle">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-brand-900">2. AI Processing</h4>
                <p className="text-[11px] text-brand-700 mt-0.5">Structure & Formulas</p>
              </div>

              {/* Step 3: Summary */}
              <div className="p-4 rounded-xl bg-gray-50/80 border border-edge flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-lg bg-white border border-edge flex items-center justify-center text-emerald-600 mb-2 shadow-subtle">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-ink">3. 3-Tier Summary</h4>
                <p className="text-[11px] text-ink-muted mt-0.5">Glance, Deep & Cram</p>
              </div>

              {/* Step 4: Flashcards */}
              <div className="p-4 rounded-xl bg-gray-50/80 border border-edge flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-lg bg-white border border-edge flex items-center justify-center text-purple-600 mb-2 shadow-subtle">
                  <Layers className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-ink">4. Flashcards</h4>
                <p className="text-[11px] text-ink-muted mt-0.5">Active Recall Q&A</p>
              </div>

              {/* Step 5: Quiz */}
              <div className="p-4 rounded-xl bg-gray-50/80 border border-edge flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-lg bg-white border border-edge flex items-center justify-center text-amber-600 mb-2 shadow-subtle">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-ink">5. Adaptive Quiz</h4>
                <p className="text-[11px] text-ink-muted mt-0.5">Exam Diagnostics</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-white border-b border-edge">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200">
              Simple 3-Step Flow
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink mt-3">
              From raw slides to exam-ready mastery in minutes
            </h2>
            <p className="text-sm sm:text-base text-ink-muted mt-3">
              Stop spending hours manually re-writing notes. Let PreMind AI extract the foundational syllabus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-canvas border border-edge">
              <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 font-bold text-lg mb-5">
                01
              </div>
              <h3 className="text-lg font-bold text-ink mb-2">Upload Your Source Material</h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                Drop in your PDF textbooks, lecture PPT slides, DOC notes, or handwritten scans up to 50MB.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-canvas border border-edge">
              <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 font-bold text-lg mb-5">
                02
              </div>
              <h3 className="text-lg font-bold text-ink mb-2">Select Target Depth</h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                Choose between Foundational (Easy), Exam-Oriented (Medium), or Deep Technical Mastery (Hard) to align with your syllabus.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-canvas border border-edge">
              <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 font-bold text-lg mb-5">
                03
              </div>
              <h3 className="text-lg font-bold text-ink mb-2">Study & Master Retention</h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                Review key formulas, test active recall with flashcards, and test yourself on adaptive quizzes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THREE LEVELS OF UNDERSTANDING */}
      <section id="levels" className="py-16 sm:py-24 bg-canvas border-b border-edge">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200">
              Retention Progression (35% PS Weight)
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink mt-3">
              The 3-Tier Summary Hierarchy
            </h2>
            <p className="text-sm sm:text-base text-ink-muted mt-3">
              PreMind AI doesn&apos;t just dump a wall of text. We structure summaries into three progressive layers so you retain information systematically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quick Glance */}
            <div className="bg-white p-6 rounded-2xl border border-edge shadow-card flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold mb-4 border border-emerald-200">
                  <Zap className="w-3.5 h-3.5" /> Layer 1: Quick Glance
                </div>
                <h3 className="text-lg font-bold text-ink mb-2">2-Minute Concept Overview</h3>
                <p className="text-xs text-ink-muted mb-4 leading-relaxed">
                  High-level bullet points, core definitions, and overarching context. Perfect for before-class prep or a fast morning brush-up.
                </p>
                <div className="p-3 bg-gray-50 rounded-xl border border-edge text-xs space-y-1 text-ink-secondary">
                  <p className="font-semibold text-ink">&bull; Normalization Goal:</p>
                  <p className="text-[11px] text-ink-muted">Eliminate anomalies (insert, update, delete) and prevent redundant storage.</p>
                </div>
              </div>
            </div>

            {/* Deep Summary */}
            <div className="bg-white p-6 rounded-2xl border-2 border-brand-600 shadow-card flex flex-col justify-between relative">
              <div className="absolute -top-3 right-6 bg-brand-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wider uppercase">
                Most Comprehensive
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 text-xs font-semibold mb-4 border border-brand-200">
                  <BookOpen className="w-3.5 h-3.5" /> Layer 2: Deep Summary
                </div>
                <h3 className="text-lg font-bold text-ink mb-2">Chapter-by-Chapter Rigor</h3>
                <p className="text-xs text-ink-muted mb-4 leading-relaxed">
                  Section-by-section breakdown with schema diagrams, step-by-step algorithms, theorem proofs, and nuance distinctions.
                </p>
                <div className="p-3 bg-brand-50/50 rounded-xl border border-brand-100 text-xs space-y-1 text-ink-secondary">
                  <p className="font-semibold text-brand-900">&bull; 3NF vs BCNF Criterion:</p>
                  <p className="text-[11px] text-brand-700">In 3NF, prime attributes are allowed on the RHS for non-superkey determinants. BCNF strictly forbids this.</p>
                </div>
              </div>
            </div>

            {/* Exam Cram */}
            <div className="bg-white p-6 rounded-2xl border border-edge shadow-card flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold mb-4 border border-purple-200">
                  <Flame className="w-3.5 h-3.5 text-purple-600" /> Layer 3: Exam Cram
                </div>
                <h3 className="text-lg font-bold text-ink mb-2">Last-Hour Recall Sheet</h3>
                <p className="text-xs text-ink-muted mb-4 leading-relaxed">
                  Ultra-dense cheat sheets, frequently-tested edge cases, formulas, common pitfalls, and examiner focus areas.
                </p>
                <div className="p-3 bg-purple-50/40 rounded-xl border border-purple-100 text-xs space-y-1 text-ink-secondary">
                  <p className="font-semibold text-purple-900">&bull; Critical Exam Pitfall:</p>
                  <p className="text-[11px] text-purple-700">Lossless join decomposition is ALWAYS guaranteed in 3NF and BCNF, but dependency preservation is NOT guaranteed in BCNF.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FORMULA & GLOSSARY EXTRACTION */}
      <section id="features" className="py-16 sm:py-24 bg-white border-b border-edge">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200">
                Automated Extraction
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-ink mt-3">
                Never lose track of a formula or technical definition
              </h2>
              <p className="text-sm sm:text-base text-ink-muted mt-4 leading-relaxed">
                PreMind AI automatically scans equations, theorems, algorithms, and technical terms, compiling them into a dedicated reference sheet you can review right before entering an exam.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-brand-50 text-brand-600 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-ink">Standalone Formula Sheet</h4>
                    <p className="text-xs text-ink-muted">Mathematical formulas and equations indexed by chapter.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-brand-50 text-brand-600 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-ink">Glossary & Definitions Index</h4>
                    <p className="text-xs text-ink-muted">Every domain acronym and term translated into clear, concise language.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-brand-50 text-brand-600 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-ink">Highlighted Topic Outlines</h4>
                    <p className="text-xs text-ink-muted">Syllabus markers indicating high-probability examination questions.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Formula Card Mockup */}
            <div className="bg-canvas p-6 rounded-2xl border border-edge shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-edge pb-3">
                <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                  <Sigma className="w-4 h-4 text-brand-600" /> Extracted Formulas: DBMS Unit 3
                </span>
                <span className="text-[10px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                  Auto-Isolated
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-edge shadow-subtle">
                <div className="flex items-center justify-between text-xs text-ink-muted mb-1">
                  <span className="font-semibold text-ink">Armstrong&apos;s Axiom: Transitivity</span>
                  <span className="text-[10px] text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded">Theorem 3.2</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-sm font-mono text-ink text-center my-2 border border-edge/60">
                  If X &rarr; Y and Y &rarr; Z, then X &rarr; Z
                </div>
                <p className="text-[11px] text-ink-muted">
                  Used for computing attribute closures and finding minimal candidate keys.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-edge shadow-subtle">
                <div className="flex items-center justify-between text-xs text-ink-muted mb-1">
                  <span className="font-semibold text-ink">Lossless Join Condition</span>
                  <span className="text-[10px] text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded">Rule 3.5</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-sm font-mono text-ink text-center my-2 border border-edge/60">
                  (R1 &cap; R2 &rarr; R1) &or; (R1 &cap; R2 &rarr; R2)
                </div>
                <p className="text-[11px] text-ink-muted">
                  The intersection must form a superkey in at least one of the decomposed tables.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FLASHCARD & QUIZ PREVIEWS */}
      <section className="py-16 sm:py-24 bg-canvas border-b border-edge">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200">
              Interactive Retention (30% PS Weight)
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink mt-3">
              Flashcards and Quizzes Built For Real Exam Recall
            </h2>
            <p className="text-sm sm:text-base text-ink-muted mt-3">
              Passive reading creates the illusion of competence. Active testing builds long-term recall.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Flashcard Preview Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-edge shadow-card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> Flashcard Set Preview
                  </span>
                  <span className="text-xs text-ink-muted">Card 4 of 42</span>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-50/60 via-purple-50/20 to-white border border-brand-200 text-center my-4 min-h-[160px] flex flex-col items-center justify-center">
                  <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-2">Question</p>
                  <p className="text-sm sm:text-base font-bold text-ink">
                    What is the essential difference between 2NF and 3NF regarding functional dependencies?
                  </p>
                </div>
                <p className="text-xs text-ink-muted text-center italic">
                  Tap to flip and reveal answer with difficulty classification.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-edge flex items-center justify-between text-xs text-ink-muted">
                <span>Spaced repetition ready</span>
                <span className="font-semibold text-brand-600">42 Cards Extracted</span>
              </div>
            </div>

            {/* Quiz Preview Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-edge shadow-card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" /> Exam Quiz Preview
                  </span>
                  <span className="text-xs text-ink-muted">Question 7 of 25</span>
                </div>

                <div className="p-5 rounded-2xl bg-gray-50 border border-edge my-4 space-y-3">
                  <p className="text-xs sm:text-sm font-semibold text-ink">
                    Given relation R(A, B, C, D) with FDs: A &rarr; B, B &rarr; C, C &rarr; D. In what normal form is R?
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-white border border-edge text-ink-secondary hover:border-brand-300 cursor-pointer">
                      A) First Normal Form (1NF) only
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 font-medium flex items-center justify-between">
                      <span>B) Second Normal Form (2NF)</span>
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-edge text-ink-secondary hover:border-brand-300 cursor-pointer">
                      C) Third Normal Form (3NF)
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-edge text-ink-secondary hover:border-brand-300 cursor-pointer">
                      D) Boyce-Codd Normal Form (BCNF)
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-edge flex items-center justify-between text-xs text-ink-muted">
                <span>Instant diagnostic breakdown</span>
                <span className="font-semibold text-amber-600">25 Questions Generated</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. EXPORT PREVIEW */}
      <section className="py-16 sm:py-24 bg-white border-b border-edge">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200">
            Export Anywhere
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-ink mt-3">
            Take your study notes offline or to your favorite app
          </h2>
          <p className="text-sm sm:text-base text-ink-muted max-w-2xl mx-auto mt-3 mb-10">
            Export study sheets seamlessly in exam-grade printable PDF, Markdown for Notion/Obsidian, or share study links directly with study groups.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="p-4 rounded-xl bg-canvas border border-edge flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-white border border-edge text-brand-600">
                <Printer className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-ink">Print-Ready PDF</p>
                <p className="text-[11px] text-ink-muted">Clean margins, no wasted paper</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-canvas border border-edge flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-white border border-edge text-emerald-600">
                <Download className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-ink">Markdown (.md)</p>
                <p className="text-[11px] text-ink-muted">Obsidian, Notion, Logseq</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-canvas border border-edge flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-white border border-edge text-purple-600">
                <Share2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-ink">Collaborative Share</p>
                <p className="text-[11px] text-ink-muted">Study group live access</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION */}
      <section className="py-20 bg-gradient-to-br from-brand-900 via-brand-800 to-violet-950 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-7 h-7 text-brand-200" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            Ready to master your syllabus in record time?
          </h2>
          <p className="text-base sm:text-lg text-brand-200 max-w-xl mx-auto mb-8">
            Upload your lecture slides or notes right now and experience the PreMind AI study transformation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/upload')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="bg-white text-brand-900 hover:bg-brand-50 border-none font-bold"
            >
              Transform My Material Now
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => navigate('/signup')}
              className="text-white hover:bg-white/10 hover:text-white border border-white/20"
            >
              Create Free Account
            </Button>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="py-12 bg-white border-t border-edge text-xs text-ink-muted">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-brand-600 text-white flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-ink">PreMind AI</span>
            <span>&bull; Hackathon E-03 EdTech & Smart Learning</span>
          </div>
          <p>&copy; {new Date().getFullYear()} PreMind AI. Turn any textbook into exam-ready knowledge.</p>
        </div>
      </footer>
    </div>
  );
};
