import { useState, useEffect, useCallback } from 'react';
// import { jwtDecode } from 'jwt-decode';

// Hardcoded data to simulate a successful OTP verification for the demo
const MOCK_PHONE = '1234567890';
const MOCK_OTP = '123456';

const MOCK_USER = {
  id: 'mock-user-123',
  phone: MOCK_PHONE,
  name: 'Demo User',
  email: 'demo.user@example.com',
  role: 'patient', // Change to 'doctor' to test that dashboard
};

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);

  // This is a placeholder as no backend is being called
  const logout = useCallback(() => {
    console.log('Logout called - In Demo Mode, this would clear the session.');
    setUser(null);
    setIsAuthenticated(false);
    setToken(null);
  }, []);

  // This is a placeholder as no backend is being called
  const login = useCallback((token, userData) => {
    console.log('Login called - In Demo Mode, login is already handled by verifyOTP.');
    setUser(MOCK_USER);
    setIsAuthenticated(true);
    setToken(token);
  }, []);

  const requestOTP = useCallback(async (mobile) => {
    console.log('requestOTP called - Bypassed in demo mode.');
    if (mobile === MOCK_PHONE) {
      // Simulate success for the correct phone number
      return { success: true, data: { message: `OTP sent to ${mobile}` } };
    }
    // Simulate failure for any other number
    return { success: false, error: 'Invalid phone number.' };
  }, []);

  const verifyOTP = useCallback(async (mobile, otp) => {
    console.log('verifyOTP called - Bypassed in demo mode.');
    // Check for hardcoded phone and OTP
    if (mobile === MOCK_PHONE && otp === MOCK_OTP) {
      console.log('✅ OTP verification successful - Simulating login.');
      // Simulate a successful API response
      const response = {
        success: true,
        data: {
          token: 'mock-token',
          user: MOCK_USER,
        },
      };
      // Call the login function with the mock data
      login(response.data.token, response.data.user);
      return response;
    } else {
      console.log('❌ OTP verification failed - Invalid phone or OTP.');
      return { success: false, error: 'Invalid OTP.' };
    }
  }, [login]);

  // This hook now only runs once to set the initial loading state
  useEffect(() => {
    setIsLoading(false);
  }, []);

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
