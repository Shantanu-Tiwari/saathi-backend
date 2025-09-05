import { useState, useEffect, useCallback } from 'react';
// import { jwtDecode } from 'jwt-decode';

// NOTE: You must replace this with your actual backend URL.
// The hardcoded value is a placeholder from our previous conversation.
const API_URL = "https://saathi-backend-2.onrender.com";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem('sehat-saathi-token');
  }, []);

  const login = useCallback((token, userData) => {
    localStorage.setItem('sehat-saathi-token', token);
    setUser(userData);
    setIsAuthenticated(true);
    setToken(token);
  }, []);

  const requestOTP = useCallback(async (mobile) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile }),
      });
      const data = await response.json();
      return { success: response.ok, data, error: !response.ok ? data.message : null };
    } catch (error) {
      console.error('Error requesting OTP:', error);
      return { success: false, error: 'Network error or server unavailable.' };
    }
  }, []);

  const verifyOTP = useCallback(async (mobile, otp) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp }),
      });
      const data = await response.json();

      if (response.ok && data.token) {
        // Assume user data is also returned with the token
        const userData = {
          id: data.user.id,
          phone: mobile,
          name: data.user.name,
          role: data.user.role,
        };
        login(data.token, userData);
      }
      return { success: response.ok, data, error: !response.ok ? data.message : null };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return { success: false, error: 'Network error or server unavailable.' };
    }
  }, [login]);

  // Initial authentication check
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('sehat-saathi-token');
      if (storedToken) {
        try {
          const response = await fetch(`${API_URL}/api/v1/users/me`, {
            headers: { 'Authorization': `Bearer ${storedToken}` }
          });
          const data = await response.json();

          if (response.ok) {
            const userData = {
              id: data._id || data.id,
              phone: data.phone,
              name: data.name,
              role: data.role,
            };
            setUser(userData);
            setIsAuthenticated(true);
            setToken(storedToken);
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
  };
}
