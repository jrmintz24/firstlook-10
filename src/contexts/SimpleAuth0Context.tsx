import React, { createContext, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { v5 as uuidv5 } from 'uuid';

interface SimpleAuthUser {
  id: string;
  email: string;
  email_verified: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  sub: string;
  user_metadata?: {
    user_type?: 'buyer' | 'agent' | 'admin';
    first_name?: string;
    last_name?: string;
    [key: string]: any;
  };
}

interface SimpleAuth0ContextType {
  user: SimpleAuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<void>;
  getProfile: () => Promise<any>;
  updateProfile: (updates: any) => Promise<void>;
  // Legacy methods for compatibility
  supabaseSignIn?: (email: string, password: string) => Promise<any>;
  supabaseSignUp?: (email: string, password: string, metadata?: any) => Promise<any>;
}

const SimpleAuth0Context = createContext<SimpleAuth0ContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(SimpleAuth0Context);
  if (!context) {
    console.error('useAuth called outside of SimpleAuth0Provider');
    return {
      user: null,
      loading: false,
      isAuthenticated: false,
      error: null,
      login: async () => {},
      logout: async () => {},
      signUp: async () => {},
      getProfile: async () => null,
      updateProfile: async () => {},
      supabaseSignIn: async () => ({ error: new Error('Auth disabled') }),
      supabaseSignUp: async () => ({ error: new Error('Auth disabled') })
    };
  }
  return context;
};

// Generate a consistent UUID from Auth0 ID
const AUTH0_NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

const generateUUIDFromAuth0Id = (auth0Id: string): string => {
  return uuidv5(auth0Id, AUTH0_NAMESPACE);
};

export const SimpleAuth0Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    user: auth0User,
    isAuthenticated,
    isLoading,
    error,
    loginWithRedirect,
    logout: auth0Logout,
  } = useAuth0();

  // Transform Auth0 user to our simple format with UUID
  const user: SimpleAuthUser | null = auth0User ? {
    id: generateUUIDFromAuth0Id(auth0User.sub!), // Generate UUID for Supabase compatibility
    email: auth0User.email!,
    email_verified: auth0User.email_verified || false,
    name: auth0User.name,
    given_name: auth0User.given_name,
    family_name: auth0User.family_name,
    picture: auth0User.picture,
    sub: auth0User.sub!, // Keep original Auth0 ID
    user_metadata: {
      user_type: 'buyer', // Default all users to buyer for now
      first_name: auth0User.given_name || auth0User.name?.split(' ')[0] || '',
      last_name: auth0User.family_name || auth0User.name?.split(' ').slice(1).join(' ') || ''
    }
  } : null;

  const login = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: window.location.pathname
      }
    });
  };

  const logout = async () => {
    localStorage.removeItem('newUserFromPropertyRequest');
    localStorage.removeItem('pendingTourRequest');
    
    await auth0Logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    await loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup',
        login_hint: email
      },
      appState: {
        returnTo: window.location.pathname,
        metadata
      }
    });
  };

  // Simplified profile methods - just return user data
  const getProfile = async () => {
    return user;
  };

  const updateProfile = async (updates: any) => {
    // For now, just log the update - we can enhance this later
    console.log('Profile update requested:', updates);
    return user;
  };

  // Legacy methods for compatibility
  const supabaseSignIn = async (email: string, password: string) => {
    console.warn('Supabase auth is disabled. Using Auth0 instead.');
    await login();
    return { error: new Error('Supabase auth disabled') };
  };

  const supabaseSignUp = async (email: string, password: string, metadata?: any) => {
    console.warn('Supabase auth is disabled. Using Auth0 instead.');
    await signUp(email, password, metadata);
    return { error: new Error('Supabase auth disabled') };
  };

  const value: SimpleAuth0ContextType = {
    user,
    loading: isLoading,
    isAuthenticated,
    error,
    login,
    logout,
    signUp,
    getProfile,
    updateProfile,
    supabaseSignIn,
    supabaseSignUp
  };

  return (
    <SimpleAuth0Context.Provider value={value}>
      {children}
    </SimpleAuth0Context.Provider>
  );
};