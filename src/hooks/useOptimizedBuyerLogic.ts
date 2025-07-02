import { useState, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useBuyerDashboardData } from "./useBuyerDashboardData";
import { useMessages } from "./useMessages";

export const useOptimizedBuyerLogic = () => {
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  
  // Enhanced navigation state for two-level structure
  const [activePrimaryTab, setActivePrimaryTab] = useState("overview");
  const [activeSubTab, setActiveSubTab] = useState("");
  
  // Keep backward compatibility for single-level navigation
  const [activeTab, setActiveTab] = useState("requested");
  
  const [selectedShowing, setSelectedShowing] = useState<any>(null);

  const { toast } = useToast();

  // Use optimized data fetching hook
  const {
    profile,
    agreements,
    loading,
    authLoading,
    currentUser,
    pendingRequests,
    activeShowings,
    completedShowings,
    fetchShowingRequests: refreshShowingRequests
  } = useBuyerDashboardData();

  // Add missing properties for backward compatibility
  const detailLoading = false;
  const isInitialLoad = loading;
  const showingCounts = useMemo(() => ({
    pending: pendingRequests.length,
    active: activeShowings.length,
    completed: completedShowings.length
  }), [pendingRequests.length, activeShowings.length, completedShowings.length]);

  // Get messages data
  const { unreadCount } = useMessages(currentUser?.id || null);

  // Memoized computed values
  const eligibility = useMemo(() => ({
    eligible: true,
    reason: 'subscribed'
  }), []);

  const isSubscribed = useMemo(() => true, []);
  const subscriptionTier = useMemo(() => 'premium', []);

  // Optimized event handlers with useCallback
  const handleRequestShowing = useCallback(() => {
    setShowPropertyForm(true);
  }, []);

  const handleUpgradeClick = useCallback(() => {
    setShowSubscribeModal(true);
  }, []);

  const handleSubscriptionComplete = useCallback(() => {
    setShowSubscribeModal(false);
    toast({
      title: "Success",
      description: "Subscription activated successfully!",
    });
  }, [toast]);

  const handleConfirmShowingWithModal = useCallback((showing: any) => {
    setSelectedShowing(showing);
    setShowAgreementModal(true);
  }, []);

  const handleAgreementSignWithModal = useCallback(async (name: string) => {
    if (!selectedShowing || !currentUser) return;

    try {
      const { error } = await supabase
        .from('tour_agreements')
        .upsert({
          showing_request_id: selectedShowing.id,
          buyer_id: currentUser.id,
          agreement_type: 'single_tour',
          signed: true,
          signed_at: new Date().toISOString(),
          email_token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          token_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        });

      if (error) throw error;

      await supabase
        .from('showing_requests')
        .update({
          status: 'confirmed',
          status_updated_at: new Date().toISOString()
        })
        .eq('id', selectedShowing.id);

      toast({
        title: "Agreement Signed",
        description: "You have successfully signed the tour agreement.",
      });

      setShowAgreementModal(false);
      setSelectedShowing(null);
      refreshShowingRequests();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign agreement. Please try again.",
        variant: "destructive"
      });
    }
  }, [selectedShowing, currentUser, toast, refreshShowingRequests]);

  const handleSignAgreementFromCard = useCallback((showingId: string, buyerName: string) => {
    const showing = [...pendingRequests, ...activeShowings, ...completedShowings].find(s => s.id === showingId);
    if (showing) {
      setSelectedShowing(showing);
      setShowAgreementModal(true);
    }
  }, [pendingRequests, activeShowings, completedShowings]);

  const handleSendMessage = useCallback((showingId: string) => {
    console.log('Send message for showing:', showingId);
    // Navigate to messages for enhanced dashboard
    setActivePrimaryTab("account");
    setActiveSubTab("messages");
    // Navigate to messages for original dashboard
    setActiveTab("messages");
  }, []);

  const handleStatClick = useCallback((targetTab: string) => {
    setActiveTab(targetTab);
    // Also handle enhanced dashboard navigation
    if (targetTab === "tours" || targetTab === "requested" || targetTab === "confirmed" || targetTab === "history") {
      setActivePrimaryTab("tours");
      if (targetTab === "requested") setActiveSubTab("requested");
      else if (targetTab === "confirmed") setActiveSubTab("confirmed");
      else if (targetTab === "history") setActiveSubTab("history");
    } else if (targetTab === "services" || targetTab === "favorites") {
      setActivePrimaryTab("services");
      setActiveSubTab("favorites");
    }
  }, []);

  const handleCancelShowing = useCallback(async (id: string) => {
    try {
      await supabase
        .from('showing_requests')
        .update({ 
          status: 'cancelled',
          status_updated_at: new Date().toISOString()
        })
        .eq('id', id);

      toast({
        title: "Showing Cancelled",
        description: "Your showing request has been cancelled.",
      });
      
      refreshShowingRequests();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel showing. Please try again.",
        variant: "destructive"
      });
    }
  }, [toast, refreshShowingRequests]);

  const handleRescheduleShowing = useCallback((showing: any) => {
    setSelectedShowing(showing);
    setShowRescheduleModal(true);
  }, []);

  const handleRescheduleSuccess = useCallback(() => {
    setShowRescheduleModal(false);
    setSelectedShowing(null);
    refreshShowingRequests();
  }, [refreshShowingRequests]);

  return {
    // Modal states
    showPropertyForm,
    setShowPropertyForm,
    showAgreementModal,
    setShowAgreementModal,
    showSubscribeModal,
    setShowSubscribeModal,
    showRescheduleModal,
    setShowRescheduleModal,
    
    // Enhanced navigation states
    activePrimaryTab,
    setActivePrimaryTab,
    activeSubTab,
    setActiveSubTab,
    
    // Backward compatibility - single-level navigation
    activeTab,
    setActiveTab,
    
    // Data
    profile,
    selectedShowing,
    agreements,
    loading,
    detailLoading,
    authLoading,
    currentUser,
    isInitialLoad,
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
    refreshShowingRequests
  };
};
