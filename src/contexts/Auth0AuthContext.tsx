import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { supabase } from '../lib/supabase';
import { v5 as uuidv5 } from 'uuid';

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
    console.error('useAuth called outside of Auth0AuthProvider');
    // Return a default object instead of throwing to prevent crashes
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
// Using a namespace UUID to ensure consistency across sessions
const AUTH0_NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'; // Standard UUID namespace

const generateUUIDFromAuth0Id = (auth0Id: string): string => {
  return uuidv5(auth0Id, AUTH0_NAMESPACE);
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
          // Generate consistent UUID from Auth0 ID
          const supabaseUserId = generateUUIDFromAuth0Id(auth0User.sub!);
          
          // Transform Auth0 user to our format
          const transformedUser: Auth0User = {
            id: supabaseUserId, // Use generated UUID for Supabase queries
            email: auth0User.email!,
            email_verified: auth0User.email_verified || false,
            name: auth0User.name,
            given_name: auth0User.given_name,
            family_name: auth0User.family_name,
            picture: auth0User.picture,
            sub: auth0User.sub!, // Keep original Auth0 ID
            user_metadata: {}
          };

          // Try to fetch or create Supabase profile, but don't block auth if it fails
          let userProfile = null;
          try {
            // First, try to find profile by UUID (for Auth0 users)
            const { data: profileByUuid, error: uuidError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', supabaseUserId)
              .single();

            if (uuidError && uuidError.code !== 'PGRST116') {
              console.warn('Profile fetch by UUID failed:', uuidError);
            }

            if (profileByUuid) {
              userProfile = profileByUuid;
              console.log('Found existing profile by UUID:', profileByUuid);
            } else {
              // Fallback: try to find profile by email (for existing users migrating to Auth0)
              const { data: profileByEmail, error: emailError } = await supabase
                .from('profiles')
                .select('*')
                .eq('email', auth0User.email)
                .single();

              if (emailError && emailError.code !== 'PGRST116') {
                console.warn('Profile fetch by email failed:', emailError);
              } else if (profileByEmail) {
                userProfile = profileByEmail;
                console.log('Found existing profile by email:', profileByEmail);
              }
            }

            if (!userProfile) {
              try {
                // Use RPC function to bypass RLS for Auth0 users
                const { data: createdProfile, error: createError } = await supabase
                  .rpc('create_auth0_profile', {
                    profile_id: supabaseUserId,
                    user_email: auth0User.email,
                    first_name: auth0User.given_name || auth0User.name?.split(' ')[0] || '',
                    last_name: auth0User.family_name || auth0User.name?.split(' ').slice(1).join(' ') || '',
                    user_type: 'buyer',
                    profile_picture_url: auth0User.picture
                  });

                if (createError) {
                  console.error('Profile creation via RPC failed:', {
                    error: createError,
                    message: createError.message,
                    code: createError.code,
                    details: createError.details,
                    hint: createError.hint
                  });
                  
                  // Fallback to direct insert
                  const newProfile = {
                    id: supabaseUserId,
                    email: auth0User.email,
                    first_name: auth0User.given_name || auth0User.name?.split(' ')[0] || '',
                    last_name: auth0User.family_name || auth0User.name?.split(' ').slice(1).join(' ') || '',
                    user_type: 'buyer',
                    profile_picture_url: auth0User.picture,
                    onboarding_completed: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  };

                  const { data: fallbackProfile, error: fallbackError } = await supabase
                    .from('profiles')
                    .insert([newProfile])
                    .select()
                    .single();

                  if (fallbackError) {
                    console.error('Fallback profile creation failed:', {
                      error: fallbackError,
                      message: fallbackError.message,
                      code: fallbackError.code,
                      details: fallbackError.details,
                      hint: fallbackError.hint,
                      newProfile: newProfile
                    });
                  } else {
                    userProfile = fallbackProfile;
                    console.log('Profile created via fallback:', fallbackProfile);
                  }
                } else {
                  userProfile = createdProfile;
                  console.log('Profile created via RPC:', createdProfile);
                }
              } catch (profileCreationError) {
                console.error('Profile creation completely failed:', profileCreationError);
              }
            }
          } catch (profileError) {
            console.warn('Supabase profile operations failed (non-blocking):', profileError);
            // Continue without profile data
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
    try {
      setUser(null);
      setProfile(null);
      // Clear any stored data
      localStorage.removeItem('newUserFromPropertyRequest');
      localStorage.removeItem('pendingTourRequest');
      
      await auth0Logout({
        logoutParams: {
          returnTo: window.location.origin
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect to home even if Auth0 logout fails
      window.location.href = window.location.origin;
    }
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
      .eq('email', user.email)
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
      .eq('email', user.email)
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