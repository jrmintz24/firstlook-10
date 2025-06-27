
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  user_type: string;
  free_showing_used?: boolean;
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
  estimated_confirmation_date?: string | null;
  status_updated_at?: string | null;
}

export const useBuyerDashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedShowing, setSelectedShowing] = useState<ShowingRequest | null>(null);
  const [agreements, setAgreements] = useState<Record<string, boolean>>({});
  const [showingRequests, setShowingRequests] = useState<ShowingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const currentUser = user || session?.user;

  console.log('useBuyerDashboard: Current user:', currentUser?.id, currentUser?.email);
  console.log('useBuyerDashboard: Auth loading:', authLoading, 'Hook loading:', loading);

  // Categorize requests properly - awaiting_agreement should be in pending
  const pendingRequests = showingRequests.filter(req => 
    ['pending', 'submitted', 'under_review', 'agent_assigned', 'awaiting_agreement'].includes(req.status)
  );
  
  const activeShowings = showingRequests.filter(req => 
    ['confirmed', 'agent_confirmed', 'scheduled'].includes(req.status)
  );
  
  // History includes completed and cancelled requests, with cancelled at the bottom
  const completedShowings = showingRequests
    .filter(req => ['completed', 'cancelled'].includes(req.status))
    .sort((a, b) => {
      // First sort by status: completed first, cancelled last
      if (a.status !== b.status) {
        if (a.status === 'completed' && b.status === 'cancelled') return -1;
        if (a.status === 'cancelled' && b.status === 'completed') return 1;
      }
      // Then sort by date (most recent first within each status)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const fetchUserData = async () => {
    if (!currentUser) {
      console.log('useBuyerDashboard: No user found, stopping fetch');
      setLoading(false);
      return;
    }

    console.log('useBuyerDashboard: Fetching buyer data for user:', currentUser.id);

    try {
      // Fetch profile - don't fail if it doesn't exist for new users
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();

      console.log('useBuyerDashboard: Profile fetch result:', { profileData, profileError });

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('useBuyerDashboard: Profile error:', profileError);
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive"
        });
      } else {
        setProfile(profileData);
        console.log('useBuyerDashboard: Profile set:', profileData);
      }

      // Fetch showing requests for this user
      await fetchShowingRequests();

      // Fetch agreements
      const { data: agreementsData, error: agreementsError } = await supabase
        .from('tour_agreements')
        .select('showing_request_id, signed')
        .eq('buyer_id', currentUser.id);

      console.log('useBuyerDashboard: Agreements fetch result:', { agreementsData, agreementsError });

      if (agreementsError) {
        console.error('useBuyerDashboard: Agreements error:', agreementsError);
      } else {
        const agreementsMap = (agreementsData || []).reduce((acc, agreement) => {
          acc[agreement.showing_request_id] = agreement.signed;
          return acc;
        }, {} as Record<string, boolean>);
        setAgreements(agreementsMap);
      }
    } catch (error) {
      console.error('useBuyerDashboard: Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive"
      });
    } finally {
      console.log('useBuyerDashboard: Setting loading to false');
      setLoading(false);
    }
  };

  const fetchShowingRequests = async () => {
    if (!currentUser) {
      console.log('useBuyerDashboard: No user for showing requests fetch');
      return;
    }

    try {
      console.log('useBuyerDashboard: Fetching showing requests...');
      const { data: requestsData, error: requestsError } = await supabase
        .from('showing_requests')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      console.log('useBuyerDashboard: Requests fetch result:', { 
        count: requestsData?.length || 0, 
        error: requestsError 
      });

      if (requestsError) {
        console.error('useBuyerDashboard: Requests error:', requestsError);
        toast({
          title: "Error",
          description: "Failed to load showing requests.",
          variant: "destructive"
        });
        setShowingRequests([]);
      } else {
        setShowingRequests(requestsData || []);
      }
    } catch (error) {
      console.error('useBuyerDashboard: Error fetching showing requests:', error);
      setShowingRequests([]);
    }
  };

  const handleCancelShowing = async (id: string) => {
    console.log('Cancelling showing:', id);
    
    try {
      const { data, error } = await supabase
        .from('showing_requests')
        .update({ 
          status: 'cancelled',
          status_updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();

      console.log('Cancel result:', { data, error });

      if (error) {
        console.error('Error cancelling showing:', error);
        toast({
          title: "Error",
          description: "Failed to cancel showing. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Showing Cancelled",
        description: "Your showing request has been cancelled.",
      });
      
      fetchShowingRequests();
    } catch (error) {
      console.error('Exception cancelling showing:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    }
  };

  const handleRescheduleShowing = async (id: string) => {
    console.log('Rescheduling showing:', id);
    // Implement reschedule logic here
    toast({
      title: "Feature Coming Soon",
      description: "Rescheduling functionality will be available soon.",
    });
  };

  const handleConfirmShowing = (showing: ShowingRequest) => {
    console.log('Confirming showing:', showing);
    setSelectedShowing(showing);
  };

  const handleAgreementSign = async (name: string) => {
    if (!selectedShowing || !currentUser) {
      console.error('No selected showing or user for agreement signing');
      return;
    }

    console.log('Signing agreement for showing:', selectedShowing.id, 'with name:', name);

    try {
      // First, try to find existing agreement
      const { data: existingAgreement, error: findError } = await supabase
        .from('tour_agreements')
        .select('*')
        .eq('showing_request_id', selectedShowing.id)
        .eq('buyer_id', currentUser.id)
        .maybeSingle();

      console.log('Existing agreement check:', { existingAgreement, findError });

      if (findError) {
        console.error('Error finding existing agreement:', findError);
        throw new Error('Failed to check existing agreement');
      }

      if (existingAgreement) {
        // Update existing agreement
        const { error: updateError } = await supabase
          .from('tour_agreements')
          .update({
            signed: true,
            signed_at: new Date().toISOString()
          })
          .eq('id', existingAgreement.id);

        if (updateError) {
          console.error('Error updating agreement:', updateError);
          throw new Error('Failed to sign agreement');
        }
      } else {
        // Create new agreement
        const { error: insertError } = await supabase
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

        if (insertError) {
          console.error('Error creating agreement:', insertError);
          throw new Error('Failed to create and sign agreement');
        }
      }

      // Update showing status to confirmed
      const { error: statusError } = await supabase
        .from('showing_requests')
        .update({
          status: 'confirmed',
          status_updated_at: new Date().toISOString()
        })
        .eq('id', selectedShowing.id);

      if (statusError) {
        console.error('Error updating showing status:', statusError);
        // Don't throw here as agreement is already signed
      }

      // Update local agreements state
      setAgreements(prev => ({
        ...prev,
        [selectedShowing.id]: true
      }));

      toast({
        title: "Agreement Signed",
        description: "You have successfully signed the tour agreement.",
      });

      // Clear selected showing
      setSelectedShowing(null);
    } catch (error: any) {
      console.error('Exception signing agreement:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign agreement. Please try again.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    console.log('useBuyerDashboard: useEffect triggered, authLoading:', authLoading, 'user:', !!currentUser);
    
    if (authLoading) {
      console.log('useBuyerDashboard: Auth still loading...');
      return;
    }
    
    if (!user && !session) {
      console.log('useBuyerDashboard: No user or session, redirecting to home');
      setLoading(false);
      navigate('/');
      return;
    }

    console.log('useBuyerDashboard: User available, fetching user data');
    fetchUserData();
  }, [user, session, authLoading, navigate]);

  return {
    profile,
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
    fetchUserData,
    fetchShowingRequests
  };
};
