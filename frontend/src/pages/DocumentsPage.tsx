import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  UploadCloud,
  Calendar,
  ExternalLink,
  BookOpen,
  Layers,
  HelpCircle,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { useDocument } from '../contexts/DocumentContext';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';

export const DocumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { uploadedDocuments, fetchDocuments, loading, error, setCurrentDocumentId } = useDocument();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDocuments();
    setRefreshing(false);
  };

  const handleViewDocument = (docId: string) => {
    setCurrentDocumentId(docId);
    navigate(`/workspace/${docId}`);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  if (loading && uploadedDocuments.length === 0) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto animate-fadeIn">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-6 bg-white border border-edge rounded-2xl space-y-4 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-gray-200" />
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
              <div className="h-10 bg-gray-100 rounded-xl w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && uploadedDocuments.length === 0) {
    return (
      <ErrorState
        title="Failed to load documents"
        message={error}
        onRetry={handleRefresh}
      />
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink flex items-center gap-2">
            My Study Documents
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            Browse all uploaded PDF materials and open study workspaces.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="md"
            onClick={handleRefresh}
            isLoading={refreshing}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/upload')}
            leftIcon={<UploadCloud className="w-4 h-4" />}
            className="shadow-subtle"
          >
            Upload PDF
          </Button>
        </div>
      </div>

      {/* Documents Grid / Empty State */}
      {uploadedDocuments.length === 0 ? (
        <EmptyState
          title="No uploaded documents found"
          description="Upload your first textbook, lecture note, or PDF slide deck to generate instant summaries, flashcards, and quizzes."
          actionLabel="Upload PDF Document"
          onAction={() => navigate('/upload')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {uploadedDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-white border border-edge rounded-2xl p-6 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-brand-50 text-brand-600 border border-brand-100 group-hover:scale-105 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold text-ink-muted bg-gray-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(doc.uploaded_at)}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-ink text-base leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors">
                    {doc.file_name}
                  </h3>
                  <p className="text-xs text-ink-muted mt-1 flex items-center gap-1.5 font-mono">
                    <Clock className="w-3 h-3 text-ink-muted" /> ID: {doc.id.slice(0, 8)}...
                  </p>
                </div>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded flex items-center gap-1">
                    <BookOpen className="w-2.5 h-2.5" /> Summary
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                    <Layers className="w-2.5 h-2.5" /> Flashcards
                  </span>
                  <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded flex items-center gap-1">
                    <HelpCircle className="w-2.5 h-2.5" /> Quiz
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-5 mt-4 border-t border-edge flex items-center gap-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleViewDocument(doc.id)}
                  rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                  className="flex-1 font-semibold"
                >
                  View Workspace
                </Button>

                {doc.file_url && (
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl border border-edge text-ink-muted hover:text-brand-600 hover:bg-brand-50 transition-colors"
                    title="Open Original PDF"
                  >
                    <FileText className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
