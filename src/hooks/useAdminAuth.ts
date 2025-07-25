
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/Auth0AuthContext";
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
  const [verificationComplete, setVerificationComplete] = useState(false);
  const { toast } = useToast();
  const { user, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const verifyAdminAccess = useCallback(async () => {
    if (verificationComplete) return true;

    const currentUser = user || session?.user;
    if (!currentUser) {
      console.log('useAdminAuth - No current user found');
      setLoading(false);
      return false;
    }

    console.log('useAdminAuth - Verifying admin access for user:', currentUser.id);

    try {
      // First check user metadata for quick verification
      const userType = currentUser.user_metadata?.user_type;
      console.log('useAdminAuth - User type from metadata:', userType);

      if (userType !== 'admin') {
        console.error('useAdminAuth - Access denied - not admin user type:', userType);
        toast({
          title: "Access Denied",
          description: "Admin account required to view this page",
          variant: "destructive",
        });
        navigate("/");
        return false;
      }

      // Then verify with database profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      console.log('useAdminAuth - Admin profile fetch result:', { profileData, profileError });

      if (profileError) {
        console.error('useAdminAuth - Error fetching profile:', profileError);
        toast({
          title: "Access Error",
          description: "Unable to verify admin access. Please try again.",
          variant: "destructive",
        });
        navigate("/");
        return false;
      }

      if (!profileData || profileData.user_type !== "admin") {
        console.error('useAdminAuth - Access denied - not admin in database:', { profileData });
        toast({
          title: "Access Denied",
          description: "Admin account required to view this page",
          variant: "destructive",
        });
        navigate("/");
        return false;
      }

      setProfile(profileData);
      setVerificationComplete(true);
      console.log('useAdminAuth - Admin access verified successfully');
      return true;
    } catch (error) {
      console.error('useAdminAuth - Exception in admin verification:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while verifying access",
        variant: "destructive",
      });
      navigate("/");
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, session, navigate, toast, verificationComplete]);

  useEffect(() => {
    if (authLoading) {
      console.log('useAdminAuth - Auth still loading...');
      return;
    }
    
    if (!user && !session) {
      console.log('useAdminAuth - No user or session found, redirecting to home');
      setLoading(false);
      navigate("/");
      return;
    }

    console.log('useAdminAuth - Starting admin verification...');
    verifyAdminAccess();
  }, [user, session, authLoading, verifyAdminAccess]);

  return {
    profile,
    loading,
    authLoading,
    verifyAdminAccess
  };
};
