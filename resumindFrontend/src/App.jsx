import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AnalyzerPage from './pages/AnalyzerPage';
import AnalysisResultsPage from './pages/AnalysisResultsPage';
import BuilderPage from './pages/BuilderPage';
import SavedResumesPage from './pages/SavedResumesPage';
import SavedAnalysesPage from './pages/SavedAnalysesPage';
import AccountPage from './pages/AccountPage';

// Protected Route Wrapper (Restricted to Logged-in Users)
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-space-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-electric-500 border-t-transparent animate-spin" />
          <p className="text-xs font-medium tracking-wide">Authenticating session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to register if they tried to access a protected feature without account
    return <Navigate to="/register" state={{ from: location }} replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-space-950 text-slate-100 selection:bg-electric-600 selection:text-white antialiased">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Routes - Only Logged In Users Can Use Features */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analyzer"
                element={
                  <ProtectedRoute>
                    <AnalyzerPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analyzer/results"
                element={
                  <ProtectedRoute>
                    <AnalysisResultsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/builder"
                element={
                  <ProtectedRoute>
                    <BuilderPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resumes"
                element={
                  <ProtectedRoute>
                    <SavedResumesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analyses"
                element={
                  <ProtectedRoute>
                    <SavedAnalysesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analyses/:id"
                element={
                  <ProtectedRoute>
                    <AnalysisResultsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <AccountPage />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
