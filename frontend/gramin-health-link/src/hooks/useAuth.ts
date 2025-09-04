
// import { useState, useEffect, useCallback } from 'react';
// import { jwtDecode } from 'jwt-decode';

// interface User {
//   id: string;
//   phone: string;
//   name?: string;
//   role: 'patient' | 'doctor' | 'pharmacist';
// }

// export function useAuth() {
//   const [user, setUser] = useState<User | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   const logout = useCallback(() => {
//     setUser(null);
//     setIsAuthenticated(false);
//     localStorage.removeItem('sehat-saathi-token');
//   }, []);

//   const decodeAndSetUser = useCallback((token: string) => {
//     try {
//       const decoded: User = jwtDecode(token);
//       setUser(decoded);
//       setIsAuthenticated(true);
//       return decoded;
//     } catch (error) {
//       console.error('Error decoding token:', error);
//       // Clear invalid token and reset state
//       localStorage.removeItem('sehat-saathi-token');
//       setUser(null);
//       setIsAuthenticated(false);
//       return null;
//     }
//   }, []);

//   const login = useCallback((token: string) => {
//     localStorage.setItem('sehat-saathi-token', token);
//     const decodedUser = decodeAndSetUser(token);
//     return decodedUser;
//   }, [decodeAndSetUser]);

//   const getToken = useCallback(() => {
//     return localStorage.getItem('sehat-saathi-token');
//   }, []);

//   useEffect(() => {
//     const token = localStorage.getItem('sehat-saathi-token');
//     if (token) {
//       decodeAndSetUser(token);
//     } else {
//       setIsLoading(false);
//     }
//   }, [decodeAndSetUser]);

//   // Set loading to false after initial auth check
//   useEffect(() => {
//     if (!isLoading) return;
    
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 100);

//     return () => clearTimeout(timer);
//   }, [isLoading]);

//   return {
//     user,
//     isAuthenticated,
//     isLoading,
//     token: getToken(),
//     login,
//     logout,
//   };
// }


import { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { apiClient } from '@/services/api';

interface User {
  id: string;
  phone: string;
  name?: string;
  role: 'patient' | 'doctor' | 'pharmacist';
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
  }, []);

  const decodeAndSetUser = useCallback((token: string) => {
    try {
      const decoded: User = jwtDecode(token);
      setUser(decoded);
      setIsAuthenticated(true);
      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      // Clear invalid token and reset state
      apiClient.setToken(null);
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      return null;
    }
  }, []);

  const login = useCallback((token: string) => {
    apiClient.setToken(token);
    setToken(token);
    const decodedUser = decodeAndSetUser(token);
    return decodedUser;
  }, [decodeAndSetUser]);

  const requestOTP = useCallback(async (mobile: string) => {
    return await apiClient.requestOTP(mobile);
  }, []);

  const verifyOTP = useCallback(async (mobile: string, otp: string) => {
    const response = await apiClient.verifyOTP(mobile, otp);
    if (response.success && response.data?.token) {
      login(response.data.token);
    }
    return response;
  }, [login]);

  useEffect(() => {
    const storedToken = localStorage.getItem('sehat-saathi-token');
    if (storedToken) {
      setToken(storedToken);
      apiClient.setToken(storedToken);
      decodeAndSetUser(storedToken);
    }
    setIsLoading(false);
  }, [decodeAndSetUser]);

  return {
    user,
    isAuthenticated,
    isLoading,
    token,
    login,
    logout,
    requestOTP,
    verifyOTP,
  };
}