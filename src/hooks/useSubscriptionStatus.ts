
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
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
      const { data, error } = await supabase
        .from('subscribers')
        .select('subscribed, subscription_tier, subscription_end')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking subscription status:', error);
        setStatus(prev => ({ ...prev, loading: false }));
        return;
      }

      const isSubscribed = data?.subscribed || false;
      const subscriptionEnd = data?.subscription_end;
      
      // Check if subscription has expired
      const isExpired = subscriptionEnd && new Date(subscriptionEnd) < new Date();
      
      setStatus({
        isSubscribed: isSubscribed && !isExpired,
        subscriptionTier: data?.subscription_tier || null,
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
