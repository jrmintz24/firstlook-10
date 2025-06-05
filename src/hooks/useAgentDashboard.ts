
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useAgentShowingRequests, useAssignShowingRequest, useUpdateShowingRequest } from "@/hooks/useShowingRequests";
import { useUserProfile } from "@/hooks/useUserProfile";
import { supabase } from "@/integrations/supabase/client";
import { isActiveShowing, isPendingRequest, type ShowingStatus } from "@/utils/showingStatus";

export const useAgentDashboard = () => {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const { user, session, loading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Data hooks
  const { 
    data: showingRequests = [], 
    isLoading: requestsLoading, 
    error: requestsError 
  } = useAgentShowingRequests();
  
  const { 
    data: profile, 
    isLoading: profileLoading, 
    error: profileError 
  } = useUserProfile();

  const assignMutation = useAssignShowingRequest();
  const updateMutation = useUpdateShowingRequest();

  // Redirect if not authenticated or not an agent
  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Check if user is an agent
  useEffect(() => {
    if (profile && profile.user_type !== 'agent') {
      toast({
        title: "Access Denied",
        description: "You need to be an agent to access this dashboard.",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [profile, navigate, toast]);

  // Real-time subscription for showing requests
  useEffect(() => {
    if (!user && !session) return;

    const channel = supabase
      .channel('showing-requests-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'showing_requests'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          // React Query will automatically refetch when we invalidate
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, session]);

  const handleAssignToSelf = async (requestId: string) => {
    const currentUser = user || session?.user;
    if (!currentUser || !profile) return;

    assignMutation.mutate({
      requestId,
      agentInfo: {
        id: currentUser.id,
        name: `${profile.first_name} ${profile.last_name}`,
        phone: profile.phone || '',
        email: currentUser.email || ''
      }
    });
  };

  const handleStatusUpdate = async (requestId: string, newStatus: string, estimatedDate?: string) => {
    const updates: any = { status: newStatus };
    if (estimatedDate) {
      updates.estimated_confirmation_date = estimatedDate;
    }

    updateMutation.mutate({
      id: requestId,
      updates
    });

    setShowStatusModal(false);
    setSelectedRequest(null);
  };

  const openStatusModal = (requestId: string) => {
    const request = showingRequests.find(r => r.id === requestId);
    if (request) {
      setSelectedRequest(request);
      setShowStatusModal(true);
    }
  };

  const closeStatusModal = () => {
    setShowStatusModal(false);
    setSelectedRequest(null);
  };

  // Organize requests by type
  const currentUserId = user?.id || session?.user?.id;
  const unassignedRequests = showingRequests.filter(req => 
    isPendingRequest(req.status as ShowingStatus) && !req.assigned_agent_id
  );
  const myRequests = showingRequests.filter(req => 
    req.assigned_agent_id === currentUserId
  );
  const activeShowings = myRequests.filter(req => 
    isActiveShowing(req.status as ShowingStatus)
  );

  return {
    // Data
    profile,
    showingRequests,
    unassignedRequests,
    myRequests,
    activeShowings,
    
    // Loading states
    authLoading,
    requestsLoading,
    profileLoading,
    isLoading: requestsLoading || profileLoading,
    
    // Errors
    requestsError,
    profileError,
    
    // Modal state
    selectedRequest,
    showStatusModal,
    
    // Actions
    handleAssignToSelf,
    handleStatusUpdate,
    openStatusModal,
    closeStatusModal,
    
    // User info
    currentUser: user || session?.user,
    isAuthenticated,
    
    // Mutation states
    isAssigning: assignMutation.isPending,
    isUpdating: updateMutation.isPending
  };
};
