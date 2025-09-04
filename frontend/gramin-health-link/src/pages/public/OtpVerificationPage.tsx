// src/pages/public/OtpVerificationPage.jsx

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const OtpVerificationPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    const storedPhone = localStorage.getItem('temp-phone');
    if (!storedPhone) {
      navigate('/login', { replace: true });
      return;
    }
    setPhoneNumber(storedPhone);
  }, [navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const maskPhoneNumber = (phone) => {
    if (phone.length < 4) return phone;
    return '******' + phone.slice(-4);
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error('कृपया 6 अंकों का OTP दर्ज करें');
      return;
    }

    setIsLoading(true);

    const API_URL = import.meta.env.VITE_API_URL;
    console.log('Verifying OTP for:', phoneNumber);

    try {
      const requestBody = {
        mobile: `+91${phoneNumber}`,
        otp: otp,
      };
      
      console.log('OTP Verification Request:', requestBody);

      const response = await fetch(`${API_URL}/api/v1/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('OTP Response status:', response.status);
      const data = await response.json();
      console.log('OTP Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'गलत OTP। कृपया फिर कोशिश करें।');
      }

      if (!data.token) {
        throw new Error('Authentication token not received from server');
      }

      login(data.token); // Call login and let useAuth handle redirect
      localStorage.removeItem('temp-phone');

      toast.success('लॉगिन सफल!');

    } catch (error) {
      console.error('OTP Verification Error:', {
        error: error,
        message: error.message,
        phoneNumber,
        otp: otp.substring(0, 2) + '****' // Mask OTP in logs
      });
      
      let errorMessage = 'गलत OTP। कृपया फिर कोशिश करें।';
      
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'नेटवर्क कनेक्शन में समस्या है। कृपया इंटरनेट कनेक्शन जांचें।';
      } else if (error.message.includes('token')) {
        errorMessage = 'सर्वर से प्रमाणीकरण टोकन प्राप्त नहीं हुआ। कृपया फिर कोशिश करें।';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);

    const API_URL = import.meta.env.VITE_API_URL;

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/request-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: `+91${phoneNumber}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'OTP दोबारा भेजने में कुछ गलत हुआ।');
      }

      setResendTimer(30);
      setCanResend(false);
      setOtp('');

      toast.success('OTP दोबारा भेजा गया!');
    } catch (error) {
      console.error('API Error:', error);
      toast.error(error.message || 'कुछ गलत हुआ। कृपया फिर कोशिश करें।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center space-y-4">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
                className="absolute top-4 left-4"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <div className="flex justify-center">
              <div className="bg-primary/10 p-3 rounded-full">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-xl font-bold">
              OTP सत्यापन
            </CardTitle>
            <p className="text-muted-foreground text-rural-base">
              OTP भेजा गया <span className="font-semibold">{maskPhoneNumber(phoneNumber)}</span> पर
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="w-12 h-12 text-rural-lg" />
                  <InputOTPSlot index={1} className="w-12 h-12 text-rural-lg" />
                  <InputOTPSlot index={2} className="w-12 h-12 text-rural-lg" />
                  <InputOTPSlot index={3} className="w-12 h-12 text-rural-lg" />
                  <InputOTPSlot index={4} className="w-12 h-12 text-rural-lg" />
                  <InputOTPSlot index={5} className="w-12 h-12 text-rural-lg" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
                onClick={handleVerifyOTP}
                disabled={isLoading || otp.length !== 6}
                className="w-full h-12 text-rural-lg font-semibold"
            >
              {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    सत्यापित कर रहे हैं...
                  </div>
              ) : (
                  'सत्यापित करें और लॉगिन करें'
              )}
            </Button>

            <div className="text-center">
              {canResend ? (
                  <Button
                      variant="ghost"
                      onClick={handleResendOTP}
                      disabled={isLoading}
                      className="text-primary"
                  >
                    OTP दोबारा भेजें
                  </Button>
              ) : (
                  <p className="text-sm text-muted-foreground">
                    OTP दोबारा भेजने के लिए {resendTimer} सेकंड प्रतीक्षा करें
                  </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

export default OtpVerificationPage;