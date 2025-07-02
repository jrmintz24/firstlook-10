
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
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
  assigned_agent_id?: string | null;
  estimated_confirmation_date?: string | null;
  status_updated_at?: string | null;
  user_id?: string | null;
}

export const useOptimizedBuyerData = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [agreements, setAgreements] = useState<Record<string, boolean>>({});
  const [showingRequests, setShowingRequests] = useState<ShowingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const { user, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const fetchingRef = useRef(false);
  const realtimeChannelRef = useRef<any>(null);
  const fallbackIntervalRef = useRef<NodeJS.Timeout>();

  const currentUser = user || session?.user;

  // Corrected status categorization with proper workflow logic
  const categorizedRequests = useMemo(() => {
    // Pending: requests that haven't been fully confirmed yet
    const pendingRequests = showingRequests.filter(req => 
      ['pending', 'submitted', 'under_review', 'agent_assigned', 'agent_requested', 'agent_confirmed', 'awaiting_agreement'].includes(req.status)
    );
    
    // Active: tours that are confirmed and scheduled
    const activeShowings = showingRequests.filter(req => 
      ['confirmed', 'scheduled', 'in_progress'].includes(req.status)
    );
    
    // Completed: finished or cancelled tours
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

  // Optimized data fetching with proper error handling
  const fetchShowingRequests = useCallback(async () => {
    if (!currentUser) return [];

    try {
      const { data, error } = await supabase
        .from('showing_requests')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching showing requests:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Exception fetching showing requests:', error);
      return [];
    }
  }, [currentUser]);

  const fetchAgreements = useCallback(async () => {
    if (!currentUser) return {};

    try {
      const { data, error } = await supabase
        .from('tour_agreements')
        .select('showing_request_id, signed')
        .eq('buyer_id', currentUser.id);

      if (error) {
        console.error('Error fetching agreements:', error);
        return {};
      }

      return (data || []).reduce((acc, agreement) => {
        acc[agreement.showing_request_id] = agreement.signed;
        return acc;
      }, {} as Record<string, boolean>);
    } catch (error) {
      console.error('Exception fetching agreements:', error);
      return {};
    }
  }, [currentUser]);

  const fetchProfile = useCallback(async () => {
    if (!currentUser) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Exception fetching profile:', error);
      return null;
    }
  }, [currentUser]);

  // Consolidated data refresh function
  const refreshAllData = useCallback(async (isManualRefresh = false) => {
    if (!currentUser || fetchingRef.current) return;

    fetchingRef.current = true;
    if (isManualRefresh) {
      setIsRefreshing(true);
    }

    try {
      const [requestsData, agreementsData, profileData] = await Promise.all([
        fetchShowingRequests(),
        fetchAgreements(),
        fetchProfile()
      ]);

      setShowingRequests(requestsData);
      setAgreements(agreementsData);
      setProfile(profileData);

    } catch (error) {
      console.error('Error in refreshAllData:', error);
      toast({
        title: "Error",
        description: "Failed to refresh data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
      fetchingRef.current = false;
    }
  }, [currentUser, fetchShowingRequests, fetchAgreements, fetchProfile, toast]);

  // Improved real-time setup with fallback
  const setupRealtime = useCallback(() => {
    if (!currentUser) return;

    // Clean up existing channel
    if (realtimeChannelRef.current) {
      supabase.removeChannel(realtimeChannelRef.current);
    }

    // Set up real-time subscription
    const channel = supabase
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
          console.log('Real-time showing request change:', payload);
          
          // Update showing requests immediately for better UX
          setShowingRequests(prev => {
            const updated = [...prev];
            const index = updated.findIndex(req => req.id === payload.new?.id || req.id === payload.old?.id);
            
            if (payload.eventType === 'DELETE' && index >= 0) {
              updated.splice(index, 1);
            } else if (payload.eventType === 'INSERT') {
              updated.unshift(payload.new as ShowingRequest);
            } else if (payload.eventType === 'UPDATE' && index >= 0) {
              updated[index] = payload.new as ShowingRequest;
            }
            
            return updated;
          });
        }
      )
      .subscribe((status) => {
        console.log('Real-time subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          // Clear fallback polling when real-time works
          if (fallbackIntervalRef.current) {
            clearInterval(fallbackIntervalRef.current);
          }
        } else if (status === 'CHANNEL_ERROR') {
          // Set up fallback polling if real-time fails
          fallbackIntervalRef.current = setInterval(() => {
            refreshAllData(false);
          }, 30000); // Poll every 30 seconds
        }
      });

    realtimeChannelRef.current = channel;
  }, [currentUser, refreshAllData]);

  // Initial data load
  useEffect(() => {
    if (authLoading) return;
    
    if (!user && !session) {
      setLoading(false);
      navigate('/');
      return;
    }

    refreshAllData();
    setupRealtime();

    return () => {
      if (realtimeChannelRef.current) {
        supabase.removeChannel(realtimeChannelRef.current);
      }
      if (fallbackIntervalRef.current) {
        clearInterval(fallbackIntervalRef.current);
      }
    };
  }, [user, session, authLoading, navigate, refreshAllData, setupRealtime]);

  // Optimistic update function for better UX
  const optimisticUpdateShowing = useCallback((showingId: string, updates: Partial<ShowingRequest>) => {
    setShowingRequests(prev => 
      prev.map(showing => 
        showing.id === showingId 
          ? { ...showing, ...updates }
          : showing
      )
    );
  }, []);

  return {
    profile,
    agreements,
    loading,
    isRefreshing,
    authLoading,
    currentUser,
    refreshData: () => refreshAllData(true),
    optimisticUpdateShowing,
    ...categorizedRequests
  };
};
