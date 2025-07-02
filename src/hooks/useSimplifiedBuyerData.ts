
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

export const useSimplifiedBuyerData = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showingRequests, setShowingRequests] = useState<ShowingRequest[]>([]);
  const [agreements, setAgreements] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  // Single, focused data fetch function
  const fetchData = useCallback(async () => {
    if (!user || authLoading) {
      setLoading(false);
      return;
    }

    console.log('SimplifiedBuyerData: Fetching data for user:', user.id);
    setError(null);

    try {
      // Fetch all data in a single Promise.all for better performance
      const [profileResponse, showingsResponse, agreementsResponse] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle(),
        
        supabase
          .from('showing_requests')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        
        supabase
          .from('tour_agreements')
          .select('showing_request_id, signed')
          .eq('buyer_id', user.id)
      ]);

      // Handle profile
      if (profileResponse.error && profileResponse.error.code !== 'PGRST116') {
        console.error('Profile fetch error:', profileResponse.error);
        throw new Error('Failed to load profile');
      }
      setProfile(profileResponse.data);

      // Handle showings
      if (showingsResponse.error) {
        console.error('Showings fetch error:', showingsResponse.error);
        throw new Error('Failed to load showing requests');
      }
      setShowingRequests(showingsResponse.data || []);

      // Handle agreements
      if (agreementsResponse.error) {
        console.error('Agreements fetch error:', agreementsResponse.error);
        // Don't throw for agreements - it's not critical
      } else {
        const agreementsMap = (agreementsResponse.data || []).reduce((acc, agreement) => {
          acc[agreement.showing_request_id] = agreement.signed;
          return acc;
        }, {} as Record<string, boolean>);
        setAgreements(agreementsMap);
      }

      console.log('SimplifiedBuyerData: Data loaded successfully', {
        profileExists: !!profileResponse.data,
        showingsCount: showingsResponse.data?.length || 0,
        agreementsCount: Object.keys(agreements).length
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      console.error('SimplifiedBuyerData: Data fetch error:', err);
      setError(errorMessage);
      
      toast({
        title: "Error loading data",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, authLoading, toast]);

  // Refresh function for after form submissions
  const refreshData = useCallback(async () => {
    console.log('SimplifiedBuyerData: Refreshing data...');
    setLoading(true);
    await fetchData();
  }, [fetchData]);

  // Initial data load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Set up real-time subscription for showing_requests
  useEffect(() => {
    if (!user) return;

    console.log('SimplifiedBuyerData: Setting up real-time subscription for user:', user.id);
    
    const channel = supabase
      .channel('showing_requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'showing_requests',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('SimplifiedBuyerData: Real-time showing_requests change:', payload);
          // Refresh data when showing_requests change
          refreshData();
        }
      )
      .subscribe();

    return () => {
      console.log('SimplifiedBuyerData: Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [user, refreshData]);

  // Categorize showing requests
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

  return {
    // Data
    profile,
    showingRequests,
    agreements,
    pendingRequests,
    activeShowings,
    completedShowings,
    
    // State
    loading,
    error,
    authLoading,
    currentUser: user,
    
    // Actions
    refreshData
  };
};
