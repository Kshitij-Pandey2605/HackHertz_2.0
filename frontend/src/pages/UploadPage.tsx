import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Zap,
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { DifficultyLevel } from '../types';
import { useDocument } from '../contexts/DocumentContext';
import { useToast } from '../contexts/ToastContext';
import { FileUpload } from '../components/upload/FileUpload';
import { DifficultySelector } from '../components/upload/DifficultySelector';
import { Button } from '../components/ui/Button';

export const UploadPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('MEDIUM');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number; currentFileName?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { uploadMultiplePDFs } = useDocument();
  const { error: toastError, success: toastSuccess } = useToast();

  const handleFilesSelect = (selectedFiles: File[]) => {
    setError(null);
    const validPdfFiles = selectedFiles.filter(
      (f) => f.name.toLowerCase().endsWith('.pdf') || f.type === 'application/pdf'
    );

    if (validPdfFiles.length === 0) {
      const msg = 'Please select valid PDF document(s) (.pdf).';
      setError(msg);
      toastError(msg, 'Invalid File Type');
      return;
    }

    // Append without duplicates by file name + size
    setFiles((prev) => {
      const existingKeys = new Set(prev.map((f) => `${f.name}_${f.size}`));
      const newUnique = validPdfFiles.filter((f) => !existingKeys.has(`${f.name}_${f.size}`));
      return [...prev, ...newUnique];
    });
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    setFiles([]);
    setError(null);
  };

  const handleUploadAll = async () => {
    if (files.length === 0) {
      setError('Please select one or more PDF documents to upload.');
      toastError('Please attach PDF documents first.', 'Missing Files');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress({ current: 0, total: files.length, currentFileName: files[0].name });

    try {
      // Execute multi-upload via DocumentContext
      const response = await uploadMultiplePDFs(files);

      // Show success toast
      if (files.length === 1) {
        toastSuccess(
          `"${files[0].name}" has been uploaded and processed successfully!`,
          'Upload Successful'
        );
      } else {
        toastSuccess(
          `Successfully uploaded and generated workspaces for ${files.length} documents!`,
          'Bulk Upload Complete'
        );
      }

      // Navigate to Documents list or Dashboard
      navigate('/documents');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed. Please check backend connection.';
      setError(msg);
      toastError(msg, 'Upload Failed');
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const totalBytes = files.reduce((acc, f) => acc + f.size, 0);
  const totalMb = (totalBytes / (1024 * 1024)).toFixed(2);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink mb-3 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              Upload Study Material
            </h1>
            <p className="text-sm text-ink-muted mt-1">
              Upload single or multiple PDF textbooks, lecture slides, or notes to generate separate summaries, flashcards, and quizzes.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-medium text-brand-700 bg-brand-50 px-3 py-1.5 rounded-xl border border-brand-200">
            <Zap className="w-3.5 h-3.5 text-brand-600" />
            <span>Multi-PDF AI Processing</span>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-rose-600 hover:text-rose-900 font-bold ml-3"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. Upload Box */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-ink">1. Select PDF Documents</h3>
          {files.length > 0 && (
            <button
              onClick={handleClearAll}
              disabled={isUploading}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold transition-colors disabled:opacity-50"
            >
              Clear All ({files.length})
            </button>
          )}
        </div>

        {files.length === 0 ? (
          <FileUpload onFilesSelect={handleFilesSelect} error={error} multiple={true} />
        ) : (
          <div className="space-y-3">
            {/* Selected Files List */}
            <div className="bg-white rounded-2xl border border-edge shadow-card divide-y divide-edge/60 overflow-hidden">
              <div className="p-4 bg-gray-50/80 flex items-center justify-between text-xs font-semibold text-ink">
                <span>Selected Files ({files.length})</span>
                <span className="text-ink-muted">Total Size: {totalMb} MB</span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-edge/40">
                {files.map((file, idx) => (
                  <div
                    key={`${file.name}_${idx}`}
                    className="p-3.5 sm:px-4 flex items-center justify-between gap-3 hover:bg-gray-50/60 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 border border-brand-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-ink truncate">{file.name}</p>
                        <p className="text-xs text-ink-muted">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB &bull; PDF
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveFile(idx)}
                      disabled={isUploading}
                      className="p-1.5 text-ink-muted hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add more files row */}
              <div className="p-3 bg-gray-50/50 border-t border-edge flex items-center justify-between">
                <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700">
                  <Plus className="w-4 h-4" />
                  <span>Add More PDF Files</span>
                  <input
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        handleFilesSelect(Array.from(e.target.files));
                      }
                    }}
                    className="hidden"
                  />
                </label>
                <span className="text-[11px] text-ink-muted">PDF files supported</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Choose Your Learning Level */}
      <div className="pt-2">
        <h3 className="text-base font-semibold text-ink mb-1">2. Target Difficulty Level</h3>
        <DifficultySelector
          selectedLevel={difficulty}
          onSelectLevel={(level) => setDifficulty(level)}
        />
      </div>

      {/* Processing Indicator Banner during upload */}
      {isUploading && (
        <div className="p-5 rounded-2xl bg-brand-50 border border-brand-200 text-brand-900 text-xs space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between font-semibold">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
              <span>Processing and uploading {files.length} document(s)...</span>
            </div>
            <span>Generating separate workspaces</span>
          </div>
          <div className="h-2 bg-brand-200/60 rounded-full overflow-hidden">
            <div className="h-full bg-brand-600 rounded-full w-3/4 animate-pulse transition-all duration-500" />
          </div>
          <p className="text-[11px] text-brand-700">
            Each document is being stored in Supabase and analyzed for Quick Summaries, Flashcards, and Self-Assessment Quizzes.
          </p>
        </div>
      )}

      {/* Trust & Processing Notes */}
      <div className="p-4 rounded-xl bg-gray-50 border border-edge/80 flex items-start gap-3 text-xs text-ink-muted">
        <ShieldCheck className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
        <p>
          Your documents are saved securely in Supabase Storage. Each PDF generates a dedicated study workspace with separate summaries, active recall cards, and syllabus-targeted quizzes.
        </p>
      </div>

      {/* Upload CTA Button */}
      <div className="pt-4 border-t border-edge flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-ink-muted text-center sm:text-left">
          {files.length > 0 ? (
            <span className="text-ink font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {files.length} PDF file{files.length > 1 ? 's' : ''} ready for processing ({totalMb} MB)
            </span>
          ) : (
            <span>Please attach one or more PDF files to begin</span>
          )}
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={handleUploadAll}
          disabled={files.length === 0 || isUploading}
          isLoading={isUploading}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          leftIcon={<Sparkles className="w-4 h-4" />}
          className="w-full sm:w-auto shadow-elevated"
        >
          {isUploading
            ? `Uploading ${files.length} Document${files.length > 1 ? 's' : ''}...`
            : files.length > 1
            ? `Upload All (${files.length} Files)`
            : 'Upload & Generate Workspace'}
        </Button>
      </div>
    </div>
  );
};

export default UploadPage;
