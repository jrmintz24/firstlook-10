
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useReliableRealtimeManager } from "./useReliableRealtimeManager";

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
  assigned_agent_id?: string | null;
  estimated_confirmation_date?: string | null;
  status_updated_at?: string | null;
  user_id?: string | null;
}

interface DashboardData {
  profile: Profile | null;
  showingRequests: ShowingRequest[];
  agreements: Record<string, boolean>;
  loading: boolean;
  error: string | null;
  isRefreshing: boolean;
  connectionStatus: 'connected' | 'connecting' | 'disconnected' | 'error';
}

export const useUnifiedDashboardData = (userType: 'buyer' | 'agent' = 'buyer') => {
  const [data, setData] = useState<DashboardData>({
    profile: null,
    showingRequests: [],
    agreements: {},
    loading: true,
    error: null,
    isRefreshing: false,
    connectionStatus: 'disconnected',
  });

  const { toast } = useToast();
  const { user, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { createSubscription, unsubscribeAll, getConnectionStatus } = useReliableRealtimeManager();
  
  const fetchingRef = useRef(false);
  const lastFetchRef = useRef<number>(0);
  const pollingIntervalRef = useRef<NodeJS.Timeout>();
  const toastRef = useRef(toast);
  
  // Update toast ref when toast changes but don't trigger re-renders
  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  const currentUser = user || session?.user;

  // Categorized requests based on user type
  const categorizedRequests = useMemo(() => {
    const requests = data.showingRequests;
    
    if (userType === 'buyer') {
      return {
        pendingRequests: requests.filter(req => 
          ['pending', 'submitted', 'under_review', 'agent_assigned', 'awaiting_agreement'].includes(req.status)
        ),
        activeShowings: requests.filter(req => 
          ['confirmed', 'agent_confirmed', 'scheduled'].includes(req.status)
        ),
        completedShowings: requests
          .filter(req => ['completed', 'cancelled'].includes(req.status))
          .sort((a, b) => {
            if (a.status !== b.status) {
              if (a.status === 'completed' && b.status === 'cancelled') return -1;
              if (a.status === 'cancelled' && b.status === 'completed') return 1;
            }
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          }),
      };
    } else {
      // Agent view
      return {
        pendingRequests: requests.filter(req => 
          req.status === 'pending' && !req.assigned_agent_id
        ),
        assignedRequests: requests.filter(req => 
          req.assigned_agent_id === data.profile?.id && 
          ['agent_confirmed', 'confirmed', 'scheduled', 'awaiting_agreement'].includes(req.status)
        ),
        completedRequests: requests
          .filter(req => 
            req.assigned_agent_id === data.profile?.id && 
            ['completed', 'cancelled'].includes(req.status)
          )
          .sort((a, b) => {
            if (a.status !== b.status) {
              if (a.status === 'completed' && b.status === 'cancelled') return -1;
              if (a.status === 'cancelled' && b.status === 'completed') return 1;
            }
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          }),
      };
    }
  }, [data.showingRequests, data.profile?.id, userType]);

  // Debounced fetch function with intelligent polling fallback
  const fetchData = useCallback(async (isRefresh = false) => {
    if (!currentUser || fetchingRef.current) {
      if (!currentUser && !authLoading) {
        setData(prev => ({ ...prev, loading: false }));
      }
      return;
    }

    // Prevent too frequent fetches
    const now = Date.now();
    if (now - lastFetchRef.current < 1000 && !isRefresh) {
      return;
    }

    fetchingRef.current = true;
    lastFetchRef.current = now;

    if (isRefresh) {
      setData(prev => ({ ...prev, isRefreshing: true, error: null }));
    }

    console.log(`Fetching ${userType} dashboard data for user:`, currentUser.id);

    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        throw new Error(`Profile fetch failed: ${profileError.message}`);
      }

      // Determine query based on user type
      let showingQuery = supabase.from('showing_requests').select('*');
      
      if (userType === 'buyer') {
        showingQuery = showingQuery.eq('user_id', currentUser.id);
      } else if (userType === 'agent') {
        // For agents, get pending requests OR requests assigned to them
        showingQuery = showingQuery.or(`status.eq.pending,assigned_agent_id.eq.${currentUser.id}`);
      }

      const { data: requestsData, error: requestsError } = await showingQuery
        .order('created_at', { ascending: false });

      if (requestsError) {
        throw new Error(`Requests fetch failed: ${requestsError.message}`);
      }

      // Fetch agreements (only for buyers)
      let agreementsData = [];
      if (userType === 'buyer') {
        const { data: agreementsResult, error: agreementsError } = await supabase
          .from('tour_agreements')
          .select('showing_request_id, signed')
          .eq('buyer_id', currentUser.id);

        if (agreementsError) {
          console.warn('Agreements fetch failed:', agreementsError);
        } else {
          agreementsData = agreementsResult || [];
        }
      }

      const agreementsMap = agreementsData.reduce((acc, agreement) => {
        acc[agreement.showing_request_id] = agreement.signed;
        return acc;
      }, {} as Record<string, boolean>);

      setData(prev => ({
        ...prev,
        profile: profileData,
        showingRequests: requestsData || [],
        agreements: agreementsMap,
        loading: false,
        isRefreshing: false,
        error: null,
      }));

    } catch (error) {
      console.error(`Error fetching ${userType} dashboard data:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      setData(prev => ({
        ...prev,
        loading: false,
        isRefreshing: false,
        error: errorMessage,
      }));

      toastRef.current({
        title: "Error",
        description: `Failed to load dashboard data: ${errorMessage}`,
        variant: "destructive"
      });
    } finally {
      fetchingRef.current = false;
    }
  }, [currentUser, userType, authLoading]);

  // Setup real-time subscriptions with fallback polling
  useEffect(() => {
    if (!currentUser || !data.profile) return;

    console.log(`Setting up realtime for ${userType}:`, currentUser.id);

    // Setup showing requests subscription
    createSubscription({
      channelName: `${userType}_showing_requests_${currentUser.id}`,
      table: 'showing_requests',
      filter: userType === 'buyer' 
        ? `user_id=eq.${currentUser.id}` 
        : `status=eq.pending,assigned_agent_id=eq.${currentUser.id}`,
      onDataChange: () => {
        console.log(`Realtime update detected for ${userType}, refreshing data`);
        fetchData(true);
      },
      enabled: true,
    });

    // Setup tour agreements subscription (buyers only)
    if (userType === 'buyer') {
      createSubscription({
        channelName: `buyer_agreements_${currentUser.id}`,
        table: 'tour_agreements',
        filter: `buyer_id=eq.${currentUser.id}`,
        onDataChange: () => {
          console.log('Tour agreement update detected, refreshing data');
          fetchData(true);
        },
        enabled: true,
      });
    }

    // Setup polling fallback - poll every 30 seconds if realtime is having issues
    const setupPolling = () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }

      pollingIntervalRef.current = setInterval(() => {
        const connectionStatus = getConnectionStatus(`${userType}_showing_requests_${currentUser.id}`);
        if (!connectionStatus.isConnected) {
          console.log('Realtime disconnected, using polling fallback');
          fetchData();
        }
      }, 30000);
    };

    setupPolling();

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [currentUser, data.profile, userType, createSubscription, fetchData, getConnectionStatus]);

  // Initial data fetch
  useEffect(() => {
    if (authLoading) return;
    
    if (!user && !session) {
      setData(prev => ({ ...prev, loading: false }));
      navigate('/');
      return;
    }

    fetchData();
  }, [user, session, authLoading, navigate, fetchData]);

  // Update connection status
  useEffect(() => {
    if (!currentUser) return;

    const interval = setInterval(() => {
      const status = getConnectionStatus(`${userType}_showing_requests_${currentUser.id}`);
      let connectionStatus: 'connected' | 'connecting' | 'disconnected' | 'error' = 'disconnected';
      
      if (status.isConnected) {
        connectionStatus = 'connected';
      } else if (status.isConnecting) {
        connectionStatus = 'connecting';
      } else if (status.lastError) {
        connectionStatus = 'error';
      }

      setData(prev => ({ ...prev, connectionStatus }));
    }, 5000);

    return () => clearInterval(interval);
  }, [currentUser, userType, getConnectionStatus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      unsubscribeAll();
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [unsubscribeAll]);

  const refresh = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  return {
    ...data,
    ...categorizedRequests,
    currentUser,
    authLoading,
    refresh,
  };
};
