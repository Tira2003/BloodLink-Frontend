import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const ROLES = {
  DONOR:     'DONOR',
  PATIENT:   'PATIENT',
  HOSPITAL:  'HOSPITAL',
  STAFF:     'STAFF',
  ADMIN:     'ADMIN',
};

export function AuthProvider({ children }) {
  const [user,          setUser]          = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  /* Restore session from localStorage on app load */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const stored = authService.getStoredUser();
        const token = authService.getStoredToken();

        if (token && stored) {
          // Check if token is expired
          if (authService.isTokenExpired()) {
            try {
              // Try to refresh token
              await authService.refreshToken();
              const refreshedUser = authService.getStoredUser();
              setUser(refreshedUser);
              setIsAuthenticated(true);
            } catch (err) {
              console.warn('Token refresh failed:', err);
              authService.logout();
              setUser(null);
              setIsAuthenticated(false);
            }
          } else {
            setUser(stored);
            setIsAuthenticated(true);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const data = await authService.login(email, password);
      setUser(data.user);
      setIsAuthenticated(true);
      return data.user;
    } catch (err) {
      const message = err.message || 'Login failed. Please try again.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload) => {
    try {
      setError(null);
      setLoading(true);
      const data = await authService.register(payload);
      setUser(data.user);
      setIsAuthenticated(true);
      return data.user;
    } catch (err) {
      const message = err.message || 'Registration failed. Please try again.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Logout error:', err);
    }
    setUser(null);
    setIsAuthenticated(false);
    setNotifications([]);
    setError(null);
  }, []);

  const markNotificationRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const hasRole = useCallback((role) => {
    if (!user) return false;
    if (typeof role === 'string') {
      return user.role === role;
    }
    return role.includes(user.role);
  }, [user]);

  if (loading) {
    return (
      <div className="page-loader">
        <div className="loading-spinner-dark" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated,
      loading,
      error,
      setError,
      notifications,
      setNotifications,
      markNotificationRead,
      hasRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
