
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useOptimizedBuyerData } from "./useOptimizedBuyerData";
import { supabase } from "@/integrations/supabase/client";

export const useSimpleBuyerLogic = () => {
  const { toast } = useToast();
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [activeTab, setActiveTab] = useState("requested");
  const [selectedShowing, setSelectedShowing] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const {
    profile,
    loading,
    authLoading,
    currentUser,
    pendingRequests,
    activeShowings,
    completedShowings,
    refreshData,
    optimisticUpdateShowing
  } = useOptimizedBuyerData();

  // Computed values with proper status categorization
  const showingCounts = {
    pending: pendingRequests.length,
    active: activeShowings.length,
    completed: completedShowings.length
  };

  const eligibility = { eligible: true, reason: 'test' };
  const isSubscribed = false;
  const subscriptionTier = null;
  const unreadCount = 0;

  // Optimized handlers with instant UI feedback
  const handleRequestShowing = useCallback(() => {
    setShowPropertyForm(true);
  }, []);

  const handleUpgradeClick = useCallback(() => {
    setShowSubscribeModal(true);
  }, []);

  const handleSubscriptionComplete = useCallback(() => {
    setShowSubscribeModal(false);
    toast({
      title: "Subscription Active",
      description: "You now have access to unlimited tours!",
    });
  }, [toast]);

  const handleConfirmShowingWithModal = useCallback((showing: any) => {
    setSelectedShowing(showing);
    // Implementation for confirmation modal
    console.log('Confirming showing:', showing.id);
  }, []);

  const handleAgreementSignWithModal = useCallback(async (showingId: string, buyerName: string) => {
    try {
      // Optimistic update
      optimisticUpdateShowing(showingId, { status: 'confirmed' });
      
      const { error } = await supabase
        .from('tour_agreements')
        .upsert({
          showing_request_id: showingId,
          buyer_id: currentUser?.id,
          signed: true,
          signed_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update showing status
      const { error: showingError } = await supabase
        .from('showing_requests')
        .update({ status: 'confirmed' })
        .eq('id', showingId);

      if (showingError) throw showingError;

      toast({
        title: "Agreement Signed",
        description: "Your tour is now confirmed!",
      });

      refreshData();
    } catch (error) {
      console.error('Error signing agreement:', error);
      // Revert optimistic update
      refreshData();
      toast({
        title: "Error",
        description: "Failed to sign agreement. Please try again.",
        variant: "destructive"
      });
    }
  }, [currentUser, optimisticUpdateShowing, refreshData, toast]);

  const handleSignAgreementFromCard = useCallback((showingId: string, displayName: string) => {
    setSelectedShowing({ id: showingId });
    setShowAgreementModal(true);
  }, []);

  const handleSendMessage = useCallback((showingId: string) => {
    setActiveTab("messages");
    console.log('Opening messages for showing:', showingId);
  }, []);

  const handleStatClick = useCallback((targetTab: string) => {
    setActiveTab(targetTab);
  }, []);

  const handleCancelShowing = useCallback(async (showingId: string) => {
    try {
      // Optimistic update
      optimisticUpdateShowing(showingId, { status: 'cancelled' });

      const { error } = await supabase
        .from('showing_requests')
        .update({ status: 'cancelled' })
        .eq('id', showingId);

      if (error) throw error;

      toast({
        title: "Tour Cancelled",
        description: "Your tour request has been cancelled.",
      });

      refreshData();
    } catch (error) {
      console.error('Error cancelling showing:', error);
      // Revert optimistic update
      refreshData();
      toast({
        title: "Error",
        description: "Failed to cancel tour. Please try again.",
        variant: "destructive"
      });
    }
  }, [optimisticUpdateShowing, refreshData, toast]);

  const handleRescheduleShowing = useCallback((showingId: string) => {
    const showing = [...pendingRequests, ...activeShowings].find(s => s.id === showingId);
    if (showing) {
      setSelectedShowing(showing);
      setShowRescheduleModal(true);
    }
  }, [pendingRequests, activeShowings]);

  const handleRescheduleSuccess = useCallback(() => {
    setShowRescheduleModal(false);
    setSelectedShowing(null);
    refreshData();
    toast({
      title: "Tour Rescheduled",
      description: "Your tour has been rescheduled successfully.",
    });
  }, [refreshData, toast]);

  const fetchShowingRequests = useCallback(async () => {
    await refreshData();
  }, [refreshData]);

  return {
    // State
    showPropertyForm,
    setShowPropertyForm,
    showAgreementModal,
    setShowAgreementModal,
    showSubscribeModal,
    setShowSubscribeModal,
    showRescheduleModal,
    setShowRescheduleModal,
    activeTab,
    setActiveTab,
    
    // Data
    profile,
    selectedShowing,
    loading,
    detailLoading,
    authLoading,
    currentUser,
    pendingRequests,
    activeShowings,
    completedShowings,
    showingCounts,
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
    handleSignAgreementFromCard,
    handleSendMessage,
    handleStatClick,
    handleCancelShowing,
    handleRescheduleShowing,
    handleRescheduleSuccess,
    fetchShowingRequests
  };
};
