
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useShowingRequests, useUpdateShowingRequest } from "@/hooks/useShowingRequests";
import { useUserProfile } from "@/hooks/useUserProfile";
import { supabase } from "@/integrations/supabase/client";
import { isActiveShowing, isPendingRequest, type ShowingStatus } from "@/utils/showingStatus";

export const useBuyerDashboard = () => {
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const { user, session, loading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Data hooks
  const { 
    data: showingRequests = [], 
    isLoading: requestsLoading, 
    error: requestsError 
  } = useShowingRequests();
  
  const { 
    data: profile, 
    isLoading: profileLoading, 
    error: profileError 
  } = useUserProfile();

  const updateShowingMutation = useUpdateShowingRequest();

  // Redirect if not authenticated
  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    handlePendingTourRequest();
  }, [isAuthenticated, authLoading, navigate]);

  // Real-time subscription for buyer's showing requests
  useEffect(() => {
    if (!user && !session) return;

    const currentUserId = user?.id || session?.user?.id;
    if (!currentUserId) return;

    const channel = supabase
      .channel('buyer-showing-requests')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'showing_requests',
          filter: `user_id=eq.${currentUserId}`
        },
        (payload) => {
          console.log('Buyer real-time update received:', payload);
          // React Query will automatically refetch when invalidated by the main hook
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, session]);

  const handlePendingTourRequest = async () => {
    const pendingRequest = localStorage.getItem('pendingTourRequest');
    if (!pendingRequest || !user) return;

    try {
      const tourData = JSON.parse(pendingRequest);
      
      if (!tourData.properties?.length) {
        localStorage.removeItem('pendingTourRequest');
        return;
      }

      localStorage.removeItem('pendingTourRequest');
    } catch (error) {
      console.error('Error processing pending tour request:', error);
      localStorage.removeItem('pendingTourRequest');
    }
  };

  const handleRequestShowing = () => {
    setShowPropertyForm(true);
  };

  const handleCancelShowing = async (showingId: string) => {
    updateShowingMutation.mutate({
      id: showingId,
      updates: { status: 'cancelled' }
    });
  };

  const handleRescheduleShowing = (showingId: string) => {
    console.log('Reschedule showing:', showingId);
  };

  // Organize requests by type
  const pendingRequests = showingRequests.filter(req => isPendingRequest(req.status as ShowingStatus));
  const activeShowings = showingRequests.filter(req => isActiveShowing(req.status as ShowingStatus));
  const completedShowings = showingRequests.filter(req => req.status === 'completed');

  return {
    // Data
    showingRequests,
    pendingRequests,
    activeShowings,
    completedShowings,
    profile,
    
    // Loading states
    authLoading,
    requestsLoading,
    profileLoading,
    
    // Errors
    requestsError,
    profileError,
    
    // UI state
    showPropertyForm,
    setShowPropertyForm,
    
    // Actions
    handleRequestShowing,
    handleCancelShowing,
    handleRescheduleShowing,
    
    // User info
    currentUser: user || session?.user,
    isAuthenticated
  };
};
