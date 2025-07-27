import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AgentConnection {
  id: string;
  created_at: string;
  match_source: string;
  agent: {
    id: string;
    first_name: string;
    last_name: string;
    phone?: string;
    email?: string;
    photo_url?: string;
    agent_details?: any;
  };
  showing_request?: {
    property_address: string;
    preferred_date?: string;
    preferred_time?: string;
    status: string;
  };
}

export const useBuyerAgentConnections = (buyerId?: string) => {
  const [connections, setConnections] = useState<AgentConnection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!buyerId) {
      setLoading(false);
      return;
    }

    fetchAgentConnections();
  }, [buyerId]);

  const fetchAgentConnections = async () => {
    if (!buyerId) return;

    try {
      setLoading(true);
      console.log('[useBuyerAgentConnections] Fetching connections for buyer:', buyerId);
      
      // Try to fetch from buyer_agent_matches first
      let matches = [];
      try {
        const { data, error: matchesError } = await supabase
          .from('buyer_agent_matches')
          .select('id, created_at, match_source, agent_id, showing_request_id')
          .eq('buyer_id', buyerId)
          .order('created_at', { ascending: false });

        if (matchesError) throw matchesError;
        matches = data || [];
        console.log('[useBuyerAgentConnections] Found matches in buyer_agent_matches:', matches.length);
      } catch (matchesError) {
        console.warn('[useBuyerAgentConnections] buyer_agent_matches error, trying agent_referrals:', matchesError);
        
        // Fallback to agent_referrals table
        try {
          const { data, error: referralError } = await supabase
            .from('agent_referrals')
            .select('id, created_at, agent_id, showing_request_id')
            .eq('buyer_id', buyerId)
            .eq('referral_type', 'hire_agent')
            .eq('status', 'active')
            .order('created_at', { ascending: false });

          if (referralError) throw referralError;
          
          // Map agent_referrals to match buyer_agent_matches structure
          matches = data?.map(referral => ({
            id: referral.id,
            created_at: referral.created_at,
            match_source: 'hired_from_showing',
            agent_id: referral.agent_id,
            showing_request_id: referral.showing_request_id
          })) || [];
          console.log('[useBuyerAgentConnections] Found matches in agent_referrals:', matches.length);
        } catch (referralError) {
          console.error('[useBuyerAgentConnections] Both tables failed:', referralError);
          setConnections([]);
          return;
        }
      }

      // If no matches found, that's fine - just show empty state
      if (!matches || matches.length === 0) {
        console.log('[useBuyerAgentConnections] No agent connections found');
        setConnections([]);
        return;
      }

      // For each match, fetch the agent profile separately
      const formattedConnections: AgentConnection[] = [];
      
      for (const match of matches) {
        // Fetch agent profile
        const { data: agentProfile } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, phone, email, photo_url, agent_details')
          .eq('id', match.agent_id)
          .single();

        // Fetch showing request if exists
        let showingRequest = null;
        if (match.showing_request_id) {
          const { data: showing } = await supabase
            .from('showing_requests')
            .select('property_address, preferred_date, preferred_time, status')
            .eq('id', match.showing_request_id)
            .single();
          showingRequest = showing;
        }

        formattedConnections.push({
          id: match.id,
          created_at: match.created_at,
          match_source: match.match_source,
          agent: {
            id: agentProfile?.id || match.agent_id,
            first_name: agentProfile?.first_name || '',
            last_name: agentProfile?.last_name || '',
            phone: agentProfile?.phone,
            email: agentProfile?.email,
            photo_url: agentProfile?.photo_url,
            agent_details: agentProfile?.agent_details
          },
          showing_request: showingRequest ? {
            property_address: showingRequest.property_address,
            preferred_date: showingRequest.preferred_date,
            preferred_time: showingRequest.preferred_time,
            status: showingRequest.status
          } : undefined
        });
      }

      setConnections(formattedConnections);
    } catch (error) {
      console.error('Exception fetching agent connections:', error);
      // Only show error toast for unexpected exceptions, not for normal "no data" cases
      setConnections([]);
    } finally {
      setLoading(false);
    }
  };

  const handleContactAgent = async (agentId: string, method: 'phone' | 'email' | 'message') => {
    // TODO: Implement contact functionality
    console.log(`Contacting agent ${agentId} via ${method}`);
  };

  return {
    connections,
    loading,
    handleContactAgent,
    refetch: fetchAgentConnections
  };
};