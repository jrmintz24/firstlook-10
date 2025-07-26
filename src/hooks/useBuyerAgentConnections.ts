import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

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
      
      // Fetch buyer-agent matches with agent profile and showing request details
      const { data: matches, error } = await supabase
        .from('buyer_agent_matches')
        .select(`
          id,
          created_at,
          match_source,
          agent_id,
          showing_request_id,
          agent_profile:profiles!agent_id (
            id,
            first_name,
            last_name,
            phone,
            email,
            photo_url,
            agent_details
          ),
          showing_requests (
            property_address,
            preferred_date,
            preferred_time,
            status
          )
        `)
        .eq('buyer_id', buyerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching agent connections:', error);
        toast({
          title: "Error",
          description: "Failed to load agent connections. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Transform the data to match the expected format
      const formattedConnections: AgentConnection[] = (matches || []).map(match => ({
        id: match.id,
        created_at: match.created_at,
        match_source: match.match_source,
        agent: {
          id: match.agent_profile?.id || match.agent_id,
          first_name: match.agent_profile?.first_name || '',
          last_name: match.agent_profile?.last_name || '',
          phone: match.agent_profile?.phone,
          email: match.agent_profile?.email,
          photo_url: match.agent_profile?.photo_url,
          agent_details: match.agent_profile?.agent_details
        },
        showing_request: match.showing_requests ? {
          property_address: match.showing_requests.property_address,
          preferred_date: match.showing_requests.preferred_date,
          preferred_time: match.showing_requests.preferred_time,
          status: match.showing_requests.status
        } : undefined
      }));

      setConnections(formattedConnections);
    } catch (error) {
      console.error('Exception fetching agent connections:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading agent connections.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContactAgent = async (agentId: string, method: 'phone' | 'email' | 'message') => {
    // TODO: Implement contact functionality
    console.log(`Contacting agent ${agentId} via ${method}`);
    
    toast({
      title: "Contact Request",
      description: `Contacting agent via ${method}...`,
    });
  };

  return {
    connections,
    loading,
    handleContactAgent,
    refetch: fetchAgentConnections
  };
};