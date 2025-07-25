import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

export default function Auth0CallbackSimple() {
  const { isLoading, error } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Auth0CallbackSimple: Processing callback', { isLoading, error });
    
    if (!isLoading) {
      if (error) {
        console.error('Auth0 callback error:', error);
        navigate(`/?error=${encodeURIComponent(error.message)}`);
      } else {
        // Auth0 handles the authentication state internally
        // The Auth0AuthContext will pick up the authenticated user
        // Check for tour booking context
        const isFromTourBooking = localStorage.getItem('newUserFromPropertyRequest') === 'true';
        const pendingTourRequest = localStorage.getItem('pendingTourRequest');
        
        if (isFromTourBooking && pendingTourRequest) {
          console.log('Tour booking context detected, redirecting to buyer-dashboard');
          navigate('/buyer-dashboard');
        } else {
          // Default redirect
          navigate('/buyer-dashboard');
        }
      }
    }
  }, [isLoading, error, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing sign in...</p>
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md max-w-md mx-auto">
            <p className="text-red-800 font-semibold">Authentication Error:</p>
            <p className="text-red-600 text-sm">{error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}