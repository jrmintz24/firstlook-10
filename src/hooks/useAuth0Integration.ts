import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface SupabaseUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;
  profile_picture_url?: string;
}

export const useAuth0Integration = () => {
  const { user: auth0User, isAuthenticated, isLoading, logout } = useAuth0();
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupabaseUser = async () => {
      if (isLoading) return;

      if (isAuthenticated && auth0User) {
        try {
          // Fetch corresponding Supabase user
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', auth0User.email)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching Supabase profile:', error);
          } else if (profile) {
            setSupabaseUser(profile);
          }
        } catch (error) {
          console.error('Error in Auth0 integration:', error);
        }
      } else {
        setSupabaseUser(null);
      }

      setLoading(false);
    };

    fetchSupabaseUser();
  }, [isAuthenticated, auth0User, isLoading]);

  const signOut = async () => {
    setSupabaseUser(null);
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return {
    user: supabaseUser,
    auth0User,
    isAuthenticated,
    loading,
    signOut
  };
};