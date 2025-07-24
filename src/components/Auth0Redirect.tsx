import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useLocation } from 'react-router-dom';

interface Auth0RedirectProps {
  returnTo?: string;
}

export const Auth0Redirect: React.FC<Auth0RedirectProps> = ({ returnTo }) => {
  const { loginWithRedirect } = useAuth0();
  const location = useLocation();

  useEffect(() => {
    const initiateLogin = async () => {
      try {
        await loginWithRedirect({
          appState: { 
            returnTo: returnTo || location.pathname + location.search
          }
        });
      } catch (error) {
        console.error('Auth0 login redirect failed:', error);
        // Fallback to homepage if Auth0 fails
        window.location.href = '/';
      }
    };

    initiateLogin();
  }, [loginWithRedirect, returnTo, location]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to sign in...</p>
      </div>
    </div>
  );
};