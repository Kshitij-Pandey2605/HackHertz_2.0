import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Download,
  Printer,
  FileText,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Share2,
  Copy,
  Check,
  Zap,
  Sigma,
  BookMarked,
  BookOpen,
} from 'lucide-react';
import { api } from '../../services/api';
import { ExportContent } from '../../types';
import { Button } from '../../components/ui/Button';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { useToast } from '../../contexts/ToastContext';

export const ExportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [content, setContent] = useState<ExportContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Download loading states
  const [isDownloadingMd, setIsDownloadingMd] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const loadExportData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const res = await api.export.getExportData(id);
        setContent(res.data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to prepare study sheet export.');
      } finally {
        setIsLoading(false);
      }
    };

    loadExportData();
  }, [id]);

  const handleDownloadMarkdown = async () => {
    if (!id) return;
    setIsDownloadingMd(true);
    try {
      const res = await api.export.downloadMarkdown(id);
      showToast(`Downloaded: ${res.data.filename}`, 'success');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Download failed', 'error');
    } finally {
      setIsDownloadingMd(false);
    }
  };

  const handlePrint = async () => {
    if (!id) return;
    setIsPrinting(true);
    try {
      await api.export.downloadPdf(id);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Print initialization failed', 'error');
    } finally {
      setIsPrinting(false);
    }
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    showToast('Shareable study link copied to clipboard!', 'success');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (isLoading) {
    return (
      <LoadingState
        fullPage
        title="Compiling Study Sheet..."
        description="Formatting Quick Glance, Deep Summaries, Formulas, and Cram notes into print-ready format"
      />
    );
  }

  if (error || !content) {
    return (
      <ErrorState
        fullPage
        title="Export Sheet Unavailable"
        message={error || 'Could not compile revision sheet for this material.'}
        retryLabel="Return to Workspace"
        onRetry={() => navigate(`/workspace/${id}`)}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Top Bar / Navigation (Hidden in print) */}
      <div className="no-print">
        <button
          type="button"
          onClick={() => navigate(`/workspace/${id}`)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink mb-3 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Study Workspace
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Export & Print Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              Export Your Study Material
            </h1>
            <p className="text-sm text-ink-muted mt-1">
              Take your revision notes anywhere: printable PDF, Markdown, or print directly.
            </p>
          </div>

          {/* Quick share button */}
          <button
            type="button"
            onClick={handleCopyShareLink}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-edge bg-white hover:bg-gray-50 text-xs font-semibold text-ink transition-colors self-start sm:self-auto shadow-subtle"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-brand-600" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share Notes'}</span>
          </button>
        </div>
      </div>

      {/* 3 Major Export Action Cards (Hidden in print) */}
      <div className="no-print grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Download PDF / Print to PDF */}
        <div className="p-5 rounded-2xl bg-white border border-edge shadow-card flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 mb-3">
              <Printer className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-ink">Print Notes / PDF</h3>
            <p className="text-xs text-ink-muted mt-1 leading-relaxed">
              Open a clean, print-safe document view. Choose &quot;Save as PDF&quot; in the dialog for an instant offline PDF.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={handlePrint}
            isLoading={isPrinting}
            leftIcon={<Printer className="w-4 h-4" />}
            className="w-full"
          >
            Print / Save as PDF
          </Button>
        </div>

        {/* 2. Download Markdown */}
        <div className="p-5 rounded-2xl bg-white border border-edge shadow-card flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 mb-3">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-ink">Download Markdown</h3>
            <p className="text-xs text-ink-muted mt-1 leading-relaxed">
              Save your notes in clean GitHub Flavored Markdown (.md) for Obsidian, Notion, Logseq, or VS Code.
            </p>
          </div>
          <Button
            variant="secondary"
            size="md"
            onClick={handleDownloadMarkdown}
            isLoading={isDownloadingMd}
            leftIcon={<Download className="w-4 h-4" />}
            className="w-full"
          >
            Download .md File
          </Button>
        </div>

        {/* 3. Quick Copy Study Sheet */}
        <div className="p-5 rounded-2xl bg-white border border-edge shadow-card flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-3">
              <Copy className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-ink">Copy Raw Text</h3>
            <p className="text-xs text-ink-muted mt-1 leading-relaxed">
              Copy the compiled revision sheet directly to your system clipboard for fast pasting into word docs.
            </p>
          </div>
          <Button
            variant="secondary"
            size="md"
            onClick={() => {
              const md = api.export.generateMarkdownContent(content);
              navigator.clipboard.writeText(md);
              showToast('Full study sheet copied to clipboard!', 'success');
            }}
            leftIcon={<Copy className="w-4 h-4" />}
            className="w-full"
          >
            Copy to Clipboard
          </Button>
        </div>
      </div>

      {/* DOCUMENT PREVIEW CONTAINER (This is printed!) */}
      <div className="space-y-3">
        <div className="no-print flex items-center justify-between">
          <h3 className="text-xs font-bold text-ink-muted uppercase tracking-wider">
            Document Export Preview
          </h3>
          <span className="text-[11px] text-ink-muted">
            Formatted in document typography &bull; Print-safe margins
          </span>
        </div>

        {/* Printed Document Sheet */}
        <article className="print-page bg-white border border-edge rounded-3xl p-8 sm:p-14 shadow-card space-y-10 text-ink leading-relaxed">
          {/* Document Header */}
          <div className="border-b-2 border-ink/80 pb-6 space-y-2">
            <div className="flex items-center justify-between text-xs text-ink-muted">
              <span>PREMIND AI &bull; SMART STUDY MATERIAL SUMMARIZER</span>
              <span>{content.date}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
              {content.materialTitle}
            </h1>
            <p className="text-xs font-semibold text-ink-secondary">
              Subject: {content.subject} &bull; Generated from Lecture & Textbook Source
            </p>
          </div>

          {/* 1. Quick Glance */}
          <section className="space-y-3 avoid-break-inside">
            <h2 className="text-lg font-bold text-ink flex items-center gap-2 border-b border-edge pb-1.5">
              <span className="w-5 h-5 rounded-md bg-brand-600 text-white flex items-center justify-center text-xs">
                1
              </span>
              <span>Quick Glance Summary</span>
            </h2>
            <p className="text-sm text-ink-secondary leading-relaxed bg-canvas p-4 rounded-xl border border-edge">
              {content.quickGlance}
            </p>
          </section>

          {/* 2. Key Concepts */}
          <section className="space-y-3 avoid-break-inside">
            <h2 className="text-lg font-bold text-ink flex items-center gap-2 border-b border-edge pb-1.5">
              <span className="w-5 h-5 rounded-md bg-brand-600 text-white flex items-center justify-center text-xs">
                2
              </span>
              <span>Core Key Concepts</span>
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-ink-secondary">
              {content.keyConcepts.map((concept, idx) => (
                <li
                  key={idx}
                  className="p-3 rounded-xl border border-edge/80 bg-white flex items-start gap-2"
                >
                  <span className="text-brand-600 font-bold">•</span>
                  <span>{concept}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 3. Deep Summary */}
          <section className="space-y-3 avoid-break-inside">
            <h2 className="text-lg font-bold text-ink flex items-center gap-2 border-b border-edge pb-1.5">
              <span className="w-5 h-5 rounded-md bg-brand-600 text-white flex items-center justify-center text-xs">
                3
              </span>
              <span>Deep Technical Summary</span>
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed bg-canvas p-4 rounded-xl border border-edge">
              {content.deepSummary}
            </p>
          </section>

          {/* 4. Formulas / Rules */}
          <section className="space-y-3 avoid-break-inside page-break-before">
            <h2 className="text-lg font-bold text-ink flex items-center gap-2 border-b border-edge pb-1.5">
              <span className="w-5 h-5 rounded-md bg-brand-600 text-white flex items-center justify-center text-xs">
                4
              </span>
              <span>Formulas & Decomposition Rules</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {content.formulas.map((f, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-edge bg-white space-y-2">
                  <h4 className="text-xs font-bold text-ink">{f.name}</h4>
                  <div className="p-2 rounded bg-gray-100 font-mono text-xs text-ink text-center">
                    {f.formula}
                  </div>
                  <p className="text-[11px] text-ink-muted">{f.explanation}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Glossary of Definitions */}
          <section className="space-y-3 avoid-break-inside">
            <h2 className="text-lg font-bold text-ink flex items-center gap-2 border-b border-edge pb-1.5">
              <span className="w-5 h-5 rounded-md bg-brand-600 text-white flex items-center justify-center text-xs">
                5
              </span>
              <span>Glossary of Definitions</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {content.glossary.map((g, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-edge bg-canvas">
                  <span className="font-bold text-ink block mb-0.5">{g.term}</span>
                  <span className="text-ink-muted text-[11px]">{g.definition}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 6. Exam Cram Sheet */}
          <section className="space-y-3 avoid-break-inside">
            <h2 className="text-lg font-bold text-ink flex items-center gap-2 border-b border-edge pb-1.5">
              <span className="w-5 h-5 rounded-md bg-brand-600 text-white flex items-center justify-center text-xs">
                6
              </span>
              <span>Exam Cram Last-Hour Checklist</span>
            </h2>
            <div className="space-y-2 text-xs">
              {content.examCram.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-purple-200 bg-purple-50/40 text-purple-950 flex items-start gap-2.5 font-medium"
                >
                  <span className="w-4 h-4 rounded border border-purple-400 flex items-center justify-center text-[10px] mt-0.5">
                    ✓
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Print Document Footer */}
          <footer className="pt-6 border-t border-edge flex items-center justify-between text-[11px] text-ink-muted">
            <span>PreMind AI &bull; Smart Study Material Summarizer</span>
            <span>Turn any textbook into exam-ready knowledge</span>
          </footer>
        </article>
      </div>
    </div>
  );
};
