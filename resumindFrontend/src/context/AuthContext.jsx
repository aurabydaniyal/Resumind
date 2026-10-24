import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setAuthToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('resumind_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const storedToken = localStorage.getItem('resumind_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.getMe();
        if (response?.data?.user) {
          setUser(response.data.user);
        } else {
          // Token invalid or expired
          logout();
        }
      } catch (err) {
        console.warn('Session verification notice:', err.message);
        // Only clear if auth error (401), not network error
        if (err.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res?.data?.token) {
      setAuthToken(res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
    }
    return res;
  };

  const register = async (name, email, password) => {
    const res = await api.register({ name, email, password });
    if (res?.data?.token) {
      setAuthToken(res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
    }
    return res;
  };

  const logout = () => {
    setAuthToken(null);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        loading,
        login,
        register,
        logout
      }}
    >
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
