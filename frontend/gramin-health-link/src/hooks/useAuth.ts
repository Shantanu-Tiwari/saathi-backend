import { useState, useEffect, useCallback } from 'react';

// Hardcoded mock data to simulate a logged-in user for the demo
const MOCK_USER = {
  id: 'mock-user-123',
  phone: '1234567890',
  name: 'Demo User',
  email: 'demo.user@example.com',
  role: 'patient', // Change to 'doctor' to test that dashboard
};

export function useAuth() {
  // Hardcoded states to bypass all authentication logic
  const [user, setUser] = useState(MOCK_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('mock-token');

  // These functions are now placeholders
  const logout = useCallback(() => {
    console.log('Logout called - In Demo Mode, this would clear the session.');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const login = useCallback((token, userData) => {
    console.log('Login called - In Demo Mode, login is already hardcoded.');
    setUser(MOCK_USER);
    setIsAuthenticated(true);
  }, []);

  const requestOTP = useCallback(async (mobile) => {
    console.log('requestOTP called - Bypassed in demo mode.');
    return { success: true, data: { message: 'OTP sent' } };
  }, []);

  const verifyOTP = useCallback(async (mobile, otp) => {
    console.log('verifyOTP called - Bypassed in demo mode.');
    return { success: true, data: { token: 'mock-token', user: MOCK_USER } };
  }, [login]);

  const loginWithGoogle = useCallback(async (credential) => {
    console.log('loginWithGoogle called - Bypassed in demo mode.');
    return { success: true, data: { token: 'mock-token', user: MOCK_USER } };
  }, [login]);

  // The useEffect hook is no longer needed to check auth state
  // as it is now hardcoded.

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