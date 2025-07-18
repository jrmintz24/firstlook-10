import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  // Enhanced property data from idx_properties join
  idx_property_id?: string | null;
  property_price?: string | null;
  property_beds?: number | null;
  property_baths?: number | null;
  property_sqft?: number | null;
  property_images?: string[] | null;
  property_page_url?: string | null;
}

export const useBuyerShowings = (currentUser: any, profile: any) => {
  const [showingRequests, setShowingRequests] = useState<ShowingRequest[]>([]);
  const [selectedShowing, setSelectedShowing] = useState<ShowingRequest | null>(null);
  const [agreements, setAgreements] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchShowingRequests = async () => {
    if (!currentUser) {
      console.log('No current user available for fetchShowingRequests');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching showing requests for user:', currentUser.id);
      
      const { data: showingData, error: showingError } = await supabase
        .from('showing_requests')
        .select(`
          *,
          idx_properties (
            price,
            beds,
            baths,
            sqft,
            images,
            ihf_page_url
          )
        `)
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      console.log('Showing requests fetch result:', { showingData, showingError });

      if (showingError) {
        console.error('Error fetching showing requests:', showingError);
        throw showingError;
      }

      // Transform the joined data to flatten property information
      const transformedShowings = (showingData || []).map((showing: any) => {
        const propertyData = showing.idx_properties;
        return {
          ...showing,
          // Flatten property data into the showing object
          property_price: propertyData?.price ? `$${Number(propertyData.price).toLocaleString()}` : null,
          property_beds: propertyData?.beds ? `${propertyData.beds} bed${propertyData.beds !== 1 ? 's' : ''}` : null,
          property_baths: propertyData?.baths ? `${propertyData.baths} bath${propertyData.baths !== 1 ? 's' : ''}` : null,
          property_sqft: propertyData?.sqft ? `${Number(propertyData.sqft).toLocaleString()} sqft` : null,
          property_image: propertyData?.images?.[0] || null, // Use first image
          property_page_url: propertyData?.ihf_page_url || null,
          // Remove the nested object to avoid confusion
          idx_properties: undefined
        };
      });

      setShowingRequests(transformedShowings);

      const { data: agreementData, error: agreementError } = await supabase
        .from('tour_agreements')
        .select('showing_request_id, signed')
        .eq('buyer_id', currentUser.id);

      if (agreementError) {
        console.error('Error fetching agreements:', agreementError);
      } else {
        const agreementMap = (agreementData || []).reduce((acc, agreement) => {
          acc[agreement.showing_request_id] = agreement.signed;
          return acc;
        }, {} as Record<string, boolean>);
        setAgreements(agreementMap);
      }
    } catch (error) {
      console.error('Error in fetchShowingRequests:', error);
      toast({
        title: "Error",
        description: "Failed to load your showing requests. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShowingRequests();
  }, [currentUser]);

  const pendingRequests = showingRequests.filter(
    request => ['pending', 'assigned', 'under_review'].includes(request.status)
  );

  const activeShowings = showingRequests.filter(
    request => ['confirmed', 'agent_confirmed', 'in_progress', 'scheduled'].includes(request.status)
  );

  const completedShowings = showingRequests.filter(
    request => ['completed', 'cancelled'].includes(request.status)
  );

  console.log('Showing status breakdown:', {
    total: showingRequests.length,
    pending: pendingRequests.length,
    active: activeShowings.length,
    completed: completedShowings.length,
    statuses: showingRequests.map(r => ({ id: r.id, status: r.status }))
  });

  const handleCancelShowing = async (id: string) => {
    try {
      const { error } = await supabase
        .from('showing_requests')
        .update({ status: 'cancelled' })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Showing Cancelled",
        description: "Your showing request has been cancelled successfully.",
      });

      fetchShowingRequests();
    } catch (error) {
      console.error('Error cancelling showing:', error);
      toast({
        title: "Error",
        description: "Failed to cancel showing. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRescheduleShowing = async (id: string) => {
    console.log('Reschedule showing:', id);
    toast({
      title: "Feature Coming Soon",
      description: "Rescheduling functionality will be available soon.",
    });
  };

  const handleConfirmShowing = (showing: ShowingRequest) => {
    setSelectedShowing(showing);
  };

  const handleAgreementSign = async (showingId: string) => {
    try {
      const { error } = await supabase
        .from('tour_agreements')
        .upsert({
          showing_request_id: showingId,
          buyer_id: currentUser.id,
          signed: true,
          signed_at: new Date().toISOString()
        });

      if (error) throw error;

      setAgreements(prev => ({ ...prev, [showingId]: true }));
      setSelectedShowing(null);

      toast({
        title: "Agreement Signed",
        description: "Tour agreement signed successfully!",
      });
    } catch (error) {
      console.error('Error signing agreement:', error);
      toast({
        title: "Error",
        description: "Failed to sign agreement. Please try again.",
        variant: "destructive"
      });
    }
  };

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
