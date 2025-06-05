
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAssignShowingRequest } from "./useAssignShowingRequest";

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

      // Fetch all showing requests for agents to see
      const { data: requestsData, error: requestsError } = await supabase
        .from('showing_requests')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Requests fetch result:', { requestsData, requestsError });

      if (requestsError) {
        console.error('Requests error:', requestsError);
        toast({
          title: "Error",
          description: "Failed to load showing requests.",
          variant: "destructive"
        });
        setShowingRequests([]);
      } else {
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

  const handleAssignToSelf = async (requestId: string) => {
    if (!profile) {
      console.error('No profile available for assignment');
      toast({
        title: "Error",
        description: "Profile not loaded. Please refresh the page.",
        variant: "destructive"
      });
      return;
    }
    
    console.log('Handling assignment with profile:', profile);
    const success = await assignToSelf(requestId, profile);
    if (success) {
      console.log('Assignment successful, refreshing data');
      fetchAgentData();
    }
  };

  const handleStatusUpdate = async (requestId: string, newStatus: string, estimatedDate?: string) => {
    console.log('Updating status:', { requestId, newStatus, estimatedDate });
    
    try {
      const updates: any = { 
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
