import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the hash fragment which contains the tokens
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const access_token = hashParams.get('access_token');
        const refresh_token = hashParams.get('refresh_token');
        const error = hashParams.get('error');
        const error_description = hashParams.get('error_description');

        console.log('OAuth callback received:', { 
          has_access_token: !!access_token,
          has_refresh_token: !!refresh_token,
          error,
          error_description 
        });

        if (error) {
          console.error('OAuth error:', error, error_description);
          navigate('/buyer-auth?error=' + encodeURIComponent(error_description || error));
          return;
        }

        if (access_token && refresh_token) {
          // Set the session manually
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (sessionError) {
            console.error('Session error:', sessionError);
            navigate('/buyer-auth?error=' + encodeURIComponent(sessionError.message));
            return;
          }

          console.log('Session set successfully:', data);

          // Check if this was from a tour booking
          const isFromTourBooking = localStorage.getItem('newUserFromPropertyRequest') === 'true';
          const pendingTourRequest = localStorage.getItem('pendingTourRequest');
          
          if (isFromTourBooking && pendingTourRequest) {
            console.log('Tour booking context detected, redirecting to buyer-dashboard');
            localStorage.removeItem('newUserFromPropertyRequest');
            navigate('/buyer-dashboard', { replace: true });
          } else {
            // Default redirect based on user type
            const user = data.session?.user;
            const userType = user?.user_metadata?.user_type || 'buyer';
            
            if (userType === 'agent') {
              navigate('/agent-dashboard', { replace: true });
            } else if (userType === 'admin') {
              navigate('/admin-dashboard', { replace: true });
            } else {
              navigate('/buyer-dashboard', { replace: true });
            }
          }
        } else {
          console.error('No tokens found in callback');
          navigate('/buyer-auth?error=' + encodeURIComponent('No authentication tokens received'));
        }
      } catch (error) {
        console.error('Callback handling error:', error);
        navigate('/buyer-auth?error=' + encodeURIComponent('Authentication failed'));
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}