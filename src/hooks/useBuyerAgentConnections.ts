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
      
      // First, just fetch the basic buyer-agent matches
      const { data: matches, error: matchesError } = await supabase
        .from('buyer_agent_matches')
        .select('id, created_at, match_source, agent_id, showing_request_id')
        .eq('buyer_id', buyerId)
        .order('created_at', { ascending: false });

      if (matchesError) {
        console.error('Error fetching agent matches:', matchesError);
        setConnections([]);
        return;
      }

      // If no matches found, that's fine - just show empty state
      if (!matches || matches.length === 0) {
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