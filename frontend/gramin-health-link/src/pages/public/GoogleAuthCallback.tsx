import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const GoogleAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const token = searchParams.get('token');
  const userParam = searchParams.get('user');
  const error = searchParams.get('error');

  useEffect(() => {
    const handleGoogleCallback = () => {
      if (error) {
        console.error('Google Auth Error:', error);
        toast.error('Authentication failed. Please try again.');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      if (token && userParam) {
        try {
          const userData = JSON.parse(decodeURIComponent(userParam));
          console.log('Google Auth Success:', { token, userData });
          
          // Login with Google data
          login(token, userData);
          
          toast.success('Successfully signed in with Google!');
          
          // Redirect based on user role
          setTimeout(() => {
            const redirectPath = userData.role === 'doctor' 
              ? '/doctor/dashboard' 
              : '/patient/dashboard';
            navigate(redirectPath, { replace: true });
          }, 1000);
          
        } catch (err) {
          console.error('Error parsing user data:', err);
          toast.error('Authentication failed. Please try again.');
          setTimeout(() => navigate('/login'), 2000);
        }
      } else {
        console.error('Missing token or user data');
        toast.error('Authentication failed. Please try again.');
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    handleGoogleCallback();
  }, [token, userParam, error, login, navigate]);

  const getStatusIcon = () => {
    if (error) return <XCircle className="h-12 w-12 text-red-500" />;
    if (token && userParam) return <CheckCircle className="h-12 w-12 text-green-500" />;
    return <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />;
  };

  const getStatusMessage = () => {
    if (error) return 'Authentication Failed';
    if (token && userParam) return 'Authentication Successful';
    return 'Processing Authentication...';
  };

  const getStatusDescription = () => {
    if (error) return 'There was an error with your Google sign-in. Please try again.';
    if (token && userParam) return 'You have been successfully signed in. Redirecting...';
    return 'Please wait while we complete your authentication.';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            {getStatusIcon()}
          </div>
          <CardTitle className="text-xl font-bold">
            {getStatusMessage()}
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            {getStatusDescription()}
          </p>
        </CardHeader>
        
        <CardContent className="text-center">
          <div className="space-y-2">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                Error: {error}
              </div>
            )}
            
            {token && userParam && (
              <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
                Redirecting to your dashboard...
              </div>
            )}
            
            {!token && !error && (
              <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-md">
                Processing your authentication...
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleAuthCallback;
