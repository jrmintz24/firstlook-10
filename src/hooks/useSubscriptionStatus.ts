
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/Auth0AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionStatus {
  isSubscribed: boolean;
  subscriptionTier: string | null;
  subscriptionEnd: string | null;
  loading: boolean;
}

export const useSubscriptionStatus = () => {
  const [status, setStatus] = useState<SubscriptionStatus>({
    isSubscribed: false,
    subscriptionTier: null,
    subscriptionEnd: null,
    loading: true
  });
  const { user } = useAuth();

  const checkSubscriptionStatus = async () => {
    if (!user) {
      setStatus({
        isSubscribed: false,
        subscriptionTier: null,
        subscriptionEnd: null,
        loading: false
      });
      return;
    }

    try {
      // Check user metadata for plan tier first
      const planTier = user.user_metadata?.plan_tier || 'free';
      const isSubscribed = planTier !== 'free';

      // Also check subscribers table for backward compatibility
      const { data: subscriberData, error: subscriberError } = await supabase
        .from('subscribers')
        .select('subscribed, subscription_tier, subscription_end')
        .eq('user_id', user.id)
        .single();

      if (subscriberError && subscriberError.code !== 'PGRST116') {
        console.error('Error checking subscription status:', subscriberError);
      }

      const subscriptionEnd = subscriberData?.subscription_end;
      const isExpired = subscriptionEnd && new Date(subscriptionEnd) < new Date();
      
      setStatus({
        isSubscribed: isSubscribed && !isExpired,
        subscriptionTier: subscriberData?.subscription_tier || planTier,
        subscriptionEnd: subscriptionEnd,
        loading: false
      });

    } catch (error) {
      console.error('Error checking subscription status:', error);
      setStatus(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    checkSubscriptionStatus();
  }, [user]);

  return {
    ...status,
    refreshStatus: checkSubscriptionStatus
  };
};
