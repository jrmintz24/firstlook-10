
import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useRealtimeManager } from "./useRealtimeManager";
import { useEnhancedDataFetching } from "./useEnhancedDataFetching";

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
  const [agreements, setAgreements] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const currentUser = user || session?.user;

  // Enhanced data fetching with smart polling
  const {
    isRefreshing,
    startPolling,
    stopPolling,
    manualRefresh,
    currentPollingInterval,
    consecutiveErrors
  } = useEnhancedDataFetching({
    userId: currentUser?.id || null,
    enabled: !!currentUser
  });

  // Fetch showing requests with enhanced error handling
  const fetchShowingRequests = useCallback(async () => {
    if (!currentUser) return;

    try {
      console.log('Fetching showing requests for user:', currentUser.id);
      
      const { data: requestsData, error: requestsError } = await supabase
        .from('showing_requests')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (requestsError) {
        console.error('Requests error:', requestsError);
        throw requestsError;
      }

      console.log('Successfully loaded showing requests:', {
        total: requestsData?.length || 0,
        statuses: requestsData?.reduce((acc, req) => {
          acc[req.status] = (acc[req.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {}
      });
      
      setShowingRequests(requestsData || []);
      return requestsData || [];
    } catch (error) {
      console.error('Error fetching showing requests:', error);
      toast({
        title: "Error",
        description: "Failed to load your showing requests. Please try again.",
        variant: "destructive"
      });
      return [];
    }
  }, [currentUser, toast]);

  // Fetch tour agreements
  const fetchAgreements = useCallback(async () => {
    if (!currentUser) return;

    try {
      const { data: agreementsData, error: agreementsError } = await supabase
        .from('tour_agreements')
        .select('showing_request_id, signed')
        .eq('buyer_id', currentUser.id);

      if (agreementsError) {
        console.error('Agreements error:', agreementsError);
      } else {
        const agreementsMap = (agreementsData || []).reduce((acc, agreement) => {
          acc[agreement.showing_request_id] = agreement.signed;
          return acc;
        }, {} as Record<string, boolean>);
        setAgreements(agreementsMap);
      }
    } catch (error) {
      console.error('Error fetching agreements:', error);
    }
  }, [currentUser]);

  // Sign agreement function
  const signAgreement = useCallback(async (showingId: string, signerName: string): Promise<boolean> => {
    if (!currentUser) return false;

    try {
      // First, try to find existing agreement
      let { data: agreement, error: findError } = await supabase
        .from('tour_agreements')
        .select('*')
        .eq('showing_request_id', showingId)
        .eq('buyer_id', currentUser.id)
        .single();

      if (findError || !agreement) {
        // Create agreement if it doesn't exist
        console.log('Creating missing tour agreement...');
        const { data: newAgreement, error: createError } = await supabase
          .from('tour_agreements')
          .insert({
            showing_request_id: showingId,
            buyer_id: currentUser.id,
            agreement_type: 'single_tour',
            signed: false,
            email_token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            token_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          })
          .select('*')
          .single();

        if (createError) {
          console.error('Error creating agreement:', createError);
          throw new Error('Failed to create agreement');
        }
        agreement = newAgreement;
      }

      // Sign the agreement
      const { error: signError } = await supabase
        .from('tour_agreements')
        .update({
          signed: true,
          signed_at: new Date().toISOString()
        })
        .eq('id', agreement.id);

      if (signError) {
        console.error('Error signing agreement:', signError);
        throw new Error('Failed to sign agreement');
      }

      // Update showing status to confirmed
      const { error: statusError } = await supabase
        .from('showing_requests')
        .update({
          status: 'confirmed',
          status_updated_at: new Date().toISOString()
        })
        .eq('id', showingId);

      if (statusError) {
        console.error('Error updating showing status:', statusError);
        throw new Error('Failed to update showing status');
      }

      toast({
        title: "Agreement Signed",
        description: "Your tour agreement has been signed successfully. Your tour is now confirmed!"
      });

      // Refresh the data
      await fetchShowingRequests();
      await fetchAgreements();

      return true;
    } catch (error: any) {
      console.error('Error signing agreement:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign agreement. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  }, [currentUser, toast, fetchShowingRequests, fetchAgreements]);

  // Centralized realtime manager
  const { connectionStatus, isConnected, reconnect } = useRealtimeManager({
    userId: currentUser?.id || null,
    onShowingRequestsChange: useCallback(async () => {
      await fetchShowingRequests();
      await fetchAgreements();
    }, [fetchShowingRequests, fetchAgreements]),
    enabled: !!currentUser
  });

  // Memoized categorized requests with agreement awareness
  const categorizedRequests = useMemo(() => {
    const pendingRequests = showingRequests.filter(req => 
      ['pending', 'submitted', 'under_review', 'agent_assigned'].includes(req.status)
    );
    
    const awaitingAgreement = showingRequests.filter(req => 
      req.status === 'awaiting_agreement'
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

    return { pendingRequests, awaitingAgreement, activeShowings, completedShowings };
  }, [showingRequests]);

  // Fetch all data including profile
  const fetchAllData = useCallback(async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    console.log('Fetching all buyer dashboard data for user:', currentUser.id);

    try {
      // Fetch profile, showing requests, and agreements in parallel
      const [profileResult, requestsResult, agreementsResult] = await Promise.allSettled([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .maybeSingle(),
        
        fetchShowingRequests(),
        fetchAgreements()
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
  }, [currentUser, fetchShowingRequests, fetchAgreements, toast]);

  // Manual refresh function
  const refreshData = useCallback(async () => {
    if (!currentUser) return;
    
    console.log('Manual refresh triggered');
    const refreshedData = await manualRefresh();
    if (refreshedData) {
      setShowingRequests(refreshedData);
    }
    await fetchAgreements();
  }, [currentUser, manualRefresh, fetchAgreements]);

  // Initialize data and start polling based on connection status
  useEffect(() => {
    if (authLoading) return;
    
    if (!user && !session) {
      setLoading(false);
      navigate('/');
      return;
    }

    fetchAllData();
  }, [user, session, authLoading, navigate, fetchAllData]);

  // Smart polling management based on realtime connection
  useEffect(() => {
    if (!currentUser) return;

    if (isConnected) {
      console.log('Realtime connected, stopping polling');
      stopPolling();
    } else {
      console.log('Realtime not connected, starting smart polling');
      startPolling();
    }

    return () => {
      stopPolling();
    };
  }, [currentUser, isConnected, startPolling, stopPolling]);

  // Enhanced connection status
  const enhancedConnectionStatus = useMemo(() => {
    if (connectionStatus === 'connected') return 'connected';
    if (connectionStatus === 'connecting') return 'connecting';
    if (consecutiveErrors > 0) return 'error';
    return 'polling';
  }, [connectionStatus, consecutiveErrors]);

  return {
    profile,
    loading,
    isRefreshing,
    authLoading,
    currentUser,
    connectionStatus: enhancedConnectionStatus,
    isConnected,
    currentPollingInterval,
    consecutiveErrors,
    agreements,
    signAgreement,
    refreshData,
    fetchShowingRequests,
    reconnect,
    ...categorizedRequests
  };
};
