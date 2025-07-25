import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/SimpleAuth0Context";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useReliableSubscription } from "./useReliableSubscription";

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
  assigned_agent_id?: string | null;
  requested_agent_name?: string | null;
  requested_agent_phone?: string | null;
  requested_agent_email?: string | null;
  estimated_confirmation_date?: string | null;
  status_updated_at?: string | null;
  user_id?: string | null;
}

interface ShowingRequestUpdates {
  status: string;
  status_updated_at: string;
  estimated_confirmation_date?: string;
}

export const useAgentDashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showingRequests, setShowingRequests] = useState<ShowingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Categorize requests for manual assignment workflow
  const pendingRequests = showingRequests.filter(req => 
    req.status === 'pending' && !req.assigned_agent_id
  );
  
  // Requests assigned to this agent
  const assignedRequests = showingRequests.filter(req => 
    req.assigned_agent_id === profile?.id && 
    ['agent_confirmed', 'confirmed', 'scheduled', 'awaiting_agreement'].includes(req.status)
  );
  
  const completedRequests = showingRequests
    .filter(req => 
      req.assigned_agent_id === profile?.id && 
      ['completed', 'cancelled'].includes(req.status)
    )
    .sort((a, b) => {
      // First sort by status: completed first, cancelled last
      if (a.status !== b.status) {
        if (a.status === 'completed' && b.status === 'cancelled') return -1;
        if (a.status === 'cancelled' && b.status === 'completed') return 1;
      }
      // Then sort by date (most recent first within each status)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const fetchAgentData = async () => {
    const currentUser = user || session?.user;
    if (!currentUser) {
      console.log('No user found, stopping fetch');
      setLoading(false);
      return;
    }

    console.log('Fetching agent data for user:', currentUser.id);

    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      console.log('Profile fetch result:', { profileData, profileError });

      if (profileError || !profileData || profileData.user_type !== 'agent') {
        console.error('Profile error or not agent:', { profileError, profileData });
        toast({
          title: "Access Denied",
          description: "You need to be an agent to access this dashboard.",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      setProfile(profileData);

      // Fetch ALL showing requests for agents to see available and assigned ones
      const { data: requestsData, error: requestsError } = await supabase
        .from('showing_requests')
        .select('*')
        .or(`status.eq.pending,assigned_agent_id.eq.${currentUser.id}`)
        .order('created_at', { ascending: false });

      console.log('Requests fetch result:', { 
        requestsData, 
        requestsError, 
        agentId: currentUser.id,
        totalRequests: requestsData?.length || 0,
        pendingCount: requestsData?.filter(r => r.status === 'pending' && !r.assigned_agent_id).length || 0,
        assignedCount: requestsData?.filter(r => r.assigned_agent_id === currentUser.id).length || 0
      });

      if (requestsError) {
        console.error('Requests error:', requestsError);
        toast({
          title: "Error",
          description: "Failed to load showing requests.",
          variant: "destructive"
        });
        setShowingRequests([]);
      } else {
        console.log('Loaded requests for agent:', {
          total: requestsData?.length || 0,
          pending: requestsData?.filter(r => r.status === 'pending' && !r.assigned_agent_id).length || 0,
          assigned: requestsData?.filter(r => r.assigned_agent_id === currentUser.id).length || 0
        });
        setShowingRequests(requestsData || []);
      }
    } catch (error) {
      console.error('Error fetching agent data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    requestId: string,
    newStatus: string,
    estimatedDate?: string
  ) => {
    console.log('Updating status:', { requestId, newStatus, estimatedDate });
    
    try {
      const updates: ShowingRequestUpdates = {
        status: newStatus,
        status_updated_at: new Date().toISOString()
      };
      if (estimatedDate) {
        updates.estimated_confirmation_date = estimatedDate;
      }

      const { data, error } = await supabase
        .from('showing_requests')
        .update(updates)
        .eq('id', requestId)
        .select();

      console.log('Status update result:', { data, error });

      if (error) {
        console.error('Error updating status:', error);
        toast({
          title: "Error",
          description: "Failed to update status. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Status Updated",
        description: "The request status has been updated successfully.",
      });
      fetchAgentData();
      return true;
    } catch (error) {
      console.error('Exception updating status:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleCancelShowing = async (requestId: string) => {
    console.log('Cancelling showing:', requestId);
    
    try {
      const { error } = await supabase
        .from('showing_requests')
        .update({
          status: 'cancelled',
          status_updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) {
        console.error('Error cancelling showing:', error);
        toast({
          title: "Error",
          description: "Failed to cancel showing. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Showing Cancelled",
        description: "The showing has been cancelled successfully.",
      });
      
      fetchAgentData();
    } catch (error) {
      console.error('Exception cancelling showing:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while cancelling.",
        variant: "destructive"
      });
    }
  };

  const handleRescheduleShowing = async (requestId: string, newDate: string, newTime?: string, reason?: string) => {
    console.log('Rescheduling showing:', { requestId, newDate, newTime, reason });
    
    try {
      const updateData: any = {
        preferred_date: newDate,
        preferred_time: newTime || null,
        status: 'pending', // Reset to pending for re-confirmation
        status_updated_at: new Date().toISOString()
      };

      if (reason) {
        updateData.message = `Reschedule request: ${reason}`;
      }

      const { error } = await supabase
        .from('showing_requests')
        .update(updateData)
        .eq('id', requestId);

      if (error) {
        console.error('Error rescheduling showing:', error);
        toast({
          title: "Error",
          description: "Failed to reschedule showing. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Showing Rescheduled",
        description: "The showing has been rescheduled successfully.",
      });
      
      fetchAgentData();
      return true;
    } catch (error) {
      console.error('Exception rescheduling showing:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while rescheduling.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Set up reliable real-time subscription for showing requests
  const { cleanup: cleanupSubscription } = useReliableSubscription({
    channelName: `agent_showing_requests_${profile?.id}`,
    table: 'showing_requests',
    onDataChange: fetchAgentData,
    enabled: !!profile?.id
  });

  useEffect(() => {
    if (authLoading) {
      console.log('Auth still loading...');
      return;
    }
    
    if (!user && !session) {
      console.log('No user or session, redirecting to home');
      setLoading(false);
      navigate('/');
      return;
    }

    console.log('User available, fetching agent data');
    fetchAgentData();
  }, [user, session, authLoading, navigate]);

  useEffect(() => {
    return () => {
      cleanupSubscription();
    };
  }, [cleanupSubscription]);

  return {
    profile,
    showingRequests,
    pendingRequests,
    assignedRequests,
    completedRequests,
    loading,
    authLoading,
    handleStatusUpdate,
    handleCancelShowing,
    handleRescheduleShowing,
    fetchAgentData
  };
};
