import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import * as authService from '../services/authService'

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
  const [onboardingChecked, setOnboardingChecked] = useState(false);

  useEffect(() => {
    console.log('AuthProvider useEffect: Setting up auth state listener');
    
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

      // Handle onboarding check for sign-in events only
      if (event === 'SIGNED_IN' && session?.user && !onboardingChecked) {
        console.log('AuthProvider: Checking onboarding status for user:', session.user.id);
        
        // Prevent checking onboarding if already on onboarding page
        const currentPath = window.location.pathname;
        if (currentPath.includes('/onboarding')) {
          console.log('AuthProvider: Already on onboarding page, skipping redirect');
          setOnboardingChecked(true);
          return;
        }

        // Also skip if on auth callback pages
        if (currentPath.includes('/auth') || currentPath.includes('/callback')) {
          console.log('AuthProvider: On auth page, skipping onboarding check');
          return;
        }
        
        // Use setTimeout to prevent blocking the auth state change
        setTimeout(async () => {
          try {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('onboarding_completed')
              .eq('id', session.user.id)
              .single();

            console.log('AuthProvider: Profile onboarding status:', profile, error);

            // Only redirect if onboarding is explicitly false or profile doesn't exist
            if (error?.code === 'PGRST116' || !profile || profile.onboarding_completed === false) {
              console.log('AuthProvider: Redirecting to onboarding');
              setOnboardingChecked(true);
              window.location.href = '/onboarding';
            } else {
              console.log('AuthProvider: Onboarding completed, staying on current page');
              setOnboardingChecked(true);
            }
          } catch (error) {
            console.error('AuthProvider: Error checking onboarding status:', error);
            // Only redirect on "not found" error
            if (error.code === 'PGRST116') {
              console.log('AuthProvider: Profile not found, redirecting to onboarding');
              setOnboardingChecked(true);
              window.location.href = '/onboarding';
            }
          }
        }, 100);
      }

      // Reset onboarding check flag when user signs out
      if (event === 'SIGNED_OUT') {
        setOnboardingChecked(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []); // Remove onboardingChecked dependency to prevent re-runs

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
    setOnboardingChecked(false)
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
