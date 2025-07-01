
import { useState, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useBuyerDashboardData } from "./useBuyerDashboardData";
import { useMessages } from "./useMessages";

interface BuyerDashboardLogicProps {
  onOpenChat: (defaultTab: 'property' | 'support', showingId?: string) => void;
}

export const useBuyerDashboardLogic = ({ onOpenChat }: BuyerDashboardLogicProps) => {
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
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
    fetchShowingRequests
  } = useBuyerDashboardData();

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
      fetchShowingRequests();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign agreement. Please try again.",
        variant: "destructive"
      });
    }
  }, [selectedShowing, currentUser, toast, fetchShowingRequests]);

  const handleSignAgreementFromCard = useCallback((showingId: string, buyerName: string) => {
    const showing = [...pendingRequests, ...activeShowings, ...completedShowings].find(s => s.id === showingId);
    if (showing) {
      setSelectedShowing(showing);
      setShowAgreementModal(true);
    }
  }, [pendingRequests, activeShowings, completedShowings]);

  const handleSendMessage = useCallback((showingId: string) => {
    onOpenChat('property', showingId);
  }, [onOpenChat]);

  const handleStatClick = useCallback((targetTab: string) => {
    setActiveTab(targetTab);
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
      
      fetchShowingRequests();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel showing. Please try again.",
        variant: "destructive"
      });
    }
  }, [toast, fetchShowingRequests]);

  const handleRescheduleShowing = useCallback((showing: any) => {
    setSelectedShowing(showing);
    setShowRescheduleModal(true);
  }, []);

  const handleRescheduleSuccess = useCallback(() => {
    setShowRescheduleModal(false);
    setSelectedShowing(null);
    fetchShowingRequests();
  }, [fetchShowingRequests]);

  return {
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
    
    profile,
    selectedShowing,
    agreements,
    loading,
    authLoading,
    currentUser,
    pendingRequests,
    activeShowings,
    completedShowings,
    eligibility,
    isSubscribed,
    subscriptionTier,
    unreadCount,
    
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
