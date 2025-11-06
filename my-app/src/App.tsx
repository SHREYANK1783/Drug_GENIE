import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ScrollToTop from './components/ScrollToTop';
import Layout from './components/Layout';
import { getCurrentUser } from './utils/storage';
import { getToken } from './services/api';
import { Skeleton } from './components/ui/skeleton';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const SignupPage = lazy(() => import('./pages/auth/SignupPage'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const AIAssistant = lazy(() => import('./pages/AIAssistant'));
const DrugChecker = lazy(() => import('./pages/DrugChecker'));
const MedicineLibrary = lazy(() => import('./pages/MedicineLibrary'));
const Reminders = lazy(() => import('./pages/Reminders'));
const BloodBank = lazy(() => import('./pages/BloodBank'));
const SymptomChecker = lazy(() => import('./pages/SymptomChecker'));
const Profile = lazy(() => import('./pages/Profile'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen p-6 space-y-6">
    <Skeleton className="h-12 w-64" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentUser = getCurrentUser();
  const token = getToken();
  return (currentUser && token) ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route Component (redirect to dashboard if logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentUser = getCurrentUser();
  const token = getToken();
  return (!currentUser || !token) ? <>{children}</> : <Navigate to="/" replace />;
};

function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          } />
          <Route path="/forgot-password" element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          } />
          
          {/* Legal Pages - Accessible to everyone */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="ai-assistant" element={<AIAssistant />} />
            <Route path="drug-checker" element={<DrugChecker />} />
            <Route path="library" element={<MedicineLibrary />} />
            <Route path="reminders" element={<Reminders />} />
            <Route path="blood-bank" element={<BloodBank />} />
            <Route path="symptom-checker" element={<SymptomChecker />} />
            <Route path="profile" element={<Profile />} />
            <Route path="help" element={<HelpCenter />} />
            <Route path="contact" element={<ContactUs />} />
          </Route>
          
          {/* 404 Not Found - Must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#374151',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
          },
        }}
      />
    </>
  );
}

export default App;