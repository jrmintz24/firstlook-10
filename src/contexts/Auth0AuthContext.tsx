import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { supabase } from '../lib/supabase';

interface Auth0User {
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

interface Auth0AuthContextType {
  user: Auth0User | null;
  loading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<void>;
  getProfile: () => Promise<any>;
  updateProfile: (updates: any) => Promise<void>;
  // Preserved Supabase methods (disabled but available)
  supabaseSignIn?: (email: string, password: string) => Promise<any>;
  supabaseSignUp?: (email: string, password: string, metadata?: any) => Promise<any>;
}

const Auth0AuthContext = createContext<Auth0AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(Auth0AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an Auth0AuthProvider');
  }
  return context;
};

export const Auth0AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    user: auth0User,
    isAuthenticated,
    isLoading,
    error,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently
  } = useAuth0();

  const [user, setUser] = useState<Auth0User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Sync Auth0 user with our user state and Supabase profile
  useEffect(() => {
    const syncUserData = async () => {
      console.log('Auth0AuthContext: Syncing user data', { isAuthenticated, isLoading, auth0User });
      
      if (isLoading) {
        setLoading(true);
        return;
      }

      if (isAuthenticated && auth0User) {
        try {
          // Transform Auth0 user to our format
          const transformedUser: Auth0User = {
            id: auth0User.sub!,
            email: auth0User.email!,
            email_verified: auth0User.email_verified || false,
            name: auth0User.name,
            given_name: auth0User.given_name,
            family_name: auth0User.family_name,
            picture: auth0User.picture,
            sub: auth0User.sub!,
            user_metadata: {}
          };

          // Fetch or create Supabase profile
          const { data: existingProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('auth_provider_id', auth0User.sub)
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Error fetching profile:', fetchError);
          }

          let userProfile = existingProfile;

          if (!existingProfile) {
            // Create new profile
            const newProfile = {
              email: auth0User.email,
              first_name: auth0User.given_name || auth0User.name?.split(' ')[0] || '',
              last_name: auth0User.family_name || auth0User.name?.split(' ').slice(1).join(' ') || '',
              user_type: 'buyer',
              auth_provider: 'auth0',
              auth_provider_id: auth0User.sub,
              profile_picture_url: auth0User.picture,
              onboarding_completed: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };

            const { data: createdProfile, error: createError } = await supabase
              .from('profiles')
              .insert([newProfile])
              .select()
              .single();

            if (createError) {
              console.error('Error creating profile:', createError);
            } else {
              userProfile = createdProfile;
            }
          }

          // Add profile data to user metadata
          if (userProfile) {
            transformedUser.user_metadata = {
              user_type: userProfile.user_type,
              first_name: userProfile.first_name,
              last_name: userProfile.last_name,
              ...userProfile
            };
            setProfile(userProfile);
          }

          setUser(transformedUser);
          setLoading(false);

          // Handle tour booking redirects
          const isFromTourBooking = localStorage.getItem('newUserFromPropertyRequest') === 'true';
          const pendingTourRequest = localStorage.getItem('pendingTourRequest');
          
          if (isFromTourBooking && pendingTourRequest) {
            console.log('Auth0AuthContext: Tour booking context detected');
            localStorage.removeItem('newUserFromPropertyRequest');
            // Navigation will be handled by the component that uses this context
          }
        } catch (error) {
          console.error('Error syncing user data:', error);
          setLoading(false);
        }
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    };

    syncUserData();
  }, [isAuthenticated, isLoading, auth0User]);

  // Auth methods
  const login = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: window.location.pathname
      }
    });
  };

  const logout = async () => {
    setUser(null);
    setProfile(null);
    await auth0Logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    // For Auth0, we'll redirect to signup screen
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

  const getProfile = async () => {
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('auth_provider_id', user.sub)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  };

  const updateProfile = async (updates: any) => {
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('auth_provider_id', user.sub)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }

    setProfile(data);
    
    // Update user metadata
    if (user) {
      setUser({
        ...user,
        user_metadata: {
          ...user.user_metadata,
          ...data
        }
      });
    }

    return data;
  };

  // Preserved Supabase methods (disabled but available as fallback)
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

  const value: Auth0AuthContextType = {
    user,
    loading: loading || isLoading,
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
    <Auth0AuthContext.Provider value={value}>
      {children}
    </Auth0AuthContext.Provider>
  );
};