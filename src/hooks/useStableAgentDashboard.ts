
import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useStableSubscription } from "./useStableSubscription";

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

export const useStableAgentDashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showingRequests, setShowingRequests] = useState<ShowingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { toast } = useToast();
  const { user, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const currentUser = user || session?.user;

  // Memoize categorized requests
  const { pendingRequests, assignedRequests, completedRequests } = useMemo(() => {
    const pending = showingRequests.filter(req => 
      req.status === 'pending' && !req.assigned_agent_id
    );
    
    const assigned = showingRequests.filter(req => 
      req.assigned_agent_id === profile?.id && 
      ['agent_confirmed', 'confirmed', 'scheduled', 'awaiting_agreement'].includes(req.status)
    );
    
    const completed = showingRequests
      .filter(req => 
        req.assigned_agent_id === profile?.id && 
        ['completed', 'cancelled'].includes(req.status)
      )
      .sort((a, b) => {
        if (a.status !== b.status) {
          if (a.status === 'completed' && b.status === 'cancelled') return -1;
          if (a.status === 'cancelled' && b.status === 'completed') return 1;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

    return { pendingRequests: pending, assignedRequests: assigned, completedRequests: completed };
  }, [showingRequests, profile?.id]);

  const fetchAgentData = useCallback(async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      setHasError(false);
      console.log('Fetching stable agent data for user:', currentUser.id);

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

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

      // Fetch showing requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('showing_requests')
        .select('*')
        .or(`status.eq.pending,assigned_agent_id.eq.${currentUser.id}`)
        .order('created_at', { ascending: false });

      if (requestsError) {
        console.error('Requests error:', requestsError);
        setHasError(true);
        toast({
          title: "Error",
          description: "Failed to load showing requests.",
          variant: "destructive"
        });
        setShowingRequests([]);
      } else {
        console.log('Loaded stable requests for agent:', {
          total: requestsData?.length || 0,
          pending: requestsData?.filter(r => r.status === 'pending' && !r.assigned_agent_id).length || 0,
          assigned: requestsData?.filter(r => r.assigned_agent_id === currentUser.id).length || 0
        });
        setShowingRequests(requestsData || []);
      }
    } catch (error) {
      console.error('Error fetching stable agent data:', error);
      setHasError(true);
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [currentUser, toast, navigate]);

  // Stable subscription with better error handling
  const { connectionStatus, isConnected, retry } = useStableSubscription({
    channelName: `stable_agent_showing_requests_${profile?.id}`,
    table: 'showing_requests',
    onDataChange: fetchAgentData,
    enabled: !!profile?.id
  });

  const handleStatusUpdate = async (
    requestId: string,
    newStatus: string,
    estimatedDate?: string
  ) => {
    try {
      const updates: any = {
        status: newStatus,
        status_updated_at: new Date().toISOString()
      };
      if (estimatedDate) {
        updates.estimated_confirmation_date = estimatedDate;
      }

      const { error } = await supabase
        .from('showing_requests')
        .update(updates)
        .eq('id', requestId);

      if (error) {
        throw error;
      }

      toast({
        title: "Status Updated",
        description: "The request status has been updated successfully.",
      });
      
      // Refresh data
      await fetchAgentData();
      return true;
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleCancelShowing = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('showing_requests')
        .update({
          status: 'cancelled',
          status_updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Showing Cancelled",
        description: "The showing has been cancelled successfully.",
      });
      
      await fetchAgentData();
    } catch (error) {
      console.error('Error cancelling showing:', error);
      toast({
        title: "Error",
        description: "Failed to cancel showing. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRescheduleShowing = async (requestId: string, newDate: string, newTime?: string, reason?: string) => {
    try {
      const updateData: any = {
        preferred_date: newDate,
        preferred_time: newTime || null,
        status: 'pending',
        status_updated_at: new Date().toISOString()
      };

      if (reason) {
        updateData.message = `Reschedule request: ${reason}`;
      }

      const { error } = await supabase
        .from('showing_requests')
        .update(updateData)
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Showing Rescheduled",
        description: "The showing has been rescheduled successfully.",
      });
      
      await fetchAgentData();
      return true;
    } catch (error) {
      console.error('Error rescheduling showing:', error);
      toast({
        title: "Error",
        description: "Failed to reschedule showing. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    if (authLoading) return;
    
    if (!user && !session) {
      setLoading(false);
      navigate('/');
      return;
    }

    fetchAgentData();
  }, [user, session, authLoading, navigate, fetchAgentData]);

  return {
    profile,
    showingRequests,
    pendingRequests,
    assignedRequests,
    completedRequests,
    loading,
    hasError,
    authLoading,
    connectionStatus,
    isConnected,
    handleStatusUpdate,
    handleCancelShowing,
    handleRescheduleShowing,
    fetchAgentData: fetchAgentData,
    retryConnection: retry
  };
};
