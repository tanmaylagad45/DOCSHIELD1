import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LandingPage } from './pages/LandingPage';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardView } from './pages/DashboardView';
import { DocumentsView } from './pages/DocumentsView';
import { UploadView } from './pages/UploadView';
import { CasesView } from './pages/CasesView';
import { ComplianceView } from './pages/ComplianceView';
import { ReportsView } from './pages/ReportsView';
import { AuditView } from './pages/AuditView';
import { SettingsView } from './pages/SettingsView';
import { LoginView } from './pages/LoginView';
import { RegisterView } from './pages/RegisterView';
import { ForgotPasswordView } from './pages/ForgotPasswordView';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public SaaS 3D Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Authentication Routes (Milestone 2) */}
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} />
          <Route path="/forgot-password" element={<ForgotPasswordView />} />

          {/* Internal Application & Dashboard Routes */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardView />} />
            <Route path="/documents" element={<DocumentsView />} />
            <Route path="/upload" element={<UploadView />} />
            <Route path="/cases" element={<CasesView />} />
            <Route path="/compliance" element={<ComplianceView />} />
            <Route path="/reports" element={<ReportsView />} />
            <Route path="/audit" element={<AuditView />} />
            <Route path="/settings" element={<SettingsView />} />
          </Route>

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
