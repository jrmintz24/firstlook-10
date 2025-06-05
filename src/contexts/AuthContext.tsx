
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userType: string | null;
  signUp: (email: string, password: string, metadata: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithProvider: (provider: 'google' | 'facebook', userType: 'buyer' | 'agent') => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return profile?.user_type || null;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', { event, session });
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch user type when user signs in
        if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          // Use setTimeout to defer the async operation
          setTimeout(async () => {
            const profileUserType = await fetchUserProfile(session.user.id);
            setUserType(profileUserType);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setUserType(null);
          setHasRedirected(false);
        }
        
        // Only set loading to false after we've processed the auth state
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          setLoading(false);
        }
      }
    );

    // Then get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session:', session);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const profileUserType = await fetchUserProfile(session.user.id);
        setUserType(profileUserType);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, metadata: any) => {
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
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    return { error };
  };

  const signInWithProvider = async (provider: 'google' | 'facebook', userType: 'buyer' | 'agent') => {
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
  };

  const signOut = async () => {
    try {
      console.log('Starting sign out process...');
      
      // Clear state immediately to prevent UI issues
      setSession(null);
      setUser(null);
      setUserType(null);
      setHasRedirected(false);
      
      // Attempt to sign out, but don't worry if it fails (session might already be expired)
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.log('Sign out warning (expected if session expired):', error.message);
      } else {
        console.log('Sign out successful');
      }
      
      // Always redirect to home regardless of sign out success/failure
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if there's an error, clear state and redirect
      setSession(null);
      setUser(null);
      setUserType(null);
      setHasRedirected(false);
      window.location.href = '/';
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      userType,
      signUp,
      signIn,
      signInWithProvider,
      signOut,
      loading
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
