// API Test Utility for debugging OTP and authentication issues

export const testAPIEndpoint = async (endpoint: string, method: string = 'GET', body?: any) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const fullUrl = `${API_URL}${endpoint}`;
  
  console.log(`Testing API: ${method} ${fullUrl}`);
  
  try {
    const response = await fetch(fullUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    
    console.log(`Response status: ${response.status}`);
    console.log(`Response headers:`, Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log(`Response data:`, data);
    
    return {
      success: response.ok,
      status: response.status,
      data,
      error: response.ok ? null : data.message || 'Unknown error'
    };
  } catch (error) {
    console.error(`API Test Error:`, error);
    return {
      success: false,
      status: 0,
      data: null,
      error: error instanceof Error ? error.message : 'Network error'
    };
  }
};

export const testOTPRequest = async (phoneNumber: string) => {
  return testAPIEndpoint('/api/v1/auth/request-otp', 'POST', {
    mobile: `+91${phoneNumber}`
  });
};

export const testOTPVerification = async (phoneNumber: string, otp: string) => {
  return testAPIEndpoint('/api/v1/auth/verify-otp', 'POST', {
    mobile: `+91${phoneNumber}`,
    otp
  });
};

export const testHealthCheck = async () => {
  return testAPIEndpoint('/api/v1/health', 'GET');
};
