
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/SimpleAuth0Context";
import { supabase } from "@/integrations/supabase/client";

const TOUR_LIMITS = {
  free: 5,
  pro: 50,
  premium: 100,
};

interface TourQuota {
  limit: number;
  used: number;
  remaining: number;
  isExceeded: boolean;
  loading: boolean;
}

export const useTourQuota = () => {
  const { user } = useAuth();
  const [quota, setQuota] = useState<TourQuota>({
    limit: 5,
    used: 0,
    remaining: 5,
    isExceeded: false,
    loading: true,
  });

  useEffect(() => {
    if (!user) {
      setQuota(prev => ({ ...prev, loading: false }));
      return;
    }

    const fetchTourQuota = async () => {
      try {
        // Get user's plan tier from profiles table or user metadata
        const planTier = user.user_metadata?.plan_tier || 'free';
        const limit = TOUR_LIMITS[planTier as keyof typeof TOUR_LIMITS] || 5;

        // Get current month's showing request count
        const currentMonth = new Date();
        const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        
        const { data: showingData, error: showingError } = await supabase
          .from('showing_requests')
          .select('id')
          .eq('user_id', user.id)
          .gte('created_at', startOfMonth.toISOString());

        if (showingError) {
          console.error('Error fetching showing request count:', showingError);
          return;
        }

        const used = showingData?.length || 0;
        const remaining = Math.max(0, limit - used);

        setQuota({
          limit,
          used,
          remaining,
          isExceeded: remaining <= 0,
          loading: false,
        });

      } catch (error) {
        console.error('Error in fetchTourQuota:', error);
        setQuota(prev => ({ ...prev, loading: false }));
      }
    };

    fetchTourQuota();
  }, [user]);

  return quota;
};
