import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';

interface Auth0ProviderWrapperProps {
  children: React.ReactNode;
}

export const Auth0ProviderWrapper: React.FC<Auth0ProviderWrapperProps> = ({ children }) => {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_AUTH0_REDIRECT_URI || `${window.location.origin}/auth/callback`;

  console.log('Auth0 Config:', { domain, clientId, redirectUri, currentOrigin: window.location.origin });

  if (!domain || !clientId) {
    console.error('Auth0 configuration missing:', { domain, clientId });
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <p className="text-red-800">Auth0 configuration error. Please check environment variables.</p>
        <p className="text-sm text-red-600">Domain: {domain || 'undefined'}</p>
        <p className="text-sm text-red-600">Client ID: {clientId || 'undefined'}</p>
      </div>
    );
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience: `https://${domain}/api/v2/`,
        scope: "openid profile email"
      }}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
};