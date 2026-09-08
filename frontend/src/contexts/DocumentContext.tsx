import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  uploadDocument as apiUploadDocument,
  getDocuments as apiGetDocuments,
  getSummary as apiGetSummary,
  getFlashcards as apiGetFlashcards,
  getQuiz as apiGetQuiz,
} from '../services/api';
import {
  BackendDocument,
  BackendSummary,
  BackendFlashcard,
  BackendQuiz,
  UploadResponse,
} from '../types';

interface DocumentContextType {
  currentDocumentId: string | null;
  setCurrentDocumentId: (id: string | null) => void;
  uploadedDocuments: BackendDocument[];
  currentDocument: BackendDocument | null;
  summary: BackendSummary | null;
  flashcards: BackendFlashcard[];
  quiz: BackendQuiz | null;
  loading: boolean;
  error: string | null;
  uploadPDF: (file: File) => Promise<UploadResponse>;
  fetchDocuments: () => Promise<BackendDocument[]>;
  fetchSummary: (docId?: string) => Promise<BackendSummary | null>;
  fetchFlashcards: (docId?: string) => Promise<BackendFlashcard[]>;
  fetchQuiz: (docId?: string) => Promise<BackendQuiz | null>;
}

const DocumentContext = createContext<DocumentContextType | null>(null);

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentDocumentId, setCurrentDocumentIdState] = useState<string | null>(() => {
    return localStorage.getItem('premind_current_doc_id') || null;
  });
  const [uploadedDocuments, setUploadedDocuments] = useState<BackendDocument[]>([]);
  const [currentDocument, setCurrentDocument] = useState<BackendDocument | null>(null);
  const [summary, setSummary] = useState<BackendSummary | null>(null);
  const [flashcards, setFlashcards] = useState<BackendFlashcard[]>([]);
  const [quiz, setQuiz] = useState<BackendQuiz | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const setCurrentDocumentId = (id: string | null) => {
    setCurrentDocumentIdState(id);
    if (id) {
      localStorage.setItem('premind_current_doc_id', id);
    } else {
      localStorage.removeItem('premind_current_doc_id');
    }
  };

  // Fetch all documents from backend
  const fetchDocuments = useCallback(async (): Promise<BackendDocument[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiGetDocuments();
      if (response.success) {
        setUploadedDocuments(response.documents || []);
      }
      return response.documents || [];
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load documents';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Upload PDF document
  const uploadPDF = async (file: File): Promise<UploadResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiUploadDocument(file);
      if (response.success) {
        const newDocId = response.documentId;
        setCurrentDocumentId(newDocId);

        const newDoc: BackendDocument = {
          id: response.documentId,
          file_name: response.fileName,
          file_url: response.fileUrl,
          uploaded_at: new Date().toISOString(),
        };
        setUploadedDocuments((prev) => [newDoc, ...prev]);
        setCurrentDocument(newDoc);
        return response;
      }
      throw new Error((response as unknown as { error?: string }).error || 'Upload failed');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload PDF document';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch summary for document
  const fetchSummary = useCallback(async (docId?: string): Promise<BackendSummary | null> => {
    const id = docId || currentDocumentId;
    if (!id) return null;

    setLoading(true);
    setError(null);
    try {
      const response = await apiGetSummary(id);
      if (response.success) {
        setSummary(response.summary);
        return response.summary;
      }
      throw new Error((response as unknown as { error?: string }).error || 'Failed to load summary');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load summary';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentDocumentId]);

  // Fetch flashcards for document
  const fetchFlashcards = useCallback(async (docId?: string): Promise<BackendFlashcard[]> => {
    const id = docId || currentDocumentId;
    if (!id) return [];

    setLoading(true);
    setError(null);
    try {
      const response = await apiGetFlashcards(id);
      if (response.success) {
        setFlashcards(response.flashcards || []);
        return response.flashcards || [];
      }
      throw new Error((response as unknown as { error?: string }).error || 'Failed to load flashcards');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load flashcards';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentDocumentId]);

  // Fetch quiz for document
  const fetchQuiz = useCallback(async (docId?: string): Promise<BackendQuiz | null> => {
    const id = docId || currentDocumentId;
    if (!id) return null;

    setLoading(true);
    setError(null);
    try {
      const response = await apiGetQuiz(id);
      if (response.success) {
        setQuiz(response.quiz);
        return response.quiz;
      }
      throw new Error((response as unknown as { error?: string }).error || 'Failed to load quiz');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load quiz';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentDocumentId]);

  // Initial load
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const value = {
    currentDocumentId,
    setCurrentDocumentId,
    uploadedDocuments,
    currentDocument,
    summary,
    flashcards,
    quiz,
    loading,
    error,
    uploadPDF,
    fetchDocuments,
    fetchSummary,
    fetchFlashcards,
    fetchQuiz,
  };

  return <DocumentContext.Provider value={value}>{children}</DocumentContext.Provider>;
};

export const useDocument = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocument must be used within a DocumentProvider');
  }
  return context;
};

export default DocumentContext;
