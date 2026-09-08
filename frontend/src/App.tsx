import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { DocumentProvider } from './contexts/DocumentContext';
import { ProtectedRoute } from './components/routing/ProtectedRoute';

// Layouts
import { AppLayout } from './components/layout/AppLayout';
import { PublicLayout } from './components/layout/PublicLayout';
import { WorkspaceLayout } from './components/workspace/WorkspaceLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { UploadPage } from './pages/UploadPage';
import { SummaryPage } from './pages/SummaryPage';
import { ProcessingPage } from './pages/ProcessingPage';

// Workspace Views
import { WorkspaceOverviewPage } from './pages/workspace/WorkspaceOverviewPage';
import { QuickGlanceView } from './pages/workspace/QuickGlanceView';
import { DeepSummaryView } from './pages/workspace/DeepSummaryView';
import { ExamCramView } from './pages/workspace/ExamCramView';
import { ChaptersView } from './pages/workspace/ChaptersView';
import { KeyPointsView } from './pages/workspace/KeyPointsView';
import { FormulasView } from './pages/workspace/FormulasView';
import { GlossaryView } from './pages/workspace/GlossaryView';
import { FlashcardsView } from './pages/workspace/FlashcardsView';

// Assessment & Export Views
import { QuizSetupPage } from './pages/quiz/QuizSetupPage';
import { QuizPage } from './pages/quiz/QuizPage';
import { QuizResultsPage } from './pages/quiz/QuizResultsPage';
import { ExportPage } from './pages/export/ExportPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <DocumentProvider>
            <Routes>
              {/* Public Landing Page */}
              <Route path="/" element={<LandingPage />} />

              {/* Public Auth Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              </Route>

              {/* Protected General Routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/documents" element={<DocumentsPage />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/processing/:id" element={<ProcessingPage />} />
              </Route>

              {/* Direct Route Endpoints */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/summary/:documentId" element={<SummaryPage />} />
                <Route path="/document/:id" element={<WorkspaceOverviewPage />} />
              </Route>

              {/* Dedicated Workspace Study Shell */}
              <Route
                element={
                  <ProtectedRoute>
                    <WorkspaceLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/workspace/:id" element={<WorkspaceOverviewPage />} />
                <Route path="/workspace/:id/summary" element={<SummaryPage />} />
                <Route path="/workspace/:id/quick-glance" element={<QuickGlanceView />} />
                <Route path="/workspace/:id/deep-summary" element={<DeepSummaryView />} />
                <Route path="/workspace/:id/exam-cram" element={<ExamCramView />} />
                <Route path="/workspace/:id/chapters" element={<ChaptersView />} />
                <Route path="/workspace/:id/key-points" element={<KeyPointsView />} />
                <Route path="/workspace/:id/formulas" element={<FormulasView />} />
                <Route path="/workspace/:id/glossary" element={<GlossaryView />} />
                <Route path="/workspace/:id/flashcards" element={<FlashcardsView />} />
                {/* Assessment & Export */}
                <Route path="/workspace/:id/quiz/setup" element={<QuizSetupPage />} />
                <Route path="/workspace/:id/quiz" element={<QuizPage />} />
                <Route path="/workspace/:id/quiz/results" element={<QuizResultsPage />} />
                <Route path="/workspace/:id/export" element={<ExportPage />} />

                {/* Support /flashcards/:documentId and /quiz/:documentId directly */}
                <Route path="/flashcards/:documentId" element={<FlashcardsView />} />
                <Route path="/quiz/:documentId" element={<QuizPage />} />
              </Route>

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </DocumentProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
