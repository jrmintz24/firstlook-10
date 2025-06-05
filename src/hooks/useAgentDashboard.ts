import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAssignShowingRequest } from "./useShowingRequests.tsx";

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

export const useAgentDashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showingRequests, setShowingRequests] = useState<ShowingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { assignToSelf } = useAssignShowingRequest();

  const fetchAgentData = async () => {
    const currentUser = user || session?.user;
    if (!currentUser) {
      console.log('No current user available for fetchAgentData');
      setLoading(false);
      return;
    }

    try {
      console.log('Starting to fetch agent data for:', currentUser.id);
      
      // Fetch profile to verify agent status
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      console.log('Profile fetch result:', { profileData, profileError });

      if (profileError || !profileData || profileData.user_type !== 'agent') {
        console.log('User is not an agent or profile not found');
        toast({
          title: "Access Denied",
          description: "You need to be an agent to access this dashboard.",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      setProfile(profileData);

      // Fetch all showing requests for agents
      const { data: requestsData, error: requestsError } = await supabase
        .from('showing_requests')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Requests fetch result:', { requestsData, requestsError });

      if (requestsError) {
        console.error('Requests error:', requestsError);
        setShowingRequests([]);
      } else {
        setShowingRequests(requestsData || []);
        console.log('Requests set:', requestsData);
      }
    } catch (error) {
      console.error('Error fetching agent data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive"
      });
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  const handleAssignToSelf = async (requestId: string) => {
    if (!profile) return;
    
    const success = await assignToSelf(requestId, profile);
    if (success) {
      fetchAgentData(); // Refresh data
    }
  };

  const handleStatusUpdate = async (requestId: string, newStatus: string, estimatedDate?: string) => {
    try {
      const updates: any = { status: newStatus };
      if (estimatedDate) {
        updates.estimated_confirmation_date = estimatedDate;
      }

      const { error } = await supabase
        .from('showing_requests')
        .update(updates)
        .eq('id', requestId);

      if (error) {
        console.error('Error updating status:', error);
        toast({
          title: "Error",
          description: "Failed to update status. Please try again.",
          variant: "destructive"
        });
        return false;
      } else {
        toast({
          title: "Status Updated",
          description: "The request status has been updated successfully.",
        });
        fetchAgentData(); // Refresh data
        return true;
      }
    } catch (error) {
      console.error('Error updating status:', error);
      return false;
    }
  };

  useEffect(() => {
    console.log('AgentDashboard useEffect triggered');
    console.log('Auth loading:', authLoading);
    console.log('User:', user);
    console.log('Session:', session);
    
    if (authLoading) {
      console.log('Auth still loading, waiting...');
      return;
    }
    
    if (!user && !session) {
      console.log('No user/session found, redirecting to home');
      setLoading(false);
      navigate('/');
      return;
    }

    if (user || session?.user) {
      console.log('User found, fetching agent data...');
      fetchAgentData();
    }
  }, [user, session, authLoading, navigate]);

  return {
    profile,
    showingRequests,
    loading,
    authLoading,
    handleAssignToSelf,
    handleStatusUpdate,
    fetchAgentData
  };
};
