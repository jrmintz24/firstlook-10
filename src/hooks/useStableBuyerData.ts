
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

export const useStableBuyerData = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [agreements, setAgreements] = useState<Record<string, boolean>>({});
  const [showingRequests, setShowingRequests] = useState<ShowingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const { toast } = useToast();
  const { user, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const currentUser = user || session?.user;

  // Memoized categorized requests to prevent recalculation
  const categorizedRequests = useMemo(() => {
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

    return { pendingRequests, activeShowings, completedShowings };
  }, [showingRequests]);

  const fetchShowingRequests = useCallback(async (force = false) => {
    if (!currentUser) return;

    // Prevent rapid successive calls unless forced
    const now = Date.now();
    if (!force && now - lastFetchTime < 1000) return;
    setLastFetchTime(now);

    try {
      console.log('Fetching showing requests for user:', currentUser.id);
      
      const { data: requestsData, error: requestsError } = await supabase
        .from('showing_requests')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      console.log('Showing requests result:', { 
        count: requestsData?.length || 0, 
        error: requestsError,
        requests: requestsData
      });

      if (requestsError) {
        console.error('Requests error:', requestsError);
        toast({
          title: "Error",
          description: "Failed to load showing requests.",
          variant: "destructive"
        });
        return;
      }
      
      setShowingRequests(requestsData || []);
    } catch (error) {
      console.error('Error fetching showing requests:', error);
    }
  }, [currentUser, toast, lastFetchTime]);

  // Force immediate refresh function
  const forceRefresh = useCallback(async () => {
    console.log('Force refreshing data...');
    await fetchShowingRequests(true);
  }, [fetchShowingRequests]);

  // Optimized parallel data fetching
  const fetchAllData = useCallback(async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    console.log('Fetching buyer dashboard data for user:', currentUser.id);
    setLoading(true);

    try {
      // Fetch all data in parallel
      const [profileResult, requestsResult, agreementsResult] = await Promise.allSettled([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .maybeSingle(),
        
        supabase
          .from('showing_requests')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false }),
        
        supabase
          .from('tour_agreements')
          .select('showing_request_id, signed')
          .eq('buyer_id', currentUser.id)
      ]);

      // Handle profile result
      if (profileResult.status === 'fulfilled') {
        const { data: profileData, error: profileError } = profileResult.value;
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Profile error:', profileError);
        } else {
          setProfile(profileData);
        }
      }

      // Handle showing requests result
      if (requestsResult.status === 'fulfilled') {
        const { data: requestsData, error: requestsError } = requestsResult.value;
        if (requestsError) {
          console.error('Requests error:', requestsError);
          toast({
            title: "Error",
            description: "Failed to load showing requests.",
            variant: "destructive"
          });
        } else {
          console.log('Successfully loaded showing requests:', requestsData?.length || 0);
          setShowingRequests(requestsData || []);
        }
      }

      // Handle agreements result
      if (agreementsResult.status === 'fulfilled') {
        const { data: agreementsData, error: agreementsError } = agreementsResult.value;
        if (!agreementsError) {
          const agreementsMap = (agreementsData || []).reduce((acc, agreement) => {
            acc[agreement.showing_request_id] = agreement.signed;
            return acc;
          }, {} as Record<string, boolean>);
          setAgreements(agreementsMap);
        }
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [currentUser, toast]);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user && !session) {
      setLoading(false);
      navigate('/');
      return;
    }

    fetchAllData();
  }, [user, session, authLoading, navigate, fetchAllData]);

  // Enhanced polling with backoff when real-time fails
  useEffect(() => {
    if (!currentUser) return;

    let pollInterval: NodeJS.Timeout;
    let pollCount = 0;
    const maxPollCount = 10; // Stop aggressive polling after 10 attempts

    const startPolling = () => {
      pollInterval = setInterval(() => {
        console.log('Polling for updates... (attempt', pollCount + 1, ')');
        fetchShowingRequests();
        pollCount++;
        
        // Reduce polling frequency over time
        if (pollCount >= maxPollCount) {
          clearInterval(pollInterval);
          // Start slower polling
          pollInterval = setInterval(() => {
            fetchShowingRequests();
          }, 60000); // 1 minute intervals
        }
      }, 5000); // Start with 5 second intervals
    };

    startPolling();

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [currentUser, fetchShowingRequests]);

  return {
    profile,
    agreements,
    loading,
    authLoading,
    currentUser,
    fetchShowingRequests,
    forceRefresh,
    ...categorizedRequests
  };
};
