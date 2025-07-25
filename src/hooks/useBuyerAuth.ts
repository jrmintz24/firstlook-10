
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/SimpleAuth0Context";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  user_type: string;
  free_showing_used?: boolean;
  subscription_status?: string;
}

export const useBuyerAuth = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('BuyerAuth useEffect triggered');
    console.log('Auth loading:', authLoading);
    console.log('User:', user);
    console.log('Session:', session);
    
    if (authLoading) {
      console.log('Auth still loading, waiting...');
      return;
    }
    
    if (!user && !session) {
      console.log('No user/session found after auth loaded, redirecting to home');
      setLoading(false);
      navigate('/');
      return;
    }

    setLoading(false);
  }, [user, session, authLoading, navigate]);

  const currentUser = user || session?.user;
  const displayName = profile?.first_name || currentUser?.user_metadata?.first_name || currentUser?.email?.split('@')[0] || 'User';

  return {
    profile,
    setProfile,
    loading,
    authLoading,
    user,
    session,
    currentUser,
    displayName
  };
};
