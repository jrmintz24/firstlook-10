
import { useState, useEffect, useCallback } from "react";
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
  const [dataFetched, setDataFetched] = useState(false);
  const { toast } = useToast();
  const { user, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const currentUser = user || session?.user;

  console.log('useBuyerDashboard: Current user:', currentUser?.id, currentUser?.email);
  console.log('useBuyerDashboard: Auth loading:', authLoading, 'Hook loading:', loading);

  // Categorize requests properly - cancelled tours are hidden from history
  const pendingRequests = showingRequests.filter(req => 
    ['pending', 'submitted', 'under_review', 'agent_assigned'].includes(req.status)
  );
  
  const activeShowings = showingRequests.filter(req => 
    ['confirmed', 'agent_confirmed', 'scheduled'].includes(req.status)
  );
  
  // History includes only completed requests, hiding cancelled ones
  const completedShowings = showingRequests.filter(req => 
    req.status === 'completed'
  );

  const fetchShowingRequests = useCallback(async () => {
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
  }, [currentUser?.id, toast]);

  const fetchUserData = useCallback(async () => {
    if (!currentUser || dataFetched) {
      console.log('useBuyerDashboard: Skipping fetch - no user or already fetched');
      if (!currentUser) {
        setLoading(false);
      }
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

      setDataFetched(true);
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
  }, [currentUser, dataFetched, fetchShowingRequests, toast]);

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
      const { data, error } = await supabase
        .from('tour_agreements')
        .upsert({
          showing_request_id: selectedShowing.id,
          buyer_id: currentUser.id,
          signed: true,
          signed_at: new Date().toISOString()
        }, {
          onConflict: 'showing_request_id,buyer_id'
        });

      console.log('Agreement sign result:', { data, error });

      if (error) {
        console.error('Error signing agreement:', error);
        toast({
          title: "Error",
          description: "Failed to sign agreement. Please try again.",
          variant: "destructive"
        });
        return;
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
    } catch (error) {
      console.error('Exception signing agreement:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
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
  }, [user, session, authLoading, navigate, fetchUserData]);

  // Set up real-time updates only once when user is available
  useEffect(() => {
    if (!currentUser?.id || !dataFetched) return;

    console.log('Setting up real-time updates for user:', currentUser.id);
    
    const channel = supabase
      .channel('showing-requests-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'showing_requests',
          filter: `user_id=eq.${currentUser.id}`
        },
        (payload) => {
          console.log('Real-time showing request update:', payload);
          // Refresh showing requests when any change occurs
          fetchShowingRequests();
        }
      )
      .subscribe((status) => {
        console.log('Real-time subscription status:', status);
      });

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [currentUser?.id, dataFetched, fetchShowingRequests]);

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
