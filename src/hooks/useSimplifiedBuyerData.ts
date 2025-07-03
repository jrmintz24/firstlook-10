
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  user_type: string;
  free_showing_used?: boolean;
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
}

export const useSimplifiedBuyerData = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showingRequests, setShowingRequests] = useState<ShowingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const { user, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const currentUser = user || session?.user;

  // Memoized categorized requests
  const pendingRequests = showingRequests.filter(req => 
    ['pending', 'submitted', 'under_review', 'agent_assigned', 'awaiting_agreement'].includes(req.status)
  );
  
  const activeShowings = showingRequests.filter(req => 
    ['confirmed', 'agent_confirmed', 'scheduled'].includes(req.status)
  );
  
  const completedShowings = showingRequests
    .filter(req => ['completed', 'cancelled'].includes(req.status))
    .sort((a, b) => {
      if (a.status !== b.status) {
        if (a.status === 'completed' && b.status === 'cancelled') return -1;
        if (a.status === 'cancelled' && b.status === 'completed') return 1;
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const fetchShowingRequests = useCallback(async () => {
    if (!currentUser) {
      console.log('No current user available for fetchShowingRequests');
      return;
    }

    try {
      console.log('Fetching showing requests for user:', currentUser.id);
      
      const { data: showingData, error: showingError } = await supabase
        .from('showing_requests')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      console.log('Showing requests fetch result:', { showingData, showingError });

      if (showingError) {
        console.error('Error fetching showing requests:', showingError);
        throw showingError;
      }

      setShowingRequests(showingData || []);
    } catch (error) {
      console.error('Error in fetchShowingRequests:', error);
      toast({
        title: "Error",
        description: "Failed to load your showing requests. Please try again.",
        variant: "destructive"
      });
    }
  }, [currentUser, toast]);

  const fetchAllData = useCallback(async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    console.log('Fetching simplified buyer data for user:', currentUser.id);
    setIsRefreshing(true);

    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();

      console.log('Profile fetch result:', { profileData, profileError });

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile error:', profileError);
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive"
        });
      } else {
        setProfile(profileData);
      }

      // Fetch showing requests
      await fetchShowingRequests();

    } catch (error) {
      console.error('Error fetching simplified buyer data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [currentUser, toast, fetchShowingRequests]);

  // Refresh data function for manual refresh
  const refreshData = useCallback(async () => {
    if (!currentUser) return;
    
    setIsRefreshing(true);
    await fetchShowingRequests();
    setIsRefreshing(false);
  }, [currentUser, fetchShowingRequests]);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user && !session) {
      setLoading(false);
      navigate('/');
      return;
    }

    fetchAllData();
  }, [user, session, authLoading, navigate, fetchAllData]);

  // Set up polling fallback since realtime is failing
  useEffect(() => {
    if (!currentUser) return;

    const pollInterval = setInterval(() => {
      console.log('Polling for showing requests updates...');
      fetchShowingRequests();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(pollInterval);
  }, [currentUser, fetchShowingRequests]);

  return {
    profile,
    loading,
    isRefreshing,
    authLoading,
    currentUser,
    pendingRequests,
    activeShowings,
    completedShowings,
    refreshData,
    fetchShowingRequests
  };
};
