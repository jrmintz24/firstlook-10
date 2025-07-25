import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function Auth0Debug() {
  const { 
    loginWithRedirect, 
    logout, 
    user, 
    isAuthenticated, 
    isLoading,
    error,
    getAccessTokenSilently,
    getIdTokenClaims
  } = useAuth0();
  
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<any>(null);
  const [testError, setTestError] = useState<string | null>(null);

  const testAuth0Login = async () => {
    try {
      console.log('Testing Auth0 login with redirect...');
      await loginWithRedirect({
        appState: {
          returnTo: window.location.pathname
        }
      });
    } catch (error: any) {
      console.error('Auth0 login test failed:', error);
      setTestError(error.message || 'Unknown error');
    }
  };

  const fetchTokens = async () => {
    try {
      const token = await getAccessTokenSilently();
      setAccessToken(token);
      
      const claims = await getIdTokenClaims();
      setIdToken(claims);
    } catch (error: any) {
      console.error('Error fetching tokens:', error);
      setTestError(error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Auth0 Debug Page</h1>
      
      <div className="space-y-6">
        {/* Auth State */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Auth State</h2>
          <div className="space-y-1 text-sm">
            <p>Loading: <span className="font-mono">{String(isLoading)}</span></p>
            <p>Authenticated: <span className="font-mono">{String(isAuthenticated)}</span></p>
            <p>User: <span className="font-mono">{user ? user.email : 'null'}</span></p>
            <p>Error: <span className="font-mono text-red-600">{error?.message || 'none'}</span></p>
          </div>
        </div>

        {/* Environment Config */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Environment Configuration</h2>
          <div className="space-y-1 text-sm font-mono">
            <p>Domain: {import.meta.env.VITE_AUTH0_DOMAIN || 'NOT SET'}</p>
            <p>Client ID: {import.meta.env.VITE_AUTH0_CLIENT_ID || 'NOT SET'}</p>
            <p>Redirect URI: {import.meta.env.VITE_AUTH0_REDIRECT_URI || `${window.location.origin}/auth/callback`}</p>
            <p>Current Origin: {window.location.origin}</p>
          </div>
        </div>

        {/* User Details */}
        {user && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="font-semibold mb-2">User Details</h2>
            <pre className="text-xs overflow-auto">{JSON.stringify(user, null, 2)}</pre>
          </div>
        )}

        {/* Tokens */}
        {(accessToken || idToken) && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h2 className="font-semibold mb-2">Tokens</h2>
            {accessToken && (
              <div className="mb-2">
                <p className="font-medium text-sm">Access Token:</p>
                <p className="font-mono text-xs break-all">{accessToken.substring(0, 50)}...</p>
              </div>
            )}
            {idToken && (
              <div>
                <p className="font-medium text-sm">ID Token Claims:</p>
                <pre className="text-xs overflow-auto">{JSON.stringify(idToken, null, 2)}</pre>
              </div>
            )}
          </div>
        )}

        {/* Test Error */}
        {testError && (
          <div className="bg-red-50 p-4 rounded-lg">
            <h2 className="font-semibold mb-2 text-red-800">Test Error</h2>
            <p className="text-sm text-red-600">{testError}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {!isAuthenticated ? (
            <Button onClick={testAuth0Login} disabled={isLoading}>
              Test Auth0 Login
            </Button>
          ) : (
            <>
              <Button onClick={fetchTokens}>
                Fetch Tokens
              </Button>
              <Button 
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                variant="outline"
              >
                Logout
              </Button>
            </>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Debug Instructions</h2>
          <ol className="list-decimal list-inside text-sm space-y-1">
            <li>Check environment configuration above</li>
            <li>Click "Test Auth0 Login" to test the authentication flow</li>
            <li>Watch browser console for errors</li>
            <li>Check Auth0 Dashboard logs for failed attempts</li>
            <li>If login succeeds, fetch tokens to verify</li>
          </ol>
        </div>
      </div>
    </div>
  );
}