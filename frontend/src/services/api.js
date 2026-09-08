import axios from 'axios';
import {
  api as baseApi,
  apiClient,
  uploadDocument,
  getDocuments,
  getSummary,
  getFlashcards,
  getQuiz,
  getHealth,
} from './api.ts';

// Combine axios instance with sub-services
const api = Object.assign(apiClient, baseApi, {
  uploadDocument,
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
  getDocuments,
  getSummary,
  getFlashcards,
  getQuiz,
  getHealth,
};

export default api;
