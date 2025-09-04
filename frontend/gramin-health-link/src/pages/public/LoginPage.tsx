import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Phone, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import GoogleSignIn from '@/components/GoogleSignIn';
const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { requestOTP, login } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);


  const handleGoogleSignIn = async (credential: string) => {
    setIsGoogleLoading(true);
    try {
      // Send the credential to your backend for verification
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/google/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential }),
      });

      const data = await response.json();


      if (response.ok && data.token) {
        const userData = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          avatar: data.user.avatar,
        };

        login(data.token, userData);
        
        // Redirect based on role
        const redirectPath = userData.role === 'doctor' 
          ? '/doctor/dashboard' 
          : '/patient/dashboard';
        navigate(redirectPath, { replace: true });
      } else {
        throw new Error(data.message || 'Google authentication failed');
      }
    } catch (error:any) {
      console.error('Google Sign-In Error:', error);
      toast.error('Google Sign-In failed. Please try again.');
    }  finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = (error: string) => {
    console.error('Google Sign-In Error:', error);
    toast.error('Google Sign-In failed. Please try again.');
    setIsGoogleLoading(false);
  };

  const handleSendOTP =  async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      toast.error('कृपया 10 अंकों का मोबाइल नंबर दर्ज करें');
      return;
    }

    setIsLoading(true);

    try {
      const response = await requestOTP(phoneNumber);

      if (response.success) {
        localStorage.setItem('temp-phone', phoneNumber);
        toast.success('OTP भेजा गया!');
        navigate('/otp-verification');
      } else {
        toast.error(response.error || 'OTP भेजने में कुछ गलत हुआ।');
      }
    } catch (error) {

      console.error('API Error Details:', error);
      
      let errorMessage = 'कुछ गलत हुआ। कृपया फिर कोशिश करें।';
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'नेटवर्क कनेक्शन में समस्या है। कृपया इंटरनेट कनेक्शन जांचें।';
        } else if (error.message.includes('CORS')) {
          errorMessage = 'सर्वर कनेक्शन में समस्या है। कृपया बाद में कोशिश करें।';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-3 rounded-full">
              <Heart className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
          </CardTitle>
          <p className="text-muted-foreground text-rural-base">
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Google Sign-In */}
          <div className="space-y-4">
            <GoogleSignIn
              onSuccess={handleGoogleSignIn}
              onError={handleGoogleError}
              disabled={isGoogleLoading}
            />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with mobile
                </span>
              </div>
            </div>
          </div>

          {/* Mobile OTP Section */}
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-rural-base font-medium">
                  मोबाइल नंबर दर्ज करें
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input                 
                      type="tel"

                      placeholder="9876543210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="pl-10 text-rural-lg h-12"
                      maxLength={10}
                  />
                </div>
              </div>

              <Button
                onClick={handleSendOTP}
                disabled={isLoading || phoneNumber.length !== 10}
                className="w-full h-12 text-rural-lg font-semibold"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    भेजा जा रहा है...
                  </div>
                ) : (
                  'OTP भेजें'
                )}
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>OTP आपके मोबाइल नंबर पर भेजा जाएगा</p>

            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default LoginPage;