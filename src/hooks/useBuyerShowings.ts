
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { isActiveShowing, isPendingRequest, type ShowingStatus } from "@/utils/showingStatus";
import { useShowingEligibility } from "@/hooks/useShowingEligibility";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  user_type: string;
  free_showing_used?: boolean;
  subscription_status?: string;
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
  user_id?: string | null;
  estimated_confirmation_date?: string | null;
  status_updated_at?: string | null;
}

export const useBuyerShowings = (currentUser: any, profile: Profile | null) => {
  const [showingRequests, setShowingRequests] = useState<ShowingRequest[]>([]);
  const [selectedShowing, setSelectedShowing] = useState<ShowingRequest | null>(null);
  const [agreements, setAgreements] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { resetFreeShowingEligibility, checkEligibility } = useShowingEligibility();

  const fetchShowingRequests = async () => {
    if (!currentUser) {
      console.log('No current user available for fetchShowingRequests');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching showing requests for:', currentUser.id);
      
      const { data: requestsData, error: requestsError } = await supabase
        .from('showing_requests')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      console.log('Requests fetch result:', { requestsData, requestsError });

      if (requestsError) {
        console.error('Requests error:', requestsError);
        setShowingRequests([]);
      } else {
        setShowingRequests(requestsData || []);
        console.log('Requests set:', requestsData);
        setAgreements({});
      }
    } catch (error) {
      console.error('Error fetching showing requests:', error);
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  const handleCancelShowing = async (showingId: string) => {
    try {
      const { error } = await supabase
        .from('showing_requests')
        .update({ status: 'cancelled' })
        .eq('id', showingId);

      if (error) {
        console.error('Error cancelling showing:', error);
        toast({
          title: "Error",
          description: "Failed to cancel showing. Please try again.",
          variant: "destructive"
        });
      } else {
        // Check if this was the user's only active showing and reset eligibility if so
        const cancelledShowing = showingRequests.find(req => req.id === showingId);
        if (cancelledShowing && currentUser) {
          // Check if this was their only active showing
          const otherActiveShowings = showingRequests.filter(req => 
            req.id !== showingId && 
            !['completed', 'cancelled'].includes(req.status)
          );
          
          if (otherActiveShowings.length === 0) {
            await resetFreeShowingEligibility();
            await checkEligibility();
          }
        }

        toast({
          title: "Showing Cancelled",
          description: "Your showing has been cancelled successfully.",
        });
        fetchShowingRequests();
      }
    } catch (error) {
      console.error('Error cancelling showing:', error);
    }
  };

  const handleRescheduleShowing = (showingId: string) => {
    toast({
      title: "Reschedule Request Sent",
      description: "Your showing partner will contact you with new available times.",
    });
  };

  const handleConfirmShowing = (showing: ShowingRequest) => {
    setSelectedShowing(showing);
  };

  const handleAgreementSign = async (name: string) => {
    if (!selectedShowing || !currentUser) return;

    const { error } = await supabase.from('tour_agreements').insert({
        showing_request_id: selectedShowing.id,
        agent_id: selectedShowing.assigned_agent_id,
        buyer_id: currentUser.id,
        signed: true,
        signed_at: new Date().toISOString()
    });

    if (error) {
        toast({ title: 'Error', description: 'Failed to save agreement.', variant: 'destructive' });
        return;
    }

    toast({ title: 'Confirmed', description: 'Your showing has been confirmed and agreement signed.' });
    setAgreements(prev => ({ ...prev, [selectedShowing.id]: true }));
    setSelectedShowing(null);
  };

  useEffect(() => {
    if (currentUser) {
      fetchShowingRequests();
    }
  }, [currentUser]);

  // Organize requests by type
  const pendingRequests = showingRequests.filter(req => isPendingRequest(req.status as ShowingStatus));
  const activeShowings = showingRequests.filter(req => isActiveShowing(req.status as ShowingStatus));
  const completedShowings = showingRequests.filter(req => req.status === 'completed');

  return {
    showingRequests,
    selectedShowing,
    agreements,
    loading,
    pendingRequests,
    activeShowings,
    completedShowings,
    handleCancelShowing,
    handleRescheduleShowing,
    handleConfirmShowing,
    handleAgreementSign,
    fetchShowingRequests
  };
};
