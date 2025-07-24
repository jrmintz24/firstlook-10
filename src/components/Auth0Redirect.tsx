import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface Auth0RedirectProps {
  returnTo?: string;
}

export const Auth0Redirect: React.FC<Auth0RedirectProps> = ({ returnTo }) => {
  const { loginWithRedirect, isLoading } = useAuth0();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const initiateLogin = async () => {
      try {
        console.log('Auth0Redirect: Initiating login redirect...', { returnTo, pathname: location.pathname });
        
        await loginWithRedirect({
          appState: { 
            returnTo: returnTo || location.pathname + location.search,
            tourBooking: true // Flag this as a tour booking flow
          }
        });
      } catch (error) {
        console.error('Auth0 login redirect failed:', error);
        setError(error instanceof Error ? error.message : 'Authentication failed');
      }
    };

    if (!isLoading && retryCount < 3) {
      initiateLogin();
    }
  }, [loginWithRedirect, returnTo, location, isLoading, retryCount]);

  const handleRetry = () => {
    setError(null);
    setRetryCount(prev => prev + 1);
  };

  const handleCancel = () => {
    // Clear any tour request data and go back to homepage
    localStorage.removeItem('pendingTourRequest');
    localStorage.removeItem('newUserFromPropertyRequest');
    window.location.href = '/';
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign In Issue</h3>
          <p className="text-gray-600 mb-4">
            We're having trouble connecting to the sign-in service. This might be a temporary issue.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Error: {error}
          </p>
          <div className="flex space-x-3 justify-center">
            <Button onClick={handleRetry} className="bg-purple-600 hover:bg-purple-700">
              Try Again
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to sign in...</p>
        <p className="mt-2 text-sm text-gray-500">This should only take a moment</p>
      </div>
    </div>
  );
};