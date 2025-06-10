import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { isValidShowingStatus } from "@/utils/showingStatus";
import { useNavigate } from "react-router-dom";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  user_type: string;
}

interface ShowingRequest {
  id: string;
  property_address: string;
  preferred_date: string | null;
  preferred_time: string | null;
  message: string | null;
  status: string;
  created_at: string;
  assigned_agent_name?: string | null;
  assigned_agent_phone?: string | null;
  assigned_agent_email?: string | null;
  estimated_confirmation_date?: string | null;
  status_updated_at?: string | null;
  user_id?: string | null;
}

interface ShowingRequestUpdates {
  status: string;
  status_updated_at: string;
  estimated_confirmation_date?: string;
  assigned_agent_id?: string | null;
  assigned_agent_name?: string | null;
  assigned_agent_phone?: string | null;
  assigned_agent_email?: string | null;
}

export const useAdminDashboard = () => {
  const [showingRequests, setShowingRequests] = useState<ShowingRequest[]>([]);
  const [agents, setAgents] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const fetchAdminData = async () => {
    const currentUser = user || session?.user;
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", currentUser.id)
      .single();

    if (profileError || !profileData || profileData.user_type !== "admin") {
      toast({
        title: "Access Denied",
        description: "Admin account required to view this page",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    const { data: requestsData } = await supabase
      .from("showing_requests")
      .select("*")
      .order("created_at", { ascending: false });

    setShowingRequests(requestsData || []);

    const { data: agentsData } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, phone, user_type")
      .eq("user_type", "agent");

    setAgents(agentsData || []);
    setLoading(false);
  };

  const assignToAgent = async (requestId: string, agent: Profile) => {
    const newStatus = "agent_assigned";

    if (!isValidShowingStatus(newStatus)) {
      toast({ title: "Error", description: "Invalid status", variant: "destructive" });
      return;
    }

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
    } else {
      toast({ title: "Assigned", description: "Agent assigned successfully" });
      fetchAdminData();
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
      return;
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
    } else {
      toast({ title: 'Approved', description: 'Agent request approved successfully.' });
      fetchAdminData();
    }
  };

  const handleStatusUpdate = async (
    requestId: string,
    newStatus: string,
    estimatedDate?: string
  ) => {
    if (!isValidShowingStatus(newStatus)) {
      toast({ title: "Error", description: "Invalid status", variant: "destructive" });
      return false;
    }

    const updates: ShowingRequestUpdates = {
      status: newStatus,
      status_updated_at: new Date().toISOString(),
    };
    if (estimatedDate) {
      updates.estimated_confirmation_date = estimatedDate;
    }

    const { error } = await supabase
      .from("showing_requests")
      .update(updates)
      .eq("id", requestId);

    if (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
      return false;
    }
    toast({ title: "Status Updated" });
    fetchAdminData();
    return true;
  };

  const approveShowingRequest = async (requestId: string) => {
    const newStatus = 'confirmed';
    const { error } = await supabase
      .from('showing_requests')
      .update({
        status: newStatus,
        status_updated_at: new Date().toISOString(),
      })
      .eq('id', requestId);

    if (error) {
      toast({ title: 'Error', description: 'Failed to approve request', variant: 'destructive' });
    } else {
      toast({ title: 'Approved', description: 'Showing request approved.' });
      fetchAdminData();
      // Call notification function
      await supabase.functions.invoke('notify-agent', {
        body: { requestId },
      });
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user && !session) {
      setLoading(false);
      navigate("/");
      return;
    }
    fetchAdminData();
  }, [user, session, authLoading, navigate]);

  return { showingRequests, agents, loading, assignToAgent, handleStatusUpdate, approveShowingRequest, approveAgentRequest };
};
