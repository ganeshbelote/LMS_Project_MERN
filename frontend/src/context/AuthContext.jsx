import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

/**
 * Normalize user object shape so both `id` and `_id` are always present.
 * This prevents enrollment checks from failing due to format differences.
 */
const normalizeUser = (userData) => {
  if (!userData) return null;
  const id = userData.id || userData._id || userData.userId || null;
  if (!id) return null;
  return {
    ...userData,
    id,
    _id: id,
    role: (userData.role || 'user').toLowerCase()
  };
};

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
        setUser(normalizeUser(res.data.data));
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
    if (!token || !userData) {
      throw new Error('Invalid login response');
    }
    const normalized = normalizeUser(userData);
    if (!normalized?.id) {
      throw new Error('Invalid login response: missing user id');
    }
    localStorage.setItem('token', token);
    localStorage.setItem('id', normalized.id);
    localStorage.setItem('role', normalized.role);
    setUser(normalized);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  const isAuthenticated = !!localStorage.getItem('token');
  const role = localStorage.getItem('role') || '';

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