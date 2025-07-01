
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

      // Handle profile creation and onboarding for sign-in events
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
            // First, check if profile exists and create/update if needed
            const { data: existingProfile, error: profileFetchError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

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

            if (profileFetchError?.code === 'PGRST116' || !existingProfile) {
              // Profile doesn't exist, create it
              console.log('AuthProvider: Creating new profile with signup data');
              
              // Safely access buyer_preferences with proper typing
              const existingBuyerPrefs = existingProfile?.buyer_preferences as Record<string, any> || {};
              
              const profileData = {
                id: session.user.id,
                first_name: formData?.firstName || session.user.user_metadata?.first_name || null,
                last_name: formData?.lastName || session.user.user_metadata?.last_name || null,
                phone: formData?.phone || session.user.user_metadata?.phone || null,
                user_type: 'buyer',
                buyer_preferences: {
                  budget: formData?.budget || null,
                  desiredAreas: formData?.desiredAreas ? formData.desiredAreas.split(',').map(s => s.trim()) : null
                },
                agent_details: {},
                communication_preferences: {},
                onboarding_completed: true, // Skip full onboarding for streamlined signup
                profile_completion_percentage: 85, // High completion since we collected key info
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
              }
            } else if (formData) {
              // Profile exists but we have new signup data to update
              console.log('AuthProvider: Updating existing profile with signup data');
              
              // Safely access buyer_preferences with proper typing
              const existingBuyerPrefs = existingProfile.buyer_preferences as Record<string, any> || {};
              
              const updates = {
                first_name: formData.firstName || existingProfile.first_name,
                last_name: formData.lastName || existingProfile.last_name,
                phone: formData.phone || existingProfile.phone,
                buyer_preferences: {
                  ...existingBuyerPrefs,
                  budget: formData.budget || existingBuyerPrefs.budget,
                  desiredAreas: formData.desiredAreas ? 
                    formData.desiredAreas.split(',').map(s => s.trim()) : 
                    existingBuyerPrefs.desiredAreas
                },
                onboarding_completed: true,
                profile_completion_percentage: 85,
                updated_at: new Date().toISOString()
              };

              const { error: updateError } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', session.user.id);

              if (updateError) {
                console.error('AuthProvider: Error updating profile:', updateError);
              }
            }

            // Check onboarding status
            const { data: profile } = await supabase
              .from('profiles')
              .select('onboarding_completed')
              .eq('id', session.user.id)
              .single();

            console.log('AuthProvider: Profile onboarding status:', profile);

            // Only redirect to full onboarding if explicitly false and no tour pending
            const pendingTourRequest = localStorage.getItem('pendingTourRequest');
            if (profile && profile.onboarding_completed === false && !pendingTourRequest) {
              console.log('AuthProvider: Redirecting to onboarding');
              setOnboardingChecked(true);
              window.location.href = '/onboarding';
            } else {
              console.log('AuthProvider: Onboarding completed or tour pending, staying on current page');
              setOnboardingChecked(true);
            }
          } catch (error) {
            console.error('AuthProvider: Error in post-signin processing:', error);
            setOnboardingChecked(true);
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
