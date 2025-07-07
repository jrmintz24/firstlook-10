
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useTourAgreements } from "@/hooks/useTourAgreements";

interface ShowingRequest {
  id: string;
  property_address: string;
  preferred_date: string;
  preferred_time: string;
  message: string;
  status: string;
  created_at: string;
  assigned_agent_name?: string;
  assigned_agent_phone?: string;
  assigned_agent_email?: string;
  assigned_agent_id?: string;
  user_id?: string;
  status_updated_at?: string;
}

interface BuyerDashboardLogicProps {
  onOpenChat: (defaultTab?: 'property' | 'support', showingId?: string) => void;
}

export const useBuyerDashboardLogic = ({ onOpenChat }: BuyerDashboardLogicProps) => {
  const [loading, setLoading] = useState(true);
  const [showingRequests, setShowingRequests] = useState<ShowingRequest[]>([]);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSignAgreementModal, setShowSignAgreementModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ShowingRequest | null>(null);
  
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const { agreements, fetchAgreements } = useTourAgreements(currentUser?.id);

  const fetchShowingRequests = useCallback(async () => {
    if (!currentUser?.id) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('showing_requests')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setShowingRequests(data || []);
    } catch (error) {
      console.error('Error fetching showing requests:', error);
      toast({
        title: "Error",
        description: "Failed to load showing requests.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id, toast]);

  const fetchSubscriptionData = useCallback(async () => {
    if (!currentUser?.id) return;

    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', currentUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error);
        return;
      }

      setSubscriptionData(data);
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (currentUser?.id) {
      fetchShowingRequests();
      fetchSubscriptionData();
      fetchAgreements();
    }
  }, [currentUser?.id, fetchShowingRequests, fetchSubscriptionData, fetchAgreements]);

  const handleCancelShowing = async (id: string) => {
    try {
      const { error } = await supabase
        .from('showing_requests')
        .update({ status: 'cancelled' })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Tour Cancelled",
        description: "Your tour request has been cancelled.",
      });

      fetchShowingRequests();
    } catch (error) {
      console.error('Error cancelling showing:', error);
      toast({
        title: "Error",
        description: "Failed to cancel tour request.",
        variant: "destructive",
      });
    }
  };

  const handleRescheduleShowing = (id: string) => {
    console.log('Reschedule showing:', id);
    // This will be handled by a modal or separate component
  };

  const handleConfirmShowingWithModal = (request: ShowingRequest) => {
    setSelectedRequest(request);
    setShowConfirmModal(true);
  };

  const handleSignAgreementFromCard = (request: ShowingRequest) => {
    setSelectedRequest(request);
    setShowSignAgreementModal(true);
  };

  const handleSendMessage = (showingId: string) => {
    onOpenChat('property', showingId);
  };

  // Categorize showings
  const pendingRequests = showingRequests.filter(req => 
    ['pending', 'agent_requested', 'agent_confirmed', 'awaiting_agreement'].includes(req.status)
  );

  const activeShowings = showingRequests.filter(req => 
    ['confirmed', 'scheduled', 'in_progress'].includes(req.status)
  );

  const completedShowings = showingRequests.filter(req => 
    ['completed', 'cancelled'].includes(req.status)
  );

  const isSubscribed = subscriptionData?.subscribed || false;

  return {
    loading,
    showingRequests,
    pendingRequests,
    activeShowings,
    completedShowings,
    isSubscribed,
    agreements,
    showConfirmModal,
    showSignAgreementModal,
    selectedRequest,
    setShowConfirmModal,
    setShowSignAgreementModal,
    setSelectedRequest,
    handleCancelShowing,
    handleRescheduleShowing,
    handleConfirmShowingWithModal,
    handleSignAgreementFromCard,
    handleSendMessage,
    fetchShowingRequests,
  };
};
