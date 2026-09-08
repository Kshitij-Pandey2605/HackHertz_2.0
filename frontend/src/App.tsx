import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ProtectedRoute } from './components/routing/ProtectedRoute';

// Layouts
import { AppLayout } from './components/layout/AppLayout';
import { PublicLayout } from './components/layout/PublicLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { UploadPage } from './pages/UploadPage';
import { ProcessingPage } from './pages/ProcessingPage';
import { WorkspacePlaceholderPage } from './pages/WorkspacePlaceholderPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Public Auth Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Route>

            {/* Protected Workspace Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/processing/:id" element={<ProcessingPage />} />
              <Route path="/workspace/:id" element={<WorkspacePlaceholderPage />} />
            </Route>

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
