
import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import * as authService from '../services/authService'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, metadata?: Record<string, unknown> & { user_type?: string }) => Promise<{ error: any; data?: any }>
  signIn: (email: string, password: string) => Promise<{ error: any; data?: any }>
  signOut: () => Promise<void>
  signInWithProvider: (
    provider: 'google' | 'github' | 'discord' | 'facebook'
  ) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener');
    
    // Check for Auth0 bridge session first
    const checkAuth0Bridge = () => {
      const auth0SessionStr = localStorage.getItem('auth0-bridge-session');
      if (auth0SessionStr) {
        try {
          const auth0Session = JSON.parse(auth0SessionStr);
          if (auth0Session.expires_at > Date.now()) {
            console.log('AuthProvider: Found valid Auth0 bridge session');
            setUser(auth0Session.user);
            setSession({ user: auth0Session.user } as any);
            setLoading(false);
            return true;
          } else {
            console.log('AuthProvider: Auth0 bridge session expired');
            localStorage.removeItem('auth0-bridge-session');
          }
        } catch (error) {
          console.error('AuthProvider: Error parsing Auth0 bridge session:', error);
          localStorage.removeItem('auth0-bridge-session');
        }
      }
      return false;
    };
    
    // Check Auth0 bridge first
    if (checkAuth0Bridge()) {
      return; // Skip Supabase auth if Auth0 session is active
    }
    
    // Set up auth state listener for regular Supabase auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthProvider: Auth state changed:', event, session?.user?.id, 'User type:', session?.user?.user_metadata?.user_type);
      
      // Set auth state immediately
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Handle profile creation for new signups and tour booking redirects
      if (event === 'SIGNED_IN' && session?.user) {
        // Check if this is from a tour booking
        const isFromTourBooking = localStorage.getItem('newUserFromPropertyRequest') === 'true';
        const pendingTourRequest = localStorage.getItem('pendingTourRequest');
        
        if (isFromTourBooking && pendingTourRequest) {
          console.log('AuthContext: Tour booking context detected, redirecting to buyer-dashboard');
          // Clear the flag
          localStorage.removeItem('newUserFromPropertyRequest');
          // Redirect to buyer dashboard where they can continue the tour
          setTimeout(() => {
            window.location.href = '/buyer-dashboard';
          }, 1000);
        }
        
        // Use setTimeout to avoid blocking auth state change
        setTimeout(async () => {
          await handleProfileCreation(session.user);
        }, 100);
      }
    });

    // THEN get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('AuthProvider: Initial session:', session?.user?.id, 'User type:', session?.user?.user_metadata?.user_type);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []); // Simplified dependency array

  const handleProfileCreation = async (user: User) => {
    try {
      console.log('AuthProvider: Checking profile for user:', user.id, 'User type:', user.user_metadata?.user_type);
      
      // Check if profile exists
      const { data: existingProfile, error: profileFetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Only create profile if it doesn't exist
      if (profileFetchError?.code === 'PGRST116' || !existingProfile) {
        console.log('AuthProvider: Creating new profile for user type:', user.user_metadata?.user_type);
        
        // Check for signup form data
        const signupFormData = localStorage.getItem('signupFormData');
        let formData = null;
        if (signupFormData) {
          try {
            formData = JSON.parse(signupFormData);
            localStorage.removeItem('signupFormData');
          } catch (e) {
            console.error('Error parsing signup form data:', e);
          }
        }
        
        // Ensure user_type is preserved from auth metadata
        const userType = user.user_metadata?.user_type || 'buyer';
        console.log('AuthProvider: Ensuring user type is preserved:', userType);
        
        const profileData = {
          id: user.id,
          first_name: formData?.firstName || user.user_metadata?.first_name || null,
          last_name: formData?.lastName || user.user_metadata?.last_name || null,
          phone: formData?.phone || user.user_metadata?.phone || null,
          user_type: userType, // Use preserved user type
          license_number: user.user_metadata?.license_number || null,
          buyer_preferences: formData ? {
            budget: formData.budget || null,
            desiredAreas: formData.desiredAreas ? formData.desiredAreas.split(',').map(s => s.trim()) : null
          } : {},
          agent_details: {},
          communication_preferences: {},
          onboarding_completed: true,
          profile_completion_percentage: 85,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { error: createError } = await supabase
          .from('profiles')
          .insert([profileData]);

        if (createError) {
          console.error('AuthProvider: Error creating profile:', createError);
        } else {
          console.log('AuthProvider: Profile created successfully for user type:', profileData.user_type);
          
          // Send welcome email for new users (non-blocking)
          setTimeout(async () => {
            await sendWelcomeEmail(user, profileData);
          }, 500);
        }
      } else {
        console.log('AuthProvider: Profile already exists for user:', user.id, 'Profile user type:', existingProfile?.user_type);
        
        // Ensure profile user_type matches auth metadata if there's a discrepancy
        if (existingProfile.user_type !== user.user_metadata?.user_type) {
          console.log('AuthProvider: User type mismatch detected, updating profile');
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ 
              user_type: user.user_metadata?.user_type || existingProfile.user_type,
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id);
            
          if (updateError) {
            console.error('AuthProvider: Error updating profile user type:', updateError);
          }
        }
      }
    } catch (error) {
      console.error('AuthProvider: Error in profile creation:', error);
    }
  };

  const sendWelcomeEmail = async (user: User, profileData: any) => {
    try {
      console.log('AuthProvider: Sending welcome email to:', user.email, 'User type:', profileData.user_type);
      
      const { error } = await supabase.functions.invoke('send-welcome-email', {
        body: {
          firstName: profileData.first_name || user.user_metadata?.first_name || '',
          email: user.email,
          userType: profileData.user_type || 'buyer'
        }
      });

      if (error) {
        console.error('AuthProvider: Error sending welcome email:', error);
      } else {
        console.log('AuthProvider: Welcome email sent successfully');
      }
    } catch (error) {
      console.error('AuthProvider: Welcome email error:', error);
      // Don't throw - email failures shouldn't block user registration
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    metadata: Record<string, unknown> & { user_type?: string } = { user_type: 'buyer' }
  ): Promise<{ error: any; data?: any }> => {
    console.log('AuthContext.signUp called with user_type:', metadata.user_type);
    
    // Simply call the signup service and let Supabase handle session creation naturally
    const result = await authService.signUp(email, password, metadata);
    
    if (result.error) {
      console.error('AuthContext: Signup error:', result.error);
      return result;
    }
    
    console.log('AuthContext: Signup successful, waiting for auth state change');
    return result;
  }

  const signIn = async (email: string, password: string): Promise<{ error: any; data?: any }> => {
    console.log('AuthContext.signIn called');
    return await authService.signIn(email, password)
  }

  const signOut = async (): Promise<void> => {
    await authService.signOut()
    // Clear local state immediately after successful sign out
    setUser(null)
    setSession(null)
  }

  const signInWithProvider = async (
    provider: 'google' | 'github' | 'discord' | 'facebook'
  ): Promise<void> => {
    // For now, only support google and facebook as per authService
    if (provider === 'google' || provider === 'facebook') {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/buyer-dashboard`,
          queryParams: {
            user_type: 'buyer'
          }
        }
      })
      if (error) throw error
    } else {
      throw new Error(`Provider ${provider} is not supported yet`)
    }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithProvider,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
