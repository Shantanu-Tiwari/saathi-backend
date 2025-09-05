import { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { apiClient } from '@/services/api';

interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  role: 'patient' | 'doctor' | 'pharmacist';
  avatar?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    apiClient.setToken(null);
    setToken(null);
    localStorage.removeItem('sehat-saathi-token');
  }, []);

  const decodeAndSetUser = useCallback((token: string) => {
    try {
      const decoded: User = jwtDecode(token);
      setUser(decoded);
      setIsAuthenticated(true);
      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      apiClient.setToken(null);
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      return null;
    }
  }, []);

  const login = useCallback((token: string, userData?: User) => {
    apiClient.setToken(token);
    setToken(token);

    if (userData) {
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('sehat-saathi-token', token);
      return userData;
    } else {
      const decodedUser = decodeAndSetUser(token);
      return decodedUser;
    }
  }, [decodeAndSetUser]);

  const requestOTP = useCallback(async (mobile: string) => {
    return await apiClient.requestOTP(mobile);
  }, []);

  const verifyOTP = useCallback(async (mobile: string, otp: string) => {
    const response = await apiClient.verifyOTP(mobile, otp);

    if (response.success && response.data?.token) {
      if (response.data.user) {
        const userData = {
          id: response.data.user.id,
          phone: mobile,
          name: response.data.user.name,
          role: response.data.user.role
        };
        login(response.data.token, userData);
      } else {
        login(response.data.token);
      }
    }
    return response;
  }, [login]);

  const loginWithGoogle = useCallback(async (credential: string) => {
    const response = await apiClient.verifyGoogleCredential(credential);

    if (response.success && response.data?.token) {
      const userData = {
        id: response.data.user.id,
        phone: response.data.user.phone || '',
        name: response.data.user.name,
        email: response.data.user.email,
        role: response.data.user.role,
        avatar: response.data.user.avatar
      };
      login(response.data.token, userData);
    }
    return response;
  }, [login]);

  // Initial authentication check on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('sehat-saathi-token');
      if (storedToken) {
        apiClient.setToken(storedToken);
        setToken(storedToken);
        try {
          const response = await apiClient.getMe();
          if (response.success && response.data) {
            const userData = {
              id: response.data._id || response.data.id,
              phone: response.data.phone,
              name: response.data.name,
              role: response.data.role
            };
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            logout();
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []); // Empty dependency array to run only once

  return {
    user,
    isAuthenticated,
    isLoading,
    token,
    login,
    logout,
    requestOTP,
    verifyOTP,
    loginWithGoogle,
  };
}
