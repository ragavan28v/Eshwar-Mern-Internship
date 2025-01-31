import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { useNavigate } from 'react-router-dom';

// Create a custom axios instance with interceptors
const createAxiosInstance = (token) => {
  const instance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
    timeout: 10000,
  });

  instance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Create axios instance with current token
  const axiosInstance = createAxiosInstance(token);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const response = await axiosInstance.get(API_ENDPOINTS.GET_USER);
          setUser(response.data);
        } catch (err) {
          console.error('Error loading user:', err);
          logout();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const register = async (formData) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.REGISTER, formData);
      const { token: newToken, user: userData } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      setError(null);
      navigate('/dashboard');
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      console.error('Registration error:', err);
      return { success: false, error: errorMessage };
    }
  };

  const login = async (formData) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, formData);
      const { token: newToken, user: userData } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      setError(null);
      navigate('/dashboard');
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      console.error('Login error:', err);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axiosInstance.put(
        API_ENDPOINTS.UPDATE_PROFILE,
        profileData
      );
      setUser(response.data);
      return { success: true };
    } catch (err) {
      console.error('Profile update error:', err);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Profile update failed' 
      };
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        loading, 
        error, 
        register, 
        login, 
        logout, 
        updateProfile,
        setUser 
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
