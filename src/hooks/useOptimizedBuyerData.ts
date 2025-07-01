
import { useState, useEffect, useCallback, useMemo } from "react";
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

interface ShowingCounts {
  pending: number;
  active: number;
  completed: number;
}

export const useOptimizedBuyerData = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showingCounts, setShowingCounts] = useState<ShowingCounts>({ pending: 0, active: 0, completed: 0 });
  const [showingRequests, setShowingRequests] = useState<ShowingRequest[]>([]);
  const [agreements, setAgreements] = useState<Record<string, boolean>>({});
  const [loadingStates, setLoadingStates] = useState({
    profile: true,
    counts: true,
    details: true,
    agreements: true
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  const { toast } = useToast();
  const { user, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const currentUser = user || session?.user;

  // Memoized categorized requests
  const categorizedRequests = useMemo(() => {
    const pendingRequests = showingRequests.filter(req => 
      ['pending', 'submitted', 'under_review', 'agent_assigned', 'awaiting_agreement'].includes(req.status)
    );
    
    const activeShowings = showingRequests.filter(req => 
      ['confirmed', 'agent_confirmed', 'scheduled'].includes(req.status)
    );
    
    const completedShowings = showingRequests
      .filter(req => ['completed', 'cancelled'].includes(req.status))
      .sort((a, b) => {
        if (a.status !== b.status) {
          if (a.status === 'completed' && b.status === 'cancelled') return -1;
          if (a.status === 'cancelled' && b.status === 'completed') return 1;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

    return { pendingRequests, activeShowings, completedShowings };
  }, [showingRequests]);

  // Step 1: Load profile immediately (critical data)
  const fetchProfile = useCallback(async () => {
    if (!currentUser) return;

    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile error:', profileError);
      } else {
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, profile: false }));
    }
  }, [currentUser]);

  // Step 2: Load showing counts (lightweight query)
  const fetchShowingCounts = useCallback(async () => {
    if (!currentUser) return;

    try {
      const { data: requestsData, error: requestsError } = await supabase
        .from('showing_requests')
        .select('status')
        .eq('user_id', currentUser.id);

      if (requestsError) {
        console.error('Counts error:', requestsError);
        return;
      }

      const counts = (requestsData || []).reduce((acc, req) => {
        if (['pending', 'submitted', 'under_review', 'agent_assigned', 'awaiting_agreement'].includes(req.status)) {
          acc.pending++;
        } else if (['confirmed', 'agent_confirmed', 'scheduled'].includes(req.status)) {
          acc.active++;
        } else if (['completed', 'cancelled'].includes(req.status)) {
          acc.completed++;
        }
        return acc;
      }, { pending: 0, active: 0, completed: 0 });

      setShowingCounts(counts);
    } catch (error) {
      console.error('Error fetching showing counts:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, counts: false }));
    }
  }, [currentUser]);

  // Step 3: Load detailed showing data (deferred)
  const fetchShowingDetails = useCallback(async () => {
    if (!currentUser) return;

    try {
      const { data: requestsData, error: requestsError } = await supabase
        .from('showing_requests')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (requestsError) {
        console.error('Details error:', requestsError);
        toast({
          title: "Error",
          description: "Failed to load showing details.",
          variant: "destructive"
        });
        setShowingRequests([]);
      } else {
        setShowingRequests(requestsData || []);
      }
    } catch (error) {
      console.error('Error fetching showing details:', error);
      setShowingRequests([]);
    } finally {
      setLoadingStates(prev => ({ ...prev, details: false }));
    }
  }, [currentUser, toast]);

  // Step 4: Load agreements (least critical)
  const fetchAgreements = useCallback(async () => {
    if (!currentUser) return;

    try {
      const { data: agreementsData, error: agreementsError } = await supabase
        .from('tour_agreements')
        .select('showing_request_id, signed')
        .eq('buyer_id', currentUser.id);

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
      console.error('Error fetching agreements:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, agreements: false }));
    }
  }, [currentUser]);

  // Progressive loading sequence
  useEffect(() => {
    if (authLoading) return;
    
    if (!user && !session) {
      setLoadingStates({ profile: false, counts: false, details: false, agreements: false });
      navigate('/');
      return;
    }

    // Step 1: Load profile immediately
    fetchProfile();
    
    // Step 2: Load counts after a short delay
    setTimeout(() => {
      fetchShowingCounts();
    }, 100);
    
    // Step 3: Load details after counts
    setTimeout(() => {
      fetchShowingDetails();
    }, 300);
    
    // Step 4: Load agreements last
    setTimeout(() => {
      fetchAgreements();
    }, 500);

    setIsInitialLoad(false);
  }, [user, session, authLoading, navigate, fetchProfile, fetchShowingCounts, fetchShowingDetails, fetchAgreements]);

  // Refresh function for updates
  const refreshShowingRequests = useCallback(async () => {
    await fetchShowingDetails();
    await fetchShowingCounts();
  }, [fetchShowingDetails, fetchShowingCounts]);

  const isLoading = loadingStates.profile || loadingStates.counts;
  const isDetailLoading = loadingStates.details;

  return {
    profile,
    showingCounts,
    agreements,
    loading: isLoading,
    detailLoading: isDetailLoading,
    authLoading,
    currentUser,
    isInitialLoad,
    refreshShowingRequests,
    ...categorizedRequests
  };
};
