
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
  email?: string;
  role: 'patient' | 'doctor' | 'pharmacist';
  avatar?: string;
}

export function useAuth() {
  console.log('🔄 useAuth hook initialized - NEW VERSION LOADED');
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

  const login = useCallback((token: string, userData?: User) => {
    console.log('🔑 Login called with token and userData:', { token: token.substring(0, 20) + '...', userData });
    apiClient.setToken(token);
    setToken(token);
    
    if (userData) {
      // Use provided user data
      console.log('👤 Setting user from provided data:', userData);
      setUser(userData);
      setIsAuthenticated(true);
      console.log('✅ Authentication state updated');
      return userData;
    } else {
      // Try to decode from JWT (fallback)
      console.log('🔍 Decoding user from JWT token');
      const decodedUser = decodeAndSetUser(token);
      return decodedUser;
    }
  }, [decodeAndSetUser]);

  const requestOTP = useCallback(async (mobile: string) => {
    return await apiClient.requestOTP(mobile);
  }, []);

  const verifyOTP = useCallback(async (mobile: string, otp: string) => {
    console.log('🔐 Verifying OTP for:', mobile);
    const response = await apiClient.verifyOTP(mobile, otp);
    console.log('🔐 OTP Verification Response:', response);
    
    if (response.success && response.data?.token) {
      console.log('✅ OTP verification successful, token received');
      
      // Set user data from the response (not from JWT)
      if (response.data.user) {
        const userData = {
          id: response.data.user.id,
          phone: mobile, // Use the mobile from the request
          name: response.data.user.name,
          role: response.data.user.role
        };
        console.log('👤 Setting user data:', userData);
        login(response.data.token, userData);
        console.log('🎉 Login completed successfully');
      } else {
        console.log('⚠️ No user data in response, falling back to JWT decoding');
        // Fallback to JWT decoding if no user data
        login(response.data.token);
      }
    } else {
      console.log('❌ OTP verification failed:', response.error);
    }
    return response;
  }, [login]);

  const loginWithGoogle = useCallback(async (credential: string) => {
    console.log('🔑 Logging in with Google credential');
    const response = await apiClient.verifyGoogleCredential(credential);
    console.log('🔑 Google Login Response:', response);
    
    if (response.success && response.data?.token) {
      console.log('✅ Google login successful, token received');
      
      const userData = {
        id: response.data.user.id,
        phone: response.data.user.phone || '',
        name: response.data.user.name,
        email: response.data.user.email,
        role: response.data.user.role,
        avatar: response.data.user.avatar
      };
      
      console.log('👤 Setting Google user data:', userData);
      login(response.data.token, userData);
      console.log('🎉 Google login completed successfully');
    } else {
      console.log('❌ Google login failed:', response.error);
    }
    return response;
  }, [login]);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('sehat-saathi-token');
      if (storedToken) {
        setToken(storedToken);
        apiClient.setToken(storedToken);
        
        try {
          // Try to decode the token to get user ID
          const decoded = jwtDecode(storedToken);
          if (decoded.id) {
            // Fetch user data from backend
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
              // If fetching user data fails, clear the token
              logout();
            }
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [logout]);

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