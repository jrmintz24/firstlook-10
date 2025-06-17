
import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import * as authService from '../services/authService'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, metadata?: Record<string, unknown> & { user_type?: string }) => Promise<void>
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
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    let mounted = true;

    // Listen for auth changes first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      
      console.log('AuthContext - Auth state changed:', _event, session?.user?.email, session?.user?.user_metadata?.user_type)
      setSession(session)
      setUser(session?.user ?? null)
      
      if (initialized) {
        setLoading(false)
      }
    })

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      console.log('AuthContext - Initial session:', session?.user?.email, session?.user?.user_metadata?.user_type)
      setSession(session)
      setUser(session?.user ?? null)
      setInitialized(true)
      setLoading(false)
    })

    return () => {
      mounted = false;
      subscription.unsubscribe();
    }
  }, [initialized])

  const signIn = async (email: string, password: string): Promise<void> => {
    const { error } = await authService.signIn(email, password)
    if (error) throw error
  }

  const signUp = async (
    email: string, 
    password: string, 
    metadata: Record<string, unknown> & { user_type?: string } = { user_type: 'buyer' }
  ): Promise<void> => {
    const { error } = await authService.signUp(email, password, metadata)
    if (error) throw error
  }

  const signOut = async (): Promise<void> => {
    const { error } = await authService.signOut()
    if (error) throw error
    // Clear local state immediately after successful sign out
    setUser(null)
    setSession(null)
  }

  const signInWithProvider = async (
    provider: 'google' | 'github' | 'discord' | 'facebook'
  ): Promise<void> => {
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
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithProvider,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
