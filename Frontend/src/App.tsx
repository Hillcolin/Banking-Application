import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import LandingPage from './components/landingPage';
import BalancePage from './components/BalancePage';
import AccountDetails from './components/AccountDetails';
import Terms from './components/terms';
import PrivacyPolicy from './components/privacyPolicy';
import DepositPage from './components/DepositPage'; // Import DepositPage
import WithdrawPage from './components/WithdrawPage'; // Import WithdrawPage
import { useAuth } from './contexts/authContext';
import { AuthProvider } from './contexts/authContext';

// ProtectedRoute Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // Redirect to login if the user is not authenticated
    return <Login />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacyPolicy" element={<PrivacyPolicy />} />

          {/* Protected Routes */}
          <Route
            path="/balance"
            element={
              <ProtectedRoute>
                <BalancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/:accountId" // Dynamic route for account details
            element={
              <ProtectedRoute>
                <AccountDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/deposit" // Route for Deposit Page
            element={
              <ProtectedRoute>
                <DepositPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/withdraw" // Route for Withdraw Page
            element={
              <ProtectedRoute>
                <WithdrawPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
