import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Requests from './pages/Requests';
import CreateRequest from './pages/CreateRequest';
import DonationCamp from './pages/DonationCamp';
import DonorProfile from './pages/DonorProfile';
import AboutContent from './components/about/AboutContent';

function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutContent />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register/donor" element={<Register />} />
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
