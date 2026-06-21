import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterPatient from './pages/RegisterPatient';
import Requests from './pages/Requests';
import CreateRequest from './pages/CreateRequest';
import DonationCamp from './pages/DonationCamp';
import DonorProfile from './pages/DonorProfile';
import AboutContent from './components/about/AboutContent';
import DonorDashboard from './pages/dashboards/DonorDashboard';
import HospitalDashboard from './pages/dashboards/HospitalDashboard';
import RecipientDashboard from './pages/dashboards/RecipientDashboard';

function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="page-loader">
        <div className="loading-spinner-dark" />
      </div>
    );
  }
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutContent />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register/donor" element={<Register />} />
      <Route path="/register/patient" element={<RegisterPatient />} />
      <Route path="/register/hospital" element={<RegisterPatient />} />
      <Route path="/register" element={<Navigate to="/register/donor" replace />} />
      <Route path="/requests" element={<Requests />} />
      <Route path="/camps" element={<DonationCamp />} />
      <Route path="/request/create" element={<CreateRequest />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute requiredRole="DONOR">
            <DonorProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/donor"
        element={
          <ProtectedRoute>
            <DonorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/hospital"
        element={
          <ProtectedRoute>
            <HospitalDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/recipient"
        element={
          <ProtectedRoute>
            <RecipientDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
