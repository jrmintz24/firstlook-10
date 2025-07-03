
import { useState, useEffect, useCallback, useMemo } from "react";
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
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'polling' | 'error'>('connected');
  const { toast } = useToast();
  const { user, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const currentUser = user || session?.user;

  // Memoized categorized requests
  const pendingRequests = useMemo(() => 
    showingRequests.filter(req => 
      ['pending', 'submitted', 'under_review', 'agent_assigned', 'awaiting_agreement'].includes(req.status)
    ), [showingRequests]);
  
  const activeShowings = useMemo(() => 
    showingRequests.filter(req => 
      ['confirmed', 'agent_confirmed', 'scheduled'].includes(req.status)
    ), [showingRequests]);
  
  const completedShowings = useMemo(() => 
    showingRequests
      .filter(req => ['completed', 'cancelled'].includes(req.status))
      .sort((a, b) => {
        if (a.status !== b.status) {
          if (a.status === 'completed' && b.status === 'cancelled') return -1;
          if (a.status === 'cancelled' && b.status === 'completed') return 1;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }), [showingRequests]);

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
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Error in fetchShowingRequests:', error);
      setConnectionStatus('error');
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

  // Manual refresh function
  const refreshData = useCallback(async () => {
    if (!currentUser) return;
    
    console.log('Manual refresh triggered');
    setIsRefreshing(true);
    await fetchShowingRequests();
    setIsRefreshing(false);
  }, [currentUser, fetchShowingRequests]);

  // Enhanced real-time setup with circuit breaker pattern
  useEffect(() => {
    if (!currentUser) return;

    let retryCount = 0;
    const maxRetries = 3;
    let channel: any = null;

    const setupRealtime = () => {
      console.log('Setting up real-time subscription, attempt:', retryCount + 1);
      
      channel = supabase
        .channel(`showing_requests_${currentUser.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'showing_requests',
            filter: `user_id=eq.${currentUser.id}`
          },
          (payload) => {
            console.log('Real-time showing request change detected:', payload);
            fetchShowingRequests();
          }
        )
        .subscribe((status) => {
          console.log('Showing requests subscription status:', status);
          
          if (status === 'SUBSCRIBED') {
            setConnectionStatus('connected');
            retryCount = 0; // Reset retry count on success
          } else if (status === 'CHANNEL_ERROR' || status === 'CLOSED') {
            console.log('Real-time connection failed, switching to polling');
            setConnectionStatus('polling');
            
            if (retryCount < maxRetries) {
              retryCount++;
              setTimeout(setupRealtime, 2000 * retryCount); // Exponential backoff
            }
          }
        });
    };

    setupRealtime();

    return () => {
      if (channel) {
        console.log('Cleaning up showing requests subscription');
        supabase.removeChannel(channel);
      }
    };
  }, [currentUser, fetchShowingRequests]);

  // Polling fallback when real-time fails
  useEffect(() => {
    if (!currentUser || connectionStatus !== 'polling') return;

    console.log('Starting polling mode due to real-time connection issues');
    const pollInterval = setInterval(() => {
      console.log('Polling for showing requests updates...');
      fetchShowingRequests();
    }, 15000); // Poll every 15 seconds

    return () => {
      console.log('Stopping polling mode');
      clearInterval(pollInterval);
    };
  }, [currentUser, connectionStatus, fetchShowingRequests]);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user && !session) {
      setLoading(false);
      navigate('/');
      return;
    }

    fetchAllData();
  }, [user, session, authLoading, navigate, fetchAllData]);

  return {
    profile,
    loading,
    isRefreshing,
    authLoading,
    currentUser,
    connectionStatus,
    pendingRequests,
    activeShowings,
    completedShowings,
    refreshData,
    fetchShowingRequests
  };
};
