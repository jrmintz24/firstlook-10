import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useMessages } from '@/hooks/useMessages';

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
  estimated_confirmation_date?: string | null;
  status_updated_at?: string | null;
  user_id?: string | null;
}

export const useBuyerDashboardLogic = () => {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [selectedShowing, setSelectedShowing] = useState<ShowingRequest | null>(null);
  const [activeTab, setActiveTab] = useState("requested");
  const [pendingRequests, setPendingRequests] = useState<ShowingRequest[]>([]);
  const [activeShowings, setActiveShowings] = useState<ShowingRequest[]>([]);
  const [completedShowings, setCompletedShowings] = useState<ShowingRequest[]>([]);
  const [agreements, setAgreements] = useState<Record<string, boolean>>({});
  const [eligibility, setEligibility] = useState<any>(null);
  
  const currentUser = user || session?.user;
  const { unreadCount } = useMessages(currentUser?.id || null);

  // Enhanced agreement fetching
  const fetchAgreements = async (userId: string) => {
    try {
      const { data: agreementData, error } = await supabase
        .from('tour_agreements')
        .select('showing_request_id, signed')
        .eq('buyer_id', userId);

      if (error) {
        console.error('Error fetching agreements:', error);
        return {};
      }

      console.log('Fetched agreements data:', agreementData);

      const agreementsMap: Record<string, boolean> = {};
      agreementData?.forEach(agreement => {
        if (agreement.showing_request_id) {
          agreementsMap[agreement.showing_request_id] = agreement.signed;
        }
      });

      console.log('Processed agreements map:', agreementsMap);
      return agreementsMap;
    } catch (error) {
      console.error('Error in fetchAgreements:', error);
      return {};
    }
  };

  const fetchShowingRequests = async () => {
    if (!currentUser?.id) return;

    try {
      setLoading(true);
      
      const { data: showingData, error } = await supabase
        .from('showing_requests')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching showing requests:', error);
        toast({
          title: "Error",
          description: "Failed to load showing requests",
          variant: "destructive"
        });
        return;
      }

      console.log('Fetched showing requests:', showingData);

      // Fetch agreements
      const agreementsMap = await fetchAgreements(currentUser.id);
      setAgreements(agreementsMap);

      // Categorize showings
      const pending = showingData?.filter(req => 
        ['pending', 'submitted', 'under_review', 'agent_assigned'].includes(req.status)
      ) || [];
      
      const active = showingData?.filter(req => 
        ['agent_confirmed', 'awaiting_agreement', 'confirmed', 'scheduled', 'in_progress'].includes(req.status)
      ) || [];
      
      const completed = showingData?.filter(req => 
        ['completed', 'cancelled'].includes(req.status)
      ) || [];

      console.log('Categorized showings:', { pending: pending.length, active: active.length, completed: completed.length });

      setPendingRequests(pending);
      setActiveShowings(active);
      setCompletedShowings(completed);

    } catch (error) {
      console.error('Error in fetchShowingRequests:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setAuthLoading(false);
    };
    initializeAuth();
  }, []);

  useEffect(() => {
    if (currentUser?.id && !authLoading) {
      fetchProfile();
      fetchShowingRequests();
      checkEligibility();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [currentUser?.id, authLoading]);

  const fetchProfile = async () => {
    if (!currentUser?.id) return;

    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(profileData);
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    }
  };

  const checkEligibility = async () => {
    if (!currentUser?.id) return;

    try {
      const { data, error } = await supabase.rpc('check_showing_eligibility', {
        user_uuid: currentUser.id
      });

      if (error) {
        console.error('Error checking eligibility:', error);
        return;
      }

      setEligibility(data);
    } catch (error) {
      console.error('Error in checkEligibility:', error);
    }
  };

  // Enhanced agreement signing with immediate UI update
  const handleAgreementSignWithModal = async (signerName: string) => {
    if (!selectedShowing || !currentUser?.id) return;

    try {
      const { error } = await supabase
        .from('tour_agreements')
        .upsert({
          showing_request_id: selectedShowing.id,
          buyer_id: currentUser.id,
          agent_id: selectedShowing.assigned_agent_id,
          signed: true,
          signed_at: new Date().toISOString(),
          agreement_type: 'single_tour'
        });

      if (error) throw error;

      // Update the showing status to confirmed
      const { error: statusError } = await supabase
        .from('showing_requests')
        .update({ status: 'confirmed' })
        .eq('id', selectedShowing.id);

      if (statusError) {
        console.error('Error updating showing status:', statusError);
      }

      // Immediately update local state
      setAgreements(prev => ({
        ...prev,
        [selectedShowing.id]: true
      }));

      // Update the showing in local state
      const updateShowingStatus = (showings: ShowingRequest[]) =>
        showings.map(showing =>
          showing.id === selectedShowing.id
            ? { ...showing, status: 'confirmed' }
            : showing
        );

      setActiveShowings(prev => updateShowingStatus(prev));
      setPendingRequests(prev => updateShowingStatus(prev));

      toast({
        title: "Agreement Signed",
        description: "Your tour agreement has been signed successfully. Your tour is now confirmed!",
      });

      setShowAgreementModal(false);
      setSelectedShowing(null);

    } catch (error) {
      console.error('Error signing agreement:', error);
      toast({
        title: "Error",
        description: "Failed to sign agreement. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSignAgreementFromCard = (showingId: string, displayName: string) => {
    const showing = [...pendingRequests, ...activeShowings].find(s => s.id === showingId);
    if (showing) {
      setSelectedShowing(showing);
      setShowAgreementModal(true);
    }
  };

  const handleRequestShowing = () => {
    setShowPropertyForm(true);
  };

  const handleUpgradeClick = () => {
    setShowSubscribeModal(true);
  };

  const handleSubscriptionComplete = () => {
    setShowSubscribeModal(false);
    checkEligibility();
    fetchShowingRequests();
  };

  const handleConfirmShowingWithModal = (showing: ShowingRequest) => {
    setSelectedShowing(showing);
    setShowAgreementModal(true);
  };

  const handleSendMessage = (showingId: string) => {
    // Implementation for sending messages
    console.log('Send message for showing:', showingId);
  };

  const handleStatClick = (targetTab: string) => {
    setActiveTab(targetTab);
  };

  const handleCancelShowing = (showingId: string) => {
    // Implementation for cancelling showings
    console.log('Cancel showing:', showingId);
  };

  const handleRescheduleShowing = (showingId: string) => {
    // Implementation for rescheduling showings
    console.log('Reschedule showing:', showingId);
  };

  const isSubscribed = eligibility?.eligible && eligibility?.reason === 'subscribed';
  const subscriptionTier = eligibility?.subscription_tier || 'none';

  return {
    // State
    showPropertyForm,
    setShowPropertyForm,
    showAgreementModal,
    setShowAgreementModal,
    showSubscribeModal,
    setShowSubscribeModal,
    activeTab,
    setActiveTab,
    
    profile,
    selectedShowing,
    agreements,
    loading,
    authLoading,
    user,
    session,
    currentUser,
    pendingRequests,
    activeShowings,
    completedShowings,
    eligibility,
    isSubscribed,
    subscriptionTier,
    unreadCount,
    
    // Handlers
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
    fetchShowingRequests
  };
};
