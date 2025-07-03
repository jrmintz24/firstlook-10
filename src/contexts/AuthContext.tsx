import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profileReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileReady, setProfileReady] = useState(false);
  const { toast } = useToast();

  const ensureProfileCreated = async (userId: string) => {
    try {
      // Check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (fetchError) {
        console.error('Error checking profile:', fetchError);
        return false;
      }

      if (existingProfile) {
        console.log('Profile already exists for user:', userId);
        setProfileReady(true);
        return true;
      }

      // Profile doesn't exist, wait a moment for the trigger to create it
      console.log('Profile not found, waiting for creation...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check again
      const { data: newProfile, error: recheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (recheckError) {
        console.error('Error rechecking profile:', recheckError);
        return false;
      }

      if (newProfile) {
        console.log('Profile confirmed after waiting:', userId);
        setProfileReady(true);
        return true;
      }

      console.log('Profile still not found after waiting');
      return false;
    } catch (error) {
      console.error('Error ensuring profile creation:', error);
      return false;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && event === 'SIGNED_IN') {
          // Ensure profile is created when user signs in
          setProfileReady(false);
          const profileCreated = await ensureProfileCreated(session.user.id);
          if (!profileCreated) {
            console.warn('Profile creation verification failed');
            setProfileReady(false);
          }
        } else if (!session?.user) {
          setProfileReady(false);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setProfileReady(false);
        const profileCreated = await ensureProfileCreated(session.user.id);
        if (!profileCreated) {
          console.warn('Initial profile verification failed');
          setProfileReady(false);
        }
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, profileReady }}>
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
