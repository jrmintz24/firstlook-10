
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  user_type: string;
}

export const useAgentManagement = () => {
  const [agents, setAgents] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAgents = async () => {
    console.log('Fetching agents...');
    setLoading(true);
    
    try {
      const { data: agentsData, error: agentsError } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, phone, user_type")
        .eq("user_type", "agent");

      console.log('Agents fetch result:', { 
        agentsData, 
        agentsError,
        count: agentsData?.length || 0 
      });

      if (agentsError) {
        console.error('Error fetching agents:', agentsError);
        toast({
          title: "Error",
          description: "Failed to load agents",
          variant: "destructive",
        });
        setAgents([]);
      } else {
        setAgents(agentsData || []);
      }
    } catch (error) {
      console.error('Exception in fetchAgents:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading agents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const assignToAgent = async (requestId: string, agent: Profile) => {
    const newStatus = "agent_assigned";

    const { error } = await supabase
      .from("showing_requests")
      .update({
        assigned_agent_id: agent.id,
        assigned_agent_name: `${agent.first_name} ${agent.last_name}`,
        assigned_agent_phone: agent.phone,
        assigned_agent_email: null,
        status: newStatus,
        status_updated_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    if (error) {
      toast({ title: "Error", description: "Failed to assign agent", variant: "destructive" });
      return false;
    } else {
      toast({ title: "Assigned", description: "Agent assigned successfully" });
      return true;
    }
  };

  const approveAgentRequest = async (requestId: string) => {
    const newStatus = 'agent_assigned';
    const { data: requestData, error: fetchError } = await supabase
      .from('showing_requests')
      .select('requested_agent_id, requested_agent_name, requested_agent_phone, requested_agent_email')
      .eq('id', requestId)
      .single();

    if (fetchError || !requestData) {
      toast({ title: 'Error', description: 'Failed to fetch request details', variant: 'destructive' });
      return false;
    }

    const { error } = await supabase
      .from('showing_requests')
      .update({
        assigned_agent_id: requestData.requested_agent_id,
        assigned_agent_name: requestData.requested_agent_name,
        assigned_agent_phone: requestData.requested_agent_phone,
        assigned_agent_email: requestData.requested_agent_email,
        status: newStatus,
        status_updated_at: new Date().toISOString(),
      })
      .eq('id', requestId);

    if (error) {
      toast({ title: 'Error', description: 'Failed to approve agent request', variant: 'destructive' });
      return false;
    } else {
      toast({ title: 'Approved', description: 'Agent request approved successfully.' });
      return true;
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return {
    agents,
    loading,
    assignToAgent,
    approveAgentRequest,
    fetchAgents
  };
};
