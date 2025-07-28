import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { usePostShowingActions } from "./usePostShowingActions";

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

export const useBuyerDashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedShowing, setSelectedShowing] = useState<ShowingRequest | null>(null);
  const [agreements, setAgreements] = useState<Record<string, boolean>>({});
  const [showingRequests, setShowingRequests] = useState<ShowingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { getActionsForShowing, getActionCount } = usePostShowingActions();

  const currentUser = user || session?.user;

  console.log('🔍 [DEBUG] useBuyerDashboard render count:', ++window.buyerDashboardRenderCount || (window.buyerDashboardRenderCount = 1));
  console.log('🔍 [DEBUG] Current user:', currentUser?.id, currentUser?.email);
  console.log('🔍 [DEBUG] Auth loading:', authLoading, 'Hook loading:', loading);
  console.log('🔍 [DEBUG] Showing requests count:', showingRequests?.length);
  console.log('🔍 [DEBUG] usePostShowingActions functions:', typeof getActionsForShowing, typeof getActionCount);

  // Updated categorization - include awaiting_agreement in pendingRequests
  const pendingRequests = showingRequests.filter(req => 
    ['pending', 'submitted', 'under_review', 'agent_assigned', 'awaiting_agreement'].includes(req.status)
  );
  
  const activeShowings = showingRequests.filter(req => 
    ['confirmed', 'agent_confirmed', 'scheduled'].includes(req.status)
  );
  
  // History includes completed and cancelled requests, with cancelled at the bottom
  const completedShowings = showingRequests
    .filter(req => ['completed', 'cancelled'].includes(req.status))
    .sort((a, b) => {
      // First sort by status: completed first, cancelled last
      if (a.status !== b.status) {
        if (a.status === 'completed' && b.status === 'cancelled') return -1;
        if (a.status === 'cancelled' && b.status === 'completed') return 1;
      }
      // Then sort by date (most recent first within each status)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const fetchUserData = useCallback(async () => {
    if (!currentUser) {
      console.log('useBuyerDashboard: No user found, stopping fetch');
      setLoading(false);
      return;
    }

    console.log('useBuyerDashboard: Fetching buyer data for user:', currentUser.id);

    try {
      // Fetch profile - don't fail if it doesn't exist for new users
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();

      console.log('useBuyerDashboard: Profile fetch result:', { profileData, profileError });

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('useBuyerDashboard: Profile error:', profileError);
      } else {
        setProfile(profileData);
        console.log('useBuyerDashboard: Profile set:', profileData);
      }

      // Note: fetchShowingRequests is called separately in useEffect to avoid circular dependency

      // Fetch agreements
      const { data: agreementsData, error: agreementsError } = await supabase
        .from('tour_agreements')
        .select('showing_request_id, signed')
        .eq('buyer_id', currentUser.id);

      console.log('useBuyerDashboard: Agreements fetch result:', { agreementsData, agreementsError });

      if (agreementsError) {
        console.error('useBuyerDashboard: Agreements error:', agreementsError);
      } else {
        const agreementsMap = (agreementsData || []).reduce((acc, agreement) => {
          acc[agreement.showing_request_id] = agreement.signed;
          return acc;
        }, {} as Record<string, boolean>);
        setAgreements(agreementsMap);
      }
    } catch (error) {
      console.error('useBuyerDashboard: Error fetching user data:', error);
    } finally {
      console.log('useBuyerDashboard: Setting loading to false');
      setLoading(false);
    }
  }, [currentUser]);

  const fetchShowingRequests = useCallback(async (isInitialLoad = false) => {
    if (!currentUser) {
      console.log('useBuyerDashboard: No user for showing requests fetch');
      return;
    }

    if (!isInitialLoad) {
      setIsRefreshing(true);
    }

    try {
      console.log('useBuyerDashboard: Fetching showing requests...');
      const { data: requestsData, error: requestsError } = await supabase
        .from('showing_requests')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      console.log('useBuyerDashboard: Requests fetch result:', { 
        count: requestsData?.length || 0, 
        error: requestsError 
      });

      if (requestsError) {
        console.error('useBuyerDashboard: Requests error:', requestsError);
        setShowingRequests([]);
      } else {
        setShowingRequests(requestsData || []);
      }
    } catch (error) {
      console.error('useBuyerDashboard: Error fetching showing requests:', error);
      setShowingRequests([]);
    } finally {
      if (!isInitialLoad) {
        setIsRefreshing(false);
      }
    }
  }, [currentUser]);

  const handleCancelShowing = useCallback(async (id: string) => {
    console.log('Cancelling showing:', id);
    
    try {
      const { data, error } = await supabase
        .from('showing_requests')
        .update({ 
          status: 'cancelled',
          status_updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();

      console.log('Cancel result:', { data, error });

      if (error) {
        console.error('Error cancelling showing:', error);
        return;
      }

      console.log('Showing cancelled successfully');
      fetchShowingRequests();
    } catch (error) {
      console.error('Exception cancelling showing:', error);
    }
  }, [fetchShowingRequests]);

  const handleRescheduleShowing = useCallback(async (id: string) => {
    console.log('Rescheduling showing:', id);
    // Implement reschedule logic here
    console.log('Rescheduling functionality will be available soon');
  }, []);

  const handleConfirmShowing = useCallback((showing: ShowingRequest) => {
    console.log('Confirming showing:', showing);
    setSelectedShowing(showing);
  }, []);

  const handleAgreementSign = useCallback(async (showing: ShowingRequest) => {
    if (!showing || !currentUser) {
      console.error('No showing or user for agreement signing');
      return;
    }

    console.log('Signing agreement for showing:', showing.id, 'for user:', currentUser.email);

    try {
      // First, try to find existing agreement
      const { data: existingAgreement, error: findError } = await supabase
        .from('tour_agreements')
        .select('*')
        .eq('showing_request_id', showing.id)
        .eq('buyer_id', currentUser.id)
        .maybeSingle();

      console.log('Existing agreement check:', { existingAgreement, findError });

      if (findError) {
        console.error('Error finding existing agreement:', findError);
        throw new Error('Failed to check existing agreement');
      }

      if (existingAgreement) {
        // Update existing agreement
        const { error: updateError } = await supabase
          .from('tour_agreements')
          .update({
            signed: true,
            signed_at: new Date().toISOString()
          })
          .eq('id', existingAgreement.id);

        if (updateError) {
          console.error('Error updating agreement:', updateError);
          throw new Error('Failed to sign agreement');
        }
      } else {
        // Create new agreement
        const { error: insertError } = await supabase
          .from('tour_agreements')
          .insert({
            showing_request_id: showing.id,
            buyer_id: currentUser.id,
            agreement_type: 'single_tour',
            signed: true,
            signed_at: new Date().toISOString(),
            email_token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            token_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          });

        if (insertError) {
          console.error('Error creating agreement:', insertError);
          throw new Error('Failed to create and sign agreement');
        }
      }

      // Update showing status to confirmed
      const { error: statusError } = await supabase
        .from('showing_requests')
        .update({
          status: 'confirmed',
          status_updated_at: new Date().toISOString()
        })
        .eq('id', showing.id);

      if (statusError) {
        console.error('Error updating showing status:', statusError);
        // Don't throw here as agreement is already signed
      }

      // Update local agreements state
      setAgreements(prev => ({
        ...prev,
        [showing.id]: true
      }));

      console.log('Agreement signed successfully');

      // Refresh the data to reflect changes
      try {
        await fetchShowingRequests();
      } catch (refreshError) {
        console.error('Error refreshing data after agreement signing:', refreshError);
        // Don't show toast for refresh errors, main operation succeeded
      }
    } catch (error: any) {
      console.error('Exception signing agreement:', error);
      throw error; // Re-throw so the caller can handle it
    }
  }, [currentUser, fetchShowingRequests]);

  useEffect(() => {
    console.log('useBuyerDashboard: useEffect triggered, authLoading:', authLoading, 'user:', !!currentUser);
    
    if (authLoading) {
      console.log('useBuyerDashboard: Auth still loading...');
      return;
    }
    
    if (!user && !session) {
      console.log('useBuyerDashboard: No user or session, stopping execution (ProtectedRoute handles auth)');
      setLoading(false);
      return;
    }

    console.log('useBuyerDashboard: User available, fetching user data');
    fetchUserData();
    fetchShowingRequests(true);
  }, [user, session, authLoading, fetchUserData, fetchShowingRequests]);

  // Create buyerActions object with stable function references
  const buyerActions = useMemo(() => {
    if (!showingRequests.length) return {};
    
    return showingRequests.reduce((acc, showing) => {
      const actions = getActionsForShowing(showing.id);
      const actionCount = getActionCount(showing.id);
      
      acc[showing.id] = {
        favorited: actions.favorited,
        madeOffer: actions.made_offer,
        hiredAgent: actions.hired_agent,
        scheduledMoreTours: actions.scheduled_more_tours,
        actionCount,
        latestAction: actions.actions[0]?.action_type || null,
        actionTimestamp: actions.actions[0]?.created_at || null
      };
      
      return acc;
    }, {} as Record<string, any>);
  }, [showingRequests]); // Only depend on showingRequests, not the functions

  return {
    profile,
    selectedShowing,
    agreements,
    loading,
    isRefreshing,
    authLoading,
    user,
    session,
    pendingRequests,
    activeShowings,
    completedShowings,
    buyerActions,
    handleCancelShowing,
    handleRescheduleShowing,
    handleConfirmShowing,
    handleAgreementSign,
    fetchUserData,
    fetchShowingRequests
  };
};
