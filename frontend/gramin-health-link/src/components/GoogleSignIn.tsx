import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Extend Window interface for Google Sign-In
declare global {
  interface Window {
    google: any;
  }
}

interface GoogleSignInProps {
  onSuccess: (credential: string) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({ onSuccess, onError, disabled = false }) => {
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'signin_with',
          shape: 'rectangular',
        });
      }
    };

    const handleCredentialResponse = (response: any) => {
      console.log('Google Sign-In Response:', response);
      
      if (response.credential) {
        onSuccess(response.credential);
      } else {
        const error = 'Failed to get credential from Google';
        console.error(error);
        onError?.(error);
        toast.error('Google Sign-In failed. Please try again.');
      }
    };

    // Initialize when Google script loads
    if (window.google) {
      initializeGoogleSignIn();
    } else {
      // Wait for Google script to load
      const checkGoogle = setInterval(() => {
        if (window.google) {
          clearInterval(checkGoogle);
          initializeGoogleSignIn();
        }
      }, 100);

      // Cleanup interval after 10 seconds
      setTimeout(() => clearInterval(checkGoogle), 10000);
    }

    return () => {
      if (googleButtonRef.current) {
        googleButtonRef.current.innerHTML = '';
      }
    };
  }, [onSuccess, onError]);

  return (
    <div className="w-full">
      <div ref={googleButtonRef} className="w-full" />
      {disabled && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-50 rounded-md flex items-center justify-center">
          <span className="text-sm text-gray-500">Loading...</span>
        </div>
      )}
    </div>
  );
};

export default GoogleSignIn;
