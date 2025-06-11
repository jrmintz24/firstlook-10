import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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

export const useBuyerDashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showingRequests, setShowingRequests] = useState<ShowingRequest[]>([]);
  const [selectedShowing, setSelectedShowing] = useState<ShowingRequest | null>(null);
  const [agreements, setAgreements] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { resetFreeShowingEligibility, checkEligibility } = useShowingEligibility();

  useEffect(() => {
    console.log('BuyerDashboard useEffect triggered');
    console.log('Auth loading:', authLoading);
    console.log('User:', user);
    console.log('Session:', session);
    
    if (authLoading) {
      console.log('Auth still loading, waiting...');
      return;
    }
    
    if (!user && !session) {
      console.log('No user/session found after auth loaded, redirecting to home');
      setLoading(false);
      navigate('/');
      return;
    }

    if (user || session?.user) {
      console.log('User found, fetching data...');
      fetchUserData();
      handlePendingTourRequest();
    }
  }, [user, session, authLoading, navigate]);

  const handlePendingTourRequest = async () => {
    const pendingRequest = localStorage.getItem('pendingTourRequest');
    if (!pendingRequest) return;

    try {
      const tourData = JSON.parse(pendingRequest);
      const currentUser = user || session?.user;
      
      if (!currentUser || !tourData.properties?.length) {
        localStorage.removeItem('pendingTourRequest');
        return;
      }

      console.log('Processing pending tour request:', tourData);

      const requests = tourData.properties.map((property: string) => ({
        user_id: currentUser.id,
        property_address: property,
        preferred_date: tourData.preferredDates?.[0]?.date || null,
        preferred_time: tourData.preferredDates?.[0]?.time || null,
        message: tourData.notes || null,
        status: 'pending'
      }));

      const { error } = await supabase
        .from('showing_requests')
        .insert(requests);

      if (error) {
        console.error('Error creating pending showing requests:', error);
        toast({
          title: "Error",
          description: "Failed to process your pending tour request.",
          variant: "destructive"
        });
      } else {
        localStorage.removeItem('pendingTourRequest');
        toast({
          title: "Tour Request Submitted!",
          description: `Your tour request for ${requests.length} property${requests.length > 1 ? 'ies' : ''} has been submitted successfully!`,
        });
        fetchUserData();
      }
    } catch (error) {
      console.error('Error processing pending tour request:', error);
      localStorage.removeItem('pendingTourRequest');
    }
  };

  const fetchUserData = async () => {
    const currentUser = user || session?.user;
    if (!currentUser) {
      console.log('No current user available for fetchUserData');
      setLoading(false);
      return;
    }

    try {
      console.log('Starting to fetch user data for:', currentUser.id);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      console.log('Profile fetch result:', { profileData, profileError });

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile error:', profileError);
        if (profileError.code === 'PGRST116') {
          console.log('No profile found, using user metadata');
          const defaultProfile = {
            id: currentUser.id,
            first_name: currentUser.user_metadata?.first_name || currentUser.email?.split('@')[0] || 'User',
            last_name: currentUser.user_metadata?.last_name || '',
            phone: currentUser.user_metadata?.phone || '',
            user_type: 'buyer'
          };
          setProfile(defaultProfile);
        }
      } else if (profileData) {
        setProfile(profileData);
        console.log('Profile set:', profileData);
      }

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
      console.error('Error fetching user data:', error);
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
        if (cancelledShowing && user) {
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
        fetchUserData();
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
    if (!selectedShowing || !user) return;

    const { error } = await supabase.from('tour_agreements').insert({
        showing_request_id: selectedShowing.id,
        agent_id: selectedShowing.assigned_agent_id,
        buyer_id: user.id,
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

  // Organize requests by type
  const pendingRequests = showingRequests.filter(req => isPendingRequest(req.status as ShowingStatus));
  const activeShowings = showingRequests.filter(req => isActiveShowing(req.status as ShowingStatus));
  const completedShowings = showingRequests.filter(req => req.status === 'completed');

  return {
    profile,
    showingRequests,
    selectedShowing,
    agreements,
    loading,
    authLoading,
    user,
    session,
    pendingRequests,
    activeShowings,
    completedShowings,
    handleCancelShowing,
    handleRescheduleShowing,
    handleConfirmShowing,
    handleAgreementSign,
    fetchUserData
  };
};
