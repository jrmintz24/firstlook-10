
import { useState, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useOptimizedBuyerData } from "./useOptimizedBuyerData";

interface UseOptimizedBuyerLogicProps {
  onOpenChat?: (defaultTab: 'property' | 'support', showingId?: string) => void;
}

export const useOptimizedBuyerLogic = ({ onOpenChat }: UseOptimizedBuyerLogicProps = {}) => {
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [activeTab, setActiveTab] = useState("requested");
  const [selectedShowing, setSelectedShowing] = useState<any>(null);

  const { toast } = useToast();
  
  const {
    profile,
    showingCounts,
    agreements,
    loading,
    detailLoading,
    authLoading,
    currentUser,
    isInitialLoad,
    pendingRequests,
    activeShowings,
    completedShowings,
    refreshShowingRequests,
    optimisticUpdateShowing
  } = useOptimizedBuyerData();

  // Separate messages hook with error isolation - don't let it break the main dashboard
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Safe message count fetch that won't break the dashboard
  const fetchUnreadCount = useCallback(async () => {
    if (!currentUser?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('id')
        .eq('receiver_id', currentUser.id)
        .is('read_at', null);
      
      if (!error && data) {
        setUnreadCount(data.length);
      }
    } catch (error) {
      console.warn('Failed to fetch unread count, continuing without it:', error);
      // Don't break the dashboard if messages fail
      setUnreadCount(0);
    }
  }, [currentUser?.id]);

  // Call this safely without breaking main functionality
  useMemo(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

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
      // Optimistically update the UI first
      optimisticUpdateShowing(selectedShowing.id, { status: 'confirmed' });

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
      refreshShowingRequests();
    } catch (error) {
      console.error('Error signing agreement:', error);
      // Revert optimistic update on error
      refreshShowingRequests();
      toast({
        title: "Error",
        description: "Failed to sign agreement. Please try again.",
        variant: "destructive"
      });
    }
  }, [selectedShowing, currentUser, toast, refreshShowingRequests, optimisticUpdateShowing]);

  const handleSignAgreementFromCard = useCallback((showingId: string, displayName: string) => {
    const showing = [...pendingRequests, ...activeShowings].find(s => s.id === showingId);
    if (showing) {
      setSelectedShowing(showing);
      setShowAgreementModal(true);
    }
  }, [pendingRequests, activeShowings]);

  const handleSendMessage = useCallback((showingId: string) => {
    if (onOpenChat) {
      onOpenChat('property', showingId);
    } else {
      console.log('Messaging not available, showing ID:', showingId);
    }
  }, [onOpenChat]);

  const handleStatClick = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const handleCancelShowing = useCallback(async (id: string) => {
    try {
      // Optimistic update
      optimisticUpdateShowing(id, { status: 'cancelled' });

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
      console.error('Error cancelling showing:', error);
      // Revert optimistic update
      refreshShowingRequests();
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    }
  }, [toast, refreshShowingRequests, optimisticUpdateShowing]);

  const handleRescheduleShowing = useCallback((id: string) => {
    const showing = [...pendingRequests, ...activeShowings].find(s => s.id === id);
    if (showing) {
      setSelectedShowing(showing);
      setShowRescheduleModal(true);
    }
  }, [pendingRequests, activeShowings]);

  const handleRescheduleSuccess = useCallback(() => {
    setShowRescheduleModal(false);
    setSelectedShowing(null);
    refreshShowingRequests();
  }, [refreshShowingRequests]);

  // Memoized computed values
  const eligibility = useMemo(() => ({
    canRequestShowing: true,
    reason: 'eligible'
  }), []);

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
