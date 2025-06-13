
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  user_type: string;
}

export const useAdminAuth = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const verifyAdminAccess = async () => {
    const currentUser = user || session?.user;
    if (!currentUser) {
      console.log('No current user found');
      setLoading(false);
      return false;
    }

    console.log('Verifying admin access for user:', currentUser.id);

    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      console.log('Admin profile fetch result:', { profileData, profileError });

      if (profileError || !profileData || profileData.user_type !== "admin") {
        console.error('Access denied - not admin:', { profileError, profileData });
        toast({
          title: "Access Denied",
          description: "Admin account required to view this page",
          variant: "destructive",
        });
        navigate("/");
        return false;
      }

      setProfile(profileData);
      return true;
    } catch (error) {
      console.error('Exception in admin verification:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while verifying access",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) {
      console.log('Auth still loading...');
      return;
    }
    if (!user && !session) {
      console.log('No user or session found');
      setLoading(false);
      navigate("/");
      return;
    }
    console.log('Starting admin verification...');
    verifyAdminAccess();
  }, [user, session, authLoading, navigate]);

  return {
    profile,
    loading,
    authLoading,
    verifyAdminAccess
  };
};
