
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const TOUR_LIMITS = {
  free: 1,
  pro: 2,
  premium: 5,
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
    limit: 1,
    used: 0,
    remaining: 1,
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
        // Get user's plan tier
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('plan_tier')
          .eq('id', user.id)
          .single();

        if (userError) {
          console.error('Error fetching user plan:', userError);
          return;
        }

        const planTier = userData?.plan_tier || 'free';
        const limit = TOUR_LIMITS[planTier as keyof typeof TOUR_LIMITS] || 1;

        // Get current month's tour count
        const currentMonth = new Date();
        const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        
        const { data: tourData, error: tourError } = await supabase
          .from('tours')
          .select('id')
          .eq('buyer_id', user.id)
          .gte('created_at', startOfMonth.toISOString());

        if (tourError) {
          console.error('Error fetching tour count:', tourError);
          return;
        }

        const used = tourData?.length || 0;
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
