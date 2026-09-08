import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  uploadDocument as apiUploadDocument,
  getDocuments as apiGetDocuments,
  getSummary as apiGetSummary,
  getFlashcards as apiGetFlashcards,
  getQuiz as apiGetQuiz,
} from '../services/api';

const DocumentContext = createContext(null);

export const DocumentProvider = ({ children }) => {
  const [currentDocumentId, setCurrentDocumentIdState] = useState(() => {
    return localStorage.getItem('premind_current_doc_id') || null;
  });
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [summary, setSummary] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const setCurrentDocumentId = (id) => {
    setCurrentDocumentIdState(id);
    if (id) {
      localStorage.setItem('premind_current_doc_id', id);
    } else {
      localStorage.removeItem('premind_current_doc_id');
    }
  };

  // Fetch all documents from backend
  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiGetDocuments();
      if (response.success) {
        setUploadedDocuments(response.documents || []);
      }
      return response.documents || [];
    } catch (err) {
      const message = err.message || 'Failed to load documents';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Upload PDF document
  const uploadPDF = async (file) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiUploadDocument(file);
      if (response.success) {
        const newDocId = response.documentId;
        setCurrentDocumentId(newDocId);

        // Prepend to local documents list
        const newDoc = {
          id: response.documentId,
          file_name: response.fileName,
          file_url: response.fileUrl,
          uploaded_at: new Date().toISOString(),
        };
        setUploadedDocuments((prev) => [newDoc, ...prev]);
        setCurrentDocument(newDoc);
        return response;
      }
      throw new Error(response.error || 'Upload failed');
    } catch (err) {
      const message = err.message || 'Failed to upload PDF document';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch summary for document
  const fetchSummary = useCallback(async (docId) => {
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
      throw new Error(response.error || 'Failed to load summary');
    } catch (err) {
      const message = err.message || 'Failed to load summary';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentDocumentId]);

  // Fetch flashcards for document
  const fetchFlashcards = useCallback(async (docId) => {
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
      throw new Error(response.error || 'Failed to load flashcards');
    } catch (err) {
      const message = err.message || 'Failed to load flashcards';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentDocumentId]);

  // Fetch quiz for document
  const fetchQuiz = useCallback(async (docId) => {
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
      throw new Error(response.error || 'Failed to load quiz');
    } catch (err) {
      const message = err.message || 'Failed to load quiz';
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
