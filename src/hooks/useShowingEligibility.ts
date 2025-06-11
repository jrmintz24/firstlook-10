
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EligibilityResult {
  eligible: boolean;
  reason: string;
  active_showing_count?: number;
  subscription_tier?: string;
}

export const useShowingEligibility = () => {
  const [eligibility, setEligibility] = useState<EligibilityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const checkEligibility = async () => {
    if (!user) return null;

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('check_showing_eligibility', {
        user_uuid: user.id
      });

      if (error) {
        console.error('Error checking showing eligibility:', error);
        toast({
          title: "Error",
          description: "Failed to check showing eligibility. Please try again.",
          variant: "destructive"
        });
        return null;
      }

      // Cast the Json response to our expected type through unknown
      const eligibilityResult = data as unknown as EligibilityResult;
      setEligibility(eligibilityResult);
      return eligibilityResult;
    } catch (error) {
      console.error('Error checking showing eligibility:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const markFreeShowingUsed = async () => {
    if (!user) return false;

    try {
      const { data, error } = await supabase.rpc('mark_free_showing_used', {
        user_uuid: user.id
      });

      if (error) {
        console.error('Error marking free showing as used:', error);
        return false;
      }

      return data as unknown as boolean;
    } catch (error) {
      console.error('Error marking free showing as used:', error);
      return false;
    }
  };

  const resetFreeShowingEligibility = async () => {
    if (!user) return false;

    try {
      const { data, error } = await supabase.rpc('reset_free_showing_eligibility', {
        user_uuid: user.id
      });

      if (error) {
        console.error('Error resetting free showing eligibility:', error);
        return false;
      }

      return data as unknown as boolean;
    } catch (error) {
      console.error('Error resetting free showing eligibility:', error);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      checkEligibility();
    }
  }, [user]);

  return {
    eligibility,
    loading,
    checkEligibility,
    markFreeShowingUsed,
    resetFreeShowingEligibility
  };
};
