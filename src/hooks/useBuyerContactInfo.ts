
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BuyerContactInfo {
  id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  photo_url?: string;
}

export const useBuyerContactInfo = (showingId: string, agentId: string) => {
  const [buyerInfo, setBuyerInfo] = useState<BuyerContactInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [canAccess, setCanAccess] = useState(false);

  useEffect(() => {
    const fetchBuyerInfo = async () => {
      if (!showingId || !agentId) return;

      setLoading(true);
      try {
        // First check if agent can access buyer contact info
        const { data: accessCheck, error: accessError } = await supabase
          .rpc('can_agent_access_buyer_contact', {
            p_showing_request_id: showingId,
            p_agent_id: agentId
          });

        if (accessError || !accessCheck) {
          setCanAccess(false);
          setBuyerInfo(null);
          return;
        }

        setCanAccess(true);

        // Get the showing request to find the buyer
        const { data: showing, error: showingError } = await supabase
          .from('showing_requests')
          .select('user_id')
          .eq('id', showingId)
          .single();

        if (showingError || !showing?.user_id) {
          throw new Error('Failed to get buyer information');
        }

        // Get buyer profile information
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, phone, photo_url')
          .eq('id', showing.user_id)
          .single();

        if (profileError) {
          throw new Error('Failed to get buyer profile');
        }

        setBuyerInfo(profile);
      } catch (error) {
        console.error('Error fetching buyer contact info:', error);
        setBuyerInfo(null);
        setCanAccess(false);
      } finally {
        setLoading(false);
      }
    };

    fetchBuyerInfo();
  }, [showingId, agentId]);

  return { buyerInfo, loading, canAccess };
};
