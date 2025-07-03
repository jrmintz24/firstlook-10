import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import * as authService from '../services/authService'
import { getUserTypeFromProfile, getUserRedirectPath } from '../utils/userTypeUtils'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, metadata?: Record<string, unknown> & { user_type?: string }) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
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
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('AuthProvider: Initial session:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthProvider: Auth state changed:', event, session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Handle profile creation for new signups only
      if (event === 'SIGNED_IN' && session?.user) {
        // Use setTimeout to avoid blocking auth state change
        setTimeout(async () => {
          await handleProfileCreation(session.user);
          
          // Check if we need to redirect based on user type
          await handleUserRedirect(session.user);
        }, 100);
      }
    });

    return () => subscription.unsubscribe();
  }, []); // Simplified dependency array

  const handleUserRedirect = async (user: User) => {
    try {
      // Get user type from profile or metadata
      let userType = user.user_metadata?.user_type;
      
      if (!userType) {
        // Fallback to profile table
        userType = await getUserTypeFromProfile(user.id);
      }
      
      if (userType) {
        const expectedPath = getUserRedirectPath(userType);
        const currentPath = window.location.pathname;
        
        // Only redirect if we're on the wrong dashboard
        if (currentPath !== expectedPath && 
            (currentPath === '/buyer-dashboard' || currentPath === '/agent-dashboard' || currentPath === '/admin-dashboard')) {
          console.log('AuthProvider: Redirecting user to correct dashboard:', expectedPath);
          window.location.href = expectedPath;
        }
      }
    } catch (error) {
      console.error('AuthProvider: Error handling user redirect:', error);
    }
  };

  const handleProfileCreation = async (user: User) => {
    try {
      // Check if profile exists
      const { data: existingProfile, error: profileFetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Only create profile if it doesn't exist
      if (profileFetchError?.code === 'PGRST116' || !existingProfile) {
        console.log('AuthProvider: Creating new profile');
        
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
        
        const profileData = {
          id: user.id,
          first_name: formData?.firstName || user.user_metadata?.first_name || null,
          last_name: formData?.lastName || user.user_metadata?.last_name || null,
          phone: formData?.phone || user.user_metadata?.phone || null,
          user_type: user.user_metadata?.user_type || 'buyer',
          buyer_preferences: formData ? {
            budget: formData.budget || null,
            desiredAreas: formData.desiredAreas ? formData.desiredAreas.split(',').map(s => s.trim()) : null
          } : {},
          agent_details: {},
          communication_preferences: {},
          onboarding_completed: true, // Simplified - always mark as completed
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
          console.log('AuthProvider: Profile created successfully');
          
          // Send welcome email for new users (non-blocking)
          setTimeout(async () => {
            await sendWelcomeEmail(user, profileData);
          }, 500);
        }
      }
    } catch (error) {
      console.error('AuthProvider: Error in profile creation:', error);
    }
  };

  const sendWelcomeEmail = async (user: User, profileData: any) => {
    try {
      console.log('AuthProvider: Sending welcome email to:', user.email);
      
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
  ): Promise<void> => {
    const { error } = await authService.signUp(email, password, metadata)
    if (error) throw error
  }

  const signIn = async (email: string, password: string): Promise<void> => {
    const { error } = await authService.signIn(email, password)
    if (error) throw error
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
          redirectTo: `${window.location.origin}/`, // Generic redirect, will be handled by auth state change
          queryParams: {
            user_type: 'buyer' // Default, but will be overridden by existing profile
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
