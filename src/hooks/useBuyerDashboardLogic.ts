
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useBuyerDashboard } from "@/hooks/useBuyerDashboard";
import { useShowingEligibility } from "@/hooks/useShowingEligibility";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { useMessages } from "@/hooks/useMessages";
import { supabase } from "@/integrations/supabase/client";
import { trackPropertyRequest, trackSubscription, trackShowingBooking, trackNavigation } from "@/utils/analytics";

interface EligibilityResult {
  eligible: boolean;
  reason: string;
  active_showing_count?: number;
  subscription_tier?: string;
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

export const useBuyerDashboardLogic = () => {
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("requested");
  
  const { toast } = useToast();
  const { eligibility, checkEligibility } = useShowingEligibility();
  const { isSubscribed, subscriptionTier, refreshStatus } = useSubscriptionStatus();
  
  const {
    profile,
    selectedShowing,
    agreements,
    loading,
    authLoading,
    user,
    session,
    pendingRequests,
    activeShowings,
    completedShowings,
    handleCancelShowing,
    handleRescheduleShowing,
    handleConfirmShowing,
    handleAgreementSign,
    fetchUserData,
    fetchShowingRequests
  } = useBuyerDashboard();

  const currentUser = user || session?.user;
  const { unreadCount, sendMessage, getMessagesForShowing } = useMessages(currentUser?.id || '');

  // Add real-time updates for showing requests
  useEffect(() => {
    if (!currentUser?.id) return;

    console.log('Setting up real-time updates for user:', currentUser.id);
    
    const channel = supabase
      .channel('showing-requests-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'showing_requests',
          filter: `user_id=eq.${currentUser.id}`
        },
        (payload) => {
          console.log('Real-time showing request update:', payload);
          // Refresh showing requests when any change occurs
          fetchShowingRequests();
        }
      )
      .subscribe((status) => {
        console.log('Real-time subscription status:', status);
      });

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [currentUser?.id, fetchShowingRequests]);

  const handleRequestShowing = async () => {
    // Track property request initiation
    trackPropertyRequest('dashboard_request', 'buyer');
    
    const currentEligibility = await checkEligibility() as EligibilityResult | null;
    
    if (!currentEligibility?.eligible) {
      if (currentEligibility?.reason === 'active_showing_exists') {
        toast({
          title: "Active Showing Exists",
          description: "You already have a showing scheduled. Complete or cancel it before booking another.",
          variant: "destructive"
        });
        return;
      } else if (currentEligibility?.reason === 'free_showing_used') {
        return;
      }
    }
    
    setShowPropertyForm(true);
  };

  const handlePropertyFormClose = () => {
    setShowPropertyForm(false);
    // Refresh data when form closes to ensure any new requests are shown
    setTimeout(() => {
      fetchShowingRequests();
    }, 1000);
  };

  const handleUpgradeClick = () => {
    console.log('Upgrade button clicked', {
      userId: user?.id,
      email: user?.email,
      eligibilityReason: eligibility?.reason,
      timestamp: new Date().toISOString()
    });
    
    // Track subscription start
    trackSubscription('start', 'premium');
    
    setShowSubscribeModal(true);
  };

  const handleSubscriptionComplete = async () => {
    console.log('Subscription completed from dashboard', {
      userId: user?.id,
      email: user?.email,
      timestamp: new Date().toISOString()
    });
    
    // Track subscription completion
    trackSubscription('complete', 'premium');
    
    await refreshStatus();
    await fetchUserData();
    
    toast({
      title: "Welcome to FirstLook Premium! 🎉",
      description: "You can now book unlimited home tours!",
    });
  };

  const handleConfirmShowingWithModal = (showing: any) => {
    // Track showing confirmation
    trackShowingBooking('confirmed');
    
    handleConfirmShowing(showing);
    setShowAgreementModal(true);
  };

  const handleAgreementSignWithModal = async (name: string) => {
    // Track agreement signing
    trackShowingBooking('agreement_signed');
    
    await handleAgreementSign(name);
    setShowAgreementModal(false);
    // Refresh data after signing agreement
    await fetchShowingRequests();
  };

  const handleSendMessage = async (showingId: string) => {
    console.log('Opening messaging for showing:', showingId);
    
    // Find the showing to get agent information
    const allShowings = [...(pendingRequests || []), ...(activeShowings || []), ...(completedShowings || [])];
    const showing = allShowings.find(s => s.id === showingId) as ShowingRequest | undefined;
    
    if (!showing || !showing.assigned_agent_id) {
      toast({
        title: "Error",
        description: "No agent assigned to this showing yet.",
        variant: "destructive"
      });
      return;
    }

    // For now, show a placeholder message since we need to implement the actual messaging UI
    toast({
      title: "Message Agent",
      description: `Messaging with ${showing.assigned_agent_name || 'your agent'} for ${showing.property_address} - Coming soon!`,
    });
  };

  const handleStatClick = (targetTab: string) => {
    // Track navigation between dashboard tabs
    trackNavigation(targetTab, activeTab);
    
    // Allow navigation to all valid tabs including messages
    const validTabs = ["requested", "confirmed", "messages", "history", "profile"];
    if (validTabs.includes(targetTab)) {
      setActiveTab(targetTab);
    }
  };

  return {
    // State
    showPropertyForm,
    setShowPropertyForm: handlePropertyFormClose,
    showAgreementModal,
    setShowAgreementModal,
    showSubscribeModal,
    setShowSubscribeModal,
    activeTab,
    setActiveTab,
    
    // Data
    profile,
    selectedShowing,
    agreements,
    loading,
    authLoading,
    user,
    session,
    currentUser,
    pendingRequests,
    activeShowings,
    completedShowings,
    eligibility,
    isSubscribed,
    subscriptionTier,
    unreadCount,
    
    // Handlers
    handleRequestShowing,
    handleUpgradeClick,
    handleSubscriptionComplete,
    handleConfirmShowingWithModal,
    handleAgreementSignWithModal,
    handleSendMessage,
    handleStatClick,
    handleCancelShowing,
    handleRescheduleShowing,
    fetchShowingRequests
  };
};
