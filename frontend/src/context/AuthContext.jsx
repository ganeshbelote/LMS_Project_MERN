import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    const id = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    if (!id || !token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await api.post('/auth/', { id });
      if (res.data.ok) {
        setUser(res.data.data);
      } else {
        logout();
      }
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('id', userData.id);
    // Normalize role to lowercase to prevent case sensitivity issues
    const normalizedRole = userData.role?.toLowerCase() || 'user';
    localStorage.setItem('role', normalizedRole);
    setUser({ ...userData, role: normalizedRole });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  const isAuthenticated = !!localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated,
        role,
        fetchUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;