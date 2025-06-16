
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

  // Categorize requests properly - cancelled goes to history
  const pendingRequests = showingRequests.filter(req => 
    ['pending', 'submitted', 'under_review', 'agent_assigned'].includes(req.status)
  );
  
  const activeShowings = showingRequests.filter(req => 
    ['confirmed', 'agent_confirmed', 'scheduled'].includes(req.status)
  );
  
  // History includes both completed AND cancelled requests
  const completedShowings = showingRequests.filter(req => 
    req.status === 'completed' || req.status === 'cancelled'
  );

  const fetchUserData = async () => {
    if (!currentUser) {
      console.log('No user found, stopping fetch');
      setLoading(false);
      return;
    }

    console.log('Fetching buyer data for user:', currentUser.id);

    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      console.log('Profile fetch result:', { profileData, profileError });

      if (profileError) {
        console.error('Profile error:', profileError);
        if (profileError.code === 'PGRST116') {
          // Profile doesn't exist, which is okay for new users
          console.log('Profile not found, user might be new');
          setProfile(null);
        } else {
          toast({
            title: "Error",
            description: "Failed to load profile data.",
            variant: "destructive"
          });
        }
      } else {
        setProfile(profileData);
      }

      // Fetch showing requests for this user
      await fetchShowingRequests();

      // Fetch agreements
      const { data: agreementsData, error: agreementsError } = await supabase
        .from('tour_agreements')
        .select('showing_request_id, signed')
        .eq('buyer_id', currentUser.id);

      console.log('Agreements fetch result:', { agreementsData, agreementsError });

      if (agreementsError) {
        console.error('Agreements error:', agreementsError);
      } else {
        const agreementsMap = (agreementsData || []).reduce((acc, agreement) => {
          acc[agreement.showing_request_id] = agreement.signed;
          return acc;
        }, {} as Record<string, boolean>);
        setAgreements(agreementsMap);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchShowingRequests = async () => {
    if (!currentUser) return;

    try {
      const { data: requestsData, error: requestsError } = await supabase
        .from('showing_requests')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      console.log('Requests fetch result:', { requestsData, requestsError });

      if (requestsError) {
        console.error('Requests error:', requestsError);
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
      console.error('Error fetching showing requests:', error);
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
    if (authLoading) {
      console.log('Auth still loading...');
      return;
    }
    
    if (!user && !session) {
      console.log('No user or session, redirecting to home');
      setLoading(false);
      navigate('/');
      return;
    }

    console.log('User available, fetching user data');
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
