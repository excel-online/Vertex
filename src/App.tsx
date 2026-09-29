import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';

// Chat Components
import ChatButton from '@/components/ChatButton';
import WhatsAppButton from '@/components/WhatsAppButton';

// Pages
import LandingPage from '@/pages/LandingPage';
import AboutUs from '@/pages/AboutUs';
import TermsOfUse from '@/pages/TermsOfUse';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import ContactUs from '@/pages/ContactUs';
import FAQ from '@/pages/FAQ';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import DashboardLayout from '@/layouts/DashboardLayout';
import UserDashboard from '@/pages/user/UserDashboard';
import DepositsPage from '@/pages/user/DepositsPage';
import InvestmentsPage from '@/pages/user/InvestmentsPage';
import WithdrawalsPage from '@/pages/user/WithdrawalsPage';
import TradingHistory from '@/pages/user/TradingHistory';
import SignalPurchase from '@/pages/user/SignalPurchase';
import AccountSettings from '@/pages/user/AccountSettings';
import AccountUpgrade from '@/pages/user/AccountUpgrade';
import ContactSupport from '@/pages/user/ContactSupport';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminTransactions from '@/pages/admin/AdminTransactions';
import AdminUserDetail from '@/pages/admin/AdminUserDetail';
import NotFoundPage from '@/pages/NotFoundPage';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Public Route - redirects to dashboard if authenticated
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } 
      />
      {/* Password Reset Routes - Accessible to everyone */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      <Route 
        path="/about-us" 
        element={
          <AboutUs />
        } 
      />

      <Route path="/terms-of-use" 
        element={
          <TermsOfUse/>
        }
      />

      <Route path="/privacy-policy"
        element={
          <PrivacyPolicy/>
        }
      />
      
      <Route path="/contact-us"
        element={
          <ContactUs/>
        }
      />

      <Route path="/faq"
        element={
          <FAQ/>
        }
      />
      

      {/* User Dashboard Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<UserDashboard />} />
        <Route path="deposits" element={<DepositsPage />} />
        <Route path="investments" element={<InvestmentsPage />} />
        <Route path="withdrawals" element={<WithdrawalsPage />} />
        <Route path="history" element={<TradingHistory />} />
        <Route path="transactions" element={<TradingHistory />} />
        <Route path="signals" element={<SignalPurchase />} />
        <Route path="upgrade" element={<AccountUpgrade />} />
        <Route path="settings" element={<AccountSettings />} />
        <Route path="support" element={<ContactSupport />} />
      </Route>

      {/* Admin Routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute adminOnly={true}>
            <DashboardLayout isAdmin={true} />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/:id" element={<AdminUserDetail />} />
        <Route path="transactions" element={<AdminTransactions />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <ChatButton />
        <WhatsAppButton />
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#fff',
              border: '1px solid #e5e7eb',
              color: '#1f2937',
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;