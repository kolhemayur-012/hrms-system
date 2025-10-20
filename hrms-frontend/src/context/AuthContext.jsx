// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, username, email, role, id } = response.data;
      
      localStorage.setItem('authToken', token);
      const userData = { id, username, email, role };
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      alert(error.response?.data || 'Login failed');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      await api.post('/auth/register', userData);
      alert('Registration successful! Please login.');
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      alert(error.response?.data || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};