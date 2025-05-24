import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const API_URL = 'http://localhost:8080';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Memoize apiClient to avoid recreating/interceptors on every render
  const apiClient = useMemo(() => {
    const instance = axios.create({ baseURL: API_URL });
    instance.interceptors.request.use(
      (config) => {
        const localToken = localStorage.getItem('authToken');
        if (localToken) {
          config.headers.Authorization = `Bearer ${localToken}`;
        }
        config.headers['Content-Type'] = 'application/json';
        return config;
      },
      (error) => Promise.reject(error)
    );
    return instance;
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        setLoading(true);
        try {
          const response = await apiClient.get('/api/users/me');
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          logout();
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    };
    fetchUser();
    // eslint-disable-next-line
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    setLoading(true);
    // O useEffect irá buscar o usuário
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  const value = {
    token,
    user,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    logout,
    apiClient,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

