import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';

export interface FileUploadProps {
  onFileSelect: (file: File) => void;
  maxSizeBytes?: number; // default 50MB
  error?: string | null;
}

const SUPPORTED_FORMATS = [
  { label: 'PDF', ext: '.pdf' },
  { label: 'PPT / PPTX', ext: '.ppt,.pptx' },
  { label: 'DOC / DOCX', ext: '.doc,.docx' },
  { label: 'Notes', ext: '.txt,.md' },
];

const ACCEPT_STRING = '.pdf,.ppt,.pptx,.doc,.docx,.txt,.md';

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  maxSizeBytes = 50 * 1024 * 1024, // 50MB
  error,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcessFile = (file: File) => {
    setInternalError(null);

    // Size validation
    if (file.size > maxSizeBytes) {
      const maxMb = maxSizeBytes / (1024 * 1024);
      setInternalError(`File is too large. Maximum allowed size is ${maxMb}MB.`);
      return;
    }

    // Extension validation
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    const validExtensions = ['.pdf', '.ppt', '.pptx', '.doc', '.docx', '.txt', '.md'];
    if (!validExtensions.includes(ext)) {
      setInternalError(
        'Unsupported file format. Please upload a PDF, PPT, PPTX, DOC, DOCX, or text notes.'
      );
      return;
    }

    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const currentError = error || internalError;

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-8 sm:p-12 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer bg-white ${
          isDragOver
            ? 'border-brand-600 bg-brand-50/40 ring-4 ring-brand-500/10'
            : currentError
            ? 'border-rose-300 bg-rose-50/30'
            : 'border-edge hover:border-brand-400 hover:bg-gray-50/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPT_STRING}
          onChange={handleInputChange}
          className="hidden"
          id="file-upload-input"
        />

        {/* Upload Icon */}
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform ${
            isDragOver
              ? 'scale-110 bg-brand-100 text-brand-600'
              : 'bg-brand-50 text-brand-600'
          }`}
        >
          <UploadCloud className="w-8 h-8" />
        </div>

        {/* Main Prompts */}
        <h3 className="text-base sm:text-lg font-semibold text-ink text-center mb-1">
          {isDragOver ? 'Drop your document right here' : 'Drag and drop your study material'}
        </h3>
        <p className="text-sm text-ink-muted text-center max-w-md mb-5">
          Upload any lecture slides, textbook chapters, or handwritten note exports. Maximum size: 50MB.
        </p>

        {/* Browse Button */}
        <Button
          type="button"
          variant="secondary"
          size="md"
          leftIcon={<FileText className="w-4 h-4" />}
          className="pointer-events-none"
        >
          Browse Files
        </Button>

        {/* Supported Formats Badges */}
        <div className="mt-6 pt-5 border-t border-edge/80 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-ink-subtle mr-1">Supported formats:</span>
          {SUPPORTED_FORMATS.map((fmt) => (
            <span
              key={fmt.label}
              className="text-[11px] font-semibold text-ink-secondary bg-gray-100 px-2 py-0.5 rounded-md border border-edge"
            >
              {fmt.label}
            </span>
          ))}
        </div>
      </div>

      {currentError && (
        <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium animate-fadeIn">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{currentError}</span>
        </div>
      )}
    </div>
  );
};
