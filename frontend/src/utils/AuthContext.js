import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const response = await api.get('/auth/me');
          if (response.data.success) {
            setUser(response.data.user);
            setToken(storedToken);
          } else {
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('AuthContext login attempt:', { email });
      const response = await api.post('/auth/login', { email, password });
      console.log('Login response:', response.data);
      
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
        console.log('Login successful, user set:', user);
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error('Login error in AuthContext:', error);
      
      // Handle different types of errors
      if (error.response?.data?.errors) {
        // Validation errors from express-validator
        const errorMessages = error.response.data.errors.map(err => err.msg).join(', ');
        return { success: false, message: errorMessages };
      } else if (error.response?.data?.message) {
        return { success: false, message: error.response.data.message };
      } else if (error.code === 'ECONNREFUSED') {
        return { success: false, message: 'Cannot connect to server. Please check if the server is running.' };
      } else {
        return { success: false, message: 'Login failed. Please try again.' };
      }
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await api.post('/auth/register', { 
        username, 
        email, 
        password 
      });
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
