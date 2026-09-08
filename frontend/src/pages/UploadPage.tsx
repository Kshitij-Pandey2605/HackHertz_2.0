import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ArrowLeft, ShieldCheck, Zap } from 'lucide-react';
import { DifficultyLevel } from '../types';
import { api } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { FileUpload } from '../components/upload/FileUpload';
import { FileCard } from '../components/upload/FileCard';
import { DifficultySelector } from '../components/upload/DifficultySelector';
import { Button } from '../components/ui/Button';

export const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('MEDIUM');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { error: toastError, success: toastSuccess } = useToast();

  const handleFileSelect = (selectedFile: File) => {
    setError(null);
    setFile(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
  };

  const handleReplaceFile = () => {
    const input = document.getElementById('file-upload-input') as HTMLInputElement;
    if (input) {
      input.click();
    }
  };

  const handleGenerate = async () => {
    if (!file) {
      setError('Please upload or drag-and-drop a study material document first.');
      toastError('Please attach a study document first.', 'Missing File');
      return;
    }

    if (!difficulty) {
      setError('Please choose a learning difficulty level.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const response = await api.materials.uploadMaterial(file, difficulty);
      toastSuccess('Document uploaded! Starting AI transformation.', 'Upload Complete');
      navigate(`/processing/${response.data.job.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      setError(msg);
      toastError(msg, 'Upload Failed');
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header with navigation back to dashboard */}
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
              Transform textbooks, lecture slides, or class notes into structured summaries, formulas & quizzes.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-medium text-brand-700 bg-brand-50 px-3 py-1.5 rounded-xl border border-brand-200">
            <Zap className="w-3.5 h-3.5 text-brand-600" />
            <span>AI Summarizer Pipeline</span>
          </div>
        </div>
      </div>

      {/* Upload Box / File Card */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-ink">1. Attach Document</h3>
        {!file ? (
          <FileUpload onFileSelect={handleFileSelect} error={error} />
        ) : (
          <div className="space-y-2">
            <FileCard
              file={file}
              onRemove={handleRemoveFile}
              onReplace={handleReplaceFile}
            />
            {/* Hidden input for replace functionality */}
            <input
              id="file-upload-input"
              type="file"
              accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.md"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
              className="hidden"
            />
          </div>
        )}
      </div>

      {/* 2. Choose Your Learning Level (PS 20% Adaptive Level concept) */}
      <div className="pt-2">
        <h3 className="text-base font-semibold text-ink mb-1">2. Target Depth</h3>
        <DifficultySelector
          selectedLevel={difficulty}
          onSelectLevel={(level) => setDifficulty(level)}
        />
      </div>

      {/* Trust & processing notes */}
      <div className="p-4 rounded-xl bg-gray-50 border border-edge/80 flex items-start gap-3 text-xs text-ink-muted">
        <ShieldCheck className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
        <p>
          Your documents are parsed securely in private memory. Equations, theorems, diagrams, and section headings will be extracted into Quick Glance, Deep Summary, Exam Cram, Flashcards, and Adaptive Quiz questions.
        </p>
      </div>

      {/* Generate CTA Button */}
      <div className="pt-4 border-t border-edge flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-ink-muted text-center sm:text-left">
          {file ? (
            <span className="text-ink font-medium">
              Ready to generate for &ldquo;{file.name}&rdquo; ({difficulty} level)
            </span>
          ) : (
            <span>Please select a file to enable generation</span>
          )}
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={handleGenerate}
          disabled={!file || isUploading}
          isLoading={isUploading}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          leftIcon={<Sparkles className="w-4 h-4" />}
          className="w-full sm:w-auto shadow-elevated"
        >
          Generate Study Material
        </Button>
      </div>
    </div>
  );
};
