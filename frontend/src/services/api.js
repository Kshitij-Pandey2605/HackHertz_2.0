import axios from 'axios';
import {
  api as baseApi,
  apiClient,
  uploadDocument,
  uploadMultipleDocuments,
  getDocuments,
  getSummary,
  getFlashcards,
  getQuiz,
  getHealth,
} from './api.ts';

// Combine axios instance with sub-services
const api = Object.assign(apiClient, baseApi, {
  uploadDocument,
  uploadMultipleDocuments,
  getDocuments,
  getSummary,
  getFlashcards,
  getQuiz,
  getHealth,
});

export {
  api,
  apiClient,
  uploadDocument,
  uploadMultipleDocuments,
  getDocuments,
  getSummary,
  getFlashcards,
  getQuiz,
  getHealth,
};

export default api;
