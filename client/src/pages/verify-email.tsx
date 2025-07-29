import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle, XCircle, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifyEmailPage() {
  const [location] = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('No verification token provided');
      return;
    }

    // Verify email with token
    fetch(`/api/verify-email?token=${token}`)
      .then(async (response) => {
        const data = await response.json();
        if (response.ok) {
          setStatus('success');
          setMessage(data.message);
        } else {
          setStatus('error');
          setMessage(data.message || 'Verification failed');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Network error during verification');
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-amber-200 dark:border-gray-700">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {status === 'loading' && (
              <div className="w-16 h-16 rounded-full border-4 border-amber-200 border-t-amber-600 animate-spin" />
            )}
            {status === 'success' && (
              <CheckCircle className="w-16 h-16 text-green-600" />
            )}
            {status === 'error' && (
              <XCircle className="w-16 h-16 text-red-600" />
            )}
          </div>
          
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            {status === 'loading' && 'Verifying Email...'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
          </CardTitle>
          
          <CardDescription className="text-base mt-2">
            {status === 'loading' && 'Please wait while we verify your email address.'}
            {message}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          {status === 'success' && (
            <>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 text-green-800 dark:text-green-200">
                  <Mail className="w-5 h-5" />
                  <span className="font-medium">Welcome to CoinFeedly!</span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                  Your account is now verified and ready to use.
                </p>
              </div>
              
              <Button
                onClick={() => window.location.href = '/login'}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700"
              >
                Continue to Login
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-700 dark:text-red-300">
                  The verification link may have expired or is invalid. 
                  Please try registering again or contact support.
                </p>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/register'}
                  className="flex-1"
                >
                  Register Again
                </Button>
                <Button
                  onClick={() => window.location.href = '/login'}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700"
                >
                  Try Login
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}