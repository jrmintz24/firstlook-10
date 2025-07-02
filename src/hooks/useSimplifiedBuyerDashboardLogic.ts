
import { useState, useCallback } from "react";
import { useSimplifiedBuyerData } from "./useSimplifiedBuyerData";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useSimplifiedBuyerDashboardLogic = () => {
  // UI State
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedShowing, setSelectedShowing] = useState<any>(null);

  // Data from simplified hook
  const {
    profile,
    showingRequests,
    agreements,
    pendingRequests,
    activeShowings,
    completedShowings,
    loading,
    error,
    authLoading,
    currentUser,
    refreshData
  } = useSimplifiedBuyerData();

  const { toast } = useToast();

  // Actions
  const handleRequestShowing = useCallback(() => {
    setShowPropertyForm(true);
  }, []);

  const handleUpgradeClick = useCallback(() => {
    setShowSubscribeModal(true);
  }, []);

  const handleSubscriptionComplete = useCallback(() => {
    setShowSubscribeModal(false);
    toast({
      title: "Success!",
      description: "Your subscription has been activated.",
    });
  }, [toast]);

  const handleConfirmShowingWithModal = useCallback((showing: any) => {
    setSelectedShowing(showing);
    setShowAgreementModal(true);
  }, []);

  const handleAgreementSignWithModal = useCallback(async (agreementData: any) => {
    if (!currentUser || !selectedShowing) return;

    try {
      const { error } = await supabase
        .from('tour_agreements')
        .upsert({
          showing_request_id: selectedShowing.id,
          buyer_id: currentUser.id,
          agent_id: selectedShowing.assigned_agent_id,
          signed: true,
          signed_at: new Date().toISOString(),
          agreement_type: 'single_tour'
        });

      if (error) throw error;

      toast({
        title: "Agreement Signed",
        description: "Your tour agreement has been signed successfully.",
      });

      setShowAgreementModal(false);
      setSelectedShowing(null);
      await refreshData();
      
    } catch (error) {
      console.error('Error signing agreement:', error);
      toast({
        title: "Error",
        description: "Failed to sign agreement. Please try again.",
        variant: "destructive"
      });
    }
  }, [currentUser, selectedShowing, refreshData, toast]);

  const handleSignAgreementFromCard = useCallback((showingId: string, displayName: string) => {
    const showing = showingRequests.find(s => s.id === showingId);
    if (showing) {
      setSelectedShowing(showing);
      setShowAgreementModal(true);
    }
  }, [showingRequests]);

  const handleCancelShowing = useCallback(async (showingId: string) => {
    try {
      const { error } = await supabase
        .from('showing_requests')
        .update({ status: 'cancelled' })
        .eq('id', showingId);

      if (error) throw error;

      toast({
        title: "Showing Cancelled",
        description: "Your showing request has been cancelled.",
      });

      await refreshData();
      
    } catch (error) {
      console.error('Error cancelling showing:', error);
      toast({
        title: "Error",
        description: "Failed to cancel showing. Please try again.",
        variant: "destructive"
      });
    }
  }, [refreshData, toast]);

  const handleRescheduleShowing = useCallback((showing: any) => {
    setSelectedShowing(showing);
    setShowRescheduleModal(true);
  }, []);

  const handleRescheduleSuccess = useCallback(async () => {
    setShowRescheduleModal(false);
    setSelectedShowing(null);
    await refreshData();
    
    toast({
      title: "Showing Rescheduled",
      description: "Your showing has been rescheduled successfully.",
    });
  }, [refreshData, toast]);

  const handleSendMessage = useCallback((showingId: string) => {
    // This would open a messaging interface
    console.log('Opening message for showing:', showingId);
  }, []);

  const handleStatClick = useCallback((targetTab: string) => {
    setActiveTab(targetTab);
  }, []);

  // Form success handler with immediate refresh
  const handleFormSuccess = useCallback(async () => {
    console.log('SimplifiedBuyerDashboardLogic: Form submitted successfully, refreshing...');
    setShowPropertyForm(false);
    await refreshData();
    
    toast({
      title: "Success!",
      description: "Your showing request has been submitted.",
    });
  }, [refreshData, toast]);

  return {
    // UI State
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
    selectedShowing,

    // Data
    profile,
    showingRequests,
    agreements,
    pendingRequests,
    activeShowings,
    completedShowings,
    loading,
    error,
    authLoading,
    currentUser,

    // Computed values
    unreadCount: 0, // Placeholder for messaging
    eligibility: { eligible: true }, // Placeholder
    isSubscribed: false, // Placeholder
    subscriptionTier: 'free', // Placeholder

    // Actions
    handleRequestShowing,
    handleUpgradeClick,
    handleSubscriptionComplete,
    handleConfirmShowingWithModal,
    handleAgreementSignWithModal,
    handleSignAgreementFromCard,
    handleCancelShowing,
    handleRescheduleShowing,
    handleRescheduleSuccess,
    handleSendMessage,
    handleStatClick,
    handleFormSuccess,
    refreshData
  };
};
