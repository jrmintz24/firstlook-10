import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedRealtimeManager } from "./useUnifiedRealtimeManager";

interface UseOptimizedBuyerLogicProps {
  onOpenChat?: (defaultTab: 'property' | 'support', showingId?: string) => void;
}

export const useOptimizedBuyerLogic = () => {
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  
  const [profile, setProfile] = useState<any>(null);
  const [selectedShowing, setSelectedShowing] = useState<any>(null);
  const [agreements, setAgreements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [activeShowings, setActiveShowings] = useState<any[]>([]);
  const [completedShowings, setCompletedShowings] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const { toast } = useToast();
  const { user, session, loading: authLoading } = useAuth();
  const { subscribe, unsubscribeAll, getConnectionStatus } = useUnifiedRealtimeManager();
  
  const currentUser = user || session?.user;

  // Memoized showing counts for performance
  const showingCounts = useMemo(() => ({
    pending: pendingRequests.length,
    active: activeShowings.length,
    completed: completedShowings.length
  }), [pendingRequests.length, activeShowings.length, completedShowings.length]);

  // Unified data fetching function
  const fetchData = useCallback(async () => {
    if (!currentUser) return;

    try {
      console.log('Fetching buyer dashboard data for user:', currentUser.id);

      // Fetch all data in parallel
      const [profileResult, showingsResult, agreementsResult, messagesResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .maybeSingle(),
        
        supabase
          .from('showing_requests')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false }),
        
        supabase
          .from('tour_agreements')
          .select('showing_request_id, signed')
          .eq('buyer_id', currentUser.id),
        
        supabase
          .from('messages')
          .select('id, read_at')
          .eq('receiver_id', currentUser.id)
          .is('read_at', null)
      ]);

      if (profileResult.error) throw profileResult.error;
      if (showingsResult.error) throw showingsResult.error;
      
      setProfile(profileResult.data);
      
      const showings = showingsResult.data || [];
      setPendingRequests(showings.filter(s => 
        ['pending', 'submitted', 'under_review', 'agent_assigned', 'awaiting_agreement'].includes(s.status)
      ));
      setActiveShowings(showings.filter(s => 
        ['confirmed', 'agent_confirmed', 'scheduled'].includes(s.status)
      ));
      setCompletedShowings(showings.filter(s => 
        ['completed', 'cancelled'].includes(s.status)
      ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      
      if (agreementsResult.data) {
        setAgreements(agreementsResult.data);
      }
      
      if (messagesResult.data) {
        setUnreadCount(messagesResult.data.length);
      }

    } catch (error) {
      console.error('Error fetching buyer dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setDetailLoading(false);
      setIsInitialLoad(false);
    }
  }, [currentUser, toast]);

  // Setup unified realtime subscriptions
  useEffect(() => {
    if (!currentUser) return;

    console.log('Setting up unified realtime subscriptions for user:', currentUser.id);

    // Subscribe to showing requests
    subscribe({
      channelName: `buyer_showing_requests_${currentUser.id}`,
      table: 'showing_requests',
      filter: `user_id=eq.${currentUser.id}`,
      onDataChange: fetchData,
      enabled: true,
    });

    // Subscribe to tour agreements
    subscribe({
      channelName: `buyer_agreements_${currentUser.id}`,
      table: 'tour_agreements',
      filter: `buyer_id=eq.${currentUser.id}`,
      onDataChange: fetchData,
      enabled: true,
    });

    // Subscribe to messages
    subscribe({
      channelName: `buyer_messages_${currentUser.id}`,
      table: 'messages',
      filter: `receiver_id=eq.${currentUser.id}`,
      onDataChange: fetchData,
      enabled: true,
    });

    return () => {
      console.log('Cleaning up unified realtime subscriptions');
      unsubscribeAll();
    };
  }, [currentUser, subscribe, unsubscribeAll, fetchData]);

  // Initial data fetch
  useEffect(() => {
    if (authLoading) return;
    if (!currentUser) {
      setLoading(false);
      return;
    }

    fetchData();
  }, [currentUser, authLoading, fetchData]);

  // Handler functions
  const handleRequestShowing = useCallback(() => {
    setShowPropertyForm(true);
  }, []);

  const handleSubscriptionComplete = useCallback(() => {
    setShowSubscribeModal(false);
    fetchData();
  }, [fetchData]);

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
          signed: true,
          signed_at: new Date().toISOString(),
        });

      if (error) throw error;

      await supabase
        .from('showing_requests')
        .update({ status: 'confirmed' })
        .eq('id', selectedShowing.id);

      toast({
        title: "Agreement Signed",
        description: "Your tour agreement has been signed successfully.",
      });

      setShowAgreementModal(false);
      setSelectedShowing(null);
      fetchData();
    } catch (error) {
      console.error('Error signing agreement:', error);
      toast({
        title: "Error",
        description: "Failed to sign agreement. Please try again.",
        variant: "destructive"
      });
    }
  }, [selectedShowing, currentUser, toast, fetchData]);

  const handleSignAgreementFromCard = useCallback((showingId: string, buyerName: string) => {
    const showing = [...pendingRequests, ...activeShowings].find(s => s.id === showingId);
    if (showing) {
      setSelectedShowing(showing);
      setShowAgreementModal(true);
    }
  }, [pendingRequests, activeShowings]);

  const handleSendMessage = useCallback((showingId: string) => {
    console.log('Send message for showing:', showingId);
  }, []);

  const handleRescheduleShowing = useCallback((showing: any) => {
    setSelectedShowing(showing);
    setShowRescheduleModal(true);
  }, []);

  const handleRescheduleSuccess = useCallback(() => {
    setShowRescheduleModal(false);
    setSelectedShowing(null);
    fetchData();
  }, [fetchData]);

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
    unreadCount,
    
    // Handlers
    handleRequestShowing,
    handleSubscriptionComplete,
    handleConfirmShowingWithModal,
    handleAgreementSignWithModal,
    handleSignAgreementFromCard,
    handleSendMessage,
    handleRescheduleShowing,
    handleRescheduleSuccess,
  };
};
