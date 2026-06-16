import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const ROLES = {
  DONOR:     'DONOR',
  RECIPIENT: 'RECIPIENT',
  HOSPITAL:  'HOSPITAL',
  ADMIN:     'ADMIN',
};

export function AuthProvider({ children }) {
  const [user,          setUser]          = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading,       setLoading]       = useState(true);

  /* Restore session from localStorage on app load */
  useEffect(() => {
    const stored = authService.getStoredUser();
    if (stored) setUser(stored);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setNotifications([]);
  };

  const markNotificationRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

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
      logout,
      notifications,
      setNotifications,
      markNotificationRead,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
