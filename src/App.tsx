import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider as SupabaseAuthProvider, useAuth } from './contexts/SupabaseAuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LandingPage } from './components/LandingPage';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Dashboard } from './components/Dashboard';
import { EditorDashboard } from './components/EditorDashboard';
import { Toaster } from './components/ui/sonner';

// Simple loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Main App Content
const AppContent = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  console.log('AppContent rendered', { 
    user, 
    isLoading, 
    pathname: location.pathname,
    state: location.state 
  });

  if (isLoading) {
    console.log('AppContent: Loading...');
    return <LoadingSpinner />;
  }
  
  console.log('AppContent: Not loading, user:', user ? 'authenticated' : 'not authenticated');

  return (
    <Routes>
      {/* Public routes - only accessible when NOT authenticated */}
      <Route 
        path="/" 
        element={
          !user ? (
            <>
              {console.log('Rendering LandingPage')}
              <LandingPage onGetStarted={() => {}} />
            </>
          ) : (
            <>
              {console.log('Redirecting to /dashboard')}
              <Navigate to="/dashboard" replace />
            </>
          )
        } 
      />
      <Route 
        path="/login" 
        element={!user ? <Login /> : <Navigate to="/dashboard" replace />} 
      />
      <Route 
        path="/register" 
        element={!user ? <Register /> : <Navigate to="/dashboard" replace />} 
      />

      {/* Protected routes - only accessible when authenticated */}
      <Route 
        path="/dashboard" 
        element={
          user ? (
            user.role === 'admin' ? <Dashboard /> : <Navigate to="/editor" replace />
          ) : (
            <Navigate to="/login" replace state={{ from: location }} />
          )
        } 
      />
      <Route 
        path="/editor" 
        element={
          user ? (
            user.role === 'editor' ? <EditorDashboard /> : <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace state={{ from: location }} />
          )
        } 
      />
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SupabaseAuthProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <AppContent />
          <Toaster position="top-center" />
        </ThemeProvider>
      </SupabaseAuthProvider>
    </div>
  );
};

export default App;