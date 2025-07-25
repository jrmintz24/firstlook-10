
import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSimplifiedRealtime } from "./useSimplifiedRealtime";
import { useAuthValidation } from "./useAuthValidation";

export const useSimplifiedBuyerData = () => {
  const { user: currentUser, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [showingRequests, setShowingRequests] = useState<any[]>([]);
  const [agreements, setAgreements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [subscriptionsEnabled, setSubscriptionsEnabled] = useState(false);
  
  const { validateAuthSession } = useAuthValidation();

  // Fetch showing requests
  const fetchShowingRequests = useCallback(async () => {
    if (!currentUser?.id) return;
    
    try {
      console.log('Fetching showing requests for user:', currentUser.id);
      
      const { data, error } = await supabase
        .from('showing_requests')
        .select(`
          *,
          tour_agreements(*)
        `)
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log('Fetched showing requests:', data?.length || 0);
      setShowingRequests(data || []);
    } catch (error) {
      console.error('Error fetching showing requests:', error);
      setShowingRequests([]);
    }
  }, [currentUser?.id]);

  // Fetch profile
  const fetchProfile = useCallback(async () => {
    if (!currentUser?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    }
  }, [currentUser?.id]);

  // Fetch agreements
  const fetchAgreements = useCallback(async () => {
    if (!currentUser?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('tour_agreements')
        .select('*')
        .eq('buyer_id', currentUser.id);

      if (error) throw error;
      setAgreements(data || []);
    } catch (error) {
      console.error('Error fetching agreements:', error);
      setAgreements([]);
    }
  }, [currentUser?.id]);

  // Enable subscriptions with auth validation and buffer
  useEffect(() => {
    const enableSubscriptions = async () => {
      if (!currentUser?.id || authLoading) {
        setSubscriptionsEnabled(false);
        return;
      }

      // Add a small buffer to allow auth state to settle
      setTimeout(async () => {
        const { isValid } = await validateAuthSession();
        
        if (isValid) {
          console.log('Enabling subscriptions for user:', currentUser.id);
          setSubscriptionsEnabled(true);
        } else {
          console.warn('Auth session not valid, delaying subscription setup');
          // Retry after another buffer period
          setTimeout(async () => {
            const { isValid: retryValid } = await validateAuthSession();
            if (retryValid) {
              setSubscriptionsEnabled(true);
            }
          }, 2000);
        }
      }, 1000); // 1 second buffer
    };

    enableSubscriptions();
  }, [currentUser?.id, authLoading, validateAuthSession]);

  // Initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      if (!currentUser?.id || authLoading) return;
      
      setLoading(true);
      await Promise.all([
        fetchProfile(),
        fetchShowingRequests(),
        fetchAgreements()
      ]);
      setLoading(false);
      setIsInitialLoad(false);
    };

    loadInitialData();
  }, [currentUser?.id, authLoading, fetchProfile, fetchShowingRequests, fetchAgreements]);

  // Set up simplified realtime connection with auth validation
  useSimplifiedRealtime({
    userId: currentUser?.id || null,
    onShowingRequestsChange: fetchShowingRequests,
    enabled: subscriptionsEnabled && !!currentUser?.id
  });

  // Optimistic update function
  const optimisticUpdateShowing = useCallback((showingId: string, updates: any) => {
    setShowingRequests(prev => 
      prev.map(showing => 
        showing.id === showingId 
          ? { ...showing, ...updates }
          : showing
      )
    );
  }, []);

  // Categorize showings
  const { pendingRequests, activeShowings, completedShowings } = useMemo(() => {
    const pending = showingRequests.filter(req => 
      ['pending', 'agent_assigned', 'awaiting_agreement'].includes(req.status)
    );
    const active = showingRequests.filter(req => 
      ['confirmed'].includes(req.status)
    );
    const completed = showingRequests.filter(req => 
      ['completed'].includes(req.status)
    );

    return {
      pendingRequests: pending,
      activeShowings: active,
      completedShowings: completed
    };
  }, [showingRequests]);

  // Calculate showing counts
  const showingCounts = useMemo(() => ({
    pending: pendingRequests.length,
    active: activeShowings.length,
    completed: completedShowings.length,
    total: showingRequests.length
  }), [pendingRequests.length, activeShowings.length, completedShowings.length, showingRequests.length]);

  return {
    // Data
    profile,
    showingCounts,
    agreements,
    pendingRequests,
    activeShowings,
    completedShowings,
    
    // Loading states
    loading,
    detailLoading,
    authLoading,
    isInitialLoad,
    currentUser,
    
    // Functions
    refreshShowingRequests: fetchShowingRequests,
    optimisticUpdateShowing
  };
};
