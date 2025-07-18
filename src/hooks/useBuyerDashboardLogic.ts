
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboardAgreements } from "@/hooks/useDashboardAgreements";

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
  // Enhanced property data from idx_properties join
  property_price?: string | null;
  property_beds?: string | null;
  property_baths?: string | null;
  property_sqft?: string | null;
  property_image?: string | null;
  property_page_url?: string | null;
}

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  user_type: string;
  free_showing_used?: boolean;
}

interface BuyerDashboardLogicProps {
  onOpenChat: (defaultTab?: 'property' | 'support', showingId?: string) => void;
}

export const useBuyerDashboardLogic = ({ onOpenChat }: BuyerDashboardLogicProps) => {
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showingRequests, setShowingRequests] = useState<ShowingRequest[]>([]);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSignAgreementModal, setShowSignAgreementModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ShowingRequest | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected' | 'error'>('connected');
  
  const { toast } = useToast();
  const { user, session, loading: contextAuthLoading } = useAuth();
  const currentUser = user || session?.user;
  
  const { showingsWithAgreements, signAgreement } = useDashboardAgreements(currentUser?.id || '');
  
  // Create agreements object from showingsWithAgreements
  const agreements = showingsWithAgreements.reduce((acc, showing) => {
    acc[showing.id] = showing.tour_agreement?.signed || false;
    return acc;
  }, {} as Record<string, boolean>);

  const fetchProfile = useCallback(async () => {
    if (!currentUser?.id) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, [currentUser?.id]);

  const fetchShowingRequests = useCallback(async () => {
    if (!currentUser?.id) {
      setLoading(false);
      return;
    }

    try {
      console.log('BuyerDashboardLogic: Fetching showing requests for user:', currentUser.id);
      
      // First, let's check if any idx_properties exist at all
      const { data: propsCheck, error: propsError } = await supabase
        .from('idx_properties')
        .select('address, price, beds')
        .limit(5);
      
      console.log('BuyerDashboardLogic: Available idx_properties:', propsCheck);
      if (propsError) console.error('BuyerDashboardLogic: idx_properties error:', propsError);
      
      const { data, error } = await supabase
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

      if (error) throw error;
      
      console.log('BuyerDashboardLogic: Raw showing requests data:', data);
      console.log('BuyerDashboardLogic: Found', data?.length || 0, 'showing requests');
      
      // Check which showing requests have idx_property_id populated
      const withPropertyId = data?.filter((showing: any) => showing.idx_property_id) || [];
      console.log('BuyerDashboardLogic: Showings with idx_property_id:', withPropertyId.length);
      if (withPropertyId.length > 0) {
        console.log('BuyerDashboardLogic: First showing with property ID:', {
          id: withPropertyId[0].id,
          property_address: withPropertyId[0].property_address,
          idx_property_id: withPropertyId[0].idx_property_id
        });
      }
      
      // Debug: Check if any have idx_properties data
      const withPropertyData = data?.filter((showing: any) => showing.idx_properties) || [];
      console.log('BuyerDashboardLogic: Showings with property data:', withPropertyData.length);
      if (withPropertyData.length > 0) {
        console.log('BuyerDashboardLogic: First property data:', withPropertyData[0].idx_properties);
      }
      
      // Transform the joined data to flatten property information
      const transformedShowings = (data || []).map((showing: any) => {
        const propertyData = showing.idx_properties;
        
        // Handle images - they might be stored as JSON string or array
        let firstImage = null;
        if (propertyData?.images) {
          try {
            if (typeof propertyData.images === 'string') {
              const parsedImages = JSON.parse(propertyData.images);
              firstImage = Array.isArray(parsedImages) ? parsedImages[0] : parsedImages?.url || parsedImages;
            } else if (Array.isArray(propertyData.images)) {
              firstImage = propertyData.images[0];
            }
          } catch (e) {
            // If parsing fails, treat as string
            firstImage = propertyData.images;
          }
        }
        
        const transformed = {
          ...showing,
          // Flatten property data into the showing object
          property_price: propertyData?.price ? `$${Number(propertyData.price).toLocaleString()}` : null,
          property_beds: propertyData?.beds ? `${propertyData.beds} bed${propertyData.beds !== 1 ? 's' : ''}` : null,
          property_baths: propertyData?.baths ? `${propertyData.baths} bath${propertyData.baths !== 1 ? 's' : ''}` : null,
          property_sqft: propertyData?.sqft ? `${Number(propertyData.sqft).toLocaleString()} sqft` : null,
          property_image: firstImage,
          property_page_url: propertyData?.ihf_page_url || null,
          // Remove the nested object to avoid confusion
          idx_properties: undefined
        };
        
        console.log('BuyerDashboardLogic: Transformed showing:', showing.property_address, transformed);
        return transformed;
      });
      
      console.log('BuyerDashboardLogic: Transformed showing requests:', transformedShowings);
      setShowingRequests(transformedShowings);
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

  const refresh = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      fetchProfile(),
      fetchShowingRequests(), 
      fetchSubscriptionData()
    ]);
    setLoading(false);
  }, [fetchProfile, fetchShowingRequests, fetchSubscriptionData]);

  useEffect(() => {
    setAuthLoading(contextAuthLoading);
  }, [contextAuthLoading]);

  useEffect(() => {
    if (currentUser?.id) {
      fetchProfile();
      fetchShowingRequests();
      fetchSubscriptionData();
    } else if (!contextAuthLoading) {
      setLoading(false);
    }
  }, [currentUser?.id, contextAuthLoading, fetchProfile, fetchShowingRequests, fetchSubscriptionData]);

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
    authLoading,
    profile,
    currentUser,
    connectionStatus,
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
    refresh,
    signAgreement,
  };
};
