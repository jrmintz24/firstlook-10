
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userType: string | null;
  signUp: (email: string, password: string, metadata: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithProvider: (provider: 'google' | 'facebook', userType: 'buyer' | 'agent') => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return profile?.user_type || null;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  }, []);

  const handleAuthStateChange = useCallback(async (event: string, session: Session | null) => {
    console.log('Auth state change:', { event, session: !!session });
    
    setSession(session);
    setUser(session?.user ?? null);
    
    if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
      // Use setTimeout to defer the async operation and prevent deadlocks
      setTimeout(async () => {
        try {
          const profileUserType = await fetchUserProfile(session.user.id);
          setUserType(profileUserType);
        } catch (error) {
          console.error('Error fetching user type:', error);
        }
      }, 0);
    } else if (event === 'SIGNED_OUT') {
      setUserType(null);
    }
    
    if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
      setLoading(false);
    }
  }, [fetchUserProfile]);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            const profileUserType = await fetchUserProfile(session.user.id);
            setUserType(profileUserType);
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [handleAuthStateChange, fetchUserProfile]);

  const signUp = async (email: string, password: string, metadata: any) => {
    try {
      const redirectUrl = metadata.user_type === 'agent' 
        ? `${window.location.origin}/agent-dashboard`
        : `${window.location.origin}/buyer-dashboard`;

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: metadata
        }
      });
      
      return { error };
    } catch (error) {
      console.error('SignUp error:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      return { error };
    } catch (error) {
      console.error('SignIn error:', error);
      return { error };
    }
  };

  const signInWithProvider = async (provider: 'google' | 'facebook', userType: 'buyer' | 'agent') => {
    try {
      const redirectUrl = userType === 'agent'
        ? `${window.location.origin}/agent-dashboard`
        : `${window.location.origin}/buyer-dashboard`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            user_type: userType
          }
        }
      });
      
      return { error };
    } catch (error) {
      console.error('Social login error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Starting sign out process...');
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      }
      
      // Clear state
      setSession(null);
      setUser(null);
      setUserType(null);
      
      // Clear any cached data
      localStorage.removeItem('firstlook-showing-popup-shown');
      
      // Redirect to home
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if there's an error, clear state and redirect
      setSession(null);
      setUser(null);
      setUserType(null);
      window.location.href = '/';
    }
  };

  const isAuthenticated = !!user && !!session;

  return (
    <AuthContext.Provider value={{
      user,
      session,
      userType,
      signUp,
      signIn,
      signInWithProvider,
      signOut,
      loading,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
