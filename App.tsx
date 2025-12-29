import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LandingPage from './src/pages/LandingPage';
import AuthPage from './src/pages/AuthPage';
import PaymentPage from './src/pages/PaymentPage';
import CRMApp from './CRMApp';

const ProtectedRoute = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  // Redirect if no session
  return session ? <Outlet /> : <Navigate to="/auth" replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<CRMApp />} />
            <Route path="/payment" element={<PaymentPage />} />
          </Route>
          {/* Catch all redirect to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
