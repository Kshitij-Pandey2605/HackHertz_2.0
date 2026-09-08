import React from 'react';
import { FileText, Trash2, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';

export interface FileCardProps {
  file: File;
  onRemove: () => void;
  onReplace: () => void;
}

export const FileCard: React.FC<FileCardProps> = ({ file, onRemove, onReplace }) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileExtension = (name: string): string => {
    return name.split('.').pop()?.toUpperCase() || 'FILE';
  };

  return (
    <Card className="p-4 sm:p-5 border-edge bg-white">
      <div className="flex items-center justify-between gap-4">
        {/* File icon and info */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 flex-shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-ink truncate">{file.name}</h4>
              <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200 uppercase flex-shrink-0">
                {getFileExtension(file.name)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-ink-muted mt-0.5">
              <span>{formatFileSize(file.size)}</span>
              <span>&bull;</span>
              <span className="text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 inline" /> Ready for processing
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={onReplace}
            className="flex items-center gap-1 text-xs font-medium text-ink-secondary hover:text-ink hover:bg-gray-100 px-2.5 py-1.5 rounded-lg border border-edge transition-colors"
            title="Choose different file"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Replace</span>
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200 transition-colors"
            title="Remove file"
            aria-label="Remove file"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Remove</span>
          </button>
        </div>
      </div>
    </Card>
  );
};
