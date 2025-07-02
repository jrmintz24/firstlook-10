
import { useState, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMessages } from "@/hooks/useMessages";
import { useSimpleBuyerData } from "./useSimpleBuyerData";

interface UseSimpleBuyerLogicProps {
  onOpenChat?: (defaultTab: 'property' | 'support', showingId?: string) => void;
}

export const useSimpleBuyerLogic = ({ onOpenChat }: UseSimpleBuyerLogicProps = {}) => {
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [activeTab, setActiveTab] = useState("requested");
  const [selectedShowing, setSelectedShowing] = useState<any>(null);

  const { toast } = useToast();
  
  const {
    profile,
    loading,
    isRefreshing,
    authLoading,
    currentUser,
    pendingRequests,
    activeShowings,
    completedShowings,
    refreshData,
    fetchShowingRequests
  } = useSimpleBuyerData();

  const { unreadCount } = useMessages(currentUser?.id || null);

  // Memoized handlers to prevent re-renders
  const handleRequestShowing = useCallback(() => {
    setShowPropertyForm(true);
  }, []);

  const handleUpgradeClick = useCallback(() => {
    setShowSubscribeModal(true);
  }, []);

  const handleSubscriptionComplete = useCallback(() => {
    setShowSubscribeModal(false);
    toast({
      title: "Subscription Updated",
      description: "Welcome to premium! You can now request unlimited showings.",
    });
  }, [toast]);

  const handleConfirmShowingWithModal = useCallback((showing: any) => {
    setSelectedShowing(showing);
    setShowAgreementModal(true);
  }, []);

  const handleAgreementSignWithModal = useCallback(async (name: string) => {
    if (!selectedShowing || !currentUser) return;

    try {
      const { data: existingAgreement } = await supabase
        .from('tour_agreements')
        .select('*')
        .eq('showing_request_id', selectedShowing.id)
        .eq('buyer_id', currentUser.id)
        .maybeSingle();

      if (existingAgreement) {
        await supabase
          .from('tour_agreements')
          .update({
            signed: true,
            signed_at: new Date().toISOString()
          })
          .eq('id', existingAgreement.id);
      } else {
        await supabase
          .from('tour_agreements')
          .insert({
            showing_request_id: selectedShowing.id,
            buyer_id: currentUser.id,
            agreement_type: 'single_tour',
            signed: true,
            signed_at: new Date().toISOString(),
            email_token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            token_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          });
      }

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
      await refreshData();
    } catch (error) {
      console.error('Error signing agreement:', error);
      toast({
        title: "Error",
        description: "Failed to sign agreement. Please try again.",
        variant: "destructive"
      });
    }
  }, [selectedShowing, currentUser, toast, refreshData]);

  const handleSignAgreementFromCard = useCallback((showingId: string, displayName: string) => {
    const showing = [...pendingRequests, ...activeShowings].find(s => s.id === showingId);
    if (showing) {
      setSelectedShowing(showing);
      setShowAgreementModal(true);
    }
  }, [pendingRequests, activeShowings]);

  const handleSendMessage = useCallback((showingId: string) => {
    onOpenChat?.('property', showingId);
  }, [onOpenChat]);

  const handleStatClick = useCallback((tab: string) => {
    setActiveTab(tab);
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
      
      await refreshData();
    } catch (error) {
      console.error('Error cancelling showing:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    }
  }, [toast, refreshData]);

  const handleRescheduleShowing = useCallback((id: string) => {
    const showing = [...pendingRequests, ...activeShowings].find(s => s.id === id);
    if (showing) {
      setSelectedShowing(showing);
      setShowRescheduleModal(true);
    }
  }, [pendingRequests, activeShowings]);

  const handleRescheduleSuccess = useCallback(async () => {
    setShowRescheduleModal(false);
    setSelectedShowing(null);
    await refreshData();
  }, [refreshData]);

  // Memoized computed values
  const showingCounts = useMemo(() => ({
    pending: pendingRequests.length,
    active: activeShowings.length,
    completed: completedShowings.length,
    total: pendingRequests.length + activeShowings.length + completedShowings.length
  }), [pendingRequests.length, activeShowings.length, completedShowings.length]);

  const eligibility = useMemo(() => ({
    canRequestShowing: true,
    reason: 'eligible'
  }), []);

  const agreements = useMemo(() => ({}), []);
  const isSubscribed = useMemo(() => false, []);
  const subscriptionTier = useMemo(() => 'free', []);

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
    agreements,
    loading,
    detailLoading: isRefreshing,
    authLoading,
    currentUser,
    isInitialLoad: loading,
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
    fetchShowingRequests,
    refreshShowingRequests: fetchShowingRequests
  };
};
