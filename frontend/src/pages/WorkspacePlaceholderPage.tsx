import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowLeft,
  BookOpen,
  Layers,
  HelpCircle,
  FileText,
  Sigma,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../services/api';
import { Material } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';

export const WorkspacePlaceholderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [material, setMaterial] = useState<Material | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterial = async () => {
      if (!id) return;
      try {
        const res = await api.materials.getById(id);
        setMaterial(res.data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Material not found.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaterial();
  }, [id]);

  if (isLoading) {
    return <LoadingState fullPage title="Opening Study Workspace..." description="Loading generated summaries and datasets" />;
  }

  if (error || !material) {
    return (
      <ErrorState
        fullPage
        title="Workspace Not Found"
        message={error || 'Could not find the requested study material.'}
        retryLabel="Return to Dashboard"
        onRetry={() => navigate('/dashboard')}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Top back navigation */}
      <div>
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink mb-3 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded border border-edge">
                {material.fileType}
              </span>
              <Badge variant="brand" size="sm">
                {material.difficulty} Level
              </Badge>
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Ready
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
              {material.title}
            </h1>
            <p className="text-xs text-ink-muted mt-1">
              {material.pages} pages &bull; {material.subject} &bull; Uploaded {new Date(material.uploadDate).toLocaleDateString()}
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/upload')}
          >
            Upload Another File
          </Button>
        </div>
      </div>

      {/* Notice Banner for Phase 1 */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-50 via-purple-50 to-white border border-brand-200">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-brand-600 text-white flex-shrink-0 shadow-subtle">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-ink">
              PreMind AI Study Material Prepared Successfully
            </h3>
            <p className="text-xs text-ink-muted mt-1 leading-relaxed">
              Phase 1 foundation is complete! In Phase 2, this workspace will unlock the interactive 3-tier summary viewer (Quick Glance, Deep Summary, Exam Cram), formula equations, flashcard drills, and adaptive testing.
            </p>
          </div>
        </div>
      </div>

      {/* Material Metrics Preview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-edge shadow-subtle text-center">
          <BookOpen className="w-5 h-5 text-brand-600 mx-auto mb-1.5" />
          <p className="text-xl font-bold text-ink">{material.chapterCount}</p>
          <p className="text-xs text-ink-muted">Chapters Extracted</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-edge shadow-subtle text-center">
          <Sigma className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
          <p className="text-xl font-bold text-ink">{material.formulaCount}</p>
          <p className="text-xs text-ink-muted">Formulas Isolated</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-edge shadow-subtle text-center">
          <Layers className="w-5 h-5 text-purple-600 mx-auto mb-1.5" />
          <p className="text-xl font-bold text-ink">{material.flashcardCount}</p>
          <p className="text-xs text-ink-muted">Flashcards Prepared</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-edge shadow-subtle text-center">
          <HelpCircle className="w-5 h-5 text-amber-600 mx-auto mb-1.5" />
          <p className="text-xl font-bold text-ink">{material.quizCount}</p>
          <p className="text-xs text-ink-muted">Quiz Questions</p>
        </div>
      </div>

      {/* Extracted Sections Preview */}
      <div className="bg-white rounded-2xl border border-edge p-6 shadow-card space-y-4">
        <h3 className="text-sm font-bold text-ink flex items-center gap-2">
          <FileText className="w-4 h-4 text-brand-600" /> Prepared Study Modules
        </h3>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-gray-50 border border-edge flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-ink">1. Quick Glance Summary</h4>
              <p className="text-[11px] text-ink-muted">Key concepts, high-yield bullet points, 2-minute overview</p>
            </div>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Ready
            </span>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-edge flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-ink">2. Deep Chapter Breakdown</h4>
              <p className="text-[11px] text-ink-muted">In-depth technical explanations, schema proofs, theorem details</p>
            </div>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Ready
            </span>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-edge flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-ink">3. Exam Cram Cheat Sheet</h4>
              <p className="text-[11px] text-ink-muted">High-priority formulas, exam traps, edge-case memory triggers</p>
            </div>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Ready
            </span>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button variant="primary" size="md" onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
