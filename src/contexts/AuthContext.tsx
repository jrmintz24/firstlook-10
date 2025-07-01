
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
  const [hasCheckedOnboarding, setHasCheckedOnboarding] = useState(false);

  useEffect(() => {
    console.log('AuthProvider useEffect: Setting up auth state listener');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Only check onboarding for sign-in events and prevent duplicate checks
      if (event === 'SIGNED_IN' && session?.user && !hasCheckedOnboarding) {
        console.log('Checking onboarding status for user:', session.user.id);
        
        // Prevent checking onboarding if already on onboarding page
        if (window.location.pathname.includes('/onboarding')) {
          console.log('Already on onboarding page, skipping redirect');
          return;
        }
        
        setHasCheckedOnboarding(true);
        
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('id', session.user.id)
            .single();

          console.log('Profile onboarding status:', profile);

          // Only redirect to onboarding if profile doesn't exist OR onboarding is explicitly false
          if (!profile || profile.onboarding_completed === false) {
            console.log('Redirecting to onboarding');
            setTimeout(() => {
              window.location.href = '/onboarding';
            }, 100);
          } else {
            console.log('Onboarding completed, user can access dashboard');
          }
        } catch (error) {
          console.error('Error checking onboarding status:', error);
          // Only redirect to onboarding on error if it's a "not found" error
          if (error.code === 'PGRST116') {
            console.log('Profile not found, redirecting to onboarding');
            setTimeout(() => {
              window.location.href = '/onboarding';
            }, 100);
          }
        }
      }

      // Reset onboarding check flag when user signs out
      if (event === 'SIGNED_OUT') {
        setHasCheckedOnboarding(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []); // Remove hasCheckedOnboarding from dependencies to prevent re-renders

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
    setHasCheckedOnboarding(false)
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
